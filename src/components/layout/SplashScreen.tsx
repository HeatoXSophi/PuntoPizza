"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, ChevronRight } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";

interface SplashScreenProps {
    onFinish: () => void;
    isAppMode?: boolean;
}

export function SplashScreen({ onFinish, isAppMode: propAppMode }: SplashScreenProps) {
    const [step, setStep] = useState<"logo" | "auth">("logo");
    const { setProfileOpen, isAppMode: storeAppMode } = useCartStore();
    const router = useRouter();

    const isAppMode = propAppMode ?? storeAppMode;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAppMode) {
                setStep("auth");
            } else {
                onFinish();
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [isAppMode, onFinish]);

    // FIX: When auth is clicked, FIRST close the splash, THEN open profile sidebar
    // Previously the splash (z-100) stayed on top and blocked the profile sidebar
    const handleAuthClick = () => {
        onFinish();                        // 1. Close splash screen
        router.push("/menu");              // 2. Navigate to menu
        setTimeout(() => {
            setProfileOpen(true);          // 3. Open profile sidebar (after navigation)
        }, 300);
    };

    const handleContinue = () => {
        router.push("/menu");
        onFinish();
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FF5722] p-8"
            >
                {step === "logo" ? (
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                            transition={{ duration: 1, ease: "backOut" }}
                            className="relative w-72 h-72 flex items-center justify-center mb-8 bg-white rounded-full shadow-2xl p-12 overflow-hidden"
                        >
                            <Image
                                src="/logo.png"
                                alt="Punto Pizza Logo"
                                width={500}
                                height={500}
                                className="object-contain w-full h-full"
                                priority
                            />
                        </motion.div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-white text-4xl font-black tracking-widest uppercase text-center"
                        >
                            Santa Cruz
                        </motion.h1>
                    </div>
                ) : (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="w-full max-w-sm flex flex-col items-center gap-6"
                    >
                        <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg mb-4 flex items-center justify-center overflow-hidden">
                            <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain" />
                        </div>

                        <div className="text-center mb-4">
                            <h2 className="text-white text-3xl font-black mb-2">¡BIENVENIDO! 🍕</h2>
                            <p className="text-orange-100 font-medium">Inicia sesión para una mejor experiencia</p>
                        </div>

                        <button
                            onClick={handleAuthClick}
                            className="w-full bg-white text-[#FF5722] font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all text-lg"
                        >
                            <LogIn className="w-6 h-6" />
                            INGRESAR / REGISTRAR
                        </button>

                        <button
                            onClick={handleContinue}
                            className="mt-4 text-white font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            Continuar al Menú
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
