"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/app/actions/adminAuth";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!password) return;
        
        setIsLoading(true);
        try {
            const result = await loginAdmin(password);
            
            if (result.success) {
                toast.success("Bienvenido Administrador");
                router.push("/admin");
            } else {
                toast.error(result.error || "Error al iniciar sesión");
            }
        } catch (error) {
            toast.error("Ocurrió un error. Intente de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-[#5D4037]">Panel de Administración</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Contraseña Segura</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#FF5722] focus:border-[#FF5722] outline-none transition-all"
                            placeholder="Escribe la contraseña..."
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        onClick={handleLogin}
                        disabled={isLoading || !password}
                        className="w-full bg-[#FF5722] text-white font-bold py-3 rounded-lg hover:bg-[#F4511E] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Verificando...
                            </>
                        ) : (
                            "Entrar"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
