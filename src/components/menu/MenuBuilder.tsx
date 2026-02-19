"use client";

import { useState } from "react";
import { ProductCard } from "@/components/menu/ProductCard";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { Category, Product } from "@/types";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { DICTIONARY } from "@/lib/dictionary";

interface MenuBuilderProps {
    categories: Category[];
    initialProducts: Product[];
}

export function MenuBuilder({ categories, initialProducts }: MenuBuilderProps) {
    const { language } = useCartStore();
    const t = DICTIONARY[language || "es"] || DICTIONARY.es;
    const [activeCategory, setActiveCategory] = useState("all");

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

    // TODO: We need to ensure products have these categories
    const categoriesWithLabels = menuCategories.map(c => ({
        id: c.id,
        name: t[c.label as keyof typeof t] || c.label // Dynamic translation
    }));

    // We filter from the initial products passed from server
    // No need for client-side fetching anymore!
    const filteredProducts = activeCategory === "all"
        ? initialProducts
        : initialProducts.filter(p => p.category === activeCategory);

    return (
        <div className="pb-24">
            {/* Page Header */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <h1 className="text-2xl font-black text-[#5D4037] mb-4">
                    {t.menu_title || "Nuestro Menú"}
                </h1>

                {/* Category Tabs */}
                <CategoryTabs
                    categories={categoriesWithLabels}
                    activeCategory={activeCategory}
                    onSelectCategory={setActiveCategory}
                />
            </div>

            {/* Content */}
            <div className="p-4 bg-[#FFF8E1] min-h-[calc(100vh-180px)]">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            description={product.description}
                            price={product.price}
                            category={product.category}
                            image={product.image}
                        />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="mb-2">No hay productos en esta categoría.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

