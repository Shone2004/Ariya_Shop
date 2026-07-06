import { useCallback, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useLocalStorage("ariya_wishlist", []);

  const fetchBackendWishlist = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await apiClient("/wishlist");
      const json = await res.json();
      if (json.success && json.data) {
        const mapped = json.data.map(p => {
          if (!p) return null;
          return {
            ...p,
            id: p._id
          };
        }).filter(Boolean);
        setWishlist(mapped);
      }
    } catch (err) {
      console.error("Error loading wishlist:", err);
    }
  }, [setWishlist]);

  useEffect(() => {
    fetchBackendWishlist();
  }, []);

  const toggleWishlist = useCallback(async (product) => {
    const token = localStorage.getItem("token");
    const exists = wishlist.some((item) => item.id === product.id);

    if (token) {
      try {
        let res;
        if (exists) {
          res = await apiClient(`/wishlist/${product.id || product._id}`, {
            method: "DELETE"
          });
        } else {
          res = await apiClient("/wishlist", {
            method: "POST",
            body: JSON.stringify({ productId: product.id || product._id })
          });
        }
        const json = await res.json();
        if (json.success && json.data) {
          const mapped = json.data.map(p => {
            if (!p) return null;
            return {
              ...p,
              id: p._id
            };
          }).filter(Boolean);
          setWishlist(mapped);
        }
      } catch (err) {
        console.error("Error toggling wishlist on backend:", err);
      }
    } else {
      // Local fallback
      setWishlist((prev) => {
        const exists = prev.some((item) => item.id === product.id);
        if (exists) {
          return prev.filter((item) => item.id !== product.id);
        } else {
          return [...prev, product];
        }
      });
    }

    if (exists) {
      toast.success(`${product.name} removed from wishlist`, {
        icon: "🖤",
        style: {
          background: "#2E241C",
          color: "#FCF9F5",
          fontFamily: "Outfit, sans-serif",
          borderRadius: "8px",
        },
      });
    } else {
      toast.success(`${product.name} added to wishlist`, {
        icon: "❤️",
        style: {
          background: "#2E241C",
          color: "#FCF9F5",
          fontFamily: "Outfit, sans-serif",
          borderRadius: "8px",
        },
      });
    }
  }, [wishlist, setWishlist]);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some((item) => item.id === productId);
  }, [wishlist]);

  return { wishlist, toggleWishlist, isInWishlist };
};
