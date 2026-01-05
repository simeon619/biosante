/**
 * Settings API - Fetches public settings from the backend
 */

export interface PublicSettings {
    // Delivery
    delivery_local_fee: number;
    delivery_interior_fee: number;
    delivery_free_threshold: number;
    delivery: {
        local: number;
        interior: number;
        freeThreshold: number;
    };
    // Payment numbers
    payment_wave_number: string;
    payment_orange_number: string;
    payment_mtn_number: string;
    payment_moov_number: string;
    payment: {
        wave: string;
        orange: string;
        mtn: string;
        moov: string;
    };
    // Contact
    contact_customer_service: string;
    contact_whatsapp: string;
    contact_email: string;
    contact: {
        phone: string;
        whatsapp: string;
        email: string;
    };
    // Business
    business_name: string;
    business_address: string;
    business: {
        name: string;
        address: string;
    };
    fb_pixel_id?: string;
}

// Default settings (fallback)
export const defaultSettings: PublicSettings = {
    delivery_local_fee: 1400,
    delivery_interior_fee: 3500,
    delivery_free_threshold: 25000,
    delivery: {
        local: 1400,
        interior: 3500,
        freeThreshold: 25000,
    },
    payment_wave_number: '+2250507859953',
    payment_orange_number: '+2250707631861',
    payment_mtn_number: '+2250507859953',
    payment_moov_number: '+2250507859953',
    payment: {
        wave: '+2250507859953',
        orange: '+2250707631861',
        mtn: '+2250507859953',
        moov: '+2250507859953',
    },
    contact_customer_service: '+2250507859953',
    contact_whatsapp: '+2250507859953',
    contact_email: 'contact@sante-vitalite.com',
    contact: {
        phone: '+2250507859953',
        whatsapp: '+2250507859953',
        email: 'contact@sante-vitalite.com',
    },
    business_name: 'BIO SANTÉ',
    business_address: 'Cocody, Abidjan, Côte d\'ivoire',
    business: {
        name: 'BIO SANTÉ',
        address: 'Cocody, Abidjan, Côte d\'ivoire',
    },
    fb_pixel_id: '',
};

// Cache for settings
let cachedSettings: PublicSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch public settings from the API
 */
export async function getPublicSettings(): Promise<PublicSettings> {
    // Return cached if valid
    if (cachedSettings && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return cachedSettings;
    }

    try {
        const { API_URL } = await import('@/lib/utils');
        const response = await fetch(`${API_URL}/api/settings/public`);
        if (!response.ok) {
            throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        const settings = { ...defaultSettings, ...data };
        cachedSettings = settings;
        cacheTimestamp = Date.now();
        return settings;
    } catch (error) {
        console.error('[Settings] Failed to fetch public settings:', error);
        return defaultSettings;
    }
}

/**
 * Clear the settings cache (useful after admin updates)
 */
export function clearSettingsCache(): void {
    cachedSettings = null;
    cacheTimestamp = 0;
}

/**
 * Get payment number for a specific provider
 */
export function getPaymentNumber(settings: PublicSettings, provider: string): string {
    switch (provider.toLowerCase()) {
        case 'wave':
            return settings.payment.wave;
        case 'orange':
        case 'orange_money':
            return settings.payment.orange;
        case 'mtn':
        case 'mtn_money':
            return settings.payment.mtn;
        case 'moov':
        case 'moov_money':
            return settings.payment.moov;
        default:
            return settings.contact.phone;
    }
}

/**
 * Format phone number for display
 */
export function formatPhoneDisplay(phone: string): string {
    // +2250507859953 -> +225 05 07 85 99 53
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 13 && cleaned.startsWith('225')) {
        const rest = cleaned.substring(3);
        return '+225 ' + rest.match(/.{1,2}/g)?.join(' ') || phone;
    }
    return phone;
}
