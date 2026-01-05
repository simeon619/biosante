
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('orders', (table) => {
      table.string('paytech_token').nullable().unique()
    })
    this.schema.alterTable('payments', (table) => {
      table.string('paytech_token').nullable().unique()
    })
  }

  async down() {
    this.schema.alterTable('orders', (table) => {
      table.dropColumn('paytech_token')
    })
    this.schema.alterTable('payments', (table) => {
      table.dropColumn('paytech_token')
    })
  }
}