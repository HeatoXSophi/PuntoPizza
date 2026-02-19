"use client";

import { useEffect, useState } from "react";
import React from "react";
import { Header } from "@/components/layout/Header";
import { FloatingCart } from "@/components/layout/FloatingCart";
import { CartSidebar } from "@/components/layout/CartSidebar";
import { Toaster } from "sonner";
import Link from "next/link";

// Error Boundary para capturar errores y mostrar tu pantalla de fallback
class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error en el layout:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

// Pantalla de error personalizada
const CustomErrorFallback = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">¡Ups! Algo estalló 💥</h2>
            <p className="text-gray-600 mb-6">Error Técnico Detectado</p>
            <button onClick={() => window.location.reload()} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md mr-2 mb-2">
                Intentar de nuevo
            </button>
            <button onClick={() => window.location.href = "/"} className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 px-6 rounded-md">
                Recargar App Completa
            </button>
        </div>
    </div>
);

export function ClientLayout({ children }: { children: React.ReactNode }) {
    // Estado para el año (solo cliente, evita hidratación)
    const [currentYear, setCurrentYear] = useState<string>("");

    useEffect(() => {
        setCurrentYear(new Date().getFullYear().toString());
    }, []);

    return (
        <ErrorBoundary fallback={<CustomErrorFallback />}>
            <div className="flex min-h-screen flex-col pb-24 md:pb-0 bg-[#F5F5F7]">
                <Header />
                {children}
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
                            <Link href="/admin" className="text-sm hover:text-white transition-colors bg-white/10 px-3 py-1 rounded-md">
                                Acceso Interno
                            </Link>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 pt-8 text-center text-xs">
                        <p>&copy; {currentYear || 2024} Santa Cruz Pizzería. Todos los derechos reservados.</p>
                    </div>
                </footer>

                <Toaster position="bottom-right" />
            </div>
        </ErrorBoundary>
    );
}
