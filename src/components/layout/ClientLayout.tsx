"use client";

// import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { FloatingCart } from "@/components/layout/FloatingCart";
import { CartSidebar } from "@/components/layout/CartSidebar";
import { Toaster } from "sonner";
import Link from "next/link";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    // Simplified for stability - removed SplashScreen to isolate crash
    return (
        <div suppressHydrationWarning={true} className="flex min-h-screen flex-col pb-24 md:pb-0 bg-[#F5F5F7]">
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
                    <p>&copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Santa Cruz Pizzería. Todos los derechos reservados.</p>
                </div>
            </footer>

            <Toaster />
        </div>
    );
}
