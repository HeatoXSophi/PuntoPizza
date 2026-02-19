"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingCart, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store";
import {
    PizzaBaseSVG,
    TomatoSVG,
    OnionSVG,
    PepperSVG,
    CornSVG,
    OliveSVG,
    PepperoniSVG,
    ChorizoSVG,
    HamSVG,
    BaconSVG,
    AnchovySVG,
    MushroomSVG
} from "./PizzaAssets";

// Extended ingredients list based on user request
// Note: We're reusing some SVGs for new ingredients for now to keep the code clean
// In a real production app, we would create unique SVGs for each new ingredient.
const INGREDIENTS = [
    // Bases / Veggies
    { id: "tomato", name: "Tomate", icon: TomatoSVG, zIndex: 15, price: 0.50 },
    { id: "onion", name: "Cebolla", icon: OnionSVG, zIndex: 50, price: 0.50 },
    { id: "peppers", name: "Pimentón", icon: PepperSVG, zIndex: 40, price: 1.00 },
    { id: "corn", name: "Maíz", icon: CornSVG, zIndex: 45, price: 0.50 },
    { id: "olives", name: "Aceitunas", icon: OliveSVG, zIndex: 30, price: 1.00 },
    { id: "mushrooms", name: "Champiñones", icon: MushroomSVG, zIndex: 20, price: 1.50 },

    // Meats
    { id: "pepperoni", name: "Pepperoni", icon: PepperoniSVG, zIndex: 10, price: 2.00 },
    { id: "chorizo", name: "Chorizo", icon: ChorizoSVG, zIndex: 12, price: 2.00 },
    { id: "ham", name: "Jamón", icon: HamSVG, zIndex: 20, price: 1.50 },
    { id: "bacon", name: "Tocineta", icon: BaconSVG, zIndex: 25, price: 2.00 },
    { id: "anchovies", name: "Anchoas", icon: AnchovySVG, zIndex: 35, price: 2.50 },
];

