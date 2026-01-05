import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.defer(async (db) => {
      await db.table('settings').multiInsert([
        {
          key: 'fb_pixel_id',
          value: '',
          label: 'ID du Pixel Facebook',
          type: 'text',
          category: 'marketing',
          description: 'L\'identifiant unique de votre Pixel Facebook'
        },
        {
          key: 'fb_access_token',
          value: '',
          label: 'Jeton d\'accès CAPI Facebook',
          type: 'text',
          category: 'marketing',
          description: 'Le jeton d\'accès pour l\'API de Conversions (CAPI)'
        },
        {
          key: 'fb_test_event_code',
          value: '',
          label: 'Code de test Facebook CAPI',
          type: 'text',
          category: 'marketing',
          description: 'Code utilisé pour tester les événements CAPI dans le gestionnaire d\'événements'
        }
      ])
    })
  }

  async down() {
    this.defer(async (db) => {
      await db.from('settings')
        .whereIn('key', ['fb_pixel_id', 'fb_access_token', 'fb_test_event_code'])
        .delete()
    })
  }
}