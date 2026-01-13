
import env from '#start/env'
import axios from 'axios'

export class GeoService {
    // Use public Nominatim if no private instance is configured
    private nominatimUrl = env.get('GEO_NOMINATIM_URL') || 'https://nominatim.openstreetmap.org'
    private valhallaUrl = env.get('GEO_VALHALLA_URL')

    // Required User-Agent for public Nominatim API
    private userAgent = 'BioSante/1.0 (contact@biosante.com)'

    /**
     * Geocode an address to get coordinates
     */
    async geocode(address: string) {
        try {
            const response = await axios.get(`${this.nominatimUrl}/search`, {
                params: {
                    q: address,
                    format: 'json',
                    limit: 1,
                    addressdetails: 1,
                    countrycodes: 'ci' // Restrict to Côte d'Ivoire
                },
                headers: {
                    'User-Agent': this.userAgent
                }
            })

            if (!response.data || response.data.length === 0) {
                return null
            }

            const result = response.data[0]
            return {
                lat: parseFloat(result.lat),
                lon: parseFloat(result.lon),
                display_name: result.display_name,
                address: result.address
            }
        } catch (error: any) {
            console.error('Geocoding error:', error.message)
            return null
        }
    }

    /**
     * Search for places (Autocomplete) or reverse geocode if query looks like coordinates
     */
    async search(query: string) {
        try {
            // Check if query looks like coordinates (lat,lng or lat, lng)
            const coordPattern = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/
            const match = query.match(coordPattern)

            console.log('[GeoService] search called with:', query, 'match:', !!match, 'url:', this.nominatimUrl)

            if (match) {
                // Reverse geocoding - query is coordinates
                const lat = parseFloat(match[1])
                const lon = parseFloat(match[2])

                console.log('[GeoService] Reverse geocoding:', { lat, lon, url: this.nominatimUrl })

                const response = await axios.get(`${this.nominatimUrl}/reverse`, {
                    params: {
                        lat,
                        lon,
                        format: 'json',
                        addressdetails: 1
                    },
                    headers: {
                        'User-Agent': this.userAgent
                    }
                })

                console.log('[GeoService] Reverse response:', response.data?.display_name || response.data?.error)

                if (!response.data || response.data.error) return []

                return [{
                    lat: parseFloat(response.data.lat),
                    lon: parseFloat(response.data.lon),
                    display_name: response.data.display_name,
                    address: response.data.address
                }]
            }

            // Forward geocoding - query is text
            const response = await axios.get(`${this.nominatimUrl}/search`, {
                params: {
                    q: query,
                    format: 'json',
                    limit: 5,
                    addressdetails: 1,
                    countrycodes: 'ci' // Restrict to Côte d'Ivoire
                },
                headers: {
                    'User-Agent': this.userAgent
                }
            })

            console.log('[GeoService] Forward search response count:', response.data?.length || 0)

            if (!response.data) return []

            return response.data.map((result: any) => ({
                lat: parseFloat(result.lat),
                lon: parseFloat(result.lon),
                display_name: result.display_name,
                address: result.address
            }))
        } catch (error: any) {
            console.error('Geocoding search error:', error.message)
            return []
        }
    }


    /**
     * Calculate route between two points
     */
    async calculateRoute(start: { lat: number, lon: number }, end: { lat: number, lon: number }) {
        const json = {
            locations: [
                { lat: start.lat, lon: start.lon },
                { lat: end.lat, lon: end.lon }
            ],
            costing: 'auto',
            units: 'km'
        }

        try {
            const response = await axios.get(`${this.valhallaUrl}/route`, {
                params: { json: JSON.stringify(json) }
            })

            const trip = response.data.trip
            if (!trip || !trip.summary) return null

            return {
                distanceKm: trip.summary.length,
                timeSeconds: trip.summary.time,
                shape: trip.legs[0].shape // Encoded polyline
            }
        } catch (error) {
            console.error('Routing error:', error.message)
            return null
        }
    }
}

export const geoService = new GeoService()
