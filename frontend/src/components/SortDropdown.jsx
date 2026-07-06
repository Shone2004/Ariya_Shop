import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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

const SortDropdown = ({ activeSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      {/* Label & Trigger Button */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-luxury-gray font-light uppercase tracking-wider hidden sm:inline">
          Sort By:
        </span>
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-luxury-beige rounded-md text-xs font-medium text-luxury-brown hover:border-luxury-gold transition-colors focus:outline-none min-w-[160px]"
        >
          <span>{activeSort}</span>
          <FiChevronDown
            className={`w-3.5 h-3.5 text-luxury-gray transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-1.5 w-48 bg-white border border-luxury-beige rounded-lg shadow-lg py-1.5 z-30 focus:outline-none focus:ring-0 max-h-72 overflow-y-auto"
            role="listbox"
            aria-activedescendant={activeSort}
          >
            {SORT_OPTIONS.map((opt) => {
              const isSelected = activeSort === opt;
              return (
                <li
                  key={opt}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSortChange(opt);
                    setIsOpen(false);
                    buttonRef.current?.focus();
                  }}
                  className={`px-4 py-2 text-xs text-left cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#FCF9F5] text-luxury-gold font-medium"
                      : "text-luxury-brown/85 hover:bg-[#FCF9F5] hover:text-luxury-brown"
                  }`}
                >
                  {opt}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;
