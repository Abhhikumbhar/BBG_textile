"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  MessageSquare,
  Sliders,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  User,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  // If on login page, render clean layout without sidebar
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage && !adminUser) {
      fetch("/api/auth/me")
        .then((res) => {
          if (!res.ok) {
            router.push("/admin/login");
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (data?.user) setAdminUser(data.user);
        })
        .catch(() => {
          router.push("/admin/login");
        });
    }
  }, [isLoginPage, adminUser, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (e) {
      console.error("Logout failed:", e);
      router.push("/admin/login");
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { name: "Website Content", href: "/admin/settings", icon: Sliders },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex flex-col md:flex-row">
      {/* DESKTOP SIDEBAR - Clean Light Luxury Theme */}
      <aside className="hidden md:flex flex-col w-64 bg-white text-slate-700 border-r border-[#E8DEC8] shrink-0 select-none shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E8DEC8] flex items-center justify-between bg-gradient-to-r from-amber-500/5 to-transparent">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-amber-600/30 shadow-xs group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo/bbg-logo-icon.png"
                alt="SBBG Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-[#0F2444] tracking-wide block leading-none">
                SBBG TEXTILE
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3.5 py-5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-amber-500/15 text-[#0F2444] font-bold border-l-4 border-amber-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-700" : "text-slate-400"}`} />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-amber-700" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Storefront Link & Admin Profile */}
        <div className="p-4 border-t border-[#E8DEC8] space-y-3 bg-[#FCFAF6]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-amber-50/70 border border-slate-200 hover:border-amber-200 transition-colors shadow-2xs"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
              <span>Live Storefront</span>
            </span>
            <span className="text-[10px] text-amber-800 font-bold bg-amber-500/15 px-1.5 py-0.5 rounded">Sangli</span>
          </Link>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {adminUser?.name || "Administrator"}
                </p>
                <p className="text-[10px] font-mono text-slate-500 truncate">
                  {adminUser?.email || "admin@gmail.com"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR - Clean Light Theme */}
      <div className="md:hidden bg-white text-slate-900 p-3.5 flex items-center justify-between border-b border-[#E8DEC8] sticky top-0 z-30 shadow-xs">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 p-0.5 flex items-center justify-center shrink-0 border border-amber-600/20">
            <Image
              src="/images/logo/bbg-logo-icon.png"
              alt="SBBG Logo"
              width={28}
              height={28}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-serif font-bold text-base text-[#0F2444]">SBBG Textile Admin</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            target="_blank"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            title="View Storefront"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white text-slate-700 p-4 border-b border-[#E8DEC8] space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? "bg-amber-500/15 text-[#0F2444] font-bold border-l-4 border-amber-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-700" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center px-2">
            <span className="text-xs font-mono text-slate-500">{adminUser?.email || "admin@gmail.com"}</span>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
