"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Ruler, Pizza } from "lucide-react";

const SIZES = [
    {
        id: "personal",
        name: "Personal",
        diameter: "25cm",
        slices: 8,
        icon: "🍕",
        color: "from-amber-500 to-orange-600",
        ringColor: "ring-amber-500/40",
        bgGlow: "bg-amber-500/10",
        textColor: "text-amber-400",
        badgeBg: "bg-amber-500/20",
        visualSize: 40, // % of container for visual reference
        isRound: true,
    },
    {
        id: "large",
        name: "Grande",
        diameter: "33cm",
        slices: 8,
        icon: "🍕",
        color: "from-red-500 to-red-700",
        ringColor: "ring-red-500/40",
        bgGlow: "bg-red-500/10",
        textColor: "text-red-400",
        badgeBg: "bg-red-500/20",
        visualSize: 55,
        isRound: true,
    },
    {
        id: "family",
        name: "Familiar",
        diameter: "40cm",
        slices: 12,
        icon: "🍕",
        color: "from-rose-500 to-pink-700",
        ringColor: "ring-rose-500/40",
        bgGlow: "bg-rose-500/10",
        textColor: "text-rose-400",
        badgeBg: "bg-rose-500/20",
        visualSize: 68,
        isRound: true,
    },
    {
        id: "xl",
        name: "XL",
        diameter: "60 × 40cm",
        slices: 24,
        icon: "🔥",
        color: "from-yellow-400 to-amber-600",
        ringColor: "ring-yellow-400/40",
        bgGlow: "bg-yellow-400/10",
        textColor: "text-yellow-400",
        badgeBg: "bg-yellow-400/20",
        visualSize: 90,
        isRound: false,
    },
];

export function SizeGuide() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4">
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-2xl border border-red-900/30 hover:border-red-600/50 transition-all duration-300 group"
                whileTap={{ scale: 0.98 }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-900/30">
                        <Ruler className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <span className="text-white font-bold text-sm uppercase tracking-wider font-heading">
                            Guía de Tamaños
                        </span>
                        <p className="text-gray-500 text-[10px] mt-0.5">
                            Toca para ver las referencias
                        </p>
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400 group-hover:text-red-400 transition-colors"
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </motion.button>

            {/* Collapsible Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3 space-y-2.5">
                            {SIZES.map((size, index) => (
                                <motion.div
                                    key={size.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.08, duration: 0.3 }}
                                    className={`relative flex items-center gap-3 px-3 py-3 rounded-2xl bg-gradient-to-r from-gray-900/80 to-gray-900/40 border border-white/5 hover:border-white/10 transition-all group/card`}
                                >
                                    {/* Visual pizza size indicator */}
                                    <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                                        {/* Outer glow */}
                                        <div className={`absolute inset-0 ${size.bgGlow} rounded-full blur-md opacity-60`} />

                                        {/* Pizza shape */}
                                        <motion.div
                                            className={`relative flex items-center justify-center bg-gradient-to-br ${size.color} shadow-lg ${
                                                size.isRound ? 'rounded-full' : 'rounded-lg'
                                            }`}
                                            style={{
                                                width: `${size.visualSize}%`,
                                                height: size.isRound ? `${size.visualSize}%` : `${size.visualSize * 0.67}%`,
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            {/* Inner pattern */}
                                            <div className={`absolute inset-[2px] ${size.isRound ? 'rounded-full' : 'rounded-[6px]'} bg-gradient-to-br from-white/10 to-transparent`} />
                                            
                                            {/* Slice lines for round pizzas */}
                                            {size.isRound && (
                                                <>
                                                    <div className="absolute inset-0 rounded-full overflow-hidden">
                                                        <div className="absolute top-1/2 left-0 right-0 h-[0.5px] bg-white/20 -translate-y-1/2" />
                                                        <div className="absolute top-0 bottom-0 left-1/2 w-[0.5px] bg-white/20 -translate-x-1/2" />
                                                        {size.slices >= 12 && (
                                                            <>
                                                                <div className="absolute top-1/2 left-1/2 w-full h-[0.5px] bg-white/15 -translate-x-1/2 -translate-y-1/2 rotate-[60deg] origin-center" />
                                                                <div className="absolute top-1/2 left-1/2 w-full h-[0.5px] bg-white/15 -translate-x-1/2 -translate-y-1/2 rotate-[-60deg] origin-center" />
                                                            </>
                                                        )}
                                                    </div>
                                                </>
                                            )}

                                            {/* Grid lines for rectangular */}
                                            {!size.isRound && (
                                                <div className="absolute inset-0 rounded-[6px] overflow-hidden">
                                                    {/* 6x4 grid = 24 slices */}
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <div key={`v${i}`} className="absolute top-0 bottom-0 bg-white/15" style={{ left: `${(i / 6) * 100}%`, width: '0.5px' }} />
                                                    ))}
                                                    {[1, 2, 3].map(i => (
                                                        <div key={`h${i}`} className="absolute left-0 right-0 bg-white/15" style={{ top: `${(i / 4) * 100}%`, height: '0.5px' }} />
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Text info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h4 className={`font-black text-sm uppercase tracking-wider font-heading ${size.textColor}`}>
                                                {size.name}
                                            </h4>
                                            {size.id === "xl" && (
                                                <span className="text-[9px] font-bold bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-2 py-0.5 rounded-full uppercase tracking-wide animate-pulse">
                                                    Rectangular
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white/80 text-xs font-semibold">
                                                📏 {size.diameter}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Slices badge */}
                                    <div className="flex-shrink-0">
                                        <div className={`${size.badgeBg} border border-white/10 rounded-xl px-3 py-1.5 text-center`}>
                                            <span className={`font-black text-base ${size.textColor} block leading-none`}>
                                                {size.slices}
                                            </span>
                                            <span className="text-[8px] text-gray-400 uppercase tracking-wider font-bold block mt-0.5">
                                                piezas
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Footer note */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-center text-[10px] text-gray-600 pt-1 pb-1 italic"
                            >
                                * La pizza XL tiene formato rectangular de 60×40cm
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
