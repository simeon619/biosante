
import type { HttpContext } from '@adonisjs/core/http'
import { geoService } from '#services/geo_service'
import db from '@adonisjs/lucid/services/db'

export default class DeliveriesController {

    /**
     * Estimate delivery fees and time
     */
    public async estimate({ request, response }: HttpContext) {
        const { address } = request.all()

        if (!address) {
            return response.badRequest({ message: "L'adresse est requise" })
        }

        // 1. Geocode customer address
        const location = await geoService.geocode(address)
        console.log('Geocoded location:', location)

        if (!location) {
            return response.badRequest({ message: "Adresse introuvable. Veuillez préciser." })
        }

        // 2. Calculate route from Warehouse (Yopougon: Maroc/Annaneraie approx)
        const WAREHOUSE_LOC = { lat: 5.335194, lon: -4.075756 }

        const route = await geoService.calculateRoute(WAREHOUSE_LOC, location)

        if (!route) {
            return response.internalServerError({ message: "Impossible de calculer l'itinéraire." })
        }

        // 3. Business Logic: Fee Calculation
        // Rule: Base 1000 FCFA. Max 1500 FCFA.
        // Logic: 1000 + (100 * km), clamped to [1000, 1500]

        let fee = 1000 + (route.distanceKm * 50) // Slower increase

        // Clamp between 1000 and 1500
        fee = Math.max(1000, Math.min(fee, 1500))

        // Round to nearest 100
        fee = Math.ceil(fee / 100) * 100

        return response.ok({
            fee,
            currency: 'FCFA',
            distanceKm: Number(route.distanceKm.toFixed(1)),
            timeMinutes: Math.round(route.timeSeconds / 60),
            destination: {
                lat: location.lat,
                lon: location.lon,
                address: location.display_name
            }
        })
    }

    /**
     * Search for addresses/places
     */
    public async searchPlaces({ request, response }: HttpContext) {
        let { query } = request.all()

        // Handle case where comma in query causes array parsing
        if (Array.isArray(query)) {
            query = query.join(',')
        }

        console.log('[DeliveriesController] searchPlaces called:', { query, length: query?.length })

        if (!query || query.length < 3) {
            console.log('[DeliveriesController] Query too short, returning []')
            return response.ok([])
        }

        const results = await geoService.search(query)
        console.log('[DeliveriesController] Results count:', results.length)
        return response.ok(results)
    }

    /**
     * Create a new delivery associated with an order
     */
    public async create({ request, response }: HttpContext) {
        const data = request.only(['orderId', 'address', 'lat', 'lon', 'fee', 'customerName', 'customerPhone'])

        // Insert using raw query for PostGIS geometry
        // Note: ST_MakePoint takes (Longitude, Latitude) order!
        try {
            const result = await db.rawQuery(
                `INSERT INTO deliveries 
        (order_id, address_full, location, delivery_fee, status, customer_name, customer_phone, created_at, updated_at) 
        VALUES (?, ?, ST_SetSRID(ST_MakePoint(?, ?), 4326), ?, 'pending', ?, ?, NOW(), NOW())
        RETURNING id`,
                [
                    data.orderId,
                    data.address,
                    data.lon, // Longitude X
                    data.lat, // Latitude Y
                    data.fee,
                    data.customerName,
                    data.customerPhone
                ]
            )

            return response.created({
                message: 'Livraison créée avec succès',
                deliveryId: result.rows[0].id
            })

        } catch (error) {
            console.error(error)
            return response.internalServerError({ message: "Erreur lors de la création de la livraison" })
        }
    }
}