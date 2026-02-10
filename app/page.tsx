"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-romantic-dark flex items-center justify-center">
      <div className="text-romantic-soft text-xl animate-pulse">Loading...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <GameCanvas />
    </main>
  );
}
