"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Camera, Trash2, Plus, Edit2, Save, X, Eye, EyeOff, Flame } from "lucide-react";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category_id: string;
    image_url?: string;
    is_available: boolean;
    is_popular?: boolean;
    is_spicy?: boolean;
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
            // Validate
            if (!product.name || !product.price || !product.category_id) {
                toast.error("Nombre, Precio y Categoría son obligatorios");
                return;
            }

            if (isCreating) {
                // Remove ID to let DB generate UUID if it's empty string
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
        } catch (e: any) {
            console.error(e);
            toast.error("Error al guardar: " + e.message);
        }
    }

    async function toggleAvailability(product: Product) {
        if (!supabase) return;
        try {
            const { error } = await supabase.from("products").update({ is_available: !product.is_available }).eq("id", product.id);
            if (error) throw error;

            // Optimistic update
            setProducts(products.map(p => p.id === product.id ? { ...p, is_available: !p.is_available } : p));
            toast.success(product.is_available ? "Producto desactivado" : "Producto activado");
        } catch (e) {
            toast.error("Error al actualizar estado");
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
            setUploading(productId === "creating" ? "editing" : productId);
            const fileExt = file.name.split('.').pop();
            const fileName = `product-${productId.replace(/[^a-zA-Z0-9-]/g, '')}-${Date.now()}.${fileExt}`;
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

            // 3. Update Record vs State
            if (isCreating || editingProduct?.id === productId || productId.startsWith("temp-")) {
                // Update state only (user must click Save later, or we auto-save? Better to just update state for now)
                setEditingProduct(prev => prev ? ({ ...prev, image_url: publicUrl }) : null);
                toast.success("Foto subida (Recuerda Guardar)");
            } else {
                // Direct update for list view
                const { error: updateError } = await supabase
                    .from('products')
                    .update({ image_url: publicUrl })
                    .eq('id', productId);

                if (updateError) throw updateError;
                toast.success("Imagen actualizada");
                fetchData();
            }
        } catch (error) {
            console.error(error);
            toast.error("Error subiendo imagen");
        } finally {
            setUploading(null);
        }
    }

    if (editingProduct) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h3 className="font-bold text-xl text-gray-800">{isCreating ? "Nuevo Producto" : "Editar Producto"}</h3>
                    <button onClick={() => { setEditingProduct(null); setIsCreating(false); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                    </button>
                </div>

                <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-600 mb-1">Nombre del Producto</label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all outline-none"
                                value={editingProduct.name}
                                onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                placeholder="Ej: Pizza Margarita"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-600 mb-1">Descripción</label>
                            <textarea
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all outline-none"
                                value={editingProduct.description || ""}
                                onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                rows={3}
                                placeholder="Ingredientes, detalles, etc..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">Precio ($)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400">$</span>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 p-3 pl-8 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all outline-none"
                                    value={editingProduct.price}
                                    onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">Categoría</label>
                            <select
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all outline-none bg-white"
                                value={editingProduct.category_id || ""}
                                onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                            >
                                <option value="">Seleccionar Categoría...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2 border-t mt-4">
                        <label className="flex items-center gap-2 cursor-pointer p-2 border rounded hover:bg-gray-50 flex-1 justify-center">
                            <input
                                type="checkbox"
                                checked={editingProduct.is_popular || false}
                                onChange={e => setEditingProduct({ ...editingProduct, is_popular: e.target.checked })}
                                className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                            />
                            <span className="font-medium text-gray-700">⭐ Destacado</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer p-2 border rounded hover:bg-gray-50 flex-1 justify-center">
                            <input
                                type="checkbox"
                                checked={editingProduct.is_spicy || false}
                                onChange={e => setEditingProduct({ ...editingProduct, is_spicy: e.target.checked })}
                                className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                            />
                            <span className="font-medium text-gray-700"><Flame className="w-4 h-4 inline text-red-500" /> Picante</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer p-2 border rounded hover:bg-gray-50 flex-1 justify-center">
                            <input
                                type="checkbox"
                                checked={editingProduct.is_available}
                                onChange={e => setEditingProduct({ ...editingProduct, is_available: e.target.checked })}
                                className="w-5 h-5 text-green-500 rounded focus:ring-green-500"
                            />
                            <span className="font-medium text-gray-700">✅ Disponible</span>
                        </label>
                    </div>

                    <button
                        onClick={() => handleSave(editingProduct)}
                        className="w-full bg-[#FF5722] text-white font-bold py-4 rounded-xl hover:bg-[#F4511E] shadow-lg shadow-orange-200 flex justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                        <Save className="w-5 h-5" /> Guardar Producto
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
                    className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-green-100 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" /> Nuevo Producto
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                </div>
            ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {products.map((prod) => (
                        <div key={prod.id} className={`flex items-center gap-4 p-3 border rounded-xl transition-all duration-200 ${!prod.is_available ? 'bg-gray-50 opacity-75' : 'bg-white hover:border-orange-200 hover:shadow-md'}`}>
                            {/* Image Uploader */}
                            <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group shadow-inner">
                                {prod.image_url ? (
                                    <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Camera className="w-8 h-8" />
                                    </div>
                                )}

                                {/* Overlay Upload Input */}
                                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-[1px]">
                                    {uploading === prod.id ? (
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    ) : (
                                        <Camera className="w-6 h-6 text-white" />
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

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-800 truncate">{prod.name}</h3>
                                    {!prod.is_available && <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 rounded font-bold">AGOTADO</span>}
                                    {prod.is_popular && <span className="text-[10px] bg-yellow-100 text-yellow-600 px-1.5 rounded font-bold">TOP</span>}
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-1">{prod.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm font-bold text-[#FF5722] bg-orange-50 px-2 rounded-md">${prod.price}</span>
                                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 rounded-full">{categories.find(c => c.id === prod.category_id)?.name}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => toggleAvailability(prod)}
                                    title={prod.is_available ? "Marcar como agotado" : "Marcar como disponible"}
                                    className={`p-2 rounded-lg transition-colors ${prod.is_available ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    {prod.is_available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <button onClick={() => setEditingProduct(prod)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(prod.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
                            <p className="text-gray-400 mb-2">No hay productos aún.</p>
                            <p className="text-xs text-gray-500">Usa el botón "Nuevo Producto" o la Migración.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
