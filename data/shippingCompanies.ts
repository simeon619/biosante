import shippingCompaniesData from '../exp_cie.json';

export interface ShippingCompany {
    id: string;
    name: string;
    hub_principal: string;
    type: string;
    regions_desservies: string[];
    contact_colis: string;
    destinations: string[];
}

// Typed data
export const shippingCompanies: ShippingCompany[] = shippingCompaniesData as ShippingCompany[];

// Find companies that serve a specific city
export function findCompaniesByCity(city: string): ShippingCompany[] {
    const normalizedCity = city.toLowerCase().trim();
    return shippingCompanies.filter(company =>
        company.destinations.some(dest => dest.toLowerCase().includes(normalizedCity))
    );
}

// Get all unique destinations (cities) from all companies
export function getAllDestinations(): string[] {
    const allDestinations = new Set<string>();
    shippingCompanies.forEach(company => {
        company.destinations.forEach(dest => {
            // Exclude "Abidjan" since it's the local zone
            if (dest.toLowerCase() !== 'abidjan') {
                allDestinations.add(dest);
            }
        });
    });
    return Array.from(allDestinations).sort();
}

// Abidjan area communes for local delivery
export const ABIDJAN_AREA = [
    'Abidjan',
    'Plateau',
    'Cocody',
    'Marcory',
    'Treichville',
    'Yopougon',
    'Abobo',
    'Adjamé',
    'Koumassi',
    'Port-Bouët',
    'Anyama',
    'Bingerville',
    'Grand-Bassam',
    'Songon',
    'Brofodoumé',
    'Dabou',
    'Assinie'
];

// Check if a location is in the Abidjan area
export function isInAbidjanArea(location: string): boolean {
    const normalizedLocation = location.toLowerCase().trim();
    return ABIDJAN_AREA.some(area => normalizedLocation.includes(area.toLowerCase()));
}
