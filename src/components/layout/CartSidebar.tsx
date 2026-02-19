"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, MessageCircle } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import Image from "next/image";

export function CartSidebar() {
    const isOpen = useCartStore((state) => state.isCartOpen);
    const setCartOpen = useCartStore((state) => state.setCartOpen);
    const items = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const clearCart = useCartStore((state) => state.clearCart);
    const total = useCartStore((state) => state.total);

    const isHydrated = useHydrated();

    if (!isHydrated) return null;

    const handleWhatsAppOrder = () => {
        const phoneNumber = "584246802805"; // Replace with real one
        const itemsList = items
            .map((item) => `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`)
            .join("\n");

        const message = `🍕 *Nuevo Pedido - Santa Cruz Pizzería*\n\n${itemsList}\n\n*Total: $${total.toFixed(2)}*\n\n¡Gracias por tu pedido!`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
                    />

                    {/* Cart Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[1000] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#FFAB91]/20 rounded-full flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-[#FF5722]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Tu Carrito</h2>
                                    <p className="text-sm text-gray-500">
                                        {items.length} {items.length === 1 ? "item" : "items"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Tu carrito está vacío
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Agrega algunas pizzas deliciosas
                                    </p>
                                    <button
                                        onClick={() => setCartOpen(false)}
                                        className="px-6 py-3 bg-[#FF5722] text-white font-semibold rounded-full hover:bg-[#E64A19] transition-colors"
                                    >
                                        Ver Menú
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {items.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9, x: 50 }}
                                                className="flex gap-4 p-4 bg-gray-50 rounded-2xl"
                                            >
                                                {/* Item Image */}
                                                <div className="w-20 h-20 bg-[#FFAB91]/20 rounded-xl relative overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>

                                                {/* Item Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                            {item.name}
                                                        </h3>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-[#FF5722] font-semibold">
                                                        ${item.price.toFixed(2)}
                                                    </p>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(item.id, -1)
                                                            }
                                                            className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-8 text-center font-semibold">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(item.id, 1)
                                                            }
                                                            className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                        <span className="ml-auto font-semibold text-gray-900">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {/* Clear Cart */}
                                    <button
                                        onClick={clearCart}
                                        className="w-full py-3 text-gray-500 text-sm font-medium hover:text-red-500 transition-colors"
                                    >
                                        Vaciar carrito
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-100 p-6 bg-gray-50">
                                {/* Subtotal */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-semibold text-gray-900">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-500">Delivery</span>
                                    <span className="text-green-600 font-medium">Gratis</span>
                                </div>

                                {/* Total */}
                                <div className="flex items-center justify-between py-4 border-t border-gray-200 mb-4">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-[#FF5722]">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handleWhatsAppOrder}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Pedir por WhatsApp
                                </button>

                                <p className="text-center text-gray-500 text-xs mt-3">
                                    Te contactaremos para confirmar tu pedido
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
