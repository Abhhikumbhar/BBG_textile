import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  ChevronLeft,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  Phone,
  MessageCircle,
} from "lucide-react";

export default function AuthPage({ initialMode = "login", onAuthSuccess }) {
  const navigate = useNavigate();
  const { login, register, socialLogin, continueAsGuest } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regIdentifier, setRegIdentifier] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(loginIdentifier, loginPassword);
      if (res.success) {
        if (onAuthSuccess) {
          onAuthSuccess(res);
        } else {
          navigate(res.redirect || "/");
        }
      } else {
        setError(res.error || "Invalid credentials. Please try again.");
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
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      const identifier = regIdentifier.trim();
      const isEmail = identifier.includes("@");

      const res = await register({
        name: regName.trim(),
        email: isEmail ? identifier : "",
        phone: isEmail ? "" : identifier,
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

  const handleSocialClick = async (provider) => {
    setLoading(true);
    setError(null);
    try {
      const res = await socialLogin(provider);
      if (res.success) {
        if (onAuthSuccess) {
          onAuthSuccess(res);
        } else {
          navigate(res.redirect || "/");
        }
      }
    } catch (err) {
      setError("Social sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative flex flex-col justify-between px-6 py-8 sm:px-10 overflow-hidden font-sans select-none">
      {/* Top Right Aesthetic Pastel Gradient Curve (Matching Reference Image 2) */}
      <div className="absolute -top-20 -right-20 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-purple-200/80 via-purple-100/40 to-transparent blur-2xl pointer-events-none" />
      <div className="absolute top-10 right-4 w-56 h-56 rounded-full bg-purple-100/40 blur-3xl pointer-events-none" />

      {/* Top Header / Back Button */}
      <div className="relative z-10 w-full max-w-sm mx-auto pt-2 flex items-center justify-between">
        {mode === "register" ? (
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className="p-1 -ml-1 text-gray-800 hover:text-black transition-colors rounded-full"
            aria-label="Back to Login"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        ) : (
          <div className="h-6" />
        )}

        <div className="text-[11px] font-bold tracking-widest text-purple-700/80 uppercase">
          SBBG BHARAT TEXTILE
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-sm mx-auto my-auto py-6">
        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {mode === "login" ? (
          /* ================= LOGIN VIEW (Ref Image 2 Left) ================= */
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Login
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className="font-bold text-[#8B5CF6] hover:text-[#7C3AED] hover:underline transition-colors"
                >
                  sign up
                </button>
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
              {/* Input 1: Email or phone */}
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="Email or phone"
                  className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all shadow-xs"
                />
              </div>

              {/* Input 2: Password with Lock Icon & FORGOT link */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-11 pr-24 py-3.5 bg-white border border-gray-300 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all shadow-xs"
                />
                <div className="absolute right-3.5 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[10px] font-bold tracking-wider text-[#8B5CF6] hover:text-[#7C3AED] uppercase ml-0.5"
                  >
                    FORGOT
                  </button>
                </div>
              </div>

              {/* Right-aligned Pill Button (Reference Image 2) */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-white font-semibold text-sm shadow-md shadow-purple-500/25 transition-all active:scale-95 disabled:opacity-70"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ================= CREATE ACCOUNT VIEW (Ref Image 2 Right) ================= */
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Create account
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="font-bold text-[#8B5CF6] hover:text-[#7C3AED] hover:underline transition-colors"
                >
                  sign in
                </button>
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-2">
              {/* Field 1: Name */}
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all shadow-xs"
                />
              </div>

              {/* Field 2: Email or phone */}
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regIdentifier}
                  onChange={(e) => setRegIdentifier(e.target.value)}
                  placeholder="Email or phone"
                  className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all shadow-xs"
                />
              </div>

              {/* Field 3: Password */}
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-5 pr-12 py-3.5 bg-white border border-gray-300 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Right-aligned Pill Button */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-white font-semibold text-sm shadow-md shadow-purple-500/25 transition-all active:scale-95 disabled:opacity-70"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign up</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Footer Section (Working Social Icons & Skip link) */}
      <div className="relative z-10 w-full max-w-sm mx-auto pb-4 flex flex-col items-center gap-4">
        {mode === "login" && (
          <div className="flex items-center gap-5 text-gray-600">
            {/* Apple Login */}
            <button
              type="button"
              onClick={() => handleSocialClick("apple")}
              className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all"
              title="Continue with Apple"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.36-.57.66-.99 1.73-.86 2.76 1 .08 2.03-.52 2.58-1.27z"/>
              </svg>
            </button>
            {/* Facebook Login */}
            <button
              type="button"
              onClick={() => handleSocialClick("facebook")}
              className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all"
              title="Continue with Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            {/* Google Login */}
            <button
              type="button"
              onClick={() => handleSocialClick("google")}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all"
              title="Continue with Google"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
            </button>
            {/* Twitter / X Login */}
            <button
              type="button"
              onClick={() => handleSocialClick("twitter")}
              className="w-9 h-9 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all"
              title="Continue with Twitter"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between w-full text-xs text-gray-400 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={continueAsGuest}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip for now →
          </button>
          <span>© {new Date().getFullYear()} SBBG Textile</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-900 text-sm">Password Help</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              If you forgot your password, our Sangli factory support desk can verify your number and reset your account instantly:
            </p>
            <div className="space-y-2">
              <a
                href="https://wa.me/918767322501?text=Hello%20BBG%20Textile,%20I%20need%20to%20reset%20my%20login%20password."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reset via WhatsApp</span>
              </a>
              <a
                href="tel:8767322501"
                className="w-full py-2 px-3 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-gray-50"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Factory: +91 87673 22501</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
