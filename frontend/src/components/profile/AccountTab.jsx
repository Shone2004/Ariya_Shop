import React, { useState } from "react";
import { useWishlist } from "../../hooks/useWishlist";

const AccountTab = ({ user, profile, ordersCount }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { wishlist } = useWishlist();

  const formattedCreatedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-10">
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif text-brand-dark">Account Details</h2>
          
        </div>
        
        {!isEditing ? (
          <div className="space-y-6 bg-gray-50/50 p-6 rounded-lg border border-gray-100">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider text-[11px]">Full Name</h3>
              <p className="text-gray-900 font-medium">{user?.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider text-[11px]">Email Address</h3>
              <p className="text-gray-900 font-medium">{user?.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider text-[11px]">Account Created Date</h3>
              <p className="text-gray-900 font-medium">{formattedCreatedDate}</p>
            </div>
         
          </div>
        ) : (
          <form className="space-y-5 bg-white">
            <div>
              <label className="block text-sm text-[#555] mb-1">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-[#555] mb-1">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                defaultValue={user?.email}
                disabled
                className="w-full border border-gray-200 bg-gray-50 rounded-md px-4 py-2.5 text-sm cursor-not-allowed text-gray-500"
              />
            </div>

            

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-primary hover:bg-primary-hover text-white text-sm font-medium uppercase tracking-wider px-8 py-3 transition-colors cursor-pointer rounded-md shadow-sm"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium uppercase tracking-wider px-8 py-3 transition-colors cursor-pointer rounded-md shadow-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="w-full lg:w-64 shrink-0 pt-0 lg:pt-14">
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:border-primary/30 transition-colors">
            <span className="text-3xl font-bold text-brand-dark mb-2">{ordersCount}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium text-center">Total Orders</span>
          </div>
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:border-primary/30 transition-colors">
            <span className="text-3xl font-bold text-brand-dark mb-2">{wishlist.length}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium text-center">Wishlisted Items</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTab;
