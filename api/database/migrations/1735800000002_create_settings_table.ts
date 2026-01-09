import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'settings'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.string('key', 100).primary()
            table.text('value').notNullable()
            table.string('label', 255).notNullable()
            table.string('type', 50).defaultTo('text') // text, phone, email, number, boolean, json
            table.string('category', 100).defaultTo('general')
            table.text('description').nullable()
            table.timestamp('updated_at')
        })

        // Insert default settings
        this.defer(async (db) => {
            await db.table('settings').multiInsert([
                // Payment Settings
                {
                    key: 'payment_wave_number',
                    value: '+2250759091098',
                    label: 'Numéro Wave (paiement)',
                    type: 'phone',
                    category: 'payment',
                    description: 'Numéro pour recevoir les paiements Wave'
                },
                {
                    key: 'payment_orange_number',
                    value: '+2250707631861',
                    label: 'Numéro Orange Money',
                    type: 'phone',
                    category: 'payment',
                    description: 'Numéro pour recevoir les paiements Orange Money'
                },
                {
                    key: 'payment_mtn_number',
                    value: '+2250759091098',
                    label: 'Numéro MTN Money',
                    type: 'phone',
                    category: 'payment',
                    description: 'Numéro pour recevoir les paiements MTN Money'
                },
                {
                    key: 'payment_moov_number',
                    value: '+2250759091098',
                    label: 'Numéro Moov Money',
                    type: 'phone',
                    category: 'payment',
                    description: 'Numéro pour recevoir les paiements Moov Money'
                },
                // Contact Settings
                {
                    key: 'contact_customer_service',
                    value: '+2250759091098',
                    label: 'Service client',
                    type: 'phone',
                    category: 'contact',
                    description: 'Numéro principal du service client'
                },
                {
                    key: 'contact_whatsapp',
                    value: '+2250759091098',
                    label: 'WhatsApp',
                    type: 'phone',
                    category: 'contact',
                    description: 'Numéro WhatsApp pour le support'
                },
                {
                    key: 'contact_email',
                    value: 'contact@sante-vitalite.com',
                    label: 'Email de contact',
                    type: 'email',
                    category: 'contact',
                    description: 'Email principal de contact'
                },
                // SMS Settings
                {
                    key: 'sms_sender_number',
                    value: '+2250759091098',
                    label: 'N° expéditeur SMS',
                    type: 'phone',
                    category: 'sms',
                    description: 'Numéro depuis lequel les SMS sont envoyés (httpSMS)'
                },
                {
                    key: 'sms_admin_otp_number',
                    value: '+2250759091098',
                    label: 'N° OTP Admin',
                    type: 'phone',
                    category: 'sms',
                    description: 'Numéro autorisé pour recevoir les OTP admin'
                },
                // Delivery Settings
                {
                    key: 'delivery_local_fee',
                    value: '1400',
                    label: 'Frais livraison locale',
                    type: 'number',
                    category: 'delivery',
                    description: 'Frais de livraison pour Abidjan (FCFA)'
                },
                {
                    key: 'delivery_interior_fee',
                    value: '3500',
                    label: 'Frais livraison intérieur',
                    type: 'number',
                    category: 'delivery',
                    description: 'Frais de livraison pour les villes de l\'intérieur (FCFA)'
                },
                {
                    key: 'delivery_free_threshold',
                    value: '25000',
                    label: 'Seuil livraison gratuite',
                    type: 'number',
                    category: 'delivery',
                    description: 'Montant minimum pour la livraison gratuite (FCFA)'
                },
                // Business Settings
                {
                    key: 'business_name',
                    value: 'BIO SANTÉ',
                    label: 'Nom de l\'entreprise',
                    type: 'text',
                    category: 'business',
                    description: 'Nom affiché sur le site et les communications'
                },
                {
                    key: 'business_address',
                    value: 'Cocody, Abidjan, Côte d\'Ivoire',
                    label: 'Adresse',
                    type: 'text',
                    category: 'business',
                    description: 'Adresse physique de l\'entreprise'
                },
                {
                    key: 'business_hours',
                    value: 'Lun - Sam : 08:30 - 18:30',
                    label: 'Horaires d\'ouverture',
                    type: 'text',
                    category: 'business',
                    description: 'Heures d\'ouverture de l\'entreprise'
                }
            ])
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
