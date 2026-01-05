'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Mic, Play, Pause, Edit, Trash2, GripVertical, Power, Loader2 } from 'lucide-react';

interface Testimonial {
    id: number;
    product_id: string;
    author: string;
    location: string;
    audio_url: string;
    duration: string;
    is_active: boolean;
    display_order: number;
}

export default function AdminAudioPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<string>('all');
    const [showModal, setShowModal] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [playingId, setPlayingId] = useState<number | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        product_id: 'bioactif',
        author: '',
        location: '',
        duration: '0:00'
    });
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchTestimonials();
    }, [selectedProduct]);

    const fetchTestimonials = async () => {
        try {
            const url = selectedProduct === 'all'
                ? 'http://localhost:3333/api/admin/testimonials'
                : `http://localhost:3333/api/admin/testimonials?product_id=${selectedProduct}`;

            const response = await fetch(url);
            const data = await response.json();
            setTestimonials(data.testimonials || []);
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
        } finally {
            setIsLoading(false);
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

            if (audioFile) {
                formDataToSend.append('audio', audioFile);
            }

            const url = editingTestimonial
                ? `http://localhost:3333/api/admin/testimonials/${editingTestimonial.id}`
                : 'http://localhost:3333/api/admin/testimonials';

            const response = await fetch(url, {
                method: editingTestimonial ? 'PATCH' : 'POST',
                body: formDataToSend
            });

            if (response.ok) {
                setShowModal(false);
                setEditingTestimonial(null);
                setFormData({ product_id: 'bioactif', author: '', location: '', duration: '0:00' });
                setAudioFile(null);
                fetchTestimonials();
            }
        } catch (error) {
            console.error('Failed to save testimonial:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggle = async (id: number) => {
        try {
            await fetch(`http://localhost:3333/api/admin/testimonials/${id}/toggle`, {
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
            await fetch(`http://localhost:3333/api/admin/testimonials/${id}`, {
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
            duration: testimonial.duration
        });
        setShowModal(true);
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
                    <h1 className="text-2xl font-bold text-gray-900">Témoignages Audio</h1>
                    <p className="text-gray-500">Gérez les témoignages clients pour chaque produit</p>
                </div>
                <button
                    onClick={() => {
                        setEditingTestimonial(null);
                        setFormData({ product_id: 'bioactif', author: '', location: '', duration: '0:00' });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter
                </button>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {['all', 'bioactif', 'vitamax'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setSelectedProduct(filter)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedProduct === filter
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {filter === 'all' ? 'Tous' : filter.charAt(0).toUpperCase() + filter.slice(1)}
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
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedTestimonials).map(([productId, items]) => (
                        <div key={productId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <div className={`px-6 py-4 border-b border-gray-100 ${productId === 'bioactif' ? 'bg-rose-50' : 'bg-emerald-50'
                                }`}>
                                <h3 className="font-bold text-gray-900 capitalize">{productId}</h3>
                                <p className="text-sm text-gray-500">{items.length} témoignage(s)</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {items.map((testimonial) => (
                                    <div key={testimonial.id} className="px-6 py-4 flex items-center gap-4">
                                        <GripVertical className="w-5 h-5 text-gray-300 cursor-grab" />

                                        <button
                                            onClick={() => setPlayingId(playingId === testimonial.id ? null : testimonial.id)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${playingId === testimonial.id
                                                    ? 'bg-gray-900 text-white'
                                                    : productId === 'bioactif'
                                                        ? 'bg-rose-500 text-white'
                                                        : 'bg-emerald-500 text-white'
                                                }`}
                                        >
                                            {playingId === testimonial.id ? (
                                                <Pause className="w-4 h-4" />
                                            ) : (
                                                <Play className="w-4 h-4 ml-0.5" />
                                            )}
                                        </button>

                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{testimonial.author}</p>
                                            <p className="text-sm text-gray-500">{testimonial.location}</p>
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
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {editingTestimonial ? 'Modifier le témoignage' : 'Nouveau témoignage'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                                <select
                                    value={formData.product_id}
                                    onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                >
                                    <option value="bioactif">BioActif</option>
                                    <option value="vitamax">VitaMax</option>
                                </select>
                            </div>

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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                                <input
                                    type="text"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                    placeholder="1:23"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fichier Audio {editingTestimonial && '(optionnel)'}
                                </label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                    required={!editingTestimonial}
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
