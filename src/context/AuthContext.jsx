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
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  // Initialize Auth from storage
  useEffect(() => {
    try {
      // Initialize registered users pool if empty
      const storedUsers = localStorage.getItem("bbg_registered_users");
      if (!storedUsers) {
        localStorage.setItem("bbg_registered_users", JSON.stringify(DEFAULT_USERS));
      }

      // Check active user session (persisted across launches)
      const session = localStorage.getItem("bbg_user_session");
      const isAdminLoggedIn = localStorage.getItem("bbg_admin_logged_in") === "true";
      
      // Guest mode is session-based (active during current launch, not permanent)
      const guestSession = sessionStorage.getItem("bbg_app_guest_session") === "true";

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

      if (guestSession) {
        setGuestMode(true);
      }
    } catch (e) {
      console.error("Failed to load auth session", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save session when user logs in or registers
  const saveSession = (userData) => {
    setUser(userData);
    setGuestMode(false);
    sessionStorage.removeItem("bbg_app_guest_session");
    localStorage.removeItem("bbg_guest_mode");
    localStorage.setItem("bbg_user_session", JSON.stringify(userData));

    if (userData.role === "admin") {
      localStorage.setItem("bbg_admin_logged_in", "true");
    }
  };

  // Strict Login handler: User MUST be registered first with matching password!
  const login = async (identifier, password) => {
    const cleanId = (identifier || "").trim().toLowerCase();
    const cleanDigits = cleanId.replace(/[^0-9]/g, "");
    const cleanPassword = (password || "").trim();

    if (!cleanId || !cleanPassword) {
      return {
        success: false,
        error: "Please enter your registered email and password.",
      };
    }

    // 1. Secret Admin Credentials
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

    // 2. Fetch all registered users from database / storage
    let usersList = [];
    try {
      usersList = JSON.parse(localStorage.getItem("bbg_registered_users") || "[]");
    } catch (e) {
      usersList = DEFAULT_USERS;
    }

    // Check if account exists
    const userFound = usersList.find((u) => {
      const uEmail = (u.email || "").toLowerCase();
      const uPhoneDigits = (u.phone || "").replace(/[^0-9]/g, "");
      const isEmailMatch = uEmail && uEmail === cleanId;
      const isPhoneMatch = cleanDigits.length >= 10 && uPhoneDigits && uPhoneDigits === cleanDigits;
      return isEmailMatch || isPhoneMatch;
    });

    // If account does NOT exist -> Reject and instruct to register first
    if (!userFound) {
      return {
        success: false,
        error: "No account found with this email. Please create an account first by clicking Sign Up.",
      };
    }

    // Check if password matches
    if (userFound.password !== cleanPassword) {
      return {
        success: false,
        error: "Incorrect password. Please enter the password you created during registration.",
      };
    }

    // Success: Credentials verified!
    const { password: _, ...safeUser } = userFound;
    saveSession(safeUser);
    return {
      success: true,
      user: safeUser,
      role: safeUser.role || "customer",
      redirect: safeUser.role === "admin" ? "/admin" : "/",
    };
  };

  // Register handler: Creates user and stores credentials
  const register = async ({ name, email, phone, businessName, password }) => {
    const cleanName = (name || "").trim() || "Customer";
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPhone = (phone || "").trim();
    const cleanPassword = (password || "").trim();

    if (!cleanEmail) {
      return {
        success: false,
        error: "Please enter a valid email address.",
      };
    }

    const cleanPhoneDigits = cleanPhone.replace(/\D/g, "");
    if (cleanPhone && cleanPhoneDigits.length !== 10) {
      return {
        success: false,
        error: "Please enter a valid 10-digit mobile number.",
      };
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      return {
        success: false,
        error: "Password must be at least 4 characters long.",
      };
    }

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
        error: "An account with this email already exists. Please log in with your password.",
      };
    }

    // Create new registered customer with their password
    const newUser = {
      id: `cust_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
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

    return {
      success: true,
      user: safeUser,
      role: "customer",
      redirect: "/",
    };
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setGuestMode(false);
    localStorage.removeItem("bbg_user_session");
    localStorage.removeItem("bbg_admin_logged_in");
    localStorage.removeItem("bbg_guest_mode");
    sessionStorage.removeItem("bbg_app_guest_session");
  };

  // Enable Guest Mode for the current session
  const continueAsGuest = () => {
    setGuestMode(true);
    sessionStorage.setItem("bbg_app_guest_session", "true");
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
