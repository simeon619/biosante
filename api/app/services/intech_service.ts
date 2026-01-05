
import axios from 'axios'
import env from '#start/env'
import crypto from 'node:crypto'

export interface IntechOperationOptions {
    phone: string
    amount: number
    codeService: string
    externalTransactionId: string
    callbackUrl: string
    data?: any
    // Optional fields for specific services
    sender?: string
    successRedirectUrl?: string
    errorRedirectUrl?: string
    [key: string]: any
}

export interface IntechOperationResponse {
    code: number
    msg: string
    error: boolean
    data: {
        phone: string
        amount: number
        codeService: string
        transactionId: string
        status: string
        externalTransactionId: string
        callbackUrl: string
        [key: string]: any
    }
}

export class IntechService {
    private readonly apiKey: string
    private readonly baseUrl: string

    constructor() {
        this.apiKey = env.get('INTECH_API_KEY') as string
        this.baseUrl = env.get('INTECH_BASE_URL', 'https://api.intech.sn')
    }

    /**
     * Initiate a transaction (Cash-in, Cash-out, etc.)
     * POST /api-services/operation
     */
    async initiateOperation(options: IntechOperationOptions): Promise<IntechOperationResponse> {
        const url = `${this.baseUrl}/api-services/operation`

        // Prepare payload
        const payload = {
            ...options,
            apiKey: this.apiKey,
            data: options.data ? (typeof options.data === 'string' ? options.data : JSON.stringify(options.data)) : '{}'
        }

        try {
            console.log('Initiating Intech Operation:', JSON.stringify({ ...payload, apiKey: '***' }, null, 2))

            const response = await axios.post(url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 60000 // Documentation recommends 60s
            })

            console.log('Intech Operation Response:', JSON.stringify(response.data, null, 2))

            return response.data
        } catch (error: any) {
            console.error('Intech initiateOperation error:')
            console.error('  Status:', error.response?.status)
            console.error('  Data:', JSON.stringify(error.response?.data, null, 2))
            console.error('  Message:', error.message)
            throw new Error(error.response?.data?.msg || 'Failed to initiate operation with Intech')
        }
    }

    /**
     * Get Transaction Status
     * POST /api-services/get-transaction-status
     */
    async getTransactionStatus(externalTransactionId: string) {
        const url = `${this.baseUrl}/api-services/get-transaction-status`

        try {
            const response = await axios.post(url, {
                apiKey: this.apiKey,
                externalTransactionId
            }, {
                headers: {
                    'Secretkey': this.apiKey, // Documentation mentions both methods
                    'Content-Type': 'application/json'
                }
            })

            return response.data
        } catch (error: any) {
            console.error('Intech getTransactionStatus error:', error.response?.data || error.message)
            throw new Error('Failed to get transaction status from Intech')
        }
    }

    /**
     * List all Service (Public route)
     * GET /api-services/services
     */
    async listServices() {
        const url = `${this.baseUrl}/api-services/services`
        try {
            const response = await axios.get(url, {
                headers: {
                    'Secretkey': this.apiKey
                }
            })
            return response.data
        } catch (error: any) {
            console.error('Intech listServices error:', error.message)
            throw new Error('Failed to list Intech services')
        }
    }

    /**
     * Check Balance
     * GET /api-services/balance
     */
    async getBalance() {
        const url = `${this.baseUrl}/api-services/balance`
        try {
            const response = await axios.get(url, {
                headers: {
                    'Secretkey': this.apiKey
                }
            })
            return response.data
        } catch (error: any) {
            console.error('Intech getBalance error:', error.message)
            throw new Error('Failed to get Intech balance')
        }
    }

    /**
     * Verify Callback Hash
     * Hash = SHA256(transactionId|externalTransactionId|apiKey)
     */
    validateSignature(transactionId: string, externalTransactionId: string, receivedHash: string): boolean {
        const data = `${transactionId}|${externalTransactionId}|${this.apiKey}`
        const computedHash = crypto.createHash('sha256').update(data).digest('hex')

        try {
            return crypto.timingSafeEqual(
                Buffer.from(computedHash),
                Buffer.from(receivedHash)
            )
        } catch (e) {
            return false
        }
    }

    /**
     * WhatsApp Messaging (Specialized call)
     */
    async sendWhatsAppMessage(phone: string, message: string) {
        return this.initiateOperation({
            phone,
            amount: 0, // Messaging is often debited from balance directly
            codeService: 'WHATSAPP_MESSAGING',
            externalTransactionId: `MSG_${Date.now()}`,
            callbackUrl: env.get('BACKEND_URL') + '/api/intech/callback',
            data: { message }
        })
    }
}

export const intechService = new IntechService()
