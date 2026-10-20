import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import BottomNav from "@/components/BottomNav";
import WhatsAppWidget from "@/components/WhatsAppWidget";

// Storefront Pages
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CategoriesPage from "@/pages/CategoriesPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import AuthPage from "@/pages/AuthPage";
import AccountPage from "@/pages/AccountPage";

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
  const isAdmin = pathname.startsWith("/admin");
  const { user, isAuthenticated, guestMode, isLoaded } = useAuth();

  // If initial auth session is still checking, render clean luxury backdrop
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // First-time App Open Gate:
  // When customer downloads/opens the app and is not logged in yet, show AuthPage first!
  const isPublicAuthRoute = pathname === "/login" || pathname === "/register";
  if (!isAuthenticated && !guestMode && !isAdmin && !isPublicAuthRoute) {
    return <AuthPage initialMode="login" />;
  }

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
          <WhatsAppWidget />
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
