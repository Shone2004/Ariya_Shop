import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FiX, FiHeart, FiGrid, FiList, FiShoppingCart } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";

const Wishlist = () => {
  const [viewMode, setViewMode] = useState("list");
  const [copied, setCopied] = useState(false);
  const [addedItemId, setAddedItemId] = useState(null);

  const { wishlist: wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { setIsCartOpen } = useContext(ShopContext);

  const wishlistLink = "https://ariyashop.in/wishlist/Y7U8KN/";

  const handleCopy = () => {
    navigator.clipboard.writeText(wishlistLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setIsCartOpen(true);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col pb-20">
      
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header & View Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 pb-4 border-b border-gray-200">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-4xl font-serif tracking-tight text-brand-dark sm:text-5xl">Your Wishlist</h1>
          </div>
          
          {wishlistItems.length > 0 && (
            <div className="flex items-center gap-2 bg-white border border-gray-200 p-1 rounded-none shadow-sm ml-auto">
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-brand-dark' : 'text-gray-400 hover:text-brand-dark'}`}
                title="List View"
              >
                <FiList size={20} />
              </button>
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-brand-dark' : 'text-gray-400 hover:text-brand-dark'}`}
                title="Grid View"
              >
                <FiGrid size={20} />
              </button>
            </div>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FiHeart className="text-4xl" />
            </div>
            <h2 className="mb-2 text-2xl font-serif font-medium text-brand-dark">Your wishlist is empty</h2>
            <p className="mb-8 text-gray-500">Explore our products and find something you love!</p>
            <Link
              to="/shop"
              className="bg-primary px-8 py-3 font-medium text-white transition hover:bg-primary-hover tracking-wider text-sm uppercase"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Conditional Rendering based on viewMode */}
            {viewMode === "list" ? (
              /* LIST VIEW */
              <div className="w-full border border-gray-200 bg-white">
                <ul className="flex flex-col">
                  {wishlistItems.map((item, index) => (
                    <li 
                      key={item.id} 
                      className={`flex flex-col sm:flex-row sm:items-center p-4 sm:p-6 ${index !== wishlistItems.length - 1 ? 'border-b border-gray-200' : ''}`}
                    >
                      {/* Remove Icon & Image (Left side) */}
                      <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                        <button 
                          onClick={() => toggleWishlist(item)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2"
                          title="Remove"
                        >
                          <FiX size={20} strokeWidth={1} />
                        </button>
                        <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-100 flex-shrink-0">
                          <img 
                            src={item.image || item.image_url} 
                            alt={item.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        {/* Mobile Item Details */}
                        <div className="flex flex-col sm:hidden ml-2 flex-1">
                          <h3 className="text-sm font-bold text-[#333] mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">₹{item.price}</p>
                        </div>
                      </div>

                      {/* Desktop Item Details (Middle) */}
                      <div className="hidden sm:flex flex-col flex-1 px-6">
                        <h3 className="text-[15px] font-bold text-[#333] mb-1">{item.name}</h3>
                        <p className="text-[15px] text-gray-500 mb-1">₹{item.price}</p>
                      </div>

                      {/* Action Column (Right) */}
                      <div className="mt-4 sm:mt-0 flex sm:flex-col items-center sm:items-start justify-between sm:justify-center sm:w-[200px] sm:border-l sm:border-gray-200 sm:pl-6 h-full min-h-[80px]">
                        <p className="text-[14px] text-gray-500 mb-0 sm:mb-3">{item.stockStatus}</p>
                        {item.inStock !== false && (
                          <button 
                            onClick={() => handleAddToCart(item)}
                            className={`${addedItemId === item.id ? 'bg-brand-dark hover:bg-black' : 'bg-primary hover:bg-primary-hover'} text-white text-[11px] font-bold uppercase tracking-wider px-6 py-2.5 transition-colors whitespace-nowrap min-w-[120px]`}
                          >
                            {addedItemId === item.id ? "Added!" : "Add to Cart"}
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              /* GRID VIEW */
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="group relative flex flex-col overflow-hidden bg-white border border-gray-200 transition-all hover:shadow-md">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={item.image || item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <button 
                        onClick={() => toggleWishlist(item)}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow backdrop-blur transition hover:bg-white hover:text-red-500"
                        title="Remove from wishlist"
                      >
                        <FiX size={18} />
                      </button>
                      {item.inStock === false && (
                        <div className="absolute bottom-0 left-0 w-full bg-red-500/90 backdrop-blur py-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-white">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-serif font-medium text-brand-dark">{item.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-gray-600">₹{item.price}</p>
                      
                      <div className="mt-auto pt-5">
                        <button
                          disabled={item.inStock === false}
                          onClick={() => handleAddToCart(item)}
                          className={`flex w-full items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition whitespace-nowrap ${
                            item.inStock === false
                              ? "cursor-not-allowed bg-gray-100 text-gray-400"
                              : addedItemId === item.id
                                ? "bg-brand-dark text-white hover:bg-black"
                                : "bg-primary text-white hover:bg-primary-hover"
                          }`}
                        >
                          {item.inStock !== false && addedItemId !== item.id && <FiShoppingCart size={14} />}
                          {item.inStock !== false ? (addedItemId === item.id ? "Added!" : "Add to Cart") : "Unavailable"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Wishlist Share Link (Applies to both views) */}
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-gray-200 pt-8">
              <span className="text-[14px] text-gray-600 font-medium">Share wishlist:</span>
              <div className="flex w-full sm:w-auto">
                <input 
                  type="text" 
                  readOnly 
                  value={wishlistLink}
                  className="border border-gray-300 text-[13px] text-gray-500 px-4 py-2.5 w-full sm:w-[320px] focus:outline-none focus:border-gray-400 bg-white"
                />
                <button 
                  onClick={handleCopy}
                  className={`${copied ? 'bg-primary hover:bg-primary-hover' : 'bg-brand-dark hover:bg-black'} text-white text-[12px] font-bold uppercase tracking-wider px-6 py-2.5 transition-colors w-24`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
