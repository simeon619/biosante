import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'payments'

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            // Make old fields nullable or rename them if necessary
            // table.string('moneroo_payment_id').nullable().alter()
            // Use raw SQL for CockroachDB compatibility (avoids "ALTER COLUMN TYPE" error)
            this.schema.raw('ALTER TABLE "payments" ALTER COLUMN "moneroo_payment_id" DROP NOT NULL')

            // Add new required fields
            table.string('provider').nullable() // wave, orange, mtn, moov
            table.string('reference').nullable().unique() // The user-entered reference
            table.decimal('amount_expected', 12, 0).nullable()
            table.integer('trust_score').defaultTo(0)
            table.string('rejection_reason').nullable()
            table.integer('validated_by').unsigned().nullable().references('id').inTable('admin_users')

            // Update status to support new values if needed (index already exists)
            // table.string('status', 20).defaultTo('pending').alter()
        })
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('provider')
            table.dropColumn('reference')
            table.dropColumn('amount_expected')
            table.dropColumn('trust_score')
            table.dropColumn('rejection_reason')
            table.dropColumn('validated_by')
            table.string('moneroo_payment_id').notNullable().alter()
        })
    }
}
