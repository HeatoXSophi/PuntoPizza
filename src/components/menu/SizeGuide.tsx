"use client";

export function SizeGuide() {
    return (
        <div className="mb-4 flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex-shrink-0 mr-1">Tamaños:</span>

            {/* Personal */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-full px-2.5 py-1 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-500 to-orange-600" />
                <span className="text-[10px] font-bold text-amber-400 uppercase">Personal</span>
                <span className="text-[9px] text-gray-500">25cm</span>
                <span className="text-[9px] text-gray-400 font-semibold">· 8pzas</span>
            </div>

            {/* Grande */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-full px-2.5 py-1 flex-shrink-0">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-red-500 to-red-700" />
                <span className="text-[10px] font-bold text-red-400 uppercase">Grande</span>
                <span className="text-[9px] text-gray-500">33cm</span>
                <span className="text-[9px] text-gray-400 font-semibold">· 8pzas</span>
            </div>

            {/* Familiar */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-full px-2.5 py-1 flex-shrink-0">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-rose-500 to-pink-700" />
                <span className="text-[10px] font-bold text-rose-400 uppercase">Familiar</span>
                <span className="text-[9px] text-gray-500">40cm</span>
                <span className="text-[9px] text-gray-400 font-semibold">· 12pzas</span>
            </div>

            {/* XL */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-full px-2.5 py-1 flex-shrink-0">
                <div className="w-5 h-3 rounded-sm bg-gradient-to-br from-yellow-400 to-amber-600" />
                <span className="text-[10px] font-bold text-yellow-400 uppercase">XL</span>
                <span className="text-[9px] text-gray-500">60×40cm</span>
                <span className="text-[9px] text-gray-400 font-semibold">· 24pzas</span>
            </div>
        </div>
    );
}
