"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Crown,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    router.prefetch("/admin");
    router.prefetch("/admin/products");
    router.prefetch("/admin/categories");
  }, [router]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F4EFE6] to-[#EAE2D5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Soft warm ambient lighting accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#1A365D]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex w-20 h-20 rounded-2xl bg-white p-2.5 border border-[#DFD3C3] shadow-[0_10px_25px_rgba(140,110,65,0.12)] mb-4 items-center justify-center backdrop-blur-md">
          <Image
            src="/images/logo/bbg-logo-icon.png"
            alt="SBBG Textile Logo"
            width={72}
            height={72}
            priority
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-600/20 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
          <Crown className="w-3.5 h-3.5 text-amber-600" />
          <span>Management Portal</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#0F2444]">
          BBG Textile Console
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to manage fabrics, categories, wholesale orders, and enquiries
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-[0_20px_60px_-15px_rgba(140,110,65,0.18)] rounded-3xl border border-[#DFD3C3]">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-slate-950 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>Enter Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </form>

          {/* Quick Fill Credentials Helper Card */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Login Credentials:</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@gmail.com");
                  setPassword("admin@123");
                }}
                className="text-[11px] text-amber-800 hover:text-amber-900 font-bold underline underline-offset-2 transition-colors cursor-pointer bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-600/20"
              >
                Auto Fill
              </button>
            </div>
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 font-mono text-xs space-y-1.5 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Email:</span>
                <span className="font-bold text-slate-900 select-all">admin@gmail.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Password:</span>
                <span className="font-bold text-slate-900 select-all">admin@123</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-[#1A365D] transition-colors inline-flex items-center gap-1"
            >
              <span>&larr; Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
