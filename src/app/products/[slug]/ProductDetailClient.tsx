"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import {
  ShoppingBag,
  Share2,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronLeft,
  Info,
  Phone,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

interface Variant {
  id: string;
  color?: string | null;
  size?: string | null;
  sku?: string | null;
  additionalPrice: number;
  stockQuantity: number;
}

interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
}

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    sku: string;
    price: number;
    wholesalePrice?: number | null;
    isEnquiryOnly: boolean;
    isPurchasableOnline: boolean;
    stockQuantity: number;
    stockStatus: string;
    isFeatured: boolean;
    isNewArrival: boolean;
    isBestSeller: boolean;
    category?: { id?: string; name: string; slug: string } | null;
    images: ProductImage[];
    variants: Variant[];
  };
  relatedProducts: any[];
  whatsappNumber?: string;
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  whatsappNumber = "919822012345",
}: ProductDetailProps) {
  const { addItem } = useCart();

  // Active image & Touch swipe states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const thumbnailsRef = React.useRef<HTMLDivElement>(null);

  const minSwipeDistance = 35; // Pixel threshold to register a swipe

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Image
      setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Previous Image
      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseStartX(e.clientX);
    setIsMouseDown(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDown || mouseStartX === null) return;
    const distance = mouseStartX - e.clientX;
    if (distance > minSwipeDistance) {
      setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    } else if (distance < -minSwipeDistance) {
      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    }
    setIsMouseDown(false);
    setMouseStartX(null);
  };

  // Auto-scroll active thumbnail into view
  React.useEffect(() => {
    if (thumbnailsRef.current) {
      const activeBtn = thumbnailsRef.current.children[activeImageIndex] as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeImageIndex]);

  // Variant selections
  const colors = Array.from(
    new Set(product.variants.map((v) => v.color).filter(Boolean) as string[])
  );
  const sizes = Array.from(
    new Set(product.variants.map((v) => v.size).filter(Boolean) as string[])
  );

  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || "");
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);

  // Find matched variant
  const matchedVariant = product.variants.find(
    (v) =>
      (!selectedColor || v.color === selectedColor) &&
      (!selectedSize || v.size === selectedSize)
  );

  const currentPrice =
    product.price + (matchedVariant ? matchedVariant.additionalPrice : 0);

  const isOutOfStock =
    product.stockStatus === "OUT_OF_STOCK" ||
    product.stockQuantity <= 0 ||
    (matchedVariant && matchedVariant.stockQuantity <= 0 && product.variants.length > 0);

  // High-end studio backdrop with flowerpot matching reference design
  const getStudioImage = (colorHint?: string) => {
    const s = ((product.slug || "") + " " + (colorHint || selectedColor || "")).toLowerCase();
    const sku = (product.sku || "").toLowerCase();
    const name = (product.name || "").toLowerCase();
    const isCyclingShorts = s.includes("cycling") || sku.includes("cs") || name.includes("cycling");

    if (isCyclingShorts) {
      if (s.includes("grey") || sku.includes("gry") || name.includes("grey")) {
        return "/images/products/bbg-studio-hd-cycling-grey.jpg";
      }
      if (s.includes("white") || sku.includes("wht") || name.includes("white")) {
        return "/images/products/bbg-studio-hd-cs-white.jpg";
      }
      if (s.includes("beige") || sku.includes("bge") || name.includes("beige")) {
        return "/images/products/bbg-studio-hd-cs-beige.jpg";
      }
      if (s.includes("teal") || sku.includes("tel") || name.includes("teal")) {
        return "/images/products/bbg-studio-hd-cs-teal.jpg";
      }
      if (s.includes("red") || sku.includes("red") || name.includes("red")) {
        return "/images/products/bbg-studio-hd-cs-red.jpg";
      }
      if (s.includes("royal") || s.includes("blue") || sku.includes("rbl") || name.includes("royal blue")) {
        return "/images/products/bbg-studio-hd-cs-royal-blue.jpg";
      }
      if (s.includes("maroon") || sku.includes("mrn") || name.includes("maroon")) {
        return "/images/products/bbg-studio-hd-cs-maroon.jpg";
      }
      if (s.includes("black") || sku.includes("blk") || name.includes("black")) {
        return "/images/products/bbg-studio-hd-cs-black.jpg";
      }
      return "/images/products/bbg-studio-hd-cs-black.jpg";
    }

    // Churidar Leggings
    if (s.includes("maroon") || sku.includes("mrn") || name.includes("maroon")) {
      return "/images/products/bbg-studio-hd-deep-maroon.jpg";
    }
    if (s.includes("red") || sku.includes("red") || name.includes("crimson")) {
      return "/images/products/bbg-studio-hd-crimson-red.jpg";
    }
    if (s.includes("royal") || s.includes("blue") || sku.includes("rbl") || name.includes("royal blue")) {
      return "/images/products/bbg-studio-hd-royal-blue.jpg";
    }
    if (s.includes("black") || sku.includes("blk") || name.includes("black")) {
      return "/images/products/bbg-studio-hd-jet-black.jpg";
    }
    if (s.includes("white") || sku.includes("wht") || name.includes("white")) {
      return "/images/products/bbg-studio-hd-pure-white.jpg";
    }
    if (s.includes("teal") || sku.includes("tel") || name.includes("teal")) {
      return "/images/products/bbg-studio-hd-peacock-teal.jpg";
    }
    if (s.includes("beige") || sku.includes("bge") || name.includes("beige")) {
      return "/images/products/bbg-studio-hd-beige-cream.jpg";
    }
    if (s.includes("grey") || sku.includes("gry") || name.includes("grey")) {
      return "/images/products/bbg-studio-hd-heather-grey.jpg";
    }

    return "/images/products/bbg-studio-hd-deep-maroon.jpg";
  };

  const studioImg = getStudioImage(selectedColor);

  const rawImages =
    product.images && product.images.length > 0
      ? product.images
      : [
          {
            id: "default",
            url: studioImg || "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80",
            altText: product.name,
            isPrimary: true,
          },
        ];

  // Prepend studio photo with flowerpot as primary showcase image
  const images: ProductImage[] = studioImg
    ? [
        {
          id: `studio-${selectedColor || "primary"}`,
          url: studioImg,
          altText: `${product.name} Studio Backdrop with Flowerpot & Decor`,
          isPrimary: true,
        },
        ...rawImages.filter((img) => img.url !== studioImg),
      ]
    : rawImages;

  const cleanWhatsApp = (whatsappNumber && whatsappNumber.trim() ? whatsappNumber : "919822012345").replace(/[^0-9]/g, "");
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const whatsappMessage = encodeURIComponent(
    `Hello BBG Textile,\n\nI am inquiring about *${product.name}* (SKU: ${product.sku}).\n` +
      (selectedColor ? `• Color / Shade: ${selectedColor}\n` : "") +
      (selectedSize ? `• Length / Cut: ${selectedSize}\n` : "") +
      (quantity > 1 ? `• Quantity: ${quantity}\n` : "") +
      `Product Link: ${currentUrl || `https://bbgtextile.com/products/${product.slug}`}\n\n` +
      `Please provide wholesale quotation and delivery timeline.`
  );

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: currentPrice,
      image: images[activeImageIndex]?.url || images[0].url,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
      quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at BBG Textile`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-3 sm:pt-8 pb-28 sm:pb-12">
      {/* Breadcrumb Navigation - Clean single line with horizontal scroll on mobile */}
      <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 mb-2.5 sm:mb-6 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
        <Link href="/" className="hover:text-gray-900 transition-colors shrink-0">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
        <Link href="/products" className="hover:text-gray-900 transition-colors shrink-0">
          Products
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
        <Link
          href={`/products?category=${product.category?.slug || "churidar-leggings"}`}
          className="hover:text-amber-800 font-semibold text-amber-700 transition-colors shrink-0"
        >
          {product.category?.name || "Bottom Wear"}
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
        <span className="text-gray-900 font-medium truncate max-w-[140px] sm:max-w-xs shrink-0">
          {product.name}
        </span>
      </nav>

      {/* Mobile-Only Product Header */}
      <div className="lg:hidden mb-3">
        <div className="flex items-center justify-between text-[11px] font-semibold text-amber-800 tracking-wider uppercase mb-1">
          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-900 border border-amber-600/20 font-bold text-[10px]">
            {product.category?.name || "Bottom Wear"}
          </span>
          <span className="font-mono text-gray-400 font-normal text-[10px]">SKU: {product.sku}</span>
        </div>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
          {product.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* LEFT: Enhanced Infographic Product Showcase */}
        <div className="space-y-3 sm:space-y-4">
          {/* Main Large Image Container with Touch & Drag Carousel */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsMouseDown(false)}
            className="relative aspect-[4/4.1] sm:aspect-[4/4.4] lg:aspect-[4/4.5] rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-[#FBF8F4] via-[#F5EFE6] to-[#ECE2D2] border border-[#E5DAC8] shadow-[0_8px_30px_rgba(0,0,0,0.07)] group select-none cursor-grab active:cursor-grabbing touch-pan-y"
          >
            {/* Sliding Carousel Track */}
            <div
              className="flex w-full h-full transition-transform duration-300 ease-out will-change-transform"
              style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
            >
              {images.map((img, idx) => (
                <div key={img.id || idx} className="relative w-full h-full shrink-0 select-none">
                  <Image
                    src={img.url}
                    alt={img.altText || `${product.name} view ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    draggable={false}
                    className={`transition-all duration-300 pointer-events-none select-none ${
                      idx === 0
                        ? "object-cover object-[24%_center] sm:object-[20%_center] group-hover:scale-[1.02]"
                        : "object-contain bg-white/70 p-2 sm:p-4"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Prev / Next Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  }}
                  className="absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-gray-800 shadow-md backdrop-blur-md flex items-center justify-center transition-all active:scale-90 border border-white/60"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-gray-800 shadow-md backdrop-blur-md flex items-center justify-center transition-all active:scale-90 border border-white/60"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800" />
                </button>
              </>
            )}

            {/* Mobile Dots Indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:hidden bg-black/45 px-2.5 py-0.5 rounded-full backdrop-blur-md pointer-events-none">
                {images.map((_, dotIdx) => (
                  <span
                    key={dotIdx}
                    className={`rounded-full transition-all duration-300 ${
                      activeImageIndex === dotIdx
                        ? "w-3.5 h-1.5 bg-amber-400"
                        : "w-1.5 h-1.5 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Top Bar on Image */}
            <div className="absolute top-2.5 sm:top-4 inset-x-2.5 sm:inset-x-4 flex items-center justify-between gap-2 z-20 pointer-events-none">
              {activeImageIndex > 0 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(0);
                  }}
                  className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-[#0B1A30]/90 hover:bg-[#0B1A30] text-amber-300 rounded-full shadow-md backdrop-blur-md text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 pointer-events-auto"
                >
                  <span>⟲ Studio</span>
                </button>
              ) : (
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#0B1A30]/85 text-amber-300 rounded-full text-[9px] sm:text-[11px] font-bold tracking-wider uppercase backdrop-blur-sm shadow pointer-events-auto">
                  Studio Presentation
                </span>
              )}

              <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-black/50 text-white rounded-full text-[9px] sm:text-[10px] font-mono font-semibold backdrop-blur-sm">
                  {activeImageIndex + 1} / {images.length}
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-1.5 sm:p-2.5 bg-white/95 hover:bg-white text-gray-700 rounded-full shadow-md backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
                  title="Share product link"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Overlays: ONLY SHOW ON STUDIO VIEW (Image 0) so other images are completely clear */}
            {activeImageIndex === 0 && (
              <>
                {/* Right Side: 4 Vertical Gold-Rimmed Feature Badges (Desktop Only - hidden on mobile so model is 100% visible) */}
                <div className="hidden lg:flex absolute right-3.5 top-16 sm:top-18 flex-col gap-2.5 z-20 pointer-events-none">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-md border border-amber-400 shadow-md flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-sm">☁️</span>
                    <span className="text-[8px] font-bold text-slate-900 leading-tight">95% Cotton</span>
                    <span className="text-[7px] text-slate-500 leading-none">Ultra Soft</span>
                  </div>
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-md border border-amber-400 shadow-md flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-sm">✨</span>
                    <span className="text-[8px] font-bold text-slate-900 leading-tight">4-Way Stretch</span>
                    <span className="text-[7px] text-slate-500 leading-none">Max Comfort</span>
                  </div>
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-md border border-amber-400 shadow-md flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-sm">🎨</span>
                    <span className="text-[8px] font-bold text-slate-900 leading-tight">Colorfast</span>
                    <span className="text-[7px] text-slate-500 leading-none">Zero Bleed</span>
                  </div>
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-md border border-amber-400 shadow-md flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-sm">🛡️</span>
                    <span className="text-[8px] font-bold text-slate-900 leading-tight">Bio-Washed</span>
                    <span className="text-[7px] text-slate-500 leading-none">Non-Sheer</span>
                  </div>
                </div>

                {/* Center-Bottom: 3 Fabric Detail Macro Thumbnails (interactive jump to detail photos) */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-3.5 hidden sm:flex items-end gap-2 z-20">
                  {images[1] && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(1);
                      }}
                      className="flex flex-col items-center group/btn cursor-pointer"
                      title="View Stitch Detail"
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-amber-400 shadow-lg overflow-hidden bg-slate-900 relative group-hover/btn:scale-110 transition-transform">
                        <Image
                          src={images[1].url}
                          alt="Seamless Stitch"
                          fill
                          className="object-cover scale-[2.2] object-center"
                        />
                      </div>
                      <span className="text-[9px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mt-1">
                        Stitch
                      </span>
                    </button>
                  )}
                  {images[2] && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(2);
                      }}
                      className="flex flex-col items-center group/btn cursor-pointer"
                      title="View Gathers Detail"
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-amber-400 shadow-lg overflow-hidden bg-slate-900 relative group-hover/btn:scale-110 transition-transform">
                        <Image
                          src={images[2].url}
                          alt="Ankle Gathers"
                          fill
                          className="object-cover scale-[2.4] object-bottom"
                        />
                      </div>
                      <span className="text-[9px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mt-1">
                        Gathers
                      </span>
                    </button>
                  )}
                  {images[3] && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(3);
                      }}
                      className="flex flex-col items-center group/btn cursor-pointer"
                      title="View Waistband Detail"
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-amber-400 shadow-lg overflow-hidden bg-slate-900 relative group-hover/btn:scale-110 transition-transform">
                        <Image
                          src={images[3].url}
                          alt="Gentle Waistband"
                          fill
                          className="object-cover scale-[2.2] object-top"
                        />
                      </div>
                      <span className="text-[9px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mt-1">
                        Waistband
                      </span>
                    </button>
                  )}
                </div>

                {/* Bottom Right: Cultural Guarantee Stamp */}
                <div className="absolute right-3.5 bottom-3.5 z-20 pointer-events-none hidden sm:block">
                  <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/90 via-amber-600/90 to-amber-700/90 text-white text-[11px] font-bold shadow-lg border border-amber-300/60 backdrop-blur-md flex items-center gap-1.5">
                    <span>✨</span>
                    <span>परंपरेची आधुनिक पावलं</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Thumbnails row: Smooth mobile swipe and clean borders */}
          {images.length > 1 && (
            <div
              ref={thumbnailsRef}
              className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1.5 pt-0.5 touch-pan-x scrollbar-none"
            >
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-15 h-19 sm:w-20 sm:h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all active:scale-95 ${
                    activeImageIndex === idx
                      ? "border-[#1A365D] ring-2 ring-[#1A365D]/30 shadow-md scale-102"
                      : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400"
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `Product view ${idx + 1}`}
                    fill
                    sizes="80px"
                    className={`object-cover ${idx === 0 ? "object-[24%_center]" : "object-center"}`}
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-0.5 inset-x-0.5 bg-black/75 text-[7px] sm:text-[8px] font-bold text-amber-300 text-center rounded py-0.5 backdrop-blur-xs">
                      Studio
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Mobile Highlights Grid (Unobstructed view of model & fabric) */}
          <div className="lg:hidden grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/70 border border-amber-200/70 shadow-xs">
              <span className="text-base shrink-0">☁️</span>
              <div>
                <div className="text-[11px] font-bold text-slate-900 leading-tight">95% Cotton</div>
                <div className="text-[9px] text-slate-500 font-medium">Ultra Soft Combed</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/70 border border-amber-200/70 shadow-xs">
              <span className="text-base shrink-0">✨</span>
              <div>
                <div className="text-[11px] font-bold text-slate-900 leading-tight">4-Way Stretch</div>
                <div className="text-[9px] text-slate-500 font-medium">Supreme Comfort</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/70 border border-amber-200/70 shadow-xs">
              <span className="text-base shrink-0">🎨</span>
              <div>
                <div className="text-[11px] font-bold text-slate-900 leading-tight">Colorfast</div>
                <div className="text-[9px] text-slate-500 font-medium">Zero Bleed Weave</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/70 border border-amber-200/70 shadow-xs">
              <span className="text-base shrink-0">🛡️</span>
              <div>
                <div className="text-[11px] font-bold text-slate-900 leading-tight">Bio-Washed</div>
                <div className="text-[9px] text-slate-500 font-medium">Non-Sheer Knit</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Product Details & Purchase Actions */}
        <div className="flex flex-col">
          {/* Category & SKU (Desktop only, already visible on mobile at top) */}
          <div className="hidden lg:flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-amber-700">
              {product.category?.name || "Bottom Wear"}
            </span>
            <span className="font-mono text-gray-500">SKU: {product.sku}</span>
          </div>

          {/* Title (Desktop only, already visible on mobile at top) */}
          <h1 className="hidden lg:block font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Stock Status Badge */}
          <div className="mb-4">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                Currently Out of Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                In Stock & Ready for Dispatch ({product.stockQuantity} meters)
              </span>
            )}
          </div>

          {/* Wholesale Enquiry Box (No public prices displayed) */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 mb-6">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 text-xs font-bold uppercase tracking-wider">
                Direct Mill Supply
              </span>
              <span className="text-xs text-amber-800 font-medium">Sangli Kupwad Hub</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900">
              Wholesale Pricing on Enquiry
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed">
              We offer direct mill prices with tiered volume discounts for retailers, garment brands, cloth stores, and tailoring houses. Inquire below for the latest wholesale rate card.
            </p>
          </div>

          {/* Color Selector */}
          {colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Available Colors / Shades:{" "}
                <span className="text-[#1A365D] font-semibold">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedColor(c);
                      setActiveImageIndex(0);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedColor === c
                        ? "bg-[#1A365D] text-white border-[#1A365D] shadow-sm"
                        : "bg-white text-gray-800 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size / Length Selector */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Cut / Length:{" "}
                <span className="text-[#1A365D] font-semibold">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSize === s
                        ? "bg-[#1A365D] text-white border-[#1A365D] shadow-sm"
                        : "bg-white text-gray-800 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs: Dedicated Wholesale Enquiry Only */}
          <div className="flex flex-col sm:flex-row gap-3.5 mb-8">
            {/* Primary WhatsApp Enquiry */}
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 px-6 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5"
            >
              <WhatsAppIcon className="w-5 h-5 text-white" />
              <span>Enquire on WhatsApp</span>
            </a>

            {/* Direct Call for Booking */}
            <a
              href="tel:+919822012345"
              className="py-4 px-6 border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#1A365D]" />
              <span>Call For Booking</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-gray-200 text-xs text-gray-600 mb-8">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>100% Guaranteed Mill Weave</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Direct Transport from Sangli</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Colorfast & Shrink Tested</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Bulk Rolls & Custom Cuts</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-gray-900">
              Fabric Specifications & Description
            </h3>
            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Related Weaves
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                More from {product.category?.name || "Collection"}
              </h2>
            </div>
            <Link
              href={`/products?category=${product.category?.slug || "womens-bottom-wear"}`}
              className="text-xs font-bold text-[#1A365D] hover:underline"
            >
              View Category &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom CTA Bar with safe-area-inset */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2.5 sm:hidden shadow-[0_-4px_25px_rgba(0,0,0,0.1)] flex items-center gap-2 pb-[max(0.65rem,env(safe-area-inset-bottom))]">
        <a
          href={`https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20BD5A] active:bg-[#1DA851] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform"
        >
          <WhatsAppIcon className="w-5 h-5 text-white" />
          <span>Enquire on WhatsApp</span>
        </a>
        <a
          href="tel:+919822012345"
          className="w-11 h-11 border border-gray-300 bg-gray-50 active:bg-gray-100 text-gray-800 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-xs"
          aria-label="Call BBG Textile"
        >
          <Phone className="w-4 h-4 text-[#1A365D]" />
        </a>
      </div>
    </div>
  );
}
