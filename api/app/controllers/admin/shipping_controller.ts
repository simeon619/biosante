import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class AdminShippingController {
    /**
     * Get all shipping companies
     */
    async index({ response }: HttpContext) {
        const companies = await db.from('shipping_companies').orderBy('name', 'asc')
        return response.ok({ companies })
    }

    /**
     * Get single company
     */
    async show({ params, response }: HttpContext) {
        const company = await db.from('shipping_companies').where('id', params.id).first()
        if (!company) return response.notFound({ error: 'Compagnie non trouvée' })
        return response.ok({ company })
    }

    /**
     * Create company
     */
    async store({ request, response }: HttpContext) {
        const data = request.only(['name', 'type', 'contact', 'is_active'])

        const [company] = await db.table('shipping_companies').insert({
            ...data,
            created_at: DateTime.now().toSQL(),
            updated_at: DateTime.now().toSQL()
        }).returning('*')

        return response.created({ success: true, company })
    }

    /**
     * Update company
     */
    async update({ params, request, response }: HttpContext) {
        const data = request.only(['name', 'type', 'contact', 'is_active'])

        await db.from('shipping_companies')
            .where('id', params.id)
            .update({
                ...data,
                updated_at: DateTime.now().toSQL()
            })

        const updated = await db.from('shipping_companies').where('id', params.id).first()
        return response.ok({ success: true, company: updated })
    }

    /**
     * Delete company
     */
    async destroy({ params, response }: HttpContext) {
        await db.from('shipping_companies').where('id', params.id).delete()
        return response.ok({ success: true })
    }

    /**
     * Toggle active status
     */
    async toggle({ params, response }: HttpContext) {
        const company = await db.from('shipping_companies').where('id', params.id).first()
        if (!company) return response.notFound({ error: 'Compagnie non trouvée' })

        await db.from('shipping_companies').where('id', params.id).update({
            is_active: !company.is_active,
            updated_at: DateTime.now().toSQL()
        })

        return response.ok({ success: true, is_active: !company.is_active })
    }

    /**
     * Seed initial shipping companies
     */
    async seed({ response }: HttpContext) {
        const existing = await db.from('shipping_companies').first()
        if (existing) return response.badRequest({ error: 'Les compagnies sont déjà initialisées' })

        const companies = [
            { name: 'AVS', type: 'local', contact: 'Abidjan Section', is_active: true },
            { name: 'UTB', type: 'inland', contact: '01 02 03 04 05', is_active: true },
            { name: 'AVS Transport', type: 'inland', contact: '07 08 09 10 11', is_active: true },
            { name: 'Général Express', type: 'inland', contact: '21 22 23 24 25', is_active: true }
        ]

        for (const c of companies) {
            await db.table('shipping_companies').insert({
                ...c,
                created_at: DateTime.now().toSQL(),
                updated_at: DateTime.now().toSQL()
            })
        }

        return response.created({ success: true, message: 'Compagnies initialisées' })
    }
}
