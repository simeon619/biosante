'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock, Loader2, ArrowLeft, MessageCircle } from 'lucide-react';
import { api } from '@/services/api';
import { formatCurrency } from '@/lib/utils';

interface OrderDetails {
    id: string;
    customerName: string;
    total: number;
    status: string;
}

type PaymentStatus = 'loading' | 'success' | 'pending' | 'failed' | 'error';

function PaymentVerifyContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<PaymentStatus>('loading');
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const verifyPayment = async () => {
            // Get paymentId from URL (Moneroo adds it) or orderId from our session
            const paymentId = searchParams.get('paymentId');
            const orderId = searchParams.get('orderId') || sessionStorage.getItem('pendingOrderId');

            if (!paymentId && !orderId) {
                setStatus('error');
                setErrorMessage('Aucune commande à vérifier.');
                return;
            }

            try {
                const result = await api.verifyPayment(paymentId || undefined, orderId || undefined);
                setOrder(result.order);

                // Map Moneroo status to our display status
                if (result.status === 'success') {
                    setStatus('success');
                    // Clear pending order from session
                    sessionStorage.removeItem('pendingOrderId');
                } else if (result.status === 'pending' || result.status === 'initiated') {
                    setStatus('pending');
                } else {
                    setStatus('failed');
                }
            } catch (error: any) {
                console.error('Payment verification error:', error);
                setStatus('error');
                setErrorMessage(error.response?.data?.message || 'Erreur lors de la vérification du paiement.');
            }
        };

        verifyPayment();
    }, [searchParams]);

    const handleWhatsApp = () => {
        const message = order
            ? `Bonjour, je viens de passer la commande ${order.id} d'un montant de ${formatCurrency(order.total)}.`
            : 'Bonjour, j\'ai besoin d\'aide avec ma commande.';
        const url = `https://wa.me/2250143678397?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleRetry = () => {
        window.location.reload();
    };

    const handleHome = () => {
        window.location.href = '/';
    };

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Loader2 className="w-10 h-10 text-gray-600 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérification en cours...</h2>
                        <p className="text-gray-600">Nous vérifions le statut de votre paiement.</p>
                    </div>
                );

            case 'success':
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement Réussi !</h2>
                        <p className="text-gray-600 mb-2">
                            Merci {order?.customerName}. Votre commande a été confirmée.
                        </p>
                        {order && (
                            <p className="text-lg font-semibold text-green-600 mb-6">
                                Total: {formatCurrency(order.total)}
                            </p>
                        )}
                        <div className="space-y-3">
                            <button
                                onClick={handleWhatsApp}
                                className="w-full py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Suivre sur WhatsApp
                            </button>
                            <button
                                onClick={handleHome}
                                className="w-full py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Retour à l'accueil
                            </button>
                        </div>
                    </div>
                );

            case 'pending':
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-10 h-10 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement en attente</h2>
                        <p className="text-gray-600 mb-6">
                            Votre paiement est en cours de traitement.
                            <br />Veuillez valider la transaction sur votre téléphone (USSD).
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                            <p className="text-yellow-800 text-sm">
                                💡 <strong>Mobile Money:</strong> Composez le code USSD affiché pour valider le paiement.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={handleRetry}
                                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800"
                            >
                                Actualiser le statut
                            </button>
                            <button
                                onClick={handleWhatsApp}
                                className="w-full py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Besoin d'aide ?
                            </button>
                        </div>
                    </div>
                );

            case 'failed':
            case 'error':
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {status === 'failed' ? 'Paiement Échoué' : 'Erreur'}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {errorMessage || 'Le paiement n\'a pas pu être effectué. Veuillez réessayer.'}
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={handleHome}
                                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800"
                            >
                                Réessayer
                            </button>
                            <button
                                onClick={handleWhatsApp}
                                className="w-full py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Contacter le support
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                {renderContent()}
            </div>
        </div>
    );
}

export default function PaymentVerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
            </div>
        }>
            <PaymentVerifyContent />
        </Suspense>
    );
}
