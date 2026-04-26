"use client";

import LandingPage from "@/components/home/LandingPage";
import { FloatingCart } from "@/components/layout/FloatingCart";
import { CartSidebar } from "@/components/layout/CartSidebar";



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
