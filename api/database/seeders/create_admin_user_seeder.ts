import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
    async run() {
        // Check if admin exists to avoid duplicates
        const existing = await db.from('admin_users').where('email', 'admin@biosante.store').first()

        if (!existing) {
            console.log('Creating default admin user...')
            await db.table('admin_users').insert({
                name: 'Super Admin',
                email: 'admin@biosante.store',
                password: await hash.make('password'),
                phone: '+2250759091098', // Numéro récupéré du contrôleur Auth
                role: 'super_admin',
                is_active: true,
                created_at: DateTime.now().toSQL(),
                updated_at: DateTime.now().toSQL()
            })
            console.log('Admin user created: admin@biosante.store / password')
        } else {
            console.log('Admin user already exists.')
        }
    }
}
