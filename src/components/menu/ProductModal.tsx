"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";
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

    // State for extra ingredients
    const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
    // State for removed base ingredients
    const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
    const [quantity, setQuantity] = useState(1);

    // Reset state when product changes
    useEffect(() => {
        if (isOpen) {
            setSelectedExtras([]);
            setRemovedIngredients([]);
            setQuantity(1);
        }
    }, [isOpen, product]);

    if (!product) return null;

    const basePrice = product.price;
    const extrasTotal = selectedExtras.reduce((total, ingredientId) => {
        const ingredient = extraIngredients.find(i => i.id === ingredientId);
        return total + (ingredient ? ingredient.price : 0);
    }, 0);

    const unitPrice = basePrice + extrasTotal;
    const totalPrice = unitPrice * quantity;

    const toggleExtra = (id: string) => {
        setSelectedExtras(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const toggleRemoveIngredient = (ingredientName: string) => {
        setRemovedIngredients(prev =>
            prev.includes(ingredientName)
                ? prev.filter(i => i !== ingredientName)
                : [...prev, ingredientName]
        );
    };

    const handleAddToCart = () => {
        // Construct description 
        let finalDescription = product.description;
        const notes = [];

        if (removedIngredients.length > 0) {
            notes.push(`Sin: ${removedIngredients.join(", ")}`);
        }

        const extrasNames = selectedExtras
            .map(id => extraIngredients.find(i => i.id === id)?.name)
            .filter(Boolean)
            .join(", ");

        if (extrasNames) {
            notes.push(`Extras: ${extrasNames}`);
        }

        if (notes.length > 0) {
            finalDescription += ` (${notes.join(" | ")})`;
        }

        const customId = (selectedExtras.length > 0 || removedIngredients.length > 0)
            ? `${product.id}-cust-${Date.now()}`
            : product.id;

        // Loop for quantity
        for (let i = 0; i < quantity; i++) {
            addItem({
                id: customId, // Note: with loop same ID might be issue if logic merges, but here timestamp helps unique batch
                name: product.name,
                price: unitPrice,
                image: product.image,
                category: product.category,
                description: finalDescription
            });
        }

        toast.success(`Agregado: ${product.name}`);
        onClose();
        setCartOpen(true);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col h-full bg-white">
                {/* Header Image */}
                <div className="relative w-full h-[250px] shrink-0">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        {/* Mobile Title Overlay */}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-5 pb-32"> {/* Padding bottom for sticky footer */}
                        {/* Title & Desc */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-black text-gray-900 mb-1">{product.name}</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>

                            {/* Centralized Quantity & Price */}
                            <div className="flex items-center justify-center gap-4 mt-4">
                                <div className="bg-[#FFF8E1] px-4 py-1 rounded-full border border-orange-200">
                                    <span className="text-xl font-black text-gray-900">${basePrice.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#FF9800] text-[#FF9800] font-bold hover:bg-orange-50 transition-colors"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="text-lg font-bold w-4 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#FF9800] text-[#FF9800] font-bold hover:bg-orange-50 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ELIMINAR INGREDIENTES */}
                        {product.baseIngredients && product.baseIngredients.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-black text-gray-900 border-b pb-2 mb-4 uppercase text-sm tracking-wider">
                                    Eliminar Ingredientes
                                </h3>
                                <div className="space-y-2 bg-orange-50/50 p-2 rounded-xl">
                                    {product.baseIngredients.map((ing) => (
                                        <div key={ing} className="flex items-center justify-between p-2">
                                            <span className={`text-gray-700 font-medium ${removedIngredients.includes(ing) ? "line-through text-gray-400" : ""}`}>
                                                {ing}
                                            </span>
                                            <button
                                                onClick={() => toggleRemoveIngredient(ing)}
                                                className={`
                                                    px-4 py-1 rounded-full text-xs font-bold transition-all
                                                    ${removedIngredients.includes(ing)
                                                        ? "bg-gray-200 text-gray-500 hover:bg-gray-300"
                                                        : "bg-[#FF9800] text-white hover:bg-[#F57C00] shadow-sm"
                                                    }
                                                `}
                                            >
                                                {removedIngredients.includes(ing) ? "AGREGAR" : "ELIMINAR"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AGREGAR INGREDIENTES */}
                        <div>
                            <h3 className="font-black text-gray-900 border-b pb-2 mb-4 uppercase text-sm tracking-wider">
                                Agregar Ingredientes (Max. 10)
                            </h3>
                            <div className="space-y-1">
                                {extraIngredients.map((ingredient) => (
                                    <div
                                        key={ingredient.id}
                                        className={`
                                            flex items-center justify-between p-3 rounded-lg border transition-all
                                            ${selectedExtras.includes(ingredient.id)
                                                ? "bg-green-50 border-green-200"
                                                : "bg-gray-50 border-transparent hover:bg-gray-100"
                                            }
                                        `}
                                    >
                                        <span className="font-medium text-gray-700">{ingredient.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-gray-900 text-sm">
                                                {ingredient.price.toFixed(2)}€
                                            </span>
                                            <button
                                                onClick={() => toggleExtra(ingredient.id)}
                                                className={`
                                                    px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1
                                                    ${selectedExtras.includes(ingredient.id)
                                                        ? "bg-red-500 text-white hover:bg-red-600"
                                                        : "bg-[#FF9800] text-white hover:bg-[#F57C00] shadow-sm"
                                                    }
                                                `}
                                            >
                                                {selectedExtras.includes(ingredient.id) ? "QUITAR" : "AÑADE"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer Button */}
                <div className="absolute bottom-0 left-0 w-full bg-white border-t p-4 shadow-2xl z-20">
                    <button
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                    >
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-900">
                            <ShoppingCart className="w-5 h-5 fill-current" />
                        </div>
                        <span>AGREGAR AL PEDIDO</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                            ${totalPrice.toFixed(2)}
                        </span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}
