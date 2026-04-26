"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Plus, Trash2, Save, Edit2, X, GripVertical, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from "lucide-react";

interface ExtraIngredient {
    id: string;
    name: string;
    price_personal: number;
    price_mediana: number;
    price_grande: number;
    price_family: number;
    is_active: boolean;
    order_index: number;
}

const EMPTY: Omit<ExtraIngredient, "order_index"> = {
    id: "",
    name: "",
    price_personal: 1.00,
    price_mediana: 1.50,
    price_grande: 2.00,
    price_family: 3.00,
    is_active: true,
};

const SIZE_COLS = [
    { key: "price_personal" as const, label: "Pequeña", short: "P" },
    { key: "price_mediana"  as const, label: "Mediana",  short: "G" },
    { key: "price_grande"   as const, label: "Grande",   short: "F" },
    { key: "price_family"   as const, label: "Familiar", short: "XL" },
];

export function IngredientsManager() {
    const [ingredients, setIngredients] = useState<ExtraIngredient[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editDraft, setEditDraft] = useState<ExtraIngredient | null>(null);
    const [adding, setAdding] = useState(false);
    const [newDraft, setNewDraft] = useState({ ...EMPTY });
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from("extra_ingredients")
            .select("*")
            .order("order_index");
        if (error) toast.error("Error cargando ingredientes");
        else setIngredients(data || []);
        setLoading(false);
    }

    /* ── Save edit ── */
    async function saveEdit() {
        if (!supabase || !editDraft) return;
        setSaving(true);
        const { id, ...rest } = editDraft;
        const { error } = await supabase.from("extra_ingredients").update(rest).eq("id", id);
        setSaving(false);
        if (error) { toast.error("Error al guardar: " + error.message); return; }
        toast.success("✅ Ingrediente actualizado");
        setEditingId(null);
        setEditDraft(null);
        fetchData();
    }

    /* ── Add new ── */
    async function addIngredient() {
        if (!supabase) return;
        if (!newDraft.name.trim()) { toast.error("El nombre es obligatorio"); return; }
        const slug = newDraft.id.trim() || newDraft.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        setSaving(true);
        const { error } = await supabase.from("extra_ingredients").insert({
            ...newDraft,
            id: slug,
            order_index: ingredients.length + 1,
        });
        setSaving(false);
        if (error) { toast.error("Error: " + error.message); return; }
        toast.success("✅ Ingrediente agregado");
        setAdding(false);
        setNewDraft({ ...EMPTY });
        fetchData();
    }

    /* ── Delete ── */
    async function deleteIngredient(id: string) {
        if (!supabase) return;
        if (!confirm("¿Eliminar este ingrediente del catálogo?")) return;
        const { error } = await supabase.from("extra_ingredients").delete().eq("id", id);
        if (error) toast.error("Error al eliminar");
        else { toast.success("Ingrediente eliminado"); fetchData(); }
    }

    /* ── Toggle active ── */
    async function toggleActive(ing: ExtraIngredient) {
        if (!supabase) return;
        const { error } = await supabase.from("extra_ingredients").update({ is_active: !ing.is_active }).eq("id", ing.id);
        if (error) toast.error("Error");
        else {
            setIngredients(prev => prev.map(i => i.id === ing.id ? { ...i, is_active: !i.is_active } : i));
        }
    }

    /* ── Move order ── */
    async function moveOrder(id: string, direction: "up" | "down") {
        if (!supabase) return;
        const idx = ingredients.findIndex(i => i.id === id);
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= ingredients.length) return;

        const a = ingredients[idx];
        const b = ingredients[swapIdx];
        await supabase.from("extra_ingredients").update({ order_index: b.order_index }).eq("id", a.id);
        await supabase.from("extra_ingredients").update({ order_index: a.order_index }).eq("id", b.id);
        fetchData();
    }

    if (loading) return (
        <div className="flex items-center justify-center h-40 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mr-3" />
            Cargando ingredientes...
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-black text-gray-800">🧂 Ingredientes Extra</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Gestiona el catálogo de extras que el cliente puede agregar a su pizza.
                        Los precios se ajustan automáticamente según el tamaño.
                    </p>
                </div>
                <button
                    onClick={() => setAdding(true)}
                    className="flex items-center gap-2 bg-[#FF5722] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#F4511E] transition-colors shadow-lg shadow-orange-100"
                >
                    <Plus className="w-4 h-4" /> Agregar
                </button>
            </div>

            {/* Price legend */}
            <div className="flex gap-3 flex-wrap">
                {SIZE_COLS.map(s => (
                    <span key={s.key} className="bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                        {s.short} = {s.label}
                    </span>
                ))}
            </div>

            {/* Add new form */}
            {adding && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5 animate-in zoom-in-95 duration-150">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-orange-500" /> Nuevo Ingrediente
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Nombre *</label>
                            <input
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none text-sm"
                                placeholder="Ej: Jalapeños"
                                value={newDraft.name}
                                onChange={e => setNewDraft({ ...newDraft, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">ID (opcional, se genera solo)</label>
                            <input
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none text-sm font-mono"
                                placeholder="jalapenos"
                                value={newDraft.id}
                                onChange={e => setNewDraft({ ...newDraft, id: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                        {SIZE_COLS.map(s => (
                            <div key={s.key}>
                                <label className="block text-xs font-bold text-gray-600 mb-1">
                                    {s.label} <span className="text-orange-500">({s.short})</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                                    <input
                                        type="number" step="0.01" min="0"
                                        className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none text-sm"
                                        value={newDraft[s.key]}
                                        onChange={e => setNewDraft({ ...newDraft, [s.key]: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => { setAdding(false); setNewDraft({ ...EMPTY }); }}
                            className="flex-1 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                        >Cancelar</button>
                        <button
                            onClick={addIngredient}
                            disabled={saving}
                            className="flex-1 py-2.5 bg-[#FF5722] text-white rounded-xl font-bold hover:bg-[#F4511E] disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar Ingrediente"}
                        </button>
                    </div>
                </div>
            )}

            {/* Ingredients Table */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 border-b text-xs font-black text-gray-500 uppercase tracking-wider">
                    <div className="col-span-1" />
                    <div className="col-span-3">Ingrediente</div>
                    <div className="col-span-1 text-center">P</div>
                    <div className="col-span-1 text-center">G</div>
                    <div className="col-span-1 text-center">F</div>
                    <div className="col-span-2 text-center">XL</div>
                    <div className="col-span-2 text-center">Estado</div>
                    <div className="col-span-1 text-center">...</div>
                </div>

                {ingredients.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-3xl mb-2">🧂</p>
                        <p>No hay ingredientes. Agrega el primero.</p>
                    </div>
                )}

                {ingredients.map((ing, idx) => {
                    const isEditing = editingId === ing.id;
                    const draft = isEditing ? editDraft! : ing;

                    return (
                        <div key={ing.id} className={`border-b last:border-0 transition-colors ${isEditing ? "bg-orange-50" : ing.is_active ? "hover:bg-gray-50" : "bg-gray-50 opacity-60"}`}>
                            {/* Row */}
                            <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center">
                                {/* Order controls */}
                                <div className="col-span-1 flex flex-col gap-0.5">
                                    <button onClick={() => moveOrder(ing.id, "up")} disabled={idx === 0} className="text-gray-300 hover:text-gray-500 disabled:opacity-20">
                                        <ChevronUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => moveOrder(ing.id, "down")} disabled={idx === ingredients.length - 1} className="text-gray-300 hover:text-gray-500 disabled:opacity-20">
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Name */}
                                <div className="col-span-3">
                                    {isEditing ? (
                                        <input
                                            className="w-full border border-orange-300 rounded-lg px-2 py-1 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-200"
                                            value={draft.name}
                                            onChange={e => setEditDraft({ ...draft, name: e.target.value })}
                                        />
                                    ) : (
                                        <span className="font-bold text-gray-800 text-sm">{ing.name}</span>
                                    )}
                                </div>

                                {/* Prices */}
                                {SIZE_COLS.map(s => (
                                    <div key={s.key} className={`${s.key === "price_family" ? "col-span-2" : "col-span-1"} text-center`}>
                                        {isEditing ? (
                                            <div className="relative">
                                                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                                <input
                                                    type="number" step="0.01" min="0"
                                                    className="w-full pl-5 pr-1 py-1 border border-orange-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-200"
                                                    value={draft[s.key]}
                                                    onChange={e => setEditDraft({ ...draft, [s.key]: parseFloat(e.target.value) || 0 })}
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-700 font-mono">${Number(ing[s.key]).toFixed(2)}</span>
                                        )}
                                    </div>
                                ))}

                                {/* Active toggle */}
                                <div className="col-span-2 flex justify-center">
                                    <button onClick={() => toggleActive(ing)} className="transition-colors">
                                        {ing.is_active
                                            ? <ToggleRight className="w-7 h-7 text-green-500" />
                                            : <ToggleLeft className="w-7 h-7 text-gray-300" />
                                        }
                                    </button>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex items-center justify-end gap-1">
                                    {isEditing ? (
                                        <>
                                            <button onClick={saveEdit} disabled={saving} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50">
                                                <Save className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => { setEditingId(null); setEditDraft(null); }} className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => { setEditingId(ing.id); setEditDraft({ ...ing }); }} className="p-1.5 text-orange-400 hover:bg-orange-50 rounded-lg">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => deleteIngredient(ing.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-gray-400 text-center">
                Los cambios se reflejan en tiempo real en el menú del cliente.
            </p>
        </div>
    );
}
