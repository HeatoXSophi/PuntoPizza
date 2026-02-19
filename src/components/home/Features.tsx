"use client";

import { motion } from "framer-motion";
import { Flame, Leaf, Truck, Award, Clock, Heart } from "lucide-react";

const features = [
    {
        icon: Flame,
        title: "Horno de Piedra",
        description: "Pizzas cocinadas en horno tradicional de piedra a 400°C para un sabor único.",
        color: "text-orange-500",
        bgColor: "bg-orange-100",
    },
    {
        icon: Leaf,
        title: "Ingredientes Frescos",
        description: "Solo utilizamos ingredientes frescos y de la más alta calidad.",
        color: "text-green-500",
        bgColor: "bg-green-100",
    },
    {
        icon: Truck,
        title: "Delivery Express",
        description: "Entrega rápida en 30-45 minutos para que disfrutes tu pizza caliente.",
        color: "text-blue-500",
        bgColor: "bg-blue-100",
    },
    {
        icon: Award,
        title: "Recetas Premiadas",
        description: "Nuestras recetas han sido reconocidas por su autenticidad y sabor.",
        color: "text-yellow-500",
        bgColor: "bg-yellow-100",
    },
    {
        icon: Clock,
        title: "Horario Extendido",
        description: "Abiertos de 11:00 AM a 11:00 PM todos los días de la semana.",
        color: "text-purple-500",
        bgColor: "bg-purple-100",
    },
    {
        icon: Heart,
        title: "Hecho con Amor",
        description: "Cada pizza es preparada con pasión y dedicación por nuestro equipo.",
        color: "text-red-500",
        bgColor: "bg-red-100",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export function Features() {
    return (
        <section id="nosotros" className="py-20 bg-gradient-to-b from-white to-[#FFF3E0]/50">
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
                        ¿Por qué elegirnos?
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Lo que nos hace
                        <span className="text-[#FF5722]"> especiales</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Más de 10 años de experiencia nos respaldan. Conoce las razones por las que somos la pizzería favorita de Santa Cruz.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${feature.bgColor} ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
