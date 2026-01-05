import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'notifications'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

            // Idempotency key for deduplication (pillar 2)
            table.string('idempotency_key', 255).notNullable().unique()

            // Notification type: email, sms, push, admin_alert
            table.string('type', 50).notNullable().index()

            // Recipient (email, phone, or admin_id)
            table.string('recipient', 255).notNullable()

            // Notification payload (JSON)
            table.jsonb('payload').notNullable()

            // Status tracking (pillar 5)
            table.enum('status', ['pending', 'queued', 'processing', 'sent', 'delivered', 'failed']).notNullable().defaultTo('pending').index()

            // Retry tracking (pillar 3)
            table.integer('attempts').notNullable().defaultTo(0)
            table.integer('max_attempts').notNullable().defaultTo(5)
            table.timestamp('last_attempt_at').nullable()
            table.timestamp('next_retry_at').nullable()

            // Dead Letter Queue flag (pillar 3)
            table.boolean('in_dlq').notNullable().defaultTo(false)

            // Error info
            table.text('last_error').nullable()

            // Related entity (optional)
            table.string('entity_type', 50).nullable() // order, payment, etc.
            table.string('entity_id', 50).nullable()

            // Timestamps
            table.timestamp('created_at').notNullable()
            table.timestamp('updated_at').notNullable()
            table.timestamp('sent_at').nullable()
            table.timestamp('delivered_at').nullable()
        })

        // Index for retry queries
        this.schema.raw('CREATE INDEX idx_notifications_retry ON notifications (status, next_retry_at) WHERE status IN (\'pending\', \'failed\')')
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
