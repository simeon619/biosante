'use client';

import React, { useEffect, useState } from 'react';
import {
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Search,
    ChevronRight,
    ChevronLeft,
    ExternalLink,
    Smartphone,
    User,
    Calendar,
    DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { cn, API_URL } from '@/lib/utils';

interface Payment {
    id: number;
    order_id: string;
    provider: string;
    reference: string;
    moneroo_payment_id: string;
    payment_method: string;
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
    const [statusFilter, setStatusFilter] = useState('all');
    const [providerFilter, setProviderFilter] = useState('all');
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationMeta, setPaginationMeta] = useState<any>(null);

    useEffect(() => {
        fetchPayments();
    }, [statusFilter, providerFilter, currentPage]);

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');

            const params = new URLSearchParams({
                status: statusFilter,
                provider: providerFilter,
                search: searchTerm,
                page: currentPage.toString(),
                limit: '20'
            });

            const response = await fetch(`${API_URL}/api/admin/payments?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Admin-Id': adminData.id
                }
            });
            const result = await response.json();
            setPayments(result.data || []);
            setPaginationMeta(result.meta || null);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page on search
        fetchPayments();
    };

    const handleAction = async (paymentId: number, status: 'confirmed' | 'rejected') => {
        const reason = status === 'rejected' ? prompt('Raison du rejet ?') : null;
        if (status === 'rejected' && reason === null) return;

        setIsActionLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');
            const response = await fetch(`${API_URL}/api/admin/payments/${paymentId}/confirm`, {
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-indigo-600" />
                        Gestion des Paiements
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">Contrôle des flux financiers et validations manuelles</p>
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Référence, client, tel..."
                        className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-80 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2 rounded-[2rem] border border-slate-100">
                <div className="flex gap-1 p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
                    {['all', 'pending', 'confirmed', 'rejected'].map((s) => (
                        <button
                            key={s}
                            onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                statusFilter === s
                                    ? "bg-slate-900 text-white shadow-lg"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            {s === 'all' ? 'TOUS' : s === 'pending' ? 'EN ATTENTE' : s === 'confirmed' ? 'CONFIRMÉS' : 'REJETÉS'}
                        </button>
                    ))}
                </div>

                <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

                <div className="flex gap-1">
                    {['all', 'wave', 'orange', 'mtn', 'manual_transfer'].map((p) => (
                        <button
                            key={p}
                            onClick={() => { setProviderFilter(p); setCurrentPage(1); }}
                            className={cn(
                                "px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                providerFilter === p
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                                    : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                            )}
                        >
                            {p === 'manual_transfer' ? 'MANUEL' : p.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* List */}
                <div className={cn("xl:col-span-8 space-y-4", selectedPayment && "hidden xl:block")}>
                    {isLoading ? (
                        <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center space-y-4 text-slate-400 italic font-medium shadow-sm">
                            <Clock className="w-8 h-8 animate-spin text-indigo-500" />
                            <p>Synchronisation des flux financiers...</p>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center space-y-4 text-slate-400 shadow-sm">
                            <AlertTriangle className="w-10 h-10 text-slate-200" />
                            <div className="text-center">
                                <p className="font-bold text-slate-900 uppercase tracking-widest text-xs">Aucun paiement trouvé</p>
                                <p className="text-sm">Affiniez vos filtres ou effectuez une nouvelle recherche.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {payments.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedPayment(p)}
                                    className={cn(
                                        "bg-white p-6 rounded-[2rem] border-2 transition-all cursor-pointer group flex items-center justify-between relative overflow-hidden",
                                        selectedPayment?.id === p.id
                                            ? "border-indigo-600 shadow-xl shadow-indigo-100 scale-[1.01]"
                                            : p.status === 'pending'
                                                ? "border-amber-200 bg-amber-50/10 hover:border-amber-400 hover:shadow-lg shadow-amber-100/20"
                                                : "border-transparent hover:border-slate-300 shadow-sm"
                                    )}
                                >
                                    {p.status === 'pending' && (
                                        <div className="absolute top-0 right-0 w-2 h-full bg-amber-400 animate-pulse"></div>
                                    )}

                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:scale-110 duration-500",
                                            p.provider === 'wave' ? 'bg-cyan-50' : p.provider === 'orange' ? 'bg-orange-50' : 'bg-slate-50'
                                        )}>
                                            {p.provider === 'wave' ? '🌊' : p.provider === 'orange' ? '🍊' : p.provider === 'mtn' ? '🟡' : '🔹'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <p className="font-black text-slate-900 uppercase text-xs tracking-[0.15em]">{p.reference || p.moneroo_payment_id?.split('-')[1] || 'PENDING'}</p>
                                                <span className={cn("text-[8px] px-2 py-0.5 rounded-full font-black border uppercase tracking-widest", getTrustColor(p.trust_score))}>
                                                    Trust: {p.trust_score}%
                                                </span>
                                            </div>
                                            <p className="text-base font-bold text-slate-800 mt-0.5">{p.customer_name}</p>
                                            <div className="flex gap-3 mt-1 text-[10px] items-center">
                                                <p className="text-indigo-600 font-black uppercase tracking-widest">{p.payment_method?.replace('_ci', '')}</p>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <p className="text-slate-400 font-mono">#{p.order_id.substring(0, 8)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right flex items-center gap-8">
                                        <div>
                                            <p className="text-xl font-black text-slate-900 leading-none">{(p.amount_expected || p.order_total).toLocaleString()} F</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2 flex items-center justify-end gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(p.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className={cn(
                                            "w-3 h-3 rounded-full shadow-sm",
                                            p.status === 'confirmed' ? 'bg-green-500' : p.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500 animate-pulse ring-4 ring-amber-100'
                                        )} />
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            ))}

                            {/* Pagination UI */}
                            {paginationMeta && paginationMeta.last_page > 1 && (
                                <div className="flex items-center justify-center gap-4 py-8">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black uppercase text-[10px] tracking-widest disabled:opacity-30 hover:border-indigo-600 transition-all shadow-sm flex items-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Précédent
                                    </button>

                                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                        {Array.from({ length: Math.min(5, paginationMeta.last_page) }, (_, i) => {
                                            // Simplified page numbers around current page
                                            let pageNum = currentPage;
                                            if (currentPage <= 3) pageNum = i + 1;
                                            else if (currentPage >= paginationMeta.last_page - 2) pageNum = paginationMeta.last_page - 4 + i;
                                            else pageNum = currentPage - 2 + i;

                                            if (pageNum <= 0 || pageNum > paginationMeta.last_page) return null;

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={cn(
                                                        "w-10 h-10 rounded-xl font-black text-xs transition-all",
                                                        currentPage === pageNum
                                                            ? "bg-slate-900 text-white shadow-lg"
                                                            : "text-slate-400 hover:text-slate-600 hover:bg-white"
                                                    )}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        disabled={currentPage === paginationMeta.last_page}
                                        onClick={() => setCurrentPage(p => Math.min(paginationMeta.last_page, p + 1))}
                                        className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black uppercase text-[10px] tracking-widest disabled:opacity-30 hover:border-indigo-600 transition-all shadow-sm flex items-center gap-2"
                                    >
                                        Suivant
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Details Panel */}
                <div className={cn("xl:col-span-4", !selectedPayment && "hidden xl:block")}>
                    {selectedPayment ? (
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden sticky top-24 animate-in slide-in-from-right-4 duration-500">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                                <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Détails Transaction</h3>
                                <button onClick={() => setSelectedPayment(null)} className="xl:hidden p-2 hover:bg-slate-50 rounded-full transition-colors">
                                    <XCircle className="w-6 h-6 text-slate-400 hover:text-red-500 transition-colors" />
                                </button>
                            </div>

                            <div className="p-8 space-y-10">
                                {/* Score Indicator */}
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-24 h-24 rounded-[2rem] flex flex-col items-center justify-center shadow-xl border-4 border-white",
                                        selectedPayment.trust_score >= 80 ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                                    )}>
                                        <p className="text-[9px] uppercase font-black opacity-60 tracking-widest">Score</p>
                                        <p className="text-3xl font-black">{selectedPayment.trust_score}%</p>
                                    </div>
                                    <div className="space-y-1.5 min-w-0">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Référence</p>
                                        <p className="text-2xl font-black font-mono text-slate-900 truncate tracking-tight">{selectedPayment.reference || 'EN ATTENTE'}</p>
                                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-lg inline-block">
                                            {selectedPayment.provider} Money
                                        </p>
                                    </div>
                                </div>

                                {/* Summary Grid */}
                                <div className="space-y-4">
                                    {[
                                        { label: 'Client', value: selectedPayment.customer_name, icon: User },
                                        { label: 'Montant', value: `${(selectedPayment.amount_expected || selectedPayment.order_total).toLocaleString()} F`, icon: DollarSign, highlight: true },
                                        { label: 'Date Envoi', value: new Date(selectedPayment.created_at).toLocaleString(), icon: Calendar },
                                        { label: 'Order ID', value: selectedPayment.order_id.split('-')[0], icon: Smartphone }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group/item hover:bg-white hover:border-indigo-100 transition-all">
                                            <div className="flex items-center gap-3 text-slate-400 group-hover/item:text-indigo-500 transition-colors">
                                                <item.icon className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                            </div>
                                            <span className={cn(
                                                "text-sm font-bold",
                                                item.highlight ? "text-indigo-600 font-black text-lg" : "text-slate-900"
                                            )}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                {selectedPayment.status === 'pending' && (
                                    <div className="space-y-4 pt-4">
                                        <button
                                            onClick={() => handleAction(selectedPayment.id, 'confirmed')}
                                            disabled={isActionLoading}
                                            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em] shadow-2xl shadow-slate-200 disabled:opacity-50 active:scale-95 group"
                                        >
                                            <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            Confirmer le Paiement
                                        </button>
                                        <button
                                            onClick={() => handleAction(selectedPayment.id, 'rejected')}
                                            disabled={isActionLoading}
                                            className="w-full bg-white text-red-500 border border-red-50 font-bold py-4 rounded-2xl hover:bg-red-50 transition-all uppercase text-[10px] tracking-widest disabled:opacity-50"
                                        >
                                            Rejeter la transaction
                                        </button>
                                    </div>
                                )}

                                {selectedPayment.status !== 'pending' && (
                                    <div className={cn(
                                        "p-8 rounded-3xl text-center border-2 shadow-sm",
                                        selectedPayment.status === 'confirmed'
                                            ? "bg-green-50 border-green-100 text-green-700"
                                            : "bg-red-50 border-red-100 text-red-700"
                                    )}>
                                        <div className="flex flex-col items-center gap-2">
                                            {selectedPayment.status === 'confirmed' ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1 italic">Statut Final</p>
                                                <p className="text-xl font-black uppercase tracking-tight">{selectedPayment.status === 'confirmed' ? 'PAYÉ & VALIDÉ' : 'RÉFÉRENCE REJETÉE'}</p>
                                            </div>
                                        </div>
                                        {selectedPayment.rejection_reason && (
                                            <div className="mt-4 pt-4 border-t border-red-100">
                                                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">Raison du rejet</p>
                                                <p className="text-xs font-medium italic">"{selectedPayment.rejection_reason}"</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="border-t border-slate-100 pt-6">
                                    <Link
                                        href={`/admin/orders/${selectedPayment.order_id}`}
                                        className="flex items-center justify-center gap-3 text-slate-400 hover:text-indigo-600 transition-all py-2 group"
                                    >
                                        <span className="uppercase text-[9px] font-black tracking-[0.3em]">Accéder au dossier commande</span>
                                        <ExternalLink className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[600px] bg-slate-50/50 rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 text-center group transition-colors hover:bg-white hover:border-slate-200">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-50 mb-8 transition-transform group-hover:rotate-12 duration-500">
                                <Smartphone className="w-10 h-10 text-slate-200" />
                            </div>
                            <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-2">Sélection requise</h4>
                            <p className="text-slate-400 text-sm max-w-[200px] font-medium italic">Cliquez sur un paiement pour examiner les détails et le score de confiance.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
