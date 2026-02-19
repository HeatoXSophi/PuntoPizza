"use client";

import { Suspense, lazy } from "react";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";

const AboutStory = lazy(() => import("@/components/home/AboutStory").then(m => ({ default: m.AboutStory })));
const PizzaBuilder = lazy(() => import("@/components/home/PizzaBuilder").then(m => ({ default: m.PizzaBuilder })));
// Lazy loading para secciones below-the-fold
const Menu = lazy(() => import("@/components/home/Menu").then(m => ({ default: m.Menu })));
const Testimonials = lazy(() => import("@/components/home/Testimonials").then(m => ({ default: m.Testimonials })));
const Contact = lazy(() => import("@/components/home/Contact").then(m => ({ default: m.Contact })));

// Skeleton loader simple
const SectionSkeleton = () => (
    <div className="animate-pulse bg-gray-100 min-h-[400px]" />
);

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Critical content: carga inmediata */}
            <Hero />

            <Suspense fallback={<SectionSkeleton />}>
                <PizzaBuilder />
            </Suspense>

            <Features />

            <Suspense fallback={<SectionSkeleton />}>
                <AboutStory />
            </Suspense>

            {/* Non-critical content: lazy loading con suspense */}
            <Suspense fallback={<SectionSkeleton />}>
                <Menu />
            </Suspense>

            <Suspense fallback={<SectionSkeleton />}>
                <Testimonials />
            </Suspense>

            <Suspense fallback={<SectionSkeleton />}>
                <Contact />
            </Suspense>
        </main>
    );
}
