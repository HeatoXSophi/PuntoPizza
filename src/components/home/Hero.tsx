"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin, Star } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section
            id="inicio"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="absolute inset-0 opacity-30 bg-hero-pattern" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Floating Pizza Elements */}
            <motion.div
                initial={{ opacity: 0, y: 0, rotate: 0 }}
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-20 right-10 text-7xl md:text-9xl opacity-20 select-none"
            >
                🍕
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 0, rotate: 0 }}
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                className="absolute bottom-40 left-10 text-5xl md:text-7xl opacity-20 select-none"
            >
                🍕
            </motion.div>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
                <div className="text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5722]/20 backdrop-blur-sm rounded-full text-[#FFAB91] text-sm font-medium mb-6"
                    >
                        <Star className="w-4 h-4 fill-current" />
                        <span>4.8 Estrellas • +250 Reseñas</span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                    >
                        La Mejor Pizza de
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFAB91] to-[#FF5722]">
                            Santa Cruz
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        Ingredientes frescos, masa artesanal y el sabor auténtico italiano
                        que tu familia merece. Pedido en línea, listo en minutos.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/menu"
                            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white font-semibold rounded-full shadow-lg shadow-[#FF5722]/30 hover:shadow-[#FF5722]/50 transition-all duration-300 hover:scale-105"
                        >
                            Ver Menú
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="tel:+584246802805"
                            className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
                        >
                            Ordenar por Teléfono
                        </a>
                    </motion.div>

                    {/* Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
                    >
                        <div className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                            <Clock className="w-6 h-6 text-[#FFAB91]" />
                            <div className="text-left">
                                <p className="text-white font-semibold">Delivery Rápido</p>
                                <p className="text-gray-400 text-sm">30-45 minutos</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                            <MapPin className="w-6 h-6 text-[#FFAB91]" />
                            <div className="text-left">
                                <p className="text-white font-semibold">Ubicación</p>
                                <p className="text-gray-400 text-sm">Av. Principal, SC</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                            <Star className="w-6 h-6 text-[#FFAB91] fill-current" />
                            <div className="text-left">
                                <p className="text-white font-semibold">Calidad Premium</p>
                                <p className="text-gray-400 text-sm">Ingredientes frescos</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
}
