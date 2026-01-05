import React from 'react';

export function OrganizationJsonLd() {
    const organizationData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'BIO SANTÉ',
        url: 'https://sante-vitalite.ci',
        logo: 'https://sante-vitalite.ci/logo.png', // Fallback to a known path
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+2250707070707', // Placeholder/Example, update if known
            contactType: 'customer service',
            areaServed: 'CI',
            availableLanguage: 'French',
        },
        description: "Solutions naturelles cliniquement prouvées pour l'hypertension et le diabète.",
        sameAs: [
            // Add social media links here if available
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
    );
}
