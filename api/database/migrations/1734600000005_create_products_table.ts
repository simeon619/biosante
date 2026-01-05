import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'products'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.string('id').primary() // Slug like 'bioactif'
            table.string('name').notNullable()
            table.integer('price').notNullable()
            table.integer('stock').defaultTo(0)
            table.text('description').nullable()
            table.boolean('is_active').defaultTo(true)

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
