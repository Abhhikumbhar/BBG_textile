import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Heart, ArrowRight } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product, whatsappNumber = "918767322501" }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // High-end studio backdrop with flowerpot matching reference design
  const getStudioImage = () => {
    const s = (product.slug || "").toLowerCase();
    const sku = (product.sku || "").toLowerCase();
    const name = (product.name || "").toLowerCase();
    const isCyclingShorts =
      s.includes("cycling") ||
      s.includes("tight") ||
      sku.includes("cs") ||
      sku.includes("ts") ||
      name.includes("cycling") ||
      name.includes("tight");

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
      if (s.includes("royal-blue") || sku.includes("rbl") || name.includes("royal blue")) {
        return "/images/products/bbg-studio-hd-cs-royal-blue.jpg";
      }
      if (s.includes("maroon") || sku.includes("mrn") || name.includes("maroon")) {
        return "/images/products/bbg-studio-hd-cs-maroon.jpg";
      }
      if (s.includes("black") || sku.includes("blk") || name.includes("black")) {
        return "/images/products/bbg-studio-hd-cs-black.jpg";
      }
    }

    // Churidar Leggings
    if (s.includes("red") || sku.includes("red") || name.includes("crimson")) {
      return "/images/products/bbg-studio-hd-crimson-red.jpg";
    }
    if (s.includes("maroon") || sku.includes("mrn") || name.includes("maroon")) {
      return "/images/products/bbg-studio-hd-deep-maroon.jpg";
    }
    if (s.includes("royal-blue") || sku.includes("rbl") || name.includes("royal blue")) {
      return "/images/products/bbg-studio-hd-royal-blue.jpg";
    }
    if (s.includes("black") || sku.includes("blk") || name.includes("black")) {
      return "/images/products/bbg-studio-hd-jet-black.jpg";
    }
    if (s.includes("white") || sku.includes("wht") || name.includes("white")) {
      return "/images/products/bbg-studio-hd-pure-white.jpg";
    }
    if (s.includes("teal") || sku.includes("tel") || name.includes("teal")) {
      return "/images/products/churidar-leggings-teal-1.jpg";
    }
    if (s.includes("beige") || sku.includes("bge") || name.includes("beige")) {
      return "/images/products/bbg-studio-hd-beige-cream.jpg";
    }
    if (s.includes("grey") || sku.includes("gry") || name.includes("grey")) {
      return "/images/products/bbg-studio-hd-heather-grey.jpg";
    }

    return null;
  };

  const primaryImage =
    product.images?.[0]?.url ||
    getStudioImage() ||
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80";

  const cleanWhatsApp = (whatsappNumber && whatsappNumber.trim() ? whatsappNumber : "918767322501").replace(/[^0-9]/g, "");
  const whatsappText = encodeURIComponent(
    `Hello BBG Textile, I am inquiring about *${product.name}* (SKU: ${product.sku}). Could you please share wholesale pricing and availability?`
  );

  const colors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean))
  );

  const isOutOfStock = product.stockStatus === "OUT_OF_STOCK" || product.stockQuantity <= 0;

  return (
    <div className="group relative bg-[#FCFAF7] rounded-2xl border border-[#E8DFD3] shadow-[0_4px_20px_rgba(40,30,20,0.06)] hover:shadow-[0_10px_30px_rgba(40,30,20,0.12)] overflow-hidden transition-all duration-300 flex flex-col">
      {/* Clean Image Container */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-[7/6] bg-gradient-to-b from-[#F8F4EE] to-[#EFE8DE] overflow-hidden rounded-t-2xl"
      >
        <img
          src={primaryImage}
          alt={product.images?.[0]?.altText || product.name}
          className="w-full h-full object-cover object-[15%_center] group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top-Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestSeller && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-[#E5A020] text-white rounded-md shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-[#0F2444] text-white rounded-md shadow-sm">
              New Arrival
            </span>
          )}
          {product.isEnquiryOnly && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-purple-700 text-white rounded-md shadow-sm">
              Wholesale Only
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-red-600 text-white rounded-md shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-red-500 shadow-sm flex items-center justify-center transition-all hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-[#0F2444] stroke-[1.75]"
            }`}
          />
        </button>
      </Link>

      {/* Content Area with Soft Warm Ivory Tone */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 bg-gradient-to-b from-[#FCFAF7] via-[#FAF6EE] to-[#F5EFE4]">
        {/* Title */}
        <Link to={`/products/${product.slug}`} className="block mb-1 sm:mb-1.5">
          <h3 className="font-serif text-xs sm:text-base font-bold text-[#0F2444] group-hover:text-[#1A365D] transition-colors line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating & Assured Badge */}
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <div className="inline-flex items-center gap-0.5 bg-emerald-700 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded">
            <span>4.8</span>
            <span className="text-[8px] sm:text-[9px]">★</span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-[#1A365D] bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 rounded">
            <span className="text-amber-500 font-bold">★</span>
            <span className="italic">BBG Assured</span>
          </span>
        </div>

        {/* Shades / Colors Available Preview */}
        {colors.length > 0 && (
          <div className="text-[11px] sm:text-xs text-slate-600 mb-1.5 sm:mb-2 flex items-center gap-1 sm:gap-1.5">
            <span className="font-medium text-slate-500">Shades:</span>
            <span className="font-semibold text-slate-800 truncate">
              {colors.slice(0, 2).join(", ")}
              {colors.length > 2 ? ` +${colors.length - 2}` : ""}
            </span>
          </div>
        )}

        {/* Fabric & Quality Badges */}
        <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-2.5 flex-wrap">
          <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded bg-[#EFE8DD] text-[#634E35] border border-[#E2D6C3]">
            4-Way Stretch
          </span>
          <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded bg-[#EFE8DD] text-[#634E35] border border-[#E2D6C3]">
            Bio-Washed
          </span>
        </div>

        {/* Direct Mill Wholesale Indicator */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 pt-1.5 sm:pt-2 border-t border-[#EAE1D3]/70">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-800">
              Direct Mill
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-1.5 sm:px-2 py-0.5 rounded-full">
            Wholesale
          </span>
        </div>

        {/* Action Row */}
        <div className="mt-auto pt-2 sm:pt-2.5 border-t border-[#EAE1D3] flex items-center gap-1.5 sm:gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 py-2 sm:py-3 px-2 sm:px-3 bg-[#1A365D] hover:bg-[#0F2444] active:bg-[#0A192F] active:scale-[0.98] text-white rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-sm text-center shadow-xs hover:shadow transition-all flex items-center justify-center gap-1 group/btn touch-manipulation min-h-[36px] sm:min-h-[44px]"
          >
            <span>View</span>
            <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white/90 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 sm:h-11 px-2.5 sm:px-3.5 bg-[#25D366] hover:bg-[#20BD5A] active:bg-[#1DA851] active:scale-[0.98] text-white rounded-lg sm:rounded-xl shadow-xs hover:shadow flex items-center justify-center gap-1 shrink-0 transition-all hover:scale-105 touch-manipulation min-h-[36px] sm:min-h-[44px]"
            title="Enquire on WhatsApp"
            aria-label="Enquire on WhatsApp"
          >
            <WhatsAppIcon className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            <span className="text-[11px] font-bold hidden md:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
