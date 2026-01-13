import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import StorageService from '#services/storage_service'

export default class AdminTestimonialsController {
    private storage: StorageService

    constructor() {
        this.storage = new StorageService()
    }

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
     * Create new testimonial with audio/image upload to S3
     */
    async store({ request, response }: HttpContext) {
        const { product_id, author, location, duration, is_active, text_content } = request.only([
            'product_id', 'author', 'location', 'duration', 'is_active', 'text_content'
        ])

        const baseUrl = process.env.BACKEND_URL || process.env.APP_URL || 'https://api-biosante.sublymus.com'

        // Handle audio file upload
        const audioFile = request.file('audio', {
            size: '20mb',
            extnames: ['mp3', 'wav', 'ogg', 'm4a', 'webm']
        })

        let audioUrl: string | null = null

        if (audioFile && audioFile.isValid) {
            try {
                const fileBuffer = await fs.readFile(audioFile.tmpPath!)
                const fileName = `${randomUUID()}.${audioFile.extname}`
                const key = `testimonials/audio/${fileName}`
                const contentType = audioFile.headers['content-type'] || `audio/${audioFile.extname}`

                await this.storage.upload(key, fileBuffer, contentType)
                audioUrl = `${baseUrl}/api/media/${key}`
            } catch (error) {
                console.error('[Testimonials] Audio upload error:', error)
                return response.internalServerError({ error: 'Erreur upload audio' })
            }
        }

        // Handle author image upload
        const imageFile = request.file('author_image', {
            size: '10mb',
            extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif']
        })

        let authorImageUrl: string | null = null

        if (imageFile && imageFile.isValid) {
            try {
                const fileBuffer = await fs.readFile(imageFile.tmpPath!)
                const fileName = `${randomUUID()}.${imageFile.extname}`
                const key = `testimonials/images/${fileName}`
                const contentType = imageFile.headers['content-type'] || `image/${imageFile.extname}`

                await this.storage.upload(key, fileBuffer, contentType)
                authorImageUrl = `${baseUrl}/api/media/${key}`
            } catch (error) {
                console.error('[Testimonials] Image upload error:', error)
                return response.internalServerError({ error: 'Erreur upload image' })
            }
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
            audio_url: audioUrl || '',
            duration: duration || '0:00',
            is_active: is_active !== false,
            display_order: (maxOrder?.max || 0) + 1,
            text_content: text_content || null,
            author_image: authorImageUrl || null,
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

        const baseUrl = process.env.BACKEND_URL || process.env.APP_URL || 'https://api-biosante.sublymus.com'

        const updates: Record<string, any> = {}
        const fields = ['author', 'location', 'duration', 'is_active', 'display_order', 'text_content']

        for (const field of fields) {
            if (request.input(field) !== undefined) {
                updates[field] = request.input(field)
            }
        }

        // Handle optional audio update
        const audioFile = request.file('audio', {
            size: '20mb',
            extnames: ['mp3', 'wav', 'ogg', 'm4a', 'webm']
        })

        if (audioFile && audioFile.isValid) {
            try {
                const fileBuffer = await fs.readFile(audioFile.tmpPath!)
                const fileName = `${randomUUID()}.${audioFile.extname}`
                const key = `testimonials/audio/${fileName}`
                const contentType = audioFile.headers['content-type'] || `audio/${audioFile.extname}`

                await this.storage.upload(key, fileBuffer, contentType)
                updates.audio_url = `${baseUrl}/api/media/${key}`
            } catch (error) {
                console.error('[Testimonials] Audio update error:', error)
            }
        }

        // Handle optional image update
        const imageFile = request.file('author_image', {
            size: '10mb',
            extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif']
        })

        if (imageFile && imageFile.isValid) {
            try {
                const fileBuffer = await fs.readFile(imageFile.tmpPath!)
                const fileName = `${randomUUID()}.${imageFile.extname}`
                const key = `testimonials/images/${fileName}`
                const contentType = imageFile.headers['content-type'] || `image/${imageFile.extname}`

                await this.storage.upload(key, fileBuffer, contentType)
                updates.author_image = `${baseUrl}/api/media/${key}`
            } catch (error) {
                console.error('[Testimonials] Image update error:', error)
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

        // Delete files from S3 if they exist
        if (testimonial.audio_url) {
            const key = this.storage.extractKeyFromUrl(testimonial.audio_url)
            if (key) {
                try {
                    await this.storage.delete(key)
                } catch (error) {
                    console.error('[Testimonials] Failed to delete audio:', error)
                }
            }
        }

        if (testimonial.author_image) {
            const key = this.storage.extractKeyFromUrl(testimonial.author_image)
            if (key) {
                try {
                    await this.storage.delete(key)
                } catch (error) {
                    console.error('[Testimonials] Failed to delete image:', error)
                }
            }
        }

        await db.from('audio_testimonials')
            .where('id', params.id)
            .delete()

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
