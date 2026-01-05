import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Bull, { Queue, Job } from 'bull'
import Redis from 'ioredis'
import transmit from '@adonisjs/transmit/services/main'

/**
 * NotificationService - Enterprise-grade notification system
 * Implements the 7 pillars of notification reliability:
 * 1. Delivery Guarantee (at-least-once)
 * 2. Idempotence (anti-doublons)
 * 3. Retry Policy + Dead Letter Queue
 * 4. Asynchronous Processing
 * 5. Traceability (full logging)
 * 6. Rate Limiting
 * 7. Security (masked sensitive data)
 */

// Notification types
export type NotificationType = 'email' | 'sms' | 'push' | 'admin_alert'

export type NotificationStatus = 'pending' | 'queued' | 'processing' | 'sent' | 'delivered' | 'failed'

export interface NotificationPayload {
    subject?: string
    title?: string
    body: string
    data?: Record<string, any>
    // For emails
    html?: string
    // For admin alerts
    priority?: 'low' | 'normal' | 'high' | 'urgent'
}

export interface CreateNotificationOptions {
    type: NotificationType
    recipient: string
    payload: NotificationPayload
    idempotencyKey: string
    entityType?: string
    entityId?: string
    maxAttempts?: number
}

// Rate limiting config per notification type
const RATE_LIMITS: Record<NotificationType, { max: number; windowMs: number }> = {
    email: { max: 10, windowMs: 60000 }, // 10 per minute
    sms: { max: 5, windowMs: 60000 },    // 5 per minute
    push: { max: 20, windowMs: 60000 },  // 20 per minute
    admin_alert: { max: 50, windowMs: 60000 } // 50 per minute
}

class NotificationService {
    private queue: Queue | null = null
    private redis: any = null // Using any due to ioredis ESM/CJS compatibility
    private isInitialized = false

