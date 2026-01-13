'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Plus, Mic, Play, Pause, Edit, Trash2, GripVertical, Power, Loader2, Image as ImageIcon, FileText, Upload } from 'lucide-react';
import { API_URL } from '@/lib/utils';

interface Testimonial {
    id: number;
    product_id: string;
    author: string;
    location: string;
    audio_url: string;
    duration: string;
    is_active: boolean;
    display_order: number;
    text_content?: string;
    author_image?: string;
}

interface Product {
    id: string;
    name: string;
    theme_color: string;
}

export default function AdminAudioPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<string>('all');
    const [showModal, setShowModal] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [playingId, setPlayingId] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        product_id: '',
        author: '',
        location: '',
        duration: '0:00',
        text_content: ''
    });
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            fetchTestimonials();
        }
    }, [selectedProduct, products]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/products`);
            const data = await response.json();
            setProducts(data.products || []);
            if (data.products?.length > 0 && !formData.product_id) {
                setFormData(prev => ({ ...prev, product_id: data.products[0].id }));
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const fetchTestimonials = async () => {
        try {
            const url = selectedProduct === 'all'
                ? `${API_URL}/api/admin/testimonials`
                : `${API_URL}/api/admin/testimonials?product_id=${selectedProduct}`;

            const response = await fetch(url);
            const data = await response.json();
            setTestimonials(data.testimonials || []);
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('product_id', formData.product_id);
            formDataToSend.append('author', formData.author);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('duration', formData.duration);
            formDataToSend.append('text_content', formData.text_content);

            if (audioFile) {
                formDataToSend.append('audio', audioFile);
            }

            if (imageFile) {
                formDataToSend.append('author_image', imageFile);
            }

            const url = editingTestimonial
                ? `${API_URL}/api/admin/testimonials/${editingTestimonial.id}`
                : `${API_URL}/api/admin/testimonials`;

            const response = await fetch(url, {
                method: editingTestimonial ? 'PATCH' : 'POST',
                body: formDataToSend
            });

            if (response.ok) {
                setShowModal(false);
                resetForm();
                fetchTestimonials();
            } else {
                const error = await response.json();
                alert(error.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Failed to save testimonial:', error);
            alert('Erreur de connexion');
        } finally {
            setIsSaving(false);
        }
    };

    const resetForm = () => {
        setEditingTestimonial(null);
        setFormData({
            product_id: products[0]?.id || '',
            author: '',
            location: '',
            duration: '0:00',
            text_content: ''
        });
        setAudioFile(null);
        setImageFile(null);
        setImagePreview(null);
    };

    const handleToggle = async (id: number) => {
        try {
            await fetch(`${API_URL}/api/admin/testimonials/${id}/toggle`, {
                method: 'POST'
            });
            fetchTestimonials();
        } catch (error) {
            console.error('Failed to toggle testimonial:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return;

        try {
            await fetch(`${API_URL}/api/admin/testimonials/${id}`, {
                method: 'DELETE'
            });
            fetchTestimonials();
        } catch (error) {
            console.error('Failed to delete testimonial:', error);
        }
    };

    const openEditModal = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            product_id: testimonial.product_id,
            author: testimonial.author,
            location: testimonial.location,
            duration: testimonial.duration,
            text_content: testimonial.text_content || ''
        });
        setImagePreview(testimonial.author_image || null);
        setShowModal(true);
    };

    const playAudio = (testimonial: Testimonial) => {
        if (playingId === testimonial.id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(testimonial.audio_url);
            audioRef.current.play();
            audioRef.current.onended = () => setPlayingId(null);
            setPlayingId(testimonial.id);
        }
    };

    const getProductColor = (productId: string): string => {
        const product = products.find(p => p.id === productId);
        const color = product?.theme_color || 'gray';
        const colorMap: Record<string, string> = {
            red: 'bg-rose-50 border-rose-200',
            green: 'bg-emerald-50 border-emerald-200',
            blue: 'bg-blue-50 border-blue-200',
            yellow: 'bg-yellow-50 border-yellow-200',
            orange: 'bg-orange-50 border-orange-200',
            purple: 'bg-purple-50 border-purple-200',
        };
        return colorMap[color] || 'bg-gray-50 border-gray-200';
    };

    const getButtonColor = (productId: string): string => {
        const product = products.find(p => p.id === productId);
        const color = product?.theme_color || 'gray';
        const colorMap: Record<string, string> = {
            red: 'bg-rose-500',
            green: 'bg-emerald-500',
            blue: 'bg-blue-500',
            yellow: 'bg-yellow-500',
            orange: 'bg-orange-500',
            purple: 'bg-purple-500',
        };
        return colorMap[color] || 'bg-gray-500';
    };

    const groupedTestimonials = testimonials.reduce((acc, t) => {
        if (!acc[t.product_id]) acc[t.product_id] = [];
        acc[t.product_id].push(t);
        return acc;
    }, {} as Record<string, Testimonial[]>);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Témoignages</h1>
                    <p className="text-gray-500">Audio, texte et images pour chaque produit</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter
                </button>
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setSelectedProduct('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedProduct === 'all'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Tous
                </button>
                {products.map((product) => (
                    <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedProduct === product.id
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {product.name}
                    </button>
                ))}
            </div>

            {/* Testimonials List */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                </div>
            ) : testimonials.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <Mic className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun témoignage pour le moment</p>
                    <p className="text-sm text-gray-400 mt-2">Cliquez sur "Ajouter" pour créer votre premier témoignage</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedTestimonials).map(([productId, items]) => {
                        const product = products.find(p => p.id === productId);
                        return (
                            <div key={productId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                <div className={`px-6 py-4 border-b ${getProductColor(productId)}`}>
                                    <h3 className="font-bold text-gray-900">{product?.name || productId}</h3>
                                    <p className="text-sm text-gray-500">{items.length} témoignage(s)</p>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {items.map((testimonial) => (
                                        <div key={testimonial.id} className="px-6 py-4 flex items-center gap-4">
                                            <GripVertical className="w-5 h-5 text-gray-300 cursor-grab" />

                                            {/* Author Image or Placeholder */}
                                            {testimonial.author_image ? (
                                                <img
                                                    src={testimonial.author_image}
                                                    alt={testimonial.author}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                                </div>
                                            )}

                                            {/* Play Button */}
                                            {testimonial.audio_url && (
                                                <button
                                                    onClick={() => playAudio(testimonial)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors text-white ${playingId === testimonial.id
                                                        ? 'bg-gray-900'
                                                        : getButtonColor(productId)
                                                        }`}
                                                >
                                                    {playingId === testimonial.id ? (
                                                        <Pause className="w-4 h-4" />
                                                    ) : (
                                                        <Play className="w-4 h-4 ml-0.5" />
                                                    )}
                                                </button>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                                                <p className="text-sm text-gray-500">{testimonial.location}</p>
                                                {testimonial.text_content && (
                                                    <p className="text-sm text-gray-600 italic mt-1 truncate">
                                                        "{testimonial.text_content}"
                                                    </p>
                                                )}
                                            </div>

                                            {/* Content indicators */}
                                            <div className="flex gap-1">
                                                {testimonial.audio_url && (
                                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                                                        <Mic className="w-3 h-3 inline" />
                                                    </span>
                                                )}
                                                {testimonial.text_content && (
                                                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                                                        <FileText className="w-3 h-3 inline" />
                                                    </span>
                                                )}
                                                {testimonial.author_image && (
                                                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">
                                                        <ImageIcon className="w-3 h-3 inline" />
                                                    </span>
                                                )}
                                            </div>

                                            <span className="text-sm font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                                {testimonial.duration}
                                            </span>

                                            <button
                                                onClick={() => handleToggle(testimonial.id)}
                                                className={`p-2 rounded-lg transition-colors ${testimonial.is_active
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-gray-100 text-gray-400'
                                                    }`}
                                                title={testimonial.is_active ? 'Actif' : 'Inactif'}
                                            >
                                                <Power className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => openEditModal(testimonial)}
                                                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(testimonial.id)}
                                                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 my-8">
                        <h2 className="text-xl font-bold mb-4">
                            {editingTestimonial ? 'Modifier le témoignage' : 'Nouveau témoignage'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Product Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                                <select
                                    value={formData.product_id}
                                    onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                >
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>{product.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Author */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                    placeholder="Nom du client"
                                    required
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                    placeholder="Ville, Quartier"
                                    required
                                />
                            </div>

                            {/* Text Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FileText className="w-4 h-4 inline mr-1" />
                                    Citation / Témoignage texte
                                </label>
                                <textarea
                                    value={formData.text_content}
                                    onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none h-24"
                                    placeholder="Ce que le client a dit..."
                                />
                            </div>

                            {/* Author Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <ImageIcon className="w-4 h-4 inline mr-1" />
                                    Photo de l'auteur
                                </label>
                                <div className="flex items-center gap-4">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="px-4 py-2 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
                                            <Upload className="w-4 h-4 inline mr-2" />
                                            {imageFile ? 'Changer l\'image' : 'Uploader une photo'}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Audio File */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Mic className="w-4 h-4 inline mr-1" />
                                    Fichier Audio {editingTestimonial && '(optionnel)'}
                                </label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Durée audio</label>
                                <input
                                    type="text"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                    placeholder="1:23"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingTestimonial ? 'Modifier' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