export function PizzaBuilder() {
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const addItem = useCartStore((state) => state.addItem);

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
        if (selectedIngredients.length === 0) {
            toast.error("¡Agrega al menos un ingrediente!");
            return;
        }

        const basePrice = 10;
        const ingredientsPrice = selectedIngredients.reduce((acc, id) => {
            const ing = INGREDIENTS.find(i => i.id === id);
            return acc + (ing ? ing.price : 0);
        }, 0);
        const totalPrice = basePrice + ingredientsPrice;

        const ingredientNames = selectedIngredients
            .map(id => INGREDIENTS.find(i => i.id === id)?.name)
            .join(", ");

        addItem({
            id: `custom-pizza-${Date.now()}`,
            name: "Pizza Personalizada",
            description: `Ingredientes: ${ingredientNames}`,
            price: totalPrice,
            image: "/images/pizza-custom.png", // Fallback or placeholder
            category: "Personalizada"
        });

        toast.success("¡Tu Pizza Personalizada ha sido agregada al carrito! 🛒");
        resetBuilder();
    };

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm">Tu Obra Maestra</span>
                    <h2 className="font-heading text-4xl md:text-5xl font-black text-[#0F172A] mt-2">
                        Arma tu Pizza <span className="text-primary">Perfecta</span>
                    </h2>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                        Selecciona tus ingredientes favoritos. Nosotros ponemos la pasión.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Visualizer */}
                    <div className="relative flex items-center justify-center h-[400px] md:h-[500px] perspective-1000">
                        {/* Pizza Base */}
                        <motion.div
                            initial={{ rotateX: 20, scale: 0.9 }}
                            animate={{ rotateX: 0, scale: 1 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px]"
                        >
                            <PizzaBaseSVG />

                            {/* Ingredients Layers */}
                            <AnimatePresence>
                                {INGREDIENTS.map((ing) => (
                                    selectedIngredients.includes(ing.id) && (
                                        <motion.div
                                            key={ing.id}
                                            initial={{ opacity: 0, scale: 1.5, y: -50 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="absolute inset-0 pointer-events-none"
                                            style={{ zIndex: ing.zIndex }}
                                        >
                                            {/* Scattered Ingredients */}
                                            {Array.from({ length: 12 }).map((_, i) => {
                                                // Get index of current ingredient type for offset
                                                const ingIndex = INGREDIENTS.findIndex(Item => Item.id === ing.id);

                                                // Deterministic random positions with offset per ingredient type
                                                // We use a different prime number multiplier for each layer to avoid patterns aligning
                                                const seed = i + (ingIndex * 100);

                                                // Fibonacci spiral distribution for even coverage
                                                const goldenRatio = 0.618033988749895;
                                                const angle = 2 * Math.PI * goldenRatio * seed;

                                                // Distribute distance from center (leave gap in middle and don't touch edges)
                                                // root(i) provides better area distribution than just i
                                                const maxRadius = 40; // max % from center
                                                const minRadius = 10;
                                                const normalizedDist = Math.sqrt((i + 1) / 12);
                                                const dist = minRadius + (normalizedDist * (maxRadius - minRadius));

                                                // Add some "jitter" so it's not a perfect mathematical spiral
                                                const jitterX = Math.sin(seed * 11) * 5;
                                                const jitterY = Math.cos(seed * 7) * 5;

                                                const top = 50 + (Math.sin(angle) * dist) + jitterY + '%';
                                                const left = 50 + (Math.cos(angle) * dist) + jitterX + '%';

                                                return (
                                                    <div
                                                        key={i}
                                                        className="absolute w-8 h-8 md:w-12 md:h-12"
                                                        style={{
                                                            top,
                                                            left,
                                                            transform: `translate(-50%, -50%) rotate(${seed * 45}deg)`,
                                                        }}
                                                    >
                                                        <ing.icon />
                                                    </div>
                                                );
                                            })}
                                        </motion.div>
                                    )
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Floating Price Tag */}
                        <motion.div
                            layout
                            className="absolute -bottom-6 md:bottom-10 right-0 md:-right-4 bg-white px-6 py-4 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center"
                        >
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</span>
                            <span className="text-4xl font-black text-[#0F172A] font-heading">
                                ${(10 + selectedIngredients.reduce((acc, id) => {
                                    const ing = INGREDIENTS.find(i => i.id === id);
                                    return acc + (ing ? ing.price : 0);
                                }, 0)).toFixed(2)}
                            </span>
                        </motion.div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100/50">
                            <h3 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                                Elige tus Ingredientes
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {INGREDIENTS.map((ing) => {
                                    const isSelected = selectedIngredients.includes(ing.id);
                                    return (
                                        <motion.button
                                            key={ing.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => toggleIngredient(ing.id)}
                                            className={`
                                                relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 text-center group
                                                ${isSelected
                                                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                                                    : 'border-gray-100 bg-gray-50/50 hover:border-primary/30 hover:bg-white'
                                                }
                                            `}
                                        >
                                            <div className="w-8 h-8 relative flex-shrink-0 text-primary">
                                                <ing.icon />
                                            </div>
                                            <div className="flex-1 flex flex-col">
                                                <span className={`block font-bold text-xs ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                                                    {ing.name}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    +${ing.price.toFixed(2)}
                                                </span>
                                            </div>
                                            {isSelected && (
                                                <div className="bg-primary text-white p-0.5 rounded-full absolute top-2 right-2 shadow-sm">
                                                    <Check className="w-2 h-2" />
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                className="flex-1 bg-gradient-to-r from-primary to-orange-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <ShoppingCart className="w-6 h-6" />
                                Agregar al Pedido
                            </motion.button>
                            <motion.button
                                whileHover={{ rotate: 180 }}
                                onClick={resetBuilder}
                                className="p-5 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl hover:text-gray-600 hover:border-gray-200 transition-colors shadow-sm"
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
