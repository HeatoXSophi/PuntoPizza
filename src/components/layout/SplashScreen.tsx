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
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-8"
                style={{
                    background: "radial-gradient(ellipse at center, #1a0000 0%, #000000 70%)",
                }}
            >
                {/* Ambient glow effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-60" />
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-60" />
                </div>

                {step === "logo" ? (
                    <div className="flex flex-col items-center relative z-10">
                        {/* Logo grande, sin círculo */}
                        <motion.div
                            initial={{ scale: 0.3, opacity: 0 }}
                            animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                            transition={{ duration: 1.2, ease: "backOut" }}
                            className="relative w-80 h-52 sm:w-[420px] sm:h-64 flex items-center justify-center mb-6"
                        >
                            <Image
                                src="/logo.png"
                                alt="Santa Cruz Pizzería"
                                width={600}
                                height={400}
                                className="object-contain w-full h-full drop-shadow-[0_0_40px_rgba(220,38,38,0.4)]"
                                priority
                            />
                        </motion.div>

                        {/* Línea decorativa roja */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                            className="w-48 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent mb-5"
                        />

                        {/* Subtítulo */}
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-red-400/80 text-sm font-medium tracking-[0.3em] uppercase text-center"
                        >
                            El auténtico sabor italiano
                        </motion.p>

                        {/* Animación de carga sutil */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="mt-10 flex gap-1.5"
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-red-600"
                                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                />
                            ))}
                        </motion.div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="w-full max-w-sm flex flex-col items-center gap-6 relative z-10"
                    >
                        {/* Logo pequeño para la pantalla de auth */}
                        <div className="w-40 h-28 mb-2 flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]" />
                        </div>

                        <div className="text-center mb-4">
                            <h2 className="text-white text-3xl font-black mb-2">¡BIENVENIDO! 🍕</h2>
                            <p className="text-red-300/70 font-medium">Inicia sesión para una mejor experiencia</p>
                        </div>

                        <button
                            onClick={handleAuthClick}
                            className="w-full bg-gradient-to-r from-red-700 to-red-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-900/40 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all text-lg border border-red-500/30"
                        >
                            <LogIn className="w-6 h-6" />
                            INGRESAR / REGISTRAR
                        </button>

                        <button
                            onClick={handleContinue}
                            className="mt-4 text-red-400 font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors"
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
