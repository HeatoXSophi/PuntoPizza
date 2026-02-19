import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF8E1]">
            <div className="bg-white p-6 rounded-full shadow-xl mb-4 animate-pulse">
                <Loader2 className="w-12 h-12 text-[#FF5722] animate-spin" />
            </div>
            <p className="text-[#5D4037] font-bold text-lg animate-pulse">Preparando el horno...</p>
        </div>
    );
}
