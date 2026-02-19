import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pizza } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF8E1] p-4 text-center">
            <div className="bg-white p-8 rounded-full shadow-xl mb-8 animate-bounce">
                <Pizza className="w-24 h-24 text-[#FF5722]" />
            </div>
            <h1 className="text-6xl font-black text-[#5D4037] mb-2">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Página no encontrada</h2>
            <p className="text-gray-600 max-w-md mb-8">
                ¡Vaya! Parece que la página que buscas ha sido devorada. ¿Por qué no regresas al menú y pides algo delicioso?
            </p>
            <Link href="/">
                <Button size="lg" className="bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold px-8 shadow-lg shadow-orange-200">
                    Volver al Menú
                </Button>
            </Link>
        </div>
    );
}
