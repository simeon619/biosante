import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { httpsmsService } from '#services/httpsms_service'

export interface PaymentSubmission {
    orderId: string
    provider: 'wave' | 'orange' | 'mtn' | 'moov'
    reference: string
    amount: number
}

export default class PaymentService {
    /**
     * Submit a payment for verification
     */
    async submitPayment(data: PaymentSubmission) {
        const { orderId, provider, reference, amount } = data

        // 1. Check if reference is unique
        const existing = await db.from('payments').where('reference', reference).first()
        if (existing) {
            throw new Error('Cette référence a déjà été utilisée.')
        }

        // 2. Format validation (basic regex for demo, can be refined)
        const isFormatValid = this.validateReferenceFormat(provider, reference)

        // 3. Check if order exists and get expected amount
        const order = await db.from('orders').where('id', orderId).first()
        if (!order) {
            throw new Error('Commande non trouvée.')
        }

        const amountMatches = Number(order.total) === Number(amount)

        // 4. Recency check (Order created within last 24h, and submission within 30m of payment? 
        // Manual entry means we don't know the exact payment time, but we can check order age)
        const orderAgeMinutes = DateTime.now().diff(DateTime.fromJSDate(order.created_at), 'minutes').minutes
        const isRecent = orderAgeMinutes < 1440 // Order must be less than 24h old

        const trustScore = this.calculateTrustScore({
            isFormatValid,
            amountMatches,
            isUnique: !existing,
            orderAgeMinutes,
            isRecent
        })

        // 6. Record or Update payment
        const existingPayment = await db.from('payments').where('order_id', orderId).first()
        let paymentId

        if (existingPayment) {
            await db.from('payments')
                .where('id', existingPayment.id)
                .update({
                    provider,
                    reference,
                    amount: amount,
                    amount_expected: order.total,
                    status: 'pending',
                    trust_score: trustScore,
                    updated_at: new Date()
                })
            paymentId = existingPayment.id
        } else {
            const [inserted] = await db.table('payments').insert({
                order_id: orderId,
                provider,
                reference,
                amount: amount,
                amount_expected: order.total,
                currency: 'XOF',
                status: 'pending',
                trust_score: trustScore,
                created_at: new Date(),
                updated_at: new Date()
            }).returning('id')
            paymentId = inserted.id
        }

        // 7. Update order status to 'verifying'
        await db.from('orders').where('id', orderId).update({
            manual_payment_status: 'verifying',
            updated_at: new Date()
        })

        return { paymentId, trustScore }
    }

    private validateReferenceFormat(provider: string, reference: string): boolean {
        const ref = reference.trim().toUpperCase()
        switch (provider) {
            case 'wave':
                // Wave references are usually like W-ABC123XYZ or similar
                return ref.length >= 8
            case 'orange':
                // Orange often starts with CI or just numbers
                return /^[A-Z0-9]{8,20}$/.test(ref)
            case 'mtn':
                // MTN often long numeric or alphanumeric
                return ref.length >= 10
            case 'moov':
                // Moov specific formats
                return ref.length >= 8
            default:
                return false
        }
    }

    private calculateTrustScore(criteria: {
        isFormatValid: boolean
        amountMatches: boolean
        isUnique: boolean
        orderAgeMinutes: number
        isRecent: boolean
    }): number {
        let score = 0
        if (criteria.isUnique) score += 40
        if (criteria.isFormatValid) score += 30
        if (criteria.amountMatches) score += 20
        if (criteria.orderAgeMinutes < 60) score += 10 // Bonus for fast payment after order

        if (!criteria.isRecent) {
            score = Math.max(0, score - 50) // Severe penalty for old orders
        }

        return Math.min(score, 100)
    }

    /**
     * Admin validation
     */
    async confirmPayment(paymentId: number, adminId: number, status: 'confirmed' | 'rejected', reason?: string) {
        const payment = await db.from('payments').where('id', paymentId).first()
        if (!payment) throw new Error('Paiement non trouvé')

        // Get order for customer phone and details
        const order = await db.from('orders').where('id', payment.order_id).first()

        await db.from('payments').where('id', paymentId).update({
            status,
            validated_by: adminId,
            rejection_reason: reason,
            updated_at: new Date()
        })

        if (status === 'confirmed') {
            await db.from('orders').where('id', payment.order_id).update({
                status: 'paid',
                manual_payment_status: 'success',
                updated_at: new Date()
            })
            // Update associated delivery if exists
            await db.from('deliveries').where('order_id', payment.order_id).update({
                status: 'paid',
                updated_at: new Date()
            })

            // Send SMS confirmation to customer
            if (order?.customer_phone) {
                const smsContent = `BIO SANTÉ: Votre paiement de ${order.total.toLocaleString('fr-FR')} FCFA a été confirmé! Commande #${order.transaction_ref || order.id.slice(0, 8)} en préparation. Livraison prochaine. Merci!`
                try {
                    await httpsmsService.sendSms(order.customer_phone, smsContent)
                    console.log(`[SMS] Payment confirmed notification sent to ${order.customer_phone}`)
                } catch (smsError) {
                    console.error('[SMS] Failed to send confirmation SMS:', smsError)
                }
            }
        } else {
            await db.from('orders').where('id', payment.order_id).update({
                manual_payment_status: 'failed',
                updated_at: new Date()
            })

            // Send SMS rejection to customer
            if (order?.customer_phone) {
                const reasonText = reason ? ` Raison: ${reason}` : ''
                const smsContent = `BIO SANTÉ: Votre paiement pour la commande #${order.transaction_ref || order.id.slice(0, 8)} n'a pas pu être vérifié.${reasonText} Veuillez nous contacter ou réessayer.`
                try {
                    await httpsmsService.sendSms(order.customer_phone, smsContent)
                    console.log(`[SMS] Payment rejected notification sent to ${order.customer_phone}`)
                } catch (smsError) {
                    console.error('[SMS] Failed to send rejection SMS:', smsError)
                }
            }
        }

        return true
    }
}
