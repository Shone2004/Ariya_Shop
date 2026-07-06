import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderDetailsModal from "./OrderDetailsModal";

const getPremiumId = (id) => {
  if (!id) return "";
  const cleanId = id.replace("#", "");
  if (cleanId.length >= 8) {
    return `ARI-${cleanId.substring(cleanId.length - 8).toUpperCase()}`;
  }
  return `ARI-${cleanId.toUpperCase()}`;
};

const getStatusBadgeStyle = (status) => {
  const norm = String(status || "").toLowerCase();
  switch (norm) {
    case "pending":
      return "bg-amber-50 text-amber-700 border border-amber-100";
    case "processing":
      return "bg-blue-50 text-blue-700 border border-blue-100";
    case "packed":
      return "bg-purple-50 text-purple-700 border border-purple-100";
    case "shipped":
      return "bg-indigo-50 text-indigo-700 border border-indigo-100";
    case "delivered":
      return "bg-green-50 text-green-700 border border-green-100";
    case "cancelled":
      return "bg-red-50 text-red-700 border border-red-100";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-100";
  }
};

const getPaymentBadgeStyle = (isPaid) => {
  if (isPaid === true || isPaid === "Paid") {
    return "bg-green-50 text-green-700 border border-green-100";
  } else if (isPaid === "Failed") {
    return "bg-red-50 text-red-700 border border-red-100";
  } else {
    return "bg-amber-50 text-amber-700 border border-amber-100";
  }
};

const OrdersTab = ({ orders, loading, error, onRetry }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-gray-50/50 border border-gray-100 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-28"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-20 self-end md:self-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 px-4 bg-red-50/30 border border-red-100 rounded-xl max-w-md mx-auto animate-fade-in">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-brand-dark mb-2">Failed to Load Orders</h3>
        <p className="text-sm text-gray-500 mb-6">{error}</p>
        <button 
          onClick={onRetry} 
          className="bg-brand-dark hover:bg-black text-white text-sm font-medium uppercase tracking-wider px-6 py-2.5 rounded-md transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-[#E5E0D8] rounded-2xl bg-[#FCF9F5]/30 max-w-lg mx-auto animate-fade-in">
        <svg
          viewBox="0 0 100 100"
          className="w-24 h-24 stroke-current text-[#b88a44] fill-none stroke-[1.2] mb-6"
        >
          <path d="M30,30 L70,30 L75,75 L25,75 Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M40,30 C40,20 60,20 60,30" strokeLinecap="round" />
          <path d="M45,45 L55,45 M50,40 L50,50" strokeWidth="1" strokeLinecap="round" />
        </svg>
        <h3 className="font-serif text-xl sm:text-2xl text-[#2E241C] mb-2 font-light">
          You haven't placed any orders yet.
        </h3>
        <p className="text-sm text-gray-500 font-light max-w-sm mb-8 leading-relaxed">
          Discover our exquisite collections and find the perfect pieces crafted just for you.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-3 bg-[#b88a44] hover:bg-[#9e7435] text-white text-xs tracking-widest uppercase font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-serif text-brand-dark mb-6">Order History</h2>
      
      <div className="space-y-4">
        {orders.map((order) => {
          const itemsCount = (order.orderItems || order.products || []).reduce((acc, curr) => acc + (curr.quantity || 1), 0);
          const orderDate = order.createdAt 
            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : order.date || "";

          return (
            <div 
              key={order.id || order._id}
              className="bg-white border border-gray-100 rounded-xl p-6 transition-all hover:shadow-lg hover:border-primary/30 flex flex-col md:grid md:grid-cols-5 gap-6 items-start md:items-center"
            >
              {/* Column 1: ORDER */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">ORDER</span>
                <span className="text-sm font-semibold text-brand-dark block">{getPremiumId(order.id || order._id)}</span>
                <span className="text-xs text-gray-500 block">{orderDate}</span>
              </div>

              {/* Column 2: ORDER STATUS */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">ORDER STATUS</span>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Column 3: PAYMENT */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">PAYMENT</span>
                <div className="space-y-1">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPaymentBadgeStyle(order.isPaid)}`}>
                      {order.isPaid === true || order.isPaid === "Paid" ? "Paid" : "Pending"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 block">{order.paymentMethod}</span>
                </div>
              </div>

              {/* Column 4: TOTAL */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">TOTAL</span>
                <span className="text-base font-bold text-brand-dark block">
                  ₹{(order.totalPrice || order.total || 0).toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-gray-500 block">{itemsCount} item(s)</span>
              </div>

              {/* Column 5: ACTION */}
              <div className="w-full md:w-auto flex justify-start md:justify-end self-stretch md:self-auto pt-2 md:pt-0">
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="w-full md:w-auto bg-primary hover:bg-[#9e7435] text-white text-xs tracking-widest uppercase font-semibold px-6 py-2.5 rounded transition-all cursor-pointer shadow-sm hover:shadow text-center"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <OrderDetailsModal 
        selectedOrder={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
};

export default OrdersTab;
