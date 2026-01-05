'use client';

import React, { useEffect, useState, use } from 'react';
import {
    CheckCircle,
    Copy,
    ExternalLink,
    Phone,
    ArrowLeft,
    Loader2,
    Check,
    Clock,
    Timer,
    Send,
    Smartphone,
    Camera,
    MessageSquare,
    ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import Link from 'next/link';
import { cn, formatCurrency } from '@/lib/utils';
import { getPublicSettings, PublicSettings, defaultSettings, formatPhoneDisplay } from '@/services/settings';

interface PaymentPageProps {
    params: Promise<{ orderId: string }>;
}

const PROVIDERS = [
    { id: 'wave', label: 'Wave', color: 'bg-[#1DC1EC]', textColor: 'text-[#1DC1EC]', number: '01 43 67 83 97', ext: 'webp' },
    { id: 'orange', label: 'Orange', color: 'bg-[#FF7900]', textColor: 'text-[#FF7900]', number: '07 07 63 18 61', ext: 'png' },
    { id: 'mtn', label: 'MTN', color: 'bg-[#FFCC00]', textColor: 'text-[#FFCC00]', number: '05 07 85 99 53', ext: 'png' },
    { id: 'moov', label: 'Moov', color: 'bg-[#0066B3]', textColor: 'text-[#0066B3]', number: '01 43 67 83 97', ext: 'jpeg' },
];

export default function PaymentPage({ params }: PaymentPageProps) {
    const { orderId } = use(params);
    const [status, setStatus] = useState<'pending' | 'verifying' | 'success' | 'failed'>('pending');
    const [orderData, setOrderData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState<string | null>(null);
    const [selectedProvider, setSelectedProvider] = useState<string>('');
    const [reference, setReference] = useState('');
    const [isSubmittingRef, setIsSubmittingRef] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [settings, setSettings] = useState<PublicSettings>(defaultSettings);

    const providers = [
        { id: 'wave', label: 'Wave', color: 'bg-[#1DC1EC]', textColor: 'text-[#1DC1EC]', number: formatPhoneDisplay(settings.payment.wave), ext: 'webp' },
        { id: 'orange', label: 'Orange', color: 'bg-[#FF7900]', textColor: 'text-[#FF7900]', number: formatPhoneDisplay(settings.payment.orange), ext: 'png' },
        { id: 'mtn', label: 'MTN', color: 'bg-[#FFCC00]', textColor: 'text-[#FFCC00]', number: formatPhoneDisplay(settings.payment.mtn), ext: 'png' },
        { id: 'moov', label: 'Moov', color: 'bg-[#0066B3]', textColor: 'text-[#0066B3]', number: formatPhoneDisplay(settings.payment.moov), ext: 'jpeg' },
    ];

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await api.verifyPayment(undefined, orderId);
                setOrderData(response.order);
                if (response.manualStatus) {
                    setStatus(response.manualStatus);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching payment status:', error);
                setLoading(false);
            }
        };
        fetchStatus();
        const interval = setInterval(fetchStatus, 15000);
        return () => clearInterval(interval);
    }, [orderId]);

    useEffect(() => {
        const loadSettings = async () => {
            const data = await getPublicSettings();
            setSettings(data);
        };
        loadSettings();
    }, []);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    // Handler for manual mobile money payments (requires selectedProvider)
    const handleSubmitReference = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProvider || !reference || !orderData) return;
        setIsSubmittingRef(true);
        try {
            await api.submitReference({
                orderId,
                provider: selectedProvider,
                reference,
                amount: orderData.total
            });
            setStatus('verifying');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Erreur lors de la soumission');
        } finally {
            setIsSubmittingRef(false);
        }
    };

    // Handler for Wave payments (no provider selection needed)
    const handleWaveSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reference || !orderData) return;
        setIsSubmittingRef(true);
        try {
            await api.submitReference({
                orderId,
                provider: 'wave',
                reference,
                amount: orderData.total
            });
            setStatus('verifying');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Erreur lors de la soumission');
        } finally {
            setIsSubmittingRef(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            await api.uploadProof(orderId as string, file);
            setUploadSuccess(true);
            setStatus('verifying');
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erreur lors de l\'envoi du reçu.');
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto" />
                    <p className="mt-4 text-sm text-slate-400">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Retour</span>
                    </Link>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-medium">Commande</p>
                        <p className="text-sm font-mono font-semibold text-slate-700">#{orderId.slice(0, 8).toUpperCase()}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 pt-6">
                {/* Amount Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 mb-4">
                    <p className="text-xs text-slate-400 mb-1">Montant à payer</p>
                    <p className="text-3xl font-bold text-slate-900">
                        {formatCurrency(orderData?.total || 0)}
                    </p>
                </div>

                {/* Status Steps */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 mb-4">
                    <div className="flex items-center justify-between">
                        {[
                            { id: 'pending', label: 'Transfert', icon: Clock },
                            { id: 'verifying', label: 'Vérification', icon: Timer },
                            { id: 'success', label: 'Validé', icon: CheckCircle },
                        ].map((step, idx, arr) => {
                            const stepIndex = arr.findIndex(s => s.id === status);
                            const isCompleted = idx < stepIndex || status === 'success';
                            const isActive = step.id === status;
                            const Icon = step.icon;

                            return (
                                <React.Fragment key={step.id}>
                                    <div className="flex flex-col items-center">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all",
                                            isCompleted ? "bg-green-500 text-white" :
                                                isActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                                        )}>
                                            {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                        </div>
                                        <span className={cn(
                                            "text-xs font-medium",
                                            isActive ? "text-slate-900" : "text-slate-400"
                                        )}>{step.label}</span>
                                    </div>
                                    {idx < arr.length - 1 && (
                                        <div className={cn(
                                            "flex-1 h-0.5 mx-2",
                                            idx < stepIndex ? "bg-green-500" : "bg-slate-100"
                                        )} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Wave SMS Banner + Validation Form */}
                {orderData?.payment_method === 'wave' && status === 'pending' && (
                    <>
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-500 rounded-xl text-white">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900 mb-1">Lien Wave envoyé par SMS</h3>
                                    <p className="text-sm text-slate-600 mb-3">
                                        Vérifiez vos SMS pour payer {formatCurrency(orderData?.total || 0)}
                                    </p>
                                    <a
                                        href={`https://pay.wave.com/m/M_ci_m4MFE02NW-Wi/c/ci/?amount=${Math.round(orderData?.total || 0)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Ouvrir Wave
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Wave Validation Form */}
                        <form onSubmit={handleWaveSubmit} className="bg-white rounded-2xl p-4 border border-slate-100 mb-4">
                            <label className="text-xs font-medium text-slate-500 block mb-2">ID Transaction Wave (code SMS)</label>
                            <input
                                type="text"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                placeholder="Ex: W123456789"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-slate-400 mb-3"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmittingRef || !reference}
                                className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmittingRef ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                    <>Valider le paiement Wave <ChevronRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </form>

                        {/* Wave Screenshot Upload */}
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 mb-4">
                            <p className="text-xs text-slate-400 text-center mb-3">ou envoyez une capture d'écran</p>
                            <label className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                                {isUploading ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                                ) : uploadSuccess ? (
                                    <><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-sm font-medium text-green-600">Envoyé !</span></>
                                ) : (
                                    <><Camera className="w-5 h-5 text-blue-400" /><span className="text-sm font-medium text-blue-600">Envoyer une capture</span></>
                                )}
                            </label>
                        </div>
                    </>
                )}

                {/* Success State */}
                {status === 'success' && (
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Paiement validé !</h2>
                        <p className="text-slate-600 text-sm mb-4">
                            Un agent va vous appeler pour confirmer la livraison.
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-slate-900 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors"
                        >
                            Retour à l'accueil
                        </Link>
                    </div>
                )}

                {/* Verifying State */}
                {status === 'verifying' && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Vérification en cours</h3>
                        <p className="text-slate-500 text-sm">
                            Nous vérifions votre transfert. Cette page s'actualise automatiquement.
                        </p>
                    </div>
                )}

                {/* Pending Form - Only show for manual payments, not Wave */}
                {status === 'pending' && orderData?.payment_method !== 'wave' && (
                    <>
                        {/* Provider Selection */}
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 mb-4">
                            <label className="text-xs font-medium text-slate-500 block mb-3">Sélectionnez votre opérateur</label>
                            <div className="grid grid-cols-3 gap-2">
                                {providers.filter(p => p.id !== 'wave').map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setSelectedProvider(p.id)}
                                        className={cn(
                                            "flex flex-col items-center p-3 rounded-xl border transition-all",
                                            selectedProvider === p.id
                                                ? "bg-slate-900 border-slate-900 text-white"
                                                : "bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-200"
                                        )}
                                    >
                                        <img
                                            src={`/logos/${p.id}.${(p as any).ext}`}
                                            alt={p.label}
                                            className="w-8 h-8 rounded-full object-contain mb-1.5"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center mb-1.5 text-white font-bold text-xs hidden",
                                            p.color
                                        )}>
                                            {p.id === 'orange' ? 'OM' : p.id === 'mtn' ? 'M' : 'Mo'}
                                        </div>
                                        <span className="text-[10px] font-semibold uppercase">{p.label}</span>
                                    </button>
                                ))}
                            </div>

                            {selectedProvider && (
                                <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                                    <p className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        Transférer à ce numéro {providers.find(p => p.id === selectedProvider)?.label}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-mono font-bold text-green-800">
                                            {providers.find(p => p.id === selectedProvider)?.number}
                                        </span>
                                        <button
                                            onClick={() => {
                                                const num = providers.find(p => p.id === selectedProvider)?.number;
                                                if (num) copyToClipboard(num.replace(/\s/g, ''), 'provider-num');
                                            }}
                                            className="p-2 bg-green-200 rounded-lg hover:bg-green-300 transition-colors"
                                        >
                                            {copied === 'provider-num' ? <Check className="w-4 h-4 text-green-700" /> : <Copy className="w-4 h-4 text-green-600" />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Reference Input */}
                        <form onSubmit={handleSubmitReference} className="bg-white rounded-2xl p-4 border border-slate-100 mb-4">
                            <label className="text-xs font-medium text-slate-500 block mb-2">ID Transaction (code SMS)</label>
                            <input
                                type="text"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                placeholder="Ex: 1234567890"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-slate-400 mb-3"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmittingRef || !reference || !selectedProvider}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmittingRef ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                    <>Valider le paiement <ChevronRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </form>

                        {/* Upload Screenshot */}
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 mb-4">
                            <p className="text-xs text-slate-400 text-center mb-3">ou envoyez une capture d'écran</p>
                            <label className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                                {isUploading ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                                ) : uploadSuccess ? (
                                    <><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-sm font-medium text-green-600">Envoyé !</span></>
                                ) : (
                                    <><Camera className="w-5 h-5 text-slate-400" /><span className="text-sm font-medium text-slate-600">Envoyer une capture</span></>
                                )}
                            </label>
                        </div>
                    </>
                )}

                {/* Support */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100">
                    <a
                        href={`https://wa.me/${settings.contact_whatsapp.replace(/\+/g, '')}`}
                        target="_blank"
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                                <Phone className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">Besoin d'aide ?</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                </div>
            </div>
        </div>
    );
}
