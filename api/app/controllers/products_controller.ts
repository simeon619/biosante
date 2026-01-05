import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ProductsController {
    /**
     * Get all active products with their testimonials
     */
    async index({ response }: HttpContext) {
        try {
            const products = await db.from('products')
                .where('is_active', true)
                .orderBy('name', 'asc')

            // Fetch testimonials for all products
            const testimonials = await db.from('audio_testimonials')
                .where('is_active', true)
                .orderBy('display_order', 'asc')

            // Group testimonials by product_id
            const testimonialsByProduct: Record<string, any[]> = {}
            for (const t of testimonials) {
                if (!testimonialsByProduct[t.product_id]) {
                    testimonialsByProduct[t.product_id] = []
                }
                testimonialsByProduct[t.product_id].push({
                    id: t.id,
                    author: t.author,
                    location: t.location,
                    duration: t.duration,
                    url: t.audio_url
                })
            }

            // Attach testimonials to products
            const productsWithTestimonials = products.map(p => ({
                ...p,
                testimonials: testimonialsByProduct[p.id] || []
            }))

            return response.ok({ products: productsWithTestimonials })
        } catch (error) {
            console.error('Failed to fetch products:', error)
            return response.internalServerError({ error: 'Failed to fetch products' })
        }
    }

    /**
     * Get single product details with testimonials
     */
    async show({ params, response }: HttpContext) {
        try {
            const product = await db.from('products')
                .where('id', params.id)
                .andWhere('is_active', true)
                .first()

            if (!product) {
                return response.notFound({ error: 'Produit non trouvé ou inactif' })
            }

            // Fetch testimonials for this product
            const testimonials = await db.from('audio_testimonials')
                .where('product_id', params.id)
                .andWhere('is_active', true)
                .orderBy('display_order', 'asc')

            const productWithTestimonials = {
                ...product,
                testimonials: testimonials.map(t => ({
                    id: t.id,
                    author: t.author,
                    location: t.location,
                    duration: t.duration,
                    url: t.audio_url
                }))
            }

            return response.ok({ product: productWithTestimonials })
        } catch (error) {
            console.error('Failed to fetch product details:', error)
            return response.internalServerError({ error: 'Failed to fetch product details' })
        }
    }
}

