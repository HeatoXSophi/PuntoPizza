"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen({ onFinish }: { onFinish?: () => void }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Show splash screen for 3 seconds simulating app load
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onFinish) onFinish();
        }, 2500);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                    style={{ background: "radial-gradient(ellipse at center, #1a0000 0%, #000000 70%)" }}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    {/* Ambient glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/15 rounded-full blur-[100px] pointer-events-none" />

                    <motion.div
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, type: "spring", stiffness: 80 }}
                        className="relative w-72 h-44 md:w-96 md:h-56 mb-8"
                    >
                        <Image
                            src="/logo.png"
                            alt="Santa Cruz Pizzería"
                            fill
                            className="object-contain drop-shadow-[0_0_40px_rgba(220,38,38,0.3)]"
                            priority
                        />
                    </motion.div>

                    {/* Red loading bar */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "200px" }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="h-1 bg-white/10 rounded-full overflow-hidden"
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-red-700 to-red-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.8, delay: 0.5 }}
                        />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="mt-4 text-red-400/70 font-medium tracking-[0.25em] text-xs uppercase"
                    >
                        Cargando la mejor pizza...
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
