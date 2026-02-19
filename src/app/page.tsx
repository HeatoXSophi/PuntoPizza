"use client";

import dynamic from "next/dynamic";

const LandingPage = dynamic(() => import("@/components/home/LandingPage"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-white" />, // Placeholder
});

export default function Home() {
  return <LandingPage />;
}
