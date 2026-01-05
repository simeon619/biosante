import type { HttpContext } from '@adonisjs/core/http'
import StorageService from '#services/storage_service'

/**
 * Controller to serve media files from S3 storage
 * This acts as a proxy to serve files that require authentication in S3
 */
export default class MediaController {
    private storage: StorageService

    constructor() {
        this.storage = new StorageService()
    }

    /**
     * Serve a media file from S3
     * @route GET /api/media/*
     */
    async serve({ params, response }: HttpContext) {
        // Get the key from the wildcard param (everything after /api/media/)
        const key = params['*'].join('/')

        if (!key) {
            return response.notFound({ error: 'No file path specified' })
        }

        try {
            const { body, contentType } = await this.storage.getObject(key)

            if (!body) {
                return response.notFound({ error: 'File not found' })
            }

            // Set appropriate headers
            response.header('Content-Type', contentType)
            response.header('Cache-Control', 'public, max-age=31536000') // 1 year cache
            response.header('Access-Control-Allow-Origin', '*')

            // Stream the response
            const reader = body.getReader()
            const chunks: Uint8Array[] = []

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                chunks.push(value)
            }

            const buffer = Buffer.concat(chunks)
            return response.send(buffer)
        } catch (error) {
            console.error('[MediaController] Error serving file:', error)

            if (error instanceof Error && error.name === 'NoSuchKey') {
                return response.notFound({ error: 'File not found' })
            }

            return response.internalServerError({
                error: 'Error retrieving file',
                details: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }
}
