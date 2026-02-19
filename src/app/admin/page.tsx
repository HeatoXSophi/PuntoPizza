"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CategoryManager } from "./CategoryManager";

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
                <h1 className="text-xl font-bold text-[#5D4037]">Santa Cruz Admin</h1>
                <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-sm text-red-500 font-semibold"
                >
                    Salir
                </button>
            </header>

            <main className="p-6 max-w-6xl mx-auto space-y-8">
                {/* Dashboard Sections */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Categories Section */}
                    <CategoryManager />

                    {/* Products Section Placeholder */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
                        <h2 className="text-lg font-bold mb-4">Productos</h2>
                        <p className="text-gray-500 text-sm mb-4">Sube fotos, edita precios y configura ingredientes extra.</p>
                        <button className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-100 w-full">
                            Próximamente...
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
