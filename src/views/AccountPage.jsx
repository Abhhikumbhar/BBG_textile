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
  Truck,
} from "lucide-react";

export default function AccountPage() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const settings = getSiteSettings();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header settings={settings} />

      {!user ? (
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-16 pb-28 sm:pb-16 flex flex-col justify-center items-center text-center">
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
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full py-3 px-6 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-sm font-bold rounded-xl shadow-sm text-center transition-all"
              >
                Create Account
              </Link>
            </div>
          </main>
        ) : (
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

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 w-fit">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Wholesale Partner
                </span>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">{user.email || "No email on record"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{user.phone || "+91 87673 22501"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">{user.businessName || "Direct Mill Buyer"}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Link
                to="/track-order"
                className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-gray-900">
                      Track My Orders
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Live dispatch & courier tracking status
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/products"
                className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-gray-900">
                      Explore Wholesale Products
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Browse churidar & cycling tight shorts
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="bg-gradient-to-r from-amber-50 to-amber-100/60 p-5 rounded-2xl border border-amber-300 shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#0B1220] flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-amber-950">
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
          className="w-full py-3.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-2xl text-xs sm:text-sm border border-red-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </main>
      )}

      <Footer settings={settings} />
    </div>
  );
}
