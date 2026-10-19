import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Crown, ArrowRight, Sparkles } from "lucide-react";

const defaultBanners = [
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
    imageUrl: "/images/products/bbg-studio-hd-crimson-red.jpg",
    linkUrl: "/products",
    badge: "Wholesale Rates",
    badgeColor: "bg-[#1A365D]",
  },
];

export default function FlipkartBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % defaultBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + defaultBanners.length) % defaultBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % defaultBanners.length);
  };

  const banner = defaultBanners[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg border border-amber-500/20 bg-[#0B1526]">
      <div className="relative aspect-[16/9] sm:aspect-[21/8] md:aspect-[24/8] w-full overflow-hidden">
        {/* Background Image */}
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="w-full h-full object-cover object-[center_top] transition-all duration-700 brightness-[0.85]"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070F1E]/95 via-[#070F1E]/75 to-transparent sm:via-[#070F1E]/60 flex items-center">
          <div className="max-w-xl px-5 sm:px-10 py-6 text-white space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white ${banner.badgeColor}`}
              >
                {banner.badge}
              </span>
              <span className="text-[10px] sm:text-xs text-amber-300 font-medium">
                {banner.tag}
              </span>
            </div>

            <h2 className="font-serif text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-white drop-shadow-md">
              {banner.title}
            </h2>

            <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 max-w-md">
              {banner.subtitle}
            </p>

            <div className="pt-2">
              <Link
                to={banner.linkUrl}
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#070F1E] font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
              >
                <span>Explore Range</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all"
          aria-label="Previous Banner"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all"
          aria-label="Next Banner"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {defaultBanners.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? "w-6 bg-amber-400"
                  : "w-2 bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
