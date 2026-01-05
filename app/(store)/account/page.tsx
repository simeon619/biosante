
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import {
    Package,
    Truck,
    CheckCircle2,
    Clock,
    LogOut,
    User as UserIcon,
    Phone,
    Mail,
    ChevronRight,
    Search,
    AlertCircle,
    ShoppingBag,
    MapPin,
    Plus,
    Trash2,
    Home,
    Edit2,
    Loader2,
    Crosshair,
    Info,
    CheckCircle,
    UserCircle,
    Map,
    Building2,
    Check,
    Smartphone
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useUI } from '@/context/UIContext';
import { ShippingCompany, findCompaniesByCity, getAllDestinations, isInAbidjanArea } from '@/data/shippingCompanies';
import Script from 'next/script';

export default function AccountPage() {
    const { user, addresses, logout, loading: authLoading, refreshAddresses, updateProfile } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ORDERS_PER_PAGE = 3;
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [newAddress, setNewAddress] = useState({ label: '', address_full: '', lat: 0, lon: 0 });

    // Profile Edit State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', phone: '', email: '' });
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // OTP Phone Change State
    const [otpStep, setOtpStep] = useState<'idle' | 'requesting' | 'verifying' | 'success'>('idle');
    const [otpCode, setOtpCode] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpTimer, setOtpTimer] = useState(0);
    const [pendingNewPhone, setPendingNewPhone] = useState('');

    // Address Search State (Nominatim)
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Shipping State
    const [deliveryMode, setDeliveryMode] = useState<'local' | 'shipping'>('local');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [citySearchQuery, setCitySearchQuery] = useState<string>('');
    const [availableCompanies, setAvailableCompanies] = useState<ShippingCompany[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<ShippingCompany | null>(null);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const [manualCompany, setManualCompany] = useState('');

    // Map Refs
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const addressInputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/account');
        }

        if (user) {
            api.getOrders(user.id)
                .then(res => setOrders(res.orders))
                .catch(err => console.error('Error fetching orders:', err))
                .finally(() => setLoading(false));

            setProfileData({
                name: user.name || '',
                phone: user.phone || '',
                email: user.email || ''
            });
        }
    }, [user, authLoading, router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if phone number is being changed
        if (profileData.phone !== user?.phone) {
            // Need OTP verification for phone change
            setPendingNewPhone(profileData.phone);
            setOtpStep('requesting');
            setOtpError('');

            try {
                const result = await api.requestPhoneChangeOtp(user?.id || '', profileData.phone);
                if (result.success) {
                    setOtpStep('verifying');
                    setOtpTimer(result.expiresIn || 300);
                } else {
                    setOtpError(result.message);
                    setOtpStep('idle');
                }
            } catch (err: any) {
                setOtpError(err.response?.data?.message || 'Erreur lors de l\'envoi du code');
                setOtpStep('idle');
            }
            return;
        }

        // No phone change - update normally
        setIsUpdatingProfile(true);
        try {
            await updateProfile({ name: profileData.name, email: profileData.email });
            setIsEditingProfile(false);
        } catch (err: any) {
            console.error('Error updating profile:', err);
            alert(err.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleVerifyPhoneOtp = async () => {
        if (!otpCode || otpCode.length !== 4) {
            setOtpError('Veuillez entrer un code à 4 chiffres');
            return;
        }

        setOtpStep('requesting');
        try {
            const result = await api.verifyPhoneChangeOtp(user?.id || '', otpCode, pendingNewPhone);
            if (result.success) {
                setOtpStep('success');
                // Update local profile data
                setProfileData(prev => ({ ...prev, phone: pendingNewPhone }));
                // Also update name/email if changed
                await updateProfile({ name: profileData.name, email: profileData.email });

                setTimeout(() => {
                    setOtpStep('idle');
                    setOtpCode('');
                    setPendingNewPhone('');
                    setIsEditingProfile(false);
                    // Refresh user data
                    window.location.reload();
                }, 1500);
            } else {
                setOtpError(result.message);
                setOtpStep('verifying');
            }
        } catch (err: any) {
            setOtpError(err.response?.data?.message || 'Code invalide');
            setOtpStep('verifying');
        }
    };

    const handleCancelOtp = () => {
        setOtpStep('idle');
        setOtpCode('');
        setOtpError('');
        setPendingNewPhone('');
        setProfileData(prev => ({ ...prev, phone: user?.phone || '' }));
    };

    // Address Search Logic
    const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewAddress(prev => ({ ...prev, address_full: value }));

        if (value.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=ci&limit=5`
            );
            const data = await response.json();
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (err) {
            console.error("Geocoding error:", err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSuggestionClick = (place: any) => {
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        const addressIsInAbidjan = isInAbidjanArea(place.display_name);

        if (deliveryMode === 'local' && !addressIsInAbidjan) {
            alert('Cette zone n\'est pas couverte par la livraison locale. Veuillez choisir "Villes de l\'Intérieur" pour les destinations hors Abidjan.');
            return;
        }
        if (deliveryMode === 'shipping' && addressIsInAbidjan) {
            alert('Vous avez sélectionné une adresse à Abidjan alors que vous êtes en mode "Villes de l\'Intérieur".');
            return;
        }

        setNewAddress(prev => ({
            ...prev,
            address_full: place.display_name,
            lat,
            lon
        }));
        setShowSuggestions(false);

        if (mapRef.current) {
            mapRef.current.setView([lat, lon], 16);
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lon]);
            }
        }
    };

    const handleCitySelect = async (city: string) => {
        setSelectedCity(city);
        setCitySearchQuery(city);
        setShowCitySuggestions(false);
        const companies = findCompaniesByCity(city);
        setAvailableCompanies(companies);
        setSelectedCompany(companies.length > 0 ? companies[0] : null);

        // Geocode city to center map
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + ', Côte d\'Ivoire')}&limit=1`);
            const data = await res.json();
            if (data && data[0]) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                setNewAddress(prev => ({ ...prev, lat, lon }));
                if (mapRef.current) {
                    mapRef.current.setView([lat, lon], 12);
                    if (markerRef.current) {
                        markerRef.current.setLatLng([lat, lon]);
                    }
                }
            }
        } catch (e) { }
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

    const handleGeolocation = () => {
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                );
                const data = await response.json();
                const addressIsInAbidjan = isInAbidjanArea(data.display_name);

                if (deliveryMode === 'local' && !addressIsInAbidjan) {
                    alert('Votre position actuelle n\'est pas couverte par la livraison locale. Veuillez choisir "Villes de l\'Intérieur" pour les destinations hors Abidjan.');
                    return;
                }
                if (deliveryMode === 'shipping' && addressIsInAbidjan) {
                    alert('Votre position actuelle est à Abidjan alors que vous êtes en mode "Villes de l\'Intérieur".');
                    return;
                }

                setNewAddress(prev => ({
                    ...prev,
                    address_full: data.display_name || "Ma position",
                    lat: latitude,
                    lon: longitude
                }));
                if (mapRef.current) {
                    mapRef.current.setView([latitude, longitude], 16);
                    if (markerRef.current) {
                        markerRef.current.setLatLng([latitude, longitude]);
                    }
                }
            } catch (err) {
                console.error("Geocoding current position failed:", err);
            }
        }, (error) => {
            console.error("Geolocation error:", error);
            alert("Impossible de récupérer votre position.");
        });
    };

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const L = (window as any).L;
        if (!L) return;

        const initialLat = newAddress.lat || 5.3484;
        const initialLon = newAddress.lon || -4.0305;

        const timer = setTimeout(() => {
            try {
                if (mapRef.current) {
                    mapRef.current.remove();
                }

                mapRef.current = L.map(mapContainerRef.current, {
                    minZoom: 7,
                    maxZoom: 18
                }).setView([initialLat, initialLon], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);

                markerRef.current = L.marker([initialLat, initialLon], { draggable: true }).addTo(mapRef.current);

                markerRef.current.on('dragend', async () => {
                    const pos = markerRef.current.getLatLng();
                    setNewAddress(prev => ({ ...prev, lat: pos.lat, lon: pos.lng }));

                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`);
                        const data = await res.json();
                        setNewAddress(prev => ({ ...prev, address_full: data.display_name }));
                    } catch (e) { }
                });
            } catch (err) { }
        }, 300);

        return () => clearTimeout(timer);
    }, [showAddAddress, newAddress.lat, newAddress.lon, deliveryMode]); // Re-initialize map if deliveryMode changes

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        let finalAddress = newAddress.address_full;
        let finalLat = newAddress.lat;
        let finalLon = newAddress.lon;

        if (deliveryMode === 'shipping') {
            if (!selectedCity) {
                alert("Veuillez sélectionner une ville");
                return;
            }
            const companyName = manualCompany || selectedCompany?.name;
            if (!companyName) {
                alert("Veuillez sélectionner une compagnie de transport");
                return;
            }
            finalAddress = `${selectedCity} (Via ${companyName})`;
            finalLat = 0;
            finalLon = 0;
        } else { // local delivery
            if (!finalAddress || finalLat === 0 || finalLon === 0) {
                alert("Veuillez spécifier une adresse valide sur la carte pour Abidjan.");
                return;
            }
            if (!isInAbidjanArea(finalAddress)) {
                alert('L\'adresse sélectionnée n\'est pas dans la zone de livraison locale d\'Abidjan. Veuillez la corriger ou passer en mode "Villes de l\'Intérieur".');
                return;
            }
        }

        try {
            const addressData = {
                ...newAddress,
                address_full: finalAddress,
                lat: finalLat,
                lon: finalLon,
            };

            if (editingAddressId) {
                await api.updateAddress(user.id, editingAddressId, addressData);
            } else {
                await api.addAddress(user.id, {
                    ...addressData,
                    is_default: addresses.length === 0
                });
            }
            setNewAddress({ label: '', address_full: '', lat: 0, lon: 0 });
            setDeliveryMode('local');
            setSelectedCity('');
            setCitySearchQuery('');
            setManualCompany('');
            setShowAddAddress(false);
            setEditingAddressId(null);
            await refreshAddresses();
        } catch (err) {
            console.error('Error saving address:', err);
        }
    };

    const startEdit = (addr: any) => {
        setNewAddress({
            label: addr.label,
            address_full: addr.address_full,
            lat: addr.lat,
            lon: addr.lon
        });
        setEditingAddressId(addr.id);
        // Determine delivery mode based on address
        if (addr.lat === 0 && addr.lon === 0 && addr.address_full.includes('(Via')) {
            setDeliveryMode('shipping');
            const cityMatch = addr.address_full.match(/(.*) \(Via/);
            if (cityMatch && cityMatch[1]) {
                setSelectedCity(cityMatch[1].trim());
                setCitySearchQuery(cityMatch[1].trim());
                const companyMatch = addr.address_full.match(/Via (.*)\)/);
                if (companyMatch && companyMatch[1]) {
                    const companyName = companyMatch[1].trim();
                    const companies = findCompaniesByCity(cityMatch[1].trim());
                    const foundCompany = companies.find(c => c.name === companyName);
                    if (foundCompany) {
                        setSelectedCompany(foundCompany);
                        setManualCompany('');
                    } else {
                        setSelectedCompany(null);
                        setManualCompany(companyName);
                    }
                }
            }
        } else {
            setDeliveryMode('local');
        }
        setShowAddAddress(true);
    };

    const handleDeleteAddress = async (id: string) => {
        if (!user) return;
        try {
            await api.deleteAddress(user.id, id);
            await refreshAddresses();
        } catch (err) {
            console.error('Error deleting address:', err);
        }
    };

    const handleSetDefault = async (id: string) => {
        if (!user) return;
        try {
            await api.setDefaultAddress(user.id, id);
            await refreshAddresses();
        } catch (err) {
            console.error('Error setting default address:', err);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (authLoading || (loading && !orders.length)) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Chargement de votre compte...</p>
                </div>
            </div>
        );
    }

    const getStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return { label: 'En attente', color: 'text-amber-700 bg-amber-50', icon: Clock };
            case 'paid':
                return { label: 'Payé', color: 'text-emerald-700 bg-emerald-50', icon: CheckCircle2 };
            case 'confirmed':
                return { label: 'Confirmée', color: 'text-blue-700 bg-blue-50', icon: CheckCircle2 };
            case 'processing':
                return { label: 'En préparation', color: 'text-indigo-700 bg-indigo-50', icon: Package };
            case 'shipped':
                return { label: 'Expédiée', color: 'text-purple-700 bg-purple-50', icon: Truck };
            case 'delivered':
                return { label: 'Livrée', color: 'text-slate-700 bg-slate-50', icon: Truck };
            case 'completed':
                return { label: 'Terminée', color: 'text-green-700 bg-green-50', icon: CheckCircle2 };
            case 'cancelled':
                return { label: 'Annulée', color: 'text-rose-700 bg-rose-50', icon: AlertCircle };
            default:
                return { label: 'En attente', color: 'text-amber-700 bg-amber-50', icon: Clock };
        }
    };


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                <Script
                    src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
                    onLoad={() => {
                        // Trigger a state change or similar if needed to re-init map
                        // But since we use useLayoutEffect or similar, it might be fine
                    }}
                />
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />

                {/* Sidebar / Profile Info */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl p-5 border border-slate-100">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">{user?.name}</h2>
                                    <p className="text-xs text-slate-400">{user?.phone}</p>
                                </div>
                            </div>
                            {!isEditingProfile && (
                                <button
                                    onClick={() => setIsEditingProfile(true)}
                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {isEditingProfile ? (
                            <>
                                {/* OTP Modal */}
                                {(otpStep === 'verifying' || otpStep === 'requesting' || otpStep === 'success') && (
                                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                                            {otpStep === 'success' ? (
                                                <div className="text-center py-4">
                                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Check className="w-8 h-8 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900">Numéro mis à jour !</h3>
                                                    <p className="text-sm text-slate-500 mt-1">Un SMS de confirmation a été envoyé au nouveau numéro.</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="text-center mb-6">
                                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                            <Smartphone className="w-6 h-6 text-slate-600" />
                                                        </div>
                                                        <h3 className="text-lg font-bold text-slate-900">Vérification du nouveau numéro</h3>
                                                        <p className="text-sm text-slate-500 mt-1">
                                                            Un code a été envoyé au<br />
                                                            <span className="font-medium text-slate-700">{pendingNewPhone}</span>
                                                        </p>
                                                    </div>

                                                    <div className="mb-4">
                                                        <label className="text-xs font-medium text-slate-500 mb-2 block text-center">Code à 4 chiffres</label>
                                                        <input
                                                            type="text"
                                                            maxLength={4}
                                                            value={otpCode}
                                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                                            className="w-full text-center text-2xl tracking-[0.5em] font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:outline-none focus:border-slate-400"
                                                            placeholder="• • • •"
                                                            autoFocus
                                                        />
                                                    </div>

                                                    {otpError && (
                                                        <p className="text-center text-sm text-red-500 mb-4">{otpError}</p>
                                                    )}

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleCancelOtp}
                                                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50"
                                                        >
                                                            Annuler
                                                        </button>
                                                        <button
                                                            onClick={handleVerifyPhoneOtp}
                                                            disabled={otpStep === 'requesting' || otpCode.length !== 4}
                                                            className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                                                        >
                                                            {otpStep === 'requesting' ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Vérifier'}
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleUpdateProfile} className="space-y-3">
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Nom</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-slate-400 focus:outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">
                                            Téléphone
                                            {profileData.phone !== user?.phone && (
                                                <span className="ml-2 text-amber-600 text-xs">(🔐 OTP requis)</span>
                                            )}
                                        </label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-slate-400 focus:outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-slate-400 focus:outline-none transition-all"
                                            placeholder="Optionnel"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <button
                                            type="submit"
                                            disabled={isUpdatingProfile || otpStep !== 'idle'}
                                            className="flex-1 bg-slate-900 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-slate-800 disabled:opacity-50 transition-all"
                                        >
                                            {isUpdatingProfile || otpStep === 'requesting' ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Enregistrer'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingProfile(false)}
                                            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-all"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                {user?.email && (
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span>{user.email}</span>
                                    </div>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-rose-500 text-sm font-medium hover:text-rose-600 transition-colors w-full"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Déconnexion
                                </button>
                            </>
                        )}
                    </div>

                    {/* Addresses Section */}
                    <div className="bg-white rounded-xl p-5 border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-slate-900">Adresses de livraison</h3>
                            <button
                                onClick={() => {
                                    setEditingAddressId(null);
                                    setNewAddress({ label: '', address_full: '', lat: 5.3484, lon: -4.0305 });
                                    setDeliveryMode('local');
                                    setSelectedCity('');
                                    setCitySearchQuery('');
                                    setManualCompany('');
                                    setShowAddAddress(!showAddAddress);
                                }}
                                className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {showAddAddress && (
                            <form onSubmit={handleAddAddress} className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 mb-1 block">Libellé</label>
                                    <input
                                        type="text"
                                        placeholder="Bureau, Domicile..."
                                        required
                                        value={newAddress.label}
                                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                                    />
                                </div>

                                {/* Delivery Mode Toggle */}
                                <div className="grid grid-cols-2 gap-2 p-1 bg-white border-2 border-slate-100 rounded-2xl">
                                    <button
                                        type="button"
                                        onClick={() => setDeliveryMode('local')}
                                        className={cn(
                                            "flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            deliveryMode === 'local' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
                                        )}
                                    >
                                        <MapPin className="w-3 h-3" />
                                        Abidjan & Environs
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDeliveryMode('shipping')}
                                        className={cn(
                                            "flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            deliveryMode === 'shipping' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
                                        )}
                                    >
                                        <Building2 className="w-3 h-3" />
                                        Villes de l'Intérieur
                                    </button>
                                </div>

                                {deliveryMode === 'local' ? (
                                    <>
                                        <div className="space-y-1 relative">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Adresse Complète (Abidjan)</label>
                                            <div className="relative group">
                                                <input
                                                    ref={addressInputRef}
                                                    type="text"
                                                    placeholder="Saisissez votre quartier..."
                                                    required={deliveryMode === 'local'}
                                                    value={newAddress.address_full}
                                                    onChange={handleAddressChange}
                                                    className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 pl-10 text-sm focus:border-slate-900 outline-none font-bold pr-12"
                                                />
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />

                                                <button
                                                    type="button"
                                                    onClick={handleGeolocation}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-all"
                                                >
                                                    <Crosshair className="w-4 h-4" />
                                                </button>

                                                {showSuggestions && suggestions.length > 0 && (
                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-100 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                        {suggestions.map((place, idx) => (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() => handleSuggestionClick(place)}
                                                                className="w-full p-4 text-left hover:bg-slate-50 flex items-start gap-3 transition-colors border-b border-slate-50 last:border-0"
                                                            >
                                                                <MapPin className="w-4 h-4 text-slate-200 mt-1 flex-shrink-0" />
                                                                <p className="text-xs text-slate-600 font-bold">{place.display_name}</p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ville de destination</label>
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
                                                    className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 pl-10 text-sm focus:border-slate-900 outline-none font-bold"
                                                />
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />

                                                {showCitySuggestions && (
                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-100 rounded-2xl shadow-2xl z-[60] max-h-60 overflow-y-auto overflow-x-hidden">
                                                        {getAllDestinations()
                                                            .filter(city => city.toLowerCase().includes(citySearchQuery.toLowerCase()))
                                                            .map((city, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    type="button"
                                                                    onClick={() => handleCitySelect(city)}
                                                                    className="w-full p-4 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 font-bold text-xs text-slate-600"
                                                                >
                                                                    {highlightText(city, citySearchQuery)}
                                                                </button>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {selectedCity && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Compagnie de transport</label>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {availableCompanies.map((company, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedCompany(company);
                                                                setManualCompany('');
                                                            }}
                                                            className={cn(
                                                                "p-3 rounded-xl border-2 text-left transition-all",
                                                                selectedCompany?.name === company.name
                                                                    ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                                                                    : "border-slate-100 bg-white hover:border-slate-200 text-slate-900"
                                                            )}
                                                        >
                                                            <div className="font-bold text-xs">{company.name}</div>
                                                            <div className={cn("text-[8px] uppercase tracking-wider font-bold", selectedCompany?.name === company.name ? "text-white/60" : "text-slate-400")}>{company.hub_principal}</div>
                                                        </button>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedCompany(null);
                                                            setManualCompany('');
                                                        }}
                                                        className={cn(
                                                            "p-3 rounded-xl border-2 text-left transition-all",
                                                            !selectedCompany && !manualCompany
                                                                ? "border-slate-900 bg-slate-900 text-white"
                                                                : "border-slate-100 bg-white hover:border-slate-200 text-slate-900"
                                                        )}
                                                    >
                                                        <div className="font-bold text-xs">Autre compagnie</div>
                                                    </button>
                                                </div>

                                                {(!selectedCompany || availableCompanies.length === 0) && (
                                                    <input
                                                        type="text"
                                                        value={manualCompany}
                                                        onChange={(e) => setManualCompany(e.target.value)}
                                                        placeholder="Nom de la compagnie..."
                                                        className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-slate-900 outline-none font-bold"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-100 h-48 bg-slate-200">
                                    <div ref={mapContainerRef} className="h-full w-full" />
                                    <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
                                        <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm inline-flex items-center gap-2">
                                            <Map className="w-3 h-3 text-slate-400" />
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Déplacez le marqueur pour préciser</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button type="submit" className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                                        {editingAddressId ? 'Modifier' : 'Enregistrer'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddAddress(false);
                                            setEditingAddressId(null);
                                            setNewAddress({ label: '', address_full: '', lat: 0, lon: 0 });
                                            setDeliveryMode('local');
                                            setSelectedCity('');
                                            setManualCompany('');
                                        }}
                                        className="px-6 py-3 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-4">
                            {addresses.length === 0 ? (
                                <div className="text-center py-12 px-6 border-2 border-dashed border-slate-100 rounded-3xl">
                                    <Map className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Aucune adresse enregistrée</p>
                                </div>
                            ) : (
                                addresses.map((addr) => (
                                    <div key={addr.id} className="group relative bg-slate-50 hover:bg-white p-5 rounded-[2rem] border-2 border-transparent hover:border-slate-100 transition-all duration-300">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                                    addr.is_default ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" : "bg-white text-slate-400 border-2 border-slate-100"
                                                )}>
                                                    <Home className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-slate-900">{addr.label}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold truncate max-w-[150px] uppercase tracking-tighter">{addr.address_full}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => startEdit(addr)}
                                                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        {!addr.is_default && (
                                            <button
                                                onClick={() => handleSetDefault(addr.id)}
                                                className="mt-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors"
                                            >
                                                Définir par défaut
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">Mes Commandes</h2>
                        <span className="text-xs font-medium text-slate-400">{orders.length} commande{orders.length > 1 ? 's' : ''}</span>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 sm:p-12 text-center border border-slate-100">
                            <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune commande</h3>
                            <p className="text-slate-400 text-sm mb-6">Vous n'avez pas encore passé de commande.</p>
                            <Link href="/" className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors">
                                Découvrir nos produits
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Orders List */}
                            <div className="space-y-4">
                                {orders
                                    .slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE)
                                    .map((order) => {
                                        const { label, color, icon: Icon } = getStatusInfo(order.status);
                                        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

                                        return (
                                            <Link
                                                key={order.id}
                                                href={`/payment/${order.id}`}
                                                className="block bg-white rounded-xl p-4 sm:p-5 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all group"
                                            >
                                                {/* Order Header */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-medium text-slate-500">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1", color)}>
                                                                <Icon className="w-3 h-3" />
                                                                {label}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-400">
                                                            {format(new Date(order.created_at), "d MMM yyyy, HH:mm", { locale: fr })}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-slate-900">{formatCurrency(Number(order.total))}</p>
                                                    </div>
                                                </div>

                                                {/* Products */}
                                                <div className="bg-slate-50 rounded-lg p-3 mb-3">
                                                    <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Produits</p>
                                                    <div className="space-y-1">
                                                        {items?.slice(0, 3).map((item: any, idx: number) => (
                                                            <div key={idx} className="flex items-center justify-between text-sm">
                                                                <span className="text-slate-700 font-medium truncate flex-1">{item.name}</span>
                                                                <span className="text-slate-500 ml-2">×{item.quantity}</span>
                                                            </div>
                                                        ))}
                                                        {items?.length > 3 && (
                                                            <p className="text-xs text-slate-400 mt-1">+{items.length - 3} autre{items.length - 3 > 1 ? 's' : ''}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="truncate max-w-[180px]">{order.address_full}</span>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                                                </div>
                                            </Link>
                                        );
                                    })}
                            </div>

                            {/* Pagination */}
                            {orders.length > ORDERS_PER_PAGE && (
                                <div className="flex items-center justify-center gap-2 pt-4">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        Précédent
                                    </button>
                                    <span className="px-3 py-2 text-sm font-medium text-slate-500">
                                        {currentPage} / {Math.ceil(orders.length / ORDERS_PER_PAGE)}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(orders.length / ORDERS_PER_PAGE), p + 1))}
                                        disabled={currentPage >= Math.ceil(orders.length / ORDERS_PER_PAGE)}
                                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        Suivant
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
