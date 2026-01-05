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
    const [stats, setStats] = useState<StatsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

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

    const formatDateRange = () => {
        const formatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
        return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
    };

    const fetchStats = async () => {
        setIsLoading(true);
        setError('');
        try {
            const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');
            const headers = { 'X-Admin-Id': adminData.id };

            // Fetch dashboard overview
            const [dashboardRes, ordersRes, productsRes] = await Promise.all([
                fetch('http://localhost:3333/api/admin/dashboard', { headers }),
                fetch('http://localhost:3333/api/admin/orders?limit=1000', { headers }),
                fetch('http://localhost:3333/api/admin/products', { headers })
            ]);

            const dashboardData = await dashboardRes.json();
            const ordersData = await ordersRes.json();
            const productsData = await productsRes.json();

            // API returns orders in 'orders' field, not 'data'
            const allOrders = ordersData.orders || ordersData.data || [];

            // Filter orders by date range
            const filteredOrders = allOrders.filter((o: any) => {
                const orderDate = new Date(o.created_at);
                return orderDate >= startDate && orderDate <= endDate;
            });

            // Calculate stats
            const completedOrders = filteredOrders.filter((o: any) => ['paid', 'delivered', 'completed'].includes(o.status));
            const pendingOrders = filteredOrders.filter((o: any) => o.status === 'pending');
            const cancelledOrders = filteredOrders.filter((o: any) => o.status === 'cancelled');
            const processingOrders = filteredOrders.filter((o: any) => ['processing', 'shipped'].includes(o.status));

            const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + (parseFloat(o.total) || 0), 0);
            const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

            // Products
            const products = Array.isArray(productsData) ? productsData :
                Array.isArray(productsData?.data) ? productsData.data : [];

            // Top products calculation
            const productCounts: Record<string, { name: string; quantity: number; revenue: number }> = {};
            filteredOrders.forEach((order: any) => {
                try {
                    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                    if (Array.isArray(items)) {
                        items.forEach((item: any) => {
                            const key = item.slug || item.name || 'unknown';
                            if (!productCounts[key]) {
                                productCounts[key] = { name: item.name || 'Produit', quantity: 0, revenue: 0 };
                            }
                            productCounts[key].quantity += item.quantity || 1;
                            productCounts[key].revenue += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
                        });
                    }
                } catch (e) { }
            });

            const topProducts = Object.values(productCounts)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5);

            // Daily data for chart
            const dailyMap: Record<string, { orders: number; revenue: number }> = {};
            filteredOrders.forEach((o: any) => {
                const date = new Date(o.created_at).toISOString().split('T')[0];
                if (!dailyMap[date]) {
                    dailyMap[date] = { orders: 0, revenue: 0 };
                }
                dailyMap[date].orders++;
                if (['paid', 'delivered', 'completed'].includes(o.status)) {
                    dailyMap[date].revenue += parseFloat(o.total) || 0;
                }
            });

            const dailyData = Object.entries(dailyMap)
                .map(([date, data]) => ({ date, ...data }))
                .sort((a, b) => a.date.localeCompare(b.date));

            // Recent orders
            const recentOrders = filteredOrders.slice(0, 8).map((o: any) => ({
                id: o.id,
                customer: o.customer_name || 'Client',
                total: o.total || 0,
                status: o.status,
                date: new Date(o.created_at).toLocaleDateString('fr-FR')
            }));

            // Calculate previous period revenue for trend
            const periodLength = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const prevPeriodEnd = new Date(startDate);
            prevPeriodEnd.setDate(prevPeriodEnd.getDate() - 1);
            const prevPeriodStart = new Date(prevPeriodEnd);
            prevPeriodStart.setDate(prevPeriodStart.getDate() - periodLength);

            const prevPeriodOrders = allOrders.filter((o: any) => {
                const orderDate = new Date(o.created_at);
                return orderDate >= prevPeriodStart && orderDate <= prevPeriodEnd;
            });
            const prevCompletedOrders = prevPeriodOrders.filter((o: any) => ['paid', 'delivered', 'completed'].includes(o.status));
            const prevTotalRevenue = prevCompletedOrders.reduce((sum: number, o: any) => sum + (parseFloat(o.total) || 0), 0);

            // Calculate trend percentage
            const trend = prevTotalRevenue > 0
                ? Math.round(((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100)
                : (totalRevenue > 0 ? 100 : 0);

            setStats({
                orders: {
                    total: filteredOrders.length,
                    pending: pendingOrders.length,
                    completed: completedOrders.length,
                    cancelled: cancelledOrders.length,
                    processing: processingOrders.length
                },
                revenue: {
                    total: totalRevenue,
                    average: avgOrderValue,
                    previousTotal: prevTotalRevenue,
                    trend
                },
                products: {
                    total: products.length,
                    active: products.filter((p: any) => p.is_active).length
                },
                topProducts,
                recentOrders,
                dailyData
            });
        } catch (err: any) {
            setError(err.message || 'Erreur de chargement');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [startDate, endDate]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' F';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-700';
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'processing': case 'shipped': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Terminée';
            case 'pending': return 'En attente';
            case 'cancelled': return 'Annulée';
            case 'processing': return 'En cours';
            case 'shipped': return 'Expédiée';
            default: return status;
        }
    };

    // Calculate max for chart scaling
    const maxRevenue = stats?.dailyData.length
        ? Math.max(...stats.dailyData.map(d => d.revenue))
        : 0;

    if (error && !stats) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={fetchStats}
                        className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics</h1>
                    <p className="text-gray-500 mt-1">Tableau de bord des performances</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Date Range Picker */}
                    <div className="relative" ref={datePickerRef}>
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all shadow-sm"
                        >
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">{formatDateRange()}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
                        </button>

                        {showDatePicker && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-gray-900">Période</span>
                                        <button onClick={() => setShowDatePicker(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {datePresets.map((preset) => (
                                            <button
                                                key={preset.label}
                                                onClick={() => applyPreset(preset.days)}
                                                className="px-3 py-2 text-sm text-left rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Personnalisé</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="date"
                                            value={startDate.toISOString().split('T')[0]}
                                            onChange={(e) => setStartDate(new Date(e.target.value))}
                                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                        />
                                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <input
                                            type="date"
                                            value={endDate.toISOString().split('T')[0]}
                                            onChange={(e) => setEndDate(new Date(e.target.value))}
                                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowDatePicker(false)}
                                        className="w-full mt-3 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Appliquer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={fetchStats}
                        disabled={isLoading}
                        className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {isLoading && !stats ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Chargement des données...</p>
                    </div>
                </div>
            ) : stats && (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Revenue */}
                        <div className="group relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    {stats.revenue.trend !== 0 && (
                                        <div className={`flex items-center gap-1 ${stats.revenue.trend >= 0 ? 'text-emerald-100' : 'text-red-200'}`}>
                                            {stats.revenue.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                            <span className="text-sm font-medium">{stats.revenue.trend >= 0 ? '+' : ''}{stats.revenue.trend}%</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-emerald-100 text-sm font-medium">Chiffre d'affaires</p>
                                <p className="text-3xl font-bold mt-1 tracking-tight">{formatCurrency(stats.revenue.total)}</p>
                                <p className="text-emerald-200 text-xs mt-2">Moy. {formatCurrency(stats.revenue.average)} / commande</p>
                            </div>
                        </div>

                        {/* Orders */}
                        <div className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                        <ShoppingCart className="w-6 h-6" />
                                    </div>
                                    {stats.orders.pending > 0 && (
                                        <span className="px-2 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-medium">
                                            {stats.orders.pending} en attente
                                        </span>
                                    )}
                                </div>
                                <p className="text-blue-100 text-sm font-medium">Commandes</p>
                                <p className="text-3xl font-bold mt-1 tracking-tight">{stats.orders.total}</p>
                                <p className="text-blue-200 text-xs mt-2">{stats.orders.completed} terminées</p>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="group relative bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                        <Package className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-violet-100 text-sm font-medium">Produits actifs</p>
                                <p className="text-3xl font-bold mt-1 tracking-tight">{stats.products.active}</p>
                                <p className="text-violet-200 text-xs mt-2">sur {stats.products.total} au total</p>
                            </div>
                        </div>

                        {/* Completion Rate */}
                        <div className="group relative bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-amber-100 text-sm font-medium">Taux de conversion</p>
                                <p className="text-3xl font-bold mt-1 tracking-tight">
                                    {stats.orders.total > 0 ? Math.round((stats.orders.completed / stats.orders.total) * 100) : 0}%
                                </p>
                                <p className="text-amber-200 text-xs mt-2">{stats.orders.cancelled} annulées</p>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Revenue Chart */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Évolution des revenus</h3>
                                    <p className="text-sm text-gray-500">Performance journalière</p>
                                </div>
                            </div>

                            {stats.dailyData.length > 0 ? (
                                <div className="h-64 flex items-end gap-1">
                                    {stats.dailyData.slice(-14).map((day, index) => {
                                        const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full">
                                                <div className="w-full flex flex-col items-end justify-end h-48">
                                                    <div
                                                        className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all group-hover:from-emerald-600 group-hover:to-emerald-500 relative"
                                                        style={{ height: `${Math.max(height, 4)}%`, minHeight: '4px' }}
                                                    >
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                            {formatCurrency(day.revenue)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-gray-400 transform -rotate-45 origin-top-left whitespace-nowrap">
                                                    {new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="h-64 flex items-center justify-center">
                                    <p className="text-gray-400">Aucune donnée pour cette période</p>
                                </div>
                            )}
                        </div>

                        {/* Order Status */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Statut des commandes</h3>

                            <div className="space-y-4">
                                {[
                                    { label: 'Terminées', value: stats.orders.completed, color: 'bg-emerald-500', icon: CheckCircle2 },
                                    { label: 'En cours', value: stats.orders.processing, color: 'bg-blue-500', icon: Clock },
                                    { label: 'En attente', value: stats.orders.pending, color: 'bg-amber-500', icon: Clock },
                                    { label: 'Annulées', value: stats.orders.cancelled, color: 'bg-red-500', icon: XCircle },
                                ].map((item, index) => {
                                    const percentage = stats.orders.total > 0 ? (item.value / stats.orders.total) * 100 : 0;
                                    return (
                                        <div key={index}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <item.icon className={`w-4 h-4 ${item.color.replace('bg-', 'text-')}`} />
                                                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{item.value}</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Products */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Produits</h3>

                            {stats.topProducts.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.topProducts.map((product, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-amber-500' :
                                                index === 1 ? 'bg-gray-400' :
                                                    index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{product.name}</p>
                                                <p className="text-sm text-gray-500">{product.quantity} vendus</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">{formatCurrency(product.revenue)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p>Aucune vente sur cette période</p>
                                </div>
                            )}
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Commandes récentes</h3>

                            {stats.recentOrders.length > 0 ? (
                                <div className="space-y-3">
                                    {stats.recentOrders.slice(0, 5).map((order, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <span className="text-sm font-bold text-gray-600">
                                                        {order.customer.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.customer}</p>
                                                    <p className="text-xs text-gray-500">{order.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
                                                <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p>Aucune commande sur cette période</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
