"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to an external service (like Sentry) if available
        console.error("Global Error:", error);
    }, [error]);

    return (
        <html lang="es">
            <body className="flex min-h-screen flex-col items-center justify-center bg-[#F5F5F7] p-4 text-center font-sans">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-lg mx-4">
                    <h2 className="text-3xl font-black text-[#FF5722] mb-4">¡Ups! Algo estalló 💥</h2>
                    <p className="text-gray-600 mb-6">Error Técnico Detectado:</p>

                    {/* DEBUG INFO */}
                    <div className="bg-gray-100 p-4 rounded-lg text-left mb-6 overflow-auto max-h-40">
                        <p className="text-red-600 font-mono text-xs font-bold">{error.message}</p>
                        {error.digest && <p className="text-gray-400 font-mono text-[10px] mt-1">Digest: {error.digest}</p>}
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => reset()}
                            className="w-full bg-[#FF5722] text-white font-bold py-3 rounded-xl hover:bg-[#F4511E] transition-colors"
                        >
                            Intentar de nuevo
                        </button>
                        <button
                            onClick={() => window.location.href = "/"}
                            className="w-full border border-gray-300 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Recargar App Completa
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}


