'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ProductEditor from '@/components/admin/ProductEditor';

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <div className="p-4 md:p-8">
            <ProductEditor productId={id} />
        </div>
    );
}
