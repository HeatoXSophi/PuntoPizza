"use client";

import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import React, { ReactNode, ErrorInfo } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { useCartStore } from "@/lib/store";

const FloatingCart = dynamic(() => import("@/components/layout/FloatingCart").then(mod => mod.FloatingCart), {
    ssr: false,
    loading: () => null
});
const CartSidebar = dynamic(() => import("@/components/layout/CartSidebar").then(mod => mod.CartSidebar), {
    ssr: false,
    loading: () => null
});

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

/**
 * Detect NATIVE App Mode only.
 * This ONLY fires for the native Android WebView wrapper, NOT for:
 * - Regular website visitors (desktop or mobile browser)
 * - PWA installed users
 * - Any other mobile browser
 *
 * Detection methods (native app only):
 * 1. Native app injects window.__NATIVE_APP_MODE__ = true via injectedJS
 * 2. URL has ?mode=app parameter (set by native App.js WebView source)
 */
function detectNativeAppMode(): boolean {
    if (typeof window === 'undefined') return false;

    // Method 1: Native app injected flag (most reliable)
    if ((window as any).__NATIVE_APP_MODE__ === true) return true;

    // Method 2: URL parameter set by native WebView
    try {
        const url = new URL(window.location.href);
        if (url.searchParams.get('mode') === 'app') return true;
    } catch { }

    return false;
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
    // Detect native app mode synchronously (only for native WebView)
    const isNativeApp = React.useMemo(() => detectNativeAppMode(), []);

    const [showSplash, setShowSplash] = React.useState(true);
    const {
        setUser, setUserName, setPhoneNumber, setAddress, setEmail,
        isAppMode, setAppMode, isProfileOpen, setProfileOpen
    } = useCartStore();

    // Set app mode in store immediately if native app detected
    React.useEffect(() => {
        if (isNativeApp) {
            setAppMode(true);
        }
    }, [isNativeApp, setAppMode]);

    // Backup: listen for the native app's custom event
    React.useEffect(() => {
        const handler = () => setAppMode(true);
        window.addEventListener('nativeAppMode', handler);
        return () => window.removeEventListener('nativeAppMode', handler);
    }, [setAppMode]);

    React.useEffect(() => {
        const initAuth = async () => {
            if (!supabase) return;

            const { data: { session: currentSession } } = await supabase.auth.getSession();
            if (currentSession?.user) {
                setUser(currentSession.user);
                setEmail(currentSession.user.email || "");
                const profile = await auth.getProfile(currentSession.user.id);
                if (profile) {
                    setUserName(profile.full_name);
                    setPhoneNumber(profile.phone);
                    setAddress(profile.address);
                }
            }

            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
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

            return () => subscription.unsubscribe();
        };

        initAuth();
    }, []);

    // Only true for native WebView app, never for regular web visitors
    const effectiveAppMode = isNativeApp || isAppMode;

    return (
        <ErrorBoundary fallback={<CustomErrorFallback />}>
            <ProfileSidebar isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} />

            {showSplash ? (
                <SplashScreen onFinish={() => setShowSplash(false)} isAppMode={effectiveAppMode} />
            ) : (
                <div className="flex min-h-screen flex-col pb-24 md:pb-0 bg-[#F5F5F7]">
                    <Header />
                    <main className="flex-grow">{children}</main>
                    <div className="hidden md:block">
                        <FloatingCart />
                    </div>
                    <CartSidebar />
                    <BottomNav />
                    <Toaster position="bottom-right" />
                </div>
            )}
        </ErrorBoundary>
    );
}
