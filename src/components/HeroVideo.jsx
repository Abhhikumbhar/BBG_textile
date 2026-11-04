import React, { useRef, useEffect } from "react";

export default function HeroVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
      video.setAttribute("x5-playsinline", "true");
      video.setAttribute("controlsList", "nodownload nofullscreen noremoteplayback noplaybackrate");

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
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none touch-none">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        poster="/hero-bg-poster.jpg"
        className="w-full h-full object-cover object-[center_top] sm:object-[68%_10%] lg:object-[72%_10%] opacity-100 scale-100 pointer-events-none select-none"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
        <source src="/video-1791976373277.mp4" type="video/mp4" />
      </video>

      {/* Transparent touch shield so iOS tap gestures NEVER reach the video element or trigger native iOS video controls */}
      <div
        className="absolute inset-0 z-1 pointer-events-auto bg-transparent select-none touch-none cursor-default"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
      />

      {/* Fallback image in background while video initializes */}
      <img
        src="/hero-bg-poster.jpg"
        alt="BBG Textile Premium Clothing Collection"
        className="absolute inset-0 -z-10 w-full h-full object-cover object-[center_top] sm:object-[68%_10%] lg:object-[72%_10%] opacity-100 scale-100 pointer-events-none select-none"
      />
    </div>
  );
}
