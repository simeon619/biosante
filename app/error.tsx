'use client';

import { useEffect } from 'react';
import { RefreshCcw, Home, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-10 border border-red-100 animate-pulse">
                <AlertCircle className="w-12 h-12 text-red-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                Oups ! Quelque chose a mal tourné.
            </h1>
            <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto font-light">
                Nous avons rencontré une erreur inattendue. Nos experts travaillent déjà à rétablir la situation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={() => reset()}
                    className="h-14 px-10 bg-black text-white hover:bg-black/90 rounded-full flex items-center gap-2"
                >
                    <RefreshCcw className="w-5 h-5" />
                    Réessayer
                </Button>
                <Link href="/">
                    <Button variant="outline" className="h-14 px-10 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-full flex items-center gap-2">
                        <Home className="w-5 h-5" />
                        Retour à l'accueil
                    </Button>
                </Link>
            </div>

            <div className="mt-20 text-slate-300 text-[10px] font-mono uppercase tracking-widest">
                Error ID: {error.digest || 'unknown'}
            </div>
        </div>
    );
}
