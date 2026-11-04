import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  User,
  ShoppingBag,
  Phone,
  Mail,
  Building2,
  LogOut,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function MobileAccountView({ settings }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const email = settings?.email || "bbgtextilebharat1@gmail.com";

  if (!user) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen pb-28 text-stone-900">
        <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-3.5 flex items-center gap-3 border-b border-stone-200/60">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h1 className="font-serif text-lg font-extrabold text-stone-950">My Account</h1>
        </header>

        <main className="p-6 text-center max-w-sm mx-auto pt-16">
          <div className="w-16 h-16 rounded-full bg-[#EFEAE2] text-stone-900 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h2 className="font-serif text-xl font-extrabold text-stone-950 mb-2">
            Welcome to BBG Textile
          </h2>
          <p className="text-xs font-semibold text-stone-600 mb-6">
            Log in to view wholesale orders, custom quotations, and manage your account.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full py-3.5 px-6 bg-stone-950 text-white rounded-full text-xs font-bold tracking-wider uppercase shadow-md active:scale-95 transition-all text-center"
            >
              Login / Sign In
            </Link>
            <Link
              to="/register"
              className="block w-full py-3.5 px-6 bg-white border border-stone-300 text-stone-900 rounded-full text-xs font-bold tracking-wider uppercase shadow-xs active:scale-95 transition-all text-center"
            >
              Create Account
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-28 text-stone-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-3.5 flex items-center gap-3 border-b border-stone-200/60">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <h1 className="font-serif text-lg font-extrabold text-stone-950">My Profile</h1>
      </header>

      <main className="p-4 space-y-4 max-w-md mx-auto">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-stone-950 text-white flex items-center justify-center font-serif text-xl font-bold shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-base font-bold text-stone-950 truncate">
              {user.name || "Valued Customer"}
            </h2>
            <p className="text-xs font-medium text-stone-600 truncate">{user.email || user.phone}</p>
            {user.businessName && (
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#EFEAE2] text-[10px] font-bold text-stone-800">
                {user.businessName}
              </span>
            )}
          </div>
        </div>

        {/* Quick Menu Options */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs divide-y divide-stone-100 overflow-hidden">
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-950">Admin Control Panel</div>
                  <div className="text-[10px] text-stone-500">Manage products, orders, settings</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>
          )}

          <Link
            to="/products"
            className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#EFEAE2] text-stone-800 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              </div>
              <span className="text-xs font-bold text-stone-900">Browse Catalog</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </Link>

          <a
            href={`mailto:${email}?subject=${encodeURIComponent(
              `Wholesale Query from ${user.name || "Customer"}`
            )}`}
            className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-[#1A365D] flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-stone-900">Email Wholesale Support</span>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-400" />
          </a>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full py-3.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold tracking-wider uppercase border border-rose-200 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4 stroke-[2]" />
          <span>Sign Out</span>
        </button>
      </main>
    </div>
  );
}
