import React, { useEffect } from 'react';
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

  // Fetch categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

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

          {/* Main Header */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold mr-8 hover:text-blue-200">
                <img src={pluslogo} alt="Flipkart Plus Logo" className="h-16 w-18" />
              </Link>
            </div>

            {/* Search Bar */}
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

            {/* User Login + Wishlist + Cart */}
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span>Hi, {user?.name || "user"}</span>
                  <button onClick={handleLogout} className="hover:underline">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" style={{ color: "white" }}>Login</Link>
              )}

              <Link to="/wishlist" className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded">
                <span>❤️</span>
                <span>Wishlist ({wishlistItems.length})</span>
              </Link>

              <Link to="/cart" className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded">
                <span>🛒</span>
                <span>Cart ({totalQuantity})</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-6 py-3 overflow-x-auto">
            {categoriesLoading && (
              <div className="text-gray-500 text-sm">Loading categories...</div>
            )}

            {!categoriesLoading && categories.length === 0 && (
              <div className="text-red-500 text-sm">No categories found</div>
            )}

            {/* Category buttons with Flipkart-style design */}
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`flex flex-col items-center px-3 py-2 rounded transition-all duration-200 min-w-[80px] ${
                  selectedCategory === category
                    ? "bg-[#2874f0] text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#2874f0]"
                }`}
              >
                <span className="text-xl mb-1">
                  {getCategoryIcon(category)}
                </span>
                <span className="text-sm font-medium mt-1 text-center">
                  {category}
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
