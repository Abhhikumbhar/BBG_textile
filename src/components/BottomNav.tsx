"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItems, setIsOpen } = useCart();

  // Hide on admin routes or if on desktop
  if (pathname?.startsWith("/admin")) {
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

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center pointer-events-none sm:hidden px-4">
      <nav
        aria-label="Mobile Navigation"
        className="pointer-events-auto bg-[#0B1220]/95 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)] flex items-center gap-1.5 transition-all duration-300"
      >
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex items-center justify-center transition-all duration-300 ${
            isHome
              ? "w-11 h-11 bg-white text-[#0B1220] rounded-full shadow-lg scale-105"
              : "w-11 h-11 text-gray-400 hover:text-white active:scale-90"
          }`}
          aria-label="Home"
          title="Home"
        >
          <Home className={`w-5 h-5 ${isHome ? "stroke-[2.4]" : "stroke-[2]"}`} />
        </Link>

        {/* 2. Products Catalog */}
        <Link
          href="/products"
          className={`flex items-center justify-center transition-all duration-300 ${
            isProducts
              ? "w-11 h-11 bg-white text-[#0B1220] rounded-full shadow-lg scale-105"
              : "w-11 h-11 text-gray-400 hover:text-white active:scale-90"
          }`}
          aria-label="Products Catalog"
          title="Products"
        >
          <Package className={`w-5 h-5 ${isProducts ? "stroke-[2.4]" : "stroke-[2]"}`} />
        </Link>

        {/* 3. Categories (4-Squares Grid icon from user reference) */}
        <Link
          href="/categories"
          className={`flex items-center justify-center transition-all duration-300 ${
            isCategories
              ? "w-11 h-11 bg-white text-[#0B1220] rounded-full shadow-lg scale-105"
              : "w-11 h-11 text-gray-400 hover:text-white active:scale-90"
          }`}
          aria-label="Categories"
          title="Categories"
        >
          <LayoutGrid className={`w-5 h-5 ${isCategories ? "stroke-[2.4]" : "stroke-[2]"}`} />
        </Link>

        {/* 4. Cart Drawer */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white active:scale-90 transition-all duration-200"
          aria-label="Shopping Cart"
          title="Cart"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2]" />
          {totalItems > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-[#C53030] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
              {totalItems}
            </span>
          )}
        </button>

        {/* 5. Account / Login */}
        <Link
          href="/admin/login"
          className="relative w-11 h-11 flex items-center justify-center text-gray-400 hover:text-amber-400 active:scale-90 transition-all duration-200"
          aria-label="Account"
          title="Account"
        >
          <User className="w-5 h-5 stroke-[2]" />
        </Link>
      </nav>
    </div>
  );
}
