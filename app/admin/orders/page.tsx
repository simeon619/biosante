'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_URL } from '@/lib/utils';

interface Order {
    id: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    total: number;
    status: string;
    delivery_mode: string;
    payment_method: string;
    created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-teal-100 text-teal-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En traitement',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    completed: 'Terminée',
    cancelled: 'Annulée'
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
    });

    useEffect(() => {
        fetchOrders();
    }, [pagination.page, statusFilter]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            let url = `${API_URL}/api/admin/orders?page=${pagination.page}&limit=${pagination.limit}`;
            if (statusFilter) url += `&status=${statusFilter}`;

            const response = await fetch(url);
            const data = await response.json();

            setOrders(data.orders || []);
            setPagination(prev => ({
                ...prev,
                ...data.pagination
            }));
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            order.customer_name?.toLowerCase().includes(query) ||
            order.customer_phone?.includes(query) ||
            order.id.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
                <p className="text-gray-500">Gérez toutes les commandes clients</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher par nom, téléphone ou ID..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className="appearance-none pl-10 pr-10 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white"
                    >
                        <option value="">Tous les statuts</option>
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        Aucune commande trouvée
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Mode</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Paiement</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-mono text-gray-600">
                                                    {order.id.substring(0, 8)}...
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{order.customer_name}</p>
                                                <p className="text-sm text-gray-500">{order.customer_phone}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-gray-900">
                                                    {order.total?.toLocaleString()} F
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600 capitalize">
                                                    {order.delivery_mode === 'local' ? 'Local' : 'Expédition'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600 capitalize">
                                                    {order.payment_method === 'cash' ? 'Espèces' : 'Mobile Money'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                                    {STATUS_LABELS[order.status] || order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors inline-flex"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Page {pagination.page} sur {pagination.pages} ({pagination.total} commandes)
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page <= 1}
                                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page >= pagination.pages}
                                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
