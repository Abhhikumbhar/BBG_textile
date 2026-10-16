"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Crown, ArrowRight, Sparkles } from "lucide-react";

interface BannerItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  badge: string;
  badgeColor: string;
}

const defaultBanners: BannerItem[] = [
  {
    id: "banner-1",
    tag: "Sangli Mill Hub • Direct Wholesale",
    title: "4-Way Stretch Cotton Lycra Leggings",
    subtitle: "Super combed 95% cotton & 5% Lycra with authentic ankle gathers.",
    imageUrl: "/hero-bg-poster.jpg",
    linkUrl: "/products?category=churidar-leggings",
    badge: "Direct Mill Supply",
    badgeColor: "bg-amber-500",
  },
  {
    id: "banner-2",
    tag: "Activewear & Loungewear Collection",
    title: "4-Way Stretch Cotton Tight Shorts",
    subtitle: "Mid-thigh comfort cotton lycra tight shorts for gym & kurti innerwear.",
    imageUrl: "/images/products/bbg-studio-hd-cs-white.jpg",
    linkUrl: "/products?category=cycling-shorts",
    badge: "Bio-Washed",
    badgeColor: "bg-emerald-600",
  },
  {
    id: "banner-3",
    tag: "Flagship 2026 Collection",
    title: "Premium Combed Yarns & Fabrics",
    subtitle: "Colorfast, non-sheer, all-day comfort bottom wear in 8+ rich shades.",
    imageUrl: "/images/products/bbg-studio-hd-peacock-teal.jpg",
    linkUrl: "/products",
    badge: "Wholesale Rates",
    badgeColor: "bg-[#1A365D]",
  },
];

export default function FlipkartBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-scroll every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % defaultBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      // Swiped left -> next
      setCurrentIndex((prev) => (prev + 1) % defaultBanners.length);
    } else if (diff < -50) {
      // Swiped right -> prev
      setCurrentIndex((prev) => (prev - 1 + defaultBanners.length) % defaultBanners.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-[#0B1120] select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Slides */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {defaultBanners.map((banner, index) => (
          <div
            key={banner.id}
            className="w-full shrink-0 relative min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] flex items-center"
          >
            {/* Background Image with Scrim */}
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              priority={index === 0}
              className="absolute inset-0 object-cover object-[center_top] sm:object-[68%_10%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/90 via-[#070b14]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/70 via-transparent to-black/30" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
              <div className="max-w-xl">
                {/* Eyebrow Tag */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2.5">
                  <Crown className="w-3 h-3" />
                  <span>{banner.tag}</span>
                </div>

                {/* Banner Title */}
                <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2 sm:mb-3 drop-shadow-md">
                  {banner.title}
                </h2>

                {/* Subtitle */}
                <p className="text-xs sm:text-base text-gray-200 line-clamp-2 mb-4 max-w-md font-light">
                  {banner.subtitle}
                </p>

                {/* CTA Button */}
                <Link
                  href={banner.linkUrl}
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows for Desktop */}
      <button
        onClick={() =>
          setCurrentIndex((prev) => (prev - 1 + defaultBanners.length) % defaultBanners.length)
        }
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white items-center justify-center backdrop-blur-sm transition-colors"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % defaultBanners.length)}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white items-center justify-center backdrop-blur-sm transition-colors"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination Dots Indicator - Flipkart Style */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
        {defaultBanners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all rounded-full ${
              currentIndex === idx
                ? "w-5 h-1.5 bg-amber-400"
                : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
