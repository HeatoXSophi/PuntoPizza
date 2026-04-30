"use client";

import { Heart, ShoppingCart, User, Home } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";

export function BottomNav() {
    const { items, setProfileOpen, toggleCart } = useCartStore();
    const isHydrated = useHydrated();
    const count = isHydrated ? items.length : 0;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#43A047] flex items-center justify-around px-4 z-50 text-white rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.1)] md:hidden">
            {/* Home */}
            <Link href="/" className="flex flex-col items-center gap-0.5 opacity-90 hover:opacity-100">
                <Home className="w-5 h-5" />
                <span className="text-[9px] font-bold">INICIO</span>
            </Link>

            {/* Favs */}
            <Link href="/" className="flex flex-col items-center gap-0.5 opacity-90 hover:opacity-100">
                <Heart className="w-5 h-5 fill-white" />
                <span className="text-[9px] font-bold">FAVS</span>
            </Link>

            {/* Menu */}
            <Link href="/menu" className="flex flex-col items-center gap-0.5 opacity-90 hover:opacity-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-[9px] font-bold">MENÚ</span>
            </Link>

            {/* Mi Cuenta */}
            <button
                onClick={() => setProfileOpen(true)}
                className="flex flex-col items-center gap-0.5 opacity-90 hover:opacity-100"
            >
                <User className="w-5 h-5" />
                <span className="text-[9px] font-bold">CUENTA</span>
            </button>

            {/* Carrito */}
            <button
                onClick={toggleCart}
                className="flex flex-col items-center gap-0.5 opacity-90 hover:opacity-100 relative"
            >
                <div className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {count > 0 && (
                        <span className="absolute -top-2 -right-2.5 bg-[#FF5722] text-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                            {count}
                        </span>
                    )}
                </div>
                <span className="text-[9px] font-bold">CARRITO</span>
            </button>
        </div>
    );
}
