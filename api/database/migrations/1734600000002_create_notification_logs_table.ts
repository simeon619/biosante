import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'notification_logs'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            // Reference to notification
            table.uuid('notification_id').notNullable().references('id').inTable('notifications').onDelete('CASCADE')

            // Event type: queued, processing, sent, delivered, failed, retry, dlq
            table.string('event', 50).notNullable().index()

            // Event details (provider response, error, etc.)
            table.jsonb('details').nullable()

            // Provider info (for external sends)
            table.string('provider', 50).nullable() // sendgrid, twilio, etc.
            table.string('provider_message_id', 255).nullable()

            // Timestamp
            table.timestamp('created_at').notNullable()
        })

        // Index for log retrieval by notification
        this.schema.raw('CREATE INDEX idx_notification_logs_notification_id ON notification_logs (notification_id, created_at DESC)')
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
