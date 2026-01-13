'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Clock, Info, Package, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/utils';

interface NotificationBatch {
    id: string;
    type: string;
    recipient: string;
    payload: {
        title: string;
        body: string;
        priority?: string;
    };
    status: string;
    created_at: string;
}

export default function NotificationsPage() {
    const { data: notifications = [], isLoading } = useQuery<NotificationBatch[]>({
        queryKey: ['admin', 'notifications'],
        queryFn: async () => {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/admin/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch notifications');
            return response.json();
        }
    });

    const getIcon = (title: string) => {
        if (title.includes('Commande')) return <Package className="w-5 h-5" />;
        if (title.includes('Paiement')) return <CreditCard className="w-5 h-5" />;
        return <Bell className="w-5 h-5" />;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent': return 'bg-green-100 text-green-600';
            case 'failed': return 'bg-red-100 text-red-600';
            default: return 'bg-blue-100 text-blue-600';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Notifications</h1>
                    <p className="text-gray-500 font-medium">Historique des alertes système et commandes</p>
                </div>
                <div className="h-12 w-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-gray-400" />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto opacity-20">
                            <Bell className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-400 font-medium text-lg">Aucune notification pour le moment</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {notifications.map((notif) => (
                            <div key={notif.id} className="p-6 hover:bg-gray-50 transition-all flex items-start gap-6 group">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white group-hover:scale-110 transition-transform ${getStatusColor(notif.status)}`}>
                                    {getIcon(notif.payload.title)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4">
                                        <h3 className="font-bold text-gray-900 truncate">{notif.payload.title}</h3>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(notif.created_at).toLocaleString('fr-FR', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{notif.payload.body}</p>

                                    <div className="mt-4 flex items-center gap-4">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${notif.status === 'sent' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                                            }`}>
                                            Status: {notif.status}
                                        </span>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">
                                            Recipient: {notif.recipient}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl text-blue-500 shadow-sm shrink-0">
                    <Info className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-blue-900 text-sm">Conseil d'administration</h4>
                    <p className="text-xs text-blue-700 mt-1">
                        Les notifications en temps réel s'affichent en haut à droite de votre écran.
                        Si vous ne recevez rien, assurez-vous que votre navigateur autorise les notifications pour ce site.
                    </p>
                </div>
            </div>
        </div>
    );
}
