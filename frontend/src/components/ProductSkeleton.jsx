import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden h-full">
      {/* Image Container Shimmer (Aspect Ratio 3/4) */}
      <div className="relative aspect-[3/4] w-full shimmer-bg rounded-lg" />

      {/* Details Container */}
      <div className="pt-3.5 pb-2 px-1 flex flex-col flex-grow">
        {/* Collection & Material Shimmer */}
        <div className="h-2.5 w-1/2 rounded-xs mb-2 shimmer-bg" />

        {/* Product Name Shimmer */}
        <div className="h-4 w-5/6 rounded-xs mb-3 shimmer-bg" />

        {/* Rating Shimmer */}
        <div className="flex items-center gap-1 mb-3">
          <div className="h-3 w-16 rounded-xs shimmer-bg" />
          <div className="h-3 w-8 rounded-xs shimmer-bg" />
        </div>

        {/* Price Shimmer */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4.5 w-14 rounded-xs shimmer-bg" />
          <div className="h-3.5 w-10 rounded-xs shimmer-bg" />
        </div>

        {/* Mobile Buttons Shimmer */}
        <div className="mt-auto pt-2 grid grid-cols-2 gap-2 md:hidden">
          <div className="h-8 rounded-md shimmer-bg" />
          <div className="h-8 rounded-md shimmer-bg" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
      {[...Array(count)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductSkeleton;
