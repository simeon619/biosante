'use client';

import React from 'react';
import ProductEditor from '@/components/admin/ProductEditor';

export default function NewProductPage() {
    return (
        <div className="p-4 md:p-8">
            <ProductEditor isNew={true} />
        </div>
    );
}
