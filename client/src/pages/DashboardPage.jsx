import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMyOrders } from '../api/orderApi';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currencyFormatter = useMemo(() => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }), []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        const message = typeof err === 'string' ? err : err?.message || 'Failed to load orders';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getOrderedProductCount = (items = []) =>
    items.reduce((total, item) => total + (item.quantity || 1), 0);

  const getOrderTotal = (order) => {
    if (typeof order?.totalPrice === 'number') {
      return order.totalPrice;
    }

    const itemsTotal = (order?.items || []).reduce((sum, item) => {
      const itemPrice = typeof item.price === 'number' ? item.price : 0;
      const quantity = item.quantity || 1;
      return sum + itemPrice * quantity;
    }, 0);

    const shipping = typeof order?.shippingPrice === 'number' ? order.shippingPrice : 0;
    const tax = typeof order?.taxPrice === 'number' ? order.taxPrice : 0;

    return itemsTotal + shipping + tax;
  };

  const OrderCard = ({ order }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-semibold text-gray-900">#{order._id?.slice(-8) || 'N/A'}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
            {order.status || 'pending'}
          </span>
          <span className="rounded-full bg-green-50 px-3 py-1 font-medium text-green-700">
            {order.paymentStatus || 'pending'}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Placed on</p>
          <p className="text-sm font-medium text-gray-800">
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '--'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Total amount</p>
          <p className="text-sm font-medium text-gray-800">
            {currencyFormatter.format(getOrderTotal(order))}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Items</p>
          <p className="text-sm font-medium text-gray-800">{order.items?.length || 0}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Products ordered</p>
          <p className="text-sm font-medium text-gray-800">
            {getOrderedProductCount(order.items)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg">
          <p className="text-sm uppercase tracking-wide opacity-80">Account overview</p>
          <h1 className="mt-2 text-3xl font-bold">{user?.name || 'Valued Customer'}</h1>
          <p className="mt-2 text-white/90">{user?.email}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/80">
            <span>Orders placed: {orders.length}</span>
            {user?.createdAt && (
              <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Your Orders</h2>
              <p className="text-sm text-gray-500">Track recent purchases and their status</p>
            </div>
          </div>

          <div className="mt-6">
            {loading && <p className="text-gray-500">Loading your orders...</p>}
            {!loading && error && (
              <p className="text-red-500">{error}</p>
            )}
            {!loading && !error && orders.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                <p className="text-lg font-medium text-gray-800">No orders yet</p>
                <p className="mt-2 text-sm text-gray-500">Browse products and start shopping today.</p>
              </div>
            )}

            {!loading && !error && orders.length > 0 && (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

