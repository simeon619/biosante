'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    ShoppingCart,
    Mic,
    Package,
    Truck,
    BarChart3,
    Bell,
    LogOut,
    Menu,
    X,
    AlertTriangle,
    Check,
    CreditCard,
    ChevronLeft,
    ChevronRight,
    Settings
} from 'lucide-react';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import NotificationToast from '@/components/admin/NotificationToast';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop collapsed state
    const [adminName, setAdminName] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);

    // Real-time notifications hook
    const { notifications, unreadCount, markAsRead } = useAdminNotifications();
    const [toasts, setToasts] = useState<any[]>([]);

    // Track shown notification timestamps/ids to prevent duplicates
    const [lastNotifTime, setLastNotifTime] = useState<number>(0);

    useEffect(() => {
        // Show toast for new notifications that haven't been shown yet
        if (notifications.length > 0) {
            const latest = notifications[0];
            const timestamp = latest.timestamp ? new Date(latest.timestamp).getTime() : Date.now();

            if (timestamp > lastNotifTime) {
                const newToast = {
                    id: timestamp,
                    notification: latest
                };
                setToasts(prev => [...prev, newToast]);
                setLastNotifTime(timestamp);
            }
        }
    }, [notifications, lastNotifTime]);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // Load collapsed state from localStorage
    useEffect(() => {
        const savedCollapsed = localStorage.getItem('admin_sidebar_collapsed');
        if (savedCollapsed) {
            setSidebarCollapsed(savedCollapsed === 'true');
        }

        // Auto-collapse on smaller screens
        const handleResize = () => {
            if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
                setSidebarCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Persist collapsed state
    const toggleSidebarCollapse = () => {
        const newValue = !sidebarCollapsed;
        setSidebarCollapsed(newValue);
        localStorage.setItem('admin_sidebar_collapsed', String(newValue));
    };

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('admin_token');
        const adminData = localStorage.getItem('admin_data');

        if (!token && pathname !== '/admin/login') {
            router.push('/admin/login');
        } else {
            setIsAuthenticated(true);
            if (adminData) {
                const admin = JSON.parse(adminData);
                setAdminName(admin.name);
            }
        }
        setIsLoading(false);
    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        router.push('/admin/login');
    };

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/orders', label: 'Commandes', icon: ShoppingCart },
        { href: '/admin/audio', label: 'Témoignages', icon: Mic },
        { href: '/admin/products', label: 'Produits', icon: Package },
        { href: '/admin/shipping', label: 'Expédition', icon: Truck },
        { href: '/admin/payments', label: 'Paiements', icon: CreditCard },
        { href: '/admin/stats', label: 'Statistiques', icon: BarChart3 },
        { href: '/admin/settings', label: 'Paramètres', icon: Settings },
        { href: '/admin/dlq', label: 'DLQ', icon: AlertTriangle },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    // Login page doesn't need the admin layout
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Real-time Toasts Container */}
            <div className="fixed top-20 right-6 z-[100] flex flex-col gap-4 pointer-events-none">
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto">
                        <NotificationToast
                            notification={toast.notification}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </div>

            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-50 h-full bg-black text-white transform transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
                w-64
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className={`p-4 border-b border-white/10 flex items-center ${sidebarCollapsed ? 'lg:justify-center' : 'justify-between'}`}>
                        <div className={`${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                            <h1 className="text-xl font-bold">BIO SANTÉ</h1>
                            <p className="text-xs text-white/50 mt-0.5">Administration</p>
                        </div>
                        {sidebarCollapsed && (
                            <div className="hidden lg:block">
                                <span className="text-2xl font-black">SV</span>
                            </div>
                        )}

                        {/* Collapse toggle button - Desktop only */}
                        <button
                            onClick={toggleSidebarCollapse}
                            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                            title={sidebarCollapsed ? 'Déplier' : 'Replier'}
                        >
                            {sidebarCollapsed ? (
                                <ChevronRight className="w-5 h-5" />
                            ) : (
                                <ChevronLeft className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href ||
                                (item.href !== '/admin' && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative group
                                        ${isActive
                                            ? 'bg-white text-black'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }
                                        ${sidebarCollapsed ? 'lg:justify-center lg:px-0' : ''}
                                    `}
                                    title={sidebarCollapsed ? item.label : undefined}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span className={`font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                                        {item.label}
                                    </span>

                                    {/* Tooltip for collapsed state */}
                                    {sidebarCollapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 hidden lg:block">
                                            {item.label}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className={`p-3 border-t border-white/10 ${sidebarCollapsed ? 'lg:px-2' : ''}`}>
                        <div className={`flex items-center gap-3 mb-3 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg font-bold">{adminName.charAt(0)}</span>
                            </div>
                            <div className={`${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                                <p className="font-medium text-sm text-white truncate">{adminName}</p>
                                <p className="text-xs text-white/50">Administrateur</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ${sidebarCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                            title={sidebarCollapsed ? 'Déconnexion' : undefined}
                        >
                            <LogOut className="w-4 h-4 flex-shrink-0" />
                            <span className={`${sidebarCollapsed ? 'lg:hidden' : ''}`}>Déconnexion</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    if (!showNotifications) markAsRead();
                                }}
                                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowNotifications(false)}
                                    />
                                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                            <h3 className="font-bold text-gray-900">Notifications</h3>
                                            <button
                                                onClick={markAsRead}
                                                className="text-xs text-gray-500 hover:text-black flex items-center gap-1"
                                            >
                                                <Check className="w-3 h-3" /> Tout marquer comme lu
                                            </button>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-gray-400">
                                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                                    <p className="text-sm">Aucune notification</p>
                                                </div>
                                            ) : (
                                                notifications.map((notif, idx) => (
                                                    <div key={idx} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                        <p className="text-sm font-bold text-gray-900">{notif.title}</p>
                                                        <p className="text-xs text-gray-600 mt-0.5">{notif.body}</p>
                                                        <p className="text-[10px] text-gray-400 mt-2">
                                                            {new Date(notif.timestamp).toLocaleTimeString('fr-FR', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className="p-3 bg-gray-50 text-center">
                                            <Link
                                                href="/admin/notifications"
                                                className="text-xs font-semibold text-gray-600 hover:text-black"
                                                onClick={() => setShowNotifications(false)}
                                            >
                                                Voir tout l'historique
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
