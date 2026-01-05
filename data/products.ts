import { Product, Category } from '../types';

export const products: Product[] = [
  {
    id: 'bioactif',
    name: 'BioActif',
    tagline: 'DIABÈTE • HYPERTENSION',
    description: "🌿 Tu souffres d'hypertension, de diabète ou de palpitations ? Notre solution 100% naturelle, issue de la médecine traditionnelle africaine, est là pour toi. Elle agit en profondeur pour réguler votre organisme et vous redonner vitalité.",
    price: 12000,
    category: Category.HYPERTENSION,
    // Updated with high-quality assets
    image: '/images/bioactif/bioactif-floating.png',
    gallery: [
      '/images/bioactif/bioactif-lifestyle-woman.jpg',
      '/images/bioactif/bioactif-infographic.jpg',
      '/images/bioactif/bioactif-lifestyle-monitor.jpg'
    ],
    benefits: [
      'Réguler la tension artérielle',
      'Contrôler le taux de sucre dans le sang',
      'Détendre les nerfs et réduire le stress',
      'Diminuer le gonflement des pieds',
      'Réduire les palpitations et cardiaque'
    ],
    inStock: true,
    themeColor: 'bg-rose-50',
    badgeColor: 'bg-rose-100 text-rose-800',
    testimonials: [
      {
        id: 't1',
        author: 'Moussa K.',
        location: 'Abidjan',
        duration: '0:45',
        url: '#' // Placeholder audio link
      },
      {
        id: 't2',
        author: 'Aminata D.',
        location: 'Bouaké',
        duration: '1:12',
        url: '#' // Placeholder audio link
      }
    ]
  },
  {
    id: 'vitamax',
    name: 'VitaMax',
    tagline: 'PROSTATE • TROUBLES URINAIRES',
    description: "🌿 Soulagez naturellement les problèmes de prostate ! 🌿 Découvrez notre remède 100% naturel et bio conçu spécialement pour favoriser la santé de la prostate et votre confort urinaire.",
    price: 15000,
    category: Category.PROSTATE,
    // Updated with high-quality assets
    image: '/images/vitamax/vitamax-floating.png',
    gallery: [
      '/images/vitamax/vitamax-lifestyle-happy.jpg',
      '/images/vitamax/vitamax-infographic.jpg',
      '/images/vitamax/vitamax-lifestyle-tablet.jpg'
    ],
    benefits: [
      'Soulage les gênes urinaires',
      'Soutient la vitalité masculine',
      'Plantes médicinales puissantes',
      'Sans effets secondaires – 100% naturel'
    ],
    inStock: true,
    themeColor: 'bg-emerald-50',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    testimonials: [
      {
        id: 't3',
        author: 'Jean-Paul B.',
        location: 'Yopougon',
        duration: '0:58',
        url: '#' // Placeholder audio link
      },
      {
        id: 't4',
        author: 'Kouassi Y.',
        location: 'San-Pédro',
        duration: '1:05',
        url: '#' // Placeholder audio link
      }
    ]
  }
];