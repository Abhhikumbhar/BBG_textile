import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/catalogService";
import {
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  LogOut,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
  Crown,
} from "lucide-react";

export default function AccountPage() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const settings = getSiteSettings();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <Header settings={settings} />
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-16 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
            <User className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">
            Sign In to your Account
          </h1>
          <p className="text-gray-600 text-sm mb-6 max-w-md">
            Log in to view wholesale order history, special factory pricing, and manage your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <Link
              to="/login"
              className="w-full py-3 px-6 bg-[#0B1220] hover:bg-black text-white text-sm font-bold rounded-xl shadow-md text-center transition-all"
            >
              लॉगिन करा (Sign In)
            </Link>
            <Link
              to="/register"
              className="w-full py-3 px-6 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-sm font-bold rounded-xl shadow-sm text-center transition-all"
            >
              नवीन खाते (Register)
            </Link>
          </div>
        </main>
        <Footer settings={settings} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <Header settings={settings} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0B1220] to-[#1A365D] text-amber-400 flex items-center justify-center font-bold text-2xl shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  {isAdmin && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-600" />
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {user.businessName || "BBG Textile Valued Partner"}
                </p>
              </div>
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0B1220] font-bold rounded-xl text-xs shadow-md transition-all self-start sm:self-auto"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard उघडा</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Account Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-bold text-gray-400">
                  Email
                </span>
                <span className="text-xs font-semibold text-gray-800 truncate block">
                  {user.email || "Not specified"}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-bold text-gray-400">
                  Phone / WhatsApp
                </span>
                <span className="text-xs font-semibold text-gray-800 truncate block">
                  {user.phone || "+91 87673 22501"}
                </span>
              </div>
            </div>

            {user.businessName && (
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3 sm:col-span-2">
                <Building2 className="w-5 h-5 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase font-bold text-gray-400">
                    Business / Firm Name
                  </span>
                  <span className="text-xs font-semibold text-gray-800 truncate block">
                    {user.businessName}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions List */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-200/80 space-y-2 mb-6">
          <Link
            to="/products"
            className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  Browse Textile Catalog
                </h4>
                <p className="text-[11px] text-gray-500">
                  Churidar leggings, shorts & mill fabrics
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            to="/cart"
            className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  My Cart & Inquiries
                </h4>
                <p className="text-[11px] text-gray-500">
                  View selected items and wholesale inquiries
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/50 hover:bg-amber-50 transition-colors border border-amber-200/60"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-[#0B1220] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950">
                    Admin Management Portal
                  </h4>
                  <p className="text-[11px] text-amber-800/80">
                    Manage Products, Orders, Prices & Settings
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-amber-700" />
            </Link>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-2xl text-xs sm:text-sm border border-red-200 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>खाते लॉगआउट करा (Sign Out)</span>
        </button>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
