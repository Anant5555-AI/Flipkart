import React , { useState, useEffect }from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice';
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const { items: cartItems } = useSelector(state => state.cart);
  const isInWishlist = wishlistItems.some(item => item.id === product.id);
  const cartItem = cartItems.find(item => item.id === product.id);
  const [quantity, setQuantity] = useState(cartItem?.quantity || 0);
  
  useEffect(() => {
    setQuantity(cartItem?.quantity || 0);
  }, [cartItem]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (quantity === 0) {
      dispatch(addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image ,
        quantity: 1,
      }));
      setQuantity(1);
    }
  };
  const handleIncrement = (e) => {
    e.preventDefault();
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    dispatch(updateQuantity({ 
      id: product.id, 
      quantity: newQuantity,
      price: product.price
    }));
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      dispatch(updateQuantity({ 
        id: product.id, 
        quantity: newQuantity,
        price: product.price
      }));
    } else {
      // Remove if quantity becomes 0
      setQuantity(0);
      dispatch(removeFromCart(product.id));
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const formatPrice = (price) => {
    if (!price || typeof price !== 'number') {
      return '₹0';
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  // Debug: Log the product rating structure
  console.log('Product rating data:', product.rating);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <img
            src={Array.isArray(product.images) ? product.images[0] : product.thumbnail}
            alt={product.title}
            className="w-full h-32 object-cover"
          />
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            {product.discount}% off
          </div>
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isInWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-400 hover:text-gray-500'
            }`}
          >
            {isInWishlist ? '❤️' : '♡'}
            {/* this is products in home page that u se below */}
          </button>
        </div>
        
        <div className="p-3">
          <h4 className="font-medium text-gray-800 mb-1 text-sm line-clamp-2">{product.title}</h4>
          
          <div className="flex items-center mb-1">
            {product.rating && (
              <>
                <StarRating rating={typeof product.rating === 'number' ? product.rating : product.rating.rate} />
                <span className="ml-1 text-xs text-gray-500">
                  ({typeof product.rating === 'number' ? '100' : (product.rating.count || 0)})
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-1 mb-2">
            <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
            <span className="text-xs text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
          </div>
          
          {/* <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
          >
            Add to Cart
          </button> */}
          {quantity > 0 ? (
          <div className="flex items-center bg-blue-900 justify-between border border-gray-300 rounded-md p-1 mt-2 w-32">
            <button 
              onClick={handleDecrement}
              className="px-2 py-1 text-lg hover:bg-gray-100"
            >
              -
            </button>
            <span className="text-center w-8">{quantity}</span>
            <button 
              onClick={handleIncrement}
              className="px-2 py-1 text-lg hover:bg-gray-100"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors mt-2"
          >
            Add to Cart
          </button>
        )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;