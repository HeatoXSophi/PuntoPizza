"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onFinish, 500); // Wait for exit animation
        }, 2500); // Show splash for 2.5 seconds

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FF5722]"
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            ease: "backOut",
                            type: "spring",
                            stiffness: 100
                        }}
                        className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] flex items-center justify-center mb-8"
                    >
                        <Image
                            src="/logo.png?v=final"
                            alt="Santa Cruz Pizzería"
                            width={800}
                            height={800}
                            className="object-contain w-full h-full"
                            priority
                        />
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-white text-3xl font-black tracking-widest uppercase mt-4"
                    >
                        Santa Cruz
                    </motion.h1>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "200px" }}
                        transition={{ delay: 0.8, duration: 1.5 }}
                        className="h-1 bg-white/50 rounded-full mt-4 overflow-hidden"
                    >
                        <motion.div
                            className="h-full bg-white"
                            animate={{ x: [-200, 200] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
