'use client';

import React, { useEffect, useState } from 'react';
import { X, Bell, ExternalLink } from 'lucide-react';
import { AdminNotification } from '@/hooks/useAdminNotifications';
import Link from 'next/link';

interface NotificationToastProps {
    notification: AdminNotification;
    onClose: () => void;
}

export default function NotificationToast({ notification, onClose }: NotificationToastProps) {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (progress <= 0) {
            onClose();
        }
    }, [progress, onClose]);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => Math.max(0, prev - 2));
        }, 100);

        return () => clearInterval(timer);
    }, []);

    const priorityColors = {
        low: 'bg-gray-500',
        normal: 'bg-blue-500',
        high: 'bg-orange-500',
        urgent: 'bg-red-500'
    };

    const color = priorityColors[notification.priority || 'normal'];

    return (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-80 animate-in slide-in-from-right duration-300">
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className={`${color} p-2 rounded-lg text-white`}>
                        <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <p className="font-bold text-gray-900 truncate">{notification.title}</p>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.body}</p>

                        {notification.data?.orderId && (
                            <Link
                                href={`/admin/orders/${notification.data.orderId}`}
                                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-black hover:underline"
                                onClick={onClose}
                            >
                                Voir la commande <ExternalLink className="w-3 h-3" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            {/* Progress bar */}
            <div className="h-1 w-full bg-gray-100">
                <div
                    className={`${color} h-full transition-all duration-100 ease-linear`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
