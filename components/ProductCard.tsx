import React from 'react';
import { Product } from '../types';
import { Plus, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-2 transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-800 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 font-bold rounded-md transform -rotate-12">Rupture de stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-3">
          {product.description}
        </p>

        {/* Benefits Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.benefits.slice(0, 2).map((benefit, idx) => (
            <span key={idx} className="inline-flex items-center text-xs text-primary-700 bg-primary-50 px-2 py-1 rounded-md">
              <Check className="w-3 h-3 mr-1" /> {benefit}
            </span>
          ))}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Prix</span>
            <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className={`p-3 rounded-full transition-colors shadow-sm flex items-center justify-center ${product.inStock
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            aria-label="Ajouter au panier"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};