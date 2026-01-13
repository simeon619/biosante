'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// Color mapping for theme_color field from database
const colorClasses: Record<string, { accent: string; bg: string; border: string }> = {
    red: { accent: 'text-red-600', bg: 'bg-red-600', border: 'border-red-600' },
    green: { accent: 'text-green-600', bg: 'bg-green-600', border: 'border-green-600' },
    blue: { accent: 'text-blue-600', bg: 'bg-blue-600', border: 'border-blue-600' },
    yellow: { accent: 'text-yellow-600', bg: 'bg-yellow-600', border: 'border-yellow-600' },
    orange: { accent: 'text-orange-600', bg: 'bg-orange-600', border: 'border-orange-600' },
    purple: { accent: 'text-purple-600', bg: 'bg-purple-600', border: 'border-purple-600' },
    pink: { accent: 'text-pink-600', bg: 'bg-pink-600', border: 'border-pink-600' },
    teal: { accent: 'text-teal-600', bg: 'bg-teal-600', border: 'border-teal-600' },
    // Default fallback
    default: { accent: 'text-emerald-600', bg: 'bg-emerald-600', border: 'border-emerald-600' }
};

interface HeroSectionProps {
    dynamicProducts?: any[];
}

export const HeroSection = ({ dynamicProducts = [] }: HeroSectionProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Generate slides from dynamic products
    const slides = useMemo(() => {
        if (!dynamicProducts || dynamicProducts.length === 0) {
            return [];
        }

        return dynamicProducts.map((product, index) => {
            const themeColor = product.theme_color || 'green';
            const colors = colorClasses[themeColor] || colorClasses.default;

            return {
                id: product.id,
                productId: product.id,
                title: product.name,
                label: product.tagline || product.category || 'Santé Naturelle',
                subtitle: product.description || '',
                image: product.image || '/images/placeholder-product.png',
                accentColor: colors.accent,
                bgColor: colors.bg,
                borderColor: colors.border,
                figNumber: index + 1
            };
        });
    }, [dynamicProducts]);

    // Auto-advance slides
    useEffect(() => {
        if (slides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    // Handle empty state
    if (slides.length === 0) {
        return (
            <section className="relative bg-transparent text-black min-h-[40vh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-black/50">Chargement des produits...</p>
                </div>
            </section>
        );
    }

    const slide = slides[currentSlide];

    return (
        <section className="relative bg-transparent text-black min-h-[40vh] md:min-h-[50vh] flex flex-col justify-center overflow-hidden transition-colors duration-700">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 md:pt-0">
                {/* Text Content */}
                <div className="lg:col-span-7 pt-8 lg:pt-0 text-center lg:text-left z-20">
                    <div key={currentSlide} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className={`inline-block mb-3 border ${slide.borderColor} rounded-full px-4 py-1.5`}>
                            <span className={`text-xs font-mono uppercase tracking-[0.2em] ${slide.accentColor}`}>{slide.label}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-2 md:mb-4 leading-[0.9] font-heading">
                            <span className={slide.accentColor}>{slide.title}</span><span className="text-2xl align-top text-black">®</span>
                        </h1>
                        <p className="text-base md:text-lg text-black/70 mb-6 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed tracking-wide">
                            {slide.subtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                            <Link href={`/produits/${slide.productId}`}>
                                <Button className="h-14 px-8 text-base bg-black text-white hover:bg-black/90 hover:scale-[1.02] transition-all rounded-full font-medium tracking-wide">
                                    Découvrir le Protocole
                                </Button>
                            </Link>
                            <Link href="/produits">
                                <Button variant="outline" className="h-14 px-8 text-base border-black/10 text-black bg-transparent hover:bg-black/5 rounded-full font-medium tracking-wide">
                                    Voir la Science
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Hero Carousel Image */}
                <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center z-10">
                    <div className="relative w-[300px] md:w-[400px] aspect-[3/4]">
                        {/* Abstract Circle Backdrop */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border ${slide.borderColor} opacity-20 rounded-full animate-[spin_60s_linear_infinite] transition-colors duration-1000`}></div>
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border ${slide.borderColor} opacity-10 rounded-full animate-[spin_40s_linear_infinite_reverse] transition-colors duration-1000`}></div>

                        {/* Image Switcher */}
                        <div className="relative h-full w-full transition-all duration-700">
                            <div key={currentSlide} className="relative h-full w-full animate-in zoom-in-95 duration-700 fade-in flex items-center justify-center">
                                <div className="relative w-full h-full animate-[float_6s_ease-in-out_infinite] drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]">
                                    <Image
                                        src={slide.image}
                                        alt={`${slide.title} - Solution naturelle pour la santé en Côte d'Ivoire`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-contain mix-blend-multiply"
                                        priority
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carousel Controls / Indicators */}
            {slides.length > 1 && (
                <div className="absolute bottom-12 left-0 w-full flex justify-center z-30 pointer-events-none">
                    <div className="flex items-center gap-4 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-black/5 pointer-events-auto shadow-sm">
                        <button onClick={prevSlide} className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/60 hover:text-black">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex gap-2">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-black scale-125' : 'bg-black/20 hover:bg-black/40'}`}
                                />
                            ))}
                        </div>
                        <button onClick={nextSlide} className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/60 hover:text-black">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Scientific Footer Strip */}
            <div className="absolute bottom-0 w-full border-t border-black/5 py-2.5 bg-white/30 backdrop-blur-sm hidden md:block">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs font-mono uppercase tracking-widest text-black/40">
                    <span>Fig. 0{slide.figNumber} — {slide.label}</span>
                    <span>Validé Scientifiquement</span>
                    <span>Côte d'Ivoire</span>
                </div>
            </div>

            <style jsx global>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(12deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
            `}</style>
        </section>
    );
};
