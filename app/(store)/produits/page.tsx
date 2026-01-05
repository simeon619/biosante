import { Metadata } from 'next';
import { ProductsClient } from '@/components/ProductsClient';

export const metadata: Metadata = {
    title: "Nos Protocoles | BIO SANTÉ - Science & Nature",
    description: "Découvrez nos protocoles de santé naturelle pour réguler la tension, le diabète et améliorer la vitalité masculine. Des solutions validées par la science.",
    openGraph: {
        title: "Nos Protocoles de Santé | BIO SANTÉ",
        description: "Des formulations synergiques pour une santé restaurée naturellement.",
        images: ['/og-image.jpg'],
    },
};

export default function ProductsPage() {
    return <ProductsClient />;
}
