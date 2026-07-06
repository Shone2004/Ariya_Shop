import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShopContext } from "../context/ShopContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const { setIsLoginOpen } = useContext(ShopContext);

  useEffect(() => {
    if (!user) {
      setIsLoginOpen(true);
    }
  }, [user, setIsLoginOpen]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
