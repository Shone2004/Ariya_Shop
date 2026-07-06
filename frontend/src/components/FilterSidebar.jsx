import React, { useState } from "react";
import { FiX, FiChevronDown, FiChevronUp, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const MATERIALS = ["Gold Plated", "925 Silver", "Stainless Steel", "Pearl", "Beads"];
const OCCASIONS = ["Daily Wear", "Office Wear", "Party Wear", "Wedding", "Festive"];
const STONES = ["None", "Pearl", "Cubic Zirconia", "Kundan", "Emerald", "Diamond"];
const FINISHES = ["Glossy", "Polished", "Matte"];
const COLLECTIONS = ["Heritage", "Modern Minimalist", "Nature's Grace", "Classic Pearl", "Home & Care"];

const COLORS = [
  { name: "Gold", hex: "#C9A54B" },
  { name: "Silver", hex: "#D1D5DB" },
  { name: "Rose Gold", hex: "#E5A9A9" },
  { name: "White", hex: "#FAF8F5" },
  { name: "Green", hex: "#10B981" },
  { name: "Black", hex: "#1F2937" },
  { name: "Grey", hex: "#9CA3AF" },
  { name: "Pink", hex: "#EC4899" },
];

const FilterSidebar = ({
  filters,
  updateFilter,
  toggleArrayFilter,
  clearAllFilters,
  totalCount,
  isMobileOpen,
  onMobileClose,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    material: true,
    stone: false,
    occasion: true,
    color: true,
    finish: false,
    collection: false,
    badges: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceMinChange = (e) => {
    const val = Math.min(Number(e.target.value), filters.priceMax - 100);
    updateFilter("priceMin", val);
  };

  const handlePriceMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), filters.priceMin + 100);
    updateFilter("priceMax", val);
  };

  // Render the core filter contents (reused for mobile and desktop)
  const renderFilterContents = () => {
    return (
      <div className="space-y-5">
        {/* Price Range Slider */}
        <div className="border-b border-luxury-beige/50 pb-4">
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full text-xs font-medium tracking-widest text-luxury-brown uppercase font-sans mb-3"
          >
            <span>Price Range</span>
            {expandedSections.price ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.price && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden px-1"
              >
                <div className="flex justify-between text-[11px] text-luxury-gray mb-3 font-light tracking-wider">
                  <span>₹{filters.priceMin}</span>
                  <span>₹{filters.priceMax}</span>
                </div>

                <div className="relative h-[2px] w-full bg-luxury-beige rounded-full mb-4">
                  {/* Slider Track Highlight */}
                  <div
                    className="absolute h-full bg-luxury-gold rounded-full"
                    style={{
                      left: `${((filters.priceMin) / (2999)) * 100}%`,
                      right: `${100 - ((filters.priceMax) / (2999)) * 100}%`,
                    }}
                  />

                  {/* Range Inputs */}
                  <input
                    type="range"
                    min="0"
                    max="2999"
                    value={filters.priceMin}
                    onChange={handlePriceMinChange}
                    className="absolute pointer-events-none appearance-none z-20 h-1 w-full bg-transparent top-0 left-0 accent-luxury-gold [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-luxury-gold [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-sm"
                  />
                  <input
                    type="range"
                    min="0"
                    max="2999"
                    value={filters.priceMax}
                    onChange={handlePriceMaxChange}
                    className="absolute pointer-events-none appearance-none z-20 h-1 w-full bg-transparent top-0 left-0 accent-luxury-gold [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-luxury-gold [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-sm"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {/* Occasion Filter (Pills) */}
        <div className="border-b border-luxury-beige/50 pb-4">
          <button
            onClick={() => toggleSection("occasion")}
            className="flex items-center justify-between w-full text-xs font-medium tracking-widest text-luxury-brown uppercase font-sans mb-3"
          >
            <span>Occasion</span>
            {expandedSections.occasion ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.occasion && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {OCCASIONS.map((occ) => {
                    const isChecked = filters.occasion.includes(occ);
                    return (
                      <button
                        key={occ}
                        onClick={() => toggleArrayFilter("occasion", occ)}
                        className={`px-3 py-1.5 rounded-full border text-[11px] tracking-wide transition-all duration-200 cursor-pointer ${
                          isChecked
                            ? "bg-[#2E241C] border-[#2E241C] text-white font-medium"
                            : "bg-white border-luxury-beige hover:border-luxury-gold text-luxury-brown/80"
                        }`}
                      >
                        {occ}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Finish Filter (Pills) */}
        <div className="border-b border-luxury-beige/50 pb-4">
          <button
            onClick={() => toggleSection("finish")}
            className="flex items-center justify-between w-full text-xs font-medium tracking-widest text-luxury-brown uppercase font-sans mb-3"
          >
            <span>Finish</span>
            {expandedSections.finish ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.finish && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {FINISHES.map((fin) => {
                    const isChecked = filters.finish.includes(fin);
                    return (
                      <button
                        key={fin}
                        onClick={() => toggleArrayFilter("finish", fin)}
                        className={`px-3 py-1.5 rounded-full border text-[11px] tracking-wide transition-all duration-200 cursor-pointer ${
                          isChecked
                            ? "bg-[#2E241C] border-[#2E241C] text-white font-medium"
                            : "bg-white border-luxury-beige hover:border-luxury-gold text-luxury-brown/80"
                        }`}
                      >
                        {fin}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collection Filter (Pills) */}
        <div className="border-b border-luxury-beige/50 pb-4">
          <button
            onClick={() => toggleSection("collection")}
            className="flex items-center justify-between w-full text-xs font-medium tracking-widest text-luxury-brown uppercase font-sans mb-3"
          >
            <span>Collection</span>
            {expandedSections.collection ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.collection && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {COLLECTIONS.map((col) => {
                    const isChecked = filters.collection.includes(col);
                    return (
                      <button
                        key={col}
                        onClick={() => toggleArrayFilter("collection", col)}
                        className={`px-3 py-1.5 rounded-full border text-[11px] tracking-wide transition-all duration-200 cursor-pointer ${
                          isChecked
                            ? "bg-[#2E241C] border-[#2E241C] text-white font-medium"
                            : "bg-white border-luxury-beige hover:border-luxury-gold text-luxury-brown/80"
                        }`}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Highlights/Badges (Pills) */}
        <div>
          <button
            onClick={() => toggleSection("badges")}
            className="flex items-center justify-between w-full text-xs font-medium tracking-widest text-luxury-brown uppercase font-sans mb-3"
          >
            <span>Highlights</span>
            {expandedSections.badges ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.badges && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { key: "isBestSeller", label: "Best Seller" },
                    { key: "isNewArrival", label: "New Arrival" },
                    { key: "isSale", label: "On Sale" },
                  ].map((item) => {
                    const isChecked = filters[item.key];
                    return (
                      <button
                        key={item.key}
                        onClick={() => updateFilter(item.key, !isChecked)}
                        className={`px-3 py-1.5 rounded-full border text-[11px] tracking-wide transition-all duration-200 cursor-pointer ${
                          isChecked
                            ? "bg-[#2E241C] border-[#2E241C] text-white font-medium"
                            : "bg-white border-luxury-beige hover:border-luxury-gold text-luxury-brown/80"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. Desktop Sticky Sidebar Layout */}
      <aside className="hidden lg:block w-64 flex-shrink-0 self-start sticky top-24 bg-white p-6 rounded-xl border border-luxury-beige/50 shadow-[0_2px_12px_rgba(46,36,28,0.02)] max-h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex items-center justify-between mb-5 border-b border-luxury-beige pb-3">
          <span className="font-serif text-sm font-semibold tracking-wider text-luxury-brown">FILTERS</span>
          <button
            onClick={clearAllFilters}
            className="text-[10px] font-semibold text-luxury-gold hover:text-luxury-gold-dark tracking-widest uppercase transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>

        {renderFilterContents()}
      </aside>

      {/* 2. Mobile Bottom Sheet Overlay Panel */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />

            {/* Bottom Sheet Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white rounded-t-2xl z-50 flex flex-col lg:hidden shadow-2xl overflow-hidden"
            >
              {/* Mobile Sheet Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-luxury-beige">
                <span className="font-serif text-base font-semibold tracking-wide text-luxury-brown">Filters</span>
                <button
                  onClick={onMobileClose}
                  className="p-1 rounded-full text-luxury-brown hover:bg-luxury-beige transition-colors"
                  aria-label="Close filters"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Filter Options */}
              <div className="flex-grow overflow-y-auto p-6 pb-24">
                {renderFilterContents()}
              </div>

              {/* Sticky Mobile Action Footer */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-luxury-beige p-4 flex gap-3 z-25 shadow-[0_-4px_16px_rgba(46,36,28,0.04)]">
                <button
                  onClick={() => {
                    clearAllFilters();
                    onMobileClose();
                  }}
                  className="flex-1 py-3 border border-luxury-beige-dark text-luxury-brown text-xs font-medium tracking-widest uppercase rounded-md active:bg-luxury-beige transition-colors cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={onMobileClose}
                  className="flex-1.5 py-3 bg-[#2E241C] text-white text-xs font-medium tracking-widest uppercase rounded-md active:bg-luxury-brown/90 shadow-sm transition-colors cursor-pointer"
                >
                  Show ({totalCount})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterSidebar;
