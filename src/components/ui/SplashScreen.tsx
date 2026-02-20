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
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FFF8E1]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            type: "spring",
                            stiffness: 100
                        }}
                        className="relative w-48 h-48 md:w-64 md:h-64 mb-8"
                    >
                        <Image
                            src="/logo.png"
                            alt="Santa Cruz Pizzería"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </motion.div>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "200px" }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="h-1.5 bg-gray-200 rounded-full overflow-hidden"
                    >
                        <motion.div
                            className="h-full bg-[#FF5722]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.8, delay: 0.5 }}
                        />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="mt-4 text-[#5D4037] font-bold tracking-widest text-sm uppercase"
                    >
                        Cargando la mejor pizza...
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
