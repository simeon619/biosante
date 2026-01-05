'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type BgColor = 'neutral' | 'red' | 'green';

interface UIContextType {
    activeColor: BgColor;
    setActiveColor: (color: BgColor) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeColor, setActiveColor] = useState<BgColor>('neutral');

    return (
        <UIContext.Provider value={{ activeColor, setActiveColor }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
