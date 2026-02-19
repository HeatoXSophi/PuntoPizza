"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ProductCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
}

export function ProductCard({ id, name, description, price, category, image }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="flex flex-col items-center w-full max-w-[220px] mx-auto group cursor-pointer"
        >
            {/* Circle Image Wrapper */}
            <div className="relative w-full aspect-square mb-[-25px] z-10 filter drop-shadow-xl group-hover:drop-shadow-2xl transition-all duration-300">
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="w-full h-full relative"
                >
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-contain rounded-full"
                        sizes="(max-width: 768px) 50vw, 200px"
                    />
                </motion.div>
            </div>

            {/* Price & Add Row - "The Pill" */}
            <motion.div
                whileTap={{ scale: 0.95 }}
                className="bg-[#FFF8E1] rounded-full px-1 pl-4 py-0.5 flex items-center gap-2 shadow-sm border border-[#FFE082] z-20 mb-3 scale-90 origin-top hover:shadow-md transition-shadow"
            >
                <span className="font-extrabold text-[#5D4037] text-base font-body">
                    ${price.toFixed(2)}
                </span>
                <motion.button
                    whileTap={{ scale: 0.8, rotate: 90 }}
                    className="w-7 h-7 rounded-full bg-white border border-[#FF9800] flex items-center justify-center text-[#FF9800] hover:bg-[#FF9800] hover:text-white transition-colors"
                    onClick={() => {
                        addItem({ id, name, price, image, category, description });
                        toast.success(`Agregado: ${name}`);
                    }}
                >
                    <Plus className="w-4 h-4 stroke-[3]" />
                </motion.button>
            </motion.div>

            {/* Info */}
            <div className="text-center px-1 w-full">
                <h3 className="font-black text-xs uppercase tracking-wide text-gray-900 mb-1 leading-tight font-heading group-hover:text-primary transition-colors">{name}</h3>
                <p className="text-[10px] text-gray-500 leading-tight line-clamp-2 px-1 font-body">
                    {description}
                </p>
            </div>
        </motion.div>
    );
}
