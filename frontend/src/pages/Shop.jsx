import React, { useState, useContext } from "react";
import { FiFilter, FiX, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";


// Custom Hooks
import { useFilters } from "../hooks/useFilters";
import { useProducts } from "../hooks/useProducts";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { useSEO } from "../hooks/useSEO";

// Components
import ShopHero from "../components/ShopHero";
import CategoryCarousel from "../components/CategoryCarousel";
import FilterSidebar from "../components/FilterSidebar";
import SortDropdown from "../components/SortDropdown";
import ProductCard from "../components/ProductCard";
import ProductSkeleton, { ProductGridSkeleton } from "../components/ProductSkeleton";
import EmptyState from "../components/EmptyState";
import QuickViewModal from "../components/QuickViewModal";
import TrustBadges from "../components/TrustBadges";
import Newsletter from "../components/Newsletter";

const SORT_OPTIONS = [
  "Featured",
  "Best Selling",
  "Newest",
  "Price Low to High",
  "Price High to Low",
  "Highest Rated",
  "Discount",
  "Alphabetical",
];

const Shop = () => {
  const { filters, updateFilter, toggleArrayFilter, clearAllFilters } = useFilters();
  const { products, totalCount, loading, hasMore, loadMore } = useProducts(filters);
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { setIsCartOpen } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate("/cart");
  };

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // SEO Optimization
  useSEO({
    title: "Shop Luxury Jewellery Online | AriyaShop",
    description: "Browse our premium jewellery collection featuring handcrafted rings, earrings, necklaces, bangles, and bracelets in gold, silver, and pearls.",
    keywords: "luxury jewellery, online shop, gold bangles, earrings, necklaces, rings, AriyaShop",
  });

  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // Generate active filter chips
  const activeChips = React.useMemo(() => {
    const chips = [];

    if (filters.category && filters.category !== "Shop All") {
      chips.push({ type: "category", label: filters.category, val: "Shop All" });
    }
    if (filters.priceMin > 0 || filters.priceMax < 2999) {
      chips.push({
        type: "price",
        label: `₹${filters.priceMin} - ₹${filters.priceMax}`,
        action: () => {
          updateFilter("priceMin", 0);
          updateFilter("priceMax", 2999);
        },
      });
    }
    filters.material.forEach((mat) => {
      chips.push({ type: "material", label: mat, val: mat });
    });
    filters.occasion.forEach((occ) => {
      chips.push({ type: "occasion", label: occ, val: occ });
    });
    filters.color.forEach((col) => {
      chips.push({ type: "color", label: col, val: col });
    });
    filters.finish.forEach((fin) => {
      chips.push({ type: "finish", label: fin, val: fin });
    });
    filters.stone.forEach((st) => {
      chips.push({ type: "stone", label: st, val: st });
    });
    filters.collection.forEach((coll) => {
      chips.push({ type: "collection", label: coll, val: coll });
    });
    if (filters.isBestSeller) {
      chips.push({ type: "isBestSeller", label: "Best Seller", val: false });
    }
    if (filters.isNewArrival) {
      chips.push({ type: "isNewArrival", label: "New Arrival", val: false });
    }
    if (filters.isSale) {
      chips.push({ type: "isSale", label: "On Sale", val: false });
    }

    return chips;
  }, [filters, updateFilter]);

  const handleRemoveChip = (chip) => {
    if (chip.action) {
      chip.action();
    } else if (chip.type === "category") {
      updateFilter("category", chip.val);
    } else if (
      chip.type === "isBestSeller" ||
      chip.type === "isNewArrival" ||
      chip.type === "isSale"
    ) {
      updateFilter(chip.type, chip.val);
    } else {
      toggleArrayFilter(chip.type, chip.val);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F5]">
      {/* 1. Hero Banner */}
      <ShopHero />

      {/* 2. Category Cards */}
      <CategoryCarousel
        activeCategory={filters.category}
        onSelectCategory={(catName) => {
          updateFilter("category", catName);
          setTimeout(() => {
            const el = document.getElementById("shop-products");
            if (el) {
              const offset = 100; // Offset for sticky navbar (h-24 = 96px)
              const bodyRect = document.body.getBoundingClientRect().top;
              const elementRect = el.getBoundingClientRect().top;
              const elementPosition = elementRect - bodyRect;
              const offsetPosition = elementPosition - offset;

              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });
            }
          }, 50);
        }}
      />

      {/* 3. Main Shop Content */}
      <section id="shop-products" className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12 py-10 sm:py-16 md:py-20">
        {/* Filter / Sort Header Bar (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-between border-b border-luxury-beige/40 pb-5 mb-8">
          {/* Results Count */}
          <div className="text-[11px] text-luxury-gray font-light tracking-widest uppercase">
            SHOWING <span className="font-semibold text-luxury-brown">{products.length}</span> OF{" "}
            <span className="font-semibold text-luxury-brown">{totalCount}</span> PRODUCTS
          </div>

          {/* Sorting Dropdown */}
          <SortDropdown
            activeSort={filters.sort}
            onSortChange={(val) => updateFilter("sort", val)}
          />
        </div>

        {/* Active Filter Chips */}
        <AnimatePresence>
          {activeChips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-wrap items-center gap-2.5 mb-8"
            >
              <span className="text-[10px] text-luxury-gray font-semibold uppercase tracking-widest mr-1.5">
                Active Filters:
              </span>
              {activeChips.map((chip, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-luxury-beige rounded-full text-[11px] text-luxury-brown font-light shadow-3xs"
                >
                  {chip.label}
                  <button
                    onClick={() => handleRemoveChip(chip)}
                    className="p-0.5 rounded-full hover:bg-luxury-beige text-luxury-gray hover:text-luxury-brown transition-colors cursor-pointer focus:outline-none"
                    aria-label={`Remove filter ${chip.label}`}
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-[10px] font-semibold text-luxury-gold hover:text-luxury-gold-dark tracking-widest uppercase ml-2.5 transition-colors cursor-pointer focus:outline-none"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Layout Grid (Increased gap for breathing space) */}
        <div className="flex gap-8 lg:gap-12">
          {/* Sticky Filter Sidebar (Desktop) / Bottom Sheet (Mobile) */}
          <FilterSidebar
            filters={filters}
            updateFilter={updateFilter}
            toggleArrayFilter={toggleArrayFilter}
            clearAllFilters={clearAllFilters}
            totalCount={totalCount}
            isMobileOpen={mobileFilterOpen}
            onMobileClose={() => setMobileFilterOpen(false)}
          />

          {/* Products Grid Area */}
          <div className="flex-grow">
            {loading && products.length === 0 ? (
              /* Shimmer Loading State */
              <ProductGridSkeleton count={8} />
            ) : products.length === 0 ? (
              /* Empty State */
              <EmptyState onReset={clearAllFilters} />
            ) : (
              /* Products Grid with Fade/Slide Transitions */
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                  {products.map((prod) => (
                    <motion.div
                      key={prod.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard
                        product={prod}
                        isInWishlist={isInWishlist(prod.id)}
                        toggleWishlist={toggleWishlist}
                        onQuickView={handleOpenQuickView}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                      />
                    </motion.div>
                  ))}

                  {/* Shimmer items when loading next page (Load More) */}
                  {loading &&
                    hasMore &&
                    [...Array(4)].map((_, i) => <ProductSkeleton key={`skeleton-${i}`} />)}
                </div>

                {/* Pagination (Load More) */}
                {hasMore && !loading && (
                  <div className="flex justify-center mt-16 md:mt-20">
                    <button
                      onClick={loadMore}
                      className="px-12 py-4 border border-[#2E241C] text-[#2E241C] hover:bg-[#2E241C] hover:text-white text-[10px] tracking-widest uppercase font-medium rounded-md shadow-3xs hover:shadow-sm transition-all duration-300 cursor-pointer focus:outline-none hover:-translate-y-0.5"
                    >
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* 4. Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/90 backdrop-blur-md border-t border-luxury-beige py-3.5 px-4 flex gap-3 shadow-[0_-4px_20px_rgba(46,36,28,0.06)]">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex-1 py-3.5 bg-white border border-luxury-beige-dark text-luxury-brown text-xs font-semibold tracking-widest uppercase rounded-md flex items-center justify-center gap-2 active:bg-luxury-beige transition-colors cursor-pointer"
        >
          <FiFilter className="w-3.5 h-3.5" />
          Filter {activeChips.length > 0 && `(${activeChips.length})`}
        </button>
        <button
          onClick={() => setMobileSortOpen(true)}
          className="flex-1 py-3.5 bg-[#2E241C] text-white text-xs font-semibold tracking-widest uppercase rounded-md flex items-center justify-center gap-2 active:bg-[#423429] transition-colors cursor-pointer"
        >
          Sort: {filters.sort}
        </button>
      </div>

      {/* 5. Mobile Sort Bottom Sheet */}
      <AnimatePresence>
        {mobileSortOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSortOpen(false)}
              className="fixed inset-0 bg-black z-45 lg:hidden"
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 flex flex-col lg:hidden shadow-2xl overflow-hidden max-h-[60vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-luxury-beige">
                <span className="font-serif text-base font-semibold tracking-wide text-luxury-brown">Sort By</span>
                <button
                  onClick={() => setMobileSortOpen(false)}
                  className="p-1 rounded-full text-luxury-brown hover:bg-luxury-beige transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <ul className="overflow-y-auto py-2">
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = filters.sort === opt;
                  return (
                    <li
                      key={opt}
                      onClick={() => {
                        updateFilter("sort", opt);
                        setMobileSortOpen(false);
                      }}
                      className="px-6 py-4 border-b border-luxury-beige/30 flex items-center justify-between text-xs text-luxury-brown tracking-wide cursor-pointer active:bg-luxury-beige"
                    >
                      <span className={isSelected ? "text-luxury-gold font-semibold" : "font-light"}>
                        {opt}
                      </span>
                      {isSelected && <FiCheck className="w-4 h-4 text-luxury-gold" />}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 6. Trust Badges Banner */}
      <TrustBadges />

      {/* 7. Luxury Newsletter */}
      <Newsletter />

      {/* 8. Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewOpen}
        onClose={handleCloseQuickView}
        isInWishlist={quickViewProduct ? isInWishlist(quickViewProduct.id) : false}
        toggleWishlist={toggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
};

export default Shop;