import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingContacts } from "@/components/FloatingContacts";
import { GlobalBackground } from "@/components/GlobalBackground";
import { AIChat } from "@/components/AIChat";

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col relative z-10">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <CartDrawer />
            <FloatingContacts />
            <AIChat />
            <GlobalBackground />
        </div>
    );
}
