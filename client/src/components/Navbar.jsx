import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setSearchTerm, setSelectedCategory, fetchCategories } from '../store/slices/productSlice';
import { logout as logoutApi } from '../services/auth';
import { logout as logoutAction } from '../store/slices/authSlice';
import pluslogo from '../assets/pluslogo.png';

const Navbar = () => {
  const { searchTerm, categories, selectedCategory, categoriesLoading } = useSelector(state => state.products);
  const { totalQuantity } = useSelector(state => state.cart);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('header')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      dispatch(logoutAction());
      navigate('/login');
    }
  };

  const handleCategoryClick = (category) => {
    dispatch(setSelectedCategory(category));
    navigate('/');
  };

  // Icon for each category
  const getCategoryIcon = (category) => {
    const iconMap = {
      'All': '🏪',
      'beauty': '💄',
      'fragrances': '🌸',
      'furniture': '🪑',
      'groceries': '🛒',
      'Beauty': '💄',
      'Fragrances': '🌸',
      'Furniture': '🪑',
      'Groceries': '🛒',
      'electronics': '📱',
      'jewelery': '💎',
      "men's clothing": '👔',
      "women's clothing": '👗',
      'Electronics': '📱',
      'Jewelry': '💎',
      "Men's Fashion": '👔',
      "Women's Fashion": '👗',
      'Smartphones': '📱',
      'Laptops': '💻',
      'Cameras': '📷',
      'Headphones': '🎧',
      'Watches': '⌚',
      'Shoes': '👟',
      'Clothing': '👕',
    };
    return iconMap[category] || '📦';
  };

  return (
    <>
      {/* Header */}
      <header className="bg-[#2874f0] text-white shadow-md">
        <div className="container mx-auto px-4">

          {/* Main Header - Desktop */}
          <div className="hidden md:flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold mr-8 hover:text-blue-200">
                <img src={pluslogo} alt="Flipkart Plus Logo" className="h-16 w-18" />
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full px-2 py-2 bg-white border border-gray-200 text-gray-900 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button className="absolute right-0 top-0 h-full px-6 bg-white text-blue-600 rounded-r-sm flex items-center justify-center">
                  🔍
                </button>
              </div>
            </div>

            {/* User Login + Wishlist + Cart - Desktop */}
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <div className="relative group">
                  <button
                    className="flex items-center space-x-1 font-medium hover:text-blue-100 py-2 focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    <span>{user?.name || "User"}</span>
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 px-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Hello,</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                    </div>

                    <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-sm">
                      <span className="mr-2">📦</span> My Orders
                    </Link>

                    <Link to="/wishlist" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-sm">
                      <span className="mr-2">❤️</span> Wishlist
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-sm mt-1"
                    >
                      <span className="mr-2">🚪</span> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-[#2874f0] font-semibold px-8 py-1 rounded-sm border border-white hover:bg-transparent hover:text-white hover:border-white transition-colors"
                >
                  Login
                </Link>
              )}

              <Link to="/cart" className="flex items-center font-medium hover:text-blue-100 relative">
                <span className="relative">
                  🛒
                  {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#2874f0]">
                      {totalQuantity}
                    </span>
                  )}
                </span>
                <span className="ml-2 hidden lg:inline">Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden">
            {/* Logo */}
            <div className="flex items-center justify-center py-3">
              <Link to="/" className="hover:text-blue-200">
                <img src={pluslogo} alt="Flipkart Plus Logo" className="h-12 w-14" />
              </Link>
            </div>

            {/* Search Bar - Mobile */}
            <div className="pb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full px-3 py-2 bg-white border border-gray-200 text-gray-900 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-white text-blue-600 rounded-r-sm flex items-center justify-center">
                  🔍
                </button>
              </div>
            </div>

            {/* User Actions - Mobile */}
            <div className="flex items-center justify-between py-2 border-t border-blue-600">
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm">Hi, {user?.name || "user"}</span>
                    <Link to="/dashboard" className="text-sm font-medium hover:underline">
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="text-sm hover:underline">
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" style={{ color: "white" }} className="text-sm">Login</Link>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Link to="/wishlist" className="flex items-center space-x-1 hover:bg-blue-700 px-2 py-1 rounded">
                  <span>❤️</span>
                  <span className="text-xs">({wishlistItems.length})</span>
                </Link>
                <Link to="/cart" className="flex items-center space-x-1 hover:bg-blue-700 px-2 py-1 rounded">
                  <span>🛒</span>
                  <span className="text-xs">({totalQuantity})</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Navigation - Responsive */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 md:space-x-6 py-3 overflow-x-auto">
            {categoriesLoading && (
              <div className="text-gray-500 text-xs md:text-sm">Loading categories...</div>
            )}

            {!categoriesLoading && categories.length === 0 && (
              <div className="text-red-500 text-xs md:text-sm">No categories found</div>
            )}

            {/* Category buttons with responsive design */}
            {categories.slice(0, 5).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`flex flex-col items-center px-1 py-1 md:px-3 md:py-2 rounded transition-all duration-200 min-w-[50px] md:min-w-[80px] ${selectedCategory === category
                  ? "bg-[#2874f0] text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#2874f0]"
                  }`}
              >
                <span className="text-sm md:text-xl mb-1">
                  {getCategoryIcon(category)}
                </span>
                <span className="text-xs md:text-sm font-medium text-center">
                  {category.length > 8 ? category.substring(0, 8) + '...' : category}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
