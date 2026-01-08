'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, MapPin } from 'lucide-react';
import { AudioTestimonial } from '@/types';
import { API_URL } from '@/lib/utils';

interface AudioPlayerProps {
    testimonial: AudioTestimonial;
    colorClass?: string; // e.g. "bg-red-600"
    barColorClass?: string; // e.g. "bg-red-300"
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
    testimonial,
    colorClass = 'bg-black',
    barColorClass = 'bg-gray-300'
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                document.querySelectorAll('audio').forEach(el => {
                    if (el !== audioRef.current) {
                        el.pause();
                    }
                });
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
            <button
                onClick={togglePlay}
                className={`w-12 h-12 rounded-full ${isPlaying ? 'bg-gray-900' : colorClass} text-white flex items-center justify-center flex-shrink-0 transition-all hover:scale-105`}
            >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">{testimonial.author}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={10} /> {testimonial.location}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <div className="hidden sm:flex space-x-0.5 items-end h-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div
                            key={i}
                            className={`w-1 rounded-t-sm ${isPlaying ? 'animate-pulse' : ''} ${barColorClass}`}
                            style={{ height: isMounted ? `${30 + Math.random() * 70}%` : '50%' }}
                        ></div>
                    ))}
                </div>
                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{testimonial.duration}</span>
            </div>
            <audio
                ref={audioRef}
                src={testimonial.url.startsWith('/uploads') ? `${API_URL}${testimonial.url}` : testimonial.url}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
            />
        </div>
    );
};
