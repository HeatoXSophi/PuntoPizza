"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/menu/ProductCard";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Define types locally
interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
}

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Check if supabase is configured
                if (!supabase) {
                    console.error("Supabase client is null. Check environment variables.");
                    toast.error("Error de configuración de base de datos.");
                    setProducts([]); // Ensure products is empty so fallback UI shows
                    setCategories([]);
                    setLoading(false);
                    return;
                }

                setLoading(true);
                // 1. Fetch Categories
                const { data: catData, error: catError } = await supabase
                    .from("categories")
                    .select("*")
                    .order("sort_order", { ascending: true });

                if (catError) {
                    console.error("Supabase Categories Error:", catError);
                    // Don't throw here, try to load products anyway or use fallback
                }

                // 2. Fetch Products
                const { data: prodData, error: prodError } = await supabase
                    .from("products")
                    .select("*")
                    .eq("available", true);

                if (prodError) {
                    console.error("Supabase Products Error:", prodError);
                    throw prodError;
                }

                // 3. Map Database fields to UI types
                if (catData && catData.length > 0) {
                    setCategories(catData);
                } else {
                    // Fallback if DB is empty or connection fails
                    setCategories([]);
                }

                if (prodData) {
                    const mappedProducts = prodData.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        category: p.category_id, // Map database column to UI prop
                        image: p.image_url || "https://images.unsplash.com/photo-1513104890138-7c749659a591" // Fallback image
                    }));
                    setProducts(mappedProducts);
                }

            } catch (error: any) {
                console.error("Error fetching menu:", error);
                toast.error("Conectando con base de datos...");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const filteredProducts = activeCategory === "all"
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="pb-24">
            {/* Page Header */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <h1 className="text-2xl font-black text-[#5D4037] mb-4">Nuestro Menú</h1>

                {/* Category Tabs */}
                {/* Only show tabs if we have categories, otherwise show loading skeleton or nothing */}
                <CategoryTabs
                    categories={[{ id: "all", name: "Todos" }, ...categories]}
                    activeCategory={activeCategory}
                    onSelectCategory={setActiveCategory}
                />
            </div>

            {/* Content */}
            <div className="p-4 bg-[#FFF8E1] min-h-[calc(100vh-180px)]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[#FF5722]">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p className="font-bold">Cargando menú en vivo...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                image={product.image}
                            />
                        ))}
                    </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="mb-2">No hay productos disponibles.</p>
                        <p className="text-sm">Si eres el dueño, visita <code>/api/seed</code> para cargar los datos iniciales.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
