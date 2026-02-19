"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Page Error:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F5F7] p-4 text-center">
            <h2 className="text-2xl font-bold text-[#5D4037] mb-4">Algo salió mal en esta página.</h2>
            <Button
                onClick={() => reset()}
                className="bg-[#FF5722] hover:bg-[#F4511E] text-white"
            >
                Intentar de nuevo
            </Button>
        </div>
    );
}
