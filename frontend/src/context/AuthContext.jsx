import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    try {
      const res = await apiClient("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password })
      });
      const json = await res.json();
      if (json.success && json.data) {
        const { token, ...userData } = json.data;
        localStorage.setItem("token", token);
        localStorage.setItem("currentUser", JSON.stringify(userData));
        setUser(userData);
        toast.success("Registration successful!");
        
       if (userData.role === "admin")
        return true;
      } else {
        const errorMsg = json.errors?.[0] || json.message || "Registration failed";
        toast.error(errorMsg);
        return false;
      }
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Network error during registration");
      return false;
    }
  };

const login = async (email, password) => {
  try {
    const res = await apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    const json = await res.json();

    if (!json.success || !json.data) {
      const errorMsg =
        json.errors?.[0] || json.message || "Invalid credentials";
      toast.error(errorMsg);
      return false;
    }

    const { token, ...userData } = json.data;

    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);

    toast.success("Welcome back!");

    // Check whether this login came from the admin app
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");

    if (redirect === "admin") {

      if (userData.role !== "admin") {
        toast.error("You are not authorized to access the admin panel.");
        return "user";
      }

      window.location.href =
        `https://ariya-admin.vercel.app/?token=${token}&user=${encodeURIComponent(
          JSON.stringify(userData)
        )}`;

      return "admin";
    }

    return userData.role === "admin" ? "admin" : "user";

  } catch (err) {
    console.error(err);
    toast.error("Network error during login");
    return false;
  }
};

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully.");
  };

  const value = {
    user,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
