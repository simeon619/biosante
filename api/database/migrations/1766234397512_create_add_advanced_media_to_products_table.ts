import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('ingredients_image').nullable()
      table.string('infographic_image').nullable()
      table.jsonb('gallery').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('ingredients_image', 'infographic_image', 'gallery')
    })
  }
}