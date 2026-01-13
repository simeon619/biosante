import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ShippingController {
    /**
     * Get all active shipping companies (public)
     */
    async index({ response }: HttpContext) {
        try {
            const companies = await db.from('shipping_companies')
                .where('is_active', true)
                .orderBy('name', 'asc')

            // Parse JSON fields
            const formattedCompanies = companies.map(c => ({
                id: c.slug || c.id.toString(),
                name: c.name,
                hub_principal: c.hub_principal || '',
                type: c.type || 'National',
                regions_desservies: c.regions_desservies || [],
                contact_colis: c.contact || '',
                destinations: c.destinations || []
            }))

            return response.ok({ companies: formattedCompanies })
        } catch (error) {
            console.error('Failed to fetch shipping companies:', error)
            return response.internalServerError({ error: 'Failed to fetch shipping companies' })
        }
    }

    /**
     * Get companies that serve a specific city
     */
    async byCity({ params, response }: HttpContext) {
        try {
            const city = params.city?.toLowerCase().trim()
            if (!city) {
                return response.badRequest({ error: 'Ville requise' })
            }

            const companies = await db.from('shipping_companies')
                .where('is_active', true)
                .orderBy('name', 'asc')

            // Filter companies that serve this city
            const servingCompanies = companies.filter(c => {
                const destinations = c.destinations || []
                return destinations.some((dest: string) =>
                    dest.toLowerCase().includes(city) || city.includes(dest.toLowerCase())
                )
            })

            const formattedCompanies = servingCompanies.map(c => ({
                id: c.slug || c.id.toString(),
                name: c.name,
                hub_principal: c.hub_principal || '',
                type: c.type || 'National',
                regions_desservies: c.regions_desservies || [],
                contact_colis: c.contact || '',
                destinations: c.destinations || []
            }))

            return response.ok({ companies: formattedCompanies, city })
        } catch (error) {
            console.error('Failed to search shipping companies:', error)
            return response.internalServerError({ error: 'Failed to search' })
        }
    }

    /**
     * Get all unique destinations (cities served)
     */
    async destinations({ response }: HttpContext) {
        try {
            const companies = await db.from('shipping_companies')
                .where('is_active', true)

            const allDestinations = new Set<string>()
            companies.forEach(c => {
                const destinations = c.destinations || []
                destinations.forEach((dest: string) => {
                    if (dest.toLowerCase() !== 'abidjan') {
                        allDestinations.add(dest)
                    }
                })
            })

            return response.ok({
                destinations: Array.from(allDestinations).sort()
            })
        } catch (error) {
            console.error('Failed to fetch destinations:', error)
            return response.internalServerError({ error: 'Failed to fetch destinations' })
        }
    }
}
