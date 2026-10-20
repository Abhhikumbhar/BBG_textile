import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    id: "admin_1",
    name: "BBG Admin",
    email: "admin@gmail.com",
    password: "admin@123",
    role: "admin",
    phone: "8767322501",
    businessName: "SBBG Bharat Textile HQ",
  },
  {
    id: "demo_cust_1",
    name: "Wholesale Partner",
    email: "customer@gmail.com",
    password: "user@123",
    role: "customer",
    phone: "9876543210",
    businessName: "Sangli Cloth Center",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  // Initialize Auth from localStorage
  useEffect(() => {
    try {
      // Initialize registered users pool if empty
      const storedUsers = localStorage.getItem("bbg_registered_users");
      if (!storedUsers) {
        localStorage.setItem("bbg_registered_users", JSON.stringify(DEFAULT_USERS));
      }

      // Check active session
      const session = localStorage.getItem("bbg_user_session");
      const isAdminLoggedIn = localStorage.getItem("bbg_admin_logged_in") === "true";
      const guest = localStorage.getItem("bbg_guest_mode") === "true";

      if (session) {
        setUser(JSON.parse(session));
      } else if (isAdminLoggedIn) {
        setUser({
          id: "admin_1",
          name: "BBG Admin",
          email: "admin@gmail.com",
          role: "admin",
        });
      }

      if (guest) {
        setGuestMode(true);
      }
    } catch (e) {
      console.error("Failed to load auth session", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save session when user changes
  const saveSession = (userData) => {
    setUser(userData);
    setGuestMode(false);
    localStorage.removeItem("bbg_guest_mode");
    localStorage.setItem("bbg_user_session", JSON.stringify(userData));

    if (userData.role === "admin") {
      localStorage.setItem("bbg_admin_logged_in", "true");
    }
  };

  // Login handler: accepts email OR phone number
  const login = async (identifier, password) => {
    const cleanId = (identifier || "").trim().toLowerCase();
    const cleanDigits = cleanId.replace(/[^0-9]/g, "");
    const cleanPassword = (password || "").trim();

    if (!cleanId || !cleanPassword) {
      return {
        success: false,
        error: "Please enter your email or phone and password.",
      };
    }

    // 1. Secret Admin Hardcoded Credentials (100% works without any visible indicator)
    if (
      (cleanId === "admin@gmail.com" ||
        cleanId === "bbgadmin@gmail.com" ||
        cleanDigits === "8767322501" ||
        cleanId === "admin") &&
      (cleanPassword === "admin@123" || cleanPassword === "admin")
    ) {
      const adminUser = {
        id: "admin_1",
        name: "BBG Super Admin",
        email: "admin@gmail.com",
        role: "admin",
        phone: "8767322501",
        businessName: "SBBG Bharat Textile HQ",
      };
      saveSession(adminUser);
      return { success: true, user: adminUser, role: "admin", redirect: "/admin" };
    }

    // 2. Check in registered users list
    let usersList = [];
    try {
      usersList = JSON.parse(localStorage.getItem("bbg_registered_users") || "[]");
    } catch (e) {
      usersList = DEFAULT_USERS;
    }

    const matchedUser = usersList.find((u) => {
      const uEmail = (u.email || "").toLowerCase();
      const uPhoneDigits = (u.phone || "").replace(/[^0-9]/g, "");
      const isEmailMatch = uEmail && uEmail === cleanId;
      const isPhoneMatch = cleanDigits.length >= 10 && uPhoneDigits && uPhoneDigits === cleanDigits;
      return (isEmailMatch || isPhoneMatch) && u.password === cleanPassword;
    });

    if (matchedUser) {
      const { password: _, ...safeUser } = matchedUser;
      saveSession(safeUser);
      return {
        success: true,
        user: safeUser,
        role: safeUser.role || "customer",
        redirect: safeUser.role === "admin" ? "/admin" : "/",
      };
    }

    // 3. Fallback for any customer email or phone with valid password
    if ((cleanId.includes("@") || cleanDigits.length >= 10) && cleanPassword.length >= 4) {
      const isPhone = cleanDigits.length >= 10 && !cleanId.includes("@");
      const genericUser = {
        id: `cust_${Date.now()}`,
        name: isPhone ? `Customer (${cleanDigits.slice(-4)})` : cleanId.split("@")[0],
        email: isPhone ? `${cleanDigits}@phone.bbg` : cleanId,
        phone: isPhone ? cleanDigits : "",
        role: "customer",
        businessName: "",
      };
      saveSession(genericUser);
      return { success: true, user: genericUser, role: "customer", redirect: "/" };
    }

    return {
      success: false,
      error: "Invalid email/phone or password. Please try again.",
    };
  };

  // Register handler
  const register = async ({ name, email, phone, businessName, password }) => {
    const cleanName = (name || "").trim() || "Customer";
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPhone = (phone || "").trim();
    const cleanPassword = (password || "").trim();

    let usersList = [];
    try {
      usersList = JSON.parse(localStorage.getItem("bbg_registered_users") || "[]");
    } catch (e) {
      usersList = [...DEFAULT_USERS];
    }

    // Check if user already exists
    const existing = usersList.find((u) => {
      if (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) return true;
      if (cleanPhone && u.phone && u.phone === cleanPhone) return true;
      return false;
    });

    if (existing) {
      return {
        success: false,
        error: "An account with these details already exists. Please log in.",
      };
    }

    const newUser = {
      id: `cust_${Date.now()}`,
      name: cleanName,
      email: cleanEmail || `${cleanPhone || Date.now()}@customer.bbg`,
      phone: cleanPhone,
      businessName: businessName?.trim() || "",
      password: cleanPassword,
      role: "customer",
      createdAt: new Date().toISOString(),
    };

    usersList.push(newUser);
    localStorage.setItem("bbg_registered_users", JSON.stringify(usersList));

    const { password: _, ...safeUser } = newUser;
    saveSession(safeUser);

    return { success: true, user: safeUser, role: "customer", redirect: "/" };
  };

  // Social Login (Google, Apple, Facebook, Twitter)
  const socialLogin = async (provider = "google") => {
    const brandNames = {
      google: "Google User",
      apple: "Apple User",
      facebook: "Facebook User",
      twitter: "Twitter User",
    };
    const socialUser = {
      id: `social_${Date.now()}`,
      name: brandNames[provider] || "Verified Customer",
      email: `${provider}_user_${Date.now().toString().slice(-4)}@gmail.com`,
      phone: "",
      businessName: "",
      role: "customer",
      provider,
    };
    saveSession(socialUser);
    return { success: true, user: socialUser, role: "customer", redirect: "/" };
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setGuestMode(false);
    localStorage.removeItem("bbg_user_session");
    localStorage.removeItem("bbg_admin_logged_in");
    localStorage.removeItem("bbg_guest_mode");
  };

  // Enable Guest Mode
  const continueAsGuest = () => {
    setGuestMode(true);
    localStorage.setItem("bbg_guest_mode", "true");
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        guestMode,
        isLoaded,
        login,
        register,
        socialLogin,
        logout,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
