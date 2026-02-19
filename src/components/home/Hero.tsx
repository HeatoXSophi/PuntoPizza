"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Clock, MapPin, Star, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section
            ref={ref}
            id="inicio"
            className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-black"
        >
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/60 z-10" />

                {/* Video Background - User should replace '/hero-video.mp4' with their actual video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60 scale-105"
                    poster="https://images.unsplash.com/photo-1574071318500-d0d518d6f91e?auto=format&fit=crop&q=80&w=1920"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Content */}
            <motion.div
                style={{ y: yText, opacity: opacityHero }}
                className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-sm font-medium mb-8"
                >
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span>Más de 250 reseñas de 5 estrellas</span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tight mb-8 drop-shadow-2xl"
                >
                    La Mejor Pizza <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
                        de la Ciudad
                    </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed mb-12"
                >
                    Ingredientes frescos, masa madre artesanal y el auténtico sabor italiano.
                    Una experiencia culinaria en cada rebanada.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <Link
                        href="/menu"
                        className="group relative px-8 py-4 bg-primary text-white text-lg font-bold rounded-full overflow-hidden shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Ver Menú Completo
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>

                    <a
                        href="tel:+584246802805"
                        className="flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white text-lg font-semibold rounded-full hover:bg-white/10 transition-all duration-300 group"
                    >
                        <PlayCircle className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                        <span>Ordenar por Teléfono</span>
                    </a>
                </motion.div>

                {/* Info Cards (Compact Mode) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
                >
                    {[
                        { icon: Clock, label: "30-45 min", sub: "Delivery Rápido" },
                        { icon: MapPin, label: "Santa Cruz", sub: "Ubicación" },
                        { icon: Star, label: "Premium", sub: "Calidad" },
                        { icon: ArrowRight, label: "Pick-up", sub: "Disponible" },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                            <item.icon className="w-6 h-6 text-white mb-2" />
                            <p className="text-white font-bold">{item.label}</p>
                            <p className="text-white/60 text-xs uppercase tracking-wider">{item.sub}</p>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50 flex flex-col items-center gap-2"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.2em]">Explorar</span>
            </motion.div>
        </section>
    );
}
