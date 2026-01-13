'use client';

import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Truck, Star, CheckCircle, Leaf, Activity, ArrowRight } from 'lucide-react';
import { AudioPlayer } from '@/components/AudioPlayer';
import Link from 'next/link';
import Image from 'next/image';
import { AddToCartButton } from '@/components/AddToCartButton';
import { HeroSection } from '@/components/HeroSection';
import { Button } from '@/components/ui/button';

import { useUI } from '@/context/UIContext';
import { formatCurrency, API_URL } from '@/lib/utils';

// Color mapping for theme_color field from database
const colorClasses: Record<string, {
    accent: string;
    text: string;
    border: string;
    bg: string;
    bgLight: string;
    bullet: string;
    bulletHover: string;
    testimonialBg: string;
    testimonialBar: string;
}> = {
    red: {
        accent: 'text-red-600',
        text: 'text-red-600',
        border: 'border-red-600',
        bg: 'bg-red-600',
        bgLight: 'bg-red-600/10',
        bullet: 'text-red-600 border-red-600/30',
        bulletHover: 'group-hover:bg-red-600',
        testimonialBg: 'bg-red-600 hover:bg-red-700',
        testimonialBar: 'bg-red-400'
    },
    green: {
        accent: 'text-green-600',
        text: 'text-green-600',
        border: 'border-green-600',
        bg: 'bg-green-600',
        bgLight: 'bg-green-600/10',
        bullet: 'text-green-600 border-green-600/30',
        bulletHover: 'group-hover:bg-green-600',
        testimonialBg: 'bg-green-600 hover:bg-green-700',
        testimonialBar: 'bg-green-400'
    },
    blue: {
        accent: 'text-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-600',
        bg: 'bg-blue-600',
        bgLight: 'bg-blue-600/10',
        bullet: 'text-blue-600 border-blue-600/30',
        bulletHover: 'group-hover:bg-blue-600',
        testimonialBg: 'bg-blue-600 hover:bg-blue-700',
        testimonialBar: 'bg-blue-400'
    },
    yellow: {
        accent: 'text-yellow-600',
        text: 'text-yellow-600',
        border: 'border-yellow-600',
        bg: 'bg-yellow-600',
        bgLight: 'bg-yellow-600/10',
        bullet: 'text-yellow-600 border-yellow-600/30',
        bulletHover: 'group-hover:bg-yellow-600',
        testimonialBg: 'bg-yellow-600 hover:bg-yellow-700',
        testimonialBar: 'bg-yellow-400'
    },
    orange: {
        accent: 'text-orange-600',
        text: 'text-orange-600',
        border: 'border-orange-600',
        bg: 'bg-orange-600',
        bgLight: 'bg-orange-600/10',
        bullet: 'text-orange-600 border-orange-600/30',
        bulletHover: 'group-hover:bg-orange-600',
        testimonialBg: 'bg-orange-600 hover:bg-orange-700',
        testimonialBar: 'bg-orange-400'
    },
    purple: {
        accent: 'text-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-600',
        bg: 'bg-purple-600',
        bgLight: 'bg-purple-600/10',
        bullet: 'text-purple-600 border-purple-600/30',
        bulletHover: 'group-hover:bg-purple-600',
        testimonialBg: 'bg-purple-600 hover:bg-purple-700',
        testimonialBar: 'bg-purple-400'
    },
    pink: {
        accent: 'text-pink-600',
        text: 'text-pink-600',
        border: 'border-pink-600',
        bg: 'bg-pink-600',
        bgLight: 'bg-pink-600/10',
        bullet: 'text-pink-600 border-pink-600/30',
        bulletHover: 'group-hover:bg-pink-600',
        testimonialBg: 'bg-pink-600 hover:bg-pink-700',
        testimonialBar: 'bg-pink-400'
    },
    teal: {
        accent: 'text-teal-600',
        text: 'text-teal-600',
        border: 'border-teal-600',
        bg: 'bg-teal-600',
        bgLight: 'bg-teal-600/10',
        bullet: 'text-teal-600 border-teal-600/30',
        bulletHover: 'group-hover:bg-teal-600',
        testimonialBg: 'bg-teal-600 hover:bg-teal-700',
        testimonialBar: 'bg-teal-400'
    }
};

