'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, User, CheckCircle, Loader2, ArrowLeft, ArrowRight, Truck, Crosshair, Mail, Wallet, Banknote, Building2, Search, Info, ShieldCheck, Lock, Plus, Trash2, Home, Smartphone, MessageSquare } from 'lucide-react';
import { CartItem, DeliveryEstimate } from '../types';
import { api } from '../services/api';
import { ShippingCompany, findCompaniesByCity, getAllDestinations, ABIDJAN_AREA, isInAbidjanArea } from '../data/shippingCompanies';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getPublicSettings, PublicSettings, defaultSettings, formatPhoneDisplay } from '../services/settings';

// Declare Leaflet global type
declare const L: any;
import { cn, formatCurrency, isValidIvorianPhone, formatIvorianPhone } from '@/lib/utils';
import * as fpixel from '@/lib/fpixel';
import { useSettings } from '@/context/SettingsContext';

interface CheckoutPageProps {
    cart: CartItem[];
    onBack: () => void;
    onClearCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = (props) => {
    const { cart, onBack, onClearCart } = props;
    const { isInitialized } = useCart();
    const { user, addresses, loading: authLoading, refreshAddresses } = useAuth();
    const router = useRouter();

    // 1. All Refs
    const mapRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<any>(null);
    const addressInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const cityInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<any>(null);
    const errorRef = useRef<HTMLDivElement>(null);

    // 2. All State
    const [deliveryMode, setDeliveryMode] = useState<'local' | 'shipping'>('local');
    const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard'); // standard = lendemain (1000F), express = jour même (2000F)
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [citySearchQuery, setCitySearchQuery] = useState<string>('');
    const [availableCompanies, setAvailableCompanies] = useState<ShippingCompany[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<ShippingCompany | null>(null);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const [manualCompany, setManualCompany] = useState('');
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', addressNote: '', address: '' });
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'manual' | 'wave'>('wave');
    const [manualConfirmed, setManualConfirmed] = useState(false);
    const [waveLinkSent, setWaveLinkSent] = useState(false);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [saveNewAddress, setSaveNewAddress] = useState(false);
    const [settings, setSettings] = useState<PublicSettings>(defaultSettings);

    // 3. All Effects
    useEffect(() => {
        setIsMounted(true);
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                phone: user.phone || '',
                email: user.email || ''
            }));

            // Auto-select default address
            const defaultAddr = addresses.find(a => a.is_default);
            if (defaultAddr && deliveryMode === 'local') {
                setFormData(prev => ({ ...prev, address: defaultAddr.address_full }));
                // We'll update map later when markers are ready
            }
        }
    }, [user, addresses, deliveryMode]);

    // Redirect if not authenticated (Auto-redirect)
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/panier&reason=checkout');
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        const loadSettings = async () => {
            const data = await getPublicSettings();
            setSettings(data);

            // Meta Pixel Tracking: InitiateCheckout
            if (data.fb_pixel_id && cart.length > 0) {
                fpixel.event('InitiateCheckout', {
                    content_ids: cart.map(i => i.id),
                    content_type: 'product',
                    value: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    currency: 'XOF',
                    num_items: cart.reduce((sum, item) => sum + item.quantity, 0)
                }, data.fb_pixel_id);
            }
        };
        loadSettings();
    }, [cart.length]);

    // Core Update Logic - simplified, no dynamic fee calculation
    const updateLocation = async (lat: number, lng: number, fromMapDrag: boolean = false) => {
        try {
            if (fromMapDrag) {
                // Reverse geocode to get address
                const results = await api.searchPlaces(`${lat},${lng}`);
                if (results && results.length > 0) {
                    const address = results[0].display_name;
                    const addressIsInAbidjan = isInAbidjanArea(address);
                    if (!addressIsInAbidjan && deliveryMode === 'local') {
                        if (markerRef.current && mapRef.current) {
                            const prevLat = location?.lat || 5.3484;
                            const prevLng = location?.lng || -4.0305;
                            markerRef.current.setLatLng([prevLat, prevLng]);
                            mapRef.current.panTo([prevLat, prevLng]);
                        }
                        alert('Cette zone n\'est pas couverte par la livraison locale. Veuillez choisir "Villes de l\'Intérieur" pour les destinations hors Abidjan.');
                        return;
                    }
                    setFormData(prev => ({ ...prev, address }));
                }
            }
            setLocation({ lat, lng });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (!isMounted || deliveryMode !== 'local') return;
        if (typeof L === 'undefined') {
            console.error("Leaflet is not loaded");
            return;
        }
        const timer = setTimeout(() => {
            try {
                if (mapContainerRef.current && !mapRef.current) {
                    const defaultLat = 5.3484;
                    const defaultLng = -4.0305;
                    const map = L.map(mapContainerRef.current, {
                        minZoom: 7,
                        maxZoom: 18
                    }).setView([defaultLat, defaultLng], 12);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(map);
                    const customIcon = L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div class="w-10 h-10 bg-black rounded-full border-4 border-white shadow-xl flex items-center justify-center"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
                        iconSize: [40, 40],
                        iconAnchor: [20, 20]
                    });
                    const marker = L.marker([defaultLat, defaultLng], {
                        icon: customIcon,
                        draggable: true
                    }).addTo(map);
                    marker.on('dragend', (e: any) => {
                        const { lat, lng } = e.target.getLatLng();
                        updateLocation(lat, lng, true);
                    });
                    map.on('click', (e: any) => {
                        const { lat, lng } = e.latlng;
                        marker.setLatLng([lat, lng]);
                        updateLocation(lat, lng, true);
                    });
                    mapRef.current = map;
                    markerRef.current = marker;
                    updateLocation(defaultLat, defaultLng);
                }
            } catch (err) {
                console.error("Map initialization error:", err);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [isMounted, deliveryMode]);

    // 4. Calculations
    const allDestinations = getAllDestinations();
    const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    // OFFRES CUMULABLES :
    // 1. Wave = -4% (toujours, quel que soit le nombre de produits)
    // 2. 2+ produits OU seuil atteint = Livraison gratuite

    const isEligibleForFreeDelivery = totalItems >= 2 || subTotal >= settings.delivery_free_threshold;
    const isWavePayment = paymentMethod === 'wave';

    // Wave discount (4%) - applies always when Wave is selected
    const waveDiscountAmount = isWavePayment ? Math.round(subTotal * 0.04 / 10) * 10 : 0;

    // Check if express delivery is available (before 15h)
    const currentHour = new Date().getHours();
    const isExpressAvailable = currentHour < 15;

    // Delivery fee calculation:
    // - Shipping mode (interior cities): 0 (customer pays transport company)
    // - Local mode with eligibility: FREE
    // - Local mode without eligibility: Standard (dynamic) or Express (dynamic + premium)
    const standardFee = settings.delivery_local_fee;
    const expressFee = Math.round(standardFee * 1.5 / 100) * 100; // 50% premium for express, rounded
    const baseDeliveryFee = deliverySpeed === 'express' ? expressFee : standardFee;
    const deliveryFee = deliveryMode === 'shipping' ? 0 : (isEligibleForFreeDelivery ? 0 : baseDeliveryFee);

    // Total = Sous-total + Livraison - Réduction Wave
    const total = Math.round(subTotal + deliveryFee - waveDiscountAmount);

    const filteredCities = citySearchQuery.length > 0
        ? allDestinations.filter(city => city.toLowerCase().includes(citySearchQuery.toLowerCase()))
        : allDestinations;

    // 5. Early Returns (MUST be after ALL hooks)
    // IMPORTANT: No hooks are allowed below this point
    if (!isMounted || !isInitialized || authLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                    <p className="text-slate-400 font-medium text-sm">Chargement...</p>
                </div>
            </div>
        );
    }



    if (!user) {
        return null; // Don't render anything while redirecting
    }

    if (cart.length === 0 && !orderPlaced) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                    <Truck className="w-10 h-10 text-slate-200" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Votre panier est vide</h2>
                <p className="text-slate-500 mb-8 text-center max-w-sm">
                    Il semble que vous n'ayez pas encore ajouté de produits à votre panier. Prolongez votre vitalité en découvrant nos solutions.
                </p>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Retour à la boutique
                </button>
            </div>
        );
    }

    // 6. Event Handlers
    const handleCitySelect = (city: string) => {
        setSelectedCity(city);
        setCitySearchQuery(city);
        setShowCitySuggestions(false);
        const companies = findCompaniesByCity(city);
        setAvailableCompanies(companies);
        setSelectedCompany(companies.length > 0 ? companies[0] : null);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setFormData({ ...formData, address: query });
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        if (query.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const results = await api.searchPlaces(query);
                const filteredResults = results.filter((place: any) => {
                    if (deliveryMode === 'local') {
                        const combinedAddress = `${place.display_name} ${place.address?.city || ''} ${place.address?.state || ''} ${place.address?.suburb || ''}`;
                        return isInAbidjanArea(combinedAddress);
                    }
                    return true;
                });
                setSuggestions(filteredResults);
                setShowSuggestions(true);
            } catch (err) {
                console.error(err);
            }
        }, 300);
    };

    const handleSuggestionClick = (place: any) => {
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        const address = place.display_name;
        setFormData({ ...formData, address });
        setShowSuggestions(false);
        if (markerRef.current && mapRef.current) {
            markerRef.current.setLatLng([lat, lon]);
            mapRef.current.setView([lat, lon], 16);
        }
        updateLocation(lat, lon);
    };

    const handleGeolocation = () => {
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const results = await api.searchPlaces(`${latitude},${longitude}`);
                if (results && results.length > 0) {
                    const address = results[0].display_name;
                    if (!isInAbidjanArea(address)) {
                        alert("Votre position actuelle semble être hors de la zone d'Abidjan. Veuillez choisir 'Villes de l'Intérieur'.");
                        return;
                    }
                }
                if (markerRef.current && mapRef.current) {
                    markerRef.current.setLatLng([latitude, longitude]);
                    mapRef.current.setView([latitude, longitude], 16);
                    updateLocation(latitude, longitude);
                }
            } catch (err) {
                console.error("Geocoding current position failed:", err);
            }
        }, (error) => {
            console.error("Geolocation error:", error);
            alert("Impossible de récupérer votre position.");
        });
    };

    const handleAddressBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentError(null);
        setValidationError(null);

        // Helper to show error and scroll to it
        const showValidationError = (message: string, inputRef?: React.RefObject<HTMLInputElement | null>) => {
            setValidationError(message);
            // Scroll to error message after a short delay to ensure it's rendered
            setTimeout(() => {
                errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            inputRef?.current?.focus();
        };

        if (!formData.name.trim()) {
            showValidationError("Veuillez entrer votre nom complet.", nameInputRef);
            return;
        }
        if (!formData.phone.trim()) {
            showValidationError("Le numéro de téléphone est obligatoire.", phoneInputRef);
            return;
        }

        // Normalize phone number: remove +225 prefix and spaces
        const normalizedPhone = formData.phone.replace(/^\+?225\s*/, '').replace(/\s/g, '');
        if (!isValidIvorianPhone(normalizedPhone)) {
            showValidationError("Veuillez entrer un numéro ivoirien valide (10 chiffres commençant par 01, 05 ou 07).", phoneInputRef);
            return;
        }
        if (deliveryMode === 'local') {
            if (!formData.address.trim() || !location) {
                showValidationError("Veuillez sélectionner votre lieu de livraison sur la carte.", addressInputRef);
                return;
            }
        } else {
            if (!selectedCity) {
                showValidationError("Veuillez sélectionner une ville de destination.");
                return;
            }
            if (availableCompanies.length > 0 && !selectedCompany && !manualCompany.trim()) {
                showValidationError("Veuillez sélectionner une compagnie de transport.");
                return;
            }
            if (availableCompanies.length === 0 && !manualCompany.trim()) {
                showValidationError("Veuillez préciser la compagnie de transport souhaitée.");
                return;
            }
        }
        setIsSubmitting(true);
        try {
            const paymentData = {
                cart,
                customer: {
                    name: formData.name,
                    phone: normalizedPhone, // Use normalized phone without +225 prefix
                    email: formData.email
                },
                delivery: {
                    address: deliveryMode === 'local' ? formData.address : `${selectedCity} (Via ${manualCompany || selectedCompany?.name})`,
                    lat: location?.lat || 0,
                    lon: location?.lng || 0,
                    fee: deliveryFee,
                    addressNote: formData.addressNote,
                    shippingCompany: deliveryMode === 'shipping' ? (manualCompany || selectedCompany?.name) : undefined,
                    shippingCity: deliveryMode === 'shipping' ? selectedCity : undefined
                },
                paymentMethod,
                deliveryMode
            };

            const response = await api.initiatePayment(paymentData);

            // If saveNewAddress is checked, add it to user's profile
            if (saveNewAddress && user && location) {
                try {
                    await api.addAddress(user.id, {
                        label: `Livraison - ${new Date().toLocaleDateString('fr-FR')}`,
                        address_full: formData.address,
                        lat: location.lat,
                        lon: location.lng,
                        is_default: addresses.length === 0
                    });
                    await refreshAddresses();
                } catch (e) {
                    console.error("Failed to save address from checkout:", e);
                }
            }

            if (paymentMethod === 'manual' || paymentMethod === 'wave') {
                router.push(`/payment/${response.orderId}`);
                onClearCart();
            } else {
                // Meta Pixel Tracking: Purchase (Cash on Delivery)
                if (settings.fb_pixel_id) {
                    fpixel.event('Purchase', {
                        content_ids: cart.map(i => i.id),
                        content_type: 'product',
                        value: total,
                        currency: 'XOF',
                        num_items: cart.reduce((sum, item) => sum + item.quantity, 0)
                    }, settings.fb_pixel_id, response.orderId);
                }
                setOrderPlaced(true);
                onClearCart();
            }
        } catch (err: any) {
            console.error(err);
            setPaymentError(err.message || "Une erreur est survenue lors de la commande.");
            setIsSubmitting(false);
        }
    };

    const handleWhatsApp = () => {
        const message = `Bonjour BIO SANTÉ, je souhaite passer une commande : \n\n${cart.map(item => `- ${item.name} x${item.quantity}`).join('\n')}\n\nTotal: ${formatCurrency(total)}`;
        const whatsappNumber = settings.contact_whatsapp.replace(/\+/g, '');
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const highlightText = (text: string, term: string) => {
        if (!term) return text;
        const parts = text.split(new RegExp(`(${term})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) => (
                    <span key={i} className={part.toLowerCase() === term.toLowerCase() ? 'bg-amber-100 text-amber-900 font-bold' : ''}>
                        {part}
                    </span>
                ))}
            </span>
        );
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                        <CheckCircle className="w-10 h-10 text-slate-900" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Commande Reçue !</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Merci <span className="text-slate-900 font-semibold">{formData.name}</span>. Nous vous contacterons au <span className="text-slate-900 font-semibold">{formData.phone}</span> pour confirmer la livraison.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={onBack}
                            className="w-full bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 group"
                        >
                            Retour à la boutique
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={handleWhatsApp}
                            className="w-full bg-white text-slate-600 px-8 py-4 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            Suivre sur WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-4 md:py-6 md:px-8">
                <div className="max-w-7xl mx-auto flex items-center gap-4 md:gap-6">
                    <button onClick={onBack} className="p-2 md:p-3 hover:bg-slate-50 rounded-full transition-colors group flex-shrink-0 border border-slate-100">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-slate-600" />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-lg md:text-2xl font-bold tracking-tight text-slate-900 truncate">Finaliser la commande</h1>
                        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-slate-900 font-bold mt-0.5 hidden sm:block">Étape finale — Paiement Sécurisé</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-slate-400">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">SSL Secure</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                    {/* Main Content */}
                    <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">

                        {/* Delivery Method Selection */}
                        <div className="bg-white/98 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-slate-400" />
                                Mode de Livraison
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setDeliveryMode('local')}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${deliveryMode === 'local'
                                        ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                        : 'border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300'
                                        }`}
                                >
                                    <MapPin className="w-6 h-6" />
                                    <span className="text-sm font-bold">Abidjan & Environs</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeliveryMode('shipping')}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${deliveryMode === 'shipping'
                                        ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                        : 'border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300'
                                        }`}
                                >
                                    <Building2 className="w-6 h-6" />
                                    <span className="text-sm font-bold">Villes de l'Intérieur</span>
                                </button>
                            </div>
                        </div>

                        {/* Local Delivery UI */}
                        {deliveryMode === 'local' && (
                            <div className="bg-white/98 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-6">
                                    {/* Saved Addresses */}
                                    {addresses.length > 0 && (
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mes adresses enregistrées</label>
                                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                                {addresses.map((addr) => (
                                                    <button
                                                        key={addr.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({ ...formData, address: addr.address_full });
                                                            if (markerRef.current && mapRef.current) {
                                                                markerRef.current.setLatLng([addr.lat, addr.lon]);
                                                                mapRef.current.setView([addr.lat, addr.lon], 16);
                                                                updateLocation(addr.lat, addr.lon);
                                                            }
                                                        }}
                                                        className={cn(
                                                            "flex-shrink-0 px-4 py-3 rounded-2xl border-2 transition-all flex items-center gap-3",
                                                            formData.address === addr.address_full
                                                                ? "border-slate-900 bg-slate-50 text-slate-900"
                                                                : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                                                        )}
                                                    >
                                                        <Home className="w-4 h-4" />
                                                        <div className="text-left">
                                                            <p className="text-xs font-black">{addr.label}</p>
                                                            <p className="text-[10px] opacity-60 font-medium truncate max-w-[100px]">{addr.address_full}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Address Input */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-900 ml-1">Lieu de livraison</label>
                                        <div className="relative group">
                                            <input
                                                ref={addressInputRef}
                                                type="text"
                                                value={formData.address}
                                                onChange={handleAddressChange}
                                                onBlur={handleAddressBlur}
                                                placeholder="Saisissez votre quartier ou repère..."
                                                className="w-full bg-slate-50 border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:ring-0 focus:border-slate-900 transition-all outline-none border-2"
                                            />
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-900 group-focus-within:text-slate-900 transition-colors" />

                                            {/* Geolocation Button */}
                                            <button
                                                type="button"
                                                onClick={handleGeolocation}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
                                                title="Ma position actuelle"
                                            >
                                                <Crosshair className="w-5 h-5" />
                                            </button>

                                            {/* Suggestions Dropdown */}
                                            {showSuggestions && suggestions.length > 0 && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                    {suggestions.map((place, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => handleSuggestionClick(place)}
                                                            className="w-full p-4 text-left hover:bg-slate-50 flex items-start gap-3 transition-colors border-b border-slate-50 last:border-0"
                                                        >
                                                            <MapPin className="w-4 h-4 text-slate-300 mt-1 flex-shrink-0" />
                                                            <div>
                                                                <p className="text-sm text-slate-900 font-medium">
                                                                    {highlightText(place.display_name, formData.address)}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Map Container */}
                                    <div className="relative rounded-2xl overflow-hidden border-2 border-slate-100 group shadow-inner bg-slate-100">
                                        <div ref={mapContainerRef} className="h-64 sm:h-80 w-full grayscale-[0.2]" />
                                        <div className="absolute top-4 left-4 right-4 pointer-events-none">
                                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/50 shadow-sm inline-flex items-center gap-2">
                                                <Info className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Déplacez le marqueur pour ajuster</span>
                                            </div>
                                        </div>
                                    </div>

                                    {user && (
                                        <div className="flex items-center gap-3 px-2 py-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <input
                                                type="checkbox"
                                                id="save-address"
                                                checked={saveNewAddress}
                                                onChange={(e) => setSaveNewAddress(e.target.checked)}
                                                className="w-5 h-5 rounded-lg border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                                            />
                                            <label htmlFor="save-address" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] cursor-pointer">
                                                Sauvegarder cette adresse dans mon profil pour plus tard
                                            </label>
                                        </div>
                                    )}

                                    {/* Delivery Speed Selection */}
                                    {!isEligibleForFreeDelivery && (
                                        <div className="bg-slate-50 rounded-2xl p-4 md:p-6 border border-slate-100 space-y-4">
                                            <div className="flex items-center gap-2 text-slate-900 text-[10px] font-bold uppercase tracking-widest">
                                                <Truck className="w-3.5 h-3.5" />
                                                Choisir la vitesse de livraison
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Standard - Next Day */}
                                                <button
                                                    type="button"
                                                    onClick={() => setDeliverySpeed('standard')}
                                                    className={`p-4 rounded-xl border-2 transition-all text-left ${deliverySpeed === 'standard'
                                                        ? 'border-slate-900 bg-slate-900 text-white'
                                                        : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <div className="text-lg font-bold">{formatCurrency(standardFee)}</div>
                                                    <div className={`text-[10px] uppercase font-bold tracking-wide ${deliverySpeed === 'standard' ? 'text-slate-300' : 'text-slate-500'}`}>
                                                        Livraison Lendemain
                                                    </div>
                                                </button>

                                                {/* Express - Same Day (if before 15h) */}
                                                <button
                                                    type="button"
                                                    onClick={() => isExpressAvailable && setDeliverySpeed('express')}
                                                    disabled={!isExpressAvailable}
                                                    className={`p-4 rounded-xl border-2 transition-all text-left ${!isExpressAvailable
                                                        ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                                                        : deliverySpeed === 'express'
                                                            ? 'border-slate-900 bg-slate-900 text-white'
                                                            : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <div className="text-lg font-bold">{formatCurrency(expressFee)}</div>
                                                    <div className={`text-[10px] uppercase font-bold tracking-wide ${!isExpressAvailable ? 'text-slate-300' : deliverySpeed === 'express' ? 'text-slate-300' : 'text-slate-500'
                                                        }`}>
                                                        Jour Même {!isExpressAvailable && '(après 15h)'}
                                                    </div>
                                                </button>
                                            </div>

                                            {!isExpressAvailable && (
                                                <p className="text-[10px] text-slate-400 italic text-center">
                                                    La livraison jour même est disponible uniquement avant 15h.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Free Delivery Message */}
                                    {isEligibleForFreeDelivery && (
                                        <div className="bg-green-50 rounded-2xl p-4 border border-green-100 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <Truck className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-green-800">Livraison Gratuite !</div>
                                                <div className="text-[10px] text-green-600 uppercase font-bold tracking-wide">
                                                    {totalItems >= 2 ? 'Offerte dès 2 produits' : `Offerte dès ${formatCurrency(settings.delivery_free_threshold)} d'achat`}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Shipping Mode UI */}
                        {deliveryMode === 'shipping' && (
                            <div className="bg-white/98 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 text-slate-900">
                                {/* City Selection */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-900 ml-1">Ville de destination</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={citySearchQuery}
                                            onChange={(e) => {
                                                setCitySearchQuery(e.target.value);
                                                setShowCitySuggestions(true);
                                                setSelectedCity('');
                                            }}
                                            onFocus={() => setShowCitySuggestions(true)}
                                            placeholder="Cherchez votre ville (ex: Bouaké, Korhogo...)"
                                            className="w-full bg-slate-50 border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:ring-0 focus:border-slate-900 transition-all outline-none border-2"
                                        />
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-900 group-focus-within:text-slate-900 transition-colors" />

                                        {showCitySuggestions && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto scrollbar-thin">
                                                {filteredCities.length > 0 ? (
                                                    filteredCities.map((city, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => handleCitySelect(city)}
                                                            className="w-full p-4 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 font-medium"
                                                        >
                                                            {highlightText(city, citySearchQuery)}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-slate-400 text-sm italic">Aucune ville trouvée</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Transport Company Selection */}
                                {selectedCity ? (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="space-y-4">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-900 ml-1">Compagnie de transport préférée</label>

                                            {availableCompanies.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {availableCompanies.map((company, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedCompany(company);
                                                                setManualCompany('');
                                                            }}
                                                            className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col gap-1 items-start group ${selectedCompany?.name === company.name
                                                                ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                                                                : 'border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-900'
                                                                }`}
                                                        >
                                                            <span className="font-bold">{company.name}</span>
                                                            <div className={`text-[10px] uppercase tracking-wider font-bold ${selectedCompany?.name === company.name ? 'text-white' : 'text-slate-900'
                                                                }`}>{company.hub_principal}</div>
                                                        </button>
                                                    ))}

                                                    {/* Other Option */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedCompany(null);
                                                            setManualCompany('');
                                                        }}
                                                        className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col gap-1 items-start ${!selectedCompany && manualCompany === ''
                                                            ? 'border-slate-900 bg-slate-900 text-white'
                                                            : 'border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-900'
                                                            }`}
                                                    >
                                                        <span className="font-extrabold">Autre compagnie</span>
                                                        <div className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Précisez votre choix</div>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                                                    <p className="text-sm text-slate-500 font-medium">Nous n'avons pas de compagnie suggérée pour cette ville.</p>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Veuillez préciser votre compagnie ci-dessous</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Manual Entry or Other selected */}
                                        {(!selectedCompany || availableCompanies.length === 0) && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={manualCompany}
                                                        onChange={(e) => setManualCompany(e.target.value)}
                                                        placeholder="Ex: AVS, Sala Transport, UTB..."
                                                        className="w-full bg-slate-50 border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:ring-0 focus:border-slate-900 transition-all outline-none border-2 font-bold"
                                                    />
                                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-900" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Info Box */}
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4">
                                            <div className="bg-white p-2.5 rounded-xl border border-slate-100 h-fit">
                                                <Info className="w-5 h-5 text-slate-400 font-bold" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">À propos des frais</p>
                                                <p className="text-sm text-slate-500 leading-relaxed font-medium">Pour l'intérieur, vous réglez les frais de colis directement auprès de la compagnie à la réception.</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-slate-400 space-y-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto border border-slate-100">
                                            <Search className="w-8 h-8 opacity-20" />
                                        </div>
                                        <p className="text-sm font-medium">En attente du choix de votre ville...</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Contact Form */}
                        <div className="bg-white/98 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <User className="w-5 h-5 text-slate-400" />
                                Informations de Contact
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-900 ml-1">Nom complet *</label>
                                    <div className="relative group">
                                        <input
                                            ref={nameInputRef}
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Jean Kouassi"
                                            className="w-full bg-slate-50 border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:ring-0 focus:border-slate-900 transition-all outline-none border-2 font-medium"
                                        />
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-900 group-focus-within:text-slate-900 transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Téléphone *</label>
                                    <div className="relative group">
                                        <input
                                            ref={phoneInputRef}
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                // Allow only digits and spaces during typing to prevent cursor jumping
                                                const raw = e.target.value;
                                                // Only allow digits for state, but keep user input for better UX during typing if they type spaces?
                                                // Actually, best to just let them type digits, and format on blur.
                                                // But to keep it simple and fix the jump:
                                                setFormData({ ...formData, phone: raw });
                                                if (validationError?.includes("téléphone") || validationError?.includes("ivoirien")) {
                                                    setValidationError(null);
                                                }
                                            }}
                                            onBlur={(e) => {
                                                // Format on blur
                                                const formatted = formatIvorianPhone(e.target.value);
                                                setFormData({ ...formData, phone: formatted });
                                            }}
                                            placeholder="07 00 00 00 00"
                                            className="w-full bg-slate-50 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-0 focus:border-slate-900 transition-all outline-none border-2 font-medium"
                                        />
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email (Optionnel)</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="jean.kouassi@email.com"
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-0 focus:border-slate-900 transition-all outline-none border-2 font-medium"
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Notes de livraison (Ex: Porte 3, Bâtiment B...)</label>
                                <textarea
                                    value={formData.addressNote}
                                    onChange={(e) => setFormData({ ...formData, addressNote: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl py-4 px-4 text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-0 focus:border-slate-900 transition-all outline-none border-2 min-h-[100px] resize-none font-medium"
                                    placeholder="Indications précises pour le livreur..."
                                />
                            </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="bg-white/98 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-slate-400" />
                                Méthode de Paiement
                            </h3>

                            <div className="space-y-3">

                                {/* Wave Payment - Recommended option */}
                                <label
                                    className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col cursor-pointer ${paymentMethod === 'wave'
                                        ? 'border-blue-600 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20'
                                        : 'border-slate-100 bg-slate-50 hover:border-blue-200 text-slate-900'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="wave"
                                        checked={paymentMethod === 'wave'}
                                        onChange={() => setPaymentMethod('wave')}
                                        className="hidden"
                                    />
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2.5 rounded-xl border transition-colors ${paymentMethod === 'wave' ? 'bg-white/20 border-white/30' : 'bg-white border-slate-100'}`}>
                                                <img src="/logos/wave.webp" alt="Wave" className="w-6 h-6 object-contain" />
                                            </div>
                                            <div>
                                                <span className="block font-bold flex items-center gap-2">
                                                    Wave
                                                    {totalItems >= 2 && (
                                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${paymentMethod === 'wave' ? 'bg-white/20 text-white' : 'bg-[#1DC1EC]/20 text-[#1DC1EC]'}`}>-4%</span>
                                                    )}
                                                </span>
                                                <span className={`text-[10px] uppercase font-bold tracking-tight opacity-80 ${paymentMethod === 'wave' ? 'text-blue-100' : 'text-slate-400'}`}>
                                                    methode recommander
                                                </span>
                                            </div>
                                        </div>
                                        {paymentMethod === 'wave' && (
                                            <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">Actif</div>
                                        )}
                                    </div>
                                </label>

                                {/* Cash on delivery - Secondary option */}
                                <label
                                    className={`group p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${deliveryMode === 'shipping'
                                        ? 'border-slate-50 bg-slate-50 text-slate-200 cursor-not-allowed'
                                        : paymentMethod === 'cash'
                                            ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                            : 'border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-900 cursor-pointer'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cash"
                                        disabled={deliveryMode === 'shipping'}
                                        checked={paymentMethod === 'cash'}
                                        onChange={() => setPaymentMethod('cash')}
                                        className="hidden"
                                    />
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl border transition-colors ${paymentMethod === 'cash' ? 'bg-white/10 border-white/20' : 'bg-white border-slate-100'}`}>
                                            <Banknote className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-white' : 'text-slate-400'}`} />
                                        </div>
                                        <div>
                                            <span className="block font-bold">Paiement à la livraison</span>
                                            <span className={`text-[10px] uppercase font-bold tracking-tight opacity-60 ${paymentMethod === 'cash' ? 'text-slate-300' : 'text-slate-400'}`}>
                                                {deliveryMode === 'shipping' ? 'Indisponible pour l\'intérieur' : 'Payez cash à la réception'}
                                            </span>
                                        </div>
                                    </div>
                                    {paymentMethod === 'cash' && deliveryMode !== 'shipping' && (
                                        <div className="bg-white text-slate-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">Actif</div>
                                    )}
                                </label>

                                {/* Manual Mobile Money - New option */}
                                <label
                                    className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col cursor-pointer ${paymentMethod === 'manual'
                                        ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                        : 'border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-900'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="manual"
                                        checked={paymentMethod === 'manual'}
                                        onChange={() => setPaymentMethod('manual')}
                                        className="hidden"
                                    />
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2.5 rounded-xl border transition-colors ${paymentMethod === 'manual' ? 'bg-white/10 border-white/20' : 'bg-white border-slate-100'}`}>
                                                <div className="flex -space-x-1.5">
                                                    <img src="/logos/mtn.png" alt="MTN" className="w-6 h-6 rounded-full border border-white object-contain bg-white" />
                                                    <img src="/logos/orange.png" alt="Orange" className="w-6 h-6 rounded-full border border-white object-contain bg-white" />
                                                    <img src="/logos/moov.jpeg" alt="Moov" className="w-6 h-6 rounded-full border border-white object-contain bg-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <span className="block font-bold">Transfert Mobile Money (Manuel)</span>
                                                <span className={`text-[10px] uppercase font-bold tracking-tight opacity-60 ${paymentMethod === 'manual' ? 'text-slate-300' : 'text-slate-400'}`}>MTN / ORANGE / MOOV</span>
                                            </div>
                                        </div>
                                        {paymentMethod === 'manual' && (
                                            <div className="bg-white text-slate-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">Actif</div>
                                        )}
                                    </div>

                                    {paymentMethod === 'manual' && (
                                        <div className="mt-6 pt-6 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
                                            {/* Wave incentive - clickable to switch */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setPaymentMethod('wave');
                                                }}
                                                className="w-full bg-[#1DC1EC]/20 p-4 rounded-2xl border border-[#1DC1EC]/30 flex items-center gap-3 hover:bg-[#1DC1EC]/30 transition-all cursor-pointer group"
                                            >
                                                <img src="/logos/wave.webp" alt="Wave" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform" />
                                                <p className="text-xs text-white font-medium text-left">
                                                    💡 Payez avec <span className="font-bold">Wave</span> et économisez <span className="font-bold text-[#1DC1EC]">4%</span> soit <span className="font-bold text-[#1DC1EC]">{formatCurrency(Math.round(subTotal * 0.04 / 10) * 10)}</span> !
                                                </p>
                                                <ArrowRight className="w-4 h-4 text-[#1DC1EC] ml-auto group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {paymentError && (
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-sm font-bold flex items-center gap-3 animate-shake">
                                    <div className="bg-white p-1.5 rounded-lg border border-slate-100">
                                        <Info className="w-4 h-4 text-slate-400" />
                                    </div>
                                    {paymentError}
                                </div>
                            )}

                            {validationError && (
                                <div ref={errorRef} className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-800 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 shadow-lg">
                                    <div className="bg-red-100 p-1.5 rounded-lg border border-red-200">
                                        <Info className="w-4 h-4 text-red-600 font-bold" />
                                    </div>
                                    {validationError}
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-5 sticky top-28 space-y-6">
                        <div className="bg-white/98 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold tracking-tight text-slate-900">Récapitulatif</h3>
                                <div className="bg-slate-50 border border-slate-100 text-slate-400 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest">{totalItems} Article{totalItems > 1 ? 's' : ''}</div>
                            </div>

                            {/* Wave Promo Banner - Always visible when 2+ items */}
                            {totalItems >= 2 && (
                                <div className={`p-4 rounded-2xl mb-6 flex items-center gap-4 transition-all ${paymentMethod === 'wave'
                                    ? 'bg-gradient-to-r from-[#1DC1EC] to-[#0BA8D0] text-white'
                                    : 'bg-gradient-to-r from-[#1DC1EC]/10 to-[#1DC1EC]/5 border border-[#1DC1EC]/30'
                                    }`}>
                                    <img src="/logos/wave.webp" alt="Wave" className="w-12 h-12 object-contain" />
                                    <div>
                                        {paymentMethod === 'wave' ? (
                                            <>
                                                <p className="text-sm font-bold">🎉 Réduction Wave activée !</p>
                                                <p className="text-xs opacity-80">-4% appliqué à votre commande</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm font-bold text-slate-900">💰 Économisez 4% avec Wave</p>
                                                <p className="text-xs text-[#1DC1EC] font-medium">Passez à Wave pour bénéficier de la réduction</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-4 group">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex-shrink-0 overflow-hidden relative">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute top-1 right-1 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-lg min-w-[20px] text-center">x{item.quantity}</div>
                                            </div>
                                            <div className="min-w-0 flex flex-col justify-center">
                                                <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">{item.name}</h4>
                                                <p className="text-slate-400 text-xs font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-slate-100 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Sous-total</span>
                                        <span className="text-slate-900 font-bold">{formatCurrency(subTotal)}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Livraison</span>
                                        <span className={deliveryFee === 0 ? "text-slate-900 font-bold" : "text-slate-900 font-bold"}>
                                            {deliveryFee === 0 ? "Gratuit" : formatCurrency(deliveryFee)}
                                        </span>
                                    </div>

                                    {waveDiscountAmount > 0 && (
                                        <div className="flex justify-between text-sm bg-[#1DC1EC]/10 p-3 rounded-xl border border-dashed border-[#1DC1EC]/30">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 bg-[#1DC1EC] rounded-full flex items-center justify-center text-white font-bold text-[8px]">W</div>
                                                <span className="text-[#1DC1EC] font-bold">Bonus Wave (4%)</span>
                                            </div>
                                            <span className="text-[#1DC1EC] font-bold">-{formatCurrency(Math.round(waveDiscountAmount / 10) * 10)}</span>
                                        </div>
                                    )}


                                    <div className="pt-6 mt-2">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Total Final</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-bold tracking-tighter text-slate-900">{formatCurrency(Math.round(total))}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 disabled:bg-slate-200 disabled:shadow-none relative group overflow-hidden"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span>Traitement...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                                            <span>Confirmer la commande</span>
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                                <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-widest">Paiement 100% sécurisé & crypté</p>
                            </div>
                        </div>

                        {/* Order Security Tag */}
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200 border-dashed flex items-center justify-center gap-4 grayscale opacity-50">
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[8px] font-bold uppercase tracking-widest">Protection Acheteur</span>
                            </div>
                            <div className="w-1 h-1 bg-slate-300 rounded-full" />
                            <div className="flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-[8px] font-bold uppercase tracking-widest">Qualité Garantie</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
