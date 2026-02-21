"use client";

import dynamic from "next/dynamic";
const LandingPage = dynamic(() => import("@/components/home/LandingPage"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-white" />,
});

const FloatingCart = dynamic(() => import("@/components/layout/FloatingCart").then(mod => mod.FloatingCart), { ssr: false });
const CartSidebar = dynamic(() => import("@/components/layout/CartSidebar").then(mod => mod.CartSidebar), { ssr: false });

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";

export default function Home() {
  const { isAppMode } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (isAppMode) {
      router.replace("/menu");
    }
  }, [isAppMode, router]);

  return (
    <>
      <LandingPage />
      <FloatingCart />
      <CartSidebar />
    </>
  );
}
