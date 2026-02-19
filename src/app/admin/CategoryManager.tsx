"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Camera, Trash2, Plus } from "lucide-react";

interface Category {
    id: string;
    name: string;
    image_url?: string;
}

export function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase.from("categories").select("*").order("name");
        if (error) {
            toast.error("Error cargando categorías");
        } else {
            setCategories(data || []);
        }
        setLoading(false);
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
                <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-blue-100">
                    <Plus className="w-4 h-4" /> Nueva
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="space-y-4">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            {/* Image Uploader */}
                            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group">
                                {cat.image_url ? (
                                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Camera className="w-6 h-6" />
                                    </div>
                                )}

                                {/* Overlay Upload Input */}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                    {uploading === cat.id ? (
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
                                            if (file) handleImageUpload(file, cat.id);
                                        }}
                                        disabled={!!uploading}
                                    />
                                </label>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800">{cat.name}</h3>
                                <p className="text-xs text-gray-500">ID: {cat.id}</p>
                            </div>

                            <button className="text-red-400 hover:text-red-600 p-2">
                                <Trash2 className="w-4 h-4" />
                            </button>
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
