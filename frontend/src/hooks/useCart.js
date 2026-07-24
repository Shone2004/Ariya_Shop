import { useCallback, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

export const useCart = () => {
  const [cart, setCart] = useLocalStorage("ariya_cart", []);

  // Fetch cart from backend on mount/login
  const fetchBackendCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await apiClient("/cart");
      const json = await res.json();
      if (json.success && json.data) {
        // Map backend product structure to what frontend expects
        const mapped = json.data.map(item => {
          if (!item.product) return null;
          return {
            ...item.product,
            id: item.product._id, // map _id to id
            quantity: item.quantity,
            selectedSize: item.selectedSize || null
          };
        }).filter(Boolean);
        setCart(mapped);
      }
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  }, [setCart]);

  useEffect(() => {
    fetchBackendCart();
  }, []);

  const addToCart = useCallback(async (product, quantity = 1, selectedSize = null) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await apiClient("/cart", {
          method: "POST",
          body: JSON.stringify({ productId: product.id || product._id, quantity, selectedSize })
        });
        const json = await res.json();
        if (json.success && json.data) {
          const mapped = json.data.map(item => {
            if (!item.product) return null;
            return {
              ...item.product,
              id: item.product._id,
              quantity: item.quantity,
              selectedSize: item.selectedSize || null
            };
          }).filter(Boolean);
          setCart(mapped);
        }
      } catch (err) {
        console.error("Error adding to database cart:", err);
      }
    } else {
      // Local fallback
      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => 
          item.id === product.id && 
          (item.selectedSize || null) === (selectedSize || null)
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += quantity;
          return updated;
        } else {
          return [...prev, { ...product, quantity, selectedSize: selectedSize || null }];
        }
      });
    }

    toast.success(`${product.name} added to cart`, {
      icon: "👜",
      style: {
        background: "#2E241C",
        color: "#FCF9F5",
        fontFamily: "Outfit, sans-serif",
        borderRadius: "8px",
      },
    });
  }, [setCart]);

  const removeFromCart = useCallback(async (productId, productName, selectedSize = null) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const sizeParam = selectedSize ? `?size=${encodeURIComponent(selectedSize)}` : '';
        const res = await apiClient(`/cart/${productId}${sizeParam}`, {
          method: "DELETE"
        });
        const json = await res.json();
        if (json.success && json.data) {
          const mapped = json.data.map(item => {
            if (!item.product) return null;
            return {
              ...item.product,
              id: item.product._id,
              quantity: item.quantity,
              selectedSize: item.selectedSize || null
            };
          }).filter(Boolean);
          setCart(mapped);
        }
      } catch (err) {
        console.error("Error removing from database cart:", err);
      }
    } else {
      setCart((prev) => prev.filter((item) => 
        !(item.id === productId && (item.selectedSize || null) === (selectedSize || null))
      ));
    }

    if (productName) {
      toast.success(`${productName} removed from cart`, {
        style: {
          background: "#2E241C",
          color: "#FCF9F5",
          fontFamily: "Outfit, sans-serif",
          borderRadius: "8px",
        },
      });
    }
  }, [setCart]);

  const updateQuantity = useCallback(async (productId, quantity, selectedSize = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, null, selectedSize);
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await apiClient("/cart", {
          method: "PUT",
          body: JSON.stringify({ productId, quantity, selectedSize })
        });
        const json = await res.json();
        if (json.success && json.data) {
          const mapped = json.data.map(item => {
            if (!item.product) return null;
            return {
              ...item.product,
              id: item.product._id,
              quantity: item.quantity,
              selectedSize: item.selectedSize || null
            };
          }).filter(Boolean);
          setCart(mapped);
        }
      } catch (err) {
        console.error("Error updating database cart item:", err);
      }
    } else {
      setCart((prev) =>
        prev.map((item) => 
          item.id === productId && (item.selectedSize || null) === (selectedSize || null)
            ? { ...item, quantity }
            : item
        )
      );
    }
  }, [setCart, removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart };
};
