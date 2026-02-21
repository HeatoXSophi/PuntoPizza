"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CategoryManager } from "./CategoryManager";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { DataMigration } from "@/components/admin/DataMigration";
import { ProductManager } from "@/components/admin/ProductManager";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { BarChart3, ShoppingBag, Package, FolderOpen, Database } from "lucide-react";

type AdminTab = "analytics" | "orders" | "products" | "categories" | "migration";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState<AdminTab>("analytics");

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
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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

    const tabs: { id: AdminTab; label: string; icon: any }[] = [
        { id: "analytics", label: "Dashboard", icon: BarChart3 },
        { id: "orders", label: "Pedidos", icon: ShoppingBag },
        { id: "products", label: "Productos", icon: Package },
        { id: "categories", label: "Categorías", icon: FolderOpen },
        { id: "migration", label: "Migración", icon: Database },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white shadow px-4 py-3 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-[#5D4037]">Santa Cruz Admin</h1>
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">EN VIVO</span>
                </div>
                <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-sm text-red-500 font-semibold"
                >
                    Salir
                </button>
            </header>

            {/* Tab Navigation */}
            <div className="bg-white border-b px-4 overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? "border-[#FF5722] text-[#FF5722]"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="p-4 max-w-7xl mx-auto">
                {activeTab === "analytics" && <AdminAnalytics />}
                {activeTab === "orders" && <AdminOrders />}
                {activeTab === "products" && <ProductManager />}
                {activeTab === "categories" && <CategoryManager />}
                {activeTab === "migration" && <DataMigration />}
            </main>
        </div>
    );
}
