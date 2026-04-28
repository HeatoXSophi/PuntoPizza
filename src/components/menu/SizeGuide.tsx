"use client";

import { motion } from "framer-motion";

const SIZES = [
    {
        id: "personal",
        name: "Personal",
        diameter: "25cm",
        slices: 8,
        color: "from-amber-500 to-orange-600",
        textColor: "text-amber-400",
        borderColor: "border-amber-500/30",
        visualSize: 36,
        isRound: true,
    },
    {
        id: "large",
        name: "Grande",
        diameter: "33cm",
        slices: 8,
        color: "from-red-500 to-red-700",
        textColor: "text-red-400",
        borderColor: "border-red-500/30",
        visualSize: 48,
        isRound: true,
    },
    {
        id: "family",
        name: "Familiar",
        diameter: "40cm",
        slices: 12,
        color: "from-rose-500 to-pink-700",
        textColor: "text-rose-400",
        borderColor: "border-rose-500/30",
        visualSize: 60,
        isRound: true,
    },
    {
        id: "xl",
        name: "XL",
        diameter: "60×40cm",
        slices: 24,
        color: "from-yellow-400 to-amber-600",
        textColor: "text-yellow-400",
        borderColor: "border-yellow-400/30",
        visualSize: 72,
        isRound: false,
    },
];

export function SizeGuide() {
    return (
        <div className="mb-5">
            {/* Scrollable size cards */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                {SIZES.map((size, index) => (
                    <motion.div
                        key={size.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.07, duration: 0.3 }}
                        className={`flex-shrink-0 snap-start flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl bg-gradient-to-b from-gray-900/90 to-gray-950/90 border ${size.borderColor} hover:border-white/15 transition-all w-[calc(25%-6px)] min-w-[90px]`}
                    >
                        {/* Visual pizza representation */}
                        <div className="relative w-full aspect-square flex items-center justify-center">
                            <motion.div
                                className={`relative bg-gradient-to-br ${size.color} shadow-lg ${size.isRound ? 'rounded-full' : 'rounded-lg'}`}
                                style={{
                                    width: `${size.visualSize}%`,
                                    height: size.isRound ? `${size.visualSize}%` : `${size.visualSize * 0.67}%`,
                                }}
                                whileHover={{ scale: 1.08 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                {/* Inner highlight */}
                                <div className={`absolute inset-[2px] ${size.isRound ? 'rounded-full' : 'rounded-[6px]'} bg-gradient-to-br from-white/15 to-transparent`} />

                                {/* Slice lines for round */}
                                {size.isRound && (
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
                                )}

                                {/* Grid for rectangular */}
                                {!size.isRound && (
                                    <div className="absolute inset-0 rounded-[6px] overflow-hidden">
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

                        {/* Name */}
                        <h4 className={`font-black text-[11px] uppercase tracking-wider font-heading ${size.textColor} leading-none`}>
                            {size.name}
                        </h4>

                        {/* Diameter */}
                        <span className="text-white/60 text-[10px] font-semibold leading-none">
                            {size.diameter}
                        </span>

                        {/* Slices pill */}
                        <div className="bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 flex items-center gap-1">
                            <span className={`font-black text-xs ${size.textColor}`}>
                                {size.slices}
                            </span>
                            <span className="text-[8px] text-gray-500 uppercase font-bold">
                                pzas
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
