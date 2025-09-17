import API from './axios';

// Create new order
export const createOrder = async (orderData) => {
  try {
    const response = await API.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create order';
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await API.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch order';
  }
};

// Get logged in user orders
export const getMyOrders = async () => {
  try {
    const response = await API.get('/orders/myorders');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch orders';
  }
};
