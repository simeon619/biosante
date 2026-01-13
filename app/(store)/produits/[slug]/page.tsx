import { products } from '@/data/products';
import { notFound, redirect } from 'next/navigation';
import { AudioPlayer } from '@/components/AudioPlayer';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductImageGallery } from '@/components/ProductImageGallery';
import { CheckCircle, Volume2, ShieldCheck, Truck, Star, ChevronDown, Clock, Sparkles, Heart, Zap } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { API_URL } from '@/lib/utils';
import { FacebookViewContent } from '@/components/FacebookViewContent';

// 1. Static Params Generation (SSG)
export async function generateStaticParams() {
    return products.map((product) => ({
        slug: product.id,
    }));
}

// 2. Dynamic Metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = await params;
    const product = products.find((p) => p.id === slug);

    if (!product) {
        try {
            const res = await fetch(`${API_URL}/api/products/${slug}`);
            if (res.ok) {
                const { product: dbp } = await res.json();
                return {
                    title: `${dbp.name} | BIO SANTÉ`,
                    description: dbp.description,
                    openGraph: {
                        title: `${dbp.name} | BIO SANTÉ`,
                        description: dbp.description,
                        images: [dbp.image],
                        type: 'article',
                    }
                };
            }
        } catch (e) { }
        return { title: 'Produit Non Trouvé' };
    }

    return {
        title: `${product.name} - ${product.tagline} | BIO SANTÉ`,
        description: product.description,
        openGraph: {
            title: `${product.name} - Solution Naturelle`,
            description: product.description,
            images: [product.image],
            type: 'article',
            siteName: 'BIO SANTÉ',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
            images: [product.image],
        }
    };
}

