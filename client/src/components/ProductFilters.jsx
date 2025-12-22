import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPriceRange, setMinimumRating, clearFilters, fetchProducts } from "../store/slices/productSlice";

const ProductFilters = () => {
    const dispatch = useDispatch();
    const { minPrice, maxPrice, minRating } = useSelector((state) => state.products);

    // Local state for inputs to avoid API calls on every keystroke
    const [localMinPrice, setLocalMinPrice] = useState(minPrice);
    const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

    // Sync local state with Redux state (in case filters are cleared externally)
    useEffect(() => {
        setLocalMinPrice(minPrice);
        setLocalMaxPrice(maxPrice);
    }, [minPrice, maxPrice]);

    const handleApplyPrice = () => {
        dispatch(setPriceRange({ min: localMinPrice, max: localMaxPrice }));
        // Trigger fetch is handled by useEffect in HomePage or we can dispatch here if preferred,
        // but HomePage usually listens to state changes.
        // However, since we added explicit dependency in HomePage on 'minPrice'/'maxPrice' in the Slice,
        // we need to make sure HomePage includes them in its useEffect dependency array.
    };

    const handleRatingClick = (rating) => {
        // Toggle: if clicking the same rating, clear it? Or just set it.
        // Let's just set it.
        dispatch(setMinimumRating(rating === minRating ? 0 : rating));
    };

    const handleClear = () => {
        dispatch(clearFilters());
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-800">Filters</h3>
                <button
                    onClick={handleClear}
                    className="text-xs text-blue-600 hover:text-blue-800 uppercase font-medium"
                >
                    Clear All
                </button>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={localMinPrice}
                        onChange={(e) => setLocalMinPrice(e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                </div>
                <button
                    onClick={handleApplyPrice}
                    className="w-full bg-white border border-blue-600 text-blue-600 text-sm font-medium py-1 rounded hover:bg-blue-50 transition-colors"
                >
                    Apply
                </button>
            </div>

            {/* Rating Filter */}
            <div className="mb-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Ratings</h4>
                <div className="space-y-2">
                    {[4, 3, 2, 1].map((star) => (
                        <label key={star} className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={minRating === star}
                                onChange={() => handleRatingClick(star)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 flex items-center">
                                {star}⭐ & above
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
