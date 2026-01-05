'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Clock, Loader2, ChevronDown, ShieldCheck, HeartPulse, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const faqs = [
    {
        question: "Comment puis-je passer commande ?",
        answer: "Vous pouvez commander directement sur notre site en ajoutant les produits au panier. Le paiement se fait à la livraison ou via Mobile Money lors de la validation."
    },
    {
        question: "Quels sont les délais de livraison ?",
        answer: "Pour Abidjan, nous livrons en moins de 24h. Pour les villes de l'intérieur, comptez 48h à 72h via nos partenaires de transport."
    },
    {
        question: "Les produits sont-ils vraiment naturels ?",
        answer: "Oui, nos formulations BioActif et VitaMax sont 100% à base d'extraits végétaux rigoureusement sélectionnés et validés par des protocoles scientifiques."
    },
    {
        question: "Puis-je consulter un expert avant d'acheter ?",
        answer: "Absolument. Nos conseillers en phytothérapie sont disponibles sur WhatsApp pour vous orienter vers la solution la plus adaptée à vos besoins."
    }
];

export default function ContactPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { API_URL } = await import('@/lib/utils');
                const response = await fetch(`${API_URL}/api/settings/public`);
                if (response.ok) {
                    const data = await response.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const contactInfo = {
        email: settings?.contact?.email || 'contact@bio-sante.com',
        phone: settings?.contact?.phone || '+225 00 00 00 00 00',
        whatsapp: settings?.contact?.whatsapp || '+225 00 00 00 00 00',
        address: settings?.business?.address || 'Abidjan, Côte d\'Ivoire',
        hours: settings?.business?.hours || 'Lun - Sam : 08:30 - 18:30',
    };

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-bloom-red blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-bloom-green blur-[120px] rounded-full"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            </div>

            <div className="relative z-10 w-full">
                {/* Header / Hero */}
                <section className="py-24 md:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto text-center space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 bg-white/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
                                <ShieldCheck className="w-4 h-4 text-black" />
                                <span className="text-xs font-bold uppercase tracking-widest text-black">Support & Accompagnement</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                Assistance <span className="text-black/30">& Aide.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-black/60 font-light leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                                Vous avez des questions ? Nous avons les réponses. <br className="hidden md:block" />
                                Contactez notre équipe d'experts pour un suivi personnalisé.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact info Grid */}
                <section className="pb-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* WhatsApp Premium Card */}
                            <div className="md:col-span-2 relative group overflow-hidden rounded-[2.5rem] border border-black/5 bg-black p-8 md:p-12 text-white transition-all duration-500 hover:shadow-2xl hover:shadow-black/20">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/20 rounded-full blur-[100px] group-hover:bg-green-500/30 transition-colors duration-700"></div>
                                <div className="relative z-10 h-full flex flex-col justify-between space-y-12">
                                    <div className="space-y-6">
                                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                                            <MessageSquare className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-4xl font-bold tracking-tight">Conseil Médical & <br />Phytothérapie</h3>
                                        <p className="text-white/70 text-lg font-light max-w-lg">
                                            Parlez directement à l'un de nos spécialistes. Obtenez une recommandation sur mesure basée sur vos besoins spécifiques.
                                        </p>
                                    </div>
                                    <a
                                        href={`https://wa.me/${contactInfo.whatsapp.replace(/[^\d]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="w-full sm:w-auto h-16 px-10 bg-white text-black hover:bg-white/90 rounded-2xl text-xl font-bold transition-transform hover:scale-[1.02]">
                                            Démarrer sur WhatsApp
                                        </Button>
                                    </a>
                                </div>
                            </div>

                            {/* Quick Info Grid */}
                            <div className="flex flex-col gap-6">
                                {/* Email Card */}
                                <div className="flex-1 p-8 rounded-[2rem] border border-black/5 bg-white/40 backdrop-blur-xl transition-all duration-500 hover:bg-white/60">
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-1">Email</p>
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin text-black/20" /> : (
                                                <p className="text-lg font-bold tracking-tight">{contactInfo.email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Office Card */}
                                <div className="flex-1 p-8 rounded-[2rem] border border-black/5 bg-white/40 backdrop-blur-xl transition-all duration-500 hover:bg-white/60">
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-1">Bureau</p>
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin text-black/20" /> : (
                                                <p className="text-lg font-bold tracking-tight">{contactInfo.address}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Hours Card */}
                                <div className="flex-1 p-8 rounded-[2rem] border border-black/5 bg-white/40 backdrop-blur-xl transition-all duration-500 hover:bg-white/60">
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-1">Horaires</p>
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin text-black/20" /> : (
                                                <p className="text-lg font-bold tracking-tight">{contactInfo.hours}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 border-t border-black/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                            <div className="lg:col-span-5 space-y-6">
                                <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center">
                                    <HelpCircle className="w-7 h-7 text-black" />
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Questions <br />Fréquentes</h2>
                                <p className="text-xl text-black/60 font-light leading-relaxed">
                                    Tout ce qu'il faut savoir sur nos protocoles et nos services. Si vous ne trouvez pas votre réponse, n'hésitez pas à nous appeler.
                                </p>
                                <div className="pt-6">
                                    <div className="p-6 rounded-3xl bg-black/5 border border-black/5">
                                        <p className="text-sm font-bold uppercase tracking-widest text-black/40 mb-2">Service Téléphonique</p>
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin text-black/20" /> : (
                                            <p className="text-2xl font-bold flex items-center gap-3">
                                                <Phone className="w-5 h-5" />
                                                {contactInfo.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-7 space-y-4">
                                {faqs.map((faq, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "group rounded-[2rem] border transition-all duration-500",
                                            openFaq === idx
                                                ? "border-black/10 bg-white shadow-xl shadow-black/5"
                                                : "border-transparent bg-black/5 hover:bg-black/10"
                                        )}
                                    >
                                        <button
                                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                            className="w-full px-8 py-8 flex items-center justify-between text-left"
                                        >
                                            <span className="text-xl font-bold tracking-tight">{faq.question}</span>
                                            <ChevronDown className={cn("w-6 h-6 transition-transform duration-500", openFaq === idx && "rotate-180")} />
                                        </button>
                                        {openFaq === idx && (
                                            <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <p className="text-lg text-black/60 font-light leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="py-24 bg-black text-white relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 blur-[120px] rounded-full"></div>
                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                        <HeartPulse className="w-12 h-12 text-white mx-auto mb-8 opacity-40 animate-pulse" />
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">La santé n'attend pas.</h2>
                        <p className="text-white/60 mb-12 text-xl font-light">
                            Rejoignez les milliers de personnes qui ont déjà fait confiance à BIO SANTÉ pour retrouver leur bien-être.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <a href="/produits" className="h-16 px-12 inline-flex items-center justify-center bg-white text-black rounded-full text-lg font-bold hover:bg-white/90 transition-transform hover:scale-105">
                                Voir nos Solutions
                            </a>
                            <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^\d]/g, '')}`} className="h-16 px-12 inline-flex items-center justify-center border border-white/20 text-white rounded-full text-lg font-medium hover:bg-white/10 transition-colors">
                                Suivi Personnalisé
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
