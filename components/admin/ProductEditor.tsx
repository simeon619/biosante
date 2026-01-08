'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Save, ArrowLeft, Loader2, Upload, Trash2, Plus,
    Image as ImageIcon, Info, Tag, DollarSign, Package, CheckCircle2,
    Layout
} from 'lucide-react';
import { API_URL } from '@/lib/utils';

interface ProductEditorProps {
    productId?: string;
    isNew?: boolean;
}

export default function ProductEditor({ productId, isNew }: ProductEditorProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('general');

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: 0,
        stock: 0,
        description: '',
        is_active: true,
        image: '',
        ingredients_image: '',
        infographic_image: '',
        gallery: [] as string[],
        tagline: '',
        category: '',
        benefits: ''
    });

    const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

    useEffect(() => {
        if (!isNew && productId) {
            fetchProduct();
        }
    }, [productId, isNew]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/products/${productId}`, { cache: 'no-store' });
            const data = await response.json();
            console.log('[ProductEditor] Fetched product data:', data.product);
            if (data.product) {
                const p = data.product;
                setFormData({
                    ...p,
                    benefits: Array.isArray(p.benefits) ? p.benefits.join(', ') : (p.benefits || ''),
                    gallery: Array.isArray(p.gallery) ? p.gallery : [],
                });
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, slot: string) => {
        const file = e.target.files?.[0];
        if (!file) {
            console.log('[ProductEditor] No file selected');
            return;
        }

        console.log(`[ProductEditor] Uploading file to slot: ${slot}, file: ${file.name}, size: ${file.size}`);
        setUploadingSlot(slot);
        const fd = new FormData();
        fd.append('image', file);

        try {
            const response = await fetch(`${API_URL}/api/admin/uploads/image`, {
                method: 'POST',
                body: fd,
            });

            console.log(`[ProductEditor] Upload response status: ${response.status}`);

            if (response.ok) {
                const data = await response.json();
                console.log(`[ProductEditor] Upload successful, URL: ${data.url}`);
                if (slot === 'gallery') {
                    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, data.url] }));
                } else {
                    setFormData(prev => ({ ...prev, [slot]: data.url }));
                }
            } else {
                const errorData = await response.json();
                console.error(`[ProductEditor] Upload failed:`, errorData);
                alert(`Erreur d'upload: ${errorData.error || 'Erreur inconnue'}`);
            }
        } catch (error) {
            console.error('[ProductEditor] Upload error:', error);
            alert('Échec de la connexion au serveur pour l\'upload.');
        } finally {
            setUploadingSlot(null);
        }
    };

    const removeFromGallery = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const url = isNew
                ? `${API_URL}/api/admin/products`
                : `${API_URL}/api/admin/products/${productId}`;

            const payload = {
                ...formData,
                benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b !== '')
            };

            console.log('[ProductEditor] Sending payload:', payload);

            const response = await fetch(url, {
                method: isNew ? 'POST' : 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('[ProductEditor] Save successful');
                alert('Produit enregistré avec succès !');
                router.push('/admin/products');
                router.refresh();
            } else {
                const err = await response.json();
                alert(err.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Erreur réseau lors de la sauvegarde');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-black" />
            </div>
        );
    }

    const sections = [
        { id: 'general', label: 'Infos Générales', icon: Info },
        { id: 'media', label: 'Photos & Médias', icon: ImageIcon },
        { id: 'pricing', label: 'Prix & Stock', icon: DollarSign },
        { id: 'content', label: 'Contraires & Bienfaits', icon: Layout },
    ];

    const ImageSlot = ({ slot, label, sublabel, value }: { slot: string, label: string, sublabel: string, value: string }) => (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold text-gray-900">{label}</h4>
                    <p className="text-sm text-gray-500">{sublabel}</p>
                </div>
                {value && (
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, [slot]: '' }))}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className={`relative aspect-video rounded-xl border-2 border-dashed transition-all flex items-center justify-center overflow-hidden bg-gray-50 ${value ? 'border-transparent' : 'border-gray-200'}`}>
                {value ? (
                    <img src={value} alt={label} className="w-full h-full object-contain" />
                ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                        {uploadingSlot === slot ? (
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Cliquez pour uploader</span>
                            </>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, slot)} disabled={!!uploadingSlot} />
                    </label>
                )}
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header Sticky */}
            <div className="sticky top-0 z-30 flex items-center justify-between bg-gray-50/80 backdrop-blur-md py-4 border-b border-gray-100 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white rounded-xl transition-all shadow-sm border border-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isNew ? 'Nouveau Produit' : `Modifier ${formData.name}`}
                        </h1>
                        <p className="text-sm text-gray-500">Haut du catalogue • {formData.id || 'slug-automatique'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isNew ? 'Créer le produit' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Navigation Gauche */}
                <div className="md:col-span-1 space-y-2">
                    {sections.map(s => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => setActiveSection(s.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeSection === s.id
                                ? 'bg-black text-white shadow-lg shadow-black/10 scale-[1.02]'
                                : 'text-gray-500 hover:bg-white'
                                }`}
                        >
                            <s.icon className="w-5 h-5" />
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Contenu Principal */}
                <div className="md:col-span-3 space-y-8">
                    {activeSection === 'general' && (
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Info className="w-6 h-6 text-blue-500" />
                                Informations de base
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                {isNew && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Identifiant Unique (Slug)</label>
                                        <input
                                            type="text"
                                            value={formData.id}
                                            onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                                            placeholder="ex: bioactif"
                                            required
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nom du Produit</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Description Commerciale</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all min-h-[150px] resize-none"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Slogan</label>
                                        <input
                                            type="text"
                                            value={formData.tagline}
                                            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                                            placeholder="ex: DIABÈTE • HYPERTENSION"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie</label>
                                        <input
                                            type="text"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                                            placeholder="ex: HYPERTENSION"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'media' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ImageSlot
                                    slot="image"
                                    label="Photo Principale"
                                    sublabel="Affichée dans les listes et en tête de page (Flacon/Packshot)"
                                    value={formData.image}
                                />
                                <ImageSlot
                                    slot="ingredients_image"
                                    label="Détails Ingrédients"
                                    sublabel="Photo expliquant la composition naturelle du produit"
                                    value={formData.ingredients_image}
                                />
                                <ImageSlot
                                    slot="infographic_image"
                                    label="Infographie"
                                    sublabel="Tableau ou graphique explicatif sur les bienfaits"
                                    value={formData.infographic_image}
                                />
                            </div>

                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <ImageIcon className="w-6 h-6 text-purple-500" />
                                    Galerie Lifestyle
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {formData.gallery.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-2xl border border-gray-100 overflow-hidden group">
                                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeFromGallery(idx)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                                        {uploadingSlot === 'gallery' ? (
                                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                        ) : (
                                            <>
                                                <Plus className="w-6 h-6 text-gray-400 mb-1" />
                                                <span className="text-xs text-gray-500">Ajouter</span>
                                            </>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')} disabled={!!uploadingSlot} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'pricing' && (
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <DollarSign className="w-6 h-6 text-green-500" />
                                Inventaire & Prix
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-black text-white rounded-xl">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <label className="font-bold text-gray-700">Prix de vente (FCFA)</label>
                                    </div>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                        className="w-full text-3xl font-bold bg-transparent border-none outline-none focus:ring-0"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 italic">Prix affiché sur le site public.</p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-black text-white rounded-xl">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <label className="font-bold text-gray-700">Stock disponible</label>
                                    </div>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                        className="w-full text-3xl font-bold bg-transparent border-none outline-none focus:ring-0"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 italic">Quantité restante avant "Indisponible".</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <div className="flex-1 p-6 bg-gray-50 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${formData.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-700">Statut de Visibilité</p>
                                            <p className="text-sm text-gray-500">{formData.is_active ? 'Visible sur le site' : 'Masqué pour les clients'}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                                        className={`w-14 h-8 rounded-full transition-all relative ${formData.is_active ? 'bg-black' : 'bg-gray-300'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.is_active ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'content' && (
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Layout className="w-6 h-6 text-orange-500" />
                                Contenu Détaillé
                            </h3>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Liste des Bienfaits</label>
                                <textarea
                                    value={formData.benefits}
                                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all min-h-[120px]"
                                    placeholder="Séparez les bienfaits par des virgules (ex: 100% Naturel, Énergie pure...)"
                                />
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {formData.benefits.split(',').map((b, i) => b.trim() && (
                                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                            {b.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
