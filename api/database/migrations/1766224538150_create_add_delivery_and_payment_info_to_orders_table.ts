import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('delivery_mode').nullable() // 'local' or 'shipping'
      table.string('payment_method').nullable() // 'cash' or 'online'
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('delivery_mode')
      table.dropColumn('payment_method')
    })
  }
}