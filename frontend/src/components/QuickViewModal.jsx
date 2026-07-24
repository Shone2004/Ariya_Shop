import React, { useState, useEffect, useRef } from "react";
import { FiX, FiShoppingBag, FiHeart, FiPlus, FiMinus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import SizeSelector from "./Product/SizeSelector";

const QuickViewModal = ({
  product,
  isOpen,
  onClose,
  isInWishlist,
  toggleWishlist,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  
  useEffect(() => {
    setCurrentImage(0);
    setSelectedSize(null);
    if (product) {
      setQuantity(product.stockCount > 0 ? 1 : 0);
    }
  }, [product]);
  const modalRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus trap inside modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

const {
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
  deliveryDays,
  material,
  stone,
  finish,
  collection,
  description,
  image,
  images = [],
  galleryImages: modelGalleryImages = [],
} = product;

const galleryImages =
  images.length > 0
    ? images
    : modelGalleryImages.length > 0
    ? modelGalleryImages
    : image
    ? [image]
    : [];
console.log("PRODUCT:", product);
console.log("IMAGE:", image);
console.log("IMAGES:", images);
console.log("GALLERY:", galleryImages);
console.log("COUNT:", galleryImages.length);
  const hasSizes = product.sizes && product.sizes.length > 0;
  const allSizesUnavailable = hasSizes && product.sizes.every(s => !s.available);
  const isOutOfStock = stockCount === 0 || allSizesUnavailable;

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-luxury-beige z-10 flex flex-col max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/90 text-luxury-brown hover:bg-luxury-beige transition-colors shadow-sm focus:outline-none"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>

<div className="flex flex-col md:flex-row w-full flex-none items-start">

  {/* Left Column (Editorial Stacked Gallery) */}
  <div className="w-full md:w-1/2 bg-white flex flex-col p-6 md:p-8 relative gap-6">
    {galleryImages.map((img, idx) => (
      <img
        key={idx}
        src={img}
        alt={`${name} - ${idx + 1}`}
        className="w-full h-auto object-contain rounded-lg"
        loading={idx === 0 ? "eager" : "lazy"}
      />
    ))}

    {/* Product Badges */}
    <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
      {isBestSeller && (
        <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold bg-luxury-gold text-white rounded">
          Best Seller
        </span>
      )}

      {isNewArrival && (
        <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold bg-[#2E241C] text-white rounded">
          New
        </span>
      )}

      {isSale && discountPercentage > 0 && (
        <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold bg-red-500 text-white rounded">
          -{discountPercentage}%
        </span>
      )}
    </div>
  </div>

          {/* Right Column: Details Area */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between md:sticky md:top-0 h-fit">
            <div>
              {/* Collection */}
              {collection && (
                <span className="text-[10px] uppercase tracking-widest font-semibold text-luxury-gold mb-2 block">
                  {collection} Collection
                </span>
              )}

              {/* Title */}
              <h2
                id="modal-title"
                className="font-serif text-xl sm:text-2xl lg:text-3xl text-luxury-brown mb-3 font-medium leading-snug"
              >
                {name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-4">
                <div className="flex text-luxury-gold">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">
                      {i < Math.floor(rating) ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-luxury-gray font-light">
                    {rating}
                  </span>
                  <Link 
                    to={`/product/${product.id}`} 
                    onClick={onClose} 
                    className="text-xs text-[#C9A54B] hover:text-[#DEB96E] hover:underline font-medium ml-1 transition-colors"
                  >
                    Read {reviewsCount} reviews
                  </Link>
                </div>
              </div>

              {/* Price Details */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-xl sm:text-2xl font-bold text-luxury-brown">
                  {formatPrice(price)}
                </span>
                {originalPrice && originalPrice > price && (
                  <>
                    <span className="text-sm text-luxury-gray line-through font-light">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="text-xs font-medium text-luxury-gold bg-luxury-beige px-2 py-0.5 rounded-xs">
                      Save {formatPrice(originalPrice - price)} ({discountPercentage}% OFF)
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-luxury-gray font-light mb-6 leading-relaxed whitespace-pre-line">
                {description}
              </p>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mb-6 border-t border-b border-luxury-beige/60 py-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-luxury-gray font-light">Finish:</span>
                  <span className="text-luxury-brown font-medium">{finish}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-gray font-light">Delivery:</span>
                  <span className="text-luxury-brown font-medium">3–5 Days</span>
                </div>
              </div>

              {/* Size Selector Integration */}
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelect={setSelectedSize}
              />
            </div>

            {/* Actions */}
            <div>
              {/* Stock Alerts */}
              <div className="mb-4 text-xs">
                {isOutOfStock ? (
                  <div className="flex items-center gap-2 text-[#EF4444] font-semibold italic">
                    Out of Stock
                  </div>
                ) : stockCount <= lowStockAlert ? (
                  <div className="flex items-center gap-2 text-[#EF4444] font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444]"></span>
                    </span>
                    Only {stockCount} left in stock - order soon
                  </div>
                ) : (
                  <span className="text-[#10B981] font-medium">✓ In Stock & Ready to Ship</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between border border-luxury-beige-dark rounded-md w-full sm:w-32 h-12">
                  <button
                    onClick={() => setQuantity((q) => Math.max(isOutOfStock ? 0 : 1, q - 1))}
                    disabled={isOutOfStock}
                    className="p-3 text-luxury-brown hover:bg-luxury-beige transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-medium text-sm text-luxury-brown">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stockCount, q + 1))}
                    disabled={isOutOfStock}
                    className="p-3 text-luxury-brown hover:bg-luxury-beige transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => {
                    if (isOutOfStock) return;
                    if (hasSizes && !selectedSize) {
                      toast.error("Please select a size", {
                        style: {
                          background: "#2E241C",
                          color: "#FCF9F5",
                          fontFamily: "Outfit, sans-serif",
                          borderRadius: "8px",
                        },
                      });
                      const sizeSelectorEl = document.getElementById("product-size-selector");
                      if (sizeSelectorEl) {
                        sizeSelectorEl.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                      return;
                    }
                    onAddToCart(product, quantity, selectedSize);
                    onClose();
                  }}
                  disabled={isOutOfStock}
                  className={`flex-grow h-12 text-white text-xs tracking-widest uppercase font-medium rounded-md shadow-md transition-colors flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? "bg-gray-400 cursor-not-allowed opacity-65"
                      : "bg-[#2E241C] hover:bg-[#423429]"
                  }`}
                >
                  <FiShoppingBag className="w-4 h-4" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>

                {/* Wishlist Icon Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="h-12 w-12 border border-luxury-beige-dark hover:border-luxury-gold text-luxury-brown hover:text-[#EF4444] rounded-md transition-colors flex items-center justify-center focus:outline-none"
                  aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <FiHeart
                    className={`w-5 h-5 transition-colors ${
                      isInWishlist ? "fill-[#EF4444] text-[#EF4444]" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;