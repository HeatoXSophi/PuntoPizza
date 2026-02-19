export const PizzaBaseSVG = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
        {/* Crust */}
        <circle cx="200" cy="200" r="195" fill="#e6c08d" stroke="#d4a574" strokeWidth="8" />
        {/* Sauce */}
        <circle cx="200" cy="200" r="180" fill="#c44e4e" />
        {/* Cheese (textured) */}
        <circle cx="200" cy="200" r="170" fill="#f7e8a1" />
        <circle cx="200" cy="200" r="165" fill="url(#cheese-texture)" fillOpacity="0.6" />
        <defs>
            <pattern id="cheese-texture" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="#e6d28a" opacity="0.5" />
                <circle cx="40" cy="40" r="3" fill="#e6d28a" opacity="0.5" />
                <circle cx="70" cy="20" r="2" fill="#e6d28a" opacity="0.5" />
                <circle cx="20" cy="80" r="4" fill="#e6d28a" opacity="0.5" />
            </pattern>
        </defs>
    </svg>
);

// --- VEGETABLES ---

export const TomatoSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" style={style}>
        {/* Red Slice */}
        <circle cx="50" cy="50" r="45" fill="#ff4d4d" stroke="#cc0000" strokeWidth="2" />
        {/* Inner Segments */}
        <path d="M50 50 L50 10 A40 40 0 0 1 85 30 Z" fill="#ff8080" opacity="0.7" />
        <path d="M50 50 L85 70 A40 40 0 0 1 50 90 Z" fill="#ff8080" opacity="0.7" />
        <path d="M50 50 L15 70 A40 40 0 0 1 15 30 Z" fill="#ff8080" opacity="0.7" />
        {/* Seeds */}
        <circle cx="60" cy="35" r="2" fill="#ffe6cc" />
        <circle cx="65" cy="75" r="2" fill="#ffe6cc" />
        <circle cx="25" cy="55" r="2" fill="#ffe6cc" />
    </svg>
);

export const OnionSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" style={style}>
        {/* Purple Ring */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="#dcb0ff" strokeWidth="6" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#f3e5ff" strokeWidth="4" />
        <path d="M10 50 L20 50 M80 50 L90 50" stroke="#dcb0ff" strokeWidth="2" opacity="0.5" />
    </svg>
);

export const PepperSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" style={style}>
        {/* Green Strip */}
        <path d="M20 30 Q50 10 80 30 T80 70 T20 70" fill="none" stroke="#2e7d32" strokeWidth="12" strokeLinecap="round" />
        <path d="M20 30 Q50 10 80 30 T80 70 T20 70" fill="none" stroke="#4caf50" strokeWidth="6" strokeLinecap="round" />
    </svg>
);

export const CornSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" style={style}>
        {/* Yellow Kernel */}
        <rect x="25" y="20" width="50" height="60" rx="15" fill="#fdd835" stroke="#fbc02d" strokeWidth="2" />
        <circle cx="40" cy="40" r="5" fill="#fff59d" opacity="0.6" />
    </svg>
);

export const OliveSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" style={style}>
        {/* Black Ring */}
        <circle cx="50" cy="50" r="35" fill="none" stroke="#212121" strokeWidth="20" />
        <circle cx="60" cy="40" r="5" fill="white" opacity="0.2" />
    </svg>
);

export const MushroomSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" style={style}>
        {/* Slice Profile */}
        <path d="M30 60 A20 20 0 0 1 70 60 L70 80 L30 80 Z" fill="#d7ccc8" />
        <path d="M20 60 A30 30 0 0 1 80 60 L80 50 A30 30 0 0 0 20 50 Z" fill="#a1887f" />
    </svg>
);

// --- MEATS ---

export const PepperoniSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" style={style}>
        {/* Spicy Red Circle */}
        <circle cx="50" cy="50" r="45" fill="#b71c1c" stroke="#8c0000" strokeWidth="2" />
        <circle cx="30" cy="30" r="5" fill="#e53935" opacity="0.5" />
        <circle cx="70" cy="60" r="4" fill="#e53935" opacity="0.5" />
        <circle cx="40" cy="70" r="6" fill="#e53935" opacity="0.5" />
    </svg>
);

export const ChorizoSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" style={style}>
        {/* Darker, Marbled Circle */}
        <circle cx="50" cy="50" r="42" fill="#8d3d3d" stroke="#5d2828" strokeWidth="2" />
        {/* Fat Chunks */}
        <path d="M30 40 L40 35 L45 45 Z" fill="#ffcccb" opacity="0.7" />
        <path d="M60 60 L70 55 L75 65 Z" fill="#ffcccb" opacity="0.7" />
        <path d="M40 70 L50 65 L45 75 Z" fill="#ffcccb" opacity="0.7" />
    </svg>
);

export const HamSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" style={style}>
        {/* Pink Square-ish Slice */}
        <rect x="20" y="20" width="60" height="60" rx="10" fill="#f8bbd0" stroke="#f48fb1" strokeWidth="2" transform="rotate(15 50 50)" />
        <path d="M30 30 L80 80" stroke="#fceeef" strokeWidth="2" opacity="0.5" transform="rotate(15 50 50)" />
    </svg>
);

export const BaconSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" style={style}>
        {/* Wavy Strip */}
        <path d="M10 30 Q30 50 50 30 T90 30" fill="none" stroke="#bf360c" strokeWidth="20" strokeLinecap="round" />
        <path d="M10 30 Q30 50 50 30 T90 30" fill="none" stroke="#ff8a65" strokeWidth="12" strokeLinecap="round" />
        <path d="M10 30 Q30 50 50 30 T90 30" fill="none" stroke="#ffe0b2" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

export const AnchovySVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" style={style}>
        {/* Fish Shape */}
        <path d="M10 50 Q30 20 80 50 Q30 80 10 50 Z" fill="#78909c" stroke="#546e7a" strokeWidth="2" />
        <circle cx="20" cy="45" r="2" fill="white" />
        <path d="M80 50 L95 40 L95 60 Z" fill="#546e7a" />
    </svg>
);
