"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CategoryManager } from "./CategoryManager";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { DataMigration } from "@/components/admin/DataMigration";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    // Simple admin protection for now (Hardcoded for demo)
    // In production, use Supabase Auth
    const handleLogin = () => {
        if (password === "admin123") {
            setIsAuthenticated(true);
            toast.success("Bienvenido Administrador");
        } else {
            toast.error("Contraseña incorrecta");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center text-[#5D4037]">Panel de Administración</h1>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border p-2 rounded-lg"
                                placeholder="Escribe la contraseña..."
                            />
                        </div>
                        <button
                            onClick={handleLogin}
                            className="w-full bg-[#FF5722] text-white font-bold py-3 rounded-lg hover:bg-[#F4511E]"
                        >
                            Entrar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-[#5D4037]">Santa Cruz Admin</h1>
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">EN VIVO</span>
                </div>
                <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-sm text-red-500 font-semibold"
                >
                    Salir
                </button>
            </header>

            <main className="p-6 max-w-7xl mx-auto space-y-8">
                {/* Live Orders Section (Priority) */}
                <AdminOrders />

                {/* Dashboard Sections */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Categories Section */}
                    <CategoryManager />

                    {/* Products Section */}
                    <ProductManager />
                </div>
            </main>
        </div>
    );
}
