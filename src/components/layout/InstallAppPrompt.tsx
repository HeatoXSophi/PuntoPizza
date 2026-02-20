"use client";

import { useState, useEffect } from "react";
import { Download, Share, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function InstallAppPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);

        // Listen for install prompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Show prompt after a delay to not be intrusive
            setTimeout(() => setShowPrompt(true), 5000);
        };

        window.addEventListener("beforeinstallprompt", handler);

        // If iOS and not standalone, show prompt
        if (isIosDevice && !(window.navigator as any).standalone) {
            setTimeout(() => setShowPrompt(true), 5000);
        }

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            if (isIOS) {
                // Show iOS instructions
                toast.info("Para instalar en iOS: Presiona 'Compartir' y luego 'Agregar al Inicio'");
            }
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setDeferredPrompt(null);
            setShowPrompt(false);
            toast.success("¡Gracias por instalar nuestra App!");
        }
    };

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-4 md:w-96"
            >
                <div className="bg-white rounded-2xl shadow-2xl p-4 border border-orange-100 flex items-center gap-4 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-100 rounded-full opacity-50 blur-xl" />

                    {/* Content */}
                    <div className="flex-1 z-10">
                        <h4 className="font-black text-gray-900 leading-tight mb-1">
                            ¡Instala nuestra App! 🍕
                        </h4>
                        <p className="text-xs text-gray-500">
                            Pide más rápido y recibe ofertas exclusivas.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 z-10">
                        <button
                            onClick={() => setShowPrompt(false)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleInstallClick}
                            className="bg-gradient-to-r from-[#FF5722] to-[#FF8A65] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            INSTALAR
                        </button>
                    </div>

                    {isIOS && (
                        <div className="absolute inset-x-0 bottom-0 bg-blue-50 text-[10px] text-blue-600 text-center py-1">
                            iOS: <Share className="w-3 h-3 inline mx-1" /> Compartir &gt; Agregar al Inicio
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
