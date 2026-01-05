'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { CheckoutPage } from '@/components/CheckoutPage';
import { useRouter } from 'next/navigation';

export default function PanierPage() {
    const { cart, clearCart } = useCart();
    const router = useRouter();

    const handleBack = () => {
        router.push('/');
    };

    return (
        <CheckoutPage
            cart={cart}
            onBack={handleBack}
            onClearCart={clearCart}
        />
    );
}
