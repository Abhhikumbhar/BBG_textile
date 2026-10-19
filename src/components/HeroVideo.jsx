import React, { useRef, useEffect } from "react";

export default function HeroVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;

      const attemptPlay = () => {
        video.play().catch(() => {
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
      <img
        src="/hero-bg-poster.jpg"
        alt="BBG Textile Premium Clothing Collection"
        className="absolute inset-0 -z-10 w-full h-full object-cover object-[center_top] sm:object-[68%_10%] lg:object-[72%_10%] opacity-100 scale-100 pointer-events-none select-none"
      />
    </div>
  );
}
