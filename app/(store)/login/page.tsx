'use client';

import React, { useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowRight,
    Loader2,
    AlertCircle,
    ShieldCheck,
    Sparkles,
    User,
    Mail,
    Info
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
    const reason = searchParams.get('reason');

    // Format phone number locally (01 02 03 04 05)
    const formatPhoneNumber = (value: string) => {
        // Remove non-digits
        const digits = value.replace(/\D/g, '');
        // Limit to 10 digits
        const truncated = digits.slice(0, 10);
        // Add spaces every 2 digits
        return truncated.replace(/(\d{2})(?=\d)/g, '$1 ');
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const formatted = formatPhoneNumber(rawValue);
        setFormData({ ...formData, phone: formatted });
    };

    const getRawPhone = () => {
        return '+225' + formData.phone.replace(/\s/g, '');
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const rawPhone = getRawPhone();
        if (rawPhone.length !== 14) { // +225 + 10 digits (e.g. +2250102030405)
            // Allow 10 digits
            // Check if user entered just 10 digits
            const digits = formData.phone.replace(/\s/g, '');
            if (digits.length !== 10) {
                setError('Numéro de téléphone invalide (10 chiffres requis)');
                return;
            }
        }

        setIsLoading(true);

        try {
            await sendOtp(rawPhone);
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
            const rawPhone = getRawPhone();
            const result = await verifyOtp(rawPhone, formData.otp);
            // Check if user is new (AuthContext usually returns isNewUser flag)
            if (result.success && result.isNewUser) {
                setStep('profile');
            } else {
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
            // Register with dummy password as we use OTP
            await register({
                phone: getRawPhone(),
                name: formData.name,
                email: formData.email,
                password: 'otp_auto_generated_password'
            });
            router.push(redirectTo);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'inscription');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#F4F4F0]">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex flex-col justify-between bg-[#1A4731] p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <Sparkles className="w-8 h-8 text-[#9dbfae]" />
                        <span className="text-xl font-bold tracking-wider">BIOSANTÉ</span>
                    </div>
                    <div className="max-w-xl">
                        <h1 className="text-5xl font-heading font-medium leading-tight mb-6">
                            La nature au service de votre vitalité.
                        </h1>
                        <p className="text-[#c5dcd0] text-lg leading-relaxed">
                            Connectez-vous pour suivre vos commandes, accéder à vos recommandations personnalisées et profiter de nos offres exclusives.
                        </p>
                    </div>
                </div>
                <div className="relative z-10 text-sm text-[#9dbfae] flex items-center gap-4">
                    <span>© 2026 Santé Vitalité</span>
                    <span className="w-1 h-1 rounded-full bg-[#9dbfae]"></span>
                    <span>Qualité Premium</span>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold text-[#1A4731]">
                            {step === 'phone' && 'Bienvenue'}
                            {step === 'otp' && 'Vérification'}
                            {step === 'profile' && 'Créer votre profil'}
                        </h2>
                        <p className="text-gray-500">
                            {step === 'phone' && 'Entrez votre numéro pour continuer'}
                            {step === 'otp' && 'Nous avons envoyé un code au ' + formatPhoneNumber(formData.phone)}
                            {step === 'profile' && 'Quelques détails pour mieux vous connaître'}
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/50 backdrop-blur-sm">
                        {/* Stepper */}
                        {step !== 'phone' && (
                            <div className="flex gap-2 mb-8">
                                <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${step === 'phone' || step === 'otp' || step === 'profile' ? 'bg-[#1A4731]' : 'bg-gray-200'}`} />
                                <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${step === 'otp' || step === 'profile' ? 'bg-[#1A4731]' : 'bg-gray-200'}`} />
                                <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${step === 'profile' ? 'bg-[#1A4731]' : 'bg-gray-200'}`} />
                            </div>
                        )}

                        {reason === 'checkout' && step === 'phone' && (
                            <div className="mb-6 p-4 bg-amber-50 text-amber-900 text-sm rounded-xl flex items-start gap-3 border border-amber-100 animate-in fade-in slide-in-from-top-2">
                                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
                                <div>
                                    <p className="font-bold text-amber-800">Finalisez votre commande</p>
                                    <p className="text-amber-700/90 leading-relaxed mt-0.5">
                                        Connectez-vous pour valider votre panier et suivre la livraison de vos produits.
                                    </p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-3 animate-in fade-in zoom-in-95">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        {step === 'phone' && (
                            <form onSubmit={handleSendOtp} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Numéro de téléphone</label>
                                    <div className="relative flex shadow-sm rounded-xl overflow-hidden group focus-within:ring-2 focus-within:ring-[#1A4731]/20 focus-within:border-[#1A4731] transition-all border border-gray-200">
                                        <div className="bg-gray-50 px-4 flex items-center border-r border-gray-200 text-gray-600 font-medium select-none">
                                            <span className="mr-2">🇨🇮</span> +225
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="01 02 03 04 05"
                                            className="block w-full px-4 py-3.5 outline-none placeholder:text-gray-300 text-gray-900 bg-white"
                                            value={formData.phone}
                                            onChange={handlePhoneChange}
                                            autoFocus
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 ml-1">Format: 10 chiffres (ex: 07 07 ...)</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading || formData.phone.length < 10}
                                    className="w-full flex items-center justify-center py-4 px-4 bg-[#1A4731] hover:bg-[#153a28] text-white rounded-xl font-medium transition-all shadow-lg shadow-[#1A4731]/20 disabled:opacity-70 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-[1px]"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Recevoir le code <ArrowRight className="ml-2 w-4 h-4" /></>}
                                </button>
                            </form>
                        )}

                        {step === 'otp' && (
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Code de vérification</label>
                                    <input
                                        type="text"
                                        placeholder="• • • • • •"
                                        className="block w-full px-4 py-4 text-center text-3xl tracking-[0.5em] font-mono border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A4731]/20 focus:border-[#1A4731] outline-none transition-all placeholder:text-gray-200 text-[#1A4731] font-bold"
                                        value={formData.otp}
                                        onChange={(e) => setFormData({ ...formData, otp: e.target.value.slice(0, 6) })}
                                        maxLength={6}
                                        autoFocus
                                    />
                                    <div className="flex justify-between items-center px-1 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setStep('phone')}
                                            className="text-sm text-gray-500 hover:text-[#1A4731] underline decoration-transparent hover:decoration-[#1A4731] transition-all"
                                        >
                                            Numéro incorrect ?
                                        </button>
                                        <span className="text-xs text-gray-400">Expire dans 5 min</span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading || formData.otp.length < 6}
                                    className="w-full flex items-center justify-center py-4 px-4 bg-[#1A4731] hover:bg-[#153a28] text-white rounded-xl font-medium transition-all shadow-lg shadow-[#1A4731]/20 disabled:opacity-70 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-[1px]"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Vérifier le code'}
                                </button>
                            </form>
                        )}

                        {step === 'profile' && (
                            <form onSubmit={handleFinishProfile} className="space-y-5">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700 ml-1">Nom complet</label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="Jean Kouassi"
                                                className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A4731]/20 focus:border-[#1A4731] outline-none transition-all"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700 ml-1">Email <span className="text-gray-400 font-normal">(optionnel)</span></label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="email"
                                                placeholder="jean.k@example.com"
                                                className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A4731]/20 focus:border-[#1A4731] outline-none transition-all"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center py-4 px-4 bg-[#1A4731] hover:bg-[#153a28] text-white rounded-xl font-medium transition-all shadow-lg shadow-[#1A4731]/20 disabled:opacity-70 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-[1px]"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Créer mon compte'}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="text-center space-y-6">
                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                            <ShieldCheck className="w-3 h-3" />
                            Données chiffrées & Paiement 100% sécurisé
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F4F4F0] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#1A4731] animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
