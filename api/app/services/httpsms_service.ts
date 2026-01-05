import axios from 'axios'
import env from '#start/env'

export class HttpsmsService {
    private apiUrl: string
    private apiKey: string
    private fromNumber: string

    constructor() {
        this.apiUrl = env.get('HTTPSMS_API_URL', 'http://localhost:8000')
        this.apiKey = env.get('HTTPSMS_API_KEY', '')
        this.fromNumber = env.get('HTTPSMS_FROM_NUMBER', '+2250759091098')
    }
    /**
     * Normalize phone number to E.164 format with Côte d'Ivoire country code
     * Côte d'Ivoire numbers are 10 digits starting with 0: 0X XX XX XX XX
     * Full international format: +2250XXXXXXXXX (14 characters total including +)
     * Examples:
     * - "0507859953" -> "+2250507859953"
     * - "05 07 85 99 53" -> "+2250507859953"
     * - "+2250507859953" -> "+2250507859953"
     * - "2250507859953" -> "+2250507859953"
     */
    private normalizePhoneNumber(phone: string): string {
        // Remove all non-digit characters except leading +
        let cleaned = phone.replace(/[^\d+]/g, '')

        console.log('[HttpsmsService] normalizePhoneNumber input:', phone, '-> cleaned:', cleaned)

        // If already in correct format +225XXXXXXXXXX (14 chars), return as-is
        if (cleaned.startsWith('+225') && cleaned.length === 14) {
            console.log('[HttpsmsService] Already normalized, returning:', cleaned)
            return cleaned
        }

        // Remove leading + if present, we'll add it back
        if (cleaned.startsWith('+')) {
            cleaned = cleaned.substring(1)
        }

        // If starts with 225 and is correct length (13 digits: 225 + 10), just add +
        if (cleaned.startsWith('225') && cleaned.length === 13) {
            return `+${cleaned}`
        }

        // If starts with 0, keep the 0 and add +225 prefix
        if (cleaned.startsWith('0') && cleaned.length === 10) {
            return `+225${cleaned}`
        }

        // If it's a 10-digit number, assume it needs +225 prefix
        if (cleaned.length === 10) {
            return `+225${cleaned}`
        }

        // Otherwise, return as-is with + prefix if needed
        if (!cleaned.startsWith('+')) {
            return `+${cleaned}`
        }
        return cleaned
    }

    /**
     * Send an SMS via the httpSMS gateway
     */
    async sendSms(to: string, content: string): Promise<boolean> {
        const normalizedTo = this.normalizePhoneNumber(to)
        try {
            console.log(`[HttpsmsService] Sending SMS from ${this.fromNumber} to ${normalizedTo} (original: ${to})`)
            const response = await axios.post(
                `${this.apiUrl}/v1/messages/send`,
                {
                    from: this.fromNumber,
                    to: normalizedTo,
                    content,
                },
                {
                    headers: {
                        'x-api-key': this.apiKey,
                        'Content-Type': 'application/json',
                    },
                }
            )

            console.log('[HttpsmsService] SMS sent successfully:', response.data)
            return response.status === 200 || response.status === 201
        } catch (error) {
            console.error('[HttpsmsService] Error sending SMS:', error.response?.data || error.message)
            return false
        }
    }

    /**
     * Parse transaction SMS from various providers
     * Format examples:
     * Wave: "You received 5000F from +225..."
     * Orange: "Transfert de 5000F de la part de..."
     * MTN: "You have received 5000 FCFA from..."
     */
    parseTransactionSms(body: string) {
        const text = body.toLowerCase()

        // Wave Côte d'Ivoire
        if (text.includes('wave') || text.includes('reçu') || text.includes('received')) {
            const amountMatch = text.match(/([\d\s]+)\s?f/i)
            const refMatch = text.match(/réf\s?:\s?([A-Z0-9]+)/i) || text.match(/id\s?:\s?([A-Z0-9]+)/i)

            if (amountMatch) {
                return {
                    provider: 'wave',
                    amount: parseInt(amountMatch[1].replace(/\s/g, '')),
                    reference: refMatch ? refMatch[1] : null,
                    raw: body
                }
            }
        }

        // Orange Money
        if (text.includes('orange') || text.includes('transfert')) {
            const amountMatch = text.match(/([\d\s]+)\s?fcfa/i) || text.match(/([\d\s]+)\s?f/i)
            const refMatch = text.match(/référence\s?:\s?([A-Z0-9]+)/i)

            if (amountMatch) {
                return {
                    provider: 'orange',
                    amount: parseInt(amountMatch[1].replace(/\s/g, '')),
                    reference: refMatch ? refMatch[1] : null,
                    raw: body
                }
            }
        }

        return null
    }
}

export const httpsmsService = new HttpsmsService()