const defaultColors = colorClasses.green;

export function HomeClient() {
    const { setActiveColor } = useUI();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Dynamic refs for product sections
    const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products?t=${Date.now()}`, {
                    cache: 'no-store',
                    next: { revalidate: 0 }
                });

                if (response.ok) {
                    const { products: dbProducts } = await response.json();
                    // Products are already ordered by display_order from API
                    const activeProducts = dbProducts.map((dbp: any) => ({
                        id: dbp.id,
                        name: dbp.name,
                        price: dbp.price,
                        stock: dbp.stock,
                        inStock: dbp.stock > 0,
                        description: dbp.description || '',
                        is_active: dbp.is_active,
                        image: dbp.image || '/images/placeholder-product.png',
                        tagline: dbp.tagline || '',
                        category: dbp.category || '',
                        theme_color: dbp.theme_color || 'green',
                        display_order: dbp.display_order || 0,
                        ingredients_image: dbp.ingredients_image,
                        infographic_image: dbp.infographic_image,
                        gallery: dbp.gallery
                            ? (typeof dbp.gallery === 'string' ? JSON.parse(dbp.gallery) : dbp.gallery)
                            : [],
                        benefits: dbp.benefits
                            ? (typeof dbp.benefits === 'string' ? JSON.parse(dbp.benefits) : dbp.benefits)
                            : [],
                        testimonials: dbp.testimonials || []
                    }));

                    setProducts(activeProducts);
                }
            } catch (error) {
                console.error('Failed to sync products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Intersection observer for color changes based on visible product
    useEffect(() => {
        if (products.length === 0) return;

        const options = { threshold: 0.3 };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const productId = entry.target.getAttribute('data-product-id');
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        setActiveColor(product.theme_color || 'neutral');
                    }
                }
            });
        }, options);

        // Observe all product sections
        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            sectionRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [products, setActiveColor]);

    // Reset color on scroll to top
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 300) {
                setActiveColor('neutral');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [setActiveColor]);

    const getColors = (themeColor: string) => {
        return colorClasses[themeColor] || defaultColors;
    };

    return (
        <div className="flex flex-col gap-0 min-h-screen bg-transparent text-black relative">
            <div className="relative z-10">
                <HeroSection dynamicProducts={products} />

                {/* Trust Indicators */}
                <section className="border-b border-black/5 py-3 bg-white/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="flex items-center gap-4 group">
                                <Leaf className="w-6 h-6 text-black stroke-[1.5]" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-widest">100% Végétal</span>
                                    <span className="text-[10px] text-black/60">Source Naturelle</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <ShieldCheck className="w-6 h-6 text-black stroke-[1.5]" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-widest">Cliniquement Testé</span>
                                    <span className="text-[10px] text-black/60">Efficacité Prouvée</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <Activity className="w-6 h-6 text-black stroke-[1.5]" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-widest">Santé Durable</span>
                                    <span className="text-[10px] text-black/60">Sans Effets Secondaires</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <Truck className="w-6 h-6 text-black stroke-[1.5]" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-widest">Livraison 24h</span>
                                    <span className="text-[10px] text-black/60">Partout en Côte d'Ivoire</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dynamic Product Sections */}
                {products.map((product, index) => {
                    const colors = getColors(product.theme_color);
                    const isEven = index % 2 === 0;

                    return (
                        <section
                            key={product.id}
                            ref={(el) => { if (el) sectionRefs.current.set(product.id, el); }}
                            data-product-id={product.id}
                            className="py-6 md:py-8 border-b border-black/5 relative overflow-hidden"
                        >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center`}>
                                    {/* Image Grid - Order changes based on index */}
                                    <div className={`lg:col-span-6 relative ${isEven ? 'order-2 lg:order-1' : 'order-2 lg:order-2'}`}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2 aspect-[4/3] relative bg-white/50 backdrop-blur-sm rounded-3xl border border-black/5 flex items-center justify-center p-8 hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                                                <div className="relative w-full h-full drop-shadow-[0_25px_25px_rgba(0,0,0,0.1)]">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        className="object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                                                        unoptimized
                                                    />
                                                </div>
                                                <div className="absolute top-6 left-6 text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-black/5">
                                                    Fig. 0{index + 1} — Composition
                                                </div>
                                            </div>
                                            {product.infographic_image && (
                                                <div className="col-span-1 aspect-square relative bg-white rounded-sm border border-black/10 overflow-hidden group">
                                                    <Image
                                                        src={product.infographic_image}
                                                        alt={`Infographie ${product.name}`}
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, 33vw"
                                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                                        unoptimized
                                                    />
                                                    <div className={`absolute bottom-2 right-2 text-[10px] font-mono uppercase tracking-widest text-white ${colors.bg}/90 px-2 py-0.5`}>
                                                        Cible
                                                    </div>
                                                </div>
                                            )}
                                            {product.gallery?.[0] && (
                                                <div className="col-span-1 aspect-square relative bg-white rounded-sm border border-black/10 overflow-hidden group">
                                                    <Image
                                                        src={product.gallery[0]}
                                                        alt={`${product.name} lifestyle`}
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, 33vw"
                                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                                        unoptimized
                                                    />
                                                    <div className={`absolute bottom-2 right-2 text-[10px] font-mono uppercase tracking-widest text-white ${colors.bg}/90 px-2 py-0.5`}>
                                                        Résultat
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className={`lg:col-span-6 space-y-4 ${isEven ? 'order-1 lg:order-2' : 'order-1 lg:order-1'}`}>
                                        <div className="space-y-4">
                                            <div className={`inline-block border ${colors.border} px-3 py-1 rounded-full`}>
                                                <span className={`text-xs font-bold uppercase tracking-widest ${colors.text}`}>{product.tagline}</span>
                                            </div>
                                            <h2 className={`text-5xl md:text-6xl font-bold tracking-tighter ${colors.text}`}>
                                                {product.name}<span className="align-super text-lg text-black">®</span>
                                            </h2>
                                            <p className="text-xl text-black/70 leading-relaxed font-light">
                                                {product.description}
                                            </p>
                                        </div>

                                        {/* Benefits */}
                                        {product.benefits && product.benefits.length > 0 && (
                                            <div className="space-y-4 pt-4 border-t border-black/10">
                                                {product.benefits.map((benefit: string, i: number) => (
                                                    <div key={i} className="flex items-start gap-3 group">
                                                        <div className={`mt-1 w-5 h-5 rounded-full border ${colors.bullet} flex items-center justify-center ${colors.bulletHover} group-hover:text-white transition-colors`}>
                                                            <span className={`text-[10px] ${colors.text} group-hover:text-white`}>•</span>
                                                        </div>
                                                        <span className="text-base font-medium text-black/90">{benefit}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Price and CTA */}
                                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
                                            <div className="text-center sm:text-left">
                                                <p className="text-xs uppercase tracking-widest text-black/50 mb-1">Investissement Santé</p>
                                                <p className="text-4xl font-bold text-black font-heading">{formatCurrency(product.price)}</p>
                                            </div>
                                            <AddToCartButton product={product} className="w-full sm:w-auto h-14 px-10 text-base bg-black text-white hover:bg-black/90 rounded-full tracking-wide shadow-xl shadow-black/10" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                })}

                {/* Testimonials Section - Dynamic with Responsive Grid */}
                {products.length > 0 && (
                    <section className="bg-black/95 backdrop-blur-md py-12 md:py-16 text-white relative overflow-hidden">
                        {/* Background glow effects */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                            <div className="absolute top-10 left-10 w-96 h-96 bg-red-600 rounded-full blur-[128px]"></div>
                            <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-600 rounded-full blur-[128px]"></div>
                        </div>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            {/* Section Header */}
                            <div className="text-center mb-10 md:mb-12">
                                <Star className="w-8 h-8 text-white mx-auto mb-4 opacity-80 fill-white" />
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">La Voix de la Guérison</h2>
                                <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto font-light">
                                    Écoutez les témoignages authentiques de patients qui ont retrouvé leur vitalité grâce à nos protocoles.
                                </p>
                            </div>

                            {/* Products Testimonials Container */}
                            <div className="space-y-12 md:space-y-16">
                                {products.map(product => {
                                    const colors = getColors(product.theme_color);
                                    const testimonials = product.testimonials || [];
                                    const hasMany = testimonials.length > 4;

                                    return (
                                        <div key={product.id} className="space-y-6">
                                            {/* Product Header */}
                                            <div className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b ${colors.border}/30 pb-4`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 ${colors.bg} rounded-full animate-pulse`}></div>
                                                    <h3 className={`text-2xl md:text-3xl font-bold ${colors.accent} tracking-tight`}>
                                                        {product.name}<span className="text-xs align-top ml-1 text-white/50">®</span>
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-3 sm:ml-auto">
                                                    <span className={`text-xs font-mono uppercase tracking-widest ${colors.accent}/80 ${colors.bgLight} px-3 py-1.5 rounded-full`}>
                                                        {product.category || product.tagline}
                                                    </span>
                                                    {testimonials.length > 0 && (
                                                        <span className="text-xs text-white/40">
                                                            {testimonials.length} témoignage{testimonials.length > 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Testimonials Grid - Responsive */}
                                            {testimonials.length > 0 ? (
                                                <div className="space-y-4">
                                                    {/* Grid: 1 col mobile, 2 cols tablet, 3 cols desktop for many items */}
                                                    <div className={`grid gap-4 md:gap-5
                                                        ${testimonials.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' : ''}
                                                        ${testimonials.length === 2 ? 'grid-cols-1 md:grid-cols-2' : ''}
                                                        ${testimonials.length >= 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''}
                                                    `}>
                                                        {testimonials.slice(0, hasMany ? 6 : testimonials.length).map((testimonial: any, idx: number) => (
                                                            <div
                                                                key={testimonial.id || idx}
                                                                className="transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300"
                                                            >
                                                                <AudioPlayer
                                                                    testimonial={testimonial}
                                                                    colorClass={colors.testimonialBg}
                                                                    barColorClass={colors.testimonialBar}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Voir plus button if more than 6 testimonials */}
                                                    {testimonials.length > 6 && (
                                                        <details className="group">
                                                            <summary className={`cursor-pointer flex items-center justify-center gap-2 text-sm font-medium ${colors.accent} hover:opacity-80 transition-opacity py-3 select-none`}>
                                                                <span className="group-open:hidden">
                                                                    Voir {testimonials.length - 6} témoignages de plus
                                                                </span>
                                                                <span className="hidden group-open:inline">
                                                                    Réduire
                                                                </span>
                                                                <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </summary>
                                                            <div className={`grid gap-4 md:gap-5 mt-4
                                                                grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                                                            `}>
                                                                {testimonials.slice(6).map((testimonial: any, idx: number) => (
                                                                    <div
                                                                        key={testimonial.id || `extra-${idx}`}
                                                                        className="transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 animate-in fade-in slide-in-from-top-2"
                                                                    >
                                                                        <AudioPlayer
                                                                            testimonial={testimonial}
                                                                            colorClass={colors.testimonialBg}
                                                                            barColorClass={colors.testimonialBar}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </details>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-white/40 text-sm italic border border-white/10 rounded-xl p-6 text-center bg-white/5">
                                                    <p>Témoignages à venir...</p>
                                                    <p className="text-xs mt-2 text-white/30">Nos clients partagent bientôt leur expérience</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* Final CTA */}
                <section className="py-8 bg-transparent border-t border-black/10">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight">
                            La santé par la science.
                        </h2>
                        <p className="text-black/70 mb-10 text-xl font-light max-w-2xl mx-auto">
                            Rejoignez des milliers d'ivoiriens qui ont choisi une approche naturelle et validée.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/produits">
                                <Button className="h-14 px-10 text-base bg-black text-white hover:bg-black/90 rounded-full">
                                    Voir tous les produits
                                </Button>
                            </Link>
                            <Button variant="outline" className="h-14 px-10 text-base border-black/20 text-black hover:bg-black/5 rounded-full">
                                Consulter un expert
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
