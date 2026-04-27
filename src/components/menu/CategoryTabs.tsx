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

export function CategoryTabs({ categories, activeCategory, onSelectCategory }: CategoryTabsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide">
            {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={cn(
                            "relative px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-200 flex-shrink-0 border font-heading",
                            isActive
                                ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-900/40 scale-105"
                                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                        )}
                    >
                        {cat.name}
                    </button>
                );
            })}
        </div>
    );
}
