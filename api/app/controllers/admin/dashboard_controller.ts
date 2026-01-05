import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { notificationService } from '#services/notification_service'

export default class AdminDashboardController {
    /**
     * Get dashboard overview stats
     */
    async overview({ response }: HttpContext) {
        // Orders stats
        const ordersToday = await db.from('orders')
            .whereRaw("created_at >= CURRENT_DATE")
            .count('* as count')
            .first()

        const ordersPending = await db.from('orders')
            .where('status', 'pending')
            .count('* as count')
            .first()

        const ordersTotal = await db.from('orders')
            .count('* as count')
            .first()

        // Revenue stats
        const revenueToday = await db.from('orders')
            .whereRaw("created_at >= CURRENT_DATE")
            .whereIn('status', ['paid', 'delivered', 'completed'])
            .sum('total as total')
            .first()

        const revenueTotal = await db.from('orders')
            .whereIn('status', ['paid', 'delivered', 'completed'])
            .sum('total as total')
            .first()

        // Notification stats
        const notificationStats = await notificationService.getStats()

        // Recent orders
        const recentOrders = await db.from('orders')
            .leftJoin('payments', 'orders.id', 'payments.order_id')
            .orderBy('orders.created_at', 'desc')
            .limit(5)
            .select(
                'orders.*',
                'payments.trust_score',
                'payments.provider',
                'payments.reference'
            )

        return response.ok({
            orders: {
                today: parseInt(ordersToday?.count || '0'),
                pending: parseInt(ordersPending?.count || '0'),
                total: parseInt(ordersTotal?.count || '0')
            },
            revenue: {
                today: parseInt(revenueToday?.total || '0'),
                total: parseInt(revenueTotal?.total || '0')
            },
            notifications: notificationStats,
            recentOrders
        })
    }

    /**
     * Get all orders with pagination
     */
    async orders({ request, response }: HttpContext) {
        const page = request.input('page', 1)
        const limit = request.input('limit', 20)
        const status = request.input('status')

        let query = db.from('orders').orderBy('created_at', 'desc')

        if (status) {
            query = query.where('status', status)
        }

        const orders = await query
            .offset((page - 1) * limit)
            .limit(limit)
            .select('*')

        const total = await db.from('orders')
            .where((q) => {
                if (status) q.where('status', status)
            })
            .count('* as count')
            .first()

        return response.ok({
            orders,
            pagination: {
                page,
                limit,
                total: parseInt(total?.count || '0'),
                pages: Math.ceil(parseInt(total?.count || '0') / limit)
            }
        })
    }

    /**
     * Get single order details
     */
    async orderDetails({ params, response }: HttpContext) {
        const id = params.id
        console.log(`[AdminDashboard] Attempting to find order: ${id}`)

        // Use standard ID check
        const order = await db.from('orders')
            .where('id', id)
            .first()


        if (!order) {
            console.warn(`[AdminDashboard] Order NOT found: ${id}`)
            // Diagnostic: what IDs DO we have?
            const sample = await db.from('orders').select('id', 'customer_name').limit(5).orderBy('created_at', 'desc')
            return response.notFound({
                error: 'Commande non trouvée',
                idQueried: id,
                sampleIds: sample.map(o => o.id),
                dbStats: { count: await db.from('orders').count('* as count').first().then(r => r?.count) }
            })
        }


        console.log(`[AdminDashboard] Order found: ${order.id}`)


        // Get payment info
        const payment = await db.from('payments')
            .where('order_id', order.id)
            .first()

        // Get delivery info
        const delivery = await db.from('deliveries')
            .where('order_id', order.id)
            .first()

        if (order.proof_image) {
            const StorageService = (await import('#services/storage_service')).default
            const storage = new StorageService()
            order.proof_image = await storage.getSignedReadUrl(order.proof_image)
        }

        return response.ok({
            order,
            payment,
            delivery
        })
    }

