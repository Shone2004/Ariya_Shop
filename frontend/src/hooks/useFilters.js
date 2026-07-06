import { useSearchParams } from "react-router-dom";
import { useMemo, useCallback } from "react";

export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper to parse comma-separated lists
  const getArrayParam = useCallback((key) => {
    const val = searchParams.get(key);
    return val ? val.split(",") : [];
  }, [searchParams]);

  const filters = useMemo(() => {
    return {
      category: searchParams.get("category") || "Shop All",
      priceMin: Number(searchParams.get("priceMin")) || 0,
      priceMax: Number(searchParams.get("priceMax")) || 2999,
      material: getArrayParam("material"),
      occasion: getArrayParam("occasion"),
      color: getArrayParam("color"),
      finish: getArrayParam("finish"),
      stone: getArrayParam("stone"),
      collection: getArrayParam("collection"),
      rating: Number(searchParams.get("rating")) || 0,
      isBestSeller: searchParams.get("isBestSeller") === "true",
      isNewArrival: searchParams.get("isNewArrival") === "true",
      isSale: searchParams.get("isSale") === "true",
      sort: searchParams.get("sort") || "Popular",
    };
  }, [searchParams, getArrayParam]);

  const updateFilter = useCallback((key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === false ||
        (Array.isArray(value) && value.length === 0)
      ) {
        next.delete(key);
      } else if (Array.isArray(value)) {
        next.set(key, value.join(","));
      } else {
        next.set(key, String(value));
      }
      // Always reset page if filters change
      next.delete("page");
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const toggleArrayFilter = useCallback((key, item) => {
    const current = getArrayParam(key);
    const nextList = current.includes(item)
      ? current.filter((x) => x !== item)
      : [...current, item];
    updateFilter(key, nextList);
  }, [getArrayParam, updateFilter]);

  const clearAllFilters = useCallback(() => {
    setSearchParams(new URLSearchParams({ category: "Shop All" }), { replace: true });
  }, [setSearchParams]);

  return {
    filters,
    updateFilter,
    toggleArrayFilter,
    clearAllFilters,
  };
};
