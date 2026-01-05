'use client';

import React from 'react';
import { useUI } from '@/context/UIContext';

export const GlobalBackground: React.FC = () => {
    const { activeColor } = useUI();

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

            {/* Contextual Color Blooms */}
            <div className={`absolute top-[20%] right-[-10%] w-[800px] h-[800px] rounded-full transition-bg-bloom blur-[120px] 
                ${activeColor === 'red' ? 'bg-bloom-red opacity-100 scale-110' :
                    activeColor === 'green' ? 'bg-bloom-green opacity-100 scale-110' :
                        'opacity-0 scale-90'}`} />

            <div className={`absolute bottom-[10%] left-[-10%] w-[700px] h-[700px] rounded-full transition-bg-bloom blur-[100px] 
                ${activeColor === 'red' ? 'bg-bloom-red opacity-60 scale-100' :
                    activeColor === 'green' ? 'bg-bloom-green opacity-60 scale-100' :
                        'opacity-0 scale-90'}`} />

            {/* Animated Background Circles - Fixed position to follow scroll */}
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] border border-black/5 rounded-full animate-slow-spin"></div>
            <div className="absolute top-[60%] right-[5%] w-[600px] h-[600px] border border-black/5 rounded-full animate-slow-spin-reverse"></div>
            <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] border border-black/5 rounded-full animate-slow-spin"></div>
        </div>
    );
};
