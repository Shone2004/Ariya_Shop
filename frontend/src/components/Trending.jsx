import React, { useState, useEffect, useCallback, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../utils/apiClient";
import { useCart } from "../hooks/useCart";
import { ShopContext } from "../context/ShopContext";
import {
  FaStar,
  FaStarHalfAlt,
  FaArrowRight,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaShieldAlt,
  FaTimes,
  FaShoppingBag,
  FaTruck,
  FaUndo,
  FaMinus,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
} from "react-icons/fa";

// ---------------- PRODUCT DATA ----------------
const mockProducts = [
  {
    id: 1,
    name: "18k Gold Clover Pendant Necklace",
    description:
      "Elevate your everyday elegance with this stunning 18k gold-plated clover pendant. Featuring a delicate four-leaf clover design symbolizing luck and prosperity, this necklace is handcrafted with premium materials for lasting shine. Perfect for layering or wearing solo — a timeless piece for the modern woman.",
    price: 1299,
    originalPrice: 1899,
    rating: 5,
    reviewsCount: 124,
    badge: "Bestseller",
    inStock: true,
    featured: true,
    sizes: ["16 inch", "18 inch", "20 inch", "22 inch"],
    materials: ["18k Gold Plated", "Hypoallergenic", "Tarnish-Free"],
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611591471483-ed174d408b47?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: 2,
    name: "Eternity Pearl Drop Ring",
    description:
      "A classic reborn — this eternity-inspired ring features a lustrous freshwater pearl set on a minimalist gold band. Designed for daily wear with a touch of luxury, it complements both casual and formal outfits effortlessly. Each pearl is hand-selected for its natural iridescence.",
    price: 699,
    originalPrice: 999,
    rating: 5,
    reviewsCount: 48,
    rightTag: "30% OFF",
    inStock: true,
    sizes: ["Size 5", "Size 6", "Size 7", "Size 8"],
    materials: ["Freshwater Pearl", "Gold Plated Band", "Nickel-Free"],
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
    ],
  },
  {
    id: 3,
    name: "Venetian Gold Chain Bracelet",
    description:
      "Inspired by the timeless elegance of Venetian craftsmanship, this chain bracelet features interlocking gold-plated links with a smooth, fluid drape. Lightweight yet statement-making, it pairs beautifully with watches or other bracelets for a curated wrist stack.",
    price: 899,
    originalPrice: 1199,
    rating: 5,
    reviewsCount: 86,
    rightTag: "New Arrival",
    inStock: true,
    sizes: ["6.5 inch", "7 inch", "7.5 inch", "8 inch"],
    materials: ["18k Gold Plated", "Stainless Steel Core", "Water-Resistant"],
    images: [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    ]
  },
  {
    id: 4,
    name: "Minimalist Sculptural Hoops",
    description:
      "Modern art meets fine jewelry. These sculptural hoops feature an organic, fluid silhouette that catches light from every angle. Ultra-lightweight with secure click-lock closures, they're designed for all-day comfort without compromising on style.",
    price: 549,
    originalPrice: 749,
    rating: 5,
    reviewsCount: 112,
    rightTag: "Best Value",
    inStock: true,
    sizes: ["Small (2cm)", "Medium (3cm)", "Large (4cm)"],
    materials: ["18k Gold Plated", "Surgical Steel Post", "Lead-Free"],
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: 5,
    name: "Baroque Freshwater Pearl Strand",
    description:
      "Embrace the beauty of imperfection with this baroque pearl strand necklace. Each pearl is uniquely shaped by nature, creating a one-of-a-kind piece that exudes sophistication. Strung on silk thread with a 18k gold clasp for secure, elegant wear.",
    price: 1499,
    originalPrice: 1999,
    rating: 5,
    reviewsCount: 64,
    rightTag: "Only 3 Left",
    inStock: true,
    sizes: ["16 inch", "18 inch", "20 inch"],
    materials: ["Baroque Pearls", "Silk Thread", "18k Gold Clasp"],
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
    ],
  },
];

const fallbackFeatured = mockProducts[0];
const fallbackTrending = mockProducts.slice(1);

// ---------------- HELPERS ----------------
const formatPrice = (n) => `₹${n.toLocaleString("en-IN")}`;
const calcDiscount = (price, original) =>
  Math.round(((original - price) / original) * 100);

