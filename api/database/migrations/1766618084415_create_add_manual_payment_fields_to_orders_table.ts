import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('manual_payment_status').nullable().defaultTo('pending') // pending, verifying, success, failed
      table.string('transaction_ref').nullable().unique()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('manual_payment_status')
      table.dropColumn('transaction_ref')
    })
  }
}