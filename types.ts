export enum Category {
  HYPERTENSION = 'Hypertension & Diabète',
  DIABETES = 'Diabète',
  PROSTATE = 'Prostate & Urinaire',
  WELLNESS = 'Bien-être Général'
}

export interface AudioTestimonial {
  id: string;
  author: string;
  location: string;
  duration: string;
  url: string; // URL to the audio file
}

export interface Product {
  id: string;
  name: string;
  tagline: string; // New: Short catchy text like "Diabète • Hypertension"
  description: string;
  price: number;
  category: Category;
  image: string;
  ingredients_image?: string;
  infographic_image?: string;
  gallery?: string[];
  benefits: string[];
  inStock: boolean;
  themeColor: string; // New: e.g., "bg-red-50"
  badgeColor: string; // New: e.g., "bg-red-100 text-red-800"
  testimonials: AudioTestimonial[]; // New: Audio reviews
}

export interface CartItem extends Product {
  quantity: number;
}

export type ViewState = 'home' | 'products' | 'about' | 'contact' | 'checkout';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface DeliveryEstimate {
  fee: number;
  currency: string;
  distanceKm: number;
  timeMinutes: number;
  destination: {
    lat: number;
    lon: number;
    address: string;
  };
}