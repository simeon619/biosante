import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { mkdir } from 'fs/promises'
import path from 'path'

export default class AdminTestimonialsController {
    /**
     * Get all testimonials
     */
    async index({ request, response }: HttpContext) {
        const productId = request.input('product_id')

        let query = db.from('audio_testimonials').orderBy('product_id').orderBy('display_order')

        if (productId) {
            query = query.where('product_id', productId)
        }

        const testimonials = await query.select('*')

        return response.ok({ testimonials })
    }

    /**
     * Get single testimonial
     */
    async show({ params, response }: HttpContext) {
        const testimonial = await db.from('audio_testimonials')
            .where('id', params.id)
            .first()

        if (!testimonial) {
            return response.notFound({ error: 'Témoignage non trouvé' })
        }

        return response.ok({ testimonial })
    }

    /**
     * Create new testimonial with audio upload
     */
    async store({ request, response }: HttpContext) {
        const { product_id, author, location, duration, is_active } = request.only([
            'product_id', 'author', 'location', 'duration', 'is_active'
        ])

        // Handle file upload
        const audioFile = request.file('audio', {
            size: '10mb',
            extnames: ['mp3', 'wav', 'ogg', 'm4a']
        })

        if (!audioFile) {
            return response.badRequest({ error: 'Fichier audio requis' })
        }

        // Create upload directory if not exists
        const uploadDir = path.join(app.publicPath(), 'uploads', 'testimonials')
        await mkdir(uploadDir, { recursive: true })

        // Generate unique filename
        const filename = `${product_id}_${cuid()}.${audioFile.extname}`

        // Move file
        await audioFile.move(uploadDir, { name: filename })

        if (audioFile.state !== 'moved') {
            return response.badRequest({ error: 'Erreur lors du téléchargement' })
        }

        // Get max display order for this product
        const maxOrder = await db.from('audio_testimonials')
            .where('product_id', product_id)
            .max('display_order as max')
            .first()

        const [testimonial] = await db.table('audio_testimonials').insert({
            product_id,
            author,
            location,
            audio_url: `/uploads/testimonials/${filename}`,
            duration: duration || '0:00',
            is_active: is_active !== false,
            display_order: (maxOrder?.max || 0) + 1,
            created_at: DateTime.now().toSQL(),
            updated_at: DateTime.now().toSQL()
        }).returning('*')

        return response.created({ success: true, testimonial })
    }

    /**
     * Update testimonial
     */
    async update({ params, request, response }: HttpContext) {
        const testimonial = await db.from('audio_testimonials')
            .where('id', params.id)
            .first()

        if (!testimonial) {
            return response.notFound({ error: 'Témoignage non trouvé' })
        }

        const updates: Record<string, any> = {}
        const fields = ['author', 'location', 'duration', 'is_active', 'display_order']

        for (const field of fields) {
            if (request.input(field) !== undefined) {
                updates[field] = request.input(field)
            }
        }

        // Handle optional audio update
        const audioFile = request.file('audio', {
            size: '10mb',
            extnames: ['mp3', 'wav', 'ogg', 'm4a']
        })

        if (audioFile) {
            const uploadDir = path.join(app.publicPath(), 'uploads', 'testimonials')
            await mkdir(uploadDir, { recursive: true })

            const filename = `${testimonial.product_id}_${cuid()}.${audioFile.extname}`
            await audioFile.move(uploadDir, { name: filename })

            if (audioFile.state === 'moved') {
                updates.audio_url = `/uploads/testimonials/${filename}`
            }
        }

        updates.updated_at = DateTime.now().toSQL()

        await db.from('audio_testimonials')
            .where('id', params.id)
            .update(updates)

        const updated = await db.from('audio_testimonials').where('id', params.id).first()

        return response.ok({ success: true, testimonial: updated })
    }

    /**
     * Delete testimonial
     */
    async destroy({ params, response }: HttpContext) {
        const testimonial = await db.from('audio_testimonials')
            .where('id', params.id)
            .first()

        if (!testimonial) {
            return response.notFound({ error: 'Témoignage non trouvé' })
        }

        await db.from('audio_testimonials')
            .where('id', params.id)
            .delete()

        // TODO: Delete audio file from disk

        return response.ok({ success: true })
    }

    /**
     * Toggle active status
     */
    async toggle({ params, response }: HttpContext) {
        const testimonial = await db.from('audio_testimonials')
            .where('id', params.id)
            .first()

        if (!testimonial) {
            return response.notFound({ error: 'Témoignage non trouvé' })
        }

        await db.from('audio_testimonials')
            .where('id', params.id)
            .update({
                is_active: !testimonial.is_active,
                updated_at: DateTime.now().toSQL()
            })

        return response.ok({
            success: true,
            is_active: !testimonial.is_active
        })
    }

    /**
     * Reorder testimonials
     */
    async reorder({ request, response }: HttpContext) {
        const { orders } = request.only(['orders']) // [{ id: 1, order: 0 }, { id: 2, order: 1 }]

        if (!orders || !Array.isArray(orders)) {
            return response.badRequest({ error: 'Format invalide' })
        }

        for (const item of orders) {
            await db.from('audio_testimonials')
                .where('id', item.id)
                .update({ display_order: item.order })
        }

        return response.ok({ success: true })
    }
}
