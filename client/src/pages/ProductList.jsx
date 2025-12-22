import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import {
  fetchProducts,
  setSelectedCategory,
  setSearchTerm
} from "../store/slices/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();

  const {
    products,
    loading,
    selectedCategory,
    searchTerm
  } = useSelector((state) => state.products);

  // ---------- Frontend Pagination State ----------
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Show 12 per page

  // Fetch all products once
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Reset to page 1 when searching or changing category
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // ---------- Apply Filtering ----------
  const filtered = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // ---------- Frontend Pagination Logic ----------
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filtered.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const changePage = (pageNum) => setCurrentPage(pageNum);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <h1 className="text-2xl font-bold mb-4">
          {searchTerm
            ? `Search for "${searchTerm}"`
            : selectedCategory === "All"
            ? "All Products"
            : selectedCategory}
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          className="border px-4 py-2 rounded w-full mb-4"
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        />

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
          className="border px-4 py-2 rounded mb-6"
        >
          <option value="All">All</option>
          <option value="electronics">Electronics</option>
          <option value="jewelery">Jewelery</option>
          <option value="men's clothing">Men's Fashion</option>
          <option value="women's clothing">Women's Fashion</option>
        </select>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Loader */}
        {loading && (
          <div className="text-center py-6 text-gray-600">Loading...</div>
        )}

        {/* No results */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            No products found
          </div>
        )}

        {/* ---------- Numbered Pagination ---------- */}
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

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;

              // Show only pages around current
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <button
                    key={i}
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

              // Ellipsis
              if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                return <span key={i}>...</span>;
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
      </div>
    </div>
  );
};

export default ProductList;
