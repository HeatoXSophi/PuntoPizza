"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";

interface ProductCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

export function ProductCard({ id, name, description, price, image }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <div className="flex flex-col items-center w-full max-w-[220px] mx-auto group">
            {/* Circle Image Wrapper */}
            <div className="relative w-full aspect-square mb-[-25px] z-10 filter drop-shadow-xl group-hover:scale-105 transition-transform duration-300">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain rounded-full"
                    sizes="(max-width: 768px) 50vw, 200px"
                />
            </div>

            {/* Price & Add Row - "The Pill" */}
            <div className="bg-[#FFF8E1] rounded-full px-1 pl-4 py-0.5 flex items-center gap-2 shadow-sm border border-[#FFE082] z-20 mb-3 scale-90 origin-top">
                <span className="font-extrabold text-[#5D4037] text-base">
                    ${price.toFixed(2)}
                </span>
                <button
                    className="w-7 h-7 rounded-full bg-white border border-[#FF9800] flex items-center justify-center text-[#FF9800] hover:bg-[#FF9800] hover:text-white transition-colors"
                    onClick={() => {
                        addItem({ id, name, price, image });
                        toast.success(`Agregado: ${name}`);
                    }}
                >
                    <Plus className="w-4 h-4 stroke-[3]" />
                </button>
            </div>

            {/* Info */}
            <div className="text-center px-1 w-full">
                <h3 className="font-black text-xs uppercase tracking-wide text-gray-900 mb-1 leading-tight">{name}</h3>
                <p className="text-[10px] text-gray-400 leading-tight line-clamp-2 px-1">
                    {description}
                </p>
            </div>
        </div>
    );
}
