'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PublicSettings, getPublicSettings, defaultSettings } from '@/services/settings';

interface SettingsContextType {
    settings: PublicSettings;
    isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    isLoaded: false
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<PublicSettings>(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function loadSettings() {
            try {
                const fetched = await getPublicSettings();
                setSettings(fetched);
            } catch (error) {
                console.error('Failed to load settings in context:', error);
            } finally {
                setIsLoaded(true);
            }
        }
        loadSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, isLoaded }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
