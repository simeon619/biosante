
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';

interface User {
    id: string;
    phone: string;
    name: string;
    email?: string;
}

interface Address {
    id: string;
    label: string;
    address_full: string;
    lat: number;
    lon: number;
    is_default: boolean;
}

interface AuthContextType {
    user: User | null;
    addresses: Address[];
    loading: boolean;
    login: (phone: string, password: string) => Promise<void>;
    register: (data: { phone: string; password: string; name: string; email?: string }) => Promise<void>;
    logout: () => void;
    refreshAddresses: () => Promise<void>;
    updateProfile: (data: { name?: string; phone?: string; email?: string }) => Promise<void>;
    sendOtp: (phone: string) => Promise<{ success: boolean; message: string }>;
    verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; isNewUser: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshAddresses = async () => {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            const res = await api.getMe(userId);
            setUser(res.user);
            setAddresses(res.addresses || []);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        const token = localStorage.getItem('user_token');

        if (userId && token) {
            // Check session validity
            api.getMe(userId)
                .then(res => {
                    setUser(res.user);
                    setAddresses(res.addresses || []);
                })
                .catch(() => {
                    localStorage.removeItem('user_id');
                    localStorage.removeItem('user_token');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (phone: string, password: string) => {
        const res = await api.login({ phone, password });
        if (res.success) {
            localStorage.setItem('user_id', res.user.id);
            localStorage.setItem('user_token', res.token);
            setUser(res.user);
            await refreshAddresses();
        }
    };

    const register = async (data: { phone: string; password: string; name: string; email?: string }) => {
        const res = await api.register(data);
        if (res.success) {
            localStorage.setItem('user_id', res.user.id);
            localStorage.setItem('user_token', res.token);
            setUser(res.user);
            setAddresses([]);
        }
    };

    const logout = () => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_token');
        setUser(null);
        setAddresses([]);
    };

    const updateProfile = async (data: { name?: string; phone?: string; email?: string }) => {
        if (!user) return;
        const res = await api.updateProfile(user.id, data);
        if (res.success) {
            await refreshAddresses(); // This also updates the user object
        }
    };

    const sendOtp = async (phone: string) => {
        return await api.sendOtp(phone);
    };

    const verifyOtp = async (phone: string, otp: string) => {
        const res = await api.verifyOtp(phone, otp);
        if (res.success && !res.isNewUser) {
            localStorage.setItem('user_id', res.user.id);
            localStorage.setItem('user_token', res.token);
            setUser(res.user);
            await refreshAddresses();
        }
        return res;
    };

    return (
        <AuthContext.Provider value={{ user, addresses, loading, login, register, logout, refreshAddresses, updateProfile, sendOtp, verifyOtp }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
