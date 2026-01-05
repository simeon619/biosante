'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Phone,
    User,
    Mail,
    ArrowRight,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
    const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
    const [formData, setFormData] = useState({
        phone: '',
        otp: '',
        name: '',
        email: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);

    const { sendOtp, verifyOtp, register } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await sendOtp(formData.phone);
            setStep('otp');
            setIsOtpSent(true);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'envoi du code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await verifyOtp(formData.phone, formData.otp);
            if (result.success && !result.user_exists) {
                // New user - go to profile creation
                setStep('profile');
            } else {
                // Existing user - login complete
                router.push(redirectTo);
            }
        } catch (err: any) {
            setError(err.message || 'Code invalide');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinishProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await register(formData.phone, formData.name, formData.email);
            router.push(redirectTo);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'inscription');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F4F0] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-indigo-600 p-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Bienvenue</h1>
                    <p className="text-indigo-100">Connectez-vous à votre espace personnel</p>
                </div>

                <div className="p-8">
                    {/* Progress Steps */}
                    <div className="flex justify-center mb-8">
                        <div className={`w-3 h-3 rounded-full mx-1 ${step === 'phone' ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                        <div className={`w-3 h-3 rounded-full mx-1 ${step === 'otp' ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                        {step === 'profile' && <div className="w-3 h-3 rounded-full mx-1 bg-indigo-600"></div>}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {isOtpSent && step === 'otp' && (
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-700">Code envoyé avec succès !</p>
                        </div>
                    )}

                    {step === 'phone' && (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="0102030405"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Recevoir le code <ArrowRight className="ml-2 w-4 h-4" /></>}
                            </button>
                        </form>
                    )}

                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Code de vérification</label>
                                <input
                                    type="text"
                                    placeholder="123456"
                                    required
                                    className="block w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                    maxLength={6}
                                />
                                <div className="mt-2 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setStep('phone')}
                                        className="text-sm text-indigo-600 hover:text-indigo-500"
                                    >
                                        Modifier le numéro
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Vérifier'}
                            </button>
                        </form>
                    )}

                    {step === 'profile' && (
                        <form onSubmit={handleFinishProfile} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email (optionnel)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Terminer l\'inscription'}
                            </button>
                        </form>
                    )}
                </div>

                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        Besoin d'aide ? <Link href="/contact" className="text-indigo-600 hover:text-indigo-500 font-medium">Contactez-nous</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F4F4F0] flex items-center justify-center p-4">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
