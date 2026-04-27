"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Save, DollarSign, Package } from "lucide-react";

export function SettingsManager() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({ id: "", delivery_fee: 2.00, box_fee: 1.00 });

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data, error } = await supabase.from('store_settings').select('*').limit(1).single();
            if (error) throw error;
            if (data) {
                setSettings({
                    id: data.id,
                    delivery_fee: Number(data.delivery_fee),
                    box_fee: Number(data.box_fee)
                });
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("Error al cargar configuración");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!supabase) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('store_settings')
                .update({
                    delivery_fee: settings.delivery_fee,
                    box_fee: settings.box_fee,
                    updated_at: new Date().toISOString()
                })
                .eq('id', settings.id);

            if (error) throw error;
            toast.success("Configuración guardada correctamente");
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error("Error al guardar configuración");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-[#5D4037] mb-6">Configuración de Tarifas</h2>

            <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <DollarSign className="w-4 h-4 text-orange-500" />
                        Costo de Envío (Delivery)
                    </label>
                    <p className="text-xs text-gray-500 mb-3">Este costo se suma automáticamente cuando el cliente selecciona "Delivery".</p>
                    <div className="relative max-w-xs">
                        <span className="absolute left-3 top-3 text-gray-400 font-bold">$</span>
                        <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={settings.delivery_fee}
                            onChange={(e) => setSettings({ ...settings, delivery_fee: parseFloat(e.target.value) || 0 })}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all outline-none font-bold text-gray-800"
                        />
                    </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <Package className="w-4 h-4 text-orange-500" />
                        Costo por Caja de Pizza
                    </label>
                    <p className="text-xs text-gray-500 mb-3">Este costo se multiplica por la cantidad de cajas que ocupa cada producto (excepto si el cliente come en el local).</p>
                    <div className="relative max-w-xs">
                        <span className="absolute left-3 top-3 text-gray-400 font-bold">$</span>
                        <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={settings.box_fee}
                            onChange={(e) => setSettings({ ...settings, box_fee: parseFloat(e.target.value) || 0 })}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all outline-none font-bold text-gray-800"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full md:w-auto px-8 bg-[#FF5722] text-white font-bold py-3 rounded-xl hover:bg-[#F4511E] shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
