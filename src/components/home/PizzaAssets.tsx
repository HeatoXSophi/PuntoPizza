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
            <filter id="cheese-roughness">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" />
                <feDiffuseLighting lightingColor="#f7e8a1" surfaceScale="2">
                    <feDistantLight azimuth="45" elevation="60" />
                </feDiffuseLighting>
            </filter>
            <pattern id="cheese-texture" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="#e6d28a" opacity="0.5" />
                <circle cx="40" cy="40" r="3" fill="#e6d28a" opacity="0.5" />
                <circle cx="70" cy="20" r="2" fill="#e6d28a" opacity="0.5" />
                <circle cx="20" cy="80" r="4" fill="#e6d28a" opacity="0.5" />
            </pattern>
        </defs>
    </svg>
);

export const PepperoniSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" style={style}>
        <circle cx="50" cy="50" r="45" fill="#a83e3e" stroke="#8a2b2b" strokeWidth="2" />
        {/* Fat spots */}
        <circle cx="30" cy="30" r="5" fill="#cc5c5c" opacity="0.6" />
        <circle cx="70" cy="60" r="4" fill="#cc5c5c" opacity="0.6" />
        <circle cx="40" cy="70" r="6" fill="#cc5c5c" opacity="0.6" />
        <circle cx="65" cy="35" r="3" fill="#cc5c5c" opacity="0.6" />
    </svg>
);

export const MushroomSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" style={style}>
        <path d="M50 20 C20 20 10 50 10 60 L90 60 C90 50 80 20 50 20 Z" fill="#d6c0a6" stroke="#bcaea3" strokeWidth="2" />
        <rect x="40" y="60" width="20" height="30" fill="#d6c0a6" stroke="#bcaea3" strokeWidth="2" />
    </svg>
);

export const OliveSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" style={style}>
        <circle cx="50" cy="50" r="40" fill="#2c2c2c" />
        <circle cx="50" cy="50" r="15" fill="#f7e8a1" fillOpacity="0.8" /> {/* Hole showing cheese */}
        <circle cx="35" cy="35" r="5" fill="white" opacity="0.2" /> {/* Shine */}
    </svg>
);

export const OnionSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" style={style}>
        <g fill="none" stroke="#e0aaff" strokeWidth="3">
            <path d="M20,50 Q50,0 80,50" />
            <path d="M20,50 Q50,10 80,50" />
            <path d="M20,50 Q50,20 80,50" />
        </g>
        <path d="M15,50 Q50,-10 85,50" fill="none" stroke="#cd85ff" strokeWidth="4" />
    </svg>
);

export const PepperSVG = ({ style }: { style?: any }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" style={style}>
        <path d="M50 10 Q90 10 90 50 Q90 90 50 90 Q10 90 10 50 Q10 10 50 10" fill="none" stroke="#4caf50" strokeWidth="8" />
    </svg>
);
