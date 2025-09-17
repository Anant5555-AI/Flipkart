import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import Banner from '../components/Banner';
import ImageCarousel from '../components/ImageCarousel';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCategories } from '../store/slices/productSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const { filteredProducts, selectedCategory, productsLoading, error } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  
  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <Banner /> */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Products...</h3>
              <p className="text-gray-500">Fetching the latest products from our catalog</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <Banner /> */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button 
              onClick={() => {
                dispatch(fetchProducts());
                dispatch(fetchCategories());
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Banner /> */}
      <ImageCarousel />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Results header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            <span className="text-gray-500 font-normal ml-2">({filteredProducts.length} items)</span>
          </h3>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No results */}
        {filteredProducts.length === 0 && !productsLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or browse different categories</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;