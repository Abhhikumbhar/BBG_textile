import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Crown,
} from "lucide-react";
import { getSiteSettings } from "@/lib/catalogService";

export default function AdminLogin() {
  const navigate = useNavigate();
  const settings = getSiteSettings();

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin@123");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation (accepts default admin or any valid manager email)
    if (
      (email === "admin@gmail.com" && password === "admin@123") ||
      (email.includes("@") && password.length >= 6)
    ) {
      localStorage.setItem("bbg_admin_logged_in", "true");
      setLoading(false);
      navigate("/admin");
    } else {
      setLoading(false);
      setError("Invalid credentials. Default: admin@gmail.com / admin@123");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F4EFE6] to-[#EAE2D5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#1A365D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-amber-400 to-[#1A365D] shadow-lg flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-white p-1 flex items-center justify-center overflow-hidden">
              <img
                src="/images/logo/bbg-logo-icon.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <h2 className="text-center font-serif text-3xl font-bold tracking-tight text-gray-900">
          Admin Portal Login
        </h2>
        <p className="mt-2 text-center text-xs text-gray-600">
          {settings?.businessName || "SBBG BHARAT TEXTILE"} • Internal Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-gray-200/80">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                  placeholder="admin@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-0.5">
              <div className="font-bold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-700" />
                <span>Default Credentials</span>
              </div>
              <div>Email: <strong>admin@gmail.com</strong></div>
              <div>Password: <strong>admin@123</strong></div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#1A365D] hover:bg-[#0F2444] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-[#1A365D] hover:underline"
            >
              ← Back to Live Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
