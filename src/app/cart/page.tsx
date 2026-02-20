"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import { WhatsAppCheckout } from "@/components/cart/WhatsAppCheckout";
import { getBCVRate } from "@/lib/services/dolar";
import { useHydrated } from "@/hooks/use-hydrated";
import { motion } from "framer-motion";

export default function CartPage() {
    const { items, total, updateQuantity, removeItem, deliveryType } = useCartStore();
    const isHydrated = useHydrated();
    const [bcvRate, setBcvRate] = useState<number | null>(null);

    useEffect(() => {
        const fetchRate = async () => {
            const rate = await getBCVRate();
            if (rate) setBcvRate(rate);
        };
        fetchRate();
    }, []);

    if (!isHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    const deliveryFee = (items.length > 0 && deliveryType === "delivery") ? 2.50 : 0;
    const finalTotal = total + deliveryFee;

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center bg-gray-50">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-orange-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-8 max-w-sm">
                    Parece que aún no has elegido nada. ¡Nuestro menú está lleno de opciones deliciosas!
                </p>
                <Link href="/menu">
                    <Button size="lg" className="bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-full px-8 text-lg shadow-lg shadow-orange-500/20">
                        Ver Menú
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/menu" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-orange-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900">Finalizar Pedido</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Order Summary */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-orange-500" />
                                Tu Pedido ({items.length})
                            </h2>

                            <div className="space-y-6">
                                {items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-orange-100 transition-colors"
                                    >
                                        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-sm">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="font-bold text-gray-900 leading-tight">{item.name}</h3>
                                                    <p className="font-black text-gray-900">${((item.totalPrice || item.price) * item.quantity).toFixed(2)}</p>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-3 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                                                    <button
                                                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors"
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors"
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <button
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Cost Summary Desktop (Hidden on Mobile usually, but kept here for logical flow) */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Resumen de Costos</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Envío ({deliveryType === "delivery" ? "Delivery" : "Pickup"})</span>
                                    <span className="font-medium">{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : "Gratis"}</span>
                                </div>
                                <div className="border-t border-dashed my-2 pt-2"></div>
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-gray-900 text-lg">Total</span>
                                    <div className="text-right">
                                        <div className="font-black text-2xl text-[#FF5722]">${finalTotal.toFixed(2)}</div>
                                        {bcvRate && (
                                            <div className="text-xs text-gray-500 font-medium">
                                                Bs. {((finalTotal) * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                <span className="ml-1 text-gray-400 font-normal">(Tasa: {bcvRate.toFixed(2)})</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Checkout Form */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24">
                            <WhatsAppCheckout />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

