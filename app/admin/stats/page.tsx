'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    DollarSign,
    Package,
    Calendar,
    RefreshCw,
    Loader2,
    ChevronDown,
    X,
    ArrowRight,
    Clock,
    CheckCircle2,
    XCircle,
    Activity
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/utils';

interface StatsData {
    orders: {
        total: number;
        pending: number;
        completed: number;
        cancelled: number;
        processing: number;
    };
    revenue: {
        total: number;
        average: number;
        previousTotal: number;
        trend: number;
    };
    products: {
        total: number;
        active: number;
    };
    topProducts: Array<{
        name: string;
        quantity: number;
        revenue: number;
    }>;
    recentOrders: Array<{
        id: string;
        customer: string;
        total: number;
        status: string;
        date: string;
    }>;
    dailyData: Array<{
        date: string;
        orders: number;
        revenue: number;
    }>;
}

// Date presets
const datePresets = [
    { label: "Aujourd'hui", days: 0 },
    { label: 'Hier', days: 1 },
    { label: '7 derniers jours', days: 7 },
    { label: '30 derniers jours', days: 30 },
    { label: '90 derniers jours', days: 90 },
    { label: 'Cette année', days: 365 },
];

export default function AdminStatsPage() {
    // Date range state
    const [startDate, setStartDate] = useState<Date>(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d;
    });
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    // Close date picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowDatePicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { data: stats, isLoading, error: queryError, refetch } = useQuery<StatsData>({
        queryKey: ['admin', 'stats', startDate.toISOString(), endDate.toISOString()],
        queryFn: async () => {
            const token = localStorage.getItem('admin_token');
            const url = `${API_URL}/api/admin/stats?start=${startDate.toISOString()}&end=${endDate.toISOString()}`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to fetch stats');
            }
            return response.json();
        }
    });

    const applyPreset = (days: number) => {
        const end = new Date();
        const start = new Date();
        if (days === 0) {
            start.setHours(0, 0, 0, 0);
        } else if (days === 1) {
            start.setDate(start.getDate() - 1);
            start.setHours(0, 0, 0, 0);
            end.setDate(end.getDate() - 1);
            end.setHours(23, 59, 59, 999);
        } else {
            start.setDate(start.getDate() - days);
        }
        setStartDate(start);
        setEndDate(end);
        setShowDatePicker(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header with Date Picker */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analyses & Statistiques</h1>
                    <p className="text-gray-500 text-sm">Suivez les performances de votre boutique en temps réel</p>
                </div>

                <div className="relative" ref={datePickerRef}>
                    <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm shadow-sm"
                    >
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                            {startDate.toLocaleDateString('fr-FR')} - {endDate.toLocaleDateString('fr-FR')}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
                    </button>

                    {showDatePicker && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2">
                            <div className="grid grid-cols-1 gap-1">
                                {datePresets.map((preset) => (
                                    <button
                                        key={preset.label}
                                        onClick={() => applyPreset(preset.days)}
                                        className="text-left px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors"
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-50">
                                <p className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Période personnalisée</p>
                                <div className="p-2 space-y-2">
                                    <input
                                        type="date"
                                        value={startDate.toISOString().split('T')[0]}
                                        onChange={(e) => setStartDate(new Date(e.target.value))}
                                        className="w-full text-xs border border-gray-100 rounded-lg p-2 outline-none focus:ring-1 focus:ring-black"
                                    />
                                    <input
                                        type="date"
                                        value={endDate.toISOString().split('T')[0]}
                                        onChange={(e) => setEndDate(new Date(e.target.value))}
                                        className="w-full text-xs border border-gray-100 rounded-lg p-2 outline-none focus:ring-1 focus:ring-black"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {queryError && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3">
                    <XCircle className="w-5 h-5" />
                    <p className="font-medium">{(queryError as any).message || 'Erreur lors du chargement'}</p>
                    <button onClick={() => refetch()} className="ml-auto text-sm font-bold underline">
                        Réessayer
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : stats && (
                <>
                    {/* Primary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <DollarSign className="w-16 h-16 text-black" />
                            </div>
                            <div className="flex items-center gap-3 text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">
                                <Activity className="w-4 h-4" />
                                Revenu Total
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-black text-gray-900">{formatCurrency(stats.revenue.total)}</p>
                                    <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${stats.revenue.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stats.revenue.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {Math.abs(stats.revenue.trend)}% vs période préc.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <ShoppingCart className="w-16 h-16 text-black" />
                            </div>
                            <div className="flex items-center gap-3 text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">
                                <Package className="w-4 h-4" />
                                Commandes
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-black text-gray-900">{stats.orders.total}</p>
                                    <p className="text-xs text-gray-400 mt-1 font-medium">{stats.orders.completed} terminées</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-900">Moy. Panier</p>
                                    <p className="text-sm font-bold text-gray-500">{formatCurrency(stats.revenue.average)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-16 h-16 text-black" />
                            </div>
                            <div className="flex items-center gap-3 text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">
                                <Clock className="w-4 h-4" />
                                En attente
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-black text-gray-900">{stats.orders.pending}</p>
                                    <p className="text-xs text-orange-500 mt-1 font-bold italic">À traiter d'urgence</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="w-16 h-16 text-black" />
                            </div>
                            <div className="flex items-center gap-3 text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">
                                <TrendingUp className="w-4 h-4" />
                                Taux conversion
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-black text-gray-900">
                                        {stats.orders.total > 0 ? ((stats.orders.completed / stats.orders.total) * 100).toFixed(1) : 0}%
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1 font-medium">Commandes livrées</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Daily Chart Visualisation (SVG Simulé) */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-black text-gray-900">Évolution du Chiffre d'Affaires</h3>
                                    <p className="text-xs text-gray-400 font-medium">Performances journalières sur la période</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-black rounded-full"></div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Revenu</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Commandes</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-64 relative flex items-end justify-between gap-1 mt-4">
                                {stats.dailyData.map((day, index) => {
                                    const maxRevenue = Math.max(...stats.dailyData.map(d => d.revenue)) || 1;
                                    const height = (day.revenue / maxRevenue) * 100;
                                    return (
                                        <div key={index} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                                            <div
                                                className="w-full bg-gray-50 group-hover:bg-black group-hover:scale-x-110 transition-all rounded-t-lg relative"
                                                style={{ height: `${height}%` }}
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap font-bold">
                                                    {formatCurrency(day.revenue)}
                                                </div>
                                            </div>
                                            <div className="mt-2 text-[8px] font-black text-gray-400 uppercase rotate-45 md:rotate-0 origin-center truncate w-full text-center">
                                                {formatDate(day.date)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-gray-900">Top Produits</h3>
                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-black" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {stats.topProducts.map((product, index) => (
                                    <div key={index} className="group p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-bold text-gray-900 text-sm truncate max-w-[150px]">{product.name}</p>
                                            <p className="text-xs font-black text-black">{formatCurrency(product.revenue)}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{product.quantity} ventes</span>
                                            </div>
                                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-black rounded-full"
                                                    style={{ width: `${(product.revenue / (stats.topProducts[0]?.revenue || 1)) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders Table */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-gray-900">Dernières Commandes</h3>
                                <p className="text-xs text-gray-400 font-medium">Les transactions les plus récentes</p>
                            </div>
                            <button className="flex items-center gap-2 text-xs font-bold text-black hover:underline uppercase tracking-widest">
                                Voir Tout <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Commande</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Montant</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {stats.recentOrders.map((order, index) => (
                                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-xs font-bold text-gray-900">#{order.id.slice(-8)}</td>
                                            <td className="px-6 py-4 text-xs font-medium text-gray-600">{order.customer}</td>
                                            <td className="px-6 py-4 text-xs font-black text-gray-900">{formatCurrency(order.total)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${order.status === 'completed' ? 'bg-green-50 text-green-600' :
                                                        order.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                                            'bg-gray-50 text-gray-600'
                                                    }`}>
                                                    {order.status === 'completed' ? 'Livré' : 'En attente'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-[10px] font-bold text-gray-400">
                                                {new Date(order.date).toLocaleDateString('fr-FR')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
