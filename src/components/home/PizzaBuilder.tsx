"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Pizza as PizzaIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

// Ingredients data with visuals (simulated with CSS/colors for now)
const INGREDIENTS = [
    { id: "pepperoni", name: "Pepperoni", color: "#B71C1C", zIndex: 10 },
    { id: "mushrooms", name: "Champiñones", color: "#8D6E63", zIndex: 20 },
    { id: "olives", name: "Aceitunas", color: "#212121", zIndex: 30 },
    { id: "peppers", name: "Pimentón", color: "#43A047", zIndex: 40 },
    { id: "onions", name: "Cebolla", color: "#F48FB1", zIndex: 50 },
];

export function PizzaBuilder() {
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

    const toggleIngredient = (id: string) => {
        setSelectedIngredients((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const resetBuilder = () => {
        setSelectedIngredients([]);
        toast.info("Pizza reiniciada");
    };

    const handleAddToCart = () => {
        toast.success("¡Pizza personalizada agregada al carrito! (Simulado)");
    };

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm">Tu Obra Maestra</span>
                    <h2 className="font-heading text-4xl md:text-5xl font-black text-[#0F172A] mt-2">
                        Arma tu Pizza <span className="text-primary">Perfecta</span>
                    </h2>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                        Selecciona tus ingredientes favoritos y visualiza tu creación antes de ordenar.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Visualizer */}
                    <div className="relative flex items-center justify-center h-[400px] md:h-[500px]">
                        {/* Plate/Crust */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-[#F5CA99] rounded-full border-[12px] border-[#E0A769] shadow-2xl flex items-center justify-center overflow-hidden"
                        >
                            {/* Cheese Base */}
                            <div className="absolute inset-2 bg-[#FFF9C4] rounded-full opacity-90" />
                            <div className="absolute inset-2 bg-[url('/cheese-texture.png')] opacity-20 mix-blend-multiply" />

                            {/* Ingredients Layers */}
                            <AnimatePresence>
                                {INGREDIENTS.map((ing) => (
                                    selectedIngredients.includes(ing.id) && (
                                        <motion.div
                                            key={ing.id}
                                            initial={{ opacity: 0, scale: 1.2, rotate: -10 }}
                                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                                            className="absolute inset-0 pointer-events-none"
                                            style={{ zIndex: ing.zIndex }}
                                        >
                                            {/* Simulate scattered ingredients */}
                                            {Array.from({ length: 12 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute rounded-full shadow-sm"
                                                    style={{
                                                        backgroundColor: ing.color,
                                                        width: Math.random() * 20 + 20 + 'px',
                                                        height: Math.random() * 20 + 20 + 'px',
                                                        top: Math.random() * 70 + 15 + '%',
                                                        left: Math.random() * 70 + 15 + '%',
                                                        transform: `rotate(${Math.random() * 360}deg)`,
                                                    }}
                                                />
                                            ))}
                                        </motion.div>
                                    )
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Floating Price Tag */}
                        <motion.div
                            layout
                            className="absolute bottom-4 right-4 md:right-12 bg-white px-6 py-3 rounded-2xl shadow-xl border border-gray-100"
                        >
                            <span className="text-sm text-gray-500 block">Precio estimado</span>
                            <span className="text-3xl font-black text-[#0F172A]">
                                ${(10 + selectedIngredients.length * 1.5).toFixed(2)}
                            </span>
                        </motion.div>
                    </div>

                    {/* Controls */}
                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {INGREDIENTS.map((ing) => {
                                const isSelected = selectedIngredients.includes(ing.id);
                                return (
                                    <motion.button
                                        key={ing.id}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => toggleIngredient(ing.id)}
                                        className={`
                                            flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200
                                            ${isSelected
                                                ? 'border-primary bg-primary/5 shadow-md'
                                                : 'border-white bg-white hover:border-gray-200'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-6 h-6 rounded-full border border-black/10"
                                                style={{ backgroundColor: ing.color }}
                                            />
                                            <span className={`font-bold ${isSelected ? 'text-primary' : 'text-gray-600'}`}>
                                                {ing.name}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <div className="bg-primary text-white p-1 rounded-full">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        <div className="flex gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                className="flex-1 bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                            >
                                <PizzaIcon className="w-5 h-5" />
                                Ordenar Creación
                            </motion.button>
                            <motion.button
                                whileHover={{ rotate: 180 }}
                                onClick={resetBuilder}
                                className="p-4 bg-white border-2 border-gray-200 text-gray-400 rounded-xl hover:text-gray-600 hover:border-gray-300 transition-colors"
                            >
                                <RefreshCcw className="w-6 h-6" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
