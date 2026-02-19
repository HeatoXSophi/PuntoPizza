"use client";

import dynamic from "next/dynamic";
const LandingPage = dynamic(() => import("@/components/home/LandingPage"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-white" />,
});

const FloatingCart = dynamic(() => import("@/components/layout/FloatingCart").then(mod => mod.FloatingCart), { ssr: false });
const CartSidebar = dynamic(() => import("@/components/layout/CartSidebar").then(mod => mod.CartSidebar), { ssr: false });

export default function Home() {
  return (
    <>
      <LandingPage />
      <FloatingCart />
      <CartSidebar />
    </>
  );
}
