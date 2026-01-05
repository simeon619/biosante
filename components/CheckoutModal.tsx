import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin, Phone, User, CheckCircle, Loader2 } from 'lucide-react';
import { CartItem, DeliveryEstimate } from '../types';
import { api } from '../services/api';
import { getPublicSettings, PublicSettings, defaultSettings } from '../services/settings';
import Script from 'next/script';

// Declare Leaflet global type
declare const L: any;

import { formatCurrency } from '@/lib/utils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  initialEstimate?: DeliveryEstimate;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cart, initialEstimate }) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', addressNote: '' });
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings);

  // Calculate totals
  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Logic: 
  // >= 2 items OR subtotal reached: Free Delivery + some discount
  const isEligibleForOffer = totalItems >= 2 || subTotal >= settings.delivery_free_threshold;

  // Use estimate fee if available (and not free due to offer), else default
  // But if offer is active (>= 2 items), fee is 0 anyway.
  let deliveryFee = isEligibleForOffer ? 0 : settings.delivery_local_fee;
  if (!isEligibleForOffer && initialEstimate) {
    deliveryFee = initialEstimate.fee;
  }

  const discountAmount = isEligibleForOffer ? subTotal * 0.05 : 0;
  const total = subTotal + deliveryFee - discountAmount;

  useEffect(() => {
    if (isOpen && mapContainerRef.current && !mapRef.current) {
      // Initialize map centered on Abidjan or Estimated Location
      const defaultLat = initialEstimate ? initialEstimate.destination.lat : 5.3484;
      const defaultLng = initialEstimate ? initialEstimate.destination.lon : -4.0305;

      const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Custom icon for marker
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });

      const marker = L.marker([defaultLat, defaultLng], { draggable: true, icon }).addTo(map);
      markerRef.current = marker;
      setLocation({ lat: defaultLat, lng: defaultLng });

      // Update location on drag
      marker.on('dragend', function (event: any) {
        const position = marker.getLatLng();
        setLocation(position);
      });

      // Update location on map click
      map.on('click', function (e: any) {
        marker.setLatLng(e.latlng);
        setLocation(e.latlng);
      });

      mapRef.current = map;

      // Invalidating size helps if map renders partially gray
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    } else if (isOpen && mapRef.current && initialEstimate) {
      // Update view if map already exists and we have new estimate
      const lat = initialEstimate.destination.lat;
      const lng = initialEstimate.destination.lon;
      mapRef.current.setView([lat, lng], 13);
      markerRef.current.setLatLng([lat, lng]);
      setLocation({ lat, lng });
    }
  }, [isOpen, initialEstimate]);

  useEffect(() => {
    if (isOpen) {
      const loadSettings = async () => {
        const data = await getPublicSettings();
        setSettings(data);
      };
      loadSettings();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !location) {
      alert("Veuillez remplir tous les champs et vérifier votre position sur la carte.");
      return;
    }

    setIsSubmitting(true);

    // Create random order ID
    const orderId = 'CMD-' + Math.floor(Math.random() * 100000);

    try {
      // Create delivery in backend
      await api.createDelivery({
        orderId,
        address: formData.addressNote || (initialEstimate ? initialEstimate.destination.address : "Map Location"),
        lat: location.lat,
        lon: location.lng,
        fee: deliveryFee,
        customerName: formData.name,
        customerPhone: formData.phone
      });

      setOrderPlaced(true);
    } catch (error) {
      alert("Une erreur est survenue lors de la création de la commande. Veuillez réessayer.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    // Construct message
    let message = `*Nouvelle Commande BIO SANTÉ*\n\n`;
    message += `*Client:* ${formData.name}\n`;
    message += `*Tel:* ${formData.phone}\n`;
    if (formData.addressNote) message += `*Note adresse:* ${formData.addressNote}\n`;
    message += `*Localisation:* https://maps.google.com/?q=${location?.lat},${location?.lng}\n\n`;
    message += `*Commande:*\n`;
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (${item.price}F)\n`;
    });

    message += `\n*Sous-total:* ${formatCurrency(subTotal)}`;
    message += `\n*Livraison:* ${deliveryFee === 0 ? 'Gratuite' : formatCurrency(deliveryFee)}`;
    if (discountAmount > 0) message += `\n*Réduction (5%):* -${formatCurrency(discountAmount)}`;
    message += `\n*Total à payer: ${formatCurrency(total)}*`;

    const url = `https://wa.me/${settings.contact_whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto">
      <Script
        src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        onLoad={() => { }}
      />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          {orderPlaced ? (
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande Reçue !</h2>
              <p className="text-gray-500 mb-8 max-w-md">
                Merci {formData.name}. Votre commande a été enregistrée avec succès.
                Nous allons vous contacter au <strong>{formData.phone}</strong> pour confirmer la livraison.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Fermer
                </button>
                <button
                  onClick={handleWhatsAppOrder}
                  className="px-6 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] font-medium"
                >
                  Envoyer sur WhatsApp
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-[90vh] sm:h-auto">
              {/* Header */}
              <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Finaliser la Commande</h3>
                <button onClick={onClose} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between font-bold text-gray-900 mb-2">
                    <span>Total à payer</span>
                    <span className="text-primary-600">{formatCurrency(total)}</span>
                  </div>
                  {isEligibleForOffer ? (
                    <div className="space-y-1">
                      <p className="text-xs text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Livraison Gratuite activée</p>
                      <p className="text-xs text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Réduction de 5% appliquée</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Livraison estimated : {formatCurrency(deliveryFee)}
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          required
                          className="pl-10 block w-full border-gray-300 rounded-lg border p-2.5 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Votre Nom"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          required
                          className="pl-10 block w-full border-gray-300 rounded-lg border p-2.5 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="+225..."
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location Map */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lieu de livraison <span className="text-red-500">*</span>
                      <span className="text-xs font-normal text-gray-500 ml-2">(Cliquez sur la carte pour définir votre position exacte)</span>
                    </label>
                    <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-300 relative z-0">
                      <div ref={mapContainerRef} className="w-full h-full"></div>
                      {/* Center Indicator overlay if needed, using Marker instead */}
                    </div>
                    <div className="mt-2">
                      <input
                        type="text"
                        className="block w-full border-gray-300 rounded-lg border p-2.5 text-sm"
                        placeholder="Note supplémentaire (ex: Derrière la pharmacie X, Porte bleue...)"
                        value={formData.addressNote}
                        onChange={e => setFormData({ ...formData, addressNote: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : 'Confirmer la Commande'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};