// ---------------- ANIMATIONS ----------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 16 },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 30,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// ---------------- COUNTDOWN TIMER ----------------
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(23 * 3600 + 59 * 60 + 59);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hrs = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const mins = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  const Unit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <span className="bg-[#222222] text-white text-sm font-bold tabular-nums w-10 h-10 flex items-center justify-center rounded-lg shadow-sm">
        {value}
      </span>
      <span className="text-[9px] uppercase tracking-wider text-[#777777] mt-1">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-semibold text-[#be8b2d] uppercase tracking-wider">
        Offer ends in
      </span>
      <div className="flex items-center gap-1.5">
        <Unit value={hrs} label="Hrs" />
        <span className="text-[#be8b2d] font-bold pb-3">:</span>
        <Unit value={mins} label="Min" />
        <span className="text-[#be8b2d] font-bold pb-3">:</span>
        <Unit value={secs} label="Sec" />
      </div>
    </div>
  );
};

// ---------------- STAR RATING ----------------
const StarRating = ({ rating, reviews, size = "text-sm" }) => (
  <div className={`flex items-center gap-1 text-[#e8b54a] ${size}`}>
    {[...Array(Math.floor(rating))].map((_, i) => (
      <FaStar key={i} />
    ))}
    {rating % 1 !== 0 && <FaStarHalfAlt />}
    <span className="text-xs text-[#777777] ml-1.5 font-medium">
      ({reviews})
    </span>
  </div>
);

// ---------------- WISHLIST BUTTON ----------------
const WishlistButton = ({ className = "" }) => {
  const [liked, setLiked] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setLiked(!liked);
      }}
      aria-label="Add to wishlist"
      className={`w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${className}`}
    >
      {liked ? (
        <FaHeart className="text-red-500 text-sm" />
      ) : (
        <FaRegHeart className="text-[#222222] text-sm" />
      )}
    </button>
  );
};

