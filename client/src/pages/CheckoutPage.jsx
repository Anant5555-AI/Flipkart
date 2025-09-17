import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, clearCart } from '../store/slices/cartSlice';
import API from '../api/axios'; // Assuming you have an axios instance set up in api.js

const CheckoutPage = () => {
  const { items: cartItems, totalAmount, totalItems } = useSelector((state) => state.cart);
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);

  const [deliveryAddress, setDeliveryAddress] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    pincode: '',
    address: '',
    locality: '',
    city: '',
    state: '',
    addressType: 'Home', // 'Home' or 'Work'
  });

  const [paymentMethod, setPaymentMethod] = useState('prepaid'); // 'prepaid' or 'cod'

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!deliveryAddress.address || !deliveryAddress.pincode || !deliveryAddress.city || !deliveryAddress.state) {
      alert('Please fill in all address details');
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.image || '',
          quantity: item.quantity
        })),
        shippingAddress: `${deliveryAddress.address}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}, India`,
        paymentMethod: paymentMethod === 'prepaid' ? 'card' : 'cod',
        itemsPrice: Number(totalAmount),
        taxPrice: 0,
        shippingPrice: totalAmount > 0 ? 5 : 0,
        totalPrice: totalAmount + (totalAmount > 0 ? 5 : 0)
      };
      console.log('Sending order data:', JSON.stringify(orderData, null, 2));

      // Make the API call using the axios instance
      const { data } = await API.post('/orders', orderData);

      console.log('Order created successfully:', data);

      // Clear cart and redirect to home page
      dispatch(clearCart());
      alert("order placed succesfully")
      navigate('/');

    } catch (error) {
      console.error('Order error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login', { state: { from: '/checkout' } });
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Delivery Address and Payment */}
          <div className="md:w-2/3 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Delivery Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={deliveryAddress.name}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full border border-blue-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={deliveryAddress.mobile}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full border border-blue-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={deliveryAddress.pincode}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full border border-blue-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Locality</label>
                  <input
                    type="text"
                    name="locality"
                    value={deliveryAddress.locality}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full border border-blue-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City/District/Town</label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryAddress.city}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full border border-blue-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={deliveryAddress.state}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full border text-blue-700 border-blue-700 rounded-md p-2"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-700">Address (Area and Street)</label>
                  <textarea
                    name="address"
                    value={deliveryAddress.address}
                    onChange={handleAddressChange}
                    rows="3"
                    className="mt-1 block w-full border text-blue-700 border-blue-300 rounded-md p-2"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700">Address Type</label>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="addressType"
                        value="Home"
                        checked={deliveryAddress.addressType === 'Home'}
                        onChange={handleAddressChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-blue-700">Home</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="addressType"
                        value="Work"
                        checked={deliveryAddress.addressType === 'Work'}
                        onChange={handleAddressChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-blue-700">Work</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Payment Options</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="prepaid"
                    name="paymentMethod"
                    type="radio"
                    checked={paymentMethod === 'prepaid'}
                    onChange={() => setPaymentMethod('prepaid')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="prepaid" className="ml-3">
                    <span className="block text-sm font-medium text-blue-700">Credit/Debit Card/UPI</span>
                    <span className="block text-xs text-gray-500">Pay using Credit/Debit Card or UPI</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="cod"
                    name="paymentMethod"
                    type="radio"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="cod" className="ml-3">
                    <span className="block text-sm font-medium text-blue-700">Cash on Delivery</span>
                    <span className="block text-xs text-blue-500">Pay when you receive the order</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Order Summary */}
          <div className="md:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              <h2 className="text-lg font-medium mb-4">Price Details ({totalItems} {totalItems === 1 ? 'Item' : 'Items'})</h2>

              <div className="space-y-2  mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start py-3 border-b">
                    <div className="flex items-center flex-1">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-16 w-16 object-contain"
                      />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-gray-900">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                    <div className="ml-6 flex-shrink-0">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-blue-600">Total MRP</span>
                  <span className='text-blue-600'>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-blue-600">Discount</span>
                  <span className="text-green-600">-₹{(totalAmount * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-blue-600">Delivery Fee</span>
                  <span className='text-blue-700'>{totalAmount > 0 ? '₹5.00' : '₹0.00'}</span>
                </div>
                <div className="flex justify-between font-medium text-lg mt-4 pt-4 border-t">
                  <span className='text-blue-700'>Total Amount</span>
                  <span className='text-blue-700'>₹{(totalAmount * 0.9 + (totalAmount > 0 ? 5 : 0)).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isLoading || !user}
                className={`w-full mt-6 ${isLoading || !user ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? 'Processing...' : 'PLACE ORDER'}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;