"use client";

import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Menu } from "@/components/home/Menu";
import { Testimonials } from "@/components/home/Testimonials";
import { Contact } from "@/components/home/Contact";



export default function Home() {
  return (
    <main className="min-h-screen bg-white" suppressHydrationWarning={true}>
      <Hero />
      <Features />
      <Menu />
      <Testimonials />
      <Contact />
    </main>
  );
}
