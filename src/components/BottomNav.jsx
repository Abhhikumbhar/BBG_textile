import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Package, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { isAppMode } from "@/lib/isAppMode";

export default function BottomNav() {
  const location = useLocation();
  const pathname = location.pathname;
  const { totalItems, setIsOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    setInApp(isAppMode());
  }, []);

  // When loaded inside mobile app (where native bottom navigation already exists),
  // hide this floating bar to prevent double bottom bar overlap!
  if (inApp) {
    return null;
  }

  // On product detail page, let the product-specific action pill handle actions
  const isProductDetailPage = pathname?.startsWith("/products/") && pathname !== "/products";
  if (isProductDetailPage) {
    return null;
  }

  const isHome = pathname === "/";
  const isProducts = pathname?.startsWith("/products") && pathname === "/products";
  const isCategories = pathname?.startsWith("/categories");
  const isAccount = pathname === "/account" || pathname === "/login" || pathname === "/register";

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center pointer-events-none sm:hidden px-4">
      <nav
        aria-label="Mobile Navigation"
        className="pointer-events-auto bg-stone-950/95 backdrop-blur-xl border border-stone-800 rounded-full p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] flex items-center gap-1.5 transition-all duration-300"
      >
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex items-center justify-center transition-all duration-300 ${
            isHome
              ? "w-10 h-10 bg-white text-stone-950 rounded-full shadow-lg scale-105"
              : "w-10 h-10 text-stone-400 hover:text-white active:scale-90"
          }`}
          aria-label="Home"
          title="Home"
        >
          <Home className={`w-4.5 h-4.5 ${isHome ? "stroke-[2.4]" : "stroke-[2]"}`} />
        </Link>

        {/* 2. Products Catalog */}
        <Link
          to="/products"
          className={`flex items-center justify-center transition-all duration-300 ${
            isProducts
              ? "w-10 h-10 bg-white text-stone-950 rounded-full shadow-lg scale-105"
              : "w-10 h-10 text-stone-400 hover:text-white active:scale-90"
          }`}
          aria-label="Products Catalog"
          title="Products"
        >
          <Package className={`w-4.5 h-4.5 ${isProducts ? "stroke-[2.4]" : "stroke-[2]"}`} />
        </Link>

        {/* 3. Categories */}
        <Link
          to="/categories"
          className={`flex items-center justify-center transition-all duration-300 ${
            isCategories
              ? "w-10 h-10 bg-white text-stone-950 rounded-full shadow-lg scale-105"
              : "w-10 h-10 text-stone-400 hover:text-white active:scale-90"
          }`}
          aria-label="Categories"
          title="Categories"
        >
          <LayoutGrid className={`w-4.5 h-4.5 ${isCategories ? "stroke-[2.4]" : "stroke-[2]"}`} />
        </Link>

        {/* 4. Cart Drawer */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-10 h-10 flex items-center justify-center text-stone-400 hover:text-white active:scale-90 transition-all duration-200"
          aria-label="Shopping Cart"
          title="Cart"
        >
          <ShoppingBag className="w-4.5 h-4.5 stroke-[2]" />
          {totalItems > 0 && (
            <span className="absolute top-1 right-1 bg-white text-stone-950 text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
              {totalItems}
            </span>
          )}
        </button>

        {/* 5. Account / Login */}
        <Link
          to={isAuthenticated ? "/account" : "/login"}
          className={`relative flex items-center justify-center transition-all duration-300 ${
            isAccount
              ? "w-10 h-10 bg-white text-stone-950 rounded-full shadow-lg scale-105 font-bold"
              : "w-10 h-10 text-stone-400 hover:text-white active:scale-90"
          }`}
          aria-label="Account"
          title="Account"
        >
          <User className={`w-4.5 h-4.5 ${isAccount ? "stroke-[2.4]" : "stroke-[2]"}`} />
          {user?.role === "admin" && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 border border-stone-950" />
          )}
        </Link>
      </nav>
    </div>
  );
}
