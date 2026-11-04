import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Heart,
  ShoppingBag,
  Star,
  Check,
  ShieldCheck,
  Layers,
  Sparkles,
  Truck,
  Mail,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function MobileProductDetailView({ product, relatedProducts = [], settings }) {
  const navigate = useNavigate();
  const { addItem, setIsOpen, totalItems } = useCart();
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  // Available colors from product data or fallback BBG palette
  const availableColors = [
    { name: "Crimson Red", hex: "#9E1B27", img: "/images/products/bbg-studio-hd-crimson-red.jpg" },
    { name: "Jet Black", hex: "#111111", img: "/images/products/bbg-studio-hd-jet-black.jpg" },
    { name: "Deep Maroon", hex: "#5C1322", img: "/images/products/bbg-studio-hd-deep-maroon.jpg" },
    { name: "Beige Cream", hex: "#D4C5B3", img: "/images/products/bbg-studio-hd-beige-cream.jpg" },
    { name: "Royal Blue", hex: "#1B3B82", img: "/images/products/bbg-studio-hd-royal-blue.jpg" },
    { name: "Pure White", hex: "#FFFFFF", img: "/images/products/bbg-studio-hd-pure-white.jpg" },
  ];

  const availableStock = typeof product?.stockQuantity === "number" ? product.stockQuantity : 50;
  const isOutOfStock = product?.stockStatus === "OUT_OF_STOCK" || availableStock <= 0;
  const maxOrderQuantity = Math.max(0, availableStock);

  const [selectedColor, setSelectedColor] = useState(availableColors[0]);
  const sizes = ["Free Size", "L", "XL", "XXL"];
  const [selectedSize, setSelectedSize] = useState("Free Size");

  // Determine images
  const images = (product?.images && product.images.length > 0)
    ? product.images.map((i) => i.url)
    : [
        selectedColor.img,
        "/images/products/featured-crimson-red-studio.jpg",
        "/images/products/bbg-studio-hd-jet-black.jpg",
        "/images/products/bbg-studio-hd-beige-cream.jpg",
      ];

  const handleAddToCart = () => {
    if (isOutOfStock || maxOrderQuantity <= 0) return;
    const finalQty = Math.max(1, Math.min(maxOrderQuantity, quantity));
    const selectedImg = images[activeImgIndex] || selectedColor.img || product.images?.[0]?.url || "/images/products/bbg-studio-hd-crimson-red.jpg";
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: price,
      image: selectedImg,
      color: selectedColor.name,
      size: selectedSize,
      quantity: finalQty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const email = settings?.email || "bbgtextilebharat1@gmail.com";
  const price = product?.price || 349;

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-32 text-stone-900">
      {/* 1. TOP MINIMAL NAVIGATION - Exact match with Screen 2 */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-stone-200/40">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-transform"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setWishlisted(!wishlisted)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-transform"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-5 h-5 ${
                wishlisted
                  ? "fill-rose-500 text-rose-500"
                  : "stroke-[2] text-stone-900"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-transform relative"
            aria-label="Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
            {totalItems > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-stone-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 2. LARGE IMAGE CAROUSEL WITH PAGINATION DOTS - Exact match */}
      <div className="px-4 pt-2">
        <div className="relative w-full aspect-4/5 rounded-3xl overflow-hidden bg-[#EFEAE2] shadow-xs">
          <img
            src={images[activeImgIndex] || selectedColor.img}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-opacity duration-300"
          />

          {/* Dots Indicator */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
            {images.slice(0, 4).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImgIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeImgIndex === idx
                    ? "w-6 bg-stone-900"
                    : "w-1.5 bg-stone-400/60 hover:bg-stone-600"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. PRODUCT INFO SECTION */}
      <div className="px-5 pt-5 pb-4">
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-serif text-xl sm:text-2xl font-extrabold text-stone-950 leading-snug">
            {product.name}
          </h1>
          <span className="font-sans text-2xl font-black text-stone-950 shrink-0 tracking-tight">
            ₹{Math.round(price).toLocaleString("en-IN")}
          </span>
        </div>

        {/* Rating Row (4.8 stars matching reference) */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center text-stone-900">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < 4
                    ? "fill-stone-900 text-stone-900"
                    : "fill-stone-400 text-stone-400"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-stone-800 ml-1">4.8</span>
          <span className="text-xs text-stone-500">(128 reviews)</span>
        </div>

        {/* Color Swatches */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-900">Color</span>
            <span className="text-xs text-stone-500 font-medium">{selectedColor.name}</span>
          </div>
          <div className="flex items-center gap-2.5">
            {availableColors.map((color) => {
              const isSelected = selectedColor.name === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color);
                    setActiveImgIndex(0);
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "ring-2 ring-stone-900 ring-offset-2 ring-offset-[#FAF8F5] scale-110"
                      : "hover:scale-105 opacity-80"
                  }`}
                  aria-label={color.name}
                >
                  <span
                    className="w-full h-full rounded-full border border-stone-300 shadow-2xs"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Size Selector */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-900">Size</span>
            <span className="text-xs text-stone-500">Standard Bharat Fit</span>
          </div>
          <div className="flex items-center gap-2">
            {sizes.map((sz) => {
              const isSelected = selectedSize === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isSelected
                      ? "bg-stone-950 text-white shadow-xs scale-102"
                      : "bg-[#EFEAE2] text-stone-700 hover:bg-stone-300/70"
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fabric & Mill Highlights */}
        <div className="mt-6 p-4 rounded-2xl bg-[#EFEAE2]/60 border border-stone-200/60 space-y-2 text-xs text-stone-700">
          <Link to="/return-policy" className="flex items-center gap-2 font-bold text-amber-950 p-2 rounded-xl bg-amber-100/70 border border-amber-300/80">
            <RotateCcw className="w-4 h-4 text-amber-800 shrink-0" />
            <span>7 Days Easy Return & Exchange Guarantee</span>
          </Link>
          <div className="flex items-center gap-2 font-medium">
            <Layers className="w-4 h-4 text-stone-800" />
            <span>95% Super-Combed Cotton + 5% Lycra (4-Way Stretch)</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Bio-Washed, Non-Sheer, Zero Color Bleed</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <Truck className="w-4 h-4 text-stone-800" />
            <span>Direct Mill Rates • Dispatch Within 24-48 Hours</span>
          </div>
        </div>
      </div>

      {/* 4. FIXED STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-3 border-t border-stone-200/80 shadow-[0_-8px_20px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          {isOutOfStock ? (
            <div className="flex-1 py-3 px-5 rounded-full font-semibold text-xs tracking-wide bg-stone-300 text-stone-700 text-center shadow-xs flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Orders Closed (स्टॉक संपला)</span>
            </div>
          ) : (
            <>
              {/* Quantity Stepper: [- 1 +] in rounded soft container, capped at 5 */}
              <div className="flex items-center bg-[#EFEAE2] rounded-full px-3 py-2 shrink-0 border border-stone-300/40">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-6 h-6 flex items-center justify-center text-stone-800 font-bold active:scale-75 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-3 text-xs font-bold text-stone-900 min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxOrderQuantity, q + 1))}
                  disabled={quantity >= maxOrderQuantity}
                  className="w-6 h-6 flex items-center justify-center text-stone-800 font-bold active:scale-75 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                  aria-label="Increase quantity"
                  title={quantity >= maxOrderQuantity ? "कमाल ५ नग मर्यादा / Max 5 units allowed" : "Add one"}
                >
                  +
                </button>
              </div>

              {/* Add to Bag Pill Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-5 rounded-full font-semibold text-xs tracking-wide transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center gap-2 ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-950 hover:bg-stone-800 text-white"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 stroke-[2]" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </>
          )}

          {/* Email Direct Inquiry Icon */}
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(
              `Order Inquiry: ${product.name} (Color: ${selectedColor.name}, Size: ${selectedSize}, Qty: ${quantity})`
            )}`}
            className="w-10 h-10 rounded-full bg-[#1A365D] text-white flex items-center justify-center shrink-0 active:scale-90 transition-transform shadow-xs"
            aria-label="Order via Email"
          >
            <Mail className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>
    </div>
  );
}
