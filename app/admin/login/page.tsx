'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Loader2, ArrowLeft, Shield } from 'lucide-react';
import { API_URL } from '@/lib/utils';

export default function AdminLoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Format phone for display
    const formatPhoneDisplay = (value: string) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 2) return digits;
        if (digits.length <= 4) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
        if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`;
        if (digits.length <= 8) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6)}`;
        return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
    };

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/admin/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de l\'envoi');
            }

            setStep('otp');
            setCountdown(300); // 5 minutes
            setOtp(['', '', '', '', '', '']);
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        // Allow only alphanumeric
        const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-1);

        const newOtp = [...otp];
        newOtp[index] = cleanValue;
        setOtp(newOtp);

        // Auto-focus next input
        if (cleanValue && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all filled
        if (newOtp.every(char => char !== '') && index === 5) {
            handleOtpSubmit(newOtp.join(''));
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        if (pastedData.length === 6) {
            handleOtpSubmit(pastedData);
        } else {
            otpRefs.current[pastedData.length]?.focus();
        }
    };

    const handleOtpSubmit = async (code?: string) => {
        setError('');
        setIsLoading(true);

        const otpCode = code || otp.join('');

        try {
            const response = await fetch(`${API_URL}/api/admin/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp: otpCode })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Code invalide');
            }

            // Store token and admin data
            localStorage.setItem('admin_token', data.token);
            localStorage.setItem('admin_data', JSON.stringify(data.admin));

            // Redirect to dashboard
            router.push('/admin');
        } catch (err: any) {
            setError(err.message);
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/admin/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erreur');
            }

            setCountdown(300);
            setOtp(['', '', '', '', '', '']);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCountdown = () => {
        const minutes = Math.floor(countdown / 60);
        const seconds = countdown % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">BIO SANTÉ</h1>
                    <p className="text-white/50 mt-2">Panneau d'administration</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {step === 'phone' ? (
                        <>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Connexion Sécurisée</h2>
                            </div>
                            <p className="text-gray-500 mb-6">Entrez votre numéro de téléphone autorisé pour recevoir un code de connexion.</p>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handlePhoneSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                            <span className="text-gray-600 font-medium">+225</span>
                                            <div className="w-px h-5 bg-gray-300"></div>
                                        </div>
                                        <input
                                            type="tel"
                                            value={formatPhoneDisplay(phone)}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            className="w-full pl-[85px] pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-lg tracking-wide"
                                            placeholder="07 XX XX XX XX"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || phone.length < 10}
                                    className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        'Recevoir le code SMS'
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setStep('phone')}
                                className="flex items-center gap-2 text-gray-500 hover:text-black mb-4 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Changer de numéro
                            </button>

                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérification</h2>
                            <p className="text-gray-500 mb-6">
                                Entrez le code à 6 caractères envoyé au <span className="font-semibold text-black">+225 {formatPhoneDisplay(phone)}</span>
                            </p>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-2 justify-center mb-6">
                                {otp.map((char, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { otpRefs.current[index] = el; }}
                                        type="text"
                                        value={char}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        onPaste={index === 0 ? handleOtpPaste : undefined}
                                        className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all uppercase"
                                        maxLength={1}
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>

                            <div className="text-center mb-6">
                                {countdown > 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        Code expire dans <span className="font-bold text-black">{formatCountdown()}</span>
                                    </p>
                                ) : (
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={isLoading}
                                        className="text-black font-semibold text-sm hover:underline disabled:opacity-50"
                                    >
                                        Renvoyer le code
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={() => handleOtpSubmit()}
                                disabled={isLoading || otp.some(char => !char)}
                                className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Vérification...
                                    </>
                                ) : (
                                    'Se connecter'
                                )}
                            </button>
                        </>
                    )}
                </div>

                {/* Help text */}
                <p className="text-center text-white/40 text-sm mt-6">
                    Seuls les numéros autorisés peuvent se connecter.
                </p>
            </div>
        </div>
    );
}
