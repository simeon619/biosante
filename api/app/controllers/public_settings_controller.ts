import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

/**
 * Public settings controller - exposes non-sensitive settings to the storefront
 */
export default class PublicSettingsController {
    // Keys that are safe to expose publicly
    private publicKeys = [
        // Payment numbers (for display on payment page)
        'payment_wave_number',
        'payment_orange_number',
        'payment_mtn_number',
        'payment_moov_number',
        // Contact info
        'contact_customer_service',
        'contact_whatsapp',
        'contact_email',
        // Delivery fees
        'delivery_local_fee',
        'delivery_interior_fee',
        'delivery_free_threshold',
        // Business info
        'business_name',
        'business_address',
        'business_hours',
        // Marketing
        'fb_pixel_id',
    ]

    /**
     * Get all public settings as a flat object
     */
    async index({ response }: HttpContext) {
        const settings = await db.from('settings')
            .whereIn('key', this.publicKeys)
            .select('key', 'value', 'type')

        // Convert to a flat object for easy consumption
        const result: Record<string, string | number> = {}

        for (const setting of settings) {
            // Convert numeric values
            if (setting.type === 'number') {
                result[setting.key] = parseInt(setting.value) || 0
            } else {
                result[setting.key] = setting.value
            }
        }

        // Add computed/formatted values for convenience
        result.delivery = {
            local: result.delivery_local_fee || 1400,
            interior: result.delivery_interior_fee || 3500,
            freeThreshold: result.delivery_free_threshold || 25000,
        } as any

        result.payment = {
            wave: result.payment_wave_number || '',
            orange: result.payment_orange_number || '',
            mtn: result.payment_mtn_number || '',
            moov: result.payment_moov_number || '',
        } as any

        result.contact = {
            phone: result.contact_customer_service || '',
            whatsapp: result.contact_whatsapp || '',
            email: result.contact_email || '',
        } as any

        result.business = {
            name: result.business_name || 'BIO SANTÉ',
            address: result.business_address || '',
            hours: result.business_hours || 'Lun - Sam : 08:30 - 18:30',
        } as any

        return response.ok(result)
    }
}
