"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail, Send, MessageCircle } from "lucide-react";

export function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would normally send the form data
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: "", email: "", phone: "", message: "" });
        }, 3000);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: "Ubicación",
            details: ["Av. Principal, Santa Cruz", "Aragua, Venezuela"],
        },
        {
            icon: Phone,
            title: "Teléfono",
            details: ["+58 424 680 2805", "+58 243 123 4567"],
        },
        {
            icon: Clock,
            title: "Horario",
            details: ["Lun - Dom: 11:00 AM - 11:00 PM", "Delivery disponible"],
        },
        {
            icon: Mail,
            title: "Email",
            details: ["info@santacruzpizzeria.com", "pedidos@santacruzpizzeria.com"],
        },
    ];

    return (
        <section id="contacto" className="py-20 bg-white">
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
                        Contacto
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        ¿Tienes alguna
                        <span className="text-[#FF5722]"> pregunta?</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Estamos aquí para ayudarte. Contáctanos para reservas, pedidos especiales o cualquier consulta.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            {contactInfo.map((info, index) => (
                                <div
                                    key={index}
                                    className="p-6 bg-gray-50 rounded-2xl hover:bg-[#FFF3E0] transition-colors duration-300"
                                >
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFAB91]/20 text-[#E64A19] rounded-xl mb-4">
                                        <info.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {info.title}
                                    </h3>
                                    {info.details.map((detail, i) => (
                                        <p key={i} className="text-gray-600 text-sm">
                                            {detail}
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Map placeholder */}
                        <div className="relative h-64 bg-gradient-to-br from-[#FFAB91] to-[#FFCCBC] rounded-2xl overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="w-12 h-12 text-[#E64A19] mx-auto mb-2" />
                                    <p className="text-[#BF360C] font-medium">Santa Cruz, Aragua</p>
                                    <p className="text-[#E64A19] text-sm">Venezuela</p>
                                </div>
                            </div>
                            <div
                                className="absolute inset-0 opacity-10 bg-contact-pattern"
                            />
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="bg-gray-50 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Envíanos un mensaje
                            </h3>

                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                        ¡Mensaje Enviado!
                                    </h4>
                                    <p className="text-gray-600">
                                        Te contactaremos pronto. ¡Gracias!
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Nombre completo
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition-all"
                                            placeholder="Tu nombre"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition-all"
                                                placeholder="tu@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="phone"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition-all"
                                                placeholder="+58 424 000 0000"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Mensaje
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={4}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition-all resize-none"
                                            placeholder="Escribe tu mensaje aquí..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#FF5722]/30 transition-all duration-300"
                                    >
                                        <Send className="w-5 h-5" />
                                        Enviar Mensaje
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
