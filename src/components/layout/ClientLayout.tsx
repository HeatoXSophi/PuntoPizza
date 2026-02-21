"use client";

import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import Link from "next/link";
import React, { ReactNode, ErrorInfo } from "react";

// Carga dinámica con SSR desactivado para evitar problemas de hidratación
// IMPORTANTE: .then(mod => mod.Component) se usa porque NO son export default
import { Header } from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { useCartStore } from "@/lib/store";
import { BottomNav } from "@/components/layout/BottomNav";
import { InstallAppPrompt } from "@/components/layout/InstallAppPrompt";

// Carga dinámica con SSR desactivado para evitar problemas de hidratación
// FloatingCart y CartSidebar se mantienen en cliente puro
// FloatingCart y CartSidebar se mantienen en cliente puro
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
    const { setUser, setUserName, setPhoneNumber, setAddress, setEmail } = useCartStore();

    React.useEffect(() => {
        setYear(new Date().getFullYear());

        // Auth Listener
        const initAuth = async () => {
            if (!supabase) return;

            // 1. Get initial session
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                setEmail(session.user.email || "");

                // Fetch profile
                const profile = await auth.getProfile(session.user.id);
                if (profile) {
                    setUserName(profile.full_name);
                    setPhoneNumber(profile.phone);
                    setAddress(profile.address);
                }
            }

            // 2. Listen for changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    setUser(session.user);
                    setEmail(session.user.email || "");
                    const profile = await auth.getProfile(session.user.id);
                    if (profile) {
                        setUserName(profile.full_name);
                        setPhoneNumber(profile.phone);
                        setAddress(profile.address);
                    }
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setUserName("");
                    setPhoneNumber("");
                    setAddress("");
                    setEmail("");
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        };

        initAuth();
    }, []);

    return (
        <ErrorBoundary fallback={<CustomErrorFallback />}>
            <div className="flex min-h-screen flex-col pb-24 md:pb-0 bg-[#F5F5F7]">
                <Header />
                <main className="flex-grow">{children}</main>
                <div className="hidden md:block">
                    <FloatingCart />
                </div>
                <CartSidebar />
                <BottomNav />
                <InstallAppPrompt />



                <Toaster position="bottom-right" />
            </div>
        </ErrorBoundary>
    );
}
