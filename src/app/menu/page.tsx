import { MenuBuilder } from "@/components/menu/MenuBuilder";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Disable cache for now to see updates immediately

async function getMenuData() {
    // Fetch Categories
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('order_index');

    // Fetch Products
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true) // Only available items? Or let MenuBuilder filter?
        .order('created_at', { ascending: false });

    // Map DB products to Frontend Product Interface
    const mappedProducts = products?.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        category: p.category_id, // Map category_id -> category
        image: p.image_url || "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400", // Fallback image
        isPopular: p.is_popular,
        isSpicy: p.is_spicy,
        variants: p.variants,
        // baseIngredients: [], // Add if DB supports it
    })) || [];

    // Map DB categories
    const mappedCategories = categories?.map(c => ({
        id: c.id,
        name: c.name
    })) || [];

    return {
        categories: mappedCategories,
        products: mappedProducts
    };
}

export default async function MenuPage() {
    const { categories, products } = await getMenuData();
    return <MenuBuilder categories={categories} initialProducts={products} />;
}
