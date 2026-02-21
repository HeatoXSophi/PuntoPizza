"use client";

import { useState } from "react";
import { Upload, CheckCircle, Copy, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentConfirmationProps {
    total: number;
    totalBs: number;
    onConfirmed: (reference: string, method: string) => void;
    onCancel: () => void;
}

const PAYMENT_METHODS = [
    {
        id: "pago_movil",
        name: "Pago Móvil",
        icon: "📱",
        details: {
            banco: "Banesco",
            telefono: "0424-6802805",
            cedula: "V-12345678",
        },
    },
    {
        id: "zelle",
        name: "Zelle",
        icon: "💵",
        details: {
            email: "santacruzpizzeria@gmail.com",
        },
    },
    {
        id: "efectivo",
        name: "Efectivo",
        icon: "💰",
        details: null,
    },
];

export function PaymentConfirmation({ total, totalBs, onConfirmed, onCancel }: PaymentConfirmationProps) {
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [reference, setReference] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const method = PAYMENT_METHODS.find(m => m.id === selectedMethod);

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        toast.success("Copiado al portapapeles");
    }

    async function handleSubmit() {
        if (!selectedMethod) {
            toast.error("Selecciona un método de pago");
            return;
        }
        if (selectedMethod !== "efectivo" && !reference.trim()) {
            toast.error("Ingresa el número de referencia");
            return;
        }
        setIsSubmitting(true);
        // Simulate brief processing
        await new Promise(resolve => setTimeout(resolve, 500));
        onConfirmed(reference.trim() || "efectivo", selectedMethod);
        setIsSubmitting(false);
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
        >
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white rounded-t-3xl border-b p-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Confirmar Pago</h2>
                    <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Amount */}
                    <div className="bg-gradient-to-r from-[#FF5722] to-[#FF8A65] rounded-2xl p-4 text-white">
                        <p className="text-sm opacity-90">Total a pagar</p>
                        <p className="text-2xl font-bold">${total.toFixed(2)}</p>
                        <p className="text-sm opacity-80">≈ Bs. {totalBs.toFixed(2)}</p>
                    </div>

                    {/* Payment Method Selection */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Método de Pago</p>
                        <div className="grid grid-cols-3 gap-2">
                            {PAYMENT_METHODS.map(pm => (
                                <button
                                    key={pm.id}
                                    onClick={() => setSelectedMethod(pm.id)}
                                    className={`p-3 rounded-xl border-2 text-center transition-all ${selectedMethod === pm.id
                                            ? "border-[#FF5722] bg-[#FF5722]/5"
                                            : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <span className="text-2xl">{pm.icon}</span>
                                    <p className="text-xs font-medium mt-1 text-gray-700">{pm.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payment Details */}
                    <AnimatePresence>
                        {method?.details && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-blue-50 rounded-xl p-3 space-y-2">
                                    <p className="text-xs font-bold text-blue-700 uppercase">Datos para transferencia</p>
                                    {Object.entries(method.details).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <div>
                                                <span className="text-xs text-gray-500 capitalize">{key}: </span>
                                                <span className="text-sm font-medium text-gray-800">{value as string}</span>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(value as string)}
                                                className="p-1 hover:bg-blue-100 rounded"
                                            >
                                                <Copy className="w-3.5 h-3.5 text-blue-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Reference Number */}
                    {selectedMethod && selectedMethod !== "efectivo" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                                Nro. de Referencia
                            </label>
                            <input
                                type="text"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                placeholder="Últimos 4 dígitos de la referencia"
                                className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5722]/30"
                            />
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selectedMethod}
                        className="w-full bg-[#FF5722] text-white font-bold py-3.5 rounded-xl hover:bg-[#E64A19] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <span className="animate-spin">⏳</span>
                        ) : (
                            <CheckCircle className="w-5 h-5" />
                        )}
                        {isSubmitting ? "Procesando..." : "Confirmar Pago"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
