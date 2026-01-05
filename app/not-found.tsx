'use client';

import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-12">
                <div className="text-[15rem] md:text-[20rem] font-bold leading-none text-slate-50 select-none">
                    404
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-2xl animate-bounce">
                        <Search className="w-12 h-12 md:w-16 md:h-16 text-slate-900" />
                    </div>
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                Page Introuvable
            </h1>
            <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto font-light">
                Désolé, la page que vous recherchez n'existe pas ou a été déplacée. Continuons votre quête de vitalité ailleurs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/">
                    <Button className="h-14 px-8 bg-black text-white hover:bg-black/90 rounded-full flex items-center gap-2 group">
                        <Home className="w-5 h-5" />
                        Retour à l'accueil
                    </Button>
                </Link>
                <Link href="/produits">
                    <Button variant="outline" className="h-14 px-8 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-full flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Voir la boutique
                    </Button>
                </Link>
            </div>

            <div className="mt-20 pt-10 border-t border-slate-100 w-full max-w-xs">
                <p className="text-[10px] uppercase tracking-widest text-slate-300 font-bold">
                    BIO SANTÉ — Science & Nature
                </p>
            </div>
        </div>
    );
}
