import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { isAppMode } from "@/lib/isAppMode";
import CartDrawer from "@/components/CartDrawer";
import BottomNav from "@/components/BottomNav";

// Storefront Pages
import HomePage from "@/views/HomePage";
import ProductsPage from "@/views/ProductsPage";
import ProductDetailPage from "@/views/ProductDetailPage";
import CategoriesPage from "@/views/CategoriesPage";
import CartPage from "@/views/CartPage";
import CheckoutPage from "@/views/CheckoutPage";
import OrderSuccessPage from "@/views/OrderSuccessPage";
import AboutPage from "@/views/AboutPage";
import ContactPage from "@/views/ContactPage";
import ReturnPolicyPage from "@/views/ReturnPolicyPage";
import TrackOrderPage from "@/views/TrackOrderPage";
import AuthPage from "@/views/AuthPage";
import AccountPage from "@/views/AccountPage";

// Admin Panel Pages
import AdminLogin from "@/admin/AdminLogin";
import AdminDashboard from "@/admin/AdminDashboard";
import AdminProducts from "@/admin/AdminProducts";
import AdminCategories from "@/admin/AdminCategories";
import AdminOrders from "@/admin/AdminOrders";
import AdminEnquiries from "@/admin/AdminEnquiries";
import AdminSettings from "@/admin/AdminSettings";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainAppRoutes() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const isAdmin = pathname.startsWith("/admin");
  const { user, isAuthenticated, guestMode, isLoaded } = useAuth();
  const inApp = isAppMode();

  // If initial auth session is still checking, render clean luxury backdrop
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 1. MOBILE APP GATEWAY:
  // When running inside the Mobile App container (iOS/Android WKWebView, standalone, or ?app=true),
  // and the user is NOT authenticated yet, and has NOT clicked "Continue as Guest" for this session:
  // Show the luxury Welcome / Login page directly as the mobile app entrance!
  const isPublicAuthRoute = pathname === "/login" || pathname === "/register";
  if (inApp && !isAuthenticated && !guestMode && !isAdmin && !isPublicAuthRoute) {
    return (
      <AuthPage
        initialMode="login"
        onAuthSuccess={() => navigate("/")}
        onGuestContinue={() => navigate("/")}
      />
    );
  }

  // 2. WEBSITE (DESKTOP & BROWSER):
  // Website users are NEVER blocked! They land directly on the Homepage (/),
  // with clean "Sign In" and "Register" buttons in the top header.

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Customer Storefront Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/return-policy" element={<ReturnPolicyPage />} />

        {/* Customer Auth & Account Routes */}
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/register" element={<AuthPage initialMode="register" />} />
        <Route path="/account" element={<AccountPage />} />

        {/* Admin Panel Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/enquiries" element={<AdminEnquiries />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>

      {/* Global Interactive Elements for Storefront */}
      {!isAdmin && !isPublicAuthRoute && (
        <>
          <CartDrawer />
          <BottomNav />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainAppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}
