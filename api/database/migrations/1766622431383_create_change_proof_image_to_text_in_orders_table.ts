import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.alterTable(this.tableName, (_table) => {
      // table.text('proof_image').alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (_table) => {
      // table.string('proof_image', 255).alter()
    })
  }
}