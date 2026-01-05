import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * Storage Service for S3-compatible storage (Garage)
 */
export default class StorageService {
    private client: S3Client
    private bucket: string
    private endpoint: string

    constructor() {
        this.endpoint = process.env.S3_ENDPOINT || 'http://localhost:3900'
        this.bucket = process.env.S3_BUCKET || 'sante-vitalite-media'

        this.client = new S3Client({
            endpoint: this.endpoint,
            region: process.env.S3_REGION || 'garage',
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY || '',
                secretAccessKey: process.env.S3_SECRET_KEY || '',
            },
            forcePathStyle: true, // Required for Garage and most S3-compatible storage
        })
    }

    /**
     * Upload a file to S3 and return a signed URL for access
     * @param key - The key (path) for the object
     * @param body - The file content as Buffer
     * @param contentType - The MIME type of the file
     * @returns A signed URL for accessing the uploaded file (valid for 7 days)
     */
    async upload(key: string, body: Buffer, contentType: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
        })

        await this.client.send(command)

        // Return a signed URL (valid for 7 days = 604800 seconds)
        return this.getSignedReadUrl(key, 604800)
    }

    /**
     * Get a pre-signed URL for reading/downloading a file
     * @param key - The key (path) of the object
     * @param expiresIn - URL expiration in seconds (default: 7 days)
     */
    async getSignedReadUrl(key: string, expiresIn = 604800): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        })

        return getSignedUrl(this.client, command, { expiresIn })
    }

    /**
     * Delete a file from S3
     * @param key - The key (path) of the object to delete
     */
    async delete(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        })

        await this.client.send(command)
    }

    /**
     * Get a pre-signed URL for uploading directly from client
     * @param key - The key (path) for the object
     * @param contentType - The MIME type of the file
     * @param expiresIn - URL expiration in seconds (default: 1 hour)
     */
    async getPresignedUploadUrl(key: string, contentType: string, expiresIn = 3600): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType,
        })

        return getSignedUrl(this.client, command, { expiresIn })
    }

    /**
     * Get the public URL for a file (unsigned - may return 403)
     * @param key - The key (path) of the object
     */
    getPublicUrl(key: string): string {
        return `${this.endpoint}/${this.bucket}/${key}`
    }

    /**
     * Extract the key from a full URL
     * @param url - The full S3 URL
     */
    extractKeyFromUrl(url: string): string | null {
        const bucketPrefix = `${this.endpoint}/${this.bucket}/`
        if (url.startsWith(bucketPrefix)) {
            return url.substring(bucketPrefix.length)
        }
        // Also handle URLs that might be proxied through our API
        const apiPrefix = `/api/media/`
        if (url.includes(apiPrefix)) {
            const startIndex = url.indexOf(apiPrefix) + apiPrefix.length
            return url.substring(startIndex)
        }
        return null
    }

    /**
     * Get object content from S3
     * @param key - The key (path) of the object
     * @returns The object body as a readable stream and content type
     */
    async getObject(key: string): Promise<{ body: ReadableStream | null; contentType: string }> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        })

        const response = await this.client.send(command)
        return {
            body: response.Body?.transformToWebStream() || null,
            contentType: response.ContentType || 'application/octet-stream'
        }
    }
}
