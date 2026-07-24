import React from "react";
import toast from "react-hot-toast";

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

const OrderDetailsModal = ({ selectedOrder, onClose }) => {
  if (!selectedOrder) return null;

  const orderDate = selectedOrder.createdAt 
    ? new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : selectedOrder.date || "";

  return (
    <div className="fixed inset-0 bg-[#18140f]/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl font-serif text-brand-dark">Order {getPremiumId(selectedOrder.id || selectedOrder._id)}</h3>
            <p className="text-xs text-gray-500 mt-1">Placed on {orderDate}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg p-2"
          >
            ✕
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Status and Info Badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FAF9F6] p-4 rounded-lg border border-gray-100">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block mb-2">Order Status</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyle(selectedOrder.status)}`}>
                {selectedOrder.status}
              </span>
            </div>
            <div className="bg-[#FAF9F6] p-4 rounded-lg border border-gray-100">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block mb-2">Payment Status</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadgeStyle(selectedOrder.isPaid)}`}>
                {selectedOrder.isPaid === true || selectedOrder.isPaid === "Paid" ? "Paid" : "Pending"}
              </span>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white p-5 rounded-lg border border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Delivery Timeline</h4>
            <div className="relative border-l-2 border-[#E5E0D8] ml-3 pl-6 space-y-5">
              {selectedOrder.status === 'Cancelled' ? (
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px]">✕</span>
                  <h5 className="text-sm font-semibold text-red-600">Cancelled</h5>
                  <p className="text-xs text-gray-500 mt-0.5">The order was cancelled.</p>
                </div>
              ) : (
                <>
                  {/* Delivered */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${
                      ['delivered'].includes(String(selectedOrder.status).toLowerCase())
                        ? 'bg-[#287d4d] border-[#287d4d]'
                        : 'bg-white border-[#E5E0D8]'
                    }`}></span>
                    <h5 className={`text-sm font-semibold ${['delivered'].includes(String(selectedOrder.status).toLowerCase()) ? 'text-[#2E241C]' : 'text-gray-400'}`}>Delivered</h5>
                    <p className="text-xs text-gray-500 mt-0.5">Package was delivered to the customer.</p>
                  </div>

                  {/* Shipped */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${
                      ['delivered', 'shipped'].includes(String(selectedOrder.status).toLowerCase())
                        ? 'bg-[#b88a44] border-[#b88a44]'
                        : 'bg-white border-[#E5E0D8]'
                    }`}></span>
                    <h5 className={`text-sm font-semibold ${['delivered', 'shipped'].includes(String(selectedOrder.status).toLowerCase()) ? 'text-[#2E241C]' : 'text-gray-400'}`}>Shipped</h5>
                    <p className="text-xs text-gray-500 mt-0.5">Package is in transit with the courier.</p>
                  </div>

                  {/* Processing / Packed */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${
                      ['delivered', 'shipped', 'packed', 'processing'].includes(String(selectedOrder.status).toLowerCase())
                        ? 'bg-[#b88a44] border-[#b88a44]'
                        : 'bg-white border-[#E5E0D8]'
                    }`}></span>
                    <h5 className={`text-sm font-semibold ${['delivered', 'shipped', 'packed', 'processing'].includes(String(selectedOrder.status).toLowerCase()) ? 'text-[#2E241C]' : 'text-gray-400'}`}>Processing & Packed</h5>
                    <p className="text-xs text-gray-500 mt-0.5">Order is packed and ready for dispatch.</p>
                  </div>

                  {/* Pending */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#b88a44] border-2 border-[#b88a44]"></span>
                    <h5 className="text-sm font-semibold text-[#2E241C]">Pending / Confirmed</h5>
                    <p className="text-xs text-gray-500 mt-0.5">Order received and waiting processing.</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <div className="bg-[#FAF9F6] p-4 border-b border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Items in Order</h4>
            </div>
            <div className="divide-y divide-gray-100">
              {(selectedOrder.orderItems || selectedOrder.products || []).map((product, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded border border-gray-100 shrink-0"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Quantity: {product.quantity}
                        {product.selectedSize ? ` | Size: ${product.selectedSize}` : ""}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-brand-dark text-sm">
                    {typeof product.price === 'number' ? `₹${product.price.toLocaleString("en-IN")}` : product.price}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipment Tracking Section */}
          <div className="bg-white p-5 rounded-lg border border-gray-100">
            <h4 className="text-xs font-bold text-[#b88a44] uppercase tracking-wider mb-3">Shipment Tracking</h4>
            {selectedOrder.tracking ? (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#FAF9F6] p-4 rounded border border-gray-100 text-sm gap-3">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block">AWB / Tracking Number</span>
                  <span className="font-semibold text-[#2E241C] text-base">{selectedOrder.tracking}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block">Shipment Status</span>
                  <span className="font-medium text-[#2E241C]">{selectedOrder.status}</span>
                </div>
                <button 
                  onClick={() => toast.success(`Shipment tracking active. Status: ${selectedOrder.status}`, {
                    style: {
                      background: "#2E241C",
                      color: "#FCF9F5",
                      fontFamily: "Outfit, sans-serif",
                      borderRadius: "8px",
                    }
                  })}
                  className="bg-[#b88a44] hover:bg-[#9e7435] text-white text-xs px-4 py-2 rounded transition-colors cursor-pointer shadow-sm"
                >
                  Track Package
                </button>
              </div>
            ) : (
              <div className="bg-[#FAF9F6] p-4 rounded border border-gray-100 text-sm text-gray-500 italic">
                Tracking information will be available once your order has been shipped.
              </div>
            )}
          </div>

          {/* Shipping Address and Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-lg border border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Shipping Address</h4>
              <address className="not-italic text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{selectedOrder.shippingAddress?.fullName}</p>
                <p>{selectedOrder.shippingAddress?.address}</p>
                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                <p>{selectedOrder.shippingAddress?.country}</p>
                <p className="pt-1 text-xs">Phone: {selectedOrder.shippingAddress?.phone}</p>
              </address>
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Payment Information</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-medium text-gray-900">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium text-gray-900">
                    {selectedOrder.isPaid === true || selectedOrder.isPaid === "Paid" ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Cost Summary */}
          <div className="bg-[#FAF9F6] p-5 rounded-lg border border-gray-100 text-sm space-y-2.5">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>₹{selectedOrder.itemsPrice?.toLocaleString("en-IN") || "0"}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>{selectedOrder.shippingPrice > 0 ? `₹${selectedOrder.shippingPrice.toLocaleString("en-IN")}` : "Free"}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax</span>
              <span>₹{selectedOrder.taxPrice?.toLocaleString("en-IN") || "0"}</span>
            </div>
            <div className="border-t border-gray-200 my-2 pt-2.5 flex justify-between font-bold text-base text-brand-dark">
              <span>Grand Total</span>
              <span className="text-primary">
                ₹{selectedOrder.totalPrice?.toLocaleString("en-IN") || selectedOrder.total || "0"}
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-brand-dark hover:bg-black text-white text-xs tracking-widest uppercase font-medium px-6 py-2.5 rounded transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsModal;
