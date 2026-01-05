import db from '@adonisjs/lucid/services/db'
import axios from 'axios'
import crypto from 'node:crypto'

export default class FacebookCapiService {
    private static async getSettings() {
        const settings = await db.from('settings')
            .whereIn('key', ['fb_pixel_id', 'fb_access_token', 'fb_test_event_code'])
            .select('key', 'value')

        const config: Record<string, string> = {}
        settings.forEach(s => config[s.key] = s.value)
        return config
    }

    /**
     * Send a server-side event to Facebook
     */
    static async sendEvent(eventName: string, userData: any, customData: any = {}, eventSourceUrl: string = '', eventId?: string) {
        const config = await this.getSettings()
        const pixelId = config.fb_pixel_id
        const accessToken = config.fb_access_token
        const testCode = config.fb_test_event_code

        if (!pixelId || !accessToken) {
            console.warn('[FB-CAPI] Missing Pixel ID or Access Token. Skipping event.')
            return
        }

        const url = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`

        const payload = {
            data: [
                {
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: 'website',
                    event_source_url: eventSourceUrl,
                    event_id: eventId || crypto.randomUUID(),
                    user_data: {
                        client_ip_address: userData.ip,
                        client_user_agent: userData.userAgent,
                        ph: userData.phone ? this.hash(userData.phone) : undefined,
                        em: userData.email ? this.hash(userData.email) : undefined,
                    },
                    custom_data: customData,
                }
            ],
            test_event_code: testCode || undefined
        }

        try {
            const response = await axios.post(url, payload)
            console.log(`[FB-CAPI] Event ${eventName} sent successfully:`, response.data)
            return response.data
        } catch (error: any) {
            console.error(`[FB-CAPI] Error sending event ${eventName}:`, error.response?.data || error.message)
        }
    }

    /**
     * SHA-256 Hashing for PII data (required by Meta)
     */
    private static hash(value: string): string {
        if (!value) return ''
        return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
    }
}
