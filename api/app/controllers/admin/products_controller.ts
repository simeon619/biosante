import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class AdminProductsController {
    /**
     * Get all products
     */
    async index({ response }: HttpContext) {
        const products = await db.from('products').orderBy('name', 'asc')
        return response.ok({ products })
    }

    /**
     * Get single product
     */
    async show({ params, response }: HttpContext) {
        const product = await db.from('products').where('id', params.id).first()
        if (!product) return response.notFound({ error: 'Produit non trouvé' })
        return response.ok({ product })
    }

    /**
     * Create product
     */
    async store({ request, response }: HttpContext) {
        const fields = ['id', 'name', 'price', 'stock', 'description', 'is_active', 'image', 'tagline', 'category', 'benefits', 'ingredients_image', 'infographic_image', 'gallery']
        const data = request.only(fields)

        console.log(`[AdminProducts] Creating product: ${data.id}`, JSON.stringify(data, null, 2))

        const existing = await db.from('products').where('id', data.id).first()
        if (existing) return response.conflict({ error: 'Cet identifiant de produit existe déjà' })

        // Ensure JSON fields are handled correctly
        const insertData = {
            ...data,
            benefits: data.benefits ? JSON.stringify(data.benefits) : JSON.stringify([]),
            gallery: data.gallery ? JSON.stringify(data.gallery) : JSON.stringify([]),
            created_at: DateTime.now().toSQL(),
            updated_at: DateTime.now().toSQL()
        }

        const [product] = await db.table('products').insert(insertData).returning('*')

        console.log(`[AdminProducts] Product created successfully: ${data.id}`)
        return response.created({ success: true, product })
    }

    /**
     * Update product
     */
    async update({ params, request, response }: HttpContext) {
        const fields = ['name', 'price', 'stock', 'description', 'is_active', 'image', 'tagline', 'category', 'benefits', 'ingredients_image', 'infographic_image', 'gallery']
        const data = request.only(fields)

        console.log(`[AdminProducts] Updating product: ${params.id}`, JSON.stringify(data, null, 2))

        const updateData: any = {
            ...data,
            updated_at: DateTime.now().toSQL()
        }

        // Handle JSON fields - ensure they are stringified for Knex raw query
        // if they are currently objects/arrays.
        if (data.benefits && typeof data.benefits !== 'string') {
            updateData.benefits = JSON.stringify(data.benefits)
        }
        if (data.gallery && typeof data.gallery !== 'string') {
            updateData.gallery = JSON.stringify(data.gallery)
        }

        const affected = await db.from('products')
            .where('id', params.id)
            .update(updateData)

        console.log(`[AdminProducts] Rows affected for ${params.id}: ${affected}`)

        const updated = await db.from('products').where('id', params.id).first()
        return response.ok({ success: true, product: updated })
    }

    /**
     * Delete product
     */
    async destroy({ params, response }: HttpContext) {
        await db.from('products').where('id', params.id).delete()
        return response.ok({ success: true })
    }

    /**
     * Toggle active status
     */
    async toggle({ params, response }: HttpContext) {
        const product = await db.from('products').where('id', params.id).first()
        if (!product) return response.notFound({ error: 'Produit non trouvé' })

        await db.from('products').where('id', params.id).update({
            is_active: !product.is_active,
            updated_at: DateTime.now().toSQL()
        })

        return response.ok({ success: true, is_active: !product.is_active })
    }

    /**
     * Seed initial products
     */
    async seed({ response }: HttpContext) {
        // Clear if requested? Or only if empty
        const existing = await db.from('products').first()
        if (existing) {
            // Update existing ones instead of failing if we have new columns to fill
            const products = this.getSeeds();
            for (const p of products) {
                await db.from('products').where('id', p.id).update({
                    ...p,
                    benefits: JSON.stringify(p.benefits),
                    gallery: JSON.stringify(p.gallery),
                    updated_at: DateTime.now().toSQL()
                })
            }
            return response.ok({ success: true, message: 'Produits mis à jour avec les nouveaux champs' })
        }

        const products = this.getSeeds();

        for (const p of products) {
            await db.table('products').insert({
                ...p,
                benefits: JSON.stringify(p.benefits),
                gallery: JSON.stringify(p.gallery),
                created_at: DateTime.now().toSQL(),
                updated_at: DateTime.now().toSQL()
            })
        }

        return response.created({ success: true, message: 'Produits initialisés' })
    }

    private getSeeds() {
        return [
            {
                id: 'bioactif',
                name: 'BioActif',
                tagline: 'DIABÈTE • HYPERTENSION',
                price: 12000,
                stock: 100,
                description: 'Une solution révolutionnaire 100% naturelle qui cible la double problématique de l\'hypertension et du diabète. BioActif aide à réguler naturellement la tension artérielle tout en stabilisant le taux de sucre dans le sang, offrant ainsi une protection cardiovasculaire complète.',
                category: 'HYPERTENSION',
                image: '/images/bioactif/bioactif-ingredients.jpg',
                ingredients_image: '/images/bioactif/bioactif-ingredients.jpg',
                infographic_image: '/images/bioactif/bioactif-infographic.jpg',
                gallery: [
                    '/images/bioactif/bioactif-lifestyle-woman.jpg',
                    '/images/bioactif/bioactif-infographic.jpg',
                    '/images/bioactif/bioactif-lifestyle-monitor.jpg'
                ],
                benefits: [
                    'Régule la tension artérielle',
                    'Stabilise la glycémie',
                    'Protection cardiaque',
                    '100% Plantes naturelles'
                ],
                is_active: true
            },
            {
                id: 'vitamax',
                name: 'VitaMax',
                tagline: 'PROSTATE • TROUBLES URINAIRES',
                price: 15000,
                stock: 150,
                description: 'Retrouvez votre confort et votre vitalité avec VitaMax. Formulé spécifiquement pour la santé masculine, il réduit l\'inflammation de la prostate, diminue les envies fréquentes d\'uriner la nuit et améliore le flux urinaire pour une meilleure qualité de vie.',
                category: 'PROSTATE',
                image: '/images/vitamax/vitamax-ingredients.jpg',
                ingredients_image: '/images/vitamax/vitamax-ingredients.jpg',
                infographic_image: '/images/vitamax/vitamax-infographic.jpg',
                gallery: [
                    '/images/vitamax/vitamax-lifestyle-happy.jpg',
                    '/images/vitamax/vitamax-infographic.jpg',
                    '/images/vitamax/vitamax-lifestyle-tablet.jpg'
                ],
                benefits: [
                    'Réduit l\'inflammation',
                    'Diminue les réveils nocturnes',
                    'Améliore le débit urinaire',
                    'Vitalité masculine'
                ],
                is_active: true
            }
        ]
    }
}
