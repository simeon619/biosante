import { MetadataRoute } from 'next';
import { products } from '@/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://sante-vitalite.ci';

    // Static pages
    const routes = [
        '',
        '/produits',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1,
    }));

    // Dynamic products
    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/produits/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Dynamic categories
    const categories = Array.from(new Set(products.map(p => p.category.toLowerCase().replace(/\s+/g, '-'))));
    const categoryRoutes = categories.map((slug) => ({
        url: `${baseUrl}/categories/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...productRoutes, ...categoryRoutes];
}
