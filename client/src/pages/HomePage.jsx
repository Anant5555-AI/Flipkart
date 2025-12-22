import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import ImageCarousel from "../components/ImageCarousel";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import { fetchProducts, fetchCategories } from "../store/slices/productSlice";

const HomePage = () => {
  const dispatch = useDispatch();

  const {
    products,
    selectedCategory,
    searchTerm,
    loading: productsLoading,
    error,
  } = useSelector((state) => state.products);

  // ---------- Frontend Pagination ----------
  const [currentPage, setCurrentPage] = useState(1);

  // ⭐ Items per page dropdown (10–10 select)
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Reset page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // ---------- Apply Filtering ----------
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // ---------- Pagination Logic ----------
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const changePage = (pageNum) => setCurrentPage(pageNum);

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
              dispatch(fetchProducts());
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
              ({startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} items)
            </span>
          </h3>

          {/* ⭐ Items Per Page Selector */}
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // reset page
            }}
            className="border px-3 py-2 rounded text-gray-700"
          >
            <option value={10}>10 </option>
            <option value={20}>20 </option>
            <option value={30}>30 </option>

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
              {[...Array(12)].map((_, index) => (
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
              {currentProducts.map((product) => (
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
        {!productsLoading && currentProducts.length === 0 && (
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
              className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:bg-gray-200"
            >
              Prev
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;

              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <button
                    key={index}
                    onClick={() => changePage(pageNum)}
                    className={`px-4 py-2 border rounded ${currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-gray-100"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              }

              if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                return <span key={index}>...</span>;
              }

              return null;
            })}

            {/* Next Button */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
              className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:bg-gray-200"
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
