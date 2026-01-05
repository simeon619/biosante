'use client';

import React, { useState, useEffect } from 'react';

import { ShoppingCart, Menu, X, HeartPulse, Home, Package, Info, Mail, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const { user } = useAuth();

  const navItems = [
    { label: 'Accueil', href: '/', icon: Home },
    { label: 'Nos Produits', href: '/produits', icon: Package },
    { label: 'Assistance', href: '/assistance', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-[1100] bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center cursor-pointer group">
            <div className="bg-black text-white p-2.5 rounded-xl mr-3 group-hover:rotate-12 transition-transform duration-300">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-black">
                BIO <span className="text-black/40">SANTÉ</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-semibold">Science & Nature</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isActive
                    ? 'bg-black text-white shadow-lg shadow-black/10'
                    : 'text-black/50 hover:text-black hover:bg-black/5'
                    }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-black/30'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Cart & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <Link
              href={user ? "/account" : "/login"}
              className="p-3 text-black rounded-full hover:bg-black/5 transition-colors group"
              aria-label="Mon compte"
            >
              <UserIcon className={cn("h-5 w-5 group-hover:scale-110 transition-transform", user && "text-indigo-600")} />
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 text-black rounded-full hover:bg-black/5 transition-colors group"
              aria-label="Panier"
            >
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-3 text-black rounded-full hover:bg-black/5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-black/5 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 w-full px-4 py-4 rounded-xl text-base font-bold transition-all ${isActive
                    ? 'bg-black text-white'
                    : 'text-black/60 hover:bg-black/5 hover:text-black'
                    }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-black/20'}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};