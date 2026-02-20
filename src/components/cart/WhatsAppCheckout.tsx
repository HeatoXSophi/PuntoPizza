"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/store";
import { Send, Phone, MapPin, User, Wallet, Banknote, Calculator } from "lucide-react";
import { toast } from "sonner";
import { webhookService } from "@/lib/services/WebhookService";
import { getBCVRate } from "@/lib/services/dolar";
import Image from "next/image";

export function WhatsAppCheckout() {
    const { items, total, deliveryType } = useCartStore();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        paymentMethod: "Efectivo",
        paymentReference: "",
        cashAmount: "", // New field for cash amount
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [paymentProof, setPaymentProof] = useState<string | null>(null);
    const [bcvRate, setBcvRate] = useState<number | null>(null);

    const [gpsLocation, setGpsLocation] = useState<string | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    useEffect(() => {
        const fetchRate = async () => {
            const rate = await getBCVRate();
            if (rate) setBcvRate(rate);
        };
        fetchRate();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentProof(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGetLocation = () => {
        setIsLoadingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                    setGpsLocation(mapsUrl);
                    setIsLoadingLocation(false);
                    toast.success("Ubicación detectada correctamente");
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setIsLoadingLocation(false);
                    toast.error("No se pudo obtener la ubicación. Por favor escríbela manualmente.");
                }
            );
        } else {
            setIsLoadingLocation(false);
            toast.error("La geolocalización no es soportada por este navegador.");
        }
    };

    const handleCheckout = async () => {
        if (!formData.name) {
            toast.error("Por favor completa tu nombre");
            return;
        }
        if (deliveryType === "delivery" && !formData.address) {
            toast.error("Por favor completa tu dirección");
            return;
        }
        if (formData.paymentMethod === "Pago Móvil") {
            if (!formData.paymentReference) {
                toast.error("Por favor indica el número de referencia del pago");
                return;
            }
            if (!paymentProof) {
                toast.error("Por favor adjunta la captura del pago");
                return;
            }
        }

        const deliveryFee = (items.length > 0 && deliveryType === "delivery") ? 2.50 : 0;
        const finalTotal = total + deliveryFee;
        const totalBs = bcvRate ? finalTotal * bcvRate : 0;

        // Cash Change Validation & Calculation
        let changeAmount = 0;
        if (formData.paymentMethod === "Efectivo" && formData.cashAmount) {
            const cashGiven = parseFloat(formData.cashAmount);
            if (isNaN(cashGiven) || cashGiven < finalTotal) {
                toast.error(`El monto en efectivo debe ser mayor o igual al total ($${finalTotal.toFixed(2)})`);
                return;
            }
            changeAmount = cashGiven - finalTotal;
        }

        const orderId = `ORD-${Date.now().toString().slice(-6)}`;

        // 1. Construct the message
        let message = `🍕 *NUEVO PEDIDO (${deliveryType === "delivery" ? "DELIVERY" : "PICKUP"})* 🍕\n`;
        message += `📅 ID: ${orderId}\n`;
        message += `👤 *Cliente:* ${formData.name}\n`;
        message += `📱 *Teléfono:* ${formData.phone || "N/A"}\n\n`;

        if (deliveryType === "delivery") {
            message += `📍 *Dirección de Entrega:*\n${formData.address}\n`;
            if (gpsLocation) {
                message += `🛰️ *Ubicación GPS:* ${gpsLocation}\n`;
            } else {
                message += `🗺️ *Maps (Ref):* https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}\n`;
            }
            message += `\n`;
        } else {
            message += `📍 *RETIRO EN TIENDA*\n\n`;
        }

        message += `💰 *MÉTODO DE PAGO: ${formData.paymentMethod.toUpperCase()}*\n`;

        if (formData.paymentMethod === "Pago Móvil") {
            message += `🔢 *Referencia:* ${formData.paymentReference}\n`;
            message += `📸 *Comprobante:* (Ver imagen que enviaré a continuación)\n`;
        } else if (formData.paymentMethod === "Efectivo" && formData.cashAmount) {
            message += `💵 *Paga con:* $${parseFloat(formData.cashAmount).toFixed(2)}\n`;
            message += `🔄 *Cambio:* $${changeAmount.toFixed(2)}\n`;
        }

        message += `\n📝 *DETALLE DEL PEDIDO:*\n`;

        items.forEach((item) => {
            message += `• ${item.quantity}x ${item.name}`;
            if (item.totalPrice) {
                message += ` - $${item.totalPrice.toFixed(2)}`;
            }
            message += `\n`;

            if (item.selectedIngredients && item.selectedIngredients.length > 0) {
                const extras = item.selectedIngredients.map((i) => (i as { name: string }).name).join(", ");
                message += `  + Extras: ${extras}\n`;
            }
            if (item.name.includes("Pizza") && item.description && (!item.selectedIngredients || item.selectedIngredients.length === 0)) {
                message += `  (${item.description})\n`;
            }
        });

        if (deliveryType === "delivery") {
            message += `\n🚚 *Envío:* $${deliveryFee.toFixed(2)}`;
        }
        message += `\n💰 *TOTAL USD:* $${finalTotal.toFixed(2)}`;
        if (bcvRate) {
            message += `\n🇻🇪 *TOTAL BS:* Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            message += `\n📊 *Tasa BCV:* ${bcvRate.toFixed(2)}`;
        }

        // 2. Encode for URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = "584246802805"; // Corrected Number
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // 3. Optional: Send to internal webhook
        await webhookService.sendEvent("ORDER_CREATED", {
            orderId,
            customer: { ...formData, gpsLocation },
            items,
            total: finalTotal,
            totalBs,
            rate: bcvRate,
            deliveryType,
            rawMessage: message,
            paymentProof
        });

        // Save Order to History
        const orderData = {
            id: orderId,
            date: new Date().toISOString(),
            items: [...items],
            total: finalTotal,
            totalBs: totalBs,
            method: formData.paymentMethod
        };
        useCartStore.getState().addOrder(orderData);

        // 4. Open WhatsApp
        window.open(whatsappUrl, "_blank");
        toast.success("Abriendo WhatsApp... ¡No olvides pegar/enviar la foto!");
    };

    if (items.length === 0) return null;

    const deliveryFee = (items.length > 0 && deliveryType === "delivery") ? 2.50 : 0;
    const finalTotal = total + deliveryFee;

    const cashChange = (formData.cashAmount && !isNaN(parseFloat(formData.cashAmount)))
        ? parseFloat(formData.cashAmount) - finalTotal
        : 0;

    return (
        <div className="bg-card glass border p-6 rounded-2xl shadow-sm space-y-4 max-w-md mx-auto mt-8">
            <h3 className="font-bold text-xl flex items-center gap-2">
                <Send className="w-5 h-5 text-green-500" />
                Finalizar Pedido
            </h3>

            {bcvRate && (
                <div className="bg-primary/10 text-primary p-3 rounded-lg flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider mb-1">Tasa Oficial BCV</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">{bcvRate.toFixed(2)}</span>
                        <span className="text-sm">Bs/$</span>
                    </div>
                </div>
            )}

            <p className="text-sm text-muted-foreground text-center">
                {formData.paymentMethod === "Efectivo"
                    ? "Paga al recibir tu pedido."
                    : "Realiza el pago y sube el comprobante."}
            </p>

            <div className="space-y-3">
                <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        name="name"
                        placeholder="Tu Nombre"
                        className="pl-9"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                {deliveryType === "delivery" && (
                    <div className="space-y-3">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="address"
                                placeholder="Dirección de Entrega (Punto de referencia)"
                                className="pl-9"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={handleGetLocation}
                            disabled={isLoadingLocation}
                        >
                            <MapPin className="w-4 h-4" />
                            {isLoadingLocation ? "Detectando ubicación..." : "📍 Usar mi ubicación actual (GPS)"}
                        </Button>

                        {gpsLocation && (
                            <div className="text-xs text-green-600 flex items-center gap-1 bg-green-50 p-2 rounded border border-green-200">
                                <span className="font-bold">✓ Ubicación GPS lista:</span>
                                <a href={gpsLocation} target="_blank" rel="noopener noreferrer" className="underline truncate flex-1">
                                    {gpsLocation}
                                </a>
                            </div>
                        )}
                    </div>
                )}

                <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        name="phone"
                        placeholder="Teléfono"
                        className="pl-9"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                <div className="relative">
                    <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <select
                        name="paymentMethod"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                    >
                        <option value="Efectivo">Efectivo ($)</option>
                        <option value="Pago Móvil">Pago Móvil (Bs)</option>
                    </select>
                </div>

                {/* Cash Payment Extra Fields */}
                {formData.paymentMethod === "Efectivo" && (
                    <div className="space-y-3 p-4 bg-orange-50 rounded-lg border border-orange-100 animate-in fade-in slide-in-from-top-2">
                        <div className="relative">
                            <Banknote className="absolute left-3 top-3 h-4 w-4 text-orange-500" />
                            <Input
                                name="cashAmount"
                                type="number"
                                placeholder={`Monto con el que pagas (Total: $${finalTotal.toFixed(2)})`}
                                className="pl-9 bg-white border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                value={formData.cashAmount}
                                onChange={handleChange}
                            />
                        </div>

                        {formData.cashAmount && !isNaN(parseFloat(formData.cashAmount)) && (
                            <div className="flex justify-between items-center text-sm p-2 bg-white rounded border border-orange-100 shadow-sm">
                                <span className="flex items-center gap-1 text-gray-600">
                                    <Calculator className="w-4 h-4" />
                                    Cambio a recibir:
                                </span>
                                <span className={`font-bold ${cashChange >= 0 ? "text-green-600" : "text-red-500"}`}>
                                    ${cashChange >= 0 ? cashChange.toFixed(2) : "Monto insuficiente"}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Pago Móvil Fields */}
                {formData.paymentMethod === "Pago Móvil" && bcvRate && (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center bg-green-50 p-2 rounded border border-green-100 mb-2">
                            <span className="text-xs font-semibold text-green-800">Monto a Pagar:</span>
                            <span className="text-lg font-bold text-green-700">Bs. {(finalTotal * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>

                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Datos de Pago</p>

                        <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-100">
                            <p><strong>BANCO MERCANTIL 0105</strong></p>
                            <p>0424-6670560</p>
                            <p>C.I: V - 17499726</p>
                        </div>

                        <Input
                            name="paymentReference"
                            placeholder="Número de Referencia (Últimos 4 dígitos)"
                            value={formData.paymentReference}
                            onChange={handleChange}
                            className="bg-white"
                        />

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />

                        {/* Custom Upload Area */}
                        <div
                            className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors group relative overflow-hidden"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {paymentProof ? (
                                <>
                                    <div className="relative h-32 w-full">
                                        <Image
                                            src={paymentProof}
                                            alt="Comprobante"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <span className="text-white text-xs font-bold">Cambiar imagen</span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center group-hover:scale-105 transition-transform">
                                    <p className="text-sm text-gray-500 font-medium">📸 Subir Comprobante</p>
                                    <p className="text-xs text-gray-400">Click para seleccionar imagen</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 gap-2 shadow-lg shadow-green-200"
                onClick={handleCheckout}
            >
                <Send className="w-4 h-4" />
                {formData.paymentMethod === "Efectivo" ? "Pedir y Pagar al Recibir" : `Pagar Bs. ${bcvRate ? (finalTotal * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 2 }) : ''} y Pedir`}
            </Button>
        </div>
    );
}
const { items, total, deliveryType } = useCartStore();
const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "Efectivo",
    paymentReference: "",
});
const fileInputRef = useRef<HTMLInputElement>(null);
const [paymentProof, setPaymentProof] = useState<string | null>(null);
const [bcvRate, setBcvRate] = useState<number | null>(null);

useEffect(() => {
    const fetchRate = async () => {
        const rate = await getBCVRate();
        if (rate) setBcvRate(rate);
    };
    fetchRate();
}, []);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPaymentProof(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
};

const handleCheckout = async () => {
    if (!formData.name) {
        toast.error("Por favor completa tu nombre");
        return;
    }
    if (deliveryType === "delivery" && !formData.address) {
        toast.error("Por favor completa tu dirección");
        return;
    }
    if (formData.paymentMethod === "Pago Móvil") {
        if (!formData.paymentReference) {
            toast.error("Por favor indica el número de referencia del pago");
            return;
        }
        if (!paymentProof) {
            toast.error("Por favor adjunta la captura del pago");
            return;
        }
    }

    const deliveryFee = (items.length > 0 && deliveryType === "delivery") ? 2.50 : 0;
    const finalTotal = total + deliveryFee;
    const totalBs = bcvRate ? finalTotal * bcvRate : 0;

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;

    // 1. Construct the message
    let message = `🍕 *NUEVO PEDIDO (${deliveryType === "delivery" ? "DELIVERY" : "PICKUP"})* 🍕\n`;
    message += `📅 ID: ${orderId}\n\n`;
    message += `👤 *Cliente:* ${formData.name}\n`;

    if (deliveryType === "delivery") {
        message += `📍 *Dirección:* ${formData.address}\n`;
        message += `🗺️ *Maps:* https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}\n`;
    } else {
        message += `📍 *Retiro en Tienda*\n`;
    }

    message += `📱 *Teléfono:* ${formData.phone || "N/A"}\n`;
    message += `💰 *Método Pago:* ${formData.paymentMethod}\n`;

    if (formData.paymentMethod === "Pago Móvil") {
        message += `🔢 *Ref:* ${formData.paymentReference}\n`;
        message += `📸 *Comprobante:* (Ver imagen adjunta)\n`;
    }

    message += `\n📝 *Pedido:*\n`;

    items.forEach((item) => {
        message += `- ${item.quantity}x ${item.name} ($${item.totalPrice ? item.totalPrice.toFixed(2) : item.price.toFixed(2)})\n`;
        if (item.selectedIngredients && item.selectedIngredients.length > 0) {
            const extras = item.selectedIngredients.map((i) => (i as { name: string }).name).join(", ");
            message += `  _Extras: ${extras}_\n`;
        } else if (item.name.includes("Pizza") && item.description) {
            message += `  _(${item.description})_\n`;
        }
    });

    if (deliveryType === "delivery") {
        message += `\n🚚 *Envío:* $${deliveryFee.toFixed(2)}`;
    }
    message += `\n💵 *TOTAL USD:* $${finalTotal.toFixed(2)}`;
    if (bcvRate) {
        message += `\n🇻🇪 *TOTAL BS:* Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        message += `\n📊 *Tasa BCV:* ${bcvRate.toFixed(2)}`;
    }

    // 2. Encode for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "584121234567";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // 3. Optional: Send to internal webhook
    await webhookService.sendEvent("ORDER_CREATED", {
        orderId,
        customer: formData,
        items,
        total: finalTotal,
        totalBs,
        rate: bcvRate,
        deliveryType,
        rawMessage: message,
        paymentProof
    });

    // Save Order to History
    const orderData = {
        id: orderId,
        date: new Date().toISOString(),
        items: [...items],
        total: finalTotal,
        totalBs: totalBs,
        method: formData.paymentMethod
    };
    useCartStore.getState().addOrder(orderData); // Access store directly to avoid hook dependency issues inside async if needed, or better via hook

    // 4. Open WhatsApp
    window.open(whatsappUrl, "_blank");
    toast.success("Abriendo WhatsApp... ¡No olvides pegar/enviar la foto!");
};

