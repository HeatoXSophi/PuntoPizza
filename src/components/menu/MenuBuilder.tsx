"use client";

import { useState } from "react";
import { ProductCard } from "@/components/menu/ProductCard";
import { ProductModal } from "@/components/menu/ProductModal";
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
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // ... existing code ...

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
                            onClick={() => setSelectedProduct(product)}
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

