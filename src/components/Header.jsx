import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Crown,
  User,
  ShieldCheck,
  LogOut,
} from "lucide-react";

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
    { name: "Track Order", href: "/track-order" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const businessName = settings?.businessName || "SBBG BHARAT TEXTILE";
  const email = settings?.email || "bbgtextilebharat1@gmail.com";

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
                "Direct Mill Wholesale & Export — Sangli Works: bbgtextilebharat1@gmail.com"}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{email}</span>
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
              {/* Email Direct Contact */}
              <a
                href={`mailto:${email}`}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-medium transition-all"
                title={`Email: ${email}`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Us</span>
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
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 py-1.5 px-3 rounded-full text-xs font-semibold text-gray-300 hover:text-amber-300 hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
                  >
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#0B1220] text-xs font-bold shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Register</span>
                  </Link>
                </div>
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
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-amber-300 bg-amber-400/10 border border-amber-400/20"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>My Account ({user?.name || "User"})</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/25 hover:bg-amber-400/20 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-[#0B1220] bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm transition-all"
                  >
                    <span>Register</span>
                  </Link>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 hover:bg-amber-500/25 font-medium text-xs shadow-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email: {email}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
