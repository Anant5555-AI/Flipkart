import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector(state => state.cart);

 
  items.forEach(item => {
    console.log(`Item ${item.id}:`, {
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      totalPrice: item.totalPrice
    });
  });

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              Your cart is empty</h2>
            <p className="text-gray-500 mb-8">
              Add some products to get started!</p>
            <Link 
              to="/"
              className="bg-blue-600 text-white px-8 py-3 
              rounded-lg hover:bg-blue-700 transition-colors"
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
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart

          </h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-800 font-semibold">
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/*for  Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"/>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      {item.name}</h3>
                    <p className="text-lg font-bold text-blue-900">
                      {formatPrice(item.price)}/item</p>
                  </div>

                  {/* Quantity Controls (taaki yaha bhi option ho)*/}
                  <div className="flex items-center space-x-3">
                    <button
      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
      className="w-8 h-8 rounded-full bg-gray-200 
      hover:bg-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-blue-900 font-semibold">
                      {item.quantity}</span>
                    <button
                      onClick={() =>
                         handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    🗑️
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t flex 
                justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-bold text-blue-900 text-lg">
                    {/* {formatPrice(item.totalPrice)} */}
                    {formatPrice(item.totalPrice)}
                    </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Items ({totalQuantity}):</span>
                  <span className="font-semibold text-blue-900">
                    {formatPrice(totalAmount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-semibold text-blue-900">
                    {formatPrice(Math.round(totalAmount * 0.18))}</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">
                    {formatPrice(totalAmount + Math.round(totalAmount * 0.18))}</span>
                </div>
              </div>
              <Link to="/checkout">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg mt-6 transition-colors">
                Proceed to Checkout
              </button>
              </Link>

              <Link 
                to="/"
                className="block text-center text-blue-600 hover:text-blue-800 mt-4"
              >
                Continue Shopping
              </Link>
    </div>
  </div>
    </div>
      </div>
    </div>
  );
};

export default CartPage;
