
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deliveries'

  async up() {
    // 1. Enable PostGIS Extension
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS postgis')

    // 2. Create Table
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('order_id').notNullable().index()
      table.string('address_full').notNullable()

      // Geometry Column: Point (Long, Lat), SRID 4326 (GPS)
      table.specificType('location', 'geometry(Point, 4326)').notNullable()

      table.decimal('delivery_fee', 10, 2).defaultTo(0)
      table.string('status').defaultTo('pending') // pending, assigned, delivered, cancelled

      table.string('customer_name').nullable()
      table.string('customer_phone').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    // Optional: Drop extension if you want to clean up completely
    // await this.db.rawQuery('DROP EXTENSION IF EXISTS postgis') 
  }
}