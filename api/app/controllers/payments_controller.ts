import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { notificationService } from '#services/notification_service'
import StorageService from '#services/storage_service'
import PaymentService from '#services/payment_service'
import { httpsmsService } from '#services/httpsms_service'
import FacebookCapiService from '#services/facebook_capi_service'

export default class PaymentsController {
    private storage: StorageService
    private paymentService: PaymentService

    constructor() {
        this.storage = new StorageService()
        this.paymentService = new PaymentService()
    }

    /**
     * POST /api/payments/initiate
     */
    async initiate({ request, response }: HttpContext) {
        const { cart, customer, delivery, paymentMethod = 'manual', deliveryMode = 'local' } = request.all()

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return response.badRequest({ message: 'Le panier est vide' })
        }

        if (!customer?.name || !customer?.phone) {
            return response.badRequest({ message: 'Les informations client sont requises' })
        }

        if (!delivery?.address || delivery?.lat === undefined || delivery?.lon === undefined) {
            return response.badRequest({ message: 'Les informations de livraison sont requises' })
        }

        const subtotal = cart.reduce((sum: number, item: any) => {
            return sum + (Number(item.price) * Number(item.quantity))
        }, 0)

        const deliveryFee = Number(delivery.fee) || 0
        const totalItems = cart.reduce((acc: number, item: any) => acc + Number(item.quantity), 0)

        const isEligibleForOffer = totalItems >= 2
        const discountAmount = isEligibleForOffer ? Math.round(subtotal * 0.05) : 0
        const finalDeliveryFee = isEligibleForOffer ? 0 : deliveryFee
        const total = subtotal + finalDeliveryFee - discountAmount

        const customerEmail = customer.email || `${customer.phone.replace(/\+/g, '')}@client.local`
        const userId = request.header('X-User-Id')

