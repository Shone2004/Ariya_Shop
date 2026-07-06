import React from "react";
import { motion } from "framer-motion";

const EmptyState = ({ onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-luxury-beige rounded-2xl bg-[#FCF9F5]/30 max-w-lg mx-auto"
    >
      {/* Luxury Empty Ring Stand Illustration */}
      <svg
        viewBox="0 0 100 100"
        className="w-24 h-24 stroke-current text-luxury-beige-dark fill-none stroke-[1.2] mb-6"
      >
        {/* Ring stand base */}
        <path d="M25,80 L75,80 M35,80 L35,65 M65,80 L65,65" />
        {/* Top jewelry bar */}
        <path d="M20,65 L80,65" strokeLinecap="round" />
        {/* Hanging empty hooks */}
        <path d="M30,65 C30,68 28,72 30,75 C32,77 35,74 35,72" />
        <path d="M50,65 C50,68 48,72 50,75 C52,77 55,74 55,72" />
        <path d="M70,65 C70,68 68,72 70,75 C72,77 75,74 75,72" />
        {/* Soft sparkle icon representing empty space */}
        <path
          d="M50,25 L52,32 L59,34 L52,36 L50,43 L48,36 L41,34 L48,32 Z"
          className="fill-luxury-gold/20 text-luxury-gold"
          strokeWidth="1"
        />
        <path
          d="M75,35 L76,39 L80,40 L76,41 L75,45 L74,41 L70,40 L74,39 Z"
          className="fill-luxury-gold/15 text-luxury-gold"
          strokeWidth="0.8"
        />
      </svg>

      <h3 className="font-serif text-xl sm:text-2xl text-luxury-brown mb-2 font-light">
        No Products Found
      </h3>
      <p className="text-sm text-luxury-gray font-light max-w-sm mb-8 leading-relaxed">
        We couldn't find any jewelry matching your exact filter selections. Try broadening your price range or clearing some attributes.
      </p>

      <button
        onClick={onReset}
        className="px-6 py-3 bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs tracking-widest uppercase font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none hover:-translate-y-0.5 active:translate-y-0"
      >
        Reset All Filters
      </button>
    </motion.div>
  );
};

export default EmptyState;