// Timeline data for progressive benefits
const timelineData = {
    bioactif: [
        { period: 'Semaine 1', title: 'Premiers Effets', description: 'Stabilisation progressive de la tension artérielle' },
        { period: 'Semaine 2-3', title: 'Amélioration Visible', description: 'Réduction notable des pics de glycémie après les repas' },
        { period: '1 Mois', title: 'Résultats Durables', description: 'Équilibre tension/glycémie maintenu, énergie retrouvée' },
    ],
    vitamax: [
        { period: 'Semaine 1', title: 'Soulagement Initial', description: 'Diminution des envies nocturnes d\'uriner' },
        { period: 'Semaine 2-3', title: 'Confort Retrouvé', description: 'Amélioration significative du débit urinaire' },
        { period: '1 Mois', title: 'Vitalité Optimale', description: 'Prostate apaisée, sommeil réparateur, vigueur masculine' },
    ],
};

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    // Fetch from API to get latest price/name
    let product = products.find((p) => p.id === slug);
    try {
        const res = await fetch(`${API_URL}/api/products/${slug}?t=${Date.now()}`, {
            cache: 'no-store',
            next: { revalidate: 0 }
        });

        if (res.ok) {
            const { product: dbp } = await res.json();
            if (product) {
                product = {
                    ...product,
                    name: dbp.name || product.name,
                    price: dbp.price,
                    description: dbp.description || product.description,
                    image: (dbp.image && dbp.image.length > 0) ? dbp.image : product.image,
                    ingredients_image: dbp.ingredients_image || product.ingredients_image,
                    infographic_image: dbp.infographic_image || product.infographic_image,
                    tagline: dbp.tagline || product.tagline,
                    category: dbp.category || product.category,
                    gallery: dbp.gallery
                        ? (typeof dbp.gallery === 'string' ? JSON.parse(dbp.gallery) : dbp.gallery)
                        : product.gallery,
                    benefits: dbp.benefits
                        ? (typeof dbp.benefits === 'string' ? JSON.parse(dbp.benefits) : dbp.benefits)
                        : product.benefits,
                    // Use testimonials from DB (admin uploads) if available, otherwise fallback to static
                    testimonials: (dbp.testimonials && dbp.testimonials.length > 0)
                        ? dbp.testimonials
                        : product.testimonials
                };
            } else {
                product = {
                    id: dbp.id,
                    name: dbp.name,
                    price: dbp.price,
                    description: dbp.description || "Description à venir",
                    tagline: dbp.tagline || "Solution Naturelle",
                    category: dbp.category || "Santé",
                    image: dbp.image || '/images/bioactif/bioactif-ingredients.jpg',
                    ingredients_image: dbp.ingredients_image,
                    infographic_image: dbp.infographic_image,
                    gallery: dbp.gallery
                        ? (typeof dbp.gallery === 'string' ? JSON.parse(dbp.gallery) : dbp.gallery)
                        : [],
                    benefits: dbp.benefits
                        ? (typeof dbp.benefits === 'string' ? JSON.parse(dbp.benefits) : dbp.benefits)
                        : ["Efficacité prouvée", "100% Naturel"],
                    inStock: true,
                    testimonials: dbp.testimonials || []
                } as any;
            }
        } else if (!product) {
            redirect('/produits');
        }
    } catch (e) {
        console.error("Failed to fetch dynamic product:", e);
        if (!product) redirect('/produits');
    }

    if (!product) {
        redirect('/produits');
    }

    // Dynamic Color Logic
    const isBioActif = product.id === 'bioactif';
    const accentColor = isBioActif ? 'text-red-600' : 'text-emerald-600';
    const accentColorLight = isBioActif ? 'text-red-500' : 'text-emerald-500';
    const bgAccent = isBioActif ? 'bg-red-600' : 'bg-emerald-600';
    const bgAccentLight = isBioActif ? 'bg-red-50' : 'bg-emerald-50';
    const bgAccentGradient = isBioActif
        ? 'from-red-600 to-red-700'
        : 'from-emerald-600 to-emerald-700';
    const borderAccent = isBioActif ? 'border-red-600' : 'border-emerald-600';
    const borderAccentLight = isBioActif ? 'border-red-200' : 'border-emerald-200';
    const timeline = timelineData[product.id as keyof typeof timelineData] || timelineData.bioactif;

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image,
        description: product.description,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'XOF',
            availability: 'https://schema.org/InStock',
        },
    };

    return (
        <div className="bg-white min-h-screen text-black">
            <FacebookViewContent product={{ id: product.id, name: product.name, price: product.price }} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumb */}
            <nav className="border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <ol className="flex items-center text-sm text-gray-500 gap-2">
                        <li><Link href="/" className="hover:text-gray-900 transition-colors">Accueil</Link></li>
                        <li>/</li>
                        <li><Link href="/produits" className="hover:text-gray-900 transition-colors">Produits</Link></li>
                        <li>/</li>
                        <li className={`font-medium ${accentColor}`}>{product.name}</li>
                    </ol>
                </div>
            </nav>

            {/* ============================================
                HERO SECTION - Product Overview
            ============================================ */}
            <section className="relative overflow-hidden">
                {/* Subtle background gradient */}
                <div className={`absolute inset-0 ${bgAccentLight} opacity-30`} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                        {/* Product Image Gallery */}
                        <ProductImageGallery
                            mainImage={product.image}
                            gallery={product.gallery || []}
                            productName={product.name}
                            accentBorderClass={borderAccent}
                        />

                        {/* Product Info */}
                        <div className="lg:sticky lg:top-8 space-y-6">
                            {/* Category Badge */}
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${bgAccentLight} ${accentColor}`}>
                                <Sparkles className="w-3.5 h-3.5" />
                                {product.category}
                            </span>

                            {/* Product Name & Tagline */}
                            <div>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                                    {product.name}
                                </h1>
                                <p className={`mt-2 text-lg font-medium ${accentColorLight}`}>
                                    {product.tagline}
                                </p>
                            </div>

                            {/* Rating & Reviews */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500 font-medium">4.9 • 128 avis vérifiés</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-gray-900">
                                    {product.price.toLocaleString('fr-FR')}
                                </span>
                                <span className="text-xl text-gray-500">FCFA</span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {product.description}
                            </p>

                            {/* Benefits Quick List */}
                            <div className="space-y-3 py-4">
                                {product.benefits.slice(0, 4).map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-full ${bgAccent} flex items-center justify-center`}>
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-gray-700 font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Add to Cart CTA */}
                            <div className="space-y-4 pt-4">
                                <AddToCartButton
                                    product={product}
                                    className={`w-full justify-center bg-gradient-to-r ${bgAccentGradient} hover:opacity-90 text-white py-5 text-lg font-semibold rounded-2xl shadow-lg shadow-${isBioActif ? 'red' : 'emerald'}-500/25 transition-all duration-300 transform hover:scale-[1.02]`}
                                />

                                {/* Trust Badges */}
                                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-5 h-5" />
                                        <span>Livraison 24H</span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-300" />
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5" />
                                        <span>Paiement à la livraison</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                TIMELINE SECTION - Progressive Results
            ============================================ */}
            <section className="py-16 lg:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 lg:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Votre Parcours vers le Bien-être
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Découvrez comment {product.name} agit progressivement pour transformer votre santé
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
                        <div className={`hidden lg:block absolute top-1/2 left-0 h-1 ${bgAccent} -translate-y-1/2 w-full origin-left animate-pulse`} style={{ maxWidth: '100%' }} />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {timeline.map((item, i) => (
                                <div key={i} className="relative">
                                    {/* Timeline Node */}
                                    <div className={`hidden lg:flex absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${bgAccent} items-center justify-center shadow-lg`}>
                                        {i === 0 && <Zap className="w-4 h-4 text-white" />}
                                        {i === 1 && <Heart className="w-4 h-4 text-white" />}
                                        {i === 2 && <Sparkles className="w-4 h-4 text-white" />}
                                    </div>

                                    {/* Card */}
                                    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 lg:mt-8">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bgAccentLight} ${accentColor} text-sm font-semibold mb-4`}>
                                            <Clock className="w-4 h-4" />
                                            {item.period}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                AUDIO TESTIMONIALS SECTION
            ============================================ */}
            {product.testimonials && product.testimonials.length > 0 && (
                <section className="py-16 lg:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-4">
                                <Volume2 className="w-4 h-4" />
                                Témoignages Audio
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Écoutez Nos Clients Satisfaits
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                De vraies histoires de transformation avec {product.name}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {product.testimonials.map(testimonial => (
                                <div key={testimonial.id} className={`rounded-2xl p-6 border ${borderAccentLight} ${bgAccentLight}`}>
                                    <AudioPlayer
                                        testimonial={testimonial}
                                        colorClass={`bg-white ${accentColor} border border-gray-200 shadow-sm`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================
                COMPOSITION / INGREDIENTS SECTION
            ============================================ */}
            {product.ingredients_image && (
                <section className="py-16 lg:py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Composition 100% Naturelle
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Des actifs végétaux rigoureusement sélectionnés pour une efficacité maximale
                            </p>
                        </div>

                        <div className="overflow-hidden">
                            <img
                                src={product.ingredients_image}
                                alt="Composition naturelle"
                                className="w-full h-auto object-contain max-h-[600px] mx-auto p-4 lg:p-8"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================
                INFOGRAPHIC SECTION
            ============================================ */}
            {product.infographic_image && (
                <section className="py-16 lg:py-24 bg-gray-900 text-white relative overflow-hidden">
                    {/* Glow Effect */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full ${isBioActif ? 'bg-red-600/10' : 'bg-emerald-600/10'} blur-3xl`} />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                Science & Résultats
                            </h2>
                            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                                Comprendre l'impact de {product.name} sur votre organisme
                            </p>
                        </div>

                        <div className="rounded-3xl overflow-hidden">
                            <img
                                src={product.infographic_image}
                                alt="Infographie scientifique"
                                className="w-full h-auto object-contain max-h-[700px] mx-auto"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================
                GALLERY SECTION
            ============================================ */}
            {product.gallery && product.gallery.length > 0 && (
                <section className="py-16 lg:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Lifestyle & Bien-être
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Intégrez {product.name} dans votre quotidien
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                            {product.gallery.map((img, i) => (
                                <div key={i} className="aspect-square rounded-2xl overflow-hidden group cursor-pointer">
                                    <img
                                        src={img}
                                        alt={`Lifestyle ${i + 1}`}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================
                STICKY MOBILE CTA
            ============================================ */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 p-4 z-50 shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{product.name}</p>
                        <p className={`text-lg font-bold ${accentColor}`}>
                            {product.price.toLocaleString('fr-FR')} FCFA
                        </p>
                    </div>
                    <AddToCartButton
                        product={product}
                        className={`flex-shrink-0 bg-gradient-to-r ${bgAccentGradient} text-white px-6 py-3 text-sm font-semibold rounded-xl shadow-lg`}
                    />
                </div>
            </div>

            {/* Bottom Padding for Sticky CTA */}
            <div className="h-24 lg:hidden" />
        </div>
    );
}
