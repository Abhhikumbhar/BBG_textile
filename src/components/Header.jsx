import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  Menu,
  X,
  Phone,
  MapPin,
  ChevronRight,
  Crown,
  User,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function Header({ settings }) {
  const location = useLocation();
  const pathname = location.pathname;
  const { totalItems, setIsOpen } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
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

  const businessName = settings?.businessName || "SBBG BHARAT TEXTILE";
  const whatsapp = settings?.whatsappNumber || "918767322501";
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, "");

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#0D1B2A] text-gray-200 text-xs py-2 px-4 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-ellipsis">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <p className="text-[11px] sm:text-xs font-medium tracking-wide text-amber-200/90 truncate">
              {settings?.announcementText ||
                "Direct Mill Wholesale & Export — Sangli Works: +91 87673 22501"}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 font-bold text-amber-300 hover:text-amber-200 transition-colors"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Panel</span>
              </Link>
            )}
            <a
              href={`tel:${settings?.phoneNumber || "8767322501"}`}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+91 87673 22501</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header
        className={`sticky top-0 z-30 transition-all duration-300 bg-[#0B1220]/95 backdrop-blur-md border-b border-white/10 ${
          scrolled ? "shadow-xl py-2.5 sm:py-3" : "py-3 sm:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden">
                  <img
                    src="/images/logo/bbg-logo-icon.png"
                    alt="SBBG Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base sm:text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  {businessName}
                </span>
                <span className="text-[10px] text-amber-400/90 font-medium tracking-widest uppercase">
                  Sangli Textile Works
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`text-sm font-medium transition-colors relative py-1 ${
                      isActive
                        ? "text-amber-400 font-semibold"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* WhatsApp Quick Link */}
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  "Hello BBG Textile, I am visiting your website and have an enquiry."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium transition-all"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>Chat</span>
              </a>

              {/* User Account / Profile Button */}
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-colors"
                  title="My Account"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-[#0B1220] flex items-center justify-center font-bold text-[10px]">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden lg:inline-block max-w-[90px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
              )}

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="relative p-2 text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-full transition-all"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-[#0D1B2A] text-[10px] sm:text-[11px] font-bold h-4 sm:h-5 min-w-[16px] sm:min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Open Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0D1B2A] border-b border-amber-500/20 px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-amber-400/15 text-amber-300 font-semibold"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </Link>
                );
              })}

              {/* Account Link in Mobile Menu */}
              <Link
                to={isAuthenticated ? "/account" : "/login"}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-amber-300 bg-amber-400/10 border border-amber-400/20"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>{isAuthenticated ? `माझे खाते (${user?.name})` : "लॉगिन / Register करा"}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-amber-400 bg-amber-500/20 border border-amber-500/40"
                >
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Admin Dashboard</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </Link>
              )}

              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
