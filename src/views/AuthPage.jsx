import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function AuthPage({ initialMode = "login", onAuthSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, continueAsGuest, user } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regBusiness, setRegBusiness] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Quick fill admin credentials for easy testing
  const fillAdmin = () => {
    setLoginEmail("admin@gmail.com");
    setLoginPassword("admin@123");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        if (onAuthSuccess) {
          onAuthSuccess(res);
        } else {
          navigate(res.redirect || "/");
        }
      } else {
        setError(res.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (regPassword.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: regName,
        phone: regPhone,
        businessName: regBusiness,
        email: regEmail,
        password: regPassword,
      });

      if (res.success) {
        if (onAuthSuccess) {
          onAuthSuccess(res);
        } else {
          navigate(res.redirect || "/");
        }
      } else {
        setError(res.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestContinue = () => {
    continueAsGuest();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col justify-center items-center py-8 px-4 sm:px-6 relative overflow-hidden select-none">
      {/* Background Decorative Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Main Card Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-2 bg-gradient-to-tr from-amber-500 to-amber-200 rounded-2xl shadow-xl shadow-amber-500/10 mb-3 border border-amber-400/40">
            <div className="w-14 h-14 rounded-xl bg-[#0B1220] flex items-center justify-center overflow-hidden p-1.5">
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
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SBBG BHARAT TEXTILE
          </h1>
          <p className="text-xs text-amber-300/80 font-medium tracking-wider uppercase mt-1">
            Official B2B & Retail Portal • Sangli Works
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-[#131D31]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#0B1220]/80 rounded-2xl border border-white/5 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === "login"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-[#0B1220] shadow-md shadow-amber-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In (लॉगिन)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
              }}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === "register"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-[#0B1220] shadow-md shadow-amber-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Register (नवीन खाते)
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode 1: LOGIN FORM */}
          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0B1220]/70 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#0B1220]/70 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Admin Auto-fill chip */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={fillAdmin}
                  className="text-[11px] text-amber-400/90 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
                  title="Click to fill admin credentials"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Credentials वापरा</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0B1220] font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#0B1220] border-t-transparent rounded-full animate-spin" />
                    <span>लॉगिन होत आहे...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In to Continue</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>

              {/* Switch to Register link */}
              <div className="pt-3 text-center border-t border-white/5">
                <p className="text-xs text-gray-400">
                  नवीन ग्राहक आहात?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError(null);
                    }}
                    className="text-amber-400 hover:text-amber-300 font-bold ml-1 hover:underline"
                  >
                    Register / खाते तयार करा
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Mode 2: REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Full Name (पूर्ण नाव)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="उदा. रमेश पाटील"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0B1220]/70 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Mobile / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="10 अंकी मोबाईल नंबर"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0B1220]/70 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Business / Shop Name (ऐच्छिक / Optional)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={regBusiness}
                    onChange={(e) => setRegBusiness(e.target.value)}
                    placeholder="दुकानाचे नाव (उदा. पाटील टेक्सटाईल)"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0B1220]/70 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0B1220]/70 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="किमान ४ अक्षरे / आकडे"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#0B1220]/70 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Register */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0B1220] font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#0B1220] border-t-transparent rounded-full animate-spin" />
                    <span>खाते तयार होत आहे...</span>
                  </span>
                ) : (
                  <>
                    <span>Create Account & Continue</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>

              {/* Switch to Login */}
              <div className="pt-3 text-center border-t border-white/5">
                <p className="text-xs text-gray-400">
                  आधीच खाते आहे का?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError(null);
                    }}
                    className="text-amber-400 hover:text-amber-300 font-bold ml-1 hover:underline"
                  >
                    लॉगिन करा
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Discreet Guest Bypass */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleGuestContinue}
              className="text-[11px] text-gray-400 hover:text-gray-300 transition-colors"
            >
              Skip for now / थेट कॅटॅलॉग पहा →
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-gray-400 mt-6">
          © {new Date().getFullYear()} SBBG BHARAT TEXTILE • Sangli Works
        </p>
      </div>
    </div>
  );
}
