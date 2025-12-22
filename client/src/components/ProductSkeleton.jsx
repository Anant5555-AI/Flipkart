import React from 'react';

const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
