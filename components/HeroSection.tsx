'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const slides = [
    {
        id: 'bioactif',
        label: 'Formulation Clinique',
        title: 'BioActif',
        subtitle: 'Une approche scientifique pour réguler l\'hypertension et améliorer la circulation sanguine. 100% Végétal.',
        accentColor: 'text-red-600',
        bgColor: 'bg-red-600',
        borderColor: 'border-red-600',
        productId: 'bioactif',
        imageIndex: 0 // Index in products array
    },
    {
        id: 'vitamax',
        label: 'Santé Masculine',
        title: 'VitaMax',
        subtitle: 'Rétablit le confort urinaire et booste la vitalité masculine. Formule cliniquement étudiée.',
        accentColor: 'text-green-600',
        bgColor: 'bg-green-600',
        borderColor: 'border-green-600',
        productId: 'vitamax',
        imageIndex: 1 // Index in products array
    }
];

interface HeroSectionProps {
    dynamicProducts?: any[];
}

export const HeroSection = ({ dynamicProducts }: HeroSectionProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000); // 6 seconds
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const slide = slides[currentSlide];
    const product = dynamicProducts?.find(p => p.id === slide.productId) || {
        id: slide.productId,
        name: slide.title,
        image: '/images/bioactif/bioactif-ingredients.jpg' // Fallback image
    };

    return (
        <section className="relative bg-transparent text-black min-h-[40vh] md:min-h-[50vh] flex flex-col justify-center overflow-hidden transition-colors duration-700">
            {/* Grid Background Removed - Using Global Grid */}

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
                        {/* Abstract Circle Backdrop - Rotates */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border ${slide.borderColor} opacity-20 rounded-full animate-[spin_60s_linear_infinite] transition-colors duration-1000`}></div>
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border ${slide.borderColor} opacity-10 rounded-full animate-[spin_40s_linear_infinite_reverse] transition-colors duration-1000`}></div>

                        {/* Image Switcher */}
                        <div className="relative h-full w-full transition-all duration-700">
                            <div key={currentSlide} className="relative h-full w-full animate-in zoom-in-95 duration-700 fade-in flex items-center justify-center">
                                {/* Floating Wrapper */}
                                <div className="relative w-full h-full animate-[float_6s_ease-in-out_infinite] drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]">
                                    <Image
                                        src={product.image}
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

            {/* Scientific Footer Strip */}
            <div className="absolute bottom-0 w-full border-t border-black/5 py-2.5 bg-white/30 backdrop-blur-sm hidden md:block">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs font-mono uppercase tracking-widest text-black/40">
                    <span>Fig. 0{currentSlide + 1} — {slide.label}</span>
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
