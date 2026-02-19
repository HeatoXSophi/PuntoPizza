"use client";

import { Heart, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store";

export function BottomNav() {
    const count = useCartStore((state) => state.items.length);

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#43A047] flex items-center justify-between px-6 z-50 text-white rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
            {/* Left Icons */}
            <div className="flex gap-8">
                <Link href="/" className="flex flex-col items-center gap-1 opacity-100">
                    <Heart className="w-6 h-6 fill-white" />
                    <span className="text-[10px] font-bold">FAVS</span>
                </Link>
                <Link href="/profile" className="flex flex-col items-center gap-1 opacity-90 hover:opacity-100">
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-bold">MI CUENTA</span>
                </Link>
            </div>

            {/* Center Logo - The "Hump" */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-10">
                <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-gray-100 flex items-center justify-center transition-transform hover:scale-110 overflow-hidden">
                    <Image
                        src="/logo-v2.png"
                        alt="Logo"
                        width={200}
                        height={200}
                        className="object-contain w-full h-full scale-[2.5]"
                    />
                </div>
            </div>

            {/* Right Icons */}
            <div className="flex gap-8">
                <div className="w-10"></div> {/* Spacer for logo */}
                <Link href="/cart" className="flex flex-col items-center gap-1 opacity-90 hover:opacity-100 relative">
                    <div className="relative">
                        <ShoppingCart className="w-6 h-6" />
                        {count > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#FF5722] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                                {count}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold">CARRITO</span>
                </Link>
            </div>
        </div>
    );
}
