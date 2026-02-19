"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        id: 1,
        name: "María García",
        role: "Cliente Frecuente",
        avatar: "👩",
        rating: 5,
        content:
            "La mejor pizza que he probado en Santa Cruz. El delivery siempre llega a tiempo y caliente. ¡100% recomendada!",
    },
    {
        id: 2,
        name: "Carlos Rodríguez",
        role: "Food Blogger",
        avatar: "👨",
        rating: 5,
        content:
            "Como amante de la pizza italiana, puedo decir que Santa Cruz Pizzería ha logrado capturar la esencia de una auténtica pizza napolitana.",
    },
    {
        id: 3,
        name: "Ana Martínez",
        role: "Cliente desde 2020",
        avatar: "👩‍🦰",
        rating: 5,
        content:
            "Mi familia pide aquí cada fin de semana. Los niños aman la pizza Hawaiana y nosotros la Quattro Formaggi. ¡Increíble!",
    },
    {
        id: 4,
        name: "Luis Pérez",
        role: "Chef Profesional",
        avatar: "👨‍🍳",
        rating: 5,
        content:
            "Se nota la calidad de los ingredientes y el cuidado en la preparación. La masa es perfecta, crujiente por fuera y suave por dentro.",
    },
    {
        id: 5,
        name: "Sofia Torres",
        role: "Foodie",
        avatar: "👧",
        rating: 5,
        content:
            "La pizza de trufa negra es simplemente espectacular. Vale cada centavo. El servicio es excepcional también.",
    },
    {
        id: 6,
        name: "Roberto Díaz",
        role: "Cliente Empresarial",
        avatar: "🧔",
        rating: 5,
        content:
            "Siempre pedimos para las reuniones de oficina. Nunca decepciona y todos en el equipo quedan satisfechos.",
    },
];

export function Testimonials() {
    return (
        <section className="py-20 bg-gradient-to-b from-[#FFF3E0]/50 to-white overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 bg-[#FFAB91]/20 text-[#E64A19] text-sm font-semibold rounded-full mb-4">
                        Testimonios
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Lo que dicen nuestros
                        <span className="text-[#FF5722]"> clientes</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Miles de clientes satisfechos nos respaldan. Descubre por qué somos la pizzería favorita de la ciudad.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                        >
                            {/* Quote Icon */}
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-[#FFAB91]/40" />

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-5 h-5 text-yellow-400 fill-current"
                                    />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#FFAB91]/20 rounded-full flex items-center justify-center text-2xl">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {[
                        { value: "10k+", label: "Pizzas Vendidas" },
                        { value: "4.8", label: "Rating Promedio" },
                        { value: "256+", label: "Reseñas 5 Estrellas" },
                        { value: "98%", label: "Clientes Satisfechos" },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
                        >
                            <div className="text-3xl sm:text-4xl font-bold text-[#FF5722] mb-1">
                                {stat.value}
                            </div>
                            <div className="text-gray-500 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
