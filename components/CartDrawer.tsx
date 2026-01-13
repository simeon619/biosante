'use client';

import React, { useEffect, useState } from 'react';
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight, Truck, Star, Zap, CheckCircle2, Gift, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { getPublicSettings, PublicSettings, defaultSettings } from '@/services/settings';
import { formatCurrency } from '@/lib/utils';

export const CartDrawer: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, setIsCartOpen, isCartOpen } = useCart();
  const router = useRouter();
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      setIsVisible(true);
      const loadSettings = async () => {
        const data = await getPublicSettings();
        setSettings(data);
      };
      loadSettings();
    } else {
      setIsVisible(false);
    }
  }, [isCartOpen]);

  const onClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsCartOpen(false), 300);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/panier');
  };

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Quest Logic
  const isFreeDelivery = totalItems >= 2 || subTotal >= settings.delivery_free_threshold;
  const isWaveEligible = true; // Wave discount is always an option at checkout

  // Progress percentage calculation
  // Quest 1: Items > 0 (always 100% if in cart)
  // Quest 2: Free Delivery (2 products or threshold)
  // Quest 3: Wave Discount (final goal)

  const getProgress = () => {
    if (cart.length === 0) return 0;

    let progress = 0;
    if (isFreeDelivery) {
      progress = 50;
    } else {
      // Progress to free delivery (0 to 50%)
      const itemProgress = Math.min(totalItems / 2, 1) * 25;
      const priceProgress = Math.min(subTotal / settings.delivery_free_threshold, 1) * 25;
      progress = Math.max(itemProgress, priceProgress);
    }

    // Progress to Wave (50 to 100%)
    if (isFreeDelivery) {
      progress = 100;
    }

    return progress;
  };

  const progress = getProgress();

  if (!isCartOpen) return null;

  return (
    <div className={`fixed inset-0 z-[9999] overflow-hidden transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      <div className={`absolute inset-y-0 right-0 max-w-md w-full flex transition-transform duration-500 ease-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="w-full h-full flex flex-col bg-white shadow-2xl overflow-hidden relative">

          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <div className="bg-black text-white p-2 rounded-xl shadow-lg shadow-black/10">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Mon Panier</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{totalItems} PRODUIT{totalItems > 1 ? 'S' : ''}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 p-2.5 rounded-full hover:bg-gray-100 transition-all active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quest Progression System */}
          {cart.length > 0 && (
            <div className="px-8 py-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Quêtes de Vitalité
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                  Progression {Math.round(progress)}%
                </span>
              </div>

              <div className="relative h-2.5 w-full bg-gray-200 rounded-full overflow-hidden mb-6 shadow-inner">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-2 group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${isFreeDelivery ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-gray-200 text-gray-400'}`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-black uppercase text-center leading-tight transition-colors ${isFreeDelivery ? 'text-gray-900' : 'text-gray-400'}`}>
                    Privilège<br />Livraison Offerte
                  </span>
                </div>

                <div className="flex flex-col items-center gap-2 group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${progress >= 100 ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white border-gray-200 text-gray-400'}`}>
                    <Zap className={`w-4 h-4 ${progress >= 100 ? 'fill-white' : ''}`} />
                  </div>
                  <span className={`text-[9px] font-black uppercase text-center leading-tight transition-colors ${progress >= 100 ? 'text-amber-600' : 'text-gray-400'}`}>
                    Économe<br />-4% Wave
                  </span>
                </div>
              </div>

              {!isFreeDelivery && (
                <div className="mt-6 flex items-center gap-3 bg-amber-50/50 border border-amber-100 p-3 rounded-2xl animate-in slide-in-from-bottom-2">
                  <div className="bg-amber-100 p-2 rounded-xl">
                    <Gift className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-[10px] font-bold text-amber-800 leading-snug">
                    Plus que <span className="text-amber-600 underline text-xs">{formatCurrency(Math.max(0, settings.delivery_free_threshold - subTotal))}</span> ou <span className="text-amber-600 underline text-xs">{(2 - totalItems) > 0 ? (2 - totalItems) : 0} produit</span> pour débloquer la <span className="uppercase text-amber-900 font-black tracking-tighter">Livraison Gratuite !</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white custom-scrollbar z-0">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100 animate-pulse">
                  <ShoppingBag className="w-16 h-16 text-gray-200" />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Votre vitalité attend</h3>
                <p className="text-gray-400 text-sm max-w-[200px] mb-8 font-medium italic">Commencez votre voyage santé en ajoutant des produits.</p>
                <button
                  onClick={onClose}
                  className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-black/10 hover:scale-105 transition-all"
                >
                  Découvrir nos produits
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex gap-5 p-4 bg-white border-2 border-gray-50 rounded-[2rem] shadow-sm hover:shadow-md hover:border-black/5 transition-all group animate-in fade-in slide-in-from-right-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="h-24 w-24 flex-shrink-0 relative">
                      <div className="absolute inset-0 bg-black/5 rounded-2xl group-hover:scale-95 transition-transform"></div>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover rounded-2xl shadow-sm group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-black text-gray-900 group-hover:text-amber-600 transition-colors">{item.name}</h3>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.1em] mt-0.5">{item.category}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-black text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm font-black text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 bg-white p-8 space-y-4 shadow-[0_-20px_50px_rgba(0,0,0,0.02)] z-10">
              <div className="space-y-3 px-2">
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <p>Sous-total</p>
                  <p className="text-gray-900">{formatCurrency(subTotal)}</p>
                </div>

                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-gray-300" />
                    <p>Expédition</p>
                  </div>
                  <p className={isFreeDelivery ? 'text-green-600' : 'text-gray-900 font-black'}>
                    {isFreeDelivery ? 'Offert' : formatCurrency(settings.delivery_local_fee)}
                  </p>
                </div>

                <div className="pt-4 flex justify-between items-baseline">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Final</h4>
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">
                      {formatCurrency(subTotal + (isFreeDelivery ? 0 : settings.delivery_local_fee))}
                    </p>
                  </div>
                  {isFreeDelivery && (
                    <div className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-sm">
                      Économie !
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="group w-full relative h-16 bg-black text-white rounded-2xl font-black uppercase text-sm tracking-[0.2em] overflow-hidden transition-all active:scale-95 shadow-2xl shadow-black/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 translate-y-16 group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <span>Passer à la Caisse</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <p className="text-[9px] text-center text-gray-400 uppercase font-black tracking-widest flex items-center justify-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                Paiement 100% sécurisé et livraison garantie
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -20px 0; }
          100% { background-position: 20px 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e5e5e5;
        }
      `}</style>
    </div>
  );
};