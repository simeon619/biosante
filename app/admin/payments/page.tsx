'use client';

import React, { useEffect, useState } from 'react';
import {
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Search,
    ChevronRight,
    ExternalLink,
    Smartphone,
    User,
    Calendar,
    DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Payment {
    id: number;
    order_id: string;
    provider: string;
    reference: string;
    amount_expected: number;
    trust_score: number;
    status: 'pending' | 'confirmed' | 'rejected';
    rejection_reason: string | null;
    customer_name: string;
    order_total: number;
    order_date: string;
    created_at: string;
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');
            const response = await fetch('http://localhost:3333/api/admin/payments', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Admin-Id': adminData.id
                }
            });
            const data = await response.json();
            setPayments(data);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (paymentId: number, status: 'confirmed' | 'rejected') => {
        const reason = status === 'rejected' ? prompt('Raison du rejet ?') : null;
        if (status === 'rejected' && reason === null) return;

        setIsActionLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');
            const response = await fetch(`http://localhost:3333/api/admin/payments/${paymentId}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Admin-Id': adminData.id
                },
                body: JSON.stringify({ status, reason })
            });

            if (response.ok) {
                await fetchPayments();
                setSelectedPayment(null);
            } else {
                const err = await response.json();
                alert(err.message || 'Erreur lors de l\'action');
            }
        } catch (error) {
            console.error('Failed to perform action:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const getTrustColor = (score: number) => {
        if (score >= 80) return 'text-green-500 bg-green-500/10 border-green-500/20';
        if (score >= 50) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
        return 'text-red-500 bg-red-500/10 border-red-500/20';
    };

    const filteredPayments = payments.filter(p =>
        p.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.order_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestion des Paiements</h1>
                    <p className="text-slate-500 text-sm">Vérification semi-automatique des transferts</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une référence, un client..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* List */}
                <div className={cn("xl:col-span-8 space-y-4", selectedPayment && "hidden xl:block")}>
                    {isLoading ? (
                        <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 italic text-slate-400">
                            Chargement des paiements...
                        </div>
                    ) : filteredPayments.length === 0 ? (
                        <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 text-slate-400">
                            Aucun paiement trouvé.
                        </div>
                    ) : (
                        filteredPayments.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => setSelectedPayment(p)}
                                className={cn(
                                    "bg-white p-5 rounded-3xl border transition-all cursor-pointer group flex items-center justify-between",
                                    selectedPayment?.id === p.id ? "border-black shadow-lg shadow-black/5" : "border-slate-100 hover:border-slate-300 shadow-sm"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner",
                                        p.provider === 'wave' ? 'bg-cyan-50' : p.provider === 'orange' ? 'bg-orange-50' : 'bg-slate-50'
                                    )}>
                                        {p.provider === 'wave' ? '🌊' : p.provider === 'orange' ? '🍊' : p.provider === 'mtn' ? '🟡' : '🔹'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-slate-900 uppercase text-xs tracking-wider">{p.reference || 'SANS RÉF'}</p>
                                            <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-black border", getTrustColor(p.trust_score))}>
                                                TRUST: {p.trust_score}%
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium">{p.customer_name}</p>
                                        <div className="flex gap-2 mt-0.5">
                                            <p className="text-[10px] text-slate-400 font-mono">#{p.order_id.substring(0, 8)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right flex items-center gap-6">
                                    <div>
                                        <p className="font-bold text-slate-900">{(p.amount_expected || p.order_total).toLocaleString()} F</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                                            {new Date(p.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className={cn(
                                        "w-2.5 h-2.5 rounded-full",
                                        p.status === 'confirmed' ? 'bg-green-500' : p.status === 'rejected' ? 'bg-red-500' : 'bg-orange-500 animate-pulse'
                                    )} />
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Details Panel */}
                <div className={cn("xl:col-span-4", !selectedPayment && "hidden xl:block")}>
                    {selectedPayment ? (
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden sticky top-24">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Détails Paiement</h3>
                                <button onClick={() => setSelectedPayment(null)} className="xl:hidden text-slate-400">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Main Info */}
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-slate-900 text-white flex flex-col items-center justify-center shadow-2xl">
                                        <p className="text-[10px] uppercase font-black opacity-40">Score</p>
                                        <p className="text-2xl font-black">{selectedPayment.trust_score}%</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Référence</p>
                                        <p className="text-xl font-mono font-bold text-slate-900">{selectedPayment.reference || 'SANS RÉF'}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">{selectedPayment.provider} Money</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                                    <div className="flex items-center justify-between py-2 border-b border-slate-200/50">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <User className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Client</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-800">{selectedPayment.customer_name}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-200/50">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <DollarSign className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Montant</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-900">{(selectedPayment.amount_expected || selectedPayment.order_total).toLocaleString()} F</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Envoyé</span>
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">{new Date(selectedPayment.created_at).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                {selectedPayment.status === 'pending' && (
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => handleAction(selectedPayment.id, 'confirmed')}
                                            disabled={isActionLoading}
                                            className="w-full bg-green-500 text-white font-black py-5 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 uppercase text-sm tracking-wider shadow-lg shadow-green-500/20 disabled:opacity-50"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Confirmer le Paiement
                                        </button>
                                        <button
                                            onClick={() => handleAction(selectedPayment.id, 'rejected')}
                                            disabled={isActionLoading}
                                            className="w-full bg-white text-red-500 border border-red-100 font-bold py-4 rounded-2xl hover:bg-red-50 transition-all uppercase text-xs tracking-widest disabled:opacity-50"
                                        >
                                            Rejeter la transaction
                                        </button>
                                    </div>
                                )}

                                {selectedPayment.status !== 'pending' && (
                                    <div className={cn(
                                        "p-6 rounded-3xl text-center border",
                                        selectedPayment.status === 'confirmed' ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
                                    )}>
                                        <p className="text-xs font-black uppercase tracking-widest mb-1 italic">Statut Final</p>
                                        <p className="text-lg font-black uppercase">{selectedPayment.status === 'confirmed' ? 'PAYÉ / VALIDÉ' : 'REJETÉ'}</p>
                                        {selectedPayment.rejection_reason && (
                                            <p className="mt-2 text-xs opacity-60 italic">"{selectedPayment.rejection_reason}"</p>
                                        )}
                                    </div>
                                )}

                                <Link
                                    href={`/admin/orders/${selectedPayment.order_id}`}
                                    className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-900 transition-colors py-4 uppercase text-[10px] font-black tracking-[0.2em]"
                                >
                                    Consulter la commande <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
                            <Smartphone className="w-16 h-16 text-slate-200 mb-4" />
                            <h4 className="text-slate-400 font-bold">Sélectionnez un paiement</h4>
                            <p className="text-slate-300 text-sm">Pour voir les détails et agir.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
