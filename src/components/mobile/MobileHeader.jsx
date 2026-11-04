import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  ChevronRight,
  User,
  Phone,
  Sparkles,
  Mail,
} from "lucide-react";

export default function MobileHeader({ settings, title, showBack = false, onBack }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const businessName = settings?.businessName || "BBG TEXTILE";
  const email = settings?.email || "bbgtextilebharat1@gmail.com";

  return (
    <>
      {/* Top Mobile Bar - Sleek minimal aesthetic matching reference photo */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-stone-200/50">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              type="button"
              onClick={onBack || (() => window.history.back())}
              className="w-10 h-10 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-transform"
              aria-label="Go Back"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-transform"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}

          {title ? (
            <h1 className="font-serif text-lg font-bold text-stone-900 tracking-tight">
              {title}
            </h1>
          ) : (
            <Link to="/" className="flex items-center gap-2">
              <span className="font-serif text-base font-bold tracking-tight text-stone-900">
                SBBG <span className="font-sans text-xs font-semibold text-stone-600 tracking-wider">TEXTILE</span>
              </span>
            </Link>
          )}
        </div>

        {/* Right Action Icons: Shopping Bag */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60 active:scale-95 relative transition-transform"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
            {totalItems > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-stone-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Slide-over Luxury Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-[#FAF8F5] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-stone-200/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-sm font-bold">
                  B
                </div>
                <div>
                  <div className="font-serif font-bold text-stone-900 text-sm">SBBG BHARAT TEXTILE</div>
                  <div className="text-[10px] text-stone-600 uppercase tracking-widest">Sangli Direct Mill</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:bg-stone-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5 text-sm">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-stone-900 font-medium hover:bg-stone-200/60"
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-stone-600" />
              </Link>
              <Link
                to="/products"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-stone-900 font-medium hover:bg-stone-200/60"
              >
                <span>All Products</span>
                <ChevronRight className="w-4 h-4 text-stone-600" />
              </Link>
              <Link
                to="/categories"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-stone-900 font-medium hover:bg-stone-200/60"
              >
                <span>Categories</span>
                <ChevronRight className="w-4 h-4 text-stone-600" />
              </Link>
              <Link
                to="/products?newArrival=true"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-stone-900 font-medium hover:bg-stone-200/60"
              >
                <span>New Arrivals</span>
                <span className="text-[10px] bg-stone-900 text-white px-2 py-0.5 rounded-full font-medium">New</span>
              </Link>
              <Link
                to="/products?bestSeller=true"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-stone-900 font-medium hover:bg-stone-200/60"
              >
                <span>Best Sellers</span>
                <ChevronRight className="w-4 h-4 text-stone-600" />
              </Link>

              <div className="pt-4 border-t border-stone-200/60 mt-4 space-y-1">
                {isAuthenticated ? (
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-stone-800 hover:bg-stone-200/60 font-medium"
                  >
                    <User className="w-4 h-4 text-stone-600" />
                    <span>My Account ({user?.name || "User"})</span>
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pb-1">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-stone-800 bg-stone-200/60 hover:bg-stone-200"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 shadow-xs"
                    >
                      <span>Register</span>
                    </Link>
                  </div>
                )}
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent(
                    "Hello BBG Textile, I am visiting your mobile app and want wholesale catalog."
                  )}`}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#1A365D] bg-blue-50 font-medium mt-1"
                >
                  <Mail className="w-4 h-4 text-[#1A365D]" />
                  <span>Email Wholesale Enquiry</span>
                </a>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200/60 text-xs text-stone-600 text-center">
              100% Super-Combed Bio-Washed Cotton
            </div>
          </div>
        </div>
      )}
    </>
  );
}
