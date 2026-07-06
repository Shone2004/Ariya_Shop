import React, { createContext, useState } from "react";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <ShopContext.Provider value={{ isCartOpen, setIsCartOpen, isLoginOpen, setIsLoginOpen }}>
      {children}
    </ShopContext.Provider>
  );
};
