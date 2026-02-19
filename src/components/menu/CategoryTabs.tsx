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
                                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-orange-500/30 scale-105"
                                : "bg-white text-muted-foreground border-transparent shadow-sm hover:bg-gray-50"
                        )}
                    >
                        {cat.name}
                    </button>
                );
            })}
        </div>
    );
}
