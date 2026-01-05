import { Metadata } from 'next';
import { HomeClient } from '@/components/HomeClient';

export const metadata: Metadata = {
    title: "Accueil | BIO SANTÉ - Science & Nature",
    description: "Solutions naturelles cliniquement prouvées pour l'hypertension et le diabète. Retrouvez votre vitalité avec BioActif et VitaMax.",
    openGraph: {
        title: "BIO SANTÉ | Science & Nature",
        description: "Solutions naturelles cliniquement prouvées pour l'hypertension et le diabète.",
        images: ['/og-image.jpg'],
    },
};

export default function Home() {
    return <HomeClient />;
}
