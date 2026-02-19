import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google"; // Switch to Outfit for that rounded/modern look
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Santa Cruz Pizzería | La Mejor Pizza de la Ciudad",
  description: "Pide tu pizza favorita en línea. Delivery rápido, ingredientes frescos y el mejor sabor de Santa Cruz.",
  keywords: ["pizza", "delivery", "santa cruz", "comida", "restaurante"],
  authors: [{ name: "Santa Cruz Pizzería" }],
  openGraph: {
    title: "Santa Cruz Pizzería",
    description: "La mejor pizza, a punto. Pide online ahora.",
    url: "https://punto-pizza.vercel.app",
    siteName: "Santa Cruz Pizzería",
    images: [
      {
        url: "/og-image.jpg", // We need to make sure this exists or user knows to add it
        width: 1200,
        height: 630,
        alt: "Santa Cruz Pizzería",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Santa Cruz Pizzería",
    description: "La mejor pizza de la ciudad, directo a tu casa.",
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
    "image": "https://punto-pizza.vercel.app/og-image.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Principal",
      "addressLocality": "Santa Cruz",
      "addressRegion": "Aragua",
      "addressCountry": "VE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.1234,
      "longitude": -67.5678
    },
    "url": "https://punto-pizza.vercel.app",
    "telephone": "+584246802805",
    "menu": "https://punto-pizza.vercel.app/menu",
    "servesCuisine": "Pizza"
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF5722" />
      </head>
      <body className={`${outfit.variable} ${fraunces.variable} font-sans antialiased`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
