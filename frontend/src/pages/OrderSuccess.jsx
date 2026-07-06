import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const OrderSuccess = () => {
  // Generate a random order number for display purposes
  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8 text-center flex flex-col items-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-500">
        <FiCheckCircle size={48} />
      </div>
      
      <h1 className="mb-4 text-4xl font-serif tracking-tight text-brand-dark sm:text-5xl">Order Successful!</h1>
      <p className="text-lg text-gray-600 mb-2">Thank you for shopping with Ariya.</p>
      <p className="text-gray-500 mb-8">Your order number is <span className="font-bold text-gray-900">#{orderNumber}</span>. We've sent a confirmation email to you.</p>

      <div className="bg-gray-50 rounded-lg p-6 w-full max-w-md mb-8">
        <h3 className="font-medium text-gray-900 mb-2">What's next?</h3>
        <p className="text-sm text-gray-600">
          Your order is now being processed. You will receive an email with tracking information once your items have shipped.
        </p>
      </div>

      <Link
        to="/shop"
        className="rounded-none bg-primary px-8 py-3 font-medium text-white transition hover:bg-primary-hover uppercase tracking-wider text-sm cursor-pointer"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;
