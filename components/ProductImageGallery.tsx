'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface ProductImageGalleryProps {
    mainImage: string;
    gallery: string[];
    productName: string;
    accentBorderClass: string;
}

export function ProductImageGallery({ mainImage, gallery, productName, accentBorderClass }: ProductImageGalleryProps) {
    const allImages = [mainImage, ...(gallery || [])];
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Embla instance with cleaner defaults
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        skipSnaps: false,
    });

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    const scrollTo = (index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
        else setSelectedIndex(index);
    };

    return (
        <div className="relative w-full overflow-hidden lg:overflow-visible">
            {/* Mobile/Tablet Slider - Cleaner and more "fitted" */}
            <div className="lg:hidden -mx-2">
                <div className="overflow-hidden touch-pan-y" ref={emblaRef}>
                    <div className="flex">
                        {allImages.map((img, i) => (
                            <div key={i} className="flex-[0_0_90%] min-w-0 px-2">
                                <div className="aspect-square bg-white rounded-2xl flex items-center justify-center p-2 relative group touch-none">
                                    <img
                                        src={img}
                                        alt={`${productName} - Vue ${i + 1}`}
                                        className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${selectedIndex === i ? 'opacity-100' : 'opacity-40'}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Simple Dots instead of complex thumbnails for mobile if many images */}
                {allImages.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-4">
                        {allImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => scrollTo(i)}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${selectedIndex === i ? `w-4 ${accentBorderClass.replace('border-', 'bg-')}` : 'bg-gray-300 hover:bg-gray-400'}`}
                                aria-label={`Aller à l'image ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop Main Image */}
            <div className="hidden lg:block relative">
                <div className="aspect-square max-h-[500px] bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 group mx-auto">
                    <div className="relative w-full h-full p-12 flex items-center justify-center">
                        <img
                            src={allImages[selectedIndex] || mainImage}
                            alt={productName}
                            className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    </div>
                </div>
            </div>

            {/* Thumbnail Gallery (Desktop only or combined view) */}
            {allImages.length > 1 && (
                <div className="hidden lg:flex mt-6 gap-3 overflow-x-auto pb-4 scrollbar-hide justify-start">
                    {allImages.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => scrollTo(i)}
                            className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${selectedIndex === i
                                ? `border-2 ${accentBorderClass} ring-4 ring-${accentBorderClass.split('-')[1]}-100 scale-105`
                                : 'border border-gray-200 hover:border-gray-400 opacity-60 hover:opacity-100 scale-100'
                                }`}
                        >
                            <img src={img} alt={`Vue ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
