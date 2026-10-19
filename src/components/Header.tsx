"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Menu,
  X,
  Phone,
  MapPin,
  ChevronRight,
  Crown,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

interface HeaderProps {
  settings?: {
    businessName?: string | null;
    phone?: string | null;
    whatsappNumber?: string | null;
    announcementText?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    googleMapsUrl?: string | null;
  } | null;
}

export default function Header({ settings }: HeaderProps) {
  const pathname = usePathname();
  const { totalItems, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const businessName = settings?.businessName || "SBBG TEXTILE EXPORTER";
  const phone = settings?.phone || "+91 87673 22501";
  const whatsapp = settings?.whatsappNumber || "918767322501";
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, "");
  const fullAddress =
    settings?.address ||
    "GROUND FLOOR, KHARE MALA, S.NO-204 PLOT NO 28, Kupwad MIDC Area, Madhavnagar, Sangli, Maharashtra - 416436";
  const shortAddress = settings?.city
    ? `Kupwad MIDC, ${settings.city}`
    : "Kupwad MIDC, Sangli";
  const mapsUrl =
    settings?.googleMapsUrl ||
    "https://maps.google.com/?q=Kupwad+MIDC+Sangli+Maharashtra";

  return (
    <div className="w-full">
      {/* Top Announcement Bar */}
      <div className="bg-[#0B1220] text-[#F7FAFC] px-3 sm:px-4 py-2 text-xs font-medium border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1.5 md:gap-3">
          {/* Announcement / Tagline */}
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-center md:text-left">
            {/* Mobile-only concise text */}
            <div className="sm:hidden flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="font-serif uppercase font-bold text-amber-300 tracking-wider text-[11px]">
                Direct Mill Wholesale • Sangli
              </span>
            </div>

            {/* Desktop full text */}
            <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-serif uppercase font-bold text-amber-300 tracking-wider text-xs">
                Premium Fabrics & Garments
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-100 font-medium text-xs">
                Direct Mill Wholesale Supply
              </span>
              <span className="hidden lg:inline text-gray-500">•</span>
              <span className="hidden lg:inline text-amber-200/90 font-medium text-xs">
                Sangli Mill Hub
              </span>
            </div>
          </div>

          {/* Location Address & Direct Contact Actions - Desktop only to save space on mobile */}
          <div className="hidden md:flex items-center justify-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-300">
            {/* Address / Location */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium transition-colors"
              title={fullAddress}
            >
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{shortAddress}</span>
            </a>

            <span className="text-gray-600 select-none">•</span>

            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-gray-400 shrink-0" />
              <span>{phone}</span>
            </a>

            <span className="text-gray-600 select-none">•</span>

            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Sticky with fixed stable height (zero bounce/jitter) */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <nav className="py-3 sm:py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center group py-0.5">
            <Image
              src="/images/logo/sbbg-header-logo-v2.png"
              alt="SBBG TEXTILE EXPORTER - Premium Fabrics & Garments"
              width={390}
              height={100}
              priority
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : Boolean(pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-serif text-[15px] sm:text-base tracking-wide transition-colors relative py-1 ${
                    isActive
                      ? "text-[#1A365D] font-bold"
                      : "text-gray-700 hover:text-[#1A365D] font-medium"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A365D] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick Enquiry Link */}
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                "Hello BBG Textile, I am interested in exploring your fabrics collection."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-[#1A365D] bg-gradient-to-r from-amber-100/90 via-amber-200/80 to-amber-100/90 hover:from-amber-200 hover:to-amber-300 border border-amber-300/80 rounded-full transition-all shadow-sm hover:shadow"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-700" />
              <span>Wholesale Enquiry</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-gray-700 hover:text-[#1A365D] hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C53030] text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu & Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-40 md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2.5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : Boolean(pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-serif text-base tracking-wide font-medium transition-colors ${
                      isActive
                        ? "bg-[#1A365D] text-white font-bold shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? "text-white/80" : "text-gray-400"}`} />
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    "Hello BBG Textile, I am visiting your website and have an enquiry regarding wholesale products."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#25D366] hover:bg-[#20BD5A] active:bg-[#1DA851] text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.98]"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white" />
                  <span>Enquire on WhatsApp</span>
                </a>
                <a
                  href={`tel:${phone}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-800 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
                >
                  <Phone className="w-4 h-4 text-[#1A365D]" />
                  <span>Call {phone}</span>
                </a>
              </div>

              {/* Registered Mill Address Card */}
              <div className="pt-2 border-t border-gray-100">
                <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 flex items-start gap-2.5 text-xs">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-xs">Mill & Office Address:</p>
                    <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5">{fullAddress}</p>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#1A365D] font-bold mt-1.5 hover:underline"
                    >
                      <span>Open in Google Maps</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
    </div>
  );
}
