'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Package, Edit, Trash2, Power, Search, Loader2 } from 'lucide-react';
import { API_URL } from '@/lib/utils';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    is_active: boolean;
    image?: string;
    tagline?: string;
    category?: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/products`, { cache: 'no-store' });
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = async (id: string) => {
        try {
            await fetch(`${API_URL}/api/admin/products/${id}/toggle`, {
                method: 'POST'
            });
            fetchProducts();
        } catch (error) {
            console.error('Failed to toggle product:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
        try {
            await fetch(`${API_URL}/api/admin/products/${id}`, {
                method: 'DELETE'
            });
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
                    <p className="text-gray-500">Gérez le catalogue et les stocks</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter un produit
                </Link>
            </div>

            <div className="relative max-w-md">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent outline-none shadow-sm transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-black" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/60 transition-all group">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <Package className="w-10 h-10 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggle(product.id)}
                                            className={`p-2.5 rounded-xl transition-colors ${product.is_active ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}
                                            title={product.is_active ? 'Masquer du site' : 'Afficher sur le site'}
                                        >
                                            <Power className="w-5 h-5" />
                                        </button>
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="p-2.5 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1 mb-6">
                                    <h3 className="font-bold text-xl text-gray-900 line-clamp-1">{product.name}</h3>
                                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{product.category || 'Sans catégorie'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Prix</p>
                                        <p className="text-2xl font-black text-black">{product.price.toLocaleString()} F</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Stock</p>
                                        <div className="flex items-center gap-2">
                                            <p className={`text-2xl font-black ${product.stock <= 10 ? 'text-red-600' : 'text-black'}`}>
                                                {product.stock}
                                            </p>
                                            {product.stock <= 10 && (
                                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