        try {
            const orderId = crypto.randomUUID()
            const isManualPayment = paymentMethod === 'manual'
            const initialStatus = isManualPayment ? 'pending' : 'pending' // Default to pending for all now

            await db.table('orders')
                .insert({
                    id: orderId,
                    user_id: userId || null,
                    customer_name: customer.name,
                    customer_phone: customer.phone,
                    customer_email: customerEmail,
                    address_full: delivery.address,
                    lat: delivery.lat,
                    lon: delivery.lon,
                    address_note: delivery.addressNote || null,
                    items: JSON.stringify(cart),
                    subtotal: subtotal,
                    delivery_fee: finalDeliveryFee,
                    discount: discountAmount,
                    total: total,
                    status: initialStatus,
                    delivery_mode: deliveryMode,
                    payment_method: paymentMethod,
                    created_at: new Date(),
                    updated_at: new Date()
                })

            await db.table('deliveries')
                .insert({
                    order_id: orderId,
                    address_full: delivery.address,
                    location: db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)`, [delivery.lon, delivery.lat]),
                    delivery_fee: finalDeliveryFee,
                    status: initialStatus,
                    customer_name: customer.name,
                    customer_phone: customer.phone,
                    updated_at: new Date()
                })

            // Meta CAPI: Track Purchase
            const ip = request.ip()
            const userAgent = request.header('user-agent') || ''
            FacebookCapiService.sendEvent('Purchase',
                { ip, userAgent, phone: customer.phone, email: customer.email },
                { value: total, currency: 'XOF', content_ids: cart.map((i: any) => i.id), content_type: 'product' },
                request.header('referer') || '',
                orderId
            ).catch(e => console.error('[FB-CAPI] Error:', e))

            await notificationService.notifyNewOrder(orderId, customer.name, total)

            // Wave payment - Send link via SMS
            if (paymentMethod === 'wave') {
                const transactionRef = `WAVE-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`
                const wavePaymentLink = `https://pay.wave.com/m/M_ci_m4MFE02NW-Wi/c/ci/?amount=${Math.round(total)}`

                await db.from('orders')
                    .where('id', orderId)
                    .update({
                        transaction_ref: transactionRef,
                        manual_payment_status: 'pending'
                    })

                await db.table('payments')
                    .insert({
                        order_id: orderId,
                        paytech_token: `WAVE-${orderId.slice(0, 8)}`,
                        amount: total,
                        currency: 'XOF',
                        status: 'pending',
                        payment_method: 'wave',
                        created_at: new Date(),
                        updated_at: new Date()
                    })

                // Send SMS with Wave payment link (with pre-filled amount) + payment page for screenshot
                const paymentPageUrl = `https://sante-vitalite.com/payment/${orderId}`
                const smsContent = `BIO SANTÉ 🌿\n\nCommande #${transactionRef}\nMontant: ${total.toLocaleString('fr-FR')} FCFA\n\n👉 Cliquez pour payer:\n${wavePaymentLink}\n\n📸 Après paiement, envoyez la capture ici:\n${paymentPageUrl}`
                try {
                    await httpsmsService.sendSms(customer.phone, smsContent)
                    console.log(`[SMS] Wave payment link sent to ${customer.phone}`)
                } catch (smsError) {
                    console.error('[SMS] Failed to send Wave payment link:', smsError)
                }

                return response.created({
                    orderId: orderId,
                    total: total,
                    transactionRef: transactionRef,
                    wavePaymentLink: wavePaymentLink,
                    message: 'Commande créée. Lien Wave envoyé par SMS!'
                })
            }

            if (isManualPayment) {
                const transactionRef = `MED-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`

                await db.from('orders')
                    .where('id', orderId)
                    .update({
                        transaction_ref: transactionRef,
                        manual_payment_status: 'pending'
                    })

                await db.table('payments')
                    .insert({
                        order_id: orderId,
                        paytech_token: `MANUAL-${orderId.slice(0, 8)}`,
                        amount: total,
                        currency: 'XOF',
                        status: 'pending',
                        payment_method: 'manual_transfer',
                        created_at: new Date(),
                        updated_at: new Date()
                    })

                // Send SMS confirmation to customer
                const smsContent = `BIO SANTÉ: Votre commande #${transactionRef} de ${total.toLocaleString('fr-FR')} FCFA a été enregistrée. Effectuez le paiement via Wave/Orange Money et envoyez la capture d'écran sur le site. Merci!`
                try {
                    await httpsmsService.sendSms(customer.phone, smsContent)
                    console.log(`[SMS] Order confirmation sent to ${customer.phone}`)
                } catch (smsError) {
                    console.error('[SMS] Failed to send order confirmation:', smsError)
                }

                return response.created({
                    orderId: orderId,
                    total: total,
                    transactionRef: transactionRef,
                    message: 'Commande créée avec succès (Transfert Manuel)'
                })
            }

            return response.created({
                orderId: orderId,
                total: total,
                message: 'Commande créée avec succès (Paiement à la livraison)'
            })

        } catch (error: any) {
            console.error('Initiation error:', error)
            return response.internalServerError({
                message: error.message || 'Erreur lors de l\'initialisation du paiement'
            })
        }
    }

    /**
     * GET /api/payments/verify/:paymentId
     */
    async verify({ params, request, response }: HttpContext) {
        const { paymentId } = params
        const { orderId } = request.qs()

        if (!paymentId && !orderId) {
            return response.badRequest({ message: 'Payment ID ou Order ID requis' })
        }

        try {
            let orderQueryResult

            if (orderId) {
                orderQueryResult = await db.from('orders')
                    .select('id', 'customer_name', 'total', 'status', 'manual_payment_status', 'transaction_ref', 'proof_image', 'items', 'payment_method')
                    .where('id', orderId)
                    .first()
            } else {
                const payment = await db.from('payments').where('paytech_token', paymentId).first()
                if (payment) {
                    orderQueryResult = await db.from('orders')
                        .select('id', 'customer_name', 'total', 'status', 'manual_payment_status', 'transaction_ref', 'proof_image', 'items', 'payment_method')
                        .where('id', payment.order_id)
                        .first()
                }
            }

            if (!orderQueryResult) {
                return response.notFound({ message: 'Commande non trouvée' })
            }

            if (orderQueryResult.proof_image) {
                orderQueryResult.proof_image = await this.storage.getSignedReadUrl(orderQueryResult.proof_image)
            }

            return response.ok({
                status: orderQueryResult.status === 'paid' ? 'success' : (orderQueryResult.status === 'cancelled' ? 'failed' : 'pending'),
                manualStatus: orderQueryResult.manual_payment_status,
                transactionRef: orderQueryResult.transaction_ref,
                proofImage: orderQueryResult.proof_image,
                order: {
                    id: orderQueryResult.id,
                    customerName: orderQueryResult.customer_name,
                    total: orderQueryResult.total,
                    status: orderQueryResult.status,
                    payment_method: orderQueryResult.payment_method,
                    items: typeof orderQueryResult.items === 'string' ? JSON.parse(orderQueryResult.items) : orderQueryResult.items
                }
            })

        } catch (error: any) {
            console.error('Payment verification error:', error)
            return response.internalServerError({
                message: error.message || 'Erreur lors de la vérification du paiement'
            })
        }
    }

    /**
     * POST /api/payments/proof
     */
    async submitProof({ request, response }: HttpContext) {
        const orderId = request.input('orderId')
        const image = request.file('image', {
            size: '5mb',
            extnames: ['jpg', 'png', 'jpeg', 'webp'],
        })

        if (!orderId) {
            return response.badRequest({ message: 'Order ID requis' })
        }

        if (!image) {
            return response.badRequest({ message: 'Image requise' })
        }

        if (!image.isValid) {
            return response.badRequest({ message: 'Image invalide', errors: image.errors })
        }

        try {
            const order = await db.from('orders').where('id', orderId).first()
            if (!order) {
                return response.notFound({ message: 'Commande non trouvée' })
            }

            const fileBuffer = await fs.readFile(image.tmpPath!)
            const fileName = `proofs/${orderId}-${Date.now()}.${image.extname}`
            const contentType = image.headers['content-type'] || `image/${image.extname}`

            await this.storage.upload(fileName, fileBuffer, contentType)

            await db.from('orders')
                .where('id', orderId)
                .update({
                    proof_image: fileName, // Store only the KEY
                    manual_payment_status: 'verifying',
                    updated_at: new Date()
                })

            const signedUrl = await this.storage.getSignedReadUrl(fileName)

            // Send SMS confirmation for proof submission
            if (order.customer_phone) {
                const smsContent = `BIO SANTÉ: Votre preuve de paiement pour la commande #${order.transaction_ref || orderId.slice(0, 8)} a bien été reçue. Notre équipe vérifie votre paiement. Vous serez notifié par SMS dès confirmation.`
                try {
                    await httpsmsService.sendSms(order.customer_phone, smsContent)
                    console.log(`[SMS] Proof confirmation sent to ${order.customer_phone}`)
                } catch (smsError) {
                    console.error('[SMS] Failed to send proof confirmation:', smsError)
                }
            }

            return response.ok({
                message: 'Preuve soumise avec succès',
                proofImage: signedUrl
            })

        } catch (error: any) {
            console.error('[PaymentsController] Proof submission error:', {
                message: error.message,
                stack: error.stack,
                orderId
            })
            return response.internalServerError({
                message: 'Erreur lors de l\'enregistrement de la preuve.',
                details: error.message
            })
        }
    }

    /**
     * POST /api/payments/submit-reference
     */
    async submitReference({ request, response }: HttpContext) {
        const { orderId, provider, reference, amount } = request.all()

        if (!orderId || !provider || !reference) {
            return response.badRequest({ message: 'OrderId, Provider et Reference sont requis' })
        }

        try {
            const result = await this.paymentService.submitPayment({
                orderId,
                provider,
                reference,
                amount: Number(amount)
            })

            return response.ok({
                message: 'Référence soumise avec succès. En attente de validation.',
                ...result
            })
        } catch (error: any) {
            return response.badRequest({ message: error.message })
        }
    }

    /**
     * GET /api/admin/payments
     */
    async listPayments({ response }: HttpContext) {
        try {
            const payments = await db.from('payments')
                .join('orders', 'payments.order_id', 'orders.id')
                .select(
                    'payments.*',
                    'orders.customer_name',
                    'orders.total as order_total',
                    'orders.created_at as order_date'
                )
                .orderBy('payments.created_at', 'desc')

            return response.ok(payments)
        } catch (error: any) {
            return response.internalServerError({ message: error.message })
        }
    }

    /**
     * POST /api/admin/payments/:id/confirm
     */
    async adminConfirm({ params, request, response }: HttpContext) {
        const { id } = params
        const { status, reason } = request.all()
        const adminId = request.header('X-Admin-Id')

        if (!['confirmed', 'rejected'].includes(status)) {
            return response.badRequest({ message: 'Statut invalide' })
        }

        try {
            await this.paymentService.confirmPayment(
                Number(id),
                Number(adminId) || 1, // Fallback to 1 for now
                status,
                reason
            )

            // Log admin action
            console.log(`[ADMIN] Payment ${id} ${status} by Admin ${adminId || 1}`)

            return response.ok({ message: `Paiement ${status === 'confirmed' ? 'confirmé' : 'rejeté'} avec succès` })
        } catch (error: any) {
            return response.badRequest({ message: error.message })
        }
    }

    async webhook({ response }: HttpContext) {
        return response.ok({ status: 'received' })
    }

    /**
     * POST /api/payments/httpsms-webhook
     * Received when an SMS is received on the phone
     */
    async httpsmsWebhook({ request, response }: HttpContext) {
        const body = request.body()
        const eventType = request.input('type')

        // httpSMS sends events like 'message.received'
        if (eventType !== 'message.received') {
            return response.ok({ status: 'ignored' })
        }

        const message = body.data
        if (!message || !message.content) {
            return response.badRequest({ message: 'Invalid payload' })
        }

        console.log(`[httpSMS Webhook] Received SMS from ${message.address}: ${message.content}`)

        // Parse the SMS
        const parsed = httpsmsService.parseTransactionSms(message.content)
        if (!parsed) {
            console.log('[httpSMS Webhook] SMS not recognized as a transaction')
            return response.ok({ status: 'ignored' })
        }

        console.log(`[httpSMS Webhook] Parsed transaction:`, parsed)

        // Try to find a pending manual payment with this reference or amount/provider
        // For manual payments, we usually have a transaction_ref generated by the client
        // or we match by amount + provider if reference is missing.

        try {
            // First, try to match by reference if available
            let order = null
            if (parsed.reference) {
                order = await db.from('orders')
                    .where('manual_payment_status', 'pending')
                    .where('payment_method', 'manual_transfer')
                    .where('transaction_ref', parsed.reference) // This assumes user types the ref in the SMS motif, which is rare
                    .first()
            }

            // If not found by reference, try to match by amount + provider within the last hour
            if (!order) {
                order = await db.from('orders')
                    .where('manual_payment_status', 'pending')
                    .where('payment_method', 'manual_transfer')
                    .where('total', parsed.amount)
                    .where('created_at', '>=', new Date(Date.now() - 3600000)) // Last hour
                    .first()
            }

            if (order) {
                console.log(`[httpSMS Webhook] Matching order found: ${order.id}. Auto-confirming...`)

                await db.from('orders')
                    .where('id', order.id)
                    .update({
                        status: 'paid',
                        manual_payment_status: 'confirmed',
                        updated_at: new Date()
                    })

                // Notify admin/client if needed
                await notificationService.notifyNewOrder(order.id, order.customer_name, order.total)

                // Send SMS confirmation to customer
                if (order.customer_phone) {
                    const smsContent = `BIO SANTÉ: Votre paiement de ${parsed.amount.toLocaleString('fr-FR')} FCFA pour la commande #${order.transaction_ref || order.id.slice(0, 8)} a été confirmé! Votre commande est en préparation. Merci pour votre confiance.`
                    try {
                        await httpsmsService.sendSms(order.customer_phone, smsContent)
                        console.log(`[SMS] Payment confirmation sent to ${order.customer_phone}`)
                    } catch (smsError) {
                        console.error('[SMS] Failed to send payment confirmation:', smsError)
                    }
                }

                return response.ok({ status: 'confirmed', orderId: order.id })
            } else {
                console.log('[httpSMS Webhook] No matching pending order found for this transaction')
            }

        } catch (error) {
            console.error('[httpSMS Webhook] Error processing auto-confirmation:', error)
        }

        return response.ok({ status: 'received' })
    }
}
