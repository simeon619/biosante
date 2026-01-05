import { products } from '@/data/products';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Star } from 'lucide-react';
import { AddToCartButton } from '@/components/AddToCartButton';
import { formatCurrency } from '@/lib/utils';

export async function generateStaticParams() {
    const categories = Array.from(new Set(products.map(p => p.category.toLowerCase().replace(/\s+/g, '-'))));
    return categories.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = await params;
    // Simple decoding logic
    const categoryName = slug.replace(/-/g, ' ');

    return {
        title: `Produits pour ${categoryName} | BIO SANTÉ`,
        description: `Découvrez nos solutions naturelles pour ${categoryName}.`,
    };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    // Filter products
    const categoryProducts = products.filter(p =>
        p.category.toLowerCase().replace(/\s+/g, '-') === slug
    );

    if (categoryProducts.length === 0) {
        notFound();
    }

    const categoryName = categoryProducts[0].category;

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-primary-50 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{categoryName}</h1>
                    <p className="text-xl text-gray-600">Solutions naturelles recommandées</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                            <Link href={`/produits/${product.id}`}>
                                <div className="aspect-w-16 aspect-h-10 bg-gray-100 h-64 relative">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                            </Link>
                            <div className="p-6">
                                <Link href={`/produits/${product.id}`}>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">{product.name}</h3>
                                </Link>
                                <p className="text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-lg font-bold text-primary-600">{formatCurrency(product.price)}</span>
                                    <AddToCartButton product={product} className="bg-gray-900 hover:bg-gray-800 py-2 px-4 text-sm" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
