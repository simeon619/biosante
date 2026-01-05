
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'payments'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            // Link to order
            table.uuid('order_id').notNullable().references('id').inTable('orders').onDelete('CASCADE')

            // Moneroo Payment Reference
            table.string('moneroo_payment_id').notNullable().unique()

            // Amount & Currency
            table.decimal('amount', 12, 0).notNullable()
            table.string('currency', 3).notNullable().defaultTo('XOF')

            // Status: initiated, pending, success, failed, cancelled
            table.string('status').notNullable().defaultTo('initiated').index()

            // Payment Method (wave_ci, mtn_ci, orange_ci, moov_ci, etc.)
            table.string('payment_method').nullable()

            // Tracking timestamps
            table.timestamp('webhook_received_at').nullable()
            table.timestamp('verified_at').nullable()

            // Store raw webhook data for debugging/auditing
            table.jsonb('raw_webhook_data').nullable()

            // Failure info
            table.string('failure_reason').nullable()

            // Timestamps
            table.timestamp('created_at').notNullable()
            table.timestamp('updated_at').notNullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
