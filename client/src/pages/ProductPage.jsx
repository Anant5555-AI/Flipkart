import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductById } from "../store/slices/productSlice";
import { addToCart, updateQuantity } from "../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedProduct, productLoading, error } = useSelector(
    (state) => state.products
  );

  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { items: cartItems } = useSelector((state) => state.cart);

  const [quantity, setQuantity] = useState(1);

  // FIX: Use _id everywhere
  const cartItem = cartItems.find(
    (item) => item.id === selectedProduct?._id
  );

  const isInWishlist = wishlistItems.some(
    (item) => item._id === selectedProduct?._id
  );

 
  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [id, dispatch]);


  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItem]);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);

    if (selectedProduct) {
      dispatch(
        updateQuantity({
          id: selectedProduct._id,
          quantity: newQuantity,
          price: selectedProduct.price,
        })
      );
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);

      if (selectedProduct) {
        dispatch(
          updateQuantity({
            id: selectedProduct._id,
            quantity: newQuantity,
            price: selectedProduct.price,
          })
        );
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    dispatch(
      addToCart({
        id: selectedProduct._id,
        name: selectedProduct.title,
        price: selectedProduct.price,
        image: selectedProduct.image,
        quantity,
      })
    );
  };

  const handleWishlistToggle = () => {
    if (!selectedProduct) return;

    if (isInWishlist) {
      dispatch(removeFromWishlist(selectedProduct._id));
    } else {
      dispatch(addToWishlist(selectedProduct));
    }
  };

  const handleBuyNow = () => {
    if (selectedProduct) navigate("/checkout");
  };

  const formatPrice = (price) =>
    `₹${Number(price).toLocaleString("en-IN")}`;

  const StarRating = ({ rating }) => {
    const safeRating = Number(rating) || 0;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < Math.floor(safeRating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-lg text-gray-600">{safeRating}</span>
      </div>
    );
  };

  // LOADING SCREEN
  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-b-2 border-blue-600 rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading product...</h2>
        </div>
      </div>
    );
  }

  // ERROR SCREEN
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-red-500 text-xl mb-2">Error loading product</h2>
          <p>{error}</p>
          <button
            onClick={() => dispatch(fetchProductById(id))}
            className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // PRODUCT NOT FOUND
  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-xl text-gray-600">Product not found</h2>
      </div>
    );
  }

  // SAFE FALLBACKS(need tha)
  const ratingRate = selectedProduct.rating?.rate || selectedProduct.rating || 0;
  const ratingCount = selectedProduct.rating?.count || selectedProduct.reviews?.length || 0;
  const discount = selectedProduct.discount || selectedProduct.discountPercentage || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow">
          
          {/* IMAGE */}
          <div className="relative">
            <img
              src={selectedProduct.image || selectedProduct.images?.[0] || 'https://picsum.photos/seed/product/400/400.jpg'}
              alt={selectedProduct.title}
              className="w-full rounded-lg h-96 object-cover"
            />

            <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded">
              {discount}% OFF
            </div>

            <button
              onClick={handleWishlistToggle}
              className={`absolute top-4 right-4 p-3 rounded-full ${
                isInWishlist ? "bg-red-500 text-white" : "bg-white text-black"
              }`}
            >
              {isInWishlist ? "❤️" : "♡"}
            </button>
          </div>

          {/* DETAILS */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{selectedProduct.title}</h1>
            <p className="text-gray-700">{selectedProduct.description}</p>

            <div className="flex items-center space-x-4">
              <StarRating rating={ratingRate} />
              <span className="text-gray-500">({ratingCount} reviews)</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold">{formatPrice(selectedProduct.price)}</span>
              <span className="text-xl line-through text-gray-500">
                {formatPrice(selectedProduct.originalPrice)}
              </span>
            </div>

            <p className="text-green-600 font-semibold">
              You save {formatPrice(selectedProduct.originalPrice - selectedProduct.price)}
            </p>

            {/* QUANTITY */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="px-3 py-1"
                >
                  -
                </button>

                <span className="px-4">{quantity}</span>

                <button onClick={handleIncrement} className="px-3 py-1">
                  +
                </button>
              </div>
            </div>

            {/* STOCK */}
            <span className={selectedProduct.inStock ? "text-green-600" : "text-red-600"}>
              {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
            </span>

            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg"
            >
              Add to Cart
            </button>

            <button
              disabled={!selectedProduct.inStock}
              onClick={handleBuyNow}
              className="w-full bg-yellow-500 text-white py-3 rounded-lg text-lg"
            >
              Buy Now
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductPage;
