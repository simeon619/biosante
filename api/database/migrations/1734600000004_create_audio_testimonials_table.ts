import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'audio_testimonials'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            // Product reference
            table.string('product_id', 50).notNullable().index() // bioactif, vitamax

            // Author info
            table.string('author', 255).notNullable()
            table.string('location', 255).notNullable()

            // Audio file
            table.string('audio_url', 500).notNullable()
            table.string('duration', 10).notNullable() // "1:23" format

            // Status
            table.boolean('is_active').notNullable().defaultTo(true)
            table.integer('display_order').notNullable().defaultTo(0)

            // Timestamps
            table.timestamp('created_at').notNullable()
            table.timestamp('updated_at').notNullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