    /**
     * Initialize the notification service
     */
    async initialize() {
        if (this.isInitialized) return

        try {
            // Connect to Redis (handle ESM/CJS compatibility)
            const RedisClient = (Redis as any).default || Redis
            this.redis = new RedisClient({
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                maxRetriesPerRequest: 3
            })

            // Create Bull queue with retry options
            this.queue = new Bull('notifications', {
                redis: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379')
                },
                defaultJobOptions: {
                    removeOnComplete: 100, // Keep last 100 completed jobs
                    removeOnFail: false,   // Keep failed jobs for DLQ
                    attempts: 5,           // Max retry attempts
                    backoff: {
                        type: 'exponential',
                        delay: 1000         // 1s, 2s, 4s, 8s, 16s
                    }
                }
            })

            // Setup queue processor
            this.queue.process(async (job: Job) => {
                return this.processNotification(job)
            })

            // Queue events for logging
            this.queue.on('completed', (job) => {
                console.log(`[Notification] Job ${job.id} completed`)
            })

            this.queue.on('failed', (job, err) => {
                console.error(`[Notification] Job ${job?.id} failed:`, err.message)
                if (job && job.attemptsMade >= (job.opts.attempts || 5)) {
                    this.moveToDeadLetterQueue(job.data.notificationId)
                }
            })

            this.isInitialized = true
            console.log('[NotificationService] Initialized successfully')
        } catch (error) {
            console.error('[NotificationService] Failed to initialize:', error)
            throw error
        }
    }

    /**
     * Pillar 2: Idempotence - Check if notification already exists
     */
    private async checkIdempotency(idempotencyKey: string): Promise<boolean> {
        const existing = await db
            .from('notifications')
            .where('idempotency_key', idempotencyKey)
            .first()
        return !!existing
    }

    /**
     * Pillar 6: Rate Limiting - Check if rate limit exceeded
     */
    private async checkRateLimit(type: NotificationType, recipient: string): Promise<boolean> {
        if (!this.redis) return true

        const key = `ratelimit:${type}:${recipient}`
        const limit = RATE_LIMITS[type]

        const count = await this.redis.incr(key)
        if (count === 1) {
            await this.redis.pexpire(key, limit.windowMs)
        }

        return count <= limit.max
    }

    /**
     * Pillar 5: Traceability - Log notification event
     */
    private async logEvent(
        notificationId: string,
        event: string,
        details?: Record<string, any>,
        provider?: string,
        providerMessageId?: string
    ) {
        await db.table('notification_logs').insert({
            notification_id: notificationId,
            event,
            details: details ? JSON.stringify(details) : null,
            provider,
            provider_message_id: providerMessageId,
            created_at: DateTime.now().toSQL()
        })
    }

    /**
     * Pillar 7: Security - Mask sensitive data in logs
     */
    private maskSensitiveData(data: Record<string, any>): Record<string, any> {
        const masked = { ...data }
        const sensitiveKeys = ['password', 'token', 'secret', 'phone', 'email']

        for (const key of sensitiveKeys) {
            if (masked[key]) {
                masked[key] = '***MASKED***'
            }
        }

        return masked
    }

    /**
     * Create and queue a notification
     * Pillar 1: At-least-once delivery guarantee
     * Pillar 4: Asynchronous processing
     */
    async send(options: CreateNotificationOptions): Promise<{ success: boolean; notificationId?: string; error?: string }> {
        await this.initialize()

        // Pillar 2: Check idempotency
        const alreadyExists = await this.checkIdempotency(options.idempotencyKey)
        if (alreadyExists) {
            console.log(`[Notification] Duplicate detected: ${options.idempotencyKey}`)
            return { success: true, error: 'Duplicate notification - already processed' }
        }

        // Pillar 6: Check rate limit
        const withinLimit = await this.checkRateLimit(options.type, options.recipient)
        if (!withinLimit) {
            console.warn(`[Notification] Rate limit exceeded for ${options.recipient}`)
            return { success: false, error: 'Rate limit exceeded' }
        }

        // Create notification record
        const [notification] = await db.table('notifications').insert({
            idempotency_key: options.idempotencyKey,
            type: options.type,
            recipient: options.recipient,
            payload: JSON.stringify(options.payload),
            status: 'pending',
            attempts: 0,
            max_attempts: options.maxAttempts || 5,
            entity_type: options.entityType,
            entity_id: options.entityId,
            created_at: DateTime.now().toSQL(),
            updated_at: DateTime.now().toSQL()
        }).returning('id')

        const notificationId = notification.id

        // Log creation
        await this.logEvent(notificationId, 'created', this.maskSensitiveData(options.payload as any))

        // Pillar 4: Add to queue for async processing
        if (this.queue) {
            await this.queue.add({
                notificationId,
                type: options.type,
                recipient: options.recipient,
                payload: options.payload
            })

            // Update status to queued
            await db.from('notifications').where('id', notificationId).update({
                status: 'queued',
                updated_at: DateTime.now().toSQL()
            })

            await this.logEvent(notificationId, 'queued')
        }

        return { success: true, notificationId }
    }

    /**
     * Process notification from queue
     */
    private async processNotification(job: Job): Promise<void> {
        const { notificationId, type, recipient, payload } = job.data

        // Update status to processing
        await db.from('notifications').where('id', notificationId).update({
            status: 'processing',
            attempts: job.attemptsMade + 1,
            last_attempt_at: DateTime.now().toSQL(),
            updated_at: DateTime.now().toSQL()
        })

        await this.logEvent(notificationId, 'processing', { attempt: job.attemptsMade + 1 })

        try {
            // Route to appropriate sender
            let result: { success: boolean; providerId?: string }

            switch (type) {
                case 'email':
                    result = await this.sendEmail(recipient, payload)
                    break
                case 'sms':
                    result = await this.sendSms(recipient, payload)
                    break
                case 'admin_alert':
                    result = await this.sendAdminAlert(recipient, payload)
                    break
                default:
                    result = { success: false }
            }

            if (result.success) {
                await db.from('notifications').where('id', notificationId).update({
                    status: 'sent',
                    sent_at: DateTime.now().toSQL(),
                    updated_at: DateTime.now().toSQL()
                })

                await this.logEvent(notificationId, 'sent', undefined, type, result.providerId)
            } else {
                throw new Error('Send failed')
            }
        } catch (error: any) {
            // Update with error
            await db.from('notifications').where('id', notificationId).update({
                last_error: error.message,
                updated_at: DateTime.now().toSQL()
            })

            await this.logEvent(notificationId, 'failed', { error: error.message })

            // Re-throw to trigger Bull retry
            throw error
        }
    }

    /**
     * Pillar 3: Move to Dead Letter Queue after max retries
     */
    private async moveToDeadLetterQueue(notificationId: string) {
        await db.from('notifications').where('id', notificationId).update({
            status: 'failed',
            in_dlq: true,
            updated_at: DateTime.now().toSQL()
        })

        await this.logEvent(notificationId, 'moved_to_dlq')
        console.error(`[Notification] ${notificationId} moved to Dead Letter Queue`)
    }

    /**
     * Send email notification
     */
    private async sendEmail(recipient: string, payload: NotificationPayload): Promise<{ success: boolean; providerId?: string }> {
        // TODO: Integrate with email provider (SendGrid, Nodemailer, etc.)
        console.log(`[Email] Sending to ${recipient}: ${payload.subject}`)

        // Simulate sending for now
        return { success: true, providerId: `email_${Date.now()}` }
    }

    /**
     * Send SMS notification
     */
    private async sendSms(recipient: string, payload: NotificationPayload): Promise<{ success: boolean; providerId?: string }> {
        // TODO: Integrate with SMS provider (Twilio, etc.)
        console.log(`[SMS] Sending to ${recipient}: ${payload.body}`)

        // Simulate sending for now
        return { success: true, providerId: `sms_${Date.now()}` }
    }

    /**
     * Send admin alert (for real-time dashboard)
     */
    private async sendAdminAlert(recipient: string, payload: NotificationPayload): Promise<{ success: boolean; providerId?: string }> {
        // Broadacst via Transmit (SSE)
        console.log(`[Admin Alert] ${payload.title}: ${payload.body}`)

        transmit.broadcast('admin_alerts', {
            recipient,
            ...payload,
            timestamp: DateTime.now().toISO()
        })

        return { success: true, providerId: `admin_${Date.now()}` }
    }

    /**
     * Convenience method: Send order notification
     */
    async notifyNewOrder(orderId: string, customerName: string, total: number) {
        return this.send({
            type: 'admin_alert',
            recipient: 'all_admins',
            idempotencyKey: `order_${orderId}_created`,
            payload: {
                title: '🛒 Nouvelle Commande',
                body: `${customerName} vient de passer une commande de ${total.toLocaleString()} FCFA`,
                priority: 'high',
                data: { orderId, total }
            },
            entityType: 'order',
            entityId: orderId
        })
    }

    /**
     * Convenience method: Send payment confirmation
     */
    async notifyPaymentReceived(orderId: string, amount: number, method: string) {
        return this.send({
            type: 'admin_alert',
            recipient: 'all_admins',
            idempotencyKey: `order_${orderId}_paid`,
            payload: {
                title: '✅ Paiement Reçu',
                body: `Paiement de ${amount.toLocaleString()} FCFA reçu via ${method}`,
                priority: 'high',
                data: { orderId, amount, method }
            },
            entityType: 'order',
            entityId: orderId
        })
    }

    /**
     * Get DLQ notifications for admin review
     */
    async getDeadLetterQueue() {
        return db.from('notifications')
            .where('in_dlq', true)
            .orderBy('created_at', 'desc')
            .limit(50)
    }

    /**
     * Retry a failed notification from DLQ
     */
    async retryFromDlq(notificationId: string) {
        const notification = await db.from('notifications').where('id', notificationId).first()

        if (!notification) {
            throw new Error('Notification not found')
        }

        // Reset for retry
        await db.from('notifications').where('id', notificationId).update({
            status: 'pending',
            in_dlq: false,
            attempts: 0,
            last_error: null,
            updated_at: DateTime.now().toSQL()
        })

        // Re-queue
        if (this.queue) {
            await this.queue.add({
                notificationId,
                type: notification.type,
                recipient: notification.recipient,
                payload: JSON.parse(notification.payload)
            })
        }

        await this.logEvent(notificationId, 'retried_from_dlq')
    }

    /**
     * Get notification statistics
     */
    async getStats() {
        const stats = await db.from('notifications')
            .select('status')
            .count('* as count')
            .groupBy('status')

        const byType = await db.from('notifications')
            .select('type')
            .count('* as count')
            .groupBy('type')

        const dlqCount = await db.from('notifications')
            .where('in_dlq', true)
            .count('* as count')
            .first()

        return {
            byStatus: stats.reduce((acc, row) => {
                acc[row.status] = parseInt(row.count)
                return acc
            }, {} as Record<string, number>),
            byType: byType.reduce((acc, row) => {
                acc[row.type] = parseInt(row.count)
                return acc
            }, {} as Record<string, number>),
            dlqCount: parseInt(dlqCount?.count || '0')
        }
    }
}

// Export singleton instance
export const notificationService = new NotificationService()
