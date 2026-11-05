import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import {
  getProductBySlug,
  getRelatedProducts,
  siteSettings,
} from "@/lib/catalogService";
import { STATIC_PRODUCTS_CATALOG } from "@/lib/catalog";
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
  CreditCard,
  Mail,
} from "lucide-react";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const product = getProductBySlug(slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const thumbnailsRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImageIndex(0);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
        <Header settings={siteSettings} />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">
            Product Not Found
          </h1>
          <p className="text-gray-500 text-sm mb-6 max-w-md">
            The product you are looking for does not exist or has been relocated in our catalog.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-xs font-bold transition-colors"
          >
            Back to Catalog
          </Link>
        </main>
        <Footer settings={siteSettings} />
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product.id, 4);

  // Variant selections
  const colors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean))
  );
  const rawSizes = [
    product.size,
    ...(product.variants?.map((v) => v.size) || []),
  ].filter(Boolean);
  const sizes = Array.from(
    new Set(rawSizes.length > 0 ? rawSizes : ["Free Size"])
  );

  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [quantity, setQuantity] = useState(1);

  // Studio image matching helper
  const getStudioImage = (colorHint) => {
    const s = ((product.slug || "") + " " + (colorHint || selectedColor || "")).toLowerCase();
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
      if (s.includes("teal") || sku.includes("tel") || name.includes("teal")) {
        return "/images/products/bbg-studio-hd-cs-teal.jpg";
      }
      if (s.includes("grey") || sku.includes("gry") || name.includes("grey")) {
        return "/images/products/bbg-studio-hd-cycling-grey.jpg";
      }
      if (s.includes("white") || sku.includes("wht") || name.includes("white")) {
        return "/images/products/bbg-studio-hd-cs-white.jpg";
      }
      if (s.includes("beige") || sku.includes("bge") || name.includes("beige")) {
        return "/images/products/bbg-studio-hd-cs-beige.jpg";
      }
      if (s.includes("red") || sku.includes("red") || name.includes("red")) {
        return "/images/products/bbg-studio-hd-cs-red.jpg";
      }
      if ((s.includes("royal") || s.includes("blue") || sku.includes("rbl") || name.includes("royal blue")) && !s.includes("teal")) {
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
    if (s.includes("beige") || sku.includes("bge") || name.includes("beige")) {
      return "/images/products/bbg-studio-hd-beige-cream.jpg";
    }
    if (s.includes("grey") || sku.includes("gry") || name.includes("grey")) {
      return "/images/products/bbg-studio-hd-heather-grey.jpg";
    }
    return null;
  };

  // Merge images: always ensure all available gallery angles are loaded
  const defaultStaticProd = STATIC_PRODUCTS_CATALOG.find(
    (p) => p.id === product.id || p.sku === product.sku || p.slug === product.slug
  );

  let rawImages = [];
  if (product.images && product.images.length > 1) {
    rawImages = product.images.map((img) => (typeof img === "string" ? img : img.url));
  } else if (defaultStaticProd && defaultStaticProd.images && defaultStaticProd.images.length > 0) {
    const staticUrls = defaultStaticProd.images.map((img) => (typeof img === "string" ? img : img.url));
    if (product.images?.[0]?.url && !staticUrls.includes(product.images[0].url)) {
      rawImages = [product.images[0].url, ...staticUrls];
    } else {
      rawImages = staticUrls;
    }
  } else if (product.images && product.images.length > 0) {
    rawImages = product.images.map((img) => (typeof img === "string" ? img : img.url));
  } else {
    rawImages = [
      getStudioImage() || "/images/products/bbg-studio-hd-crimson-red.jpg",
    ];
  }

  const images = Array.from(new Set(rawImages.filter(Boolean)));

  const activeImage = images[activeImageIndex] || images[0];

  const matchedVariant = product.variants?.find(
    (v) =>
      (!selectedColor || v.color === selectedColor) &&
      (!selectedSize || v.size === selectedSize)
  );

  const currentPrice =
    product.price + (matchedVariant ? matchedVariant.additionalPrice : 0);

  const availableStock = typeof product.stockQuantity === "number" ? product.stockQuantity : 50;
  const isOutOfStock = product.stockStatus === "OUT_OF_STOCK" || availableStock <= 0;
  const maxOrderQuantity = Math.max(0, availableStock);

  const handleAddToCart = () => {
    if (isOutOfStock || maxOrderQuantity <= 0) return;
    const finalQty = Math.max(1, Math.min(maxOrderQuantity, quantity));
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: currentPrice,
      image: activeImage,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
      quantity: finalQty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock || maxOrderQuantity <= 0) return;
    const finalQty = Math.max(1, Math.min(maxOrderQuantity, quantity));
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: currentPrice,
      image: activeImage,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
      quantity: finalQty,
    });
    navigate("/checkout?method=online");
  };

  const supportEmail = siteSettings?.email || "bbgtextilebharat1@gmail.com";

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={siteSettings} />

      <main className="flex-1 py-8 sm:py-12 pb-28 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <Link to="/" className="hover:text-[#1A365D]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link to="/products" className="hover:text-[#1A365D]">Products</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT: Image Gallery (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[3/4] max-h-[640px] bg-[#FAF6EE] rounded-3xl overflow-hidden border border-[#E8DFD3] shadow-md flex items-center justify-center">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain sm:object-cover object-top transition-all duration-300"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                  {product.isBestSeller && (
                    <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase bg-[#E5A020] text-white rounded-md shadow-sm">
                      Best Seller
                    </span>
                  )}
                  {product.isNewArrival && (
                    <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase bg-[#0F2444] text-white rounded-md shadow-sm">
                      New Arrival
                    </span>
                  )}
                </div>

                {/* Arrow navigation on main image */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev > 0 ? prev - 1 : images.length - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg flex items-center justify-center transition-all z-10 cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev < images.length - 1 ? prev + 1 : 0
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg flex items-center justify-center transition-all z-10 cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image counter indicator */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full z-10 pointer-events-none">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div
                  ref={thumbnailsRef}
                  className="flex items-center gap-2.5 overflow-x-auto py-1 px-0.5 scrollbar-thin"
                >
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        idx === activeImageIndex
                          ? "border-[#1A365D] ring-2 ring-[#1A365D]/30 scale-102 shadow-md"
                          : "border-gray-200 opacity-70 hover:opacity-100 bg-[#FAF6EE]"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Details & Purchase Form (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-[#1A365D] rounded-full border border-blue-200">
                    {product.category?.name || "Bottom Wear"}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    SKU: {product.sku}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="inline-flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                    <span>4.9</span>
                    <span>★</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    (142 Verified Wholesale Reviews)
                  </span>
                </div>

                {/* Price Display */}
                <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border border-amber-500/20 mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-[#1A365D]">
                      ₹{currentPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{Math.round(currentPrice * 1.5).toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      33% OFF
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 font-semibold mt-1">
                    Direct Mill Wholesale Rate: ₹{product.wholesalePrice || Math.round(currentPrice * 0.65)}/pc in bulk bundles (10+ pcs)
                  </p>
                </div>
              </div>

              {/* Shade / Color Options */}
              {colors.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Select Color / Shade: <span className="text-[#1A365D] font-bold">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedColor === c
                            ? "bg-[#1A365D] text-white border-[#1A365D] shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options */}
              {sizes.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Select Size: <span className="text-[#1A365D] font-bold">{selectedSize}</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition-all ${
                          selectedSize === s
                            ? "bg-amber-50 text-[#1A365D] border-amber-400 shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span>{s}</span>
                        {selectedSize === s && (
                          <Check className="w-4 h-4 text-[#1A365D]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Quantity
                  </label>
                  {!isOutOfStock && availableStock > 0 && availableStock <= 10 && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Limited Stock
                    </span>
                  )}
                </div>

                {isOutOfStock ? (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide">Out of Stock</div>
                      <div className="text-[11px] text-red-600 mt-0.5">सध्या हा माल संपला आहे. नवीन स्टॉक लवकरच उपलब्ध होईल.</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-sm font-bold text-gray-900 min-w-[2.5rem] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(maxOrderQuantity, q + 1))}
                        disabled={quantity >= maxOrderQuantity}
                        className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
                        title={quantity >= maxOrderQuantity ? "कमाल ५ नग मर्यादा / Max 5 units allowed" : "Add one"}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      Total: ₹{(currentPrice * quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                {isOutOfStock ? (
                  <div className="w-full py-4 px-6 rounded-2xl bg-gray-100 text-gray-500 font-bold text-sm text-center border border-gray-300 shadow-inner flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Orders Closed (स्टॉक संपला आहे)</span>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-slate-950" />
                      <span>Buy Now & Pay Online (Razorpay)</span>
                    </button>

                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full py-3.5 px-6 rounded-2xl bg-[#1A365D] hover:bg-[#0F2444] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{added ? "Added to Cart!" : "Add to Cart"}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Value Guarantees */}
              <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-3 text-xs text-gray-600">
                <Link
                  to="/return-policy"
                  className="flex items-center gap-2 hover:text-[#1A365D] transition-colors col-span-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 font-bold text-amber-950"
                >
                  <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>7 Days Easy Return & Exchange Guarantee</span>
                  <span className="text-[10px] text-amber-700 font-normal underline ml-auto">Know more</span>
                </Link>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Colorfast Bio-Washed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>4-Way High Elasticity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Pan-India Transport</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Zero Transparency</span>
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-serif text-sm font-bold text-gray-900 mb-2">
                  Product Description & Mill Features
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 sm:mt-24 pt-12 border-t border-gray-200">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((rel) => (
                  <ProductCard
                    key={rel.id}
                    product={rel}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer settings={siteSettings} />
    </div>
  );
}
