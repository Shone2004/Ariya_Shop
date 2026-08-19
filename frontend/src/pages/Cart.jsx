import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiTag } from "react-icons/fi";
import { useCart } from "../hooks/useCart";
import toast from "react-hot-toast";
import offerBrochure from "../assets/offer.jpeg";

const Cart = () => {
  const { cart: cartItems, updateQuantity, removeFromCart } = useCart();
  const [showOffer, setShowOffer] = useState(false);

  // Fixed ₹99 shipping charge
  const SHIPPING_FEE = 99;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + SHIPPING_FEE;
  
  const hasOutOfStockItems = cartItems.some(item => item.stockCount === 0 || item.quantity > item.stockCount);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-4xl font-serif tracking-tight text-brand-dark sm:text-5xl">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FiShoppingBag className="text-4xl" />
          </div>
          <h2 className="mb-2 text-2xl font-medium text-gray-900">Your cart is empty</h2>
          <p className="mb-8 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/shop"
            className="rounded-none bg-primary px-8 py-3 font-medium text-white transition hover:bg-primary-hover uppercase tracking-wider text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Cart Items List */}
          <div className="flex-1">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="hidden grid-cols-5 border-b border-gray-200 bg-gray-50 p-6 text-sm font-medium text-gray-500 sm:grid">
                <div className="col-span-2">Product</div>
                <div className="text-center">Price</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Total</div>
              </div>

              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const uniqueKey = item.id + (item.selectedSize ? '-' + item.selectedSize : '');
                  return (
                    <li key={uniqueKey} className="p-6">
                      <div className="flex flex-col sm:grid sm:grid-cols-5 sm:items-center sm:gap-6">
                        {/* Product Image & Details */}
                        <div className="col-span-2 flex items-center gap-4">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.image || item.image_url}
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="flex flex-col">
                            <h3 className="font-serif font-medium text-brand-dark text-lg">{item.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.color ? `${item.color}${item.selectedSize ? ` | Size : ${item.selectedSize}` : ''}` : (item.selectedSize ? `Size : ${item.selectedSize}` : '')}
                            </p>
                            {item.stockCount === 0 ? (
                              <p className="text-xs text-red-500 font-semibold italic mt-1">Out of Stock</p>
                            ) : item.quantity > item.stockCount ? (
                              <p className="text-xs text-red-500 font-medium mt-1">Only {item.stockCount} units available</p>
                            ) : null}
                            <button 
                              onClick={() => removeFromCart(item.id, item.name, item.selectedSize)}
                              className="mt-2 flex items-center text-sm font-medium text-red-500 transition hover:text-red-700 sm:hidden"
                            >
                              <FiTrash2 className="mr-1" /> Remove
                            </button>
                          </div>
                        </div>

                        {/* Price (Desktop) */}
                        <div className="hidden text-center text-gray-900 sm:block">
                          ₹{item.price}
                        </div>

                        {/* Quantity Controls */}
                        <div className="mt-4 flex items-center justify-between sm:mt-0 sm:justify-center">
                          <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                              className="flex h-10 w-10 items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-primary"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="flex h-10 w-10 items-center justify-center font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                if (item.quantity < item.stockCount) {
                                  updateQuantity(item.id, item.quantity + 1, item.selectedSize);
                                } else {
                                  toast.error(`Only ${item.stockCount} units of ${item.name} are available.`, {
                                    style: {
                                      background: "#2E241C",
                                      color: "#FCF9F5",
                                      fontFamily: "Outfit, sans-serif",
                                      borderRadius: "8px",
                                    }
                                  });
                                }
                              }}
                              className="flex h-10 w-10 items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-primary"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                          
                          <div className="text-right font-medium text-gray-900 sm:hidden">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>

                        {/* Total & Remove (Desktop) */}
                        <div className="hidden items-center justify-end gap-6 sm:flex">
                          <span className="font-medium text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button 
                            onClick={() => removeFromCart(item.id, item.name, item.selectedSize)}
                            className="text-gray-400 transition hover:text-red-500"
                            title="Remove item"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-serif text-brand-dark">Order Summary</h2>
              
              {/* Promo Code */}
              <div className="mt-6 flex items-center border-b border-gray-200 pb-6">
                <input 
                  type="text" 
                  placeholder="Enter Promo Code" 
                  className="w-full border border-gray-300 border-r-0 px-4 py-2.5 text-sm focus:border-brand-dark focus:outline-none"
                />
                <button className="bg-brand-dark px-6 py-2.5 text-sm font-medium text-white transition hover:bg-black uppercase tracking-wider cursor-pointer">
                  Apply
                </button>
              </div>

              {/* Offer Brochure Section */}
              <div className="mt-6 border-b border-gray-200 pb-6">
                <button 
                  onClick={() => setShowOffer(!showOffer)}
                  className="flex w-full items-center justify-between rounded-md border border-amber-200 bg-amber-50/50 px-4 py-2.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100/50"
                >
                  <span className="flex items-center gap-2">
                    <FiTag className="text-amber-700" />
                    Special Offer Brochure
                  </span>
                  <span>{showOffer ? "Hide" : "View"}</span>
                </button>

                {showOffer && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-2">
                    <img 
                      src={offerBrochure} 
                      alt="Current Promotional Offer" 
                      className="w-full rounded object-cover"
                    />
                    <a 
                      href={offerBrochure} 
                      download="offer-brochure.jpeg"
                      className="mt-2 block text-center text-xs font-medium text-primary hover:underline"
                    >
                      Download Brochure
                    </a>
                  </div>
                )}
              </div>
              
              <dl className="mt-6 space-y-4 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Shipping</dt>
                  <dd className="font-medium text-gray-900">₹{SHIPPING_FEE.toFixed(2)}</dd>
                </div>
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-base font-medium">
                  <dt className="text-gray-900">Order Total</dt>
                  <dd className="text-gray-900">₹{total.toFixed(2)}</dd>
                </div>
              </dl>

              {hasOutOfStockItems ? (
                <button
                  disabled
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-none bg-gray-300 px-6 py-4 text-sm font-medium text-gray-500 shadow-sm cursor-not-allowed uppercase tracking-wider"
                >
                  Proceed to Checkout (Fix stock issues)
                </button>
              ) : (
                <Link to="/checkout" className="mt-8 flex w-full items-center justify-center gap-2 rounded-none bg-primary px-6 py-4 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover uppercase tracking-wider cursor-pointer">
                  Proceed to Checkout
                  <FiArrowRight />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;