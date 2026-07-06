import React from "react";
import { useNavigate } from "react-router-dom";

const AddressesTab = ({ latestAddress }) => {
  const navigate = useNavigate();

  if (!latestAddress) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-[#E5E0D8] rounded-2xl bg-[#FCF9F5]/30 max-w-lg mx-auto animate-fade-in">
        <svg
          viewBox="0 0 100 100"
          className="w-24 h-24 stroke-current text-[#b88a44] fill-none stroke-[1.2] mb-6"
        >
          <path d="M50,20 C35,20 25,30 25,45 C25,65 50,85 50,85 C50,85 75,65 75,45 C75,30 65,20 50,20 Z" strokeLinejoin="round" />
          <circle cx="50" cy="45" r="10" />
        </svg>
        <h3 className="font-serif text-xl sm:text-2xl text-[#2E241C] mb-2 font-light">
          No Saved Addresses
        </h3>
        <p className="text-sm text-gray-500 font-light max-w-sm mb-8 leading-relaxed">
          You haven't saved any addresses yet. Your shipping address will be automatically saved here when you place an order.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-3 bg-[#b88a44] hover:bg-[#9e7435] text-white text-xs tracking-widest uppercase font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          Explore the Shop
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-serif text-brand-dark mb-6">Saved Addresses</h2>
      <p className="text-gray-600 mb-6 text-sm">
        The following address was used in your most recent order and will be suggested for future checkouts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-primary rounded-lg p-6 bg-[#FCF9F5]/20 relative hover:border-primary-hover transition-colors">
          <span className="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full">
            Last Used Shipping Address
          </span>
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-100 pb-2">Shipping Address</h3>
          <address className="not-italic text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-900">{latestAddress.fullName}</p>
            <p>{latestAddress.address}</p>
            <p>{latestAddress.city}, {latestAddress.postalCode}</p>
            <p>{latestAddress.country}</p>
            <p className="pt-2 text-xs text-gray-500">Mobile: {latestAddress.phone}</p>
          </address>
        </div>
      </div>
    </div>
  );
};

export default AddressesTab;
