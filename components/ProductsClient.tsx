'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { products } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';
import { AddToCartButton } from '@/components/AddToCartButton';
import { formatCurrency, API_URL } from '@/lib/utils';


export function ProductsClient() {
    const { data: dynamicProducts } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/api/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const { products: dbProducts } = await response.json();

            return dbProducts.map((dbp: any) => {
                const sp = products.find(p => p.id === dbp.id);
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
                        : (sp?.benefits || [])
                };
            });
        },
        initialData: products,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return (
        <div className="bg-white min-h-screen text-black">
            {/* Minimalist Header - White/Black */}
            <div className="pt-8 pb-8 px-4 sm:px-6 lg:px-8 border-b border-black/10">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 font-heading text-black">
                        Protocoles.
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-black/70 max-w-2xl">
                        Formulations synergiques pour une santé restaurée.
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 gap-24">
                    {dynamicProducts.map((product: any, index: any) => {
                        // Dynamic Color Logic
                        const isBioActif = product.id === 'bioactif';
                        const accentColor = isBioActif ? 'text-red-600' : 'text-green-600';
                        const borderColor = isBioActif ? 'border-red-600' : 'border-green-600';
                        const bgAccent = isBioActif ? 'bg-red-600' : 'bg-green-600';

                        return (
                            <div key={product.id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start group">
                                {/* Image Section */}
                                <div className={`lg:col-span-5 relative w-full aspect-square sm:aspect-[4/5] lg:aspect-[3/4] bg-white border border-black/10 p-8 sm:p-12 max-w-[280px] sm:max-w-md lg:max-w-none mx-auto lg:mx-0 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                                    <Link href={`/produits/${product.id}`} className="block w-full h-full relative">
                                        <Image
                                            src={product.image}
                                            alt={`${product.name} - Protocole ${product.category} par BIO SANTÉ`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 40vw"
                                            className="object-contain transition-transform duration-700 group-hover:scale-105"
                                            priority={index === 0}
                                            unoptimized
                                        />
                                    </Link>
                                    <div className="absolute top-4 left-4 text-xs font-mono uppercase tracking-widest text-black/40">
                                        Fig. 0{index + 1}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className={`lg:col-span-7 space-y-8 ${index % 2 === 1 ? 'lg:order-1 lg:text-right' : ''}`}>
                                    <div>
                                        <div className={`inline-block border ${borderColor} px-3 py-1 rounded-full mb-6 ${index % 2 === 1 ? 'ml-auto' : ''}`}>
                                            <span className={`text-xs font-bold uppercase tracking-widest ${accentColor}`}>{product.category}</span>
                                        </div>
                                        <Link href={`/produits/${product.id}`}>
                                            <h2 className={`text-5xl md:text-6xl font-bold tracking-tight mb-4 hover:opacity-70 transition-opacity ${accentColor}`}>{product.name}</h2>
                                        </Link>
                                        <p className="text-xl leading-relaxed font-light text-black/80 max-w-xl">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div className={`flex flex-col gap-3 pt-6 ${index % 2 === 1 ? 'items-end' : ''}`}>
                                        {product.benefits.map((benefit: any, idx: any) => (
                                            <div key={idx} className="flex items-center gap-3 text-sm font-medium opacity-80 text-black">
                                                {index % 2 === 0 && <span className={`w-1.5 h-1.5 ${bgAccent} rounded-full`}></span>}
                                                {benefit}
                                                {index % 2 === 1 && <span className={`w-1.5 h-1.5 ${bgAccent} rounded-full`}></span>}
                                            </div>
                                        ))}
                                    </div>

                                    <div className={`flex flex-col sm:flex-row gap-6 pt-8 items-center ${index % 2 === 1 ? 'sm:justify-end' : ''}`}>
                                        <div className={index % 2 === 1 ? 'text-right' : 'text-left'}>
                                            <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Prix Unitaire</p>
                                            <p className="text-3xl font-bold font-mono text-black">{formatCurrency(product.price)}</p>
                                        </div>
                                        <AddToCartButton product={product} className="w-full sm:w-auto h-14 px-12 bg-black text-white hover:bg-black/90 rounded-full text-base tracking-wide shadow-none" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
