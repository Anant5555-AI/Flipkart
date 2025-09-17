import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setSearchTerm, setSelectedCategory, fetchCategories } from '../store/slices/productSlice';
// import { logout } from '../store/slices/authSlice';
import { logout as logoutApi } from '../services/auth';
import { logout as logoutAction } from '../store/slices/authSlice';
// import flipkart from '../assets/flipkart.png'
import pluslogo from '../assets/pluslogo.png';
const Navbar = () => {

  const { searchTerm, categories, selectedCategory, categoriesLoading } = useSelector(state => state.products);
  const { totalQuantity } = useSelector(state => state.cart);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Fetch categories when component mounts
  useEffect(() => {
    console.log('Navbar useEffect - Categories:', categories);
    console.log('Categories length:', categories.length);
    if (categories.length === 0) {
      console.log('Fetching categories...');
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  console.log('Navbar render - Categories:', categories, 'Loading:', categoriesLoading);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };
  const handleLogout = async () => {
    try {
      await logoutApi(); // Call the API to clear the server session
    } catch (error) {
      console.error('Error during logout:', error);
      // Continue with client-side logout even if API fails
    } finally {
      dispatch(logoutAction()); // Clear the Redux state
      navigate('/login'); // Redirect to login page
    }
  };
  const handleCategoryClick = (category) => {
    dispatch(setSelectedCategory(category));
    navigate('/');
  };

  // Function to get icon for each category
  const getCategoryIcon = (category) => {
    const iconMap = {
      'All': '🏪',
      'Smartphones': '📱',
      'Laptops': '💻',
      'Fragrances': '🌸',
      'Skincare': '🧴',
      'Groceries': '🛒',
      'Home Decoration': '🏠',
      'Furniture': '🪑',
      'Tops': '👕',
      "Women's Dresses": '👗',
      "Women's Shoes": '👠',
      "Men's Shirts": '👔',
      
    };
    return iconMap[category] || '📦';
  };

  // const handleLogout = () => {
  //   dispatch(logout());
  //   navigate('/');
  // };

  return (
    <>
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center space-x-4">
              <span className="cursor-pointer hover:underline" onClick={() => (window.location.href = "https://play.google.com/store/apps/details?id=com.flipkart.android&hl=en_IN&pli=1")}>Download App</span>
              <span className="cursor-pointer hover:underline"onClick={() => (window.location.href = "https://seller.flipkart.com/index.html?https://seller.flipkart.com/index.html&gad_source=1&gad_campaignid=22309656443&gbraid=0AAAAABiAxut-65b1vrB0WrLUkhdkOkA9N&gclid=CjwKCAjwhuHEBhBHEiwAZrvdcighDo2r0aJ_p8QpWLoO1ZXj7RWy8DGlon2qHeljAnb48aCXLxdyixoCLtQQAvD_BwE#signUp/accountCreation/new?utm_source=google&utm_medium=cpc&utm_campaign=Brand_FlipkartSeller_Other_Regions_Flipkart_Seller_AdGroup%23signUp%2FaccountCreation%2Fnew")}>Sell on Flipkart</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="cursor-pointer hover:underline">Customer Care</span>
              <span className="cursor-pointer hover:underline">Track your order</span>
              {isAuthenticated ? (
                <div className="flex text-white items-center space-x-2">
                  <span>Hi, {user?.name || "user"}</span>
                  <button onClick={handleLogout} className="text-white hover:underline">
                    Logout
                  </button>
                </div>
              ) : (
                
                <Link to="/login" style={{color:'white'}}>
                  Login
                </Link>
                
                
              )}
            </div>
          </div>
          
          {/* Main header */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold mr-8 hover:text-blue-200">
                {/* <img src={flipkart} alt="Flipkart Logo" className="h-8 object-contain" /> */}
                <img src={pluslogo} alt="Flipkart Plus Logo" className="h-16 w-18" />
              </Link>
              {/* <span className="text-xs italic">Explore Plus</span> */}
            </div>
            
            {/* Search bar */}
            <div className="flex-1 max-w-2xl  mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full px-2 py-2 text-gray-900 bg-white border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 placeholder-gray-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button style={{backgroundColor:'white'}} className="absolute right-0 top-0 h-full px-6 bg-[#2874f0] text-white rounded-r-sm flex items-center justify-center">
                  🔍
                </button>
              </div>
            </div>
            
            {/* Navigation icons */}
            <div className="flex items-center space-x-6">
              <Link 
                to="/wishlist" 
                className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded transition-colors"
              >
                <span>❤️</span>
                <span className="text-white">Wishlist ({wishlistItems.length})</span>
              </Link>
              <Link 
                to="/cart" 
                className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded transition-colors"
              >
                <span>🛒</span>
                <span className="text-white">Cart ({totalQuantity})</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Categories */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
         
         
          
          <div className="flex items-center space-x-8 py-3 overflow-x-auto">
            {categoriesLoading && (
              <div className="text-gray-500">Loading categories...</div>
            )}
            
            {!categoriesLoading && categories.length === 0 && (
              <div className="text-red-500">No categories found</div>
            )}
            
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === category ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                <span className="text-sm font-medium">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;