import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class SettingsController {
    /**
     * Get all settings grouped by category
     */
    async index({ response }: HttpContext) {
        const settings = await db.from('settings')
            .orderBy('category')
            .orderBy('key')

        // Group by category
        const grouped: Record<string, any[]> = {}
        for (const setting of settings) {
            if (!grouped[setting.category]) {
                grouped[setting.category] = []
            }
            grouped[setting.category].push(setting)
        }

        return response.ok({
            settings: grouped,
            categories: Object.keys(grouped)
        })
    }

    /**
     * Get a single setting by key
     */
    async show({ params, response }: HttpContext) {
        const setting = await db.from('settings')
            .where('key', params.key)
            .first()

        if (!setting) {
            return response.notFound({ error: 'Paramètre non trouvé' })
        }

        return response.ok({ setting })
    }

    /**
     * Get setting value by key (for internal use)
     */
    static async getValue(key: string, defaultValue: string = ''): Promise<string> {
        const setting = await db.from('settings')
            .where('key', key)
            .first()

        return setting?.value || defaultValue
    }

    /**
     * Update a setting
     */
    async update({ params, request, response }: HttpContext) {
        const { value } = request.only(['value'])

        const setting = await db.from('settings')
            .where('key', params.key)
            .first()

        if (!setting) {
            return response.notFound({ error: 'Paramètre non trouvé' })
        }

        // Validate based on type
        if (setting.type === 'phone' && value) {
            // Basic phone validation
            const cleaned = value.replace(/[^\d+]/g, '')
            if (cleaned.length < 10) {
                return response.badRequest({ error: 'Numéro de téléphone invalide' })
            }
        }

        if (setting.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
                return response.badRequest({ error: 'Email invalide' })
            }
        }

        if (setting.type === 'number' && value) {
            if (isNaN(Number(value))) {
                return response.badRequest({ error: 'Valeur numérique requise' })
            }
        }

        await db.from('settings')
            .where('key', params.key)
            .update({
                value,
                updated_at: DateTime.now().toSQL()
            })

        console.log(`[Settings] Updated ${params.key} = ${value}`)

        return response.ok({
            success: true,
            setting: { ...setting, value, updated_at: DateTime.now().toISO() }
        })
    }

    /**
     * Bulk update settings
     */
    async bulkUpdate({ request, response }: HttpContext) {
        const { settings } = request.only(['settings'])

        if (!settings || !Array.isArray(settings)) {
            return response.badRequest({ error: 'Format invalide' })
        }

        const updated: string[] = []
        const errors: string[] = []

        for (const item of settings) {
            if (!item.key || item.value === undefined) continue

            try {
                await db.from('settings')
                    .where('key', item.key)
                    .update({
                        value: item.value,
                        updated_at: DateTime.now().toSQL()
                    })
                updated.push(item.key)
            } catch (e) {
                errors.push(item.key)
            }
        }

        console.log(`[Settings] Bulk updated: ${updated.join(', ')}`)

        return response.ok({
            success: true,
            updated,
            errors
        })
    }

    /**
     * Create a new setting
     */
    async store({ request, response }: HttpContext) {
        const data = request.only(['key', 'value', 'label', 'type', 'category', 'description'])

        if (!data.key || !data.label) {
            return response.badRequest({ error: 'Clé et label requis' })
        }

        // Check if already exists
        const existing = await db.from('settings').where('key', data.key).first()
        if (existing) {
            return response.conflict({ error: 'Cette clé existe déjà' })
        }

        await db.table('settings').insert({
            ...data,
            type: data.type || 'text',
            category: data.category || 'general',
            updated_at: DateTime.now().toSQL()
        })

        return response.created({ success: true, key: data.key })
    }

    /**
     * Delete a setting
     */
    async destroy({ params, response }: HttpContext) {
        const deleted = await db.from('settings')
            .where('key', params.key)
            .delete()

        if (!deleted) {
            return response.notFound({ error: 'Paramètre non trouvé' })
        }

        return response.ok({ success: true })
    }
}
