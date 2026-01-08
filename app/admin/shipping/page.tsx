'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Truck, Edit, Trash2, Power, Search, Loader2, Save, MapPin } from 'lucide-react';
import { API_URL } from '@/lib/utils';

interface ShippingCompany {
    id: number;
    name: string;
    type: 'local' | 'inland';
    contact: string;
    is_active: boolean;
}

export default function AdminShippingPage() {
    const [companies, setCompanies] = useState<ShippingCompany[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState<ShippingCompany | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        type: 'local' as 'local' | 'inland',
        contact: '',
        is_active: true
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/shipping`);
            const data = await response.json();
            setCompanies(data.companies || []);
        } catch (error) {
            console.error('Failed to fetch companies:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = async (id: number) => {
        try {
            await fetch(`${API_URL}/api/admin/shipping/${id}/toggle`, {
                method: 'POST'
            });
            fetchCompanies();
        } catch (error) {
            console.error('Failed to toggle company:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette compagnie ?')) return;
        try {
            await fetch(`${API_URL}/api/admin/shipping/${id}`, {
                method: 'DELETE'
            });
            fetchCompanies();
        } catch (error) {
            console.error('Failed to delete company:', error);
        }
    };

    const openEditModal = (company: ShippingCompany) => {
        setEditingCompany(company);
        setFormData(company);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const url = editingCompany
                ? `${API_URL}/api/admin/shipping/${editingCompany.id}`
                : `${API_URL}/api/admin/shipping`;

            const response = await fetch(url, {
                method: editingCompany ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowModal(false);
                fetchCompanies();
            }
        } catch (error) {
            console.error('Failed to save company:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Expédition</h1>
                    <p className="text-gray-500">Gérez les compagnies de transport et livreurs</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCompany(null);
                        setFormData({ name: '', type: 'local', contact: '', is_active: true });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter une compagnie
                </button>
            </div>

            <div className="relative max-w-md">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une compagnie..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map((company) => (
                        <div key={company.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`${company.type === 'local' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'} p-3 rounded-xl`}>
                                        <Truck className="w-6 h-6" />
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleToggle(company.id)}
                                            className={`p-2 rounded-lg ${company.is_active ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}
                                        >
                                            <Power className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openEditModal(company)}
                                            className="p-2 rounded-lg text-blue-600 bg-blue-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(company.id)}
                                            className="p-2 rounded-lg text-red-600 bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900">{company.name}</h3>
                                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4 capitalize">
                                    <MapPin className="w-3 h-3" />
                                    {company.type === 'local' ? 'Local (Abidjan)' : 'Intérieur du Pays'}
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Contact / Note</p>
                                    <p className="text-sm font-medium text-gray-900">{company.contact || 'Aucun contact'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {editingCompany ? 'Modifier la compagnie' : 'Nouvelle compagnie'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la compagnie</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type de service</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'local' | 'inland' })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                >
                                    <option value="local">Local (Abidjan)</option>
                                    <option value="inland">Villes de l'Intérieur</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact / Détails</label>
                                <input
                                    type="text"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                    placeholder="N° Téléphone ou secteur"
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
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {editingCompany ? 'Enregistrer' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
