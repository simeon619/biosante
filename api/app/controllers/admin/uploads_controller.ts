import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import StorageService from '#services/storage_service'

export default class AdminUploadsController {
    private storage: StorageService

    constructor() {
        this.storage = new StorageService()
    }

    /**
     * Upload an image to S3-compatible storage (Garage)
     */
    async upload({ request, response }: HttpContext) {
        const image = request.file('image', {
            size: '10mb', // Increased limit for larger files
            extnames: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
        })

        if (!image) {
            return response.badRequest({ error: 'Aucune image n\'a été fournie.' })
        }

        if (!image.isValid) {
            return response.badRequest({
                error: 'Image invalide ou trop volumineuse (max 10MB).',
                details: image.errors
            })
        }

        try {
            // Read file content
            const fileBuffer = await fs.readFile(image.tmpPath!)

            // Generate unique filename with path
            const fileName = `${randomUUID()}.${image.extname}`
            const key = `products/${fileName}`

            // Get content type
            const contentType = image.headers['content-type'] || `image/${image.extname}`

            // Upload to S3
            await this.storage.upload(key, fileBuffer, contentType)

            // Return the proxy URL (through our API, not directly from S3)
            const baseUrl = process.env.API_URL || 'https://api.biosante.sublymus.com'
            const imageUrl = `${baseUrl}/api/media/${key}`

            return response.ok({
                success: true,
                url: imageUrl,
                fileName: fileName,
                key: key
            })
        } catch (error) {
            console.error('[AdminUploadsController] Upload error:', error)
            return response.internalServerError({
                error: 'Erreur lors de l\'upload de l\'image.',
                details: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    /**
     * Delete an image from storage
     */
    async delete({ request, response }: HttpContext) {
        const { key, url } = request.only(['key', 'url'])

        try {
            let objectKey = key

            // If URL provided instead of key, extract key from URL
            if (!objectKey && url) {
                objectKey = this.storage.extractKeyFromUrl(url)
            }

            if (!objectKey) {
                return response.badRequest({ error: 'Clé ou URL requise.' })
            }

            await this.storage.delete(objectKey)

            return response.ok({
                success: true,
                message: 'Image supprimée avec succès.'
            })
        } catch (error) {
            console.error('[AdminUploadsController] Delete error:', error)
            return response.internalServerError({
                error: 'Erreur lors de la suppression de l\'image.',
                details: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    /**
     * Upload a video to S3-compatible storage
     */
    async uploadVideo({ request, response }: HttpContext) {
        const video = request.file('video', {
            size: '100mb', // 100MB limit for videos
            extnames: ['mp4', 'webm', 'mov', 'avi'],
        })

        if (!video) {
            return response.badRequest({ error: 'Aucune vidéo n\'a été fournie.' })
        }

        if (!video.isValid) {
            return response.badRequest({
                error: 'Vidéo invalide ou trop volumineuse (max 100MB).',
                details: video.errors
            })
        }

        try {
            // Read file content
            const fileBuffer = await fs.readFile(video.tmpPath!)

            // Generate unique filename with path
            const fileName = `${randomUUID()}.${video.extname}`
            const key = `videos/${fileName}`

            // Get content type
            const contentType = video.headers['content-type'] || `video/${video.extname}`

            // Upload to S3
            const videoUrl = await this.storage.upload(key, fileBuffer, contentType)

            return response.ok({
                success: true,
                url: videoUrl,
                fileName: fileName,
                key: key
            })
        } catch (error) {
            console.error('[AdminUploadsController] Video upload error:', error)
            return response.internalServerError({
                error: 'Erreur lors de l\'upload de la vidéo.',
                details: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }
}