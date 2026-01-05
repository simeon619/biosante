'use client';

import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { getPublicSettings, PublicSettings, defaultSettings, formatPhoneDisplay } from '@/services/settings';
import { useEffect, useState } from 'react';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getPublicSettings();
      setSettings(data);
    };
    loadSettings();
  }, []);

  return (
    <footer className="bg-black text-white border-t border-white/10 pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <h3 className="text-white text-xl font-bold tracking-tight">BIO SANTÉ</h3>
            <p className="text-sm text-white/70 leading-relaxed font-light">
              Pionniers dans l'élaboration de solutions phytothérapeutiques validées cliniquement.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors opacity-70 hover:opacity-100"><Facebook size={20} strokeWidth={1.5} /></a>
              <a href="#" className="hover:text-white transition-colors opacity-70 hover:opacity-100"><Instagram size={20} strokeWidth={1.5} /></a>
              <a href="#" className="hover:text-white transition-colors opacity-70 hover:opacity-100"><Twitter size={20} strokeWidth={1.5} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-mono text-xs uppercase tracking-widest mb-6 opacity-60">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button className="hover:text-white hover:translate-x-1 transition-all">Accueil</button></li>
              <li><button className="hover:text-white hover:translate-x-1 transition-all">Protocoles</button></li>
              <li><button className="hover:text-white hover:translate-x-1 transition-all">La Science</button></li>
              <li><button className="hover:text-white hover:translate-x-1 transition-all">Journal</button></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-mono text-xs uppercase tracking-widest mb-6 opacity-60">Légal</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button className="hover:text-white hover:translate-x-1 transition-all">Mentions Légales</button></li>
              <li><button className="hover:text-white hover:translate-x-1 transition-all">Confidentialité</button></li>
              <li><button className="hover:text-white hover:translate-x-1 transition-all">Conditions</button></li>
            </ul>
          </div>

          {/* Assistance */}
          <div>
            <h4 className="text-white font-mono text-xs uppercase tracking-widest mb-6 opacity-60">Assistance</h4>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex items-center group cursor-pointer">
                <Phone size={16} className="mr-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="group-hover:text-white transition-colors">{formatPhoneDisplay(settings.contact_customer_service)}</span>
              </li>
              <li className="flex items-center group cursor-pointer">
                <Mail size={16} className="mr-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="group-hover:text-white transition-colors">{settings.contact_email}</span>
              </li>
              <li className="flex items-start opacity-70">
                <MapPin size={16} className="mr-3 mt-1" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 font-mono uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} BIO SANTÉ.</p>
          <p className="mt-2 md:mt-0">Science & Nature</p>
        </div>
      </div>
    </footer>
  );
};