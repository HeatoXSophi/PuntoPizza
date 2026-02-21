"use client";

import { useState } from "react";
import { ProductCard } from "@/components/menu/ProductCard";
import { ProductModal } from "@/components/menu/ProductModal";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { Category, Product } from "@/types";
import { Search, X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { DICTIONARY } from "@/lib/dictionary";

interface MenuBuilderProps {
    categories: Category[];
    initialProducts: Product[];
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div className="w-full aspect-square bg-gray-200" />
            <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
        </div>
    );
}

export function MenuBuilder({ categories, initialProducts }: MenuBuilderProps) {
    const { language } = useCartStore();
    const t = DICTIONARY[language || "es"] || DICTIONARY.es;
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

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

    const categoriesWithLabels = menuCategories.map(c => ({
        id: c.id,
        name: t[c.label as keyof typeof t] || c.label
    }));

    // Filter by category
    let filteredProducts = activeCategory === "all"
        ? initialProducts
        : initialProducts.filter(p => p.category === activeCategory);

    // Filter by search query
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
    }

    const isLoading = initialProducts.length === 0 && !searchQuery;

    return (
        <div className="pb-24">
            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />

            {/* Page Header */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <h1 className="text-2xl font-black text-[#5D4037] mb-3">
                    {t.menu_title || "Nuestro Menú"}
                </h1>

                {/* Search Bar */}
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={language === "en" ? "Search products..." : "Buscar productos..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Category Tabs */}
                <CategoryTabs
                    categories={categoriesWithLabels}
                    activeCategory={activeCategory}
                    onSelectCategory={(cat) => {
                        setActiveCategory(cat);
                        setSearchQuery("");
                    }}
                />
            </div>

            {/* Content */}
            <div className="p-4 bg-[#FFF8E1] min-h-[calc(100vh-180px)]">
                {/* Skeleton Loading State */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : (
                    <>
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
                                    onClick={() => setSelectedProduct(product)}
                                />
                            ))}
                        </div>
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                {searchQuery ? (
                                    <div>
                                        <p className="text-lg mb-2">🔍</p>
                                        <p className="mb-1">
                                            {language === "en"
                                                ? `No results for "${searchQuery}"`
                                                : `Sin resultados para "${searchQuery}"`
                                            }
                                        </p>
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="text-[#FF5722] font-medium text-sm hover:underline"
                                        >
                                            {language === "en" ? "Clear search" : "Limpiar búsqueda"}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="mb-2">
                                        {language === "en"
                                            ? "No products in this category."
                                            : "No hay productos en esta categoría."
                                        }
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
