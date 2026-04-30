"use client";

import { cn } from "@/lib/utils";

interface Category {
    id: string;
    name: string;
}

interface CategoryTabsProps {
    categories: Category[];
    activeCategory: string;
    onSelectCategory: (category: string) => void;
}

// Size reference info for pizza categories
const SIZE_INFO: Record<string, { size: string; pieces: string }> = {
    personal: { size: "25cm", pieces: "8 pzas" },
    medium:   { size: "33cm", pieces: "8 pzas" },
    large:    { size: "40cm", pieces: "12 pzas" },
    family:   { size: "55×35cm", pieces: "20 pzas" },
};

export function CategoryTabs({ categories, activeCategory, onSelectCategory }: CategoryTabsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide">
            {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const sizeInfo = SIZE_INFO[cat.id];

                return (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={cn(
                            "relative px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-200 flex-shrink-0 border font-heading flex flex-col items-center gap-0",
                            isActive
                                ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-900/40 scale-105"
                                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white",
                            sizeInfo ? "pb-3" : ""
                        )}
                    >
                        <span>{cat.name}</span>
                        {sizeInfo && (
                            <span className={cn(
                                "text-[8px] font-semibold tracking-wider mt-0.5 leading-none",
                                isActive ? "text-white/70" : "text-gray-500"
                            )}>
                                {sizeInfo.size} · {sizeInfo.pieces}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
