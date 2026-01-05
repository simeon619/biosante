/**
 * Migration Script: Move existing files to Garage S3
 * 
 * This script migrates all files from api/public/uploads/products/ to Garage S3 storage.
 * It also outputs the old -> new URL mapping for database updates if needed.
 * 
 * Usage: npx tsx scripts/migrate-to-garage.ts
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'node:fs/promises'
import path from 'node:path'

const S3_ENDPOINT = process.env.S3_ENDPOINT || 'http://localhost:3900'
const S3_REGION = process.env.S3_REGION || 'garage'
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || 'GKea7dfdf1dc828384153c9d38'
const S3_SECRET_KEY = process.env.S3_SECRET_KEY || '979ad7e98ae2a746425718d56d0cc05c3acfc22daeec6ff805eb57758671d889'
const S3_BUCKET = process.env.S3_BUCKET || 'sante-vitalite-media'
const API_URL = process.env.API_URL || 'http://localhost:3333'

const SOURCE_DIR = path.resolve(import.meta.dirname, '../api/public/uploads/products')

const client = new S3Client({
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
    },
    forcePathStyle: true,
})

interface MigrationResult {
    fileName: string
    oldUrl: string
    newUrl: string
    success: boolean
    error?: string
}

async function migrateFile(fileName: string): Promise<MigrationResult> {
    const filePath = path.join(SOURCE_DIR, fileName)
    const key = `products/${fileName}`
    const oldUrl = `${API_URL}/uploads/products/${fileName}`
    const newUrl = `${API_URL}/api/media/${key}`

    try {
        // Read file
        const fileBuffer = await fs.readFile(filePath)

        // Determine content type
        const ext = path.extname(fileName).toLowerCase()
        const contentTypeMap: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.gif': 'image/gif',
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
        }
        const contentType = contentTypeMap[ext] || 'application/octet-stream'

        // Upload to S3
        const command = new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType,
        })
        await client.send(command)

        console.log(`✅ Migrated: ${fileName}`)
        return { fileName, oldUrl, newUrl, success: true }

    } catch (error) {
        console.error(`❌ Failed: ${fileName}`, error)
        return {
            fileName,
            oldUrl,
            newUrl,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

async function main() {
    console.log('🚀 Starting migration to Garage S3...\n')
    console.log(`Source: ${SOURCE_DIR}`)
    console.log(`Target: ${S3_ENDPOINT}/${S3_BUCKET}\n`)

    // Check if source directory exists
    try {
        await fs.access(SOURCE_DIR)
    } catch {
        console.log('❌ Source directory not found. Nothing to migrate.')
        return
    }

    // Get all files
    const entries = await fs.readdir(SOURCE_DIR, { withFileTypes: true })
    const files = entries
        .filter(entry => entry.isFile() && !entry.name.startsWith('.'))
        .map(entry => entry.name)

    if (files.length === 0) {
        console.log('No files to migrate.')
        return
    }

    console.log(`Found ${files.length} files to migrate\n`)

    // Migrate all files
    const results: MigrationResult[] = []
    for (const file of files) {
        const result = await migrateFile(file)
        results.push(result)
    }

    // Summary
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)

    console.log('\n=========================================')
    console.log(`Migration Complete!`)
    console.log(`✅ Successful: ${successful.length}`)
    console.log(`❌ Failed: ${failed.length}`)
    console.log('=========================================\n')

    if (successful.length > 0) {
        console.log('URL Mapping (for database updates):')
        console.log('------------------------------------')
        for (const result of successful) {
            console.log(`Old: ${result.oldUrl}`)
            console.log(`New: ${result.newUrl}`)
            console.log('')
        }
    }

    // Generate SQL for updating URLs (optional)
    if (successful.length > 0) {
        console.log('\nSQL UPDATE statements (if needed):')
        console.log('-----------------------------------')
        for (const result of successful) {
            console.log(`-- UPDATE products SET image_url = '${result.newUrl}' WHERE image_url = '${result.oldUrl}';`)
        }
    }
}

main().catch(console.error)
