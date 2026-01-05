
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'user_addresses'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
            table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
            table.string('label').notNullable() // e.g., "Domicile", "Travail"
            table.text('address_full').notNullable()
            table.decimal('lat', 10, 7).notNullable()
            table.decimal('lon', 10, 7).notNullable()
            table.boolean('is_default').defaultTo(false)

            table.timestamp('created_at').notNullable()
            table.timestamp('updated_at').notNullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
