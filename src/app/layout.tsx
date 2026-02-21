import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Footer } from "@/components/layout/Footer";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Santa Cruz Pizzería | La Mejor Pizza de la Ciudad",
  description: "Pide tu pizza favorita en línea. Delivery rápido en Puerta Maraven y Punto Fijo. Ingredientes frescos y masa artesanal.",
  keywords: ["pizza", "delivery", "punto fijo", "puerta maraven", "comida", "restaurante", "manaure"],
  authors: [{ name: "Santa Cruz Pizzería" }],
  openGraph: {
    title: "Santa Cruz Pizzería",
    description: "La mejor pizza de Punto Fijo, a un click. Pide online ahora.",
    url: "https://santacruzpizzeria.vercel.app",
    siteName: "Santa Cruz Pizzería",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Santa Cruz Pizzería",
      },
    ],
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Santa Cruz Pizzería",
    description: "La mejor pizza de la ciudad, directo a tu casa en Puerta Maraven.",
    images: ["/og-image.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FF5722",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Santa Cruz Pizzería",
    "image": "https://santacruzpizzeria.vercel.app/og-image.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Urb. Manaure, Puerta Maraven",
      "addressLocality": "Punto Fijo",
      "addressRegion": "Falcón",
      "addressCountry": "VE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 11.7067,
      "longitude": -70.1872
    },
    "url": "https://santacruzpizzeria.vercel.app",
    "telephone": "+584246802805",
    "menu": "https://santacruzpizzeria.vercel.app/menu",
    "servesCuisine": "Pizza"
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest" />
        <meta name="theme-color" content="#FF5722" />
      </head>
      <body className={`${outfit.variable} ${fraunces.variable} font-sans antialiased`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ClientLayout>
          {children}
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
