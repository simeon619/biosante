
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'orders'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            // Primary Key - UUID for better uniqueness
            table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

            // Customer Information
            table.string('customer_name').notNullable()
            table.string('customer_phone').notNullable()
            table.string('customer_email').nullable()

            // Delivery Address
            table.string('address_full').notNullable()
            table.decimal('lat', 10, 7).nullable()
            table.decimal('lon', 10, 7).nullable()
            table.text('address_note').nullable()

            // Order Items (stored as JSONB for flexibility)
            table.jsonb('items').notNullable()

            // Amounts (in XOF - no decimals needed but using decimal for safety)
            table.decimal('subtotal', 12, 0).notNullable()
            table.decimal('delivery_fee', 12, 0).notNullable().defaultTo(0)
            table.decimal('discount', 12, 0).notNullable().defaultTo(0)
            table.decimal('total', 12, 0).notNullable()

            // Status: pending, paid, cancelled, delivered
            table.string('status').notNullable().defaultTo('pending').index()

            // Payment Reference (set after Moneroo initialization)
            table.string('moneroo_payment_id').nullable().unique()

            // Timestamps
            table.timestamp('created_at').notNullable()
            table.timestamp('updated_at').notNullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
