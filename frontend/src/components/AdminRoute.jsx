import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { setIsLoginOpen } = useContext(ShopContext);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setIsLoginOpen(true);
    }
  }, [user, setIsLoginOpen]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;