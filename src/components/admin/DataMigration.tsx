"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { categories, products } from "@/lib/data";
import { toast } from "sonner";
import { Database, Check, Loader2, AlertTriangle } from "lucide-react";

export function DataMigration() {
    const [loading, setLoading] = useState(false);
    const [migrated, setMigrated] = useState(false);

    const handleMigration = async () => {
        if (!supabase) {
            toast.error("Error: Supabase no está inicializado");
            return;
        }
        setLoading(true);
        try {
            console.log("Starting Migration...");
            // 1. Migrate Categories
            console.log("Migrating categories...", categories.length);
            for (const cat of categories) {
                // Check if exists
                const { data: existing, error: fetchError } = await supabase.from('categories').select('id').eq('id', cat.id).maybeSingle();

                if (fetchError) {
                    console.error("Error checking category:", fetchError);
                    throw fetchError;
                }

                if (!existing) {
                    const { error } = await supabase.from('categories').insert({
                        id: cat.id,
                        name: cat.name,
                        order_index: 0
                    });
                    if (error) {
                        console.error("Error inserting category " + cat.name, error);
                        throw error;
                    }
                }
            }

            // 2. Migrate Products
            console.log("Migrating products...", products.length);
            for (const prod of products) {
                const { data: existing, error: fetchError } = await supabase.from('products').select('id').eq('name', prod.name).eq('category_id', prod.category).maybeSingle();

                if (fetchError) {
                    console.error("Error checking product:", fetchError);
                }

                if (!existing) {
                    const { error } = await supabase.from('products').insert({
                        name: prod.name,
                        description: prod.description,
                        price: prod.price,
                        category_id: prod.category,
                        image_url: prod.image,
                        is_available: true,
                        is_popular: prod.isPopular || false,
                        is_spicy: prod.isSpicy || false,
                    });
                    if (error) {
                        console.error("Error inserting product:", prod.name, error);
                        // Don't throw to allow partial success, but log it
                    }
                }
            }

            toast.success("¡Migración completada con éxito!");
            setMigrated(true);
            // Force reload to see changes
            window.location.reload();

        } catch (error: any) {
            console.error("Migration Fatal Error:", error);
            // Show more details in toast
            toast.error("Error en la migración: " + (error.message || error.details || "Check console"));
        } finally {
            setLoading(false);
        }
    };

    if (migrated) return null;

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 flex items-start gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
                <Database className="w-6 h-6 text-yellow-700" />
            </div>
            <div>
                <h3 className="font-bold text-yellow-800 text-lg">Migración de Datos Requerida</h3>
                <p className="text-yellow-700 text-sm mb-4">
                    Hemos detectado que tu base de datos de productos está vacía o incompleta.
                    ¿Quieres importar los productos actuales (de data.ts) a Supabase ahora?
                </p>
                <button
                    onClick={handleMigration}
                    disabled={loading}
                    className="bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-yellow-700 transition-colors"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Database className="w-4 h-4" />}
                    Migrar Datos Ahora
                </button>
                <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Esto no duplicará productos si ya existen por nombre.
                </p>
            </div>
        </div>
    );
}