// ================================================
//             QUICK VIEW MODAL
// ================================================
const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const { setIsCartOpen } = useContext(ShopContext);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || null);
      setQuantity(1);
      setCurrentImageIndex(0);
      setAddedToCart(false);
    }
  }, [product]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setIsCartOpen(true);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    }
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev < product.images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev > 0 ? prev - 1 : product.images.length - 1
      );
    }
  };

  if (!product) return null;

  const discount = calcDiscount(product.price, product.originalPrice);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal Card */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-[#222222] hover:text-white transition-all duration-300 text-[#222222]"
            >
              <FaTimes className="text-sm" />
            </button>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto md:overflow-hidden">
              
              {/* LEFT: Image Gallery */}
              <div className="relative bg-gradient-to-br from-[#f5ece0] to-[#fffaf6] p-6 sm:p-8 flex flex-col items-center justify-center min-h-[300px] md:min-h-[550px]">
                {/* Discount Badge */}
                <span className="absolute top-4 left-4 z-10 bg-[#be8b2d] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {discount}% OFF
                </span>

                {/* Wishlist */}
                <div className="absolute top-4 right-4 z-10 md:right-auto md:left-4 md:top-14">
                  <WishlistButton />
                </div>

                {/* Main Image */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-2xl shadow-lg"
                  />
                </AnimatePresence>

                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-[#be8b2d] hover:text-white transition-all duration-200"
                    >
                      <FaChevronLeft className="text-xs" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-[#be8b2d] hover:text-white transition-all duration-200"
                    >
                      <FaChevronRight className="text-xs" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex items-center gap-2 mt-4">
                      {product.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            i === currentImageIndex
                              ? "bg-[#be8b2d] scale-125"
                              : "bg-[#be8b2d]/30 hover:bg-[#be8b2d]/60"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* RIGHT: Product Details */}
              <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
                <div>
                  {/* Badge */}
                  {product.badge && (
                    <span className="inline-block bg-[#be8b2d]/10 text-[#be8b2d] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                      🔥 {product.badge}
                    </span>
                  )}
                  {product.rightTag && (
                    <span className="inline-block bg-[#be8b2d]/10 text-[#be8b2d] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                      {product.rightTag}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#222222] font-medium leading-tight">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="mt-3">
                    <StarRating
                      rating={product.rating}
                      reviews={`${product.reviewsCount} Reviews`}
                    />
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-3 mt-4">
                    <span className="text-3xl font-bold text-[#be8b2d]">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-lg text-[#777777] line-through pb-0.5">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                      Save {discount}%
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#555555] mt-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Materials */}
                  {product.materials && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {product.materials.map((mat, i) => (
                        <span
                          key={i}
                          className="text-[10px] uppercase tracking-wider font-semibold text-[#777777] bg-[#f5f0e8] px-3 py-1.5 rounded-full"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Size Selector */}
                  {product.sizes && (
                    <div className="mt-6">
                      <p className="text-xs uppercase tracking-wider font-semibold text-[#222222] mb-2.5">
                        Select Size
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-full text-xs font-medium border-2 transition-all duration-200 ${
                              selectedSize === size
                                ? "border-[#be8b2d] bg-[#be8b2d] text-white shadow-md"
                                : "border-gray-200 text-[#222222] hover:border-[#be8b2d] hover:text-[#be8b2d]"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-wider font-semibold text-[#222222] mb-2.5">
                      Quantity
                    </p>
                    <div className="inline-flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                      <button
                        onClick={() =>
                          setQuantity((prev) => Math.max(1, prev - 1))
                        }
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-[#222222]"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="w-12 text-center font-bold text-sm tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity((prev) => Math.min(10, prev + 1))
                        }
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-[#222222]"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom CTAs */}
                <div className="mt-8 space-y-3">
                  {/* Buy Now */}
                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`w-full py-4 rounded-full text-sm font-semibold uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md hover:shadow-lg ${
                      addedToCart
                        ? "bg-green-600 text-white"
                        : "bg-[#222222] text-white hover:bg-[#be8b2d]"
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <FaCheck /> Added to Cart
                      </>
                    ) : (
                      <>
                        <FaShoppingBag className="text-xs" /> Buy Now —{" "}
                        {formatPrice(product.price * quantity)}
                      </>
                    )}
                  </button>

                  {/* Trust Signals */}
                  <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1.5 text-[11px] text-[#777777]">
                      <FaTruck className="text-[#be8b2d]" /> Free Shipping
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-[#777777]">
                      <FaUndo className="text-[#be8b2d]" /> 7-Day Returns
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-[#777777]">
                      <FaShieldAlt className="text-[#be8b2d]" /> Certified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ================================================
//             MAIN TRENDING COMPONENT
// ================================================
const Trending = () => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [realProducts, setRealProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await apiClient("/products?highlight=isBestSeller&limit=5");
        const json = await res.json();
        if (json.success && json.data && json.data.products) {
          const mapped = json.data.products.map(p => ({
            ...p,
            id: p._id,
            images: [p.image, ...(p.galleryImages || [])]
          }));
          setRealProducts(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch trending products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const openQuickView = useCallback((product) => {
    setQuickViewProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setQuickViewProduct(null), 300);
  }, []);

  const featuredProduct = realProducts.length > 0 ? realProducts[0] : fallbackFeatured;
  const trendingProducts = realProducts.length > 1 ? realProducts.slice(1, 5) : fallbackTrending;

  return (
    <>
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isModalOpen}
        onClose={closeQuickView}
      />

      <section className="py-24 bg-[#fffaf6] text-[#1a1a1a] overflow-hidden relative">
        {/* Heavy Grainy Paper Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.45] pointer-events-none mix-blend-multiply"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* ---------- HEADER ---------- */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#8a631e] block mb-3 drop-shadow-sm">
              Loved by 10,000+ Ariya Customers
            </span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-[#111111] drop-shadow-sm font-bold">
              Trending This Week
            </h2>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-2 my-5">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#be8b2d]/60" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#be8b2d]" />
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#be8b2d]/60" />
            </div>

            <p className="text-[#3a3531] text-base md:text-lg font-medium leading-relaxed drop-shadow-sm mt-4">
              <span className="relative inline-block px-8 py-3">
                <span 
                  className="absolute inset-0 -z-10 transform -rotate-1"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 60' preserveAspectRatio='none'%3E%3Cfilter id='brush'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.5' numOctaves='3' result='noise'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='noise' scale='12' xChannelSelector='R' yChannelSelector='G'/%3E%3C/filter%3E%3Cpath d='M15 15 Q 200 5 385 15 L380 45 Q 200 55 15 45 Z' fill='%23f4d160' opacity='0.45' filter='url(%23brush)'/%3E%3C/svg%3E")`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                />
                Handcrafted favorites loved by thousands of women this week.
                <br className="hidden sm:block" /> 
                <span className="mt-1 inline-block">Grab yours before they sell out.</span>
              </span>
            </p>
          </motion.div>

          {/* ---------- GRID ---------- */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
          >
            {/* ===== LEFT: FEATURED ===== */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-6 group cursor-pointer"
            >
              <div className="relative bg-white rounded-3xl p-4 sm:p-6 shadow-[0_10px_40px_-15px_rgba(190,139,45,0.25)] hover:shadow-[0_20px_50px_-12px_rgba(190,139,45,0.35)] transition-all duration-500 transform hover:-translate-y-2 border border-[#be8b2d]/10">
                {/* Image */}
                <div className="relative aspect-[4/4.5] sm:aspect-[4/4] overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5ece0] to-[#fffaf6]">
                  <img
                    src={featuredProduct.images[0]}
                    alt={featuredProduct.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-110"
                  />

                  {/* Top badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                    <span className="bg-[#be8b2d] text-white text-[11px] font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                      🔥 {featuredProduct.badge}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <WishlistButton />
                  </div>

                  {/* Discount badge */}
                  <span className="absolute bottom-4 left-4 z-10 bg-[#222222] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    Save{" "}
                    {calcDiscount(
                      featuredProduct.price,
                      featuredProduct.originalPrice
                    )}
                    %
                  </span>

                  {/* Quick view overlay */}
                  <div
                    onClick={() => openQuickView(featuredProduct)}
                    className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  >
                    <span className="bg-white/95 backdrop-blur-md text-[#222222] font-medium text-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <FaEye className="text-[#be8b2d]" /> Quick View
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-6 px-2">
                  <StarRating
                    rating={featuredProduct.rating}
                    reviews={`${featuredProduct.reviewsCount} Reviews`}
                  />

                  <h3 className="text-2xl font-serif text-[#222222] group-hover:text-[#be8b2d] transition-colors duration-300 font-medium mt-2">
                    {featuredProduct.name}
                  </h3>

                  {/* Price + stock */}
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-[#be8b2d]">
                        {formatPrice(featuredProduct.price)}
                      </span>
                      <span className="text-sm text-[#777777] line-through pb-0.5">
                        {formatPrice(featuredProduct.originalPrice)}
                      </span>
                    </div>
                    {featuredProduct.inStock && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-green-700">
                        <FaShieldAlt className="text-green-600" /> In Stock
                      </span>
                    )}
                  </div>

                  {/* Countdown */}
                  <div className="mt-5 pt-5 border-t border-[#be8b2d]/15">
                    <CountdownTimer />
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => openQuickView(featuredProduct)}
                    className="mt-6 w-full bg-[#222222] text-white px-6 py-4 rounded-full text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#be8b2d] transition-colors duration-300"
                  >
                    <span>Shop Now</span>
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* ===== RIGHT: 2x2 GRID ===== */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trendingProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="group bg-white rounded-2xl p-3 sm:p-4 shadow-[0_6px_25px_-12px_rgba(190,139,45,0.2)] hover:shadow-[0_15px_35px_-12px_rgba(190,139,45,0.3)] transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-[#be8b2d]/5 flex flex-col justify-between"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/4.2] overflow-hidden rounded-xl bg-gradient-to-br from-[#f5ece0] to-[#fffaf6]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-110"
                    />

                    {/* Tags */}
                    <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm text-[#222222] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      🔥 Trending
                    </span>
                    <span className="absolute top-2.5 right-2.5 bg-[#be8b2d] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                      {product.rightTag}
                    </span>

                    {/* Quick view */}
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0">
                      <button
                        onClick={() => openQuickView(product)}
                        className="w-full bg-[#222222]/95 hover:bg-[#be8b2d] text-white text-xs font-semibold uppercase tracking-wider py-2.5 rounded-lg transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
                      >
                        <FaEye className="text-[11px]" /> Quick View
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 px-1">
                    <StarRating
                      rating={product.rating}
                      reviews={product.reviewsCount}
                      size="text-xs"
                    />

                    <h4 className="font-semibold text-base text-[#222222] group-hover:text-[#be8b2d] transition-colors duration-200 line-clamp-1 mt-1.5">
                      {product.name}
                    </h4>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-base font-bold text-[#be8b2d]">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-[#777777] line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ---------- BOTTOM CTA ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <a
              href="/shop?isBestSeller=true"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-[#8a631e] text-[#8a631e] font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#8a631e] hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg bg-white/40 backdrop-blur-sm"
            >
              <span>View All Trending Collections</span>
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
            <p className="text-xs text-[#444444] font-medium mt-4 drop-shadow-sm">
              Free shipping on orders above ₹999 · Easy 7-day returns
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Trending;