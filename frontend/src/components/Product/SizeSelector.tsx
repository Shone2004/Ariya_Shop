import React from "react";
import { motion } from "framer-motion";

export interface ProductSize {
  value: string;
  available: boolean;
}

export interface SizeSelectorProps {
  sizes?: ProductSize[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelect,
}) => {
  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div className="size-selector-section my-6" id="product-size-selector">
      <p className="text-xs uppercase tracking-widest font-semibold text-luxury-gray mb-3">
        Select Size
      </p>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => {
          const isSelected = selectedSize === size.value;
          const isDisabled = !size.available;

          return (
            <motion.button
              key={size.value}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect(size.value)}
              className={`relative flex items-center justify-center rounded-full text-xs font-semibold uppercase tracking-wider border min-w-[44px] h-[44px] px-4 cursor-pointer focus:outline-none transition-all`}
              style={{
                borderColor: isSelected
                  ? "var(--color-luxury-gold)"
                  : isDisabled
                  ? "var(--color-luxury-beige-dark)"
                  : "var(--color-luxury-beige-dark)",
                color: isSelected
                  ? "#ffffff"
                  : isDisabled
                  ? "var(--color-luxury-gray)"
                  : "var(--color-luxury-brown)",
                opacity: isDisabled ? 0.5 : 1,
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
              animate={{
                backgroundColor: isSelected
                  ? "var(--color-luxury-gold)"
                  : "rgba(255, 255, 255, 0)",
                borderColor: isSelected
                  ? "var(--color-luxury-gold)"
                  : isDisabled
                  ? "var(--color-luxury-beige-dark)"
                  : "var(--color-luxury-beige-dark)",
                color: isSelected
                  ? "#ffffff"
                  : isDisabled
                  ? "var(--color-luxury-gray)"
                  : "var(--color-luxury-brown)",
              }}
              whileHover={
                !isDisabled && !isSelected
                  ? {
                      scale: 1.05,
                      borderColor: "var(--color-luxury-gold)",
                      color: "var(--color-luxury-gold)",
                      backgroundColor: "rgba(201, 165, 75, 0.05)",
                    }
                  : {}
              }
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
            >
              <span className="relative z-10">{size.value}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;
