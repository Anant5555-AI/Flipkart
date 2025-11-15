import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ImageCarousel from "../components/ImageCarousel";
import ProductCard from "../components/ProductCard";
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

  // Loading View
  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Loading Products...
              </h3>
              <p className="text-gray-500">
                Fetching the latest products from our catalog
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error View
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
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
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------- Main UI -----------------
  return (
    <div className="min-h-screen bg-gray-50">
      <ImageCarousel />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
            <span className="text-gray-500 font-normal ml-2">
              ({filteredProducts.length} items)
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

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No Results */}
        {currentProducts.length === 0 && (
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
                    className={`px-4 py-2 border rounded ${
                      currentPage === pageNum
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
