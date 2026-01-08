'use client';

import { useEffect, useState, useCallback } from 'react';
import { Transmit } from '@adonisjs/transmit-client';
import { API_URL } from '@/lib/utils';

export interface AdminNotification {
    title: string;
    body: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    data?: Record<string, any>;
    timestamp: string;
}

export function useAdminNotifications() {
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const addNotification = useCallback((notification: AdminNotification) => {
        setNotifications(prev => [notification, ...prev].slice(0, 50));
        setUnreadCount(prev => prev + 1);

        // Browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.body,
                icon: '/logo.png' // Replace with your logo
            });
        }
    }, []);

    useEffect(() => {
        const baseUrl = API_URL;

        const transmit = new Transmit({
            baseUrl,
        });


        const subscription = transmit.subscription('admin_alerts');

        subscription.onMessage((message: any) => {
            console.log('[Admin Notification Received]', message);
            addNotification(message as AdminNotification);
        });

        const connect = async () => {
            try {
                await subscription.create();
                console.log('[Admin WebSocket] Subscribed to admin_alerts');
            } catch (error) {
                console.error('[Admin WebSocket] Subscription error:', error);
            }
        };

        connect();

        // Request browser notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            subscription.delete();
        };
    }, [addNotification]);

    const markAsRead = () => {
        setUnreadCount(0);
    };

    return {
        notifications,
        unreadCount,
        markAsRead
    };
}
