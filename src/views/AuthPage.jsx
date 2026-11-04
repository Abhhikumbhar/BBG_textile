import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  X,
  MessageCircle,
} from "lucide-react";

// Elegant Botanical Lotus Emblem from Reference Design
function BotanicalEmblem({ className = "w-7 h-7 text-[#A85227]" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 3c-1.5 4-2 8 0 14 2-6 1.5-10 0-14z" />
      <path d="M12 6c-3 3-5 7-7 8 2.5-1 6-2 7-8z" />
      <path d="M12 6c3 3 5 7 7 8-2.5-1-6-2-7-8z" />
      <path d="M6 19c3.5 1.5 8.5 1.5 12 0" />
    </svg>
  );
}

export default function AuthPage({ initialMode = "login", onAuthSuccess, onGuestContinue }) {
  const navigate = useNavigate();
  const { login, register, continueAsGuest } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Guest handler: enable guest session AND navigate immediately to store
  const handleGuestClick = () => {
    continueAsGuest();
    if (onGuestContinue) {
      onGuestContinue();
    } else {
      navigate("/");
    }
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
        setError(res.error || "Invalid credentials. Please verify and try again.");
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

    if (!agreeTerms) {
      setError("Please agree to the Wholesale Trade Terms to create an account.");
      return;
    }

    if (regPassword.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    const cleanPhoneDigits = regPhone.replace(/\D/g, "");
    if (cleanPhoneDigits.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
      });

      if (res.success) {
        if (onAuthSuccess) {
          onAuthSuccess(res);
        } else {
          navigate(res.redirect || "/");
        }
      } else {
        setError(res.error || "Account creation failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred during account creation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans select-none bg-[#F7F3EE]">
      {/* 1. WARM SUNLIT BOTANICAL BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <img
          src="/images/auth-bg-aesthetic.jpg"
          alt="SBBG Bharat Textile Natural Studio"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft warm light wash for maximum text clarity & glass contrast */}
        <div className="absolute inset-0 bg-[#FAF6F0]/40 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/30 via-transparent to-[#FAF6F0]/50" />
      </div>

      {/* 2. TOP BRANDING BAR */}
      <header className="relative z-10 w-full px-6 sm:px-12 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <BotanicalEmblem className="w-6 h-6 sm:w-7 sm:h-7 text-[#A85227] transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-serif text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#3B2219]">
              SBBG BHARAT TEXTILE
            </span>
            <span className="text-[9px] tracking-[0.16em] uppercase text-[#7A6658] font-medium">
              Sangli Textile Works
            </span>
          </div>
        </Link>

        {/* Right Tagline with subtle line */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs font-serif italic text-[#635147] tracking-wider">
            Craft Your Signature Style
          </span>
          <span className="w-8 h-[1px] bg-[#B09E92]" />
        </div>
      </header>

      {/* 3. CENTER GLASSMORPHIC AUTH CARD */}
      <main className="relative z-10 w-full max-w-[460px] mx-auto px-4 py-8 sm:py-10 my-auto">
        <div className="relative backdrop-blur-2xl bg-white/75 border border-white/90 rounded-[32px] sm:rounded-[36px] p-7 sm:p-10 shadow-[0_24px_70px_rgba(112,66,20,0.16),0_0_0_1px_rgba(255,255,255,0.8)] transition-all">
          {/* Top Botanical Lotus Emblem */}
          <div className="flex justify-center mb-4">
            <div className="w-11 h-11 rounded-full bg-[#FAF5F0]/80 border border-[#E9DFD8] flex items-center justify-center shadow-xs">
              <BotanicalEmblem className="w-6 h-6 text-[#A85227]" />
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="text-center mb-6">
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2219] tracking-tight">
              {mode === "login" ? "Welcome" : "Create Account"}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#7A6658] font-normal leading-relaxed">
              {mode === "login"
                ? "Log in to continue your textile journey"
                : "Join SBBG Bharat Textile for exclusive wholesale pricing"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-[#FFF5F2] border border-[#FADCD5] text-[#A83827] text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#A83827]" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {mode === "login" ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email Address */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#8C7A70] pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/95 border border-[#E8DED6] focus:border-[#B4552A] rounded-2xl text-sm text-[#3B2219] placeholder-[#9E8E85] focus:outline-none focus:ring-2 focus:ring-[#B4552A]/20 transition-all shadow-xs"
                />
              </div>

              {/* Password */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#8C7A70] pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-11 pr-11 py-3.5 bg-white/95 border border-[#E8DED6] focus:border-[#B4552A] rounded-2xl text-sm text-[#3B2219] placeholder-[#9E8E85] focus:outline-none focus:ring-2 focus:ring-[#B4552A]/20 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1 text-[#8C7A70] hover:text-[#3B2219] transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-[#6B5A50] hover:text-[#3B2219] transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#C4B5AA] text-[#A85227] focus:ring-[#A85227] cursor-pointer accent-[#A85227]"
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-medium text-[#A85227] hover:text-[#8E3B16] hover:underline transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Terracotta Pill Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#B4552A] via-[#A84C22] to-[#963E17] hover:from-[#A54B22] hover:to-[#873613] text-white text-sm font-semibold tracking-wide shadow-md shadow-[#A85227]/30 hover:shadow-lg hover:shadow-[#A85227]/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Log In</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#8C7A70] pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-11 pr-4 py-3 bg-white/95 border border-[#E8DED6] focus:border-[#B4552A] rounded-2xl text-sm text-[#3B2219] placeholder-[#9E8E85] focus:outline-none focus:ring-2 focus:ring-[#B4552A]/20 transition-all shadow-xs"
                />
              </div>

              {/* Email Address */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#8C7A70] pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-11 pr-4 py-3 bg-white/95 border border-[#E8DED6] focus:border-[#B4552A] rounded-2xl text-sm text-[#3B2219] placeholder-[#9E8E85] focus:outline-none focus:ring-2 focus:ring-[#B4552A]/20 transition-all shadow-xs"
                />
              </div>

              {/* Phone Number */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#8C7A70] pointer-events-none">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Mobile Number (10 Digits)"
                  className="w-full pl-11 pr-4 py-3 bg-white/95 border border-[#E8DED6] focus:border-[#B4552A] rounded-2xl text-sm text-[#3B2219] placeholder-[#9E8E85] focus:outline-none focus:ring-2 focus:ring-[#B4552A]/20 transition-all shadow-xs"
                />
              </div>

              {/* Password */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#8C7A70] pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create Password"
                  className="w-full pl-11 pr-11 py-3 bg-white/95 border border-[#E8DED6] focus:border-[#B4552A] rounded-2xl text-sm text-[#3B2219] placeholder-[#9E8E85] focus:outline-none focus:ring-2 focus:ring-[#B4552A]/20 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1 text-[#8C7A70] hover:text-[#3B2219] transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Agree Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-[#6B5A50]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-3.5 h-3.5 mt-0.5 rounded border-[#C4B5AA] text-[#A85227] focus:ring-[#A85227] cursor-pointer accent-[#A85227]"
                  />
                  <span>
                    I agree to the{" "}
                    <span className="font-semibold text-[#A85227] hover:underline">
                      Wholesale Trade Terms
                    </span>{" "}
                    & Privacy Policy.
                  </span>
                </label>
              </div>

              {/* Action Button */}
              <div className="pt-1.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#B4552A] via-[#A84C22] to-[#963E17] hover:from-[#A54B22] hover:to-[#873613] text-white text-sm font-semibold tracking-wide shadow-md shadow-[#A85227]/30 hover:shadow-lg hover:shadow-[#A85227]/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Switcher Link (Sign Up / Log In) */}
          <div className="mt-6 text-center">
            {mode === "login" ? (
              <p className="text-xs text-[#6B5A50]">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className="font-bold text-[#A85227] hover:text-[#8E3B16] hover:underline transition-colors ml-1 cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#6B5A50]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="font-bold text-[#A85227] hover:text-[#8E3B16] hover:underline transition-colors ml-1 cursor-pointer"
                >
                  Log In
                </button>
              </p>
            )}
          </div>

          {/* PROMINENT WORKING GUEST BUTTON (Explore Store Without Logging In) */}
          <div className="pt-4 mt-5 border-t border-[#E8DED6]/80 text-center">
            <button
              type="button"
              onClick={handleGuestClick}
              className="w-full py-3 px-5 rounded-full bg-white/85 hover:bg-white text-[#523F34] hover:text-[#3B2219] border border-[#DFCFC4] hover:border-[#B4552A]/50 text-xs font-semibold tracking-wide transition-all shadow-2xs hover:shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue as Guest (Explore Store)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A85227]" />
            </button>
          </div>
        </div>
      </main>

      {/* 4. FOOTER COPYRIGHT */}
      <footer className="relative z-10 w-full py-4 text-center text-[11px] text-[#7A6658]/80 font-medium">
        © {new Date().getFullYear()} SBBG BHARAT TEXTILE • Kupwad MIDC, Sangli, Maharashtra
      </footer>

      {/* 5. FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-[#2C1D16]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <BotanicalEmblem className="w-5 h-5 text-[#A85227]" />
                <h3 className="font-serif font-bold text-[#3B2219] text-base">
                  Password Assistance
                </h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-[#8C7A70] hover:text-[#3B2219] p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#6B5A50] mb-5 leading-relaxed">
              If you forgot your password, our Sangli factory wholesale desk can verify your number and reset your account credentials immediately:
            </p>

            <div className="space-y-2.5">
              <a
                href="mailto:bbgtextilebharat1@gmail.com?subject=Account%20Password%20Reset%20Request"
                className="w-full py-3 px-4 bg-[#1A365D] hover:bg-[#0F2444] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Reset via Email Support</span>
              </a>

              <a
                href="tel:8767322501"
                className="w-full py-2.5 px-4 border border-[#E5DAD1] bg-white text-[#4A3B32] hover:bg-[#FAF6F0] rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#A85227]" />
                <span>Call Factory: +91 87673 22501</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
