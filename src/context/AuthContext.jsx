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

  // Login handler
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check Admin Hardcoded credentials
    if (
      (cleanEmail === "admin@gmail.com" || cleanEmail === "bbgadmin@gmail.com") &&
      (cleanPassword === "admin@123" || cleanPassword === "admin")
    ) {
      const adminUser = {
        id: "admin_1",
        name: "BBG Super Admin",
        email: cleanEmail,
        role: "admin",
        phone: "8767322501",
        businessName: "SBBG Bharat Textile HQ",
      };
      saveSession(adminUser);
      return { success: true, user: adminUser, role: "admin", redirect: "/admin" };
    }

    // Check in registered users list
    let usersList = [];
    try {
      usersList = JSON.parse(localStorage.getItem("bbg_registered_users") || "[]");
    } catch (e) {
      usersList = DEFAULT_USERS;
    }

    const matchedUser = usersList.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
    );

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

    // Generic fallback for any email with reasonable password
    if (cleanEmail.includes("@") && cleanPassword.length >= 4) {
      const genericUser = {
        id: `cust_${Date.now()}`,
        name: cleanEmail.split("@")[0],
        email: cleanEmail,
        role: "customer",
        phone: "",
        businessName: "",
      };
      saveSession(genericUser);
      return { success: true, user: genericUser, role: "customer", redirect: "/" };
    }

    return {
      success: false,
      error: "Invalid email or password. Please check your credentials.",
    };
  };

  // Register handler
  const register = async ({ name, email, phone, businessName, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    let usersList = [];
    try {
      usersList = JSON.parse(localStorage.getItem("bbg_registered_users") || "[]");
    } catch (e) {
      usersList = [...DEFAULT_USERS];
    }

    // Check if email already exists
    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        error: "An account with this email already exists. Please login instead.",
      };
    }

    const newUser = {
      id: `cust_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
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
