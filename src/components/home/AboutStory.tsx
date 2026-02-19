"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Award, Utensils } from "lucide-react";

export function AboutStory() {
    return (
        <section className="py-24 bg-black text-white overflow-hidden relative">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Visual Side */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10 rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl border border-white/10"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1542834369-f10ebf06d3e0?auto=format&fit=crop&q=80&w=800"
                                alt="Pizza Chef"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <p className="text-xl font-heading italic text-white/90">
                                    "No vendemos solo pizza, compartimos nuestra pasión."
                                </p>
                            </div>
                        </motion.div>

                        {/* Decorative Elements */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="absolute -top-10 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"
                        />
                    </div>

                    {/* Text Side */}
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block"
                        >
                            Nuestra Historia
                        </motion.span>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-heading text-4xl md:text-5xl font-black mb-6 leading-tight"
                        >
                            Más que <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
                                Ingredientes
                            </span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6 text-gray-400 text-lg leading-relaxed font-light"
                        >
                            <p>
                                Todo comenzó con un pequeño horno y un gran sueño en el corazón de Santa Cruz.
                                Queríamos recuperar el sabor de la pizza auténtica, esa que se hace con paciencia,
                                con masa madre fermentada por 48 horas y con ingredientes que saben a lo que son.
                            </p>
                            <p>
                                Hoy, cada pizza que sale de nuestro horno lleva ese compromiso inquebrantable
                                con la calidad. No usamos atajos.
                            </p>
                        </motion.div>

                        {/* Stats / Values */}
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { icon: Heart, label: "Pasión", desc: "En cada detalle" },
                                { icon: Award, label: "Calidad", desc: "Ingredientes Premium" },
                                { icon: Utensils, label: "Artesanal", desc: "Masa Madre" },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <item.icon className="w-8 h-8 text-primary mb-3" />
                                    <h4 className="font-bold text-white mb-1">{item.label}</h4>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
