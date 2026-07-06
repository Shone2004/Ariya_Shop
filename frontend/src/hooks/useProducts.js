import { useState, useEffect, useCallback } from "react";
import apiClient from "../utils/apiClient";

export const useProducts = (filters) => {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(8);
  const [hasMore, setHasMore] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("limit", String(displayCount));

      if (filters.category && filters.category !== "Shop All") {
        params.append("category", filters.category);
      }
      if (filters.priceMin !== undefined) {
        params.append("minPrice", String(filters.priceMin));
      }
      if (filters.priceMax !== undefined) {
        params.append("maxPrice", String(filters.priceMax));
      }
      if (filters.finish && filters.finish.length > 0) {
        params.append("finish", filters.finish.join(","));
      }
      if (filters.occasion && filters.occasion.length > 0) {
        params.append("occasion", filters.occasion.join(","));
      }
      if (filters.collection && filters.collection.length > 0) {
        params.append("collection", filters.collection.join(","));
      }
      if (filters.isBestSeller) {
        params.append("highlight", "isBestSeller");
      } else if (filters.isNewArrival) {
        params.append("highlight", "isNewArrival");
      } else if (filters.isSale) {
        params.append("highlight", "isSale");
      }
      if (filters.sort) {
        params.append("sort", filters.sort);
      }

      const res = await apiClient(`/products?${params.toString()}`);
      const json = await res.json();
      
      if (json.success && json.data) {
        const mappedProducts = json.data.products.map(p => ({
          ...p,
          id: p._id
        }));
        setProducts(mappedProducts);
        setTotalCount(json.data.totalCount);
        setHasMore(json.data.hasMore);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [
    displayCount,
    filters.category,
    filters.priceMin,
    filters.priceMax,
    filters.finish ? filters.finish.join(",") : "",
    filters.occasion ? filters.occasion.join(",") : "",
    filters.collection ? filters.collection.join(",") : "",
    filters.isBestSeller,
    filters.isNewArrival,
    filters.isSale,
    filters.sort
  ]);

  // Fetch when filters or displayCount change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(8);
  }, [
    filters.category,
    filters.priceMin,
    filters.priceMax,
    filters.finish ? filters.finish.join(",") : "",
    filters.occasion ? filters.occasion.join(",") : "",
    filters.collection ? filters.collection.join(",") : "",
    filters.isBestSeller,
    filters.isNewArrival,
    filters.isSale,
    filters.sort
  ]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setDisplayCount((prev) => prev + 8);
    }
  }, [hasMore, loading]);

  return {
    products,
    totalCount,
    loading,
    hasMore,
    loadMore,
  };
};