if (items.length === 0) return null;

const deliveryFee = (items.length > 0 && deliveryType === "delivery") ? 2.50 : 0;
const finalTotal = total + deliveryFee;

return (
    <div className="bg-card glass border p-6 rounded-2xl shadow-sm space-y-4 max-w-md mx-auto mt-8">
        <h3 className="font-bold text-xl flex items-center gap-2">
            <Send className="w-5 h-5 text-green-500" />
            Finalizar Pedido
        </h3>

        {bcvRate && (
            <div className="bg-primary/10 text-primary p-3 rounded-lg flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold uppercase tracking-wider mb-1">Tasa Oficial BCV</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{bcvRate.toFixed(2)}</span>
                    <span className="text-sm">Bs/$</span>
                </div>
            </div>
        )}

        <p className="text-sm text-muted-foreground text-center">
            {formData.paymentMethod === "Efectivo"
                ? "Paga al recibir tu pedido."
                : "Realiza el pago y sube el comprobante."}
        </p>

        <div className="space-y-3">
            <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    name="name"
                    placeholder="Tu Nombre"
                    className="pl-9"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            {deliveryType === "delivery" && (
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        name="address"
                        placeholder="Dirección de Entrega"
                        className="pl-9"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
            )}

            <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    name="phone"
                    placeholder="Teléfono"
                    className="pl-9"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </div>

            <div className="relative">
                <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                    name="paymentMethod"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                >
                    <option value="Efectivo">Efectivo ($)</option>
                    <option value="Pago Móvil">Pago Móvil (Bs)</option>
                </select>
            </div>

            {formData.paymentMethod === "Pago Móvil" && bcvRate && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center bg-green-50 p-2 rounded border border-green-100 mb-2">
                        <span className="text-xs font-semibold text-green-800">Monto a Pagar:</span>
                        <span className="text-lg font-bold text-green-700">Bs. {(finalTotal * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Datos de Pago</p>

                    <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-100">
                        <p><strong>BANCO MERCANTIL 0105</strong></p>
                        <p>0424-6670560</p>
                        <p>C.I: V - 17499726</p>
                    </div>

                    <Input
                        name="paymentReference"
                        placeholder="Número de Referencia (Últimos 4 dígitos)"
                        value={formData.paymentReference}
                        onChange={handleChange}
                        className="bg-white"
                    />

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {/* Custom Upload Area */}
                    <div
                        className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors group relative overflow-hidden"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {paymentProof ? (
                            <>
                                <div className="relative h-32 w-full">
                                    <Image
                                        src={paymentProof}
                                        alt="Comprobante"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <span className="text-white text-xs font-bold">Cambiar imagen</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-center group-hover:scale-105 transition-transform">
                                <p className="text-sm text-gray-500 font-medium">📸 Subir Comprobante</p>
                                <p className="text-xs text-gray-400">Click para seleccionar imagen</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 gap-2 shadow-lg shadow-green-200"
            onClick={handleCheckout}
        >
            <Send className="w-4 h-4" />
            {formData.paymentMethod === "Efectivo" ? "Pedir y Pagar al Recibir" : `Pagar Bs. ${bcvRate ? (finalTotal * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 2 }) : ''} y Pedir`}
        </Button>
    </div>
);
}
