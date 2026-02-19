"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { DICTIONARY } from "@/lib/dictionary";
import { toast } from "sonner";
import { products as menuItems } from "@/lib/data"; // Use shared data

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
    const t = DICTIONARY[language || "es"] || DICTIONARY.es;
    const [activeCategory, setActiveCategory] = useState("all");
    const addItem = useCartStore((state) => state.addItem);
    const setCartOpen = useCartStore((state) => state.setCartOpen);

    // Dynamic translation for tabs
    const categoriesWithLabels = menuCategories.map(c => ({
        id: c.id,
        name: t[c.label as keyof typeof t] || c.label
    }));

    // Filter products
    const filteredProducts = activeCategory === "all"
        ? menuItems
        : menuItems.filter(p => p.category === activeCategory);

    const handleAddToCart = (item: any) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category,
            description: item.description || ""
        });
        toast.success("Producto agregado al carrito");
        setCartOpen(true);
    };

    return (
        <section id="menu" className="py-24 bg-white relative overflow-hidden">
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
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                {/* Image Area */}
                                <div className="relative h-48 bg-gradient-to-br from-[#FFAB91]/20 to-[#FFAB91]/40 flex items-center justify-center">
                                    <span className="text-7xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                        {item.image}
                                    </span>

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {item.isPopular && (
                                            <span className="px-2.5 py-1 bg-[#FF5722] text-white text-xs font-semibold rounded-full">
                                                Popular
                                            </span>
                                        )}
                                        {item.isSpicy && (
                                            <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                                <Flame className="w-3 h-3" />
                                                Picante
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {item.name}
                                        </h3>
                                        <span className="text-xl font-bold text-[#FF5722]">
                                            ${item.price.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                        {item.description}
                                    </p>
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-[#FF5722] transition-colors duration-300"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Agregar al Carrito
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
