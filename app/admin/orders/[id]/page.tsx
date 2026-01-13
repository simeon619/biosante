'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Package,
    Truck,
    CreditCard,
    User,
    MapPin,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Info,
    ChevronRight,
    ExternalLink,
    Mail,
    Phone,
    Hash,
    Receipt,
    ShoppingBag,
    ShieldCheck,
    RotateCcw,
    Printer,
    Download
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/lib/utils';

interface OrderDetails {
    order: {
        id: string;
        customer_name: string;
        customer_phone: string;
        customer_email: string | null;
        address_full: string;
        address_note: string | null;
        items: any[] | string;
        subtotal: number;
        delivery_fee: number;
        discount: number;
        total: number;
        status: string;
        delivery_mode: string;
        payment_method: string;
        manual_payment_status: string | null;
        transaction_ref: string | null;
        proof_image: string | null;
        created_at: string;
    };
    payment?: {
        status: string;
        amount: number;
        currency: string;
        moneroo_payment_id: string;
    };
    delivery?: {
        status: string;
        address_full: string;
        delivery_fee: number;
    };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: any; actionBtn?: string }> = {
    paid: { label: 'Payée', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200', icon: CreditCard, actionBtn: 'Préparer' },
    pending: { label: 'En attente', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Clock, actionBtn: 'Confirmer' },
    confirmed: { label: 'Confirmée', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: CheckCircle, actionBtn: 'Préparer' },
    processing: { label: 'En traitement', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: Package, actionBtn: 'Expédier' },
    shipped: { label: 'Expédiée', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', icon: Truck, actionBtn: 'Marquer Livrée' },
    delivered: { label: 'Livrée', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: MapPin },
    completed: { label: 'Terminée', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: ShieldCheck },
    cancelled: { label: 'Annulée', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', icon: XCircle }
};

export default function OrderDetailsPage() {
    const params = useParams() as { id: string };
    const router = useRouter();
    const queryClient = useQueryClient();

    // Query for order details
    const { data, isLoading, error: queryError } = useQuery<OrderDetails>({
        queryKey: ['admin', 'orders', params.id],
        queryFn: async () => {
            const token = localStorage.getItem('admin_token');
            const url = `${API_URL}/api/admin/orders/${params.id}`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            return response.json();
        },
        enabled: !!params?.id
    });

    // Mutation for status updates
    const statusMutation = useMutation({
        mutationFn: async (status: string) => {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/admin/orders/${params.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Impossible de mettre à jour le statut');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders', params.id] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
        },
        onError: (error) => {
            alert(`Erreur: ${error.message}`);
        }
    });

    // Mutation for manual status updates
    const manualStatusMutation = useMutation({
        mutationFn: async (status: string) => {
            const response = await fetch(`${API_URL}/api/admin/orders/${params.id}/manual-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Impossible de mettre à jour le statut manuel');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders', params.id] });
        },
        onError: (error) => {
            alert(`Erreur: ${error.message}`);
        }
    });

    const [isUpdating, setIsUpdating] = useState(false);
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);

    const handleUpdateClick = (status: string) => {
        setPendingStatus(status);
        setShowModal(true);
    };

    const confirmStatusUpdate = async () => {
        if (!pendingStatus) return;
        setShowModal(false);
        statusMutation.mutate(pendingStatus);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-400 font-medium animate-pulse">Chargement de la commande...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-xl mx-auto py-12 px-4 text-center">
                <div className="bg-white rounded-[2.5rem] p-12 shadow-premium border border-red-50 space-y-6">
                    <div className="w-24 h-24 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-12 h-12" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Commande introuvable</h2>
                        <p className="text-gray-500 mt-2">L'identifiant spécifié n'existe pas ou a été archivé.</p>
                    </div>

                    {queryError && (
                        <div className="bg-gray-50 rounded-2xl p-4 text-left text-xs font-mono text-gray-400 overflow-hidden">
                            <p className="font-bold mb-1">Diagnostic :</p>
                            <p>ID: {params.id}</p>
                            <p>Error: {(queryError as any).error || queryError.message}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={() => router.push('/admin/orders')}
                            className="w-full px-8 py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98]"
                        >
                            <ArrowLeft className="w-4 h-4" /> Retour aux commandes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { order, payment, delivery } = data;
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    const currentStatus = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
    const StatusIcon = currentStatus.icon;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden border border-gray-100">
                        <div className="p-8 text-center space-y-6">
                            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center border-2 ${STATUS_CONFIG[pendingStatus!].bg} ${STATUS_CONFIG[pendingStatus!].border} ${STATUS_CONFIG[pendingStatus!].color}`}>
                                {React.createElement(STATUS_CONFIG[pendingStatus!].icon, { className: "w-10 h-10" })}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Confirmer le changement</h3>
                                <p className="text-gray-500 mt-2 px-4 leading-relaxed">
                                    Voulez-vous vraiment passer le statut de cette commande à <span className="font-bold text-black">"{STATUS_CONFIG[pendingStatus!].label}"</span> ?
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 pt-4">
                                <button
                                    onClick={confirmStatusUpdate}
                                    className="w-full py-4 bg-black text-white rounded-2xl font-black hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10"
                                >
                                    Oui, Confirmer
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Hidden View */}
            <div id="print-area" className="hidden print:block print-section space-y-8 bg-white text-black p-10">
                <div className="flex justify-between items-start border-b-2 border-black pb-8">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">BIO SANTÉ</h1>
                        <p className="text-sm font-bold opacity-60">Ticket de Commande</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-black font-mono">#{order.id.split('-')[0].toUpperCase()}</p>
                        <p className="text-xs opacity-60">{new Date(order.created_at).toLocaleString('fr-FR')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <h2 className="text-xs font-black uppercase tracking-widest border-b pb-1">Client</h2>
                        <p className="font-bold text-lg">{order.customer_name}</p>
                        <p className="text-sm">{order.customer_phone}</p>
                        <p className="text-sm">{order.address_full}</p>
                    </div>
                    <div className="space-y-4 text-right">
                        <h2 className="text-xs font-black uppercase tracking-widest border-b pb-1 text-right">Détails</h2>
                        <p className="text-sm font-bold">Paiement: {order.payment_method === 'cash' ? 'Espèces' : 'Online'}</p>
                        <p className="text-sm font-bold">Livraison: {order.delivery_mode}</p>
                    </div>
                </div>

                <div className="pt-8">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-black">
                            <tr>
                                <th className="py-2 font-black text-xs uppercase">Article</th>
                                <th className="py-2 text-center font-black text-xs uppercase">Qté</th>
                                <th className="py-2 text-right font-black text-xs uppercase">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map((item: any, i: number) => (
                                <tr key={i}>
                                    <td className="py-4 font-bold">{item.name}</td>
                                    <td className="py-4 text-center">{item.quantity}</td>
                                    <td className="py-4 text-right font-black">{(item.price * item.quantity).toLocaleString()} F</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t-2 border-black pt-4">
                            <tr>
                                <td colSpan={2} className="py-2 font-black text-right pr-10 uppercase text-xs">Sous-total</td>
                                <td className="py-2 text-right font-bold">{order.subtotal?.toLocaleString()} F</td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="py-2 font-black text-right pr-10 uppercase text-xs">Livraison</td>
                                <td className="py-2 text-right font-bold">+{order.delivery_fee?.toLocaleString()} F</td>
                            </tr>
                            <tr className="border-t border-black/10">
                                <td colSpan={2} className="py-4 font-black text-right pr-10 uppercase text-xl">Total NET</td>
                                <td className="py-4 text-right font-black text-2xl">{order.total?.toLocaleString()} F</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="pt-20 text-center space-y-2">
                    <p className="text-xs font-bold opacity-60">Merci pour votre confiance !</p>
                    <p className="text-[10px] font-mono opacity-40">Généré par BIO SANTÉ Admin Dash</p>
                </div>
            </div>

            {/* Main UI Header */}
            <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <button onClick={() => router.push('/admin/orders')} className="hover:text-black transition-colors">Commandes</button>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-black">Détails #{order.id.split('-')[0]}</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Récapitulatif Client</h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Printer className="w-4 h-4 text-gray-400" /> Imprimer Ticket
                    </button>
                    <div className="h-6 w-px bg-gray-200 hidden md:block mx-2"></div>

                    <div className="flex gap-2">
                        {order.status === 'pending' && (
                            <button
                                onClick={() => handleUpdateClick('confirmed')}
                                className="px-6 py-3 bg-black text-white rounded-2xl font-black text-sm hover:shadow-xl hover:shadow-black/10 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" /> Confirmer
                            </button>
                        )}
                        {['confirmed', 'processing', 'paid'].includes(order.status) && (
                            <button
                                onClick={() => handleUpdateClick('shipped')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                            >
                                <Truck className="w-4 h-4" /> Expédier
                            </button>
                        )}
                        {order.status === 'shipped' && (
                            <button
                                onClick={() => handleUpdateClick('delivered')}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                            >
                                <MapPin className="w-4 h-4" /> Marquer Livrée
                            </button>
                        )}
                        {order.status === 'cancelled' ? (
                            <button
                                onClick={() => handleUpdateClick('pending')}
                                className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" /> Rétablir la commande
                            </button>
                        ) : (
                            !['delivered', 'completed'].includes(order.status) && (
                                <button
                                    onClick={() => handleUpdateClick('cancelled')}
                                    className="px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold text-sm hover:bg-rose-100 transition-all flex items-center gap-2"
                                >
                                    <XCircle className="w-4 h-4" /> Annuler
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Essential Info & Items (8 Columns) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Hero Stats Card */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-premium border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                            <StatusIcon className="w-64 h-64 text-black" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-6">
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border} font-black text-xs uppercase tracking-widest`}>
                                    <StatusIcon className="w-4 h-4" />
                                    {currentStatus.label}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-400 font-bold text-sm uppercase tracking-tighter">Référence Unique</p>
                                    <h2 className="text-4xl font-black text-gray-900 font-mono tracking-tighter break-all lg:break-normal">{order.id}</h2>
                                </div>
                                <div className="flex items-center gap-6 text-gray-500 font-bold text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-300" />
                                        {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-300" />
                                        {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black rounded-3xl p-8 text-white min-w-[240px] shadow-2xl shadow-black/20 transform hover:-translate-y-1 transition-transform">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-50 mb-4">Total à percevoir</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black tracking-tighter">{order.total?.toLocaleString()}</span>
                                    <span className="text-lg font-bold opacity-70">FCFA</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                    <span>TVA Comprise</span>
                                    <span>XOF</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items List Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
                        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">
                                <ShoppingBag className="w-6 h-6 text-gray-300" />
                                Panier de commande
                            </h3>
                            <span className="px-4 py-1.5 bg-gray-50 rounded-full text-xs font-black text-gray-400 uppercase tracking-widest">
                                {items.length} Article(s)
                            </span>
                        </div>

                        <div className="p-2">
                            <div className="divide-y divide-gray-50">
                                {items.map((item: any, idx: number) => (
                                    <div key={idx} className="p-8 flex items-center justify-between group hover:bg-gray-50/50 transition-colors rounded-2xl">
                                        <div className="flex items-center gap-8">
                                            <div className="relative">
                                                <div className="w-24 h-24 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center p-4 group-hover:bg-white transition-colors duration-500">
                                                    <Package className="w-10 h-10 text-gray-200" />
                                                </div>
                                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center font-black text-sm border-4 border-white shadow-lg">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black text-xl text-gray-900 uppercase tracking-tighter leading-tight">{item.name}</p>
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Prix Unitaire: {item.price?.toLocaleString()} FCFA</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-gray-900 tracking-tighter">{(item.price * item.quantity).toLocaleString()} <span className="text-xs font-bold text-gray-300 uppercase ml-1">XOF</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals Breakdown */}
                        <div className="bg-gray-50/50 p-10 space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                                <span>Sous-total</span>
                                <span className="text-gray-900 font-black">{order.subtotal?.toLocaleString()} F</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                                <span>Livraison ({order.delivery_mode})</span>
                                <span className="text-gray-900 font-black">+{order.delivery_fee?.toLocaleString()} F</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between items-center text-sm font-bold text-emerald-500 uppercase tracking-widest">
                                    <span>Remise appliquée</span>
                                    <span className="font-black">-{order.discount?.toLocaleString()} F</span>
                                </div>
                            )}
                            <div className="h-px bg-gray-200 my-6"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-black text-gray-900 uppercase tracking-tight">Net à Payer</span>
                                <span className="text-4xl font-black text-black tracking-tighter font-mono">{order.total?.toLocaleString()} F</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Payment (4 Columns) */}
                <div className="no-print lg:col-span-4 space-y-8">

                    {/* Customer Info Card */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-premium border border-gray-100 overflow-hidden relative">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gray-50 rounded-full opacity-50"></div>

                        <div className="relative z-10 space-y-8">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                                <User className="w-6 h-6 text-gray-300" />
                                Profil Client
                            </h3>

                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl shadow-black/20">
                                    {order.customer_name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-tight break-words">{order.customer_name}</p>
                                    <span className="px-3 py-1 bg-black/5 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">Client Vérifié</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="group p-4 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-100 hover:bg-white transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Contact mobile</p>
                                            <p className="font-bold text-gray-900 truncate">{order.customer_phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="group p-4 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-100 hover:bg-white transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Email</p>
                                            <p className="font-bold text-gray-900 truncate tracking-tight">{order.customer_email || 'Non renseigné'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery & Address Card */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-premium border border-gray-100 space-y-8">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                            <Truck className="w-6 h-6 text-gray-300" />
                            Logistique
                        </h3>

                        <div className="space-y-6">
                            <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 relative overflow-hidden group">
                                <MapPin className="absolute -bottom-4 -right-4 w-24 h-24 text-blue-500/10 group-hover:scale-110 transition-transform duration-700" />
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3">Adresse de livraison</p>
                                <p className="text-lg font-black text-blue-900 leading-tight">{order.address_full}</p>
                            </div>

                            {order.address_note && (
                                <div className="p-6 bg-amber-50/50 rounded-[2rem] border border-amber-100">
                                    <div className="flex items-center gap-2 mb-2 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                        <Info className="w-3 h-3" /> Note du client
                                    </div>
                                    <p className="text-sm font-bold text-amber-900 leading-relaxed italic">"{order.address_note}"</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Mode</p>
                                    <p className="font-bold text-gray-900 text-xs uppercase">{order.delivery_mode}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Status Envoi</p>
                                    <p className="font-bold text-gray-900 text-xs uppercase">{delivery?.status || 'Initial'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info Card */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-premium border border-gray-100 space-y-8">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-gray-300" />
                            Règlement
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Méthode</p>
                                    <p className="font-black text-gray-900 uppercase tracking-tighter">
                                        {order.payment_method === 'manual' ? 'Transfert Manuel' : (order.payment_method === 'cash' ? 'Espèces / Livraison' : 'Mobile Online')}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                                    {order.payment_method === 'manual' ? '📱' : (order.payment_method === 'cash' ? '💵' : '💳')}
                                </div>
                            </div>

                            {(order.payment_method === 'manual' || order.payment_method === 'wave') && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Status Paiement {order.payment_method === 'wave' ? 'Wave' : 'Manuel'}</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-lg font-black uppercase tracking-tight">
                                                {order.manual_payment_status === 'pending' && 'En Attente'}
                                                {order.manual_payment_status === 'verifying' && 'Vérification...'}
                                                {order.manual_payment_status === 'success' && 'Validé / Reçu'}
                                                {order.manual_payment_status === 'failed' && 'Échec / Rejeté'}
                                                {!order.manual_payment_status && 'Non défini'}
                                            </p>
                                            <div className={`w-3 h-3 rounded-full animate-pulse ${order.manual_payment_status === 'success' ? 'bg-green-500' :
                                                order.manual_payment_status === 'failed' ? 'bg-red-500' : 'bg-amber-500'
                                                }`} />
                                        </div>
                                    </div>

                                    {/* Action Buttons for Manual/Wave Payment */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            disabled={manualStatusMutation.isPending}
                                            onClick={() => manualStatusMutation.mutate('verifying')}
                                            className="py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-colors"
                                        >
                                            Vérifier
                                        </button>
                                        <button
                                            disabled={manualStatusMutation.isPending}
                                            onClick={() => manualStatusMutation.mutate('success')}
                                            className="py-3 bg-green-50 text-green-700 rounded-xl font-bold text-xs hover:bg-green-100 transition-colors"
                                        >
                                            Valider
                                        </button>
                                        <button
                                            disabled={manualStatusMutation.isPending}
                                            onClick={() => manualStatusMutation.mutate('failed')}
                                            className="py-3 bg-red-50 text-red-700 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors col-span-2"
                                        >
                                            Rejeter le paiement
                                        </button>
                                    </div>
                                </div>
                            )}

                            {order.proof_image && (
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Capture d'écran du transfert</p>
                                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                                        <img
                                            src={order.proof_image}
                                            alt="Preuve de paiement"
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <a
                                            href={order.proof_image}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold"
                                        >
                                            Voir en plein écran
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${payment?.status === 'success' || order.manual_payment_status === 'success' || ['delivered', 'completed'].includes(order.status)
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                : 'bg-amber-50 border-amber-100 text-amber-700'
                                }`}>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status de livraison lié</p>
                                    <p className="text-xl font-black uppercase tracking-tight">
                                        {payment?.status === 'success' || order.manual_payment_status === 'success' || ['delivered', 'completed'].includes(order.status) ? 'Soldé' : 'En Attente'}
                                    </p>
                                </div>
                                {payment?.status === 'success' || order.manual_payment_status === 'success' || ['delivered', 'completed'].includes(order.status) ? (
                                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                )}
                            </div>

                            {(payment?.moneroo_payment_id || order.transaction_ref) && (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Référence Transaction</p>
                                    <div className="p-3 bg-gray-50 rounded-xl font-mono text-xs text-black break-all border border-gray-100 font-bold">
                                        {order.transaction_ref || payment?.moneroo_payment_id}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic CSS for Print */}
            <style jsx global>{`
                @media print {
                    body { background: white !important; }
                    .no-print { display: none !important; }
                    .print-section { 
                        display: block !important;
                        visibility: visible !important;
                        position: relative !important;
                        width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    #print-area { display: block !important; }
                }
            `}</style>
        </div>
    );
}
