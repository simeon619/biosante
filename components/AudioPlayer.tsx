'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, MapPin, Quote } from 'lucide-react';
import { API_URL } from '@/lib/utils';

interface Testimonial {
    id?: number | string;
    author: string;
    location: string;
    duration?: string;
    url?: string;
    audio_url?: string;
    text_content?: string;
    author_image?: string;
}

interface AudioPlayerProps {
    testimonial: Testimonial;
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

    const audioUrl = testimonial.url || testimonial.audio_url;
    const hasAudio = !!audioUrl;
    const hasText = !!testimonial.text_content;
    const hasImage = !!testimonial.author_image;

    const togglePlay = () => {
        if (!hasAudio || !audioRef.current) return;

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
    };

    const getAudioSrc = () => {
        if (!audioUrl) return '';
        if (audioUrl.startsWith('/uploads')) {
            return `${API_URL}${audioUrl}`;
        }
        return audioUrl;
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
                {/* Author Image or Play Button */}
                <div className="relative flex-shrink-0">
                    {hasImage ? (
                        <div className="relative">
                            <img
                                src={testimonial.author_image}
                                alt={testimonial.author}
                                className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                            />
                            {hasAudio && (
                                <button
                                    onClick={togglePlay}
                                    className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full ${isPlaying ? 'bg-gray-900' : colorClass} text-white flex items-center justify-center transition-all hover:scale-105 shadow-lg`}
                                >
                                    {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                                </button>
                            )}
                        </div>
                    ) : hasAudio ? (
                        <button
                            onClick={togglePlay}
                            className={`w-14 h-14 rounded-full ${isPlaying ? 'bg-gray-900' : colorClass} text-white flex items-center justify-center flex-shrink-0 transition-all hover:scale-105`}
                        >
                            {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-1" />}
                        </button>
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                            <Quote size={20} className="text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-bold text-gray-900 text-sm">{testimonial.author}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin size={10} /> {testimonial.location}
                            </p>
                        </div>
                        {hasAudio && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="hidden sm:flex space-x-0.5 items-end h-4">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div
                                            key={i}
                                            className={`w-1 rounded-t-sm ${isPlaying ? 'animate-pulse' : ''} ${barColorClass}`}
                                            style={{ height: isMounted ? `${30 + Math.random() * 70}%` : '50%' }}
                                        ></div>
                                    ))}
                                </div>
                                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {testimonial.duration || '0:00'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Text Content */}
                    {hasText && (
                        <div className="mt-3 relative">
                            <Quote size={14} className="absolute -left-1 -top-1 text-gray-200" />
                            <p className="text-sm text-gray-700 italic pl-4 leading-relaxed line-clamp-3">
                                {testimonial.text_content}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Audio element */}
            {hasAudio && (
                <audio
                    ref={audioRef}
                    src={getAudioSrc()}
                    onEnded={() => setIsPlaying(false)}
                    onPause={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                />
            )}
        </div>
    );
};
