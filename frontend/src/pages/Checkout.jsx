import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import toast from "react-hot-toast";
import { FiCreditCard, FiTruck, FiCheckCircle, FiEdit2, FiTag } from "react-icons/fi";
import apiClient from "../utils/apiClient";

// Utility to load script dynamically
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cart: cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const hasOutOfStockItems = cartItems.some(item => item.stockCount === 0 || item.quantity > item.stockCount);
  
  // Accordion Step State
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({ 1: false, 2: false, 3: false });
  
  // Form States
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zipCode: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "ARIYA10") {
      setDiscount(0.1); // 10% discount
      toast.success("Coupon ARIYA10 applied!");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon code.");
    }
  };

  // Load Razorpay Script on Mount
  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  // If cart is empty, redirect or show message
  if (cartItems.length === 0 && !isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="mb-4 text-2xl font-medium text-gray-900">Your cart is empty</h2>
        <button
          onClick={() => navigate("/shop")}
          className="bg-primary px-8 py-3 font-medium text-white transition hover:bg-primary-hover uppercase tracking-wider text-sm cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const shipping = 0;
  const total = subtotalAfterDiscount + shipping;

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setCompletedSteps(prev => ({ ...prev, 1: true }));
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setCompletedSteps(prev => ({ ...prev, 2: true }));
    setCurrentStep(3);
  };

  const handleEditStep = (step) => {
    setCurrentStep(step);
  };

  const placeOrder = async () => {
   

    try {
      setIsProcessing(true);
      
      // 1. Create Order on Backend
      const orderRes = await apiClient("/orders/create", {
        method: "POST",
        body: JSON.stringify({
    paymentMethod,
    user: {
        name: shippingAddress.fullName,
        email: shippingAddress.email
    },
          orderItems: cartItems.map(item => ({
            productId: item.id || item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || (item.images && item.images[0]) || ""
          })),
          shippingAddress: {
            fullName: shippingAddress.fullName,
            address: shippingAddress.street,
            city: shippingAddress.city,
            postalCode: shippingAddress.zipCode,
            country: "India",
            phone: shippingAddress.phone
          },
          itemsPrice: subtotal,
          taxPrice: 0,
          shippingPrice: shipping,
          totalPrice: total
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.message || "Failed to create order");
      }

      if (paymentMethod === "cod") {
    toast.success("Order placed successfully!");

    clearCart();
    setIsProcessing(false);
    navigate("/order-success");

    return;
}

      // 2. Load Razorpay Script
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      // 3. Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Ariya Shop",
        description: "Jewelry Purchase",
        image: "/Ariya.png",
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          try {
            toast.loading("Verifying payment...", { id: "payment-verify" });
            
            // 4. Verify Payment on Backend
            const verifyRes = await apiClient("/orders/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.order._id
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              toast.success("Payment Successful!", { id: "payment-verify" });
              clearCart();
              navigate("/order-success");
            } else {
              toast.error(verifyData.message || "Payment verification failed", { id: "payment-verify" });
            }
          } catch (error) {
            console.error("Verification Error:", error);
            toast.error("An error occurred during verification", { id: "payment-verify" });
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: shippingAddress.email,
          contact: shippingAddress.phone,
        },
        notes: {
          address: `${shippingAddress.street}, ${shippingAddress.city}`,
        },
        theme: {
          color: "#2E241C", 
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response){
        toast.error(response.error.description || "Payment failed!");
      });

      // Reset button state since Razorpay handles its own UI now
      setIsProcessing(false);

    } catch (error) {
      console.error("Order Error:", error);
      toast.error(error.message || "Something went wrong creating your order");
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-4xl font-serif tracking-tight text-brand-dark sm:text-5xl">Checkout</h1>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Accordion Area */}
        <div className="flex-1 space-y-6">
          
          {/* Step 1: Shipping Address */}
          <div className={`rounded-xl border ${currentStep === 1 ? 'border-brand-dark ring-1 ring-brand-dark shadow-md' : 'border-gray-200 shadow-sm'} bg-white overflow-hidden transition-all`}>
            <div className={`px-6 py-4 flex items-center justify-between ${currentStep === 1 ? 'bg-gray-50 border-b border-gray-200' : ''}`}>
              <h2 className={`flex items-center text-xl font-serif ${currentStep === 1 ? 'text-brand-dark' : (completedSteps[1] ? 'text-gray-900' : 'text-gray-400')}`}>
                <span className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${currentStep === 1 ? 'bg-brand-dark text-white' : (completedSteps[1] ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500')}`}>
                  {completedSteps[1] && currentStep !== 1 ? <FiCheckCircle size={16} /> : '1'}
                </span> 
                Delivery Address
              </h2>
              {completedSteps[1] && currentStep !== 1 && (
                <button onClick={() => handleEditStep(1)} className="text-primary hover:text-primary-hover text-sm font-medium flex items-center gap-1 cursor-pointer">
                  <FiEdit2 size={14} /> Change
                </button>
              )}
            </div>

            {currentStep === 1 ? (
              <div className="p-6 sm:p-8 border-t border-gray-200">
                <form id="address-form" onSubmit={handleAddressSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="col-span-1 sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                      <input required type="text" name="fullName" value={shippingAddress.fullName} onChange={handleAddressChange} className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark" />
                    </div>
                    <div className="col-span-1">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                      <input required type="email" name="email" value={shippingAddress.email} onChange={handleAddressChange} className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark" />
                    </div>
                    <div className="col-span-1">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                      <input required type="tel" name="phone" value={shippingAddress.phone} onChange={handleAddressChange} className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark" />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Street Address</label>
                      <input required type="text" name="street" value={shippingAddress.street} onChange={handleAddressChange} className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark" />
                    </div>
                    <div className="col-span-1">
                      <label className="mb-2 block text-sm font-medium text-gray-700">State</label>
                      <input required type="text" name="city" value={shippingAddress.city} onChange={handleAddressChange} placeholder="State" className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark" />
                    </div>
                    <div className="col-span-1">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Postal Code</label>
                      <input required type="text" name="zipCode" value={shippingAddress.zipCode} onChange={handleAddressChange} className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark" />
                    </div>
                  </div>
                  <div className="mt-8">
                    <button type="submit" className="rounded-none bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover uppercase tracking-wider cursor-pointer">
                      Use this address
                    </button>
                  </div>
                </form>
              </div>
            ) : completedSteps[1] ? (
              <div className="px-6 py-4 sm:px-14 sm:py-6 text-sm text-gray-600">
                <p className="font-medium text-gray-900">{shippingAddress.fullName}</p>
                <p>{shippingAddress.street}</p>
                <p>{shippingAddress.city}, {shippingAddress.zipCode}</p>
                <p className="mt-1">{shippingAddress.phone}</p>
              </div>
            ) : null}
          </div>

          {/* Step 2: Payment Method */}
          <div className={`rounded-xl border ${currentStep === 2 ? 'border-brand-dark ring-1 ring-brand-dark shadow-md' : 'border-gray-200 shadow-sm'} bg-white overflow-hidden transition-all`}>
            <div className={`px-6 py-4 flex items-center justify-between ${currentStep === 2 ? 'bg-gray-50 border-b border-gray-200' : ''}`}>
              <h2 className={`flex items-center text-xl font-serif ${currentStep === 2 ? 'text-brand-dark' : (completedSteps[2] ? 'text-gray-900' : 'text-gray-400')}`}>
                <span className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${currentStep === 2 ? 'bg-brand-dark text-white' : (completedSteps[2] ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500')}`}>
                  {completedSteps[2] && currentStep !== 2 ? <FiCheckCircle size={16} /> : '2'}
                </span> 
                Payment Method
              </h2>
              {completedSteps[2] && currentStep !== 2 && (
                <button onClick={() => handleEditStep(2)} className="text-primary hover:text-primary-hover text-sm font-medium flex items-center gap-1 cursor-pointer">
                  <FiEdit2 size={14} /> Change
                </button>
              )}
            </div>

            {currentStep === 2 ? (
              <div className="p-6 sm:p-8 border-t border-gray-200">
                <form id="payment-form" onSubmit={handlePaymentSubmit}>
                  <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <label className={`flex-1 cursor-pointer rounded-lg border p-4 text-center ${paymentMethod === 'razorpay' ? 'border-brand-dark bg-blue-50/50' : 'border-gray-200'}`}>
                      <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="sr-only" />
                      <span className="text-sm font-medium flex flex-col items-center gap-2">
                        <FiCreditCard size={20} className={paymentMethod === 'razorpay' ? 'text-brand-dark' : 'text-gray-400'} />
                        Pay Online (Razorpay)
                      </span>
                    </label>
                    <label className={`flex-1 cursor-pointer rounded-lg border p-4 text-center ${paymentMethod === 'cod' ? 'border-brand-dark bg-blue-50/50' : 'border-gray-200'}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="sr-only" />
                      <span className="text-sm font-medium flex flex-col items-center gap-2">
                        <FiTruck size={20} className={paymentMethod === 'cod' ? 'text-brand-dark' : 'text-gray-400'} />
                        Cash on Delivery
                      </span>
                    </label>
                  </div>

                  <div className="mt-6 mb-8">
                    {paymentMethod === 'razorpay' && (
                      <div className="rounded-lg bg-gray-50 p-6 text-sm text-gray-600 border border-gray-200 animate-fadeIn h-full flex flex-col justify-center">
                        <p className="font-medium text-gray-800 mb-2">Secure Online Payment</p>
                        <p>You will be securely redirected to Razorpay to complete your payment using Credit/Debit Cards, UPI, Netbanking, or Wallets.</p>
                      </div>
                    )}

                    {paymentMethod === 'cod' && (
                      <div className="rounded-lg bg-gray-50 p-6 text-sm text-gray-600 border border-gray-200 animate-fadeIn h-full flex items-center">
                        <FiTruck className="mr-3 text-primary text-xl" />
                        You can pay in cash to our courier when you receive the goods at your doorstep.
                      </div>
                    )}
                  </div>

                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <button type="submit" className="rounded-none bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover uppercase tracking-wider cursor-pointer">
                      Use this payment method
                    </button>
                  </div>
                </form>
              </div>
            ) : completedSteps[2] ? (
              <div className="px-6 py-4 sm:px-14 sm:py-6 text-sm text-gray-600 flex items-center gap-2">
                {paymentMethod === 'razorpay' ? <FiCreditCard className="text-gray-500" size={20} /> : <FiTruck className="text-gray-500" size={20} />}
                <span className="font-medium text-gray-900">
                  {paymentMethod === 'razorpay' ? 'Pay Online (Razorpay)' : 'Cash on Delivery'}
                </span>
              </div>
            ) : null}
          </div>

          {/* Step 3: Items and Delivery */}
          <div className={`rounded-xl border ${currentStep === 3 ? 'border-brand-dark ring-1 ring-brand-dark shadow-md' : 'border-gray-200 shadow-sm'} bg-white overflow-hidden transition-all`}>
            <div className={`px-6 py-4 flex items-center bg-gray-50 ${currentStep === 3 ? 'border-b border-gray-200' : ''}`}>
              <h2 className={`flex items-center text-xl font-serif ${currentStep === 3 ? 'text-brand-dark' : 'text-gray-400'}`}>
                <span className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${currentStep === 3 ? 'bg-brand-dark text-white' : 'bg-gray-200 text-gray-500'}`}>
                  3
                </span> 
                Items and Delivery
              </h2>
            </div>

            {currentStep === 3 && (
              <div className="p-6 sm:p-8 border-t border-gray-200">
                <div className="mb-6 rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-brand-dark mb-4 border-b border-gray-100 pb-2">Delivery expected within 3-5 business days</h3>
                  <ul className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <li key={item.id} className="py-4 flex items-center gap-4">
                        <img src={item.image || item.image_url} alt={item.name} className="w-16 h-16 rounded object-cover border border-gray-100" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-sm text-gray-700">
                  <p>Please review your order.<br/> By clicking "Place Order" in the order summary, you agree to Ariya Shop's <Link to="/privacy-policy" className="text-primary hover:underline font-medium">privacy policy</Link>.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Right Pane */}
        <div className="w-full lg:w-96">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-serif text-brand-dark mb-6">Order Summary</h2>
            
            <dl className="space-y-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center justify-between">
                <dt>Items ({cartItems.length})</dt>
                <dd className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <dt>Discount (10%)</dt>
                  <dd className="font-medium">-₹{discountAmount.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt>Delivery</dt>
                <dd className="font-medium text-gray-900">
                  {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                </dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-xl font-bold text-brand-dark">
                <dt>Order Total</dt>
                <dd className="text-primary">₹{total.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mb-6">
              <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
                <FiTag className="mr-2" /> Have a coupon?
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. ARIYA10)" 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark uppercase"
                />
                <button 
                  type="button" 
                  onClick={handleApplyCoupon}
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            <button 
              type="button" 
              onClick={placeOrder}
              disabled={isProcessing || hasOutOfStockItems || currentStep !== 3}
              className={`flex w-full items-center justify-center gap-2 rounded-none px-6 py-4 text-sm font-medium text-white shadow-sm transition uppercase tracking-wider w-full ${
                  hasOutOfStockItems
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isProcessing 
                      ? 'bg-primary opacity-70 cursor-wait' 
                      : currentStep !== 3 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary-hover cursor-pointer'
              }`}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : hasOutOfStockItems ? (
                <>Stock Issue - Cannot Place Order</>
              ) : (
                <>
                  <FiCheckCircle size={18} /> Place Your Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
