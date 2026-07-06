import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";
import { useCart } from "../hooks/useCart";

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen } = useContext(ShopContext);
  const { cart: cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleClose = () => {
    setIsCartOpen(false);
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigate("/cart");
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 transition-opacity cursor-pointer"
          onClick={handleClose}
        ></div>
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-primary text-white flex items-center justify-between px-4 py-4">
          <button onClick={handleClose} className="p-1 hover:text-gray-200 transition-colors cursor-pointer">
            <FiX size={24} strokeWidth={1.5} />
          </button>
          <h2 className="text-sm font-bold tracking-widest uppercase flex-1 text-center pr-8">
            Your Cart
          </h2>
        </div>

        {/* Body (Cart Items) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <p>Your cart is empty.</p>
              <button 
                onClick={handleClose}
                className="mt-4 text-sm font-medium underline text-brand-dark hover:text-primary transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="h-20 w-20 flex-shrink-0 bg-gray-50 overflow-hidden">
                    <img 
                      src={item.image || item.image_url} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col pt-1">
                    <p className="text-xs font-bold text-gray-800 mb-1">
                      {item.quantity} x ₹{item.price}
                    </p>
                    <h3 className="text-sm font-medium text-brand-dark pr-6">{item.name}</h3>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id, item.name)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                    title="Remove item"
                  >
                    <FiX size={16} strokeWidth={1} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold uppercase tracking-wider text-brand-dark">Total:</span>
              <span className="text-lg font-bold text-primary">₹{total.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleViewCart}
                className="w-full bg-brand-dark hover:bg-black text-white py-3.5 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                View Cart
              </button>
              <button 
                onClick={() => { handleClose(); navigate("/checkout"); }}
                className="w-full bg-primary hover:bg-[#423429] text-white py-3.5 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
