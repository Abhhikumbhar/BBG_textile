"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashIntro() {
  // Animation timeline stages:
  // "enter" (0ms - 400ms) -> "glow" (400ms - 1300ms) -> "zoom" (1300ms - 2100ms) -> "done" (2100ms+)
  const [stage, setStage] = useState<"enter" | "glow" | "zoom" | "done">("enter");
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // 1. Enter: Logo shines immediately
    const enterTimer = setTimeout(() => {
      setStage("glow");
    }, 60);

    // 2. Zoom: Smooth camera push-through into the already-synced website
    const zoomTimer = setTimeout(() => {
      setStage("zoom");
    }, 800);

    // 3. Complete: Cleanly unmount overlay
    const doneTimer = setTimeout(() => {
      setStage("done");
      setIsMounted(false);
    }, 1250);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(zoomTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const handleSkip = () => {
    setStage("zoom");
    setTimeout(() => {
      setStage("done");
      setIsMounted(false);
    }, 200);
  };

  if (!isMounted || stage === "done") return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden cursor-pointer select-none transition-all duration-500 ease-out ${
        stage === "zoom" ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
      style={{
        backgroundColor: "#F7F2EC",
        backgroundImage: "url('/images/bg-linen-botanical-hd.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft Luminous Warm Radiant Aura behind Logo (Zero Box) */}
      <div
        className={`absolute w-[400px] h-[400px] sm:w-[650px] sm:h-[650px] rounded-full pointer-events-none transition-all duration-1000 ease-out ${
          stage === "zoom"
            ? "scale-[2.5] opacity-0 blur-3xl bg-amber-400/30"
            : stage === "glow"
            ? "scale-100 opacity-80 blur-2xl bg-gradient-to-tr from-amber-300/35 via-amber-200/25 to-transparent"
            : "scale-75 opacity-20 blur-xl bg-amber-200/20"
        }`}
      />

      {/* Floating 3D Logo without ANY box or card (100% Transparent Emblem) */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center transition-all duration-850 will-change-transform ${
          stage === "enter"
            ? "scale-[0.88] opacity-0 translate-y-3"
            : stage === "glow"
            ? "scale-100 opacity-100 translate-y-0 ease-[cubic-bezier(0.16,1,0.3,1)]"
            : "scale-[3.8] sm:scale-[4.5] opacity-0 blur-[10px] ease-[cubic-bezier(0.2,0.9,0.2,1)]"
        }`}
      >
        {/* Pure Transparent 3D Embossed Logo (NO Card, NO Box, NO Borders) */}
        <div className="relative w-[280px] sm:w-[420px] md:w-[490px] aspect-[760/525] flex items-center justify-center">
          <Image
            src="/images/logo/bbg-logo-full.png"
            alt="BBG TEXTILE - Premium Fabrics & Garments"
            width={760}
            height={525}
            priority
            className="w-full h-auto object-contain drop-shadow-[0_8px_25px_rgba(15,36,68,0.14)]"
          />

          {/* Golden Glint / Sparkle Animation along the Gold Swatch */}
          <div
            className={`absolute top-[28%] left-[45%] w-2 h-2 rounded-full bg-white shadow-[0_0_12px_4px_rgba(245,208,97,0.9)] pointer-events-none transition-all duration-700 ${
              stage === "glow" ? "opacity-100 scale-125 animate-ping" : "opacity-0 scale-50"
            }`}
          />
        </div>

        {/* Subtle Luxury Location Accent */}
        <div
          className={`mt-2 flex items-center gap-3 transition-all duration-700 delay-150 ${
            stage === "glow"
              ? "opacity-90 translate-y-0"
              : stage === "zoom"
              ? "opacity-0 -translate-y-4"
              : "opacity-0 translate-y-2"
          }`}
        >
          <span className="w-10 sm:w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C68D2B] to-transparent opacity-60" />
          <span className="font-serif tracking-[0.3em] uppercase text-[9px] sm:text-[11px] text-[#0F2444] font-semibold">
            Kupwad MIDC • Sangli
          </span>
          <span className="w-10 sm:w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C68D2B] to-transparent opacity-60" />
        </div>
      </div>
    </div>
  );
}
