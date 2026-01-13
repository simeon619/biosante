import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import fs from 'node:fs/promises'

export default class AdminShippingController {
    /**
     * Get all shipping companies
     */
    async index({ response }: HttpContext) {
        const companies = await db.from('shipping_companies').orderBy('name', 'asc')

        // Format to match expected structure
        const formatted = companies.map(c => ({
            ...c,
            regions_desservies: c.regions_desservies || [],
            destinations: c.destinations || []
        }))

        return response.ok({ companies: formatted })
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
        const data = request.only([
            'slug', 'name', 'hub_principal', 'type', 'contact',
            'regions_desservies', 'destinations', 'is_active'
        ])

        const [company] = await db.table('shipping_companies').insert({
            slug: data.slug,
            name: data.name,
            hub_principal: data.hub_principal || '',
            type: data.type || 'National',
            contact: data.contact || '',
            regions_desservies: JSON.stringify(data.regions_desservies || []),
            destinations: JSON.stringify(data.destinations || []),
            is_active: data.is_active !== false,
            created_at: DateTime.now().toSQL(),
            updated_at: DateTime.now().toSQL()
        }).returning('*')

        return response.created({ success: true, company })
    }

    /**
     * Update company
     */
    async update({ params, request, response }: HttpContext) {
        const data = request.only([
            'slug', 'name', 'hub_principal', 'type', 'contact',
            'regions_desservies', 'destinations', 'is_active'
        ])

        const updates: Record<string, any> = { updated_at: DateTime.now().toSQL() }

        if (data.slug !== undefined) updates.slug = data.slug
        if (data.name !== undefined) updates.name = data.name
        if (data.hub_principal !== undefined) updates.hub_principal = data.hub_principal
        if (data.type !== undefined) updates.type = data.type
        if (data.contact !== undefined) updates.contact = data.contact
        if (data.regions_desservies !== undefined) updates.regions_desservies = JSON.stringify(data.regions_desservies)
        if (data.destinations !== undefined) updates.destinations = JSON.stringify(data.destinations)
        if (data.is_active !== undefined) updates.is_active = data.is_active

        await db.from('shipping_companies')
            .where('id', params.id)
            .update(updates)

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
     * Seed shipping companies from exp_cie.json
     * This will replace all existing data
     */
    async seed({ request, response }: HttpContext) {
        const { force } = request.only(['force'])

        // Check if already has data
        const existing = await db.from('shipping_companies').first()
        if (existing && !force) {
            return response.badRequest({
                error: 'Des compagnies existent déjà. Utilisez force:true pour tout réinitialiser'
            })
        }

        try {
            // Read exp_cie.json from /app directory (copied during Docker build)
            const jsonPath = '/app/exp_cie.json'
            const jsonContent = await fs.readFile(jsonPath, 'utf-8')
            const companies = JSON.parse(jsonContent)

            // Clear existing if force
            if (force) {
                await db.from('shipping_companies').delete()
            }

            let imported = 0
            for (const c of companies) {
                await db.table('shipping_companies').insert({
                    slug: c.id,
                    name: c.name,
                    hub_principal: c.hub_principal || '',
                    type: c.type || 'National',
                    contact: c.contact_colis || '',
                    regions_desservies: JSON.stringify(c.regions_desservies || []),
                    destinations: JSON.stringify(c.destinations || []),
                    is_active: true,
                    created_at: DateTime.now().toSQL(),
                    updated_at: DateTime.now().toSQL()
                })
                imported++
            }

            return response.created({
                success: true,
                message: `${imported} compagnies importées depuis exp_cie.json`
            })
        } catch (error) {
            console.error('Failed to seed shipping companies:', error)
            return response.internalServerError({
                error: 'Erreur lors de l\'import',
                details: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }
}
