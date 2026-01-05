import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { UIProvider } from "@/context/UIContext";
import { AuthProvider } from "@/context/AuthContext";
import { OrganizationJsonLd } from "@/components/OrganizationJsonLd";
import { FacebookPixel } from "@/components/FacebookPixel";
import { getPublicSettings } from "@/services/settings";
import { Suspense } from "react";
import { SettingsProvider } from "@/context/SettingsContext";


const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: {
        default: "BIO SANTÉ | Science & Nature au Service de votre Santé",
        template: "%s | BIO SANTÉ"
    },
    description: "Découvrez nos solutions naturelles cliniquement prouvées pour l'hypertension et le diabète. Des protocoles innovants basés sur la science et la nature.",
    keywords: ["santé naturelle", "hypertension", "diabète", "vitalité", "compléments alimentaires", "Côte d'Ivoire", "Abidjan"],
    authors: [{ name: "BIO SANTÉ" }],
    creator: "BIO SANTÉ",
    publisher: "BIO SANTÉ",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://sante-vitalite.ci'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: "BIO SANTÉ | Science & Nature",
        description: "Solutions naturelles cliniquement prouvées pour l'hypertension et le diabète.",
        url: 'https://sante-vitalite.ci',
        siteName: 'BIO SANTÉ',
        images: [
            {
                url: '/og-image.jpg', // Assuming this exists or will be added
                width: 1200,
                height: 630,
                alt: 'BIO SANTÉ - Science & Nature',
            },
        ],
        locale: 'fr_FR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "BIO SANTÉ | Science & Nature",
        description: "Solutions naturelles cliniquement prouvées pour l'hypertension et le diabète.",
        images: ['/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const settings = await getPublicSettings().catch(() => null);
    const pixelId = settings?.fb_pixel_id;

    return (
        <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
            <head>
                <OrganizationJsonLd />
            </head>
            <body className={`${inter.variable} font-sans antialiased text-gray-900 bg-[#F4F4F0]`} suppressHydrationWarning>
                <Suspense fallback={null}>
                    <FacebookPixel pixelId={pixelId} />
                </Suspense>
                <SettingsProvider>
                    <AuthProvider>
                        <UIProvider>
                            <CartProvider>
                                {children}
                            </CartProvider>
                        </UIProvider>
                    </AuthProvider>
                </SettingsProvider>
            </body>
        </html>
    );
}
