'use client';

import React from 'react';
import { ShoppingCart, DollarSign, Package, TrendingUp, Clock, CheckCircle, ChevronRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/utils';

interface DashboardStats {
    orders: {
        today: number;
        pending: number;
        total: number;
    };
    revenue: {
        today: number;
        total: number;
    };
    notifications: {
        byStatus: Record<string, number>;
        dlqCount: number;
    };
    recentOrders: any[];
}

export default function AdminDashboardPage() {
    const router = useRouter();

    const { data: stats, isLoading } = useQuery<DashboardStats>({
        queryKey: ['admin', 'dashboard'],
        queryFn: async () => {
            const token = localStorage.getItem('admin_token');
            const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');
            const response = await fetch(`${API_URL}/api/admin/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Admin-Id': adminData.id
                }
            });
            if (!response.ok) throw new Error('Failed to fetch dashboard');
            return response.json();
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Commandes Aujourd\'hui',
            value: stats?.orders.today || 0,
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'En Attente',
            value: stats?.orders.pending || 0,
            icon: Clock,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
        {
            label: 'Revenus Aujourd\'hui',
            value: `${(stats?.revenue.today || 0).toLocaleString()} F`,
            icon: DollarSign,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            label: 'Revenus Total',
            value: `${(stats?.revenue.total || 0).toLocaleString()} F`,
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tableau de Bord</h1>
                    <p className="text-gray-500 mt-1">Bon retour ! Voici ce qui se passe sur votre boutique aujourd'hui.</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${card.bg} ${card.color} p-3 rounded-2xl transition-colors duration-300`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                    Direct
                                </div>
                            </div>
                            <p className="text-3xl font-black text-gray-900 tracking-tight">{card.value}</p>
                            <p className="text-sm font-medium text-gray-500 mt-1 lowercase first-letter:uppercase">{card.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-900">Commandes Récentes</h2>
                    <Link href="/admin/orders" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                        Voir tout <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Commande</th>
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Client</th>
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Montant</th>
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Confiance</th>
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Statut</th>
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats?.recentOrders?.length ? (
                                stats.recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <Package className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <span className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                                    #{order.id.substring(0, 6).toUpperCase()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-gray-900">{order.customer_name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{order.customer_phone}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-bold text-gray-900 bg-gray-50/50 px-3 py-1 rounded-full border border-gray-100">
                                                {order.total?.toLocaleString()} F
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            {order.trust_score !== null && order.trust_score !== undefined ? (
                                                <div className="w-32">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className={`text-[10px] font-black uppercase ${order.trust_score >= 80 ? 'text-emerald-600' :
                                                            order.trust_score >= 50 ? 'text-orange-600' : 'text-red-600'
                                                            }`}>
                                                            {order.trust_score}%
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-1000 ${order.trust_score >= 80 ? 'bg-emerald-500' :
                                                                order.trust_score >= 50 ? 'bg-orange-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${order.trust_score}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-bold text-gray-300 uppercase italic">Non calculé</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-tight ${order.status === 'completed' || order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                order.status === 'pending' || order.status === 'processing' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                                    'bg-gray-50 text-gray-600 border border-gray-100'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${order.status === 'completed' || order.status === 'delivered' ? 'bg-emerald-500' :
                                                    order.status === 'pending' || order.status === 'processing' ? 'bg-orange-500 animate-pulse' : 'bg-gray-400'
                                                    }`} />
                                                {order.status === 'pending' ? 'En attente' :
                                                    order.status === 'processing' ? 'Traitement' :
                                                        order.status === 'shipped' ? 'Expédié' :
                                                            order.status === 'delivered' ? 'Livré' :
                                                                order.status === 'completed' ? 'Terminé' : order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-medium text-gray-400">
                                                {new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-gray-400 bg-gray-50/30">
                                        <div className="flex flex-col items-center">
                                            <ShoppingCart className="w-12 h-12 mb-4 opacity-10" />
                                            <p className="font-medium">Aucune commande récente à afficher</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DLQ Alert */}
            {(stats?.notifications?.dlqCount ?? 0) > 0 && stats && (
                <div className="group bg-red-50/50 border border-red-100 rounded-[2rem] p-6 flex items-center justify-between gap-6 hover:bg-red-50 transition-colors duration-300">
                    <div className="flex items-center gap-6">
                        <div className="bg-red-500 shadow-lg shadow-red-200 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-red-900">
                                Attention : {stats.notifications.dlqCount} notification(s) en échec
                            </p>
                            <p className="text-sm text-red-700/70">
                                Certaines actions automatiques n'ont pas pu être délivrées. Veuillez vérifier la file d'attente.
                            </p>
                        </div>
                    </div>
                    <Link href="/admin/dlq" className="px-6 py-2.5 bg-red-900 text-white text-sm font-bold rounded-xl hover:bg-red-950 transition-all active:scale-95 shadow-lg shadow-red-900/20">
                        Résoudre les erreurs
                    </Link>
                </div>
            )}
        </div>
    );
}

