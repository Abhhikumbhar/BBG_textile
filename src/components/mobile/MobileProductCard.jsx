import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Plus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function MobileProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  // Helper to pick the best image
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      const primary = product.images.find((i) => i.isPrimary) || product.images[0];
      return primary.url;
    }
    const s = (product.slug || "").toLowerCase();
    const name = (product.name || "").toLowerCase();
    if (s.includes("crimson") || name.includes("crimson") || s.includes("red")) {
      return "/images/products/bbg-studio-hd-crimson-red.jpg";
    }
    if (s.includes("black")) {
      return "/images/products/bbg-studio-hd-jet-black.jpg";
    }
    if (s.includes("beige") || s.includes("cream")) {
      return "/images/products/bbg-studio-hd-beige-cream.jpg";
    }
    if (s.includes("cycling") || s.includes("short") || s.includes("tight")) {
      return "/images/products/bbg-studio-hd-cs-black.jpg";
    }
    return "/images/products/bbg-studio-hd-crimson-red.jpg";
  };

  const imageSrc = getProductImage();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price || 349,
      image: imageSrc,
      color: product.variants?.[0]?.color || "Standard",
      size: "Free Size",
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
  };

  return (
    <div className="group flex flex-col bg-[#F7F4EE] rounded-2xl p-2.5 transition-all duration-300">
      {/* Image Container with high rounded corners and Wishlist button */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block w-full aspect-3/4 rounded-xl overflow-hidden bg-stone-200/50 mb-2.5"
      >
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Wishlist Heart Icon */}
        <button
          type="button"
          onClick={toggleWishlist}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-stone-700 hover:text-rose-600 active:scale-90 transition-transform shadow-2xs"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              wishlisted
                ? "fill-rose-500 text-rose-500"
                : "stroke-[1.8] text-stone-700"
            }`}
          />
        </button>

        {/* Best Seller / New badge if applicable */}
        {product.isBestSeller && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[9px] font-medium tracking-wider uppercase">
            Best Seller
          </span>
        )}
      </Link>

      {/* Info & Add-to-bag button */}
      <div className="flex items-end justify-between gap-1 px-1 pb-1">
        <Link to={`/products/${product.slug}`} className="flex-1 min-w-0 pr-1">
          <h3 className="text-xs font-bold text-stone-900 truncate leading-snug">
            {product.name}
          </h3>
          <p className="text-sm font-extrabold text-stone-950 mt-0.5 tracking-tight">
            ₹{product.price ? Math.round(product.price).toLocaleString("en-IN") : "349"}
          </p>
        </Link>

        {/* Quick Add Button (+) matching reference photo */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 shadow-2xs ${
            added
              ? "bg-emerald-600 text-white"
              : "bg-stone-200/80 hover:bg-stone-900 hover:text-white text-stone-800"
          }`}
          aria-label="Quick Add to Cart"
        >
          {added ? (
            <Check className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <Plus className="w-4 h-4 stroke-[2]" />
          )}
        </button>
      </div>
    </div>
  );
}
