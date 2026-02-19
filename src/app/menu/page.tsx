import { supabase } from "@/lib/supabase";
import { MenuBuilder } from "@/components/menu/MenuBuilder";
import { Category, Product } from "@/types";

export const revalidate = 60; // Revalidate every minute

export default async function MenuPage() {
    if (!supabase) {
        console.error("Supabase client is null");
        return <MenuBuilder categories={[]} initialProducts={[]} />;
    }

    // Parallel fetch
    const [categoriesResult, productsResult] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order", { ascending: true }),
        supabase.from("products").select("*").eq("available", true)
    ]);

    const categories: Category[] = categoriesResult.data || [];

    // Map database fields to UI types
    const products: Product[] = (productsResult.data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category_id, // Map database column to UI prop
        image: p.image_url || "https://images.unsplash.com/photo-1513104890138-7c749659a591",
        available: p.available
    }));

    return <MenuBuilder categories={categories} initialProducts={products} />;
}
