import React, { useState } from "react";
import { FiHeart, FiEye, FiShoppingBag } from "react-icons/fi";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const CrownIcon = () => (
  <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current">
    <path d="M2 16h20v2H2zm3-2h14a1 1 0 0 0 .97-.76l2-9a1 1 0 0 0-1.53-1.07l-4.72 3.15-2.75-5.5a1 1 0 0 0-1.76 0l-2.75 5.5-4.72-3.15a1 1 0 0 0-1.53 1.07l2 9A1 1 0 0 0 5 14z" />
  </svg>
);

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 stroke-current fill-none stroke-[2.2]">
    <path d="M12 2c0 5 0 10 5 10c-5 0-5 5-5 10c0-5 0-10-5-10c5 0 5-5 5-5z" />
  </svg>
);

const ProductCard = ({
  product,
  isInWishlist,
  toggleWishlist,
  onQuickView,
  onAddToCart,
  onBuyNow,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "120px 0px",
  });

  const {
    id,
    name,
    price,
    originalPrice,
    rating,
    reviewsCount,
    isBestSeller,
    isNewArrival,
    isSale,
    stockCount,
    lowStockAlert = 5,
    material,
    collection,
    image,
    hoverImage,
  } = product;

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      ref={ref}
      className="group relative flex flex-col bg-white rounded-lg overflow-hidden transition-all duration-500 md:hover:-translate-y-1.5 h-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (onQuickView) onQuickView(product);
      }}
    >
      {/* 1. Image Container (Aspect Ratio 3/4) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF8F5] z-10 rounded-lg">
        {inView ? (
          <>
            {/* Primary Image */}
            <img
              src={image}
              alt={name}
              className={`h-full w-full object-cover object-center transition-all duration-700 ease-out ${
                isHovered && hoverImage ? "opacity-0 scale-102" : "opacity-100 scale-100"
              }`}
              loading="lazy"
            />
            {/* Hover Image */}
            {hoverImage && (
              <img
                src={hoverImage}
                alt={`${name} Alternate`}
                className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
                  isHovered ? "opacity-100 scale-100" : "opacity-0 scale-98"
                }`}
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full shimmer-bg" />
        )}

        {/* Wishlist Button (Clean Circular Button) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs text-luxury-brown hover:text-[#EF4444] hover:bg-white border border-luxury-beige/40 shadow-3xs transition-all duration-300 flex items-center justify-center cursor-pointer focus:outline-none"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <motion.div
            animate={{ scale: isInWishlist ? [1, 1.25, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <FiHeart
              className={`w-3.5 h-3.5 stroke-[1.5] transition-colors duration-300 ${
                isInWishlist ? "fill-[#EF4444] text-[#EF4444]" : "text-luxury-brown"
              }`}
            />
          </motion.div>
        </button>

        {/* Single Refined Premium Badge */}
        <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
          {isBestSeller ? (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#FCF9F2] border border-[#C9A54B]/40 rounded-full text-[9px] uppercase tracking-widest text-[#C9A54B] font-semibold shadow-3xs">
              <CrownIcon />
              <span>BEST SELLER</span>
            </div>
          ) : isNewArrival ? (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#F9F9F9] border border-luxury-beige-dark/40 rounded-full text-[9px] uppercase tracking-widest text-luxury-brown font-semibold shadow-3xs">
              <SparkleIcon />
              <span>NEW ARRIVAL</span>
            </div>
          ) : null}
        </div>



        {/* Elegant ADD TO CART Button (Desktop Hover Only) */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-30 hidden md:block translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={stockCount === 0}
            className={`w-full py-2.5 text-white text-[10px] tracking-widest uppercase font-medium rounded-md shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              stockCount === 0 
                ? "bg-gray-400 cursor-not-allowed opacity-65" 
                : "bg-[#2E241C] hover:bg-[#423429]"
            }`}
          >
            <FiShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
            {stockCount === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* 2. Product Information */}
      <div className="pt-3.5 pb-2 px-1 flex flex-col flex-grow text-left">
        {/* Brand / Collection Subtitle */}
        <span className="text-[10px] uppercase tracking-widest font-light text-luxury-gray mb-1">
          {collection || "HERITAGE"} • {material || "GOLD PLATED"}
        </span>

        {/* Product Name */}
        <h3 className="font-serif text-sm sm:text-base text-luxury-brown leading-snug mb-1.5 font-medium line-clamp-1 group-hover:text-luxury-gold transition-colors duration-300">
          {name}
        </h3>

        {/* Rating & Review Count */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-luxury-gold gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[10px]">
                {i < Math.floor(rating) ? "★" : "☆"}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-luxury-gray font-light tracking-wide">
            ({reviewsCount} reviews)
          </span>
        </div>

        {/* Price Details */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-sm sm:text-base font-semibold text-luxury-brown">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-xs text-luxury-gray/70 line-through font-light">
                {formatPrice(originalPrice)}
              </span>
              <span className="text-[10px] font-semibold text-luxury-gold">
                ({discountPercentage}% OFF)
              </span>
            </>
          )}
        </div>

        {/* Stock status */}
        <div className="text-[10px] font-medium">
          {stockCount === 0 ? (
            <span className="text-[#EF4444] font-semibold italic">
              Out of Stock
            </span>
          ) : stockCount <= lowStockAlert ? (
            <span className="text-[#EF4444] italic">
              Only {stockCount} left in stock
            </span>
          ) : (
            <span className="text-[#10B981]">In stock</span>
          )}
        </div>

        {/* Mobile Quick Action Buttons (Touch optimized, clean) */}
        <div className="mt-3 pt-2 grid grid-cols-2 gap-2 md:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={stockCount === 0}
            className={`py-2 border text-[9px] tracking-widest uppercase font-medium rounded-md transition-colors cursor-pointer ${
              stockCount === 0
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-luxury-beige text-luxury-brown active:bg-luxury-beige"
            }`}
          >
            {stockCount === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onBuyNow) {
                onBuyNow(product);
              } else {
                onAddToCart(product);
              }
            }}
            disabled={stockCount === 0}
            className={`py-2 text-[9px] tracking-widest uppercase font-medium rounded-md transition-colors cursor-pointer ${
              stockCount === 0
                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-[#2E241C] text-white active:bg-[#423429]"
            }`}
          >
            {stockCount === 0 ? "Out of Stock" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
