"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Camera, Trash2, Plus, Edit2, Save, X } from "lucide-react";

interface Category {
    id: string;
    name: string;
    image_url?: string;
    order_index?: number;
}

export function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);

    // Edit/Create State
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase.from("categories").select("*").order("order_index", { ascending: true });
        if (error) {
            toast.error("Error cargando categorías");
        } else {
            setCategories(data || []);
        }
        setLoading(false);
    }

    async function handleSave() {
        if (!supabase || !editingCategory) return;

        try {
            if (isCreating) {
                // For simplified ID generation, we'll url-friendly the name if id is empty, or just use name as id
                // But normally we want a clean ID. Let's auto-generate from name.
                const newId = editingCategory.id || editingCategory.name.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                const { error } = await supabase.from("categories").insert({
                    id: newId,
                    name: editingCategory.name,
                    order_index: editingCategory.order_index || 0,
                    image_url: editingCategory.image_url
                });
                if (error) throw error;
                toast.success("Categoría creada");
            } else {
                const { error } = await supabase.from("categories").update({
                    name: editingCategory.name,
                    order_index: editingCategory.order_index
                }).eq('id', editingCategory.id);
                if (error) throw error;
                toast.success("Categoría actualizada");
            }

            setEditingCategory(null);
            setIsCreating(false);
            fetchCategories();
        } catch (error: any) {
            console.error(error);
            toast.error("Error al guardar: " + error.message);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("¿Seguro que quieres eliminar esta categoría? Esto podría afectar a los productos asociados.")) return;
        if (!supabase) return;

        const { error } = await supabase.from("categories").delete().eq('id', id);
        if (error) {
            toast.error("No se pudo eliminar (¿Tiene productos?)");
        } else {
            toast.success("Categoría eliminada");
            fetchCategories();
        }
    }

    async function handleImageUpload(file: File, categoryId: string) {
        if (!supabase) return;
        try {
            setUploading(categoryId);
            const fileExt = file.name.split('.').pop();
            const fileName = `category-${categoryId}-${Date.now()}.${fileExt}`;
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

            // 3. Update Category Record
            const { error: updateError } = await supabase
                .from('categories')
                .update({ image_url: publicUrl })
                .eq('id', categoryId);

            if (updateError) throw updateError;

            toast.success("Imagen actualizada");
            fetchCategories(); // Refresh list
        } catch (error) {
            console.error(error);
            toast.error("Error subiendo imagen");
        } finally {
            setUploading(null);
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#5D4037]">Gestión de Categorías</h2>
                <button
                    onClick={() => {
                        setEditingCategory({ id: "", name: "", order_index: categories.length + 10 });
                        setIsCreating(true);
                    }}
                    className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-blue-100"
                >
                    <Plus className="w-4 h-4" /> Nueva
                </button>
            </div>

            {/* Edit/Create Form */}
            {(isCreating || editingCategory) && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700">{isCreating ? "Nueva Categoría" : "Editar Categoría"}</h3>
                        <button onClick={() => { setEditingCategory(null); setIsCreating(false); }} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                            <input
                                value={editingCategory?.name || ""}
                                onChange={(e) => setEditingCategory(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                                className="w-full p-2 border rounded bg-white"
                                placeholder="Ej: Bebidas"
                            />
                        </div>
                        {isCreating && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ID (Automático si se deja vacío)</label>
                                <input
                                    value={editingCategory?.id || ""}
                                    onChange={(e) => setEditingCategory(prev => prev ? ({ ...prev, id: e.target.value }) : null)}
                                    className="w-full p-2 border rounded bg-white text-gray-500"
                                    placeholder="Ej: bebidas (sin espacios)"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Orden (Prioridad)</label>
                            <input
                                type="number"
                                value={editingCategory?.order_index || 0}
                                onChange={(e) => setEditingCategory(prev => prev ? ({ ...prev, order_index: parseInt(e.target.value) }) : null)}
                                className="w-full p-2 border rounded bg-white"
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            className="bg-[#FF5722] text-white font-bold py-2 rounded hover:bg-[#F4511E] flex justify-center items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Guardar
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors group/item">
                            {/* Image Uploader */}
                            <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group">
                                {cat.image_url ? (
                                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Camera className="w-4 h-4" />
                                    </div>
                                )}

                                {/* Overlay Upload Input */}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                    {uploading === cat.id ? (
                                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                                    ) : (
                                        <Camera className="w-4 h-4 text-white" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(file, cat.id);
                                        }}
                                        disabled={!!uploading}
                                    />
                                </label>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-sm">{cat.name}</h3>
                                <p className="text-[10px] text-gray-400 font-mono">ID: {cat.id} | Ord: {cat.order_index}</p>
                            </div>

                            <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity">
                                <button
                                    onClick={() => { setEditingCategory(cat); setIsCreating(false); }}
                                    className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <p className="text-center text-gray-400 py-4 text-sm">No hay categorías. Crea una en Supabase o aquí.</p>
                    )}
                </div>
            )}
        </div>
    );
}
