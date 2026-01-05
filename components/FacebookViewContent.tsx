'use client';

import { useEffect } from 'react';
import * as fpixel from '@/lib/fpixel';
import { useSettings } from '@/context/SettingsContext';

interface FacebookViewContentProps {
    product: {
        id: string;
        name: string;
        price: number;
    };
}

export const FacebookViewContent = ({ product }: FacebookViewContentProps) => {
    const { settings } = useSettings();

    useEffect(() => {
        if (settings.fb_pixel_id) {
            fpixel.event('ViewContent', {
                content_ids: [product.id],
                content_name: product.name,
                content_type: 'product',
                value: product.price,
                currency: 'XOF'
            }, settings.fb_pixel_id);
        }
    }, [product, settings.fb_pixel_id]);

    return null;
};
