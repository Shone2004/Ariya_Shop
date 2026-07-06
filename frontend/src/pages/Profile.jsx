import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiShoppingBag, FiMapPin, FiLogOut, FiHelpCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";

// Import modular components
import AccountTab from "../components/profile/AccountTab";
import OrdersTab from "../components/profile/OrdersTab";
import AddressesTab from "../components/profile/AddressesTab";
import SupportTab from "../components/profile/SupportTab";

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const navigate = useNavigate();

  // Profile data states
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  // Fetch user profile from backend (only fetch data that is not in AuthContext, like createdAt)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient("/auth/profile");
        const json = await res.json();
        if (json.success && json.data) {
          setProfile(json.data);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchProfile();
  }, []);

  // Fetch user orders from backend
  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await apiClient("/orders/my-orders");
      const json = await res.json();
      if (res.ok) {
        setOrders(json);
      } else {
        setOrdersError(json.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("Error fetching customer orders:", err);
      setOrdersError("Network error. Please check your connection.");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const tabs = [
    { id: "account", label: "Account Details", icon: <FiUser className="w-5 h-5" /> },
    { id: "orders", label: "Orders", icon: <FiShoppingBag className="w-5 h-5" /> },
    { id: "addresses", label: "Addresses", icon: <FiMapPin className="w-5 h-5" /> },
    { id: "support", label: "Support", icon: <FiHelpCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-serif text-brand-dark mb-2">My Account</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">
              <nav className="flex flex-col">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-2 ${
                      activeTab === tab.id
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-l-2 border-transparent"
                >
                  <FiLogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            {activeTab === "account" && (
              <AccountTab 
                user={user} 
                profile={profile} 
                ordersCount={orders?.length || 0} 
              />
            )}
            {activeTab === "orders" && (
              <OrdersTab 
                orders={orders} 
                loading={ordersLoading} 
                error={ordersError} 
                onRetry={fetchOrders} 
              />
            )}
            {activeTab === "addresses" && (
              <AddressesTab 
                latestAddress={orders?.find(o => o.shippingAddress && o.shippingAddress.fullName)?.shippingAddress} 
              />
            )}
            {activeTab === "support" && (
              <SupportTab />
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
