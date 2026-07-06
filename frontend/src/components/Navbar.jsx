import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Ariya.png";
import { motion } from "framer-motion";

import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { ShopContext } from "../context/ShopContext";

import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiLock,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const { setIsCartOpen, setIsLoginOpen } = useContext(ShopContext);
  const { user, logout } = useAuth();

  const wishlistCount = wishlist.length;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-luxury-beige/40 bg-white/80 backdrop-blur-lg shadow-3xs">
      <div className="mx-auto flex h-24 max-w-[1600px] items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center transition-transform duration-300 hover:scale-[1.02] z-10"
        >
          <img
            src={logo}
            alt="AriyaShop Logo"
            className="h-20 w-auto object-contain"
          />
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden items-center lg:gap-8 xl:gap-12 text-[13px] uppercase tracking-[0.2em] lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative py-2 transition-colors duration-300 focus:outline-none ${
                  isActive
                    ? "text-luxury-gold font-medium"
                    : "text-luxury-brown/70 hover:text-luxury-gold"
                }`
              }
              onMouseEnter={() => setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {({ isActive }) => (
                <>
                  <span>{link.name}</span>
                  {hoveredLink === link.name && !isActive && (
                    <motion.div
                      layoutId="navHoverUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-luxury-gold/50"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-luxury-gold" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Icons */}
        <div className="hidden items-center lg:gap-5 xl:gap-7 text-xl lg:flex text-luxury-brown z-10">
          <button
            className="transition-colors duration-300 hover:text-luxury-gold p-1.5 cursor-pointer focus:outline-none"
            aria-label="Search"
          >
            <FiSearch className="w-5 h-5 stroke-[1.5]" />
          </button>

          {user ? (
            <NavLink
              to="/profile"
              className="text-sm font-medium tracking-wide hover:text-luxury-gold transition-colors"
            >
              Hi, {user.name.split(" ")[0]}
            </NavLink>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="transition-colors duration-300 hover:text-luxury-gold p-1.5 cursor-pointer focus:outline-none"
              aria-label="Account"
            >
              <FiLock className="w-5 h-5 stroke-[1.5]" />
            </button>
          )}

          {user ? (
            <NavLink
              to="/wishlist"
              className="relative transition-colors duration-300 hover:text-luxury-gold p-1.5 focus:outline-none"
              aria-label="Wishlist"
            >
              <FiHeart className="w-5 h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 top-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#EF4444] text-[9px] text-white font-semibold shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </NavLink>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="relative transition-colors duration-300 hover:text-luxury-gold p-1.5 cursor-pointer focus:outline-none"
              aria-label="Wishlist"
            >
              <FiHeart className="w-5 h-5 stroke-[1.5]" />
            </button>
          )}

          <button
            onClick={() => (user ? setIsCartOpen(true) : setIsLoginOpen(true))}
            className="relative transition-colors duration-300 hover:text-luxury-gold p-1.5 cursor-pointer focus:outline-none"
            aria-label="Shopping Cart"
          >
            <FiShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 top-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-luxury-gold text-[9px] text-white font-semibold shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Icons */}
        <div className="flex items-center gap-4 lg:hidden text-luxury-brown z-10">
          <button
            onClick={() => (user ? setIsCartOpen(true) : setIsLoginOpen(true))}
            className="relative text-lg p-2 focus:outline-none cursor-pointer"
            aria-label="Shopping Cart"
          >
            <FiShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-luxury-gold text-[9px] text-white font-semibold">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-xl p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-luxury-beige/30 bg-white transition-all duration-300 lg:hidden ${
          menuOpen ? "max-h-[30rem] py-4" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-6 text-luxury-brown">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `py-3 text-[13px] uppercase tracking-widest font-light transition-colors ${
                  isActive ? "text-luxury-gold font-semibold" : "text-luxury-brown/80"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          <hr className="my-3 border-luxury-beige/30" />

          <div className="flex items-center justify-around py-2 text-xl">
            <button
              className="p-2 hover:text-luxury-gold focus:outline-none"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {user ? (
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="p-2 hover:text-luxury-gold focus:outline-none cursor-pointer"
                aria-label="Profile"
              >
                <FiUser className="w-5 h-5" />
              </NavLink>
            ) : (
              <button
                onClick={() => { setIsLoginOpen(true); setMenuOpen(false); }}
                className="p-2 hover:text-luxury-gold focus:outline-none cursor-pointer"
                aria-label="Account"
              >
                <FiLock className="w-5 h-5" />
              </button>
            )}

            {user ? (
              <NavLink
                to="/wishlist"
                className="relative p-2 hover:text-luxury-gold focus:outline-none"
                aria-label="Wishlist"
                onClick={() => setMenuOpen(false)}
              >
                <FiHeart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#EF4444] text-[9px] text-white font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>
            ) : (
              <button
                onClick={() => { setIsLoginOpen(true); setMenuOpen(false); }}
                className="relative p-2 hover:text-luxury-gold focus:outline-none cursor-pointer"
                aria-label="Wishlist"
              >
                <FiHeart className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => { user ? setIsCartOpen(true) : setIsLoginOpen(true); setMenuOpen(false); }}
              className="relative p-2 hover:text-luxury-gold focus:outline-none cursor-pointer"
              aria-label="Shopping Cart"
            >
              <FiShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-luxury-gold text-[9px] text-white font-semibold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
