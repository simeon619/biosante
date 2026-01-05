'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { ArrowRight } from 'lucide-react';

interface AddToCartButtonProps {
    product: Product;
    className?: string; // e.g. "bg-rose-600 hover:bg-rose-700"
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, className }) => {
    const { addToCart } = useCart();

    return (
        <button
            onClick={() => addToCart(product)}
            className={`text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg flex items-center ${className || 'bg-gray-900 hover:bg-gray-800'}`}
        >
            Commander <ArrowRight className="ml-2 w-5 h-5" />
        </button>
    );
};
