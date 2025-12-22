import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import ImageCarousel from "../components/ImageCarousel";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import { fetchProducts, fetchCategories, setPage, setLimit } from "../store/slices/productSlice";

const HomePage = () => {
  const dispatch = useDispatch();

  const {
    products,
    selectedCategory,
    searchTerm,
    loading: productsLoading,
    error,
    currentPage,
    totalPages,
    totalProducts,
    limit: itemsPerPage
  } = useSelector((state) => state.products);

  // Fetch products whenever filters or pagination change
  useEffect(() => {
    dispatch(fetchProducts({
      page: currentPage,
      limit: itemsPerPage,
      category: selectedCategory,
      search: searchTerm
    }));
  }, [dispatch, currentPage, itemsPerPage, selectedCategory, searchTerm]);

  // Fetch categories once on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const changePage = (pageNum) => dispatch(setPage(pageNum));
  const handleLimitChange = (e) => dispatch(setLimit(Number(e.target.value)));

  // Error View
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>

          <button
            onClick={() => {
              dispatch(fetchProducts({ page: 1, limit: itemsPerPage }));
              dispatch(fetchCategories());
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // ----------------- Main UI -----------------
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Toaster position="top-center" reverseOrder={false} />
      <ImageCarousel />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
            <span className="text-gray-500 font-normal ml-2">
              ({totalProducts} items found)
            </span>
          </h3>

          {/* ⭐ Items Per Page Selector */}
          <select
            value={itemsPerPage}
            onChange={handleLimitChange}
            className="border px-3 py-2 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={30}>30 per page</option>
          </select>
        </div>

        <AnimatePresence mode="wait">
          {productsLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              {[...Array(itemsPerPage)].map((_, index) => (
                <div key={`skeleton-${index}`}>
                  <ProductSkeleton />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {!productsLoading && products.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or category filter
            </p>
          </div>
        )}

        {/* ⭐ Numbered Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">

            {/* Prev Button */}
            <button
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
              className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            >
              Prev
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;

              // Simple logic to show a window of pages
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <button
                    key={index}
                    onClick={() => changePage(pageNum)}
                    className={`min-w-[40px] px-3 py-2 border rounded transition-colors ${currentPage === pageNum
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              }

              if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                return <span key={index} className="text-gray-400">...</span>;
              }

              return null;
            })}

            {/* Next Button */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
              className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
