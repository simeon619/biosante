'use client';

import { useEffect, useRef, useState } from 'react';
import { products as allProducts } from '@/data/products';
import { ShieldCheck, Truck, Star, CheckCircle, Leaf, Activity, ArrowRight } from 'lucide-react';
import { AudioPlayer } from '@/components/AudioPlayer';
import Link from 'next/link';
import Image from 'next/image';
import { AddToCartButton } from '@/components/AddToCartButton';
import { HeroSection } from '@/components/HeroSection';
import { Button } from '@/components/ui/button';

import { useUI } from '@/context/UIContext';
import { formatCurrency, API_URL } from '@/lib/utils';


export function HomeClient() {
    const { setActiveColor } = useUI();
    const [products, setProducts] = useState(allProducts);

    // Refs for sections to observe
    const bioactifRef = useRef<HTMLElement>(null);
    const vitamaxRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Add timestamp to force fresh fetch and explicitly disable caching
                const response = await fetch(`${API_URL}/api/products?t=${Date.now()}`, {
                    cache: 'no-store',
                    next: { revalidate: 0 }
                });

                if (response.ok) {
                    const { products: dbProducts } = await response.json();
                    const activeProducts = dbProducts.map((dbp: any) => {
                        const sp = allProducts.find(p => p.id === dbp.id);
                        return {
                            ...sp,
                            id: dbp.id,
                            name: dbp.name,
                            price: dbp.price,
                            stock: dbp.stock,
                            inStock: dbp.stock > 0,
                            description: dbp.description || sp?.description || '',
                            is_active: dbp.is_active,
                            image: (dbp.image && dbp.image.length > 0) ? dbp.image : (sp?.image || ''),
                            tagline: dbp.tagline || sp?.tagline || '',
                            category: dbp.category || sp?.category || '',
                            ingredients_image: dbp.ingredients_image || sp?.ingredients_image,
                            infographic_image: dbp.infographic_image || sp?.infographic_image,
                            gallery: dbp.gallery
                                ? (typeof dbp.gallery === 'string' ? JSON.parse(dbp.gallery) : dbp.gallery)
                                : (sp?.gallery || []),
                            benefits: dbp.benefits
                                ? (typeof dbp.benefits === 'string' ? JSON.parse(dbp.benefits) : dbp.benefits)
                                : (sp?.benefits || []),
                            testimonials: (dbp.testimonials && dbp.testimonials.length > 0)
                                ? dbp.testimonials
                                : (sp?.testimonials || [])
                        };
                    });

                    setProducts(activeProducts);
                }
            } catch (error) {
                console.error('Failed to sync products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const options = {
            threshold: 0.3,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target === bioactifRef.current) {
                        setActiveColor('red');
                    } else if (entry.target === vitamaxRef.current) {
                        setActiveColor('green');
                    }
                }
            });
        }, options);

        if (bioactifRef.current) observer.observe(bioactifRef.current);
        if (vitamaxRef.current) observer.observe(vitamaxRef.current);

        return () => {
            if (bioactifRef.current) observer.unobserve(bioactifRef.current);
            if (vitamaxRef.current) observer.unobserve(vitamaxRef.current);
        };
    }, [setActiveColor]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 300) {
                setActiveColor('neutral');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [setActiveColor]);

    return (
        <div className="flex flex-col gap-0 min-h-screen bg-transparent text-black relative">
            <div className="relative z-10">
                <HeroSection dynamicProducts={products} />

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

                <section ref={bioactifRef} id="showcase" className="py-6 md:py-8 border-b border-black/5 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {products.filter(p => p.id === 'bioactif').map(product => (
                            <div key={product.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                                <div className="lg:col-span-6 order-2 lg:order-1 relative">
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
                                                Fig. 01 — Composition
                                            </div>
                                        </div>
                                        <div className="col-span-1 aspect-square relative bg-white rounded-sm border border-black/10 overflow-hidden group">
                                            <Image
                                                src={product.infographic_image || product.gallery?.[1] || product.image}
                                                alt={`Infographie ${product.name} - Bienfaits et résultats`}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                className="object-cover hover:scale-105 transition-transform duration-700"
                                                unoptimized
                                            />
                                            <div className="absolute bottom-2 right-2 text-[10px] font-mono uppercase tracking-widest text-white bg-red-600/90 px-2 py-0.5">
                                                Cible
                                            </div>
                                        </div>
                                        <div className="col-span-1 aspect-square relative bg-white rounded-sm border border-black/10 overflow-hidden group">
                                            <Image
                                                src={product.gallery?.[2] || product.image}
                                                alt={`Résultats patients ${product.name}`}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                className="object-cover hover:scale-105 transition-transform duration-700"
                                                unoptimized
                                            />
                                            <div className="absolute bottom-2 right-2 text-[10px] font-mono uppercase tracking-widest text-white bg-red-600/90 px-2 py-0.5">
                                                Résultat
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
                                    <div className="space-y-4">
                                        <div className="inline-block border border-red-600 px-3 py-1 rounded-full">
                                            <span className="text-xs font-bold uppercase tracking-widest text-red-600">{product.tagline}</span>
                                        </div>
                                        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-red-600">
                                            {product.name}<span className="align-super text-lg text-black">®</span>
                                        </h2>
                                        <p className="text-xl text-black/70 leading-relaxed font-light">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-black/10">
                                        {product.benefits.map((benefit, i) => (
                                            <div key={i} className="flex items-start gap-3 group">
                                                <div className="mt-1 w-5 h-5 rounded-full border border-red-600/30 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                                                    <span className="text-[10px] text-red-600 group-hover:text-white">&bull;</span>
                                                </div>
                                                <span className="text-base font-medium text-black/90">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
                                        <div className="text-center sm:text-left">
                                            <p className="text-xs uppercase tracking-widest text-black/50 mb-1">Investissement Santé</p>
                                            <p className="text-4xl font-bold text-black font-heading">{formatCurrency(product.price)}</p>
                                        </div>
                                        <AddToCartButton product={product} className="w-full sm:w-auto h-14 px-10 text-base bg-black text-white hover:bg-black/90 rounded-full tracking-wide shadow-xl shadow-black/10" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-black/95 backdrop-blur-md py-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                        <div className="absolute top-10 left-10 w-96 h-96 bg-red-600 rounded-full blur-[128px]"></div>
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-600 rounded-full blur-[128px]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-8">
                            <Star className="w-8 h-8 text-white mx-auto mb-4 opacity-80 fill-white" />
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">La Voix de la Guérison</h2>
                            <p className="text-white/60 text-base max-w-2xl mx-auto font-light">
                                Écoutez les témoignages authentiques de patients qui ont retrouvé leur vitalité grâce à nos protocoles.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 mb-6 border-b border-red-600/30 pb-4">
                                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                                    <h3 className="text-2xl font-bold text-red-500 tracking-tight">BioActif<span className="text-xs align-top ml-1 text-white/50">®</span></h3>
                                    <div className="ml-auto text-xs font-mono uppercase tracking-widest text-red-500/80 bg-red-950/30 px-2 py-1 rounded">Hypertension</div>
                                </div>

                                <div className="space-y-4">
                                    {products.find(p => p.id === 'bioactif')?.testimonials.map((testimonial, idx) => (
                                        <div key={idx} className="transform hover:-translate-y-1 transition-transform duration-300">
                                            <AudioPlayer
                                                testimonial={testimonial}
                                                colorClass="bg-red-600 hover:bg-red-700"
                                                barColorClass="bg-red-400"
                                            />
                                            <div className="mt-3 ml-4 border-l-2 border-red-600/20 pl-4">
                                                <p className="text-sm text-white/70 italic">"Une stabilité remarquable dès les premières semaines..."</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-4 mb-6 border-b border-green-600/30 pb-4">
                                    <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                                    <h3 className="text-2xl font-bold text-green-500 tracking-tight">VitaMax<span className="text-xs align-top ml-1 text-white/50">®</span></h3>
                                    <div className="ml-auto text-xs font-mono uppercase tracking-widest text-green-500/80 bg-green-950/30 px-2 py-1 rounded">Vitalité</div>
                                </div>

                                <div className="space-y-4">
                                    {products.find(p => p.id === 'vitamax')?.testimonials.map((testimonial, idx) => (
                                        <div key={idx} className="transform hover:-translate-y-1 transition-transform duration-300">
                                            <AudioPlayer
                                                testimonial={testimonial}
                                                colorClass="bg-green-600 hover:bg-green-700"
                                                barColorClass="bg-green-400"
                                            />
                                            <div className="mt-3 ml-4 border-l-2 border-green-600/20 pl-4">
                                                <p className="text-sm text-white/70 italic">"Je me sens plus énergique et mes nuits sont paisibles..."</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section ref={vitamaxRef} className="py-6 md:py-8 bg-transparent relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {products.filter(p => p.id === 'vitamax').map(product => (
                            <div key={product.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                                <div className="lg:col-span-6 space-y-4">
                                    <div className="space-y-4">
                                        <div className="inline-block border border-green-600 px-3 py-1 rounded-full">
                                            <span className="text-xs font-bold uppercase tracking-widest text-green-600">{product.tagline}</span>
                                        </div>
                                        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-green-600">
                                            {product.name}<span className="align-super text-lg text-black">®</span>
                                        </h2>
                                        <p className="text-xl text-black/70 leading-relaxed font-light">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-black/10">
                                        {product.benefits.map((benefit, i) => (
                                            <div key={i} className="flex items-start gap-3 group">
                                                <div className="mt-1 w-5 h-5 rounded-full border border-green-600/30 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                                                    <span className="text-[10px] text-green-600 group-hover:text-white">&bull;</span>
                                                </div>
                                                <span className="text-base font-medium text-black/90">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
                                        <div className="text-center sm:text-left">
                                            <p className="text-xs uppercase tracking-widest text-black/50 mb-1">Investissement Santé</p>
                                            <p className="text-4xl font-bold text-black font-heading">{formatCurrency(product.price)}</p>
                                        </div>
                                        <AddToCartButton product={product} className="w-full sm:w-auto h-14 px-10 text-base bg-black text-white hover:bg-black/90 rounded-full tracking-wide shadow-xl shadow-black/10" />
                                    </div>
                                </div>

                                <div className="lg:col-span-6 relative">
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
                                                Fig. 02 — Formulation
                                            </div>
                                        </div>
                                        <div className="col-span-1 aspect-square relative bg-white rounded-sm border border-black/10 overflow-hidden group">
                                            <Image
                                                src={product.infographic_image || product.gallery?.[1] || product.image}
                                                alt={`Infographie ${product.name} - Confort urinaire et vitalité`}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                className="object-cover hover:scale-105 transition-transform duration-700"
                                                unoptimized
                                            />
                                            <div className="absolute bottom-2 right-2 text-[10px] font-mono uppercase tracking-widest text-white bg-green-600/90 px-2 py-0.5">
                                                Prostate
                                            </div>
                                        </div>
                                        <div className="col-span-1 aspect-square relative bg-white rounded-sm border border-black/10 overflow-hidden group">
                                            <Image
                                                src={product.gallery?.[0] || product.image}
                                                alt={`Mode de vie sain avec ${product.name}`}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                className="object-cover hover:scale-105 transition-transform duration-700"
                                                unoptimized
                                            />
                                            <div className="absolute bottom-2 right-2 text-[10px] font-mono uppercase tracking-widest text-white bg-green-600/90 px-2 py-0.5">
                                                Vitalité
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

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
