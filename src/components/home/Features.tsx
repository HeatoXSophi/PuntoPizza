"use client";

import { motion } from "framer-motion";
import { Flame, Leaf, Truck, Award, Clock, Heart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { DICTIONARY } from "@/lib/dictionary";

export function Features() {
    const { language } = useCartStore();
    const t = DICTIONARY[language || "es"] || DICTIONARY.es;

    const features = [
        {
            icon: Flame,
            title: t.feat_oven,
            description: t.feat_oven_desc,
            color: "bg-orange-100 text-orange-600"
        },
        {
            icon: Leaf,
            title: t.feat_fresh,
            description: t.feat_fresh_desc,
            color: "bg-green-100 text-green-600"
        },
        {
            icon: Truck,
            title: t.feat_delivery,
            description: t.feat_delivery_desc,
            color: "bg-blue-100 text-blue-600"
        },
        {
            icon: Award,
            title: t.feat_recipes,
            description: t.feat_recipes_desc,
            color: "bg-yellow-100 text-yellow-600"
        },
        {
            icon: Clock,
            title: t.feat_hours,
            description: t.feat_hours_desc,
            color: "bg-purple-100 text-purple-600"
        },
        {
            icon: Heart,
            title: t.feat_love,
            description: t.feat_love_desc,
            color: "bg-red-100 text-red-600"
        }
    ];

    return (
        <section className="py-24 bg-[#FFF8E1]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 font-bold text-sm mb-4">
                        {t.features_badge}
                    </span>
                    <h2 className="font-heading text-4xl md:text-5xl font-black text-[#0F172A]">
                        {t.features_title} <span className="text-[#FF5722]">{t.features_title_highlight}</span>
                    </h2>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                        {t.features_desc}
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="font-heading text-xl font-bold text-[#0F172A] mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
