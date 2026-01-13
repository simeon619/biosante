'use client';

import React, { useState } from 'react';
import { Truck, Plus, Trash2, Edit, CheckCircle, XCircle, Loader2, DollarSign, Building, Search, Power, Globe, Building2, Phone, MapPin, X, Info, Save } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/lib/utils';

interface ShippingCompany {
    id: number;
    slug?: string;
    name: string;
    type: string;
    contact: string;
    hub_principal: string;
    regions_desservies: string[];
    destinations: string[];
    is_active: boolean;
}

export default function AdminShippingPage() {
    const queryClient = useQueryClient();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<ShippingCompany | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state for adding/editing
    const [formData, setFormData] = useState({
        slug: '',
        name: '',
        type: 'National',
        contact: '',
        hub_principal: '',
        regions_desservies: [] as string[],
        destinations: [] as string[],
        is_active: true
    });

    const [newRegion, setNewRegion] = useState('');
    const [newDestination, setNewDestination] = useState('');

    const { data: companies = [], isLoading } = useQuery<ShippingCompany[]>({
        queryKey: ['admin', 'shipping'],
        queryFn: async () => {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/admin/shipping`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch shipping data');
            const data = await response.json();
            return data.companies || [];
        }
    });

    const addMutation = useMutation({
        mutationFn: async (companyData: typeof formData) => {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/admin/shipping`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(companyData)
            });
            if (!response.ok) throw new Error('Failed to add company');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'shipping'] });
            setIsAddModalOpen(false);
            setFormData({
                slug: '',
                name: '',
                type: 'National',
                contact: '',
                hub_principal: '',
                regions_desservies: [],
                destinations: [],
                is_active: true
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (companyData: ShippingCompany) => {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/admin/shipping/${companyData.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(companyData)
            });
            if (!response.ok) throw new Error('Failed to update company');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'shipping'] });
            setIsEditModalOpen(false);
            setSelectedCompany(null);
        }
    });

    const toggleMutation = useMutation({
        mutationFn: async (id: number) => {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/admin/shipping/${id}/toggle`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to toggle status');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'shipping'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/admin/shipping/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to delete company');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'shipping'] });
        }
    });

    const handleToggle = (id: number) => {
        toggleMutation.mutate(id);
    };

    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette compagnie ?')) {
            deleteMutation.mutate(id);
        }
    };

    const openAddModal = () => {
        setSelectedCompany(null);
        setFormData({
            slug: '',
            name: '',
            type: 'National',
            contact: '',
            hub_principal: '',
            regions_desservies: [],
            destinations: [],
            is_active: true
        });
        setIsAddModalOpen(true);
    };

    const openEditModal = (company: ShippingCompany) => {
        setSelectedCompany(company);
        setFormData({
            slug: company.slug || '',
            name: company.name,
            type: company.type,
            contact: company.contact,
            hub_principal: company.hub_principal,
            regions_desservies: company.regions_desservies || [],
            destinations: company.destinations || [],
            is_active: company.is_active
        });
        setIsEditModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCompany) {
            updateMutation.mutate({ ...formData, id: selectedCompany.id });
        } else {
            addMutation.mutate(formData);
        }
    };

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Expédition</h1>
                    <p className="text-gray-500">Gérez vos compagnies et zones de livraison</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter une compagnie
                </button>
            </div>

            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une compagnie..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {isLoading ? (
                <div className="flex flex-center justify-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-black" />
                </div>
            ) : filteredCompanies.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Truck className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Aucune compagnie</h3>
                    <p className="text-gray-500">Commencez par ajouter votre premier partenaire de livraison.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map((company) => (
                        <div key={company.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center">
                                        <Truck className="w-6 h-6" />
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleToggle(company.id)}
                                            className={`p-2 rounded-lg transition-colors ${company.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                                            title={company.is_active ? 'Désactiver' : 'Activer'}
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => openEditModal(company)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Modifier"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(company.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Globe className="w-4 h-4" />
                                        <span>{company.type}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-[10px] uppercase font-bold">Hub Principal</p>
                                            <p className="text-gray-900 font-medium">{company.hub_principal}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-[10px] uppercase font-bold">Contact</p>
                                            <p className="text-gray-900 font-medium">{company.contact}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-[10px] uppercase font-bold">Régions</p>
                                            <p className="text-gray-900 font-medium line-clamp-1">
                                                {company.regions_desservies?.join(', ') || 'Aucune'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Add/Edit */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold">
                                {selectedCompany ? 'Modifier la compagnie' : 'Ajouter une compagnie'}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsAddModalOpen(false);
                                    setIsEditModalOpen(false);
                                }}
                                className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Nom de la compagnie</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Slug (optionnel)</label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
                                            placeholder="ex: dhl-express"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Type de réseau</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all bg-white"
                                        >
                                            <option value="National">National</option>
                                            <option value="International">International</option>
                                            <option value="Local">Local (Ville)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Hub Principal</label>
                                        <input
                                            type="text"
                                            value={formData.hub_principal}
                                            onChange={(e) => setFormData({ ...formData, hub_principal: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Contact</label>
                                        <input
                                            type="text"
                                            value={formData.contact}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Régions desservies</label>
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={newRegion}
                                                onChange={(e) => setNewRegion(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), (newRegion && setFormData({ ...formData, regions_desservies: [...formData.regions_desservies, newRegion] }), setNewRegion('')))}
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm"
                                                placeholder="Ajouter une région..."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (newRegion) {
                                                        setFormData({ ...formData, regions_desservies: [...formData.regions_desservies, newRegion] });
                                                        setNewRegion('');
                                                    }
                                                }}
                                                className="p-2 bg-black text-white rounded-xl"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.regions_desservies.map((region, idx) => (
                                                <span key={idx} className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold border border-gray-100">
                                                    {region}
                                                    <button type="button" onClick={() => setFormData({ ...formData, regions_desservies: formData.regions_desservies.filter((_, i) => i !== idx) })}>
                                                        <X className="w-3 h-3 hover:text-red-500" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Destinations spécifiques</label>
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={newDestination}
                                                onChange={(e) => setNewDestination(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), (newDestination && setFormData({ ...formData, destinations: [...formData.destinations, newDestination] }), setNewDestination('')))}
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm"
                                                placeholder="Ajouter une destination..."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (newDestination) {
                                                        setFormData({ ...formData, destinations: [...formData.destinations, newDestination] });
                                                        setNewDestination('');
                                                    }
                                                }}
                                                className="p-2 bg-black text-white rounded-xl"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.destinations.map((dest, i) => (
                                                <span key={i} className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">
                                                    <MapPin className="w-3 h-3" />
                                                    {dest}
                                                    <button type="button" onClick={() => setFormData({ ...formData, destinations: formData.destinations.filter((_, idx) => idx !== i) })}>
                                                        <X className="w-3 h-3 hover:text-red-500" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_active}
                                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                    className="sr-only"
                                                />
                                                <div className={`w-12 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-black' : 'bg-gray-200'}`}></div>
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.is_active ? 'left-7' : 'left-1'}`}></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">Compagnie Active</span>
                                        </label>
                                        <div className="mt-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3">
                                            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-[11px] text-blue-700 leading-relaxed">
                                                Une compagnie active sera visible pour les clients lors de la sélection du mode de livraison à la commande.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 mt-10 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setIsEditModalOpen(false);
                                    }}
                                    className="px-6 py-2.5 text-sm font-black text-gray-500 uppercase tracking-widest hover:text-black transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={addMutation.isPending || updateMutation.isPending}
                                    className="flex items-center gap-2 bg-black text-white px-10 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                                >
                                    {(addMutation.isPending || updateMutation.isPending) ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5" />
                                    )}
                                    {selectedCompany ? 'Enregistrer' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
