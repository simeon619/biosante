import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'admin_users'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.string('email', 255).notNullable().unique()
            table.string('password', 255).notNullable()
            table.string('name', 255).notNullable()

            // Role: admin, super_admin
            table.enum('role', ['admin', 'super_admin']).notNullable().defaultTo('admin')

            // Status
            table.boolean('is_active').notNullable().defaultTo(true)

            // Session tracking
            table.timestamp('last_login_at').nullable()

            // Timestamps
            table.timestamp('created_at').notNullable()
            table.timestamp('updated_at').notNullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
