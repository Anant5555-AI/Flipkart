import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishlist, clearWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';

const Wishlist = () => {
  
  const { items } = useSelector(state => state.wishlist);
  console.log("image bug",items)
const dispatch = useDispatch();

  const handleRemoveFromWishlist = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const handleAddToCart = (product) => {
      
    dispatch(addToCart({
      id: product.id,
      title: product.title || product.name,
      price: product.price,
      image: product.image || product.thumbnail,
      description: product.description || ''
    }));
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '₹0';
    }
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-sm ${i < Math.floor(rating) ?
           'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">❤️</div>
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save items you love for later!</p>
            <Link 
              to="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-8">
    <div className="flex items-center justify-between mb-8">
    <h1 className="text-3xl font-bold text-gray-900">My Wishlist 
      ({items.length})</h1>
          <button
            onClick={handleClearWishlist}
            className="text-red-600 hover:text-red-800 font-semibold"
          >
            Clear Wishlist
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative">
                  <img
                    src={product.image || product.thumbnail}
                    alt={product.title || product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    {product.discount}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFromWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    ❤️
                  </button>
                </div>
              </Link>
              
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600">
                    {product.title}
                  </h4>
                </Link>
                
                <div className="flex items-center mb-2">
                  <StarRating rating={product.rating?.rate || product.rating || 0} />
                  <span className="ml-2 text-sm text-gray-500">({product.rating?.count || 0})</span>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                  <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
