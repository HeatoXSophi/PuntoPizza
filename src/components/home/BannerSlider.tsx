"use client";

import Image from "next/image";
import { useRef } from "react";

const promos = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600&h=300",
        title: "Combo Familiar",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=600&h=300",
        title: "2x1 Pepperoni",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=600&h=300",
        title: "Pizza + Bebida",
    },
];

export function BannerSlider() {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="relative w-full overflow-hidden py-4">
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide"
            >
                {promos.map((promo) => (
                    <div
                        key={promo.id}
                        className="relative h-40 min-w-[85%] flex-shrink-0 snap-center overflow-hidden rounded-xl shadow-md transition-transform hover:scale-[1.02]"
                    >
                        <Image
                            src={promo.image}
                            alt={promo.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 85vw, 400px"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                            <h3 className="text-lg font-bold text-white">{promo.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
