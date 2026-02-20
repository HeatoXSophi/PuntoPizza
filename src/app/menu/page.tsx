import { MenuBuilder } from "@/components/menu/MenuBuilder";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Disable cache for now to see updates immediately

async function getMenuData() {
    if (!supabase) return { categories: [], products: [] };

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
        products: mappedProducts,
        debugError: null,
        rawCount: products?.length ?? 0
    };
}

export default async function MenuPage() {
    const { categories, products, debugError, rawCount } = await getMenuData();

    // DEBUG MODE: If products are empty, show diagnostic info
    if (products.length === 0) {
        return (
            <div className="p-8 bg-red-50 text-red-800">
                <h2 className="text-xl font-bold mb-4">⚠️ Modo Diagnóstico: Menú Vacío</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Conexión Supabase:</strong> {supabase ? "✅ Activa" : "❌ FALLÓ (Variable es null)"}</li>
                    <li><strong>Productos encontrados en DB:</strong> {rawCount}</li>
                    <li><strong>Error de Debug:</strong> {JSON.stringify(debugError)}</li>
                </ul>
                <div className="mt-6 border-t border-red-200 pt-4">
                    <p className="mb-2 font-semibold">Intentando cargar interfaz de todas formas:</p>
                    <MenuBuilder categories={categories} initialProducts={products} />
                </div>
            </div>
        );
    }

    return <MenuBuilder categories={categories} initialProducts={products} />;
}
