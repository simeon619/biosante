import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    // Update BIOACTIF
    await db
      .from('products')
      .where('id', 'bioactif')
      .update({
        image: '/images/bioactif/bioactif-floating.png',
        description: "🌿 Tu souffres d'hypertension, de diabète ou de palpitations ? Notre solution 100% naturelle, issue de la médecine traditionnelle africaine, est là pour toi. Elle agit en profondeur pour réguler votre organisme et vous redonner vitalité.",
        benefits: JSON.stringify([
          'Réguler la tension artérielle',
          'Contrôler le taux de sucre dans le sang',
          'Détendre les nerfs et réduire le stress',
          'Diminuer le gonflement des pieds',
          'Réduire les palpitations et cardiaque'
        ])
      })

    // Update VITAMAX
    await db
      .from('products')
      .where('id', 'vitamax')
      .update({
        image: '/images/vitamax/vitamax-floating.png',
        description: "🌿 Soulagez naturellement les problèmes de prostate ! 🌿 Découvrez notre remède 100% naturel et bio conçu spécialement pour favoriser la santé de la prostate et votre confort urinaire.",
        benefits: JSON.stringify([
          'Soulage les gênes urinaires',
          'Soutient la vitalité masculine',
          'Plantes médicinales puissantes',
          'Sans effets secondaires – 100% naturel'
        ])
      })
  }
}