import React from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import HeroVideo from "@/components/HeroVideo";
import {
  getSiteSettings,
  getHomeBanners,
  getFeaturedProducts,
  getNewArrivalProducts,
  getCategories,
} from "@/lib/data";
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Truck,
  Crown,
  Layers,
  CheckCircle2,
  Phone,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, banners, featuredProducts, newArrivals, categories] =
    await Promise.all([
      getSiteSettings(),
      getHomeBanners(),
      getFeaturedProducts(),
      getNewArrivalProducts(),
      getCategories(),
    ]);

  const activeBanner = banners[0];
  const cleanWhatsApp = (settings?.whatsappNumber || "918767322501").replace(
    /[^0-9]/g,
    ""
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={settings || undefined} />

      <main className="flex-1">
        {/* FLIPKART-STYLE QUICK CATEGORIES BAR - DYNAMICALLY POWERED BY ADMIN CATEGORIES */}
        <section className="bg-white border-b border-gray-200/70 py-2.5 sm:py-3.5 overflow-x-auto scrollbar-none shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 sm:gap-7 min-w-max sm:min-w-0 sm:justify-center">
            <Link
              href="/products"
              className="flex flex-col items-center gap-1 group text-center shrink-0"
            >
              <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-full p-0.5 bg-gradient-to-tr from-[#1A365D] to-amber-500 shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden flex items-center justify-center">
                  <Image
                    src="/images/logo/bbg-logo-icon.png"
                    alt="All Products - SBBG Textile Exporter"
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-gray-800 group-hover:text-[#1A365D]">
                <span className="sm:hidden">All</span>
                <span className="hidden sm:inline">All Products</span>
              </span>
            </Link>

            {categories.map((cat, idx) => {
              const borderGradients = [
                "from-amber-400 to-[#1A365D]",
                "from-emerald-500 to-amber-400",
                "from-[#1A365D] to-indigo-500",
                "from-rose-500 to-amber-400",
                "from-teal-500 to-[#1A365D]",
              ];
              const borderGradient = borderGradients[idx % borderGradients.length];
              const catImage =
                cat.imageUrl ||
                (idx % 2 === 0
                  ? "/images/products/bbg-studio-hd-crimson-red.jpg"
                  : "/images/products/bbg-studio-hd-cs-white.jpg");

              const shortName =
                cat.name.toLowerCase().includes("churidar") || cat.name.toLowerCase().includes("legging")
                  ? "Churidar"
                  : cat.name.toLowerCase().includes("tight") || cat.name.toLowerCase().includes("short") || cat.name.toLowerCase().includes("cycling")
                  ? "Shorts"
                  : cat.name.replace(/Women's /i, "").trim();

              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${encodeURIComponent(cat.slug)}`}
                  className="flex flex-col items-center gap-1 group text-center shrink-0"
                >
                  <div
                    className={`w-12 h-12 sm:w-15 sm:h-15 rounded-full p-0.5 bg-gradient-to-tr ${borderGradient} shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center`}
                  >
                    <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden">
                      <Image
                        src={catImage}
                        alt={cat.name}
                        width={56}
                        height={56}
                        unoptimized={catImage.startsWith("data:")}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-gray-800 group-hover:text-[#1A365D] max-w-[85px] sm:max-w-[120px] truncate">
                    <span className="sm:hidden">{shortName}</span>
                    <span className="hidden sm:inline">{cat.name}</span>
                  </span>
                </Link>
              );
            })}

            <Link
              href="/categories"
              className="flex flex-col items-center gap-1 group text-center shrink-0"
            >
              <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-amber-200 shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#0B1220] flex items-center justify-center text-amber-300">
                  <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-gray-800 group-hover:text-[#1A365D]">
                Categories
              </span>
            </Link>

            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                "Hello BBG Textile, I am looking for direct mill wholesale rate catalog."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 group text-center shrink-0"
            >
              <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 to-emerald-300 shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#25D366] flex items-center justify-center text-white">
                  <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-gray-800 group-hover:text-emerald-700">
                Mill Rates
              </span>
            </a>
          </div>
        </section>

        {/* LUXURY EDITORIAL HERO SECTION */}
        <section className="relative bg-[#0B1120] text-white overflow-hidden min-h-[440px] sm:min-h-[700px] lg:min-h-[760px] pb-10 sm:pb-20 lg:pb-24 flex items-center">
          {/* Autoplaying Background Video & Ambient Luxury Lighting */}
          <HeroVideo />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-20 lg:py-24 w-full">
            {/* Open Editorial Layout */}
            <div className="max-w-2xl lg:max-w-3xl">
              {/* Luxury Brand & Collection Eyebrow Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase backdrop-blur-md shadow-sm">
                  <div className="w-4 h-4 rounded-full bg-white p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
                    <Image
                      src="/images/logo/bbg-logo-icon.png"
                      alt="SBBG Textile Exporter Logo"
                      width={16}
                      height={16}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span>SBBG Textile Exporter</span>
                </div>

                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/[0.08] border border-white/20 text-slate-200 text-[10px] sm:text-xs font-medium tracking-[0.16em] uppercase backdrop-blur-md shadow-sm">
                  <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
                  <span className="sm:hidden">2026 Collection</span>
                  <span className="hidden sm:inline">New Arrival • 2026 Collection</span>
                </div>
              </div>

              {/* Title - Punchy & Short on Mobile, Full Editorial on Desktop */}
              <h1 className="font-luxury text-2xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal sm:font-medium tracking-[0.015em] leading-[1.18] sm:leading-[1.08] mb-3 sm:mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                <span className="text-studio-pearl">
                  {/* Mobile concise title */}
                  <span className="sm:hidden block">
                    4-Way Stretch Cotton Lycra Leggings
                  </span>
                  {/* Desktop original full title */}
                  <span className="hidden sm:block">
                    {activeBanner?.title || "4-Way Stretch Cotton Lycra Leggings"}
                  </span>
                </span>
              </h1>

              {/* Subtitle - Short 1-line tag on mobile, Full copy on desktop */}
              <p className="sm:hidden text-xs text-slate-200/90 mb-4 font-light drop-shadow-sm">
                Super combed 95% cotton • Bio-washed 4-way stretch
              </p>
              <p className="hidden sm:block text-base sm:text-lg text-slate-200/90 leading-relaxed mb-6 font-light max-w-xl drop-shadow-sm">
                {activeBanner?.subtitle ||
                  "Super combed 95% cotton & 5% Lycra. Bio-washed for supreme softness, non-sheer all-day comfort, and graceful ankle gathers."}
              </p>

              {/* Feature Chips - Hidden on mobile to eliminate clutter, Full on desktop */}
              <div className="hidden sm:flex flex-wrap items-center gap-2.5 mb-8">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.08] hover:bg-white/[0.12] text-slate-100 border border-white/15 backdrop-blur-md transition-colors">
                  <Layers className="w-3 h-3 text-amber-300" /> 4-Way Super Stretch
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.08] hover:bg-white/[0.12] text-slate-100 border border-white/15 backdrop-blur-md transition-colors">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Bio-Washed & Non-Sheer
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.08] hover:bg-white/[0.12] text-slate-100 border border-white/15 backdrop-blur-md transition-colors">
                  <Award className="w-3 h-3 text-amber-300" /> Sangli Direct Mill Rates
                </span>
              </div>

              {/* Action Button - Direct Wholesale Enquiry */}
              <div className="flex items-center gap-4 pt-1">
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    "Hello SBBG Textile Exporter, I am interested in wholesale inquiry for Cotton Lycra Leggings."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 sm:px-8 py-2.5 sm:py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4 text-slate-950" />
                  <span>Wholesale Enquiries</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* SVG Multi-Layered Silk Wave Divider - Seamless blend into linen cream background */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
            <svg
              className="relative block w-full h-12 sm:h-16 lg:h-24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGoldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D49B28" stopOpacity="0.35" />
                  <stop offset="45%" stopColor="#F5D061" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#C68D2B" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="waveSoftSilk" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EADECF" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#F5EFE6" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#EADECF" stopOpacity="0.85" />
                </linearGradient>
              </defs>

              {/* Tier 1: Shimmering Gold Silk Trim */}
              <path
                fill="url(#waveGoldGlow)"
                d="M0,38 C240,75 480,15 720,48 C960,82 1200,22 1440,42 L1440,120 L0,120 Z"
              />

              {/* Tier 2: Elegant Soft Ivory Silk Drape */}
              <path
                fill="url(#waveSoftSilk)"
                d="M0,54 C260,20 520,80 780,44 C1040,14 1260,66 1440,50 L1440,120 L0,120 Z"
              />

              {/* Tier 3: Seamless Solid Base Flow into Trust Section */}
              <path
                fill="#F7F2EC"
                d="M0,70 C280,38 560,94 840,58 C1100,28 1320,74 1440,62 L1440,120 L0,120 Z"
              />
            </svg>
          </div>
        </section>

        {/* TRUST SIGNALS BAR - Seamlessly matched with Botanical Linen & Royal Navy Theme */}
        <section className="bg-[#F7F2EC]/90 backdrop-blur-md border-b border-[#E3D7C7] py-6 relative z-10 shadow-[0_4px_16px_rgba(100,75,40,0.03)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3 group">
                <div className="p-2.5 bg-amber-500/10 text-amber-800 border border-amber-600/20 rounded-xl group-hover:bg-amber-500/20 transition-colors shrink-0">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0F2444]">Direct From Source</div>
                  <div className="text-xs text-[#7A6953]">Kupwad MIDC Mill Hub</div>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="p-2.5 bg-[#1A365D]/10 text-[#1A365D] border border-[#1A365D]/20 rounded-xl group-hover:bg-[#1A365D]/20 transition-colors shrink-0">
                  <Award className="w-5 h-5 text-[#1A365D]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0F2444]">Colorfast & Durable</div>
                  <div className="text-xs text-[#7A6953]">Premium Combed Yarns</div>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="p-2.5 bg-emerald-600/10 text-emerald-800 border border-emerald-600/20 rounded-xl group-hover:bg-emerald-600/20 transition-colors shrink-0">
                  <Truck className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0F2444]">Pan-India Dispatch</div>
                  <div className="text-xs text-[#7A6953]">B2B & B2C Shipping</div>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="p-2.5 bg-amber-600/10 text-amber-900 border border-amber-600/20 rounded-xl group-hover:bg-amber-600/20 transition-colors shrink-0">
                  <Layers className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0F2444]">Custom Cuts & Rolls</div>
                  <div className="text-xs text-[#7A6953]">Retail & Bulk Quantities</div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* FEATURED PRODUCTS SECTION: FLAGSHIP FULL-LENGTH CHURIDAR LEGGINGS */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1 flex items-center gap-2">
                  <span>FLAGSHIP MILL COLLECTION</span>
                  <span className="w-8 h-[1.5px] bg-amber-600/50 inline-block" />
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2444]">
                  Featured Textile & Garments
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Premium 4-way stretch fabrics, churidars, tight shorts & bottom wear manufactured with highest precision.
                </p>
              </div>
              <Link
                href="/products"
                className="mt-4 sm:mt-0 text-sm font-bold text-[#1A365D] hover:text-[#2A4365] flex items-center gap-1 group"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {featuredProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-gray-500">Products are currently being loaded into the catalogue.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    whatsappNumber={settings?.whatsappNumber}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* NEW ARRIVALS & TRENDING COLLECTION */}
        {newArrivals.length > 0 && (
          <section className="py-10 sm:py-20 bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1 block">
                    Fresh Off The Loom
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl font-bold text-gray-900">
                    New Arrivals & Trending Wear
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Newly launched colors, sizes, and styles crafted with highest grade combed cotton.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="mt-3 sm:mt-0 text-xs sm:text-sm font-bold text-[#1A365D] hover:text-[#2A4365] flex items-center gap-1 group"
                >
                  <span>Explore All Items</span>
                  <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
                {newArrivals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    whatsappNumber={settings?.whatsappNumber}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* B2B & WHOLESALE CALLOUT BANNER - Harmonized with Botanical Linen Background */}
        <section className="py-16 sm:py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl p-8 sm:p-12 lg:p-14 overflow-hidden bg-[#FFFDF9]/95 backdrop-blur-xl border border-[#DFD2BF] shadow-[0_25px_60px_-15px_rgba(154,124,84,0.22)] flex flex-col lg:flex-row items-center justify-between gap-10">
              {/* Soft Warm Ambient Glows */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#1A365D]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/35 to-transparent" />

              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-600/25 text-amber-900 text-xs font-semibold tracking-[0.16em] uppercase mb-4 backdrop-blur-sm shadow-sm">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>For Retailers, Tailors & Institutions</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A365D] mb-4 leading-[1.18] tracking-tight">
                  Partner with BBG Textile for{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-[#B47C35] to-amber-800">
                    Bulk Wholesale Supply
                  </span>
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-7 font-normal">
                  Are you a garment brand, tailoring house, cloth store, or institutional uniform buyer? We offer flexible minimum order quantities, direct mill prices, custom dye matching, and prompt transport dispatch from Sangli.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm text-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-600/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    </div>
                    <span className="font-medium">Special tiered volume discounts</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-600/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    </div>
                    <span className="font-medium">Sample swatches dispatched on request</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-600/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    </div>
                    <span className="font-medium">Consistent shade repeat guarantee</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-600/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    </div>
                    <span className="font-medium">Fast transport logistics across India</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full sm:w-auto shrink-0 relative z-10">
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    "Hello BBG Textile, I am a wholesale buyer looking for fabric quotation and bulk supply terms."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2.5"
                >
                  <WhatsAppIcon className="w-4 h-4 text-slate-950" />
                  <span>Enquire on WhatsApp</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </a>
                <Link
                  href="/contact"
                  className="px-7 py-4 bg-white hover:bg-amber-50/50 text-[#1A365D] border border-[#1A365D]/25 hover:border-[#1A365D]/50 rounded-2xl font-semibold text-sm shadow-sm hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2.5"
                >
                  <Phone className="w-4 h-4 text-amber-700" />
                  <span>Request Rate Card</span>
                </Link>
              </div>
            </div>
          </div>
        </section>


      </main>

      <Footer settings={settings || undefined} />
    </div>
  );
}
