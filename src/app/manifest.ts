import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'A Punto Pizza',
        short_name: 'Punto Pizza',
        description: 'La mejor pizza, a punto.',
        start_url: '/',
        display: 'standalone',
        background_color: '#FF5722',
        theme_color: '#FF5722',
        icons: [
            {
                src: '/logo.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    };
}
