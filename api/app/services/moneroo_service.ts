
import env from '#start/env'
import axios from 'axios'
import { createHmac } from 'node:crypto'

/**
 * Payment initialization options
 */
interface InitializePaymentOptions {
    amount: number
    orderId: string
    customer: {
        email: string
        firstName: string
        lastName: string
        phone?: string
    }
    returnUrl: string
}

/**
 * Payment initialization response
 */
interface InitializePaymentResponse {
    paymentId: string
    checkoutUrl: string
}

/**
 * Payment verification response
 */
interface PaymentVerificationResult {
    id: string
    status: 'pending' | 'initiated' | 'success' | 'failed' | 'cancelled'
    amount: number
    currency: string
    isProcessed: boolean
    paymentMethod?: string
    customer?: {
        email: string
        firstName: string
        lastName: string
        phone?: string
    }
    metadata?: Record<string, string>
}

/**
 * MonerooService
 * 
 * Agnostic service for Moneroo API interactions.
 * Handles payment initialization, verification, and webhook signature validation.
 */
export class MonerooService {
    private readonly apiUrl = 'https://api.moneroo.io/v1'
    private readonly secretKey = env.get('MONEROO_SECRET_KEY')
    private readonly webhookSecret = env.get('MONEROO_WEBHOOK_SECRET')

    // Payment methods available for Côte d'Ivoire
    private readonly ciPaymentMethods = ['wave_ci', 'mtn_ci', 'orange_ci', 'moov_ci']

    /**
     * Initialize a payment with Moneroo
     * 
     * @param options - Payment details including amount, order ID, customer info, and return URL
     * @returns Payment ID and checkout URL for redirection
     */
    async initializePayment(options: InitializePaymentOptions): Promise<InitializePaymentResponse> {
        const { amount, orderId, customer, returnUrl } = options

        const payload = {
            amount: Math.round(amount), // Ensure integer for XOF
            currency: 'XOF',
            description: `Commande ${orderId}`,
            customer: {
                email: customer.email,
                first_name: customer.firstName,
                last_name: customer.lastName,
                phone: customer.phone || undefined
            },
            return_url: returnUrl,
            metadata: {
                order_id: orderId
            },
            // methods: this.ciPaymentMethods // Commented out to use Moneroo's default active methods
        }

        try {
            const response = await axios.post(
                `${this.apiUrl}/payments/initialize`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${this.secretKey}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            )

            if (response.status !== 201 || !response.data?.data) {
                throw new Error(`Unexpected response from Moneroo: ${response.status}`)
            }

            return {
                paymentId: response.data.data.id,
                checkoutUrl: response.data.data.checkout_url
            }
        } catch (error: any) {
            console.error('Moneroo initializePayment error:', error.response?.data || error.message)
            throw new Error(error.response?.data?.message || 'Failed to initialize payment with Moneroo')
        }
    }

    /**
     * Verify a payment status with Moneroo
     * 
     * @param paymentId - The Moneroo payment ID to verify
     * @returns Payment verification result with status and details
     */
    async verifyPayment(paymentId: string): Promise<PaymentVerificationResult> {
        try {
            const response = await axios.get(
                `${this.apiUrl}/payments/${paymentId}/verify`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.secretKey}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            )

            if (response.status !== 200 || !response.data?.data) {
                throw new Error(`Unexpected response from Moneroo: ${response.status}`)
            }

            const data = response.data.data

            return {
                id: data.id,
                status: data.status,
                amount: data.amount,
                currency: data.currency?.code || 'XOF',
                isProcessed: data.is_processed || false,
                paymentMethod: data.capture?.method?.short_code,
                customer: data.customer ? {
                    email: data.customer.email,
                    firstName: data.customer.first_name,
                    lastName: data.customer.last_name,
                    phone: data.customer.phone
                } : undefined,
                metadata: data.metadata
            }
        } catch (error: any) {
            console.error('Moneroo verifyPayment error:', error.response?.data || error.message)
            throw new Error(error.response?.data?.message || 'Failed to verify payment with Moneroo')
        }
    }

    /**
     * Validate webhook signature using HMAC-SHA256
     * 
     * Moneroo signs webhooks with HMAC-SHA256 using the webhook secret.
     * The signature is sent in the X-Moneroo-Signature header.
     * 
     * @param payload - Raw request body as string
     * @param signature - Value of X-Moneroo-Signature header
     * @returns True if signature is valid, false otherwise
     */
    validateSignature(payload: string, signature: string): boolean {
        if (!this.webhookSecret || !signature) {
            return false
        }

        const expectedSignature = createHmac('sha256', this.webhookSecret)
            .update(payload)
            .digest('hex')

        // Use timing-safe comparison to prevent timing attacks
        return this.timingSafeEqual(expectedSignature, signature)
    }

    /**
     * Timing-safe string comparison to prevent timing attacks
     */
    private timingSafeEqual(a: string, b: string): boolean {
        if (a.length !== b.length) {
            return false
        }

        let result = 0
        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i)
        }
        return result === 0
    }
}

// Export singleton instance
export const monerooService = new MonerooService()
