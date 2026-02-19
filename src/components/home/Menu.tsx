"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

const categories = [
    { id: "all", name: "Todas" },
    { id: "clasicas", name: "Clásicas" },
    { id: "especiales", name: "Especiales" },
    { id: "premium", name: "Premium" },
    { id: "bebidas", name: "Bebidas" },
];

const menuItems = [
    {
        id: "1",
        name: "Margherita",
        description: "Tomate, mozzarella fresca, albahaca y aceite de oliva extra virgen",
        price: 12.99,
        category: "clasicas",
        image: "🍕",
        isPopular: true,
    },
    {
        id: "2",
        name: "Pepperoni",
        description: "Salsa de tomate, mozzarella y pepperoni premium",
        price: 14.99,
        category: "clasicas",
        image: "🍕",
        isPopular: true,
    },
    {
        id: "3",
        name: "Hawaiana",
        description: "Jamón, piña fresca y queso mozzarella",
        price: 13.99,
        category: "clasicas",
        image: "🍕",
    },
    {
        id: "4",
        name: "Vegetariana",
        description: "Pimientos, champiñones, cebolla, aceitunas y tomate",
        price: 13.99,
        category: "clasicas",
        image: "🍕",
    },
    {
        id: "5",
        name: "Quattro Formaggi",
        description: "Mozzarella, gorgonzola, parmesano y fontina",
        price: 16.99,
        category: "especiales",
        image: "🍕",
        isPopular: true,
    },
    {
        id: "6",
        name: "BBQ Chicken",
        description: "Pollo a la parrilla, salsa BBQ, cebolla caramelizada y cilantro",
        price: 17.99,
        category: "especiales",
        image: "🍕",
    },
    {
        id: "7",
        name: "Diavola",
        description: "Salami picante, jalapeños, pimientos rojos y aceite de chile",
        price: 15.99,
        category: "especiales",
        image: "🍕",
        isSpicy: true,
    },
    {
        id: "8",
        name: "Prosciutto",
        description: "Jamón serrano, rúcula fresca, parmesano y aceite de oliva",
        price: 19.99,
        category: "premium",
        image: "🍕",
    },
    {
        id: "9",
        name: "Trufa Negra",
        description: "Crema de trufa, mozzarella, champiñones porcini y trufa negra",
        price: 24.99,
        category: "premium",
        image: "🍕",
        isPopular: true,
    },
    {
        id: "10",
        name: "Mariscos",
        description: "Camarones, calamares, mejillones y salsa marinera",
        price: 22.99,
        category: "premium",
        image: "🍕",
    },
    {
        id: "11",
        name: "Coca-Cola",
        description: "Lata 355ml",
        price: 2.50,
        category: "bebidas",
        image: "🥤",
    },
    {
        id: "12",
        name: "Agua Mineral",
        description: "Botella 500ml",
        price: 1.99,
        category: "bebidas",
        image: "💧",
    },
    {
        id: "13",
        name: "Cerveza Artesanal",
        description: "Botella 330ml - IPA local",
        price: 4.99,
        category: "bebidas",
        image: "🍺",
    },
];

export function Menu() {
    const [activeCategory, setActiveCategory] = useState("all");
    const addItem = useCartStore((state) => state.addItem);
    const setCartOpen = useCartStore((state) => state.setCartOpen);

    const filteredItems =
        activeCategory === "all"
            ? menuItems
            : menuItems.filter((item) => item.category === activeCategory);

    const handleAddToCart = (item: any) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            // Add description if supported by store in future
        });
        toast.success("Producto agregado al carrito");
        setCartOpen(true);
    };

    return (
        <section id="menu" className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="inline-block px-4 py-1.5 bg-[#FFAB91]/20 text-[#E64A19] text-sm font-semibold rounded-full mb-4">
                        Nuestro Menú
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Pizzas para todos los
                        <span className="text-[#FF5722]"> gustos</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Descubre nuestra variedad de pizzas artesanales, elaboradas con los mejores ingredientes.
                    </p>
                </motion.div>

                {/* Category Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-2 mb-12"
                >
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={cn(
                                "px-5 py-2.5 rounded-full font-medium transition-all duration-300",
                                activeCategory === category.id
                                    ? "bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            {category.name}
                        </button>
                    ))}
                </motion.div>

                {/* Menu Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item) => (
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
                                        {/* @ts-ignore - isSpicy logic */}
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
