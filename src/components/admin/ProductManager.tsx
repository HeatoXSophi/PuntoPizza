"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Camera, Trash2, Plus, Edit2, Save, X } from "lucide-react";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category_id: string;
    image_url?: string;
    is_available: boolean;
}

interface Category {
    id: string;
    name: string;
}

export function ProductManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Initial load
    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data: cats } = await supabase.from("categories").select("*").order("name");
            const { data: prods } = await supabase.from("products").select("*").order("created_at", { ascending: false });

            setCategories(cats || []);
            setProducts(prods || []);
        } catch (error) {
            toast.error("Error cargando datos");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(product: Product) {
        if (!supabase) return;
        try {
            let error;
            if (isCreating) {
                // Remove ID to let DB generate UUID
                const { id, ...newProduct } = product;
                const { error: insertError } = await supabase.from("products").insert(newProduct);
                error = insertError;
            } else {
                const { error: updateError } = await supabase.from("products").update(product).eq("id", product.id);
                error = updateError;
            }

            if (error) throw error;
            toast.success(isCreating ? "Producto creado" : "Producto actualizado");
            setEditingProduct(null);
            setIsCreating(false);
            fetchData();
        } catch (e) {
            console.error(e);
            toast.error("Error al guardar");
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
        if (!supabase) return;

        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) toast.error("Error al eliminar");
        else {
            toast.success("Producto eliminado");
            fetchData();
        }
    }

    async function handleImageUpload(file: File, productId: string) {
        if (!supabase) return;
        try {
            setUploading(productId);
            const fileExt = file.name.split('.').pop();
            const fileName = `product-${productId}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            // 3. Update Product Record
            // If we are editing, update state. If not (list view), update DB directly? 
            // For simplicity, let's assume we upload images ONLY when editing/creating or directly from list.
            // Let's support direct upload from list for simplicity like CategoryManager.

            const { error: updateError } = await supabase
                .from('products')
                .update({ image_url: publicUrl })
                .eq('id', productId);

            if (updateError) throw updateError;

            toast.success("Imagen actualizada");
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Error subiendo imagen");
        } finally {
            setUploading(null);
        }
    }

    if (editingProduct) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">{isCreating ? "Nuevo Producto" : "Editar Producto"}</h3>
                    <button onClick={() => { setEditingProduct(null); setIsCreating(false); }} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Nombre</label>
                        <input
                            className="w-full border p-2 rounded"
                            value={editingProduct.name}
                            onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Descripción</label>
                        <textarea
                            className="w-full border p-2 rounded"
                            value={editingProduct.description || ""}
                            onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Precio ($)</label>
                            <input
                                type="number"
                                className="w-full border p-2 rounded"
                                value={editingProduct.price}
                                onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Categoría</label>
                            <select
                                className="w-full border p-2 rounded"
                                value={editingProduct.category_id || ""}
                                onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                            >
                                <option value="">Seleccionar...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={() => handleSave(editingProduct)}
                        className="w-full bg-[#FF5722] text-white font-bold py-3 rounded-lg hover:bg-[#F4511E] flex justify-center gap-2"
                    >
                        <Save className="w-5 h-5" /> Guardar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#5D4037]">Gestión de Productos</h2>
                <button
                    onClick={() => {
                        setEditingProduct({ id: "", name: "", description: "", price: 0, category_id: categories[0]?.id || "", is_available: true });
                        setIsCreating(true);
                    }}
                    className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-green-100"
                >
                    <Plus className="w-4 h-4" /> Nuevo
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {products.map((prod) => (
                        <div key={prod.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            {/* Image Uploader */}
                            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group">
                                {prod.image_url ? (
                                    <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Camera className="w-6 h-6" />
                                    </div>
                                )}

                                {/* Overlay Upload Input */}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                    {uploading === prod.id ? (
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    ) : (
                                        <Camera className="w-5 h-5 text-white" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(file, prod.id);
                                        }}
                                        disabled={!!uploading}
                                    />
                                </label>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800">{prod.name}</h3>
                                <p className="text-xs text-gray-500 line-clamp-1">{prod.description}</p>
                                <p className="text-sm font-bold text-[#FF5722]">${prod.price}</p>
                            </div>

                            <div className="flex gap-1">
                                <button onClick={() => setEditingProduct(prod)} className="text-blue-400 hover:text-blue-600 p-2">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(prod.id)} className="text-red-400 hover:text-red-600 p-2">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <p className="text-center text-gray-400 py-4 text-sm">No hay productos. Usa la herramienta de migración arriba.</p>
                    )}
                </div>
            )}
        </div>
    );
}
