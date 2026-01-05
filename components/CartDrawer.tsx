'use client';

import React from 'react';
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { getPublicSettings, PublicSettings, defaultSettings } from '@/services/settings';
import { useEffect, useState } from 'react';

import { formatCurrency } from '@/lib/utils';

export const CartDrawer: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, setIsCartOpen, isCartOpen, clearCart } = useCart();
  const router = useRouter();
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getPublicSettings();
      setSettings(data);
    };
    loadSettings();
  }, [isCartOpen]);

  const onClose = () => setIsCartOpen(false);

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/panier');
  };

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Logic: 
  // If items >= 2 OR subtotal reached: Free Delivery
  // If not: Delivery from settings
  // Note: 4% Wave discount is applied at payment, not in cart
  const isEligibleForFreeDelivery = totalItems >= 2 || subTotal >= settings.delivery_free_threshold;

  const deliveryFee = isEligibleForFreeDelivery ? 0 : settings.delivery_local_fee;

  const total = subTotal + deliveryFee;

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-md w-full flex pl-10">
        <div className="w-full h-full flex flex-col bg-white shadow-2xl animate-slide-in-right">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center text-gray-800">
              <ShoppingBag className="w-5 h-5 mr-2" />
              <h2 className="text-lg font-bold">Mon Panier ({totalItems})</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">Votre panier est vide</p>
                <button
                  onClick={onClose}
                  className="mt-4 text-primary-600 font-medium hover:underline"
                >
                  Continuer vos achats
                </button>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                          <p className="text-sm font-bold text-gray-900 ml-2">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 px-2 text-gray-600 hover:bg-gray-50 rounded-l-lg disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-sm font-medium text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 px-2 text-gray-600 hover:bg-gray-50 rounded-r-lg"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Offers Summary */}
                <div className="space-y-2">
                  {/* Free Delivery Progress */}
                  {!isEligibleForFreeDelivery ? (
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-center gap-3 text-sm text-amber-700">
                      <Truck className="w-4 h-4 flex-shrink-0" />
                      <p>Livraison <strong>{formatCurrency(settings.delivery_local_fee)}</strong> (Offerte dès 2 produits ou {formatCurrency(settings.delivery_free_threshold)})</p>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-100 p-3 rounded-lg flex items-center gap-3 text-sm text-green-700">
                      <Truck className="w-4 h-4 flex-shrink-0" />
                      <p>✓ <strong>Livraison Gratuite</strong> activée !</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <p>Sous-total</p>
                <p>{formatCurrency(subTotal)}</p>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <p className="flex items-center"><Truck className="w-4 h-4 mr-1" /> Livraison</p>
                <p>{deliveryFee === 0 ? 'Offerte' : `${formatCurrency(deliveryFee)}`}</p>
              </div>



              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <p>Total</p>
                <p>{formatCurrency(total)}</p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  handleCheckout();
                }}
                className="w-full flex items-center justify-center rounded-xl border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 transition-colors mt-4"
              >
                Commander
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};