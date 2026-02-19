"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types";
import { extraIngredients } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { Modal } from "@/components/ui/modal";

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const addItem = useCartStore((state) => state.addItem);
    const setCartOpen = useCartStore((state) => state.setCartOpen);

    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [quantity, setQuantity] = useState(1);

    // Reset state when product changes
    useEffect(() => {
        if (isOpen) {
            setSelectedIngredients([]);
            setQuantity(1);
        }
    }, [isOpen, product]);

    if (!product) return null;

    const basePrice = product.price;
    const ingredientsTotal = selectedIngredients.reduce((total, ingredientId) => {
        const ingredient = extraIngredients.find(i => i.id === ingredientId);
        return total + (ingredient ? ingredient.price : 0);
    }, 0);

    const unitPrice = basePrice + ingredientsTotal;
    const totalPrice = unitPrice * quantity;

    const toggleIngredient = (id: string) => {
        setSelectedIngredients(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handleAddToCart = () => {
        // Construct description with extras
        const extrasNames = selectedIngredients
            .map(id => extraIngredients.find(i => i.id === id)?.name)
            .filter(Boolean)
            .join(", ");

        const fullDescription = extrasNames
            ? `${product.description} \n+ Extras: ${extrasNames}`
            : product.description;

        // Add item to cart with custom price and ID
        // Note: In a real app, you might want a unique ID per customization
        // For simplicity, we'll append timestamp or similar if needed, 
        // but store currently aggregates by ID. If we want separate items for custom pizzas,
        // we might need to generate a composite ID.
        const customId = selectedIngredients.length > 0
            ? `${product.id}-custom-${Date.now()}`
            : product.id;

        addItem({
            id: customId,
            name: product.name,
            price: unitPrice, // Using unit price as store likely handles quantity multiplication
            image: product.image,
            category: product.category,
            description: fullDescription,
            // Pass quantity if store supports adding multiple at once, 
            // otherwise loop or update store to accept quantity
        });

        // Since the current addItem doesn't accept quantity, we might need to call it multiple times 
        // OR update the store. For now, let's assume single add or update usage.
        // If the store only adds 1, we Loop? No, let's just add one for now or 
        // update the store to accept quantity in a future step if strictly needed.
        // Actually, looking at store.ts: addItem takes Omit<CartItem, "quantity"> and sets qty to 1.
        // To support quantity, we'd need to loop or modify store. 
        // Let's loop for now to be safe without touching store logic yet.
        for (let i = 1; i < quantity; i++) {
            addItem({
                id: customId,
                name: product.name,
                price: unitPrice,
                image: product.image,
                category: product.category,
                description: fullDescription
            });
        }

        toast.success(`Agregado: ${product.name} ${extrasNames ? "(con extras)" : ""}`);
        onClose();
        setCartOpen(true);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="w-full md:w-1/2 relative min-h-[250px] md:min-h-full bg-gray-100">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:hidden">
                        <h2 className="text-3xl font-black text-white">{product.name}</h2>
                    </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-6 flex flex-col">
                    <div className="hidden md:block mb-4">
                        <h2 className="text-3xl font-black text-gray-900 mb-2">{product.name}</h2>
                        <p className="text-gray-500 text-sm">{product.description}</p>
                    </div>

                    <div className="md:hidden mb-6">
                        <p className="text-gray-500 text-sm">{product.description}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            Personaliza tu pizza
                            <span className="text-xs font-normal text-gray-400">(Opcional)</span>
                        </h3>

                        <div className="space-y-3">
                            {extraIngredients.map((ingredient) => (
                                <label
                                    key={ingredient.id}
                                    className={`
                                        flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all
                                        ${selectedIngredients.includes(ingredient.id)
                                            ? "border-[#FF5722] bg-orange-50"
                                            : "border-gray-100 hover:border-orange-200"
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                            w-5 h-5 rounded border flex items-center justify-center transition-colors
                                            ${selectedIngredients.includes(ingredient.id)
                                                ? "bg-[#FF5722] border-[#FF5722]"
                                                : "border-gray-300"
                                            }
                                        `}>
                                            {selectedIngredients.includes(ingredient.id) && (
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="font-medium text-gray-700">{ingredient.name}</span>
                                    </div>
                                    <span className="font-bold text-[#FF5722]">
                                        +${ingredient.price.toFixed(2)}
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={selectedIngredients.includes(ingredient.id)}
                                        onChange={() => toggleIngredient(ingredient.id)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-4">
                        {/* Quantity & Total */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-[#FF5722] disabled:opacity-50"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold text-gray-900 w-4 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-[#FF5722]"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total</p>
                                <p className="text-2xl font-black text-[#FF5722]">${totalPrice.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-[#FF5722] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Agregar al Pedido
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
