"use client";

import { useCallback } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import Link from "next/link";
import { webhookService } from "@/lib/services/WebhookService";

export function FloatingCart() {
    const count = useCartStore((state) => state.items?.length ?? 0);
    const isHydrated = useHydrated();

    const toggleCart = useCartStore((state) => state.toggleCart);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        try {
            webhookService.sendEvent("CART_OPENED", { count });
        } catch (error) {
            // Ignored
        }
        toggleCart(); // Open Sidebar
    }, [count, toggleCart]);

    if (!isHydrated || count === 0) return null;

    const itemLabel = count === 1 ? "producto" : "productos";

    return (
        <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            role="region"
            aria-label="Carrito de compras"
        >
            <Link
                href="/cart"
                onClick={handleClick}
                aria-label={`Ver carrito con ${count} ${itemLabel}`}
                className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-full block"
            >
                <div className="relative bg-white rounded-full p-2 shadow-xl flex flex-col items-center justify-center w-20 h-20 border-4 border-white/50 backdrop-blur-sm transition-transform duration-200 ease-out hover:scale-105 active:scale-95">
                    {/* Orange glow background */}
                    <div className="absolute inset-2 bg-gradient-to-br from-orange-200 to-orange-500 rounded-full opacity-10" />

                    <ShoppingCart
                        className="h-8 w-8 text-orange-600 relative z-10"
                        strokeWidth={2.5}
                        aria-hidden="true"
                    />
                    <span className="text-xs font-bold text-gray-600 mt-0.5 relative z-10 leading-none select-none">
                        CARRITO
                    </span>

                    {/* Badge */}
                    <span
                        className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm z-20"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {count > 99 ? "99+" : count}
                    </span>
                </div>
            </Link>
        </div>
    );
}
