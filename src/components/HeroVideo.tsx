"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      
      const attemptPlay = () => {
        video
          .play()
          .catch(() => {
            // If browser blocks autoplay, play immediately on first touch, click or scroll
            const onUserAction = () => {
              video.play().catch(() => {});
              window.removeEventListener("touchstart", onUserAction);
              window.removeEventListener("click", onUserAction);
              window.removeEventListener("scroll", onUserAction);
            };
            window.addEventListener("touchstart", onUserAction, { once: true, passive: true });
            window.addEventListener("click", onUserAction, { once: true, passive: true });
            window.addEventListener("scroll", onUserAction, { once: true, passive: true });
          });
      };

      attemptPlay();
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero-bg-poster.jpg"
        className="w-full h-full object-cover object-[center_top] sm:object-[68%_10%] lg:object-[72%_10%] opacity-100 scale-100 pointer-events-none"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
        <source src="/video-1791976373277.mp4" type="video/mp4" />
      </video>

      {/* Fallback image in background while video initializes */}
      <Image
        src="/hero-bg-poster.jpg"
        alt="BBG Textile Premium Clothing Collection"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 w-full h-full object-cover object-[center_top] sm:object-[68%_10%] lg:object-[72%_10%] opacity-100 scale-100 pointer-events-none select-none"
      />

      {/* Soft, high-clarity scrim so the background video is bright & clearly visible */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/75 via-[#070b14]/45 sm:via-[#070b14]/30 to-transparent z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/35 via-transparent to-transparent z-0 pointer-events-none" />
    </div>
  );
}
