import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'admin_users'

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            // Add phone number for OTP auth
            table.string('phone', 20).nullable().unique()

            // OTP fields
            table.string('otp_code', 6).nullable()
            table.timestamp('otp_expires_at').nullable()

            // Make email and password nullable (migrating to OTP)
            // table.string('email', 255).nullable().alter()
            // table.string('password', 255).nullable().alter()
            this.schema.raw('ALTER TABLE "admin_users" ALTER COLUMN "email" DROP NOT NULL')
            this.schema.raw('ALTER TABLE "admin_users" ALTER COLUMN "password" DROP NOT NULL')
        })
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('phone')
            table.dropColumn('otp_code')
            table.dropColumn('otp_expires_at')

            // Restore NOT NULL constraints
            table.string('email', 255).notNullable().alter()
            table.string('password', 255).notNullable().alter()
        })
    }
}