    /**
     * Update order status
     */
    async updateOrderStatus({ params, request, response }: HttpContext) {
        const { status } = request.only(['status'])

        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled']
        if (!validStatuses.includes(status)) {
            return response.badRequest({ error: 'Statut invalide' })
        }

        // Get order details for SMS
        const order = await db.from('orders').where('id', params.id).first()

        await db.from('orders')
            .where('id', params.id)
            .update({ status, updated_at: new Date() })

        // Send SMS to delivery person when order is shipped
        if (status === 'shipped' && order) {
            try {
                // Import httpSMS service
                const { httpsmsService } = await import('#services/httpsms_service')

                // Delivery person phone number - you can configure this in .env
                const deliveryPhone = process.env.DELIVERY_PHONE || '+2250759091098'

                // Parse items for display
                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
                const itemsList = items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')

                const smsContent = `🚚 NOUVELLE LIVRAISON\n` +
                    `Client: ${order.customer_name}\n` +
                    `Tel: ${order.customer_phone}\n` +
                    `Adresse: ${order.address_full}\n` +
                    `${order.address_note ? `Note: ${order.address_note}\n` : ''}` +
                    `Articles: ${itemsList}\n` +
                    `Total: ${order.total?.toLocaleString('fr-FR')} FCFA\n` +
                    `Paiement: ${order.payment_method === 'cash' ? 'Espèces' : 'Payé'}`

                await httpsmsService.sendSms(deliveryPhone, smsContent)
                console.log(`[SMS] Delivery notification sent to ${deliveryPhone} for order ${params.id}`)
            } catch (smsError) {
                console.error('[SMS] Failed to send delivery notification:', smsError)
            }
        }

        // Send notification for status change
        try {
            await notificationService.send({
                type: 'admin_alert',
                recipient: 'all_admins',
                idempotencyKey: `order_${params.id}_status_${status}_${Date.now()}`,
                payload: {
                    title: '📦 Statut Mis à Jour',
                    body: `Commande ${params.id} → ${status}`,
                    priority: 'normal',
                    data: { orderId: params.id, status }
                },
                entityType: 'order',
                entityId: params.id
            })
        } catch (error) {
            console.error('Failed to send status update notification:', error)
        }

        return response.ok({ success: true, status })
    }


    /**
     * Get recent notifications
     */
    async notifications({ response }: HttpContext) {
        const notifications = await db.from('notifications')
            .orderBy('created_at', 'desc')
            .limit(50)
            .select('*')

        // Parse payload for each notification
        const parsedNotifications = notifications.map(n => ({
            ...n,
            payload: typeof n.payload === 'string' ? JSON.parse(n.payload) : n.payload
        }))

        return response.ok(parsedNotifications)
    }

    /**
     * Get Dead Letter Queue notifications
     */
    async dlq({ response }: HttpContext) {
        const notifications = await notificationService.getDeadLetterQueue()
        return response.ok({ notifications })
    }

    /**
     * Retry notification from DLQ
     */
    async retryNotification({ params, response }: HttpContext) {
        try {
            await notificationService.retryFromDlq(params.id)
            return response.ok({ success: true })
        } catch (error: any) {
            return response.badRequest({ error: error.message })
        }
    }

    /**
     * Update manual payment status
     */
    async updateManualPaymentStatus({ params, request, response }: HttpContext) {
        const { status } = request.only(['status'])

        const validStatuses = ['pending', 'verifying', 'success', 'failed']
        if (!validStatuses.includes(status)) {
            return response.badRequest({ error: 'Statut invalide' })
        }

        const updateData: any = {
            manual_payment_status: status,
            updated_at: new Date()
        }

        // If manual payment is confirmed as success, also mark order as paid
        if (status === 'success') {
            updateData.status = 'paid'

            // Also update the payment record
            await db.from('payments')
                .where('order_id', params.id)
                .update({ status: 'success', updated_at: new Date() })
        }

        await db.from('orders')
            .where('id', params.id)
            .update(updateData)

        // Send notification for status change
        try {
            await notificationService.send({
                type: 'admin_alert',
                recipient: 'all_admins',
                idempotencyKey: `order_${params.id}_payment_${status}_${Date.now()}`,
                payload: {
                    title: status === 'success' ? '✅ Paiement Manuel Validé' : '💳 Statut Paiement Mis à Jour',
                    body: `Le paiement de la commande ${params.id} est passé à : ${status}`,
                    priority: 'normal',
                    data: { orderId: params.id, manualStatus: status }
                },
                entityType: 'order',
                entityId: params.id
            })
        } catch (error) {
            console.error('Failed to send payment status update notification:', error)
        }

        return response.ok({ success: true, status })
    }

    /**
     * Trigger a test notification for real-time verification
     */
    async testNotification({ response }: HttpContext) {
        try {
            const result = await notificationService.send({
                type: 'admin_alert',
                recipient: 'all_admins',
                idempotencyKey: `test_notif_${Date.now()}`,
                payload: {
                    title: '🔔 Notification de Test',
                    body: 'Ceci est une notification de test pour vérifier le système en temps réel.',
                    priority: 'high',
                    data: { test: true, timestamp: new Date().toISOString() }
                },
                entityType: 'test',
                entityId: 'test_123'
            })

            return response.ok(result)
        } catch (error: any) {
            return response.internalServerError({ error: error.message })
        }
    }
}
