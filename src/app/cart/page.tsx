"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import { WhatsAppCheckout } from "@/components/cart/WhatsAppCheckout";
import { getBCVRate } from "@/lib/services/dolar";

import { useHydrated } from "@/hooks/use-hydrated";

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
        return <div className="p-4 flex justify-center"><p>Cargando...</p></div>;
    }

    const deliveryFee = (items.length > 0 && deliveryType === "delivery") ? 2.50 : 0;
    const finalTotal = total + deliveryFee;

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
                <p className="text-muted-foreground mb-6">¿Hambre? ¡Agrega unas pizzas!</p>
                <Link href="/menu">
                    <Button size="lg">Ir al Menú</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="p-4 pb-32 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Tu Pedido</h1>

            <div className="flex flex-col gap-4">
                {items.map((item) => (
                    <Card key={item.id} className="flex overflow-hidden">
                        <div className="relative w-24 h-24 min-w-[6rem]">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 p-3 flex flex-col justify-between">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                                <p className="font-bold text-sm whitespace-nowrap">${((item.totalPrice || item.price) * item.quantity).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-6 w-6 rounded-full"
                                        onClick={() => updateQuantity(item.id, -1)}
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-6 w-6 rounded-full"
                                        onClick={() => updateQuantity(item.id, 1)}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive"
                                    onClick={() => removeItem(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-8 space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${(total || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                    <span>Total</span>
                    <span className="text-primary">${(finalTotal || 0).toFixed(2)}</span>
                </div>
                {bcvRate && (
                    <div className="flex justify-between text-sm text-muted-foreground pt-1">
                        <span>Total en Bs (Tasa: {bcvRate.toFixed(2)})</span>
                        <span className="font-bold">Bs. {((finalTotal || 0) * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                )}
            </div>

            <div className="mb-24">
                <WhatsAppCheckout />
            </div>
            {/* Removed fixed bottom button in favor of inline WhatsApp Checkout */}
            {/* <div className="fixed bottom-20 left-4 right-4 max-w-2xl mx-auto"> ... </div> */}
        </div>
    );
}
