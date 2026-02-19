"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { DICTIONARY } from "@/lib/dictionary";
import { toast } from "sonner";
import { products as menuItems } from "@/lib/data"; // Use shared data
import { ProductCard } from "@/components/menu/ProductCard"; // Reuse component
import { ProductModal } from "@/components/menu/ProductModal";

const categories = [
    { id: "all", name: "Todas" },
    { id: "clasicas", name: "Clásicas" },
    { id: "especiales", name: "Especiales" },
    { id: "premium", name: "Premium" },
    { id: "bebidas", name: "Bebidas" },
];

// Categories defined by the user:
// TODAS, PIZZAS PEQUEÑA, PIZZAS MEDIANA, PIZZAS GRANDE, PIZZAS FAMILIARES, PASTAS, COMBOS, PROMOCIONES, POSTRES, BEBIDAS
const menuCategories = [
    { id: "all", label: "cat_all" },
    { id: "personal", label: "cat_small" },
    { id: "medium", label: "cat_medium" },
    { id: "large", label: "cat_large" },
    { id: "family", label: "cat_family" },
    { id: "pasta", label: "cat_pasta" },
    { id: "combos", label: "cat_combos" },
    { id: "promos", label: "cat_promos" },
    { id: "desserts", label: "cat_desserts" },
    { id: "drinks", label: "cat_drinks" },
];

export function Menu() {
    const { language } = useCartStore();
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const t = DICTIONARY[language || "es"] || DICTIONARY.es;
    const [activeCategory, setActiveCategory] = useState("all");
    // Dynamic translation for tabs
    const categoriesWithLabels = menuCategories.map(c => ({
        id: c.id,
        name: t[c.label as keyof typeof t] || c.label
    }));

    // Filter products
    const filteredProducts = activeCategory === "all"
        ? menuItems
        : menuItems.filter(p => p.category === activeCategory);

    return (
        <section id="menu" className="py-24 bg-white relative overflow-hidden">
            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-orange-50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block py-1 px-3 rounded-full bg-orange-100/80 text-orange-600 text-xs font-bold tracking-wider uppercase mb-4"
                    >
                        {t.menu_title || "Nuestro Menú"}
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-heading text-4xl md:text-5xl font-black text-[#0F172A] leading-tight"
                    >
                        {t.hero_title_1} <span className="text-primary">{t.hero_title_2}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg"
                    >
                        {t.hero_desc}
                    </motion.p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12 overflow-x-auto pb-4 scrollbar-hide px-4">
                    <div className="flex gap-2">
                        {categoriesWithLabels.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`
                                    relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap
                                    ${activeCategory === cat.id
                                        ? "bg-primary text-white shadow-lg shadow-orange-500/25 scale-105"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                                    }
                                `}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Menu Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((item) => (
                            <div key={item.id} className="h-full">
                                <ProductCard
                                    id={item.id}
                                    name={item.name}
                                    description={item.description}
                                    price={item.price}
                                    category={item.category}
                                    image={item.image}
                                    onClick={() => setSelectedProduct(item)}
                                />
                            </div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
