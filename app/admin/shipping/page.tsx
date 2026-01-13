'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Truck, Edit, Trash2, Power, Search, Loader2, Save, MapPin, X, Info, Globe, Building2, Phone } from 'lucide-react';
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
    const [companies, setCompanies] = useState<ShippingCompany[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState<ShippingCompany | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
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
        setFormData({
            slug: company.slug || '',
            name: company.name,
            type: company.type,
            contact: company.contact || '',
            hub_principal: company.hub_principal || '',
            regions_desservies: company.regions_desservies || [],
            destinations: company.destinations || [],
            is_active: company.is_active
        });
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

    const addRegion = () => {
        if (newRegion.trim() && !formData.regions_desservies.includes(newRegion.trim())) {
            setFormData({
                ...formData,
                regions_desservies: [...formData.regions_desservies, newRegion.trim()]
            });
            setNewRegion('');
        }
    };

    const removeRegion = (region: string) => {
        setFormData({
            ...formData,
            regions_desservies: formData.regions_desservies.filter(r => r !== region)
        });
    };

    const addDestination = () => {
        if (newDestination.trim() && !formData.destinations.includes(newDestination.trim())) {
            setFormData({
                ...formData,
                destinations: [...formData.destinations, newDestination.trim()]
            });
            setNewDestination('');
        }
    };

    const removeDestination = (dest: string) => {
        setFormData({
            ...formData,
            destinations: formData.destinations.filter(d => d !== dest)
        });
    };

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.destinations && c.destinations.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Expédition</h1>
                    <p className="text-gray-500">Gérez les compagnies de transport et livreurs</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            if (confirm('Voulez-vous réinitialiser les données à partir du fichier JSON par défaut ? Cela écrasera les modifications non sauvegardées.')) {
                                fetch(`${API_URL}/api/admin/shipping/seed`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ force: true })
                                }).then(() => fetchCompanies());
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                        Réinitialiser (JSON)
                    </button>
                    <button
                        onClick={() => {
                            setEditingCompany(null);
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
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Ajouter une compagnie
                    </button>
                </div>
            </div>

            <div className="relative max-w-md">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom, ville ou type..."
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
                        <div key={company.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`${company.type === 'Local' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'} p-3 rounded-xl`}>
                                        <Truck className="w-6 h-6" />
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleToggle(company.id)}
                                            className={`p-2 rounded-lg ${company.is_active ? 'text-green-600 bg-green-50 focus:ring-2 focus:ring-green-400' : 'text-gray-400 bg-gray-50'}`}
                                            title={company.is_active ? 'Désactiver' : 'Activer'}
                                        >
                                            <Power className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openEditModal(company)}
                                            className="p-2 rounded-lg text-blue-600 bg-blue-50 focus:ring-2 focus:ring-blue-400"
                                            title="Modifier"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(company.id)}
                                            className="p-2 rounded-lg text-red-600 bg-red-50 focus:ring-2 focus:ring-red-400"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-4">
                                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{company.name}</h3>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        <Globe className="w-3 h-3" />
                                        {company.type}
                                        {company.slug && <span className="ml-2 text-gray-300">#{company.slug}</span>}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {company.hub_principal && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-600 line-clamp-2"><span className="font-semibold text-gray-900">Hub:</span> {company.hub_principal}</span>
                                        </div>
                                    )}
                                    {company.contact && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-600"><span className="font-semibold text-gray-900">Contact:</span> {company.contact}</span>
                                        </div>
                                    )}

                                    {company.destinations && company.destinations.length > 0 && (
                                        <div className="pt-2 border-t border-gray-50">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                Villes desservies ({company.destinations.length})
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {company.destinations.slice(0, 5).map((dest, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-md border border-gray-100">
                                                        {dest}
                                                    </span>
                                                ))}
                                                {company.destinations.length > 5 && (
                                                    <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-md border border-gray-100 italic">
                                                        +{company.destinations.length - 5} de plus
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={`h-1 w-full ${company.is_active ? 'bg-green-500' : 'bg-gray-200'}`} />
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-2xl my-auto shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                                    {editingCompany ? 'Modifier Compagnie' : 'Nouvelle Compagnie'}
                                </h2>
                                <p className="text-gray-500 text-sm">Configurez les gares et zones de livraison.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nom de la compagnie</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none border-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Slug / ID unique</label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                                            className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none border-2"
                                            placeholder="ex: utb, stc"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Type de couverture</label>
                                        <input
                                            type="text"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none border-2"
                                            placeholder="ex: National, Local, Grand Régional"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Contact Colis</label>
                                        <input
                                            type="text"
                                            value={formData.contact}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none border-2"
                                            placeholder="N° Téléphone ou poste"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Hub / Gares principales</label>
                                        <textarea
                                            value={formData.hub_principal}
                                            onChange={(e) => setFormData({ ...formData, hub_principal: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none border-2 min-h-[100px]"
                                            placeholder="Listez les gares principales..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Régions desservies</label>
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newRegion}
                                                    onChange={(e) => setNewRegion(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRegion())}
                                                    className="flex-1 px-4 py-2 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none border-2 text-sm"
                                                    placeholder="Zone (ex: Nord)"
                                                />
                                                <button type="button" onClick={addRegion} className="p-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.regions_desservies.map((region, idx) => (
                                                    <span key={idx} className="flex items-center gap-1 pl-2 pr-1 py-1 bg-black text-white text-[10px] font-bold rounded-lg uppercase tracking-tight">
                                                        {region}
                                                        <button type="button" onClick={() => removeRegion(region)} className="p-0.5 hover:bg-white/20 rounded">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Villes desservies (Destinations précises)
                                </label>
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newDestination}
                                            onChange={(e) => setNewDestination(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDestination())}
                                            className="flex-1 px-4 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none border-2"
                                            placeholder="Ajouter une ville..."
                                        />
                                        <button type="button" onClick={addDestination} className="px-6 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest">
                                            Ajouter
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                        {formData.destinations.length > 0 ? (
                                            formData.destinations.map((dest, idx) => (
                                                <span key={idx} className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-white border border-gray-200 text-gray-900 text-[10px] font-bold rounded-xl uppercase shadow-sm">
                                                    {dest}
                                                    <button type="button" onClick={() => removeDestination(dest)} className="p-1 hover:bg-gray-100 rounded-lg text-red-500">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </span>
                                            ))
                                        ) : (
                                            <div className="w-full flex flex-col items-center justify-center py-4 text-gray-400 gap-2">
                                                <Info className="w-5 h-5" />
                                                <p className="text-[10px] uppercase font-bold tracking-widest">Aucune ville ajoutée</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all text-gray-500"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-3 w-full max-w-[400px] px-8 py-4 bg-black text-white rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-black/10"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {editingCompany ? 'Mettre à jour la compagnie' : 'Créer la compagnie'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
