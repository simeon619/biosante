'use client';

import React, { useEffect, useState } from 'react';
import {
    Settings,
    Phone,
    Mail,
    DollarSign,
    Truck,
    Building2,
    MessageSquare,
    Save,
    Loader2,
    CheckCircle2,
    RefreshCw,
    AlertCircle,
    BarChart
} from 'lucide-react';
import { API_URL } from '@/lib/utils';

interface Setting {
    key: string;
    value: string;
    label: string;
    type: string;
    category: string;
    description: string | null;
    updated_at: string | null;
}

const categoryInfo: Record<string, { label: string; icon: React.ElementType; color: string }> = {
    payment: { label: 'Paiement', icon: DollarSign, color: 'from-emerald-500 to-teal-600' },
    contact: { label: 'Contact', icon: Phone, color: 'from-blue-500 to-indigo-600' },
    sms: { label: 'SMS & OTP', icon: MessageSquare, color: 'from-purple-500 to-violet-600' },
    delivery: { label: 'Livraison', icon: Truck, color: 'from-amber-500 to-orange-600' },
    business: { label: 'Entreprise', icon: Building2, color: 'from-gray-600 to-gray-800' },
    marketing: { label: 'Marketing', icon: BarChart, color: 'from-rose-500 to-pink-600' },
};

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Record<string, Setting[]>>({});
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editedValues, setEditedValues] = useState<Record<string, string>>({});
    const [activeCategory, setActiveCategory] = useState<string>('payment');

    const fetchSettings = async () => {
        setIsLoading(true);
        setError('');
        try {
            const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');
            const response = await fetch(`${API_URL}/api/admin/settings`, {
                headers: { 'X-Admin-Id': adminData.id }
            });

            if (!response.ok) throw new Error('Erreur de chargement');

            const data = await response.json();
            setSettings(data.settings);
            setCategories(data.categories);
            if (data.categories.length > 0 && !data.categories.includes(activeCategory)) {
                setActiveCategory(data.categories[0]);
            }

            // Initialize edited values
            const initial: Record<string, string> = {};
            for (const category of Object.values(data.settings) as Setting[][]) {
                for (const setting of category) {
                    initial[setting.key] = setting.value;
                }
            }
            setEditedValues(initial);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleValueChange = (key: string, value: string) => {
        setEditedValues(prev => ({ ...prev, [key]: value }));
        setSuccess('');
    };

    const hasChanges = () => {
        for (const category of Object.values(settings) as Setting[][]) {
            for (const setting of category) {
                if (editedValues[setting.key] !== setting.value) {
                    return true;
                }
            }
        }
        return false;
    };

    const saveSettings = async () => {
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');
            const changes: { key: string; value: string }[] = [];

            for (const category of Object.values(settings) as Setting[][]) {
                for (const setting of category) {
                    if (editedValues[setting.key] !== setting.value) {
                        changes.push({ key: setting.key, value: editedValues[setting.key] });
                    }
                }
            }

            if (changes.length === 0) {
                setSuccess('Aucune modification à sauvegarder');
                setIsSaving(false);
                return;
            }

            const response = await fetch(`${API_URL}/api/admin/settings/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Id': adminData.id
                },
                body: JSON.stringify({ settings: changes })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erreur de sauvegarde');
            }

            setSuccess(`${changes.length} paramètre(s) mis à jour avec succès`);
            await fetchSettings();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const formatPhoneInput = (value: string) => {
        const digits = value.replace(/\D/g, '');
        if (digits.startsWith('225')) {
            return '+' + digits;
        }
        if (!value.startsWith('+') && digits.length > 0) {
            return '+225' + digits;
        }
        return value;
    };

    const renderInput = (setting: Setting) => {
        const value = editedValues[setting.key] ?? setting.value;
        const isModified = value !== setting.value;

        const baseClasses = `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${isModified ? 'border-amber-400 bg-amber-50' : 'border-gray-200'
            }`;

        if (setting.type === 'phone') {
            return (
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="tel"
                        value={value}
                        onChange={(e) => handleValueChange(setting.key, formatPhoneInput(e.target.value))}
                        className={`${baseClasses} pl-10`}
                        placeholder="+2250XXXXXXXXX"
                    />
                </div>
            );
        }

        if (setting.type === 'email') {
            return (
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="email"
                        value={value}
                        onChange={(e) => handleValueChange(setting.key, e.target.value)}
                        className={`${baseClasses} pl-10`}
                        placeholder="email@example.com"
                    />
                </div>
            );
        }

        if (setting.type === 'number') {
            return (
                <div className="relative">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => handleValueChange(setting.key, e.target.value)}
                        className={baseClasses}
                        min="0"
                    />
                    {setting.category === 'delivery' && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">FCFA</span>
                    )}
                </div>
            );
        }

        return (
            <input
                type="text"
                value={value}
                onChange={(e) => handleValueChange(setting.key, e.target.value)}
                className={baseClasses}
            />
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chargement des paramètres...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Paramètres</h1>
                    <p className="text-gray-500 mt-1">Configuration du système</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchSettings}
                        className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={saveSettings}
                        disabled={isSaving || !hasChanges()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Enregistrer
                    </button>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}
            {success && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <p>{success}</p>
                </div>
            )}

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => {
                    const info = categoryInfo[cat] || { label: cat, icon: Settings, color: 'from-gray-500 to-gray-600' };
                    const Icon = info.icon;
                    const isActive = activeCategory === cat;

                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${isActive
                                ? `bg-gradient-to-r ${info.color} text-white shadow-lg`
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {info.label}
                        </button>
                    );
                })}
            </div>

            {/* Settings Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6">
                    <div className="grid gap-6">
                        {settings[activeCategory]?.map((setting) => (
                            <div key={setting.key} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-900">
                                        {setting.label}
                                    </label>
                                    {editedValues[setting.key] !== setting.value && (
                                        <span className="text-xs text-amber-600 font-medium">Modifié</span>
                                    )}
                                </div>
                                {renderInput(setting)}
                                {setting.description && (
                                    <p className="text-xs text-gray-500">{setting.description}</p>
                                )}
                            </div>
                        ))}

                        {(!settings[activeCategory] || settings[activeCategory].length === 0) && (
                            <div className="text-center py-12 text-gray-400">
                                <Settings className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>Aucun paramètre dans cette catégorie</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Changes indicator */}
            {hasChanges() && (
                <div className="fixed bottom-6 right-6 bg-amber-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="font-medium">Modifications non enregistrées</span>
                </div>
            )}
        </div>
    );
}
