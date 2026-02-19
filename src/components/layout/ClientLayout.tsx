"use client";

import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import Link from "next/link";
import React, { ReactNode, ErrorInfo } from "react";

// Carga dinámica con SSR desactivado para evitar problemas de hidratación
// IMPORTANTE: .then(mod => mod.Component) se usa porque NO son export default
const Header = dynamic(() => import("@/components/layout/Header").then(mod => mod.Header), {
    ssr: false,
    loading: () => <div className="h-16 bg-[#FFF8E1] shadow-sm" />
});
const FloatingCart = dynamic(() => import("@/components/layout/FloatingCart").then(mod => mod.FloatingCart), {
    ssr: false,
    loading: () => null
});
const CartSidebar = dynamic(() => import("@/components/layout/CartSidebar").then(mod => mod.CartSidebar), {
    ssr: false,
    loading: () => null
});

// Error Boundary para capturar fallos
class ErrorBoundary extends React.Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode; fallback: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("🔴 Layout Error:", error, errorInfo);
    }
    render() {
        return this.state.hasError ? this.props.fallback : this.props.children;
    }
}

const CustomErrorFallback = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">¡Ups! Algo estalló 💥</h2>
            <p className="text-gray-600 mb-6">Error Técnico Detectado</p>
            <button
                onClick={() => window.location.reload()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md mb-2"
            >
                Intentar de nuevo
            </button>
        </div>
    </div>
);

export function ClientLayout({ children }: { children: React.ReactNode }) {
    // Client-side date generation to avoid hydration mismatch
    const [year, setYear] = React.useState<number | null>(null);

    React.useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <ErrorBoundary fallback={<CustomErrorFallback />}>
            <div className="flex min-h-screen flex-col pb-24 md:pb-0 bg-[#F5F5F7]">
                <Header />
                <main className="flex-grow">{children}</main>
                <FloatingCart />
                <CartSidebar />

                <footer className="mt-auto bg-[#2E2E2E] text-gray-400 py-12 px-4">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Santa Cruz Pizzería</h4>
                            <p className="text-sm">La mejor pizza de la ciudad, directo a tu casa.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
                                <li><Link href="/cookies" className="hover:text-white transition-colors">Política de Cookies</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Contacto</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://wa.me/584246802805" className="hover:text-white transition-colors">WhatsApp: 0424-6802805</a></li>
                                <li><a href="mailto:contacto@santacruzpizza.com" className="hover:text-white transition-colors">Email: contacto@santacruz.com</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Admin</h4>
                            <Link href="/admin" className="text-sm hover:text-white transition-colors bg-white/10 px-3 py-1 rounded-md inline-block">
                                Acceso Interno
                            </Link>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 pt-8 text-center text-xs">
                        {/* Use state for year to ensure client-side rendering matches */}
                        <p>&copy; {year || 2026} Santa Cruz Pizzería. Todos los derechos reservados.</p>
                    </div>
                </footer>

                <Toaster position="bottom-right" />
            </div>
        </ErrorBoundary>
    );
}
