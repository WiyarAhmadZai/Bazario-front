import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg border border-gray-700 animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-700"></div>
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-700 rounded mb-2"></div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
        
        {/* Price skeleton */}
        <div className="h-5 bg-gray-700 rounded w-1/3 mb-3"></div>
        
        {/* Button skeleton */}
        <div className="h-10 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

const ProductSkeletonGrid = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

export { ProductSkeleton, ProductSkeletonGrid };
