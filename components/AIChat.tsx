'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/gemini';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Bonjour ! Je suis VitaliBot. Comment puis-je vous aider à trouver le bon produit aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass the current history (excluding the new user message we just added visually, 
      // but the service handles history construction, so we can pass current list + new one if needed,
      // or just let the service handle it. The service in this demo takes an array.
      const historyForApi = [...messages, userMsg];

      const responseText = await sendMessageToGemini(userMsg.text, historyForApi);

      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      } else {
        throw new Error("Empty response");
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: 'Désolé, je rencontre des difficultés techniques momentanées. Veuillez réessayer plus tard.',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[1100] flex items-center justify-center bg-primary-900 text-white p-4 rounded-full shadow-2xl hover:shadow-primary-900/40 transform hover:scale-110 transition-all duration-300 group border border-white/20"
          aria-label="Assistant Santé"
        >
          <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[1200] w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-[#F4F4F0] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-black/5 animate-in slide-in-from-bottom-4 duration-500">

          {/* Header */}
          <div className="bg-primary-900 p-5 flex justify-between items-center text-white relative">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">VitaliBot</h3>
                <p className="text-[10px] text-white/60 uppercase tracking-widest flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Assistant Expert
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all duration-300"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-primary-900/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-900" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-primary-900 text-white rounded-tr-none shadow-lg shadow-primary-900/20'
                    : 'bg-white text-gray-800 rounded-tl-none border border-black/5 shadow-sm'
                    } ${msg.isError ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                >
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary-900/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary-900" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 bg-white border-t border-black/5">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question..."
                className="w-full bg-gray-50 border-none rounded-2xl pl-5 pr-14 py-4 text-sm focus:ring-2 focus:ring-primary-900 transition-all placeholder:text-gray-400"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2.5 bg-primary-900 text-white rounded-xl hover:bg-primary-800 disabled:opacity-30 disabled:hover:bg-primary-900 transition-all shadow-lg shadow-primary-900/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-center text-black/30 mt-3 font-medium uppercase tracking-wider">
              Réponses basées sur la science naturelle
            </p>
          </div>
        </div>
      )}
    </>
  );
};