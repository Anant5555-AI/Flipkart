import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './services/auth';
import { loginSuccess, loginFailure } from './store/slices/authSlice';

import { updateStock } from './store/slices/productSlice';
import { io } from 'socket.io-client';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const ProductList = lazy(() => import('./pages/ProductList'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const OrderSuccess = lazy(() => import('./components/OrderSuccess'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Socket.io Listener for Real-time Stock Updates
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('product:update', (data) => {
      console.log('Real-time stock update:', data);
      dispatch(updateStock(data));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch(loginFailure('Please log in'));
        return;
      }

      try {
        const userData = await getCurrentUser();
        dispatch(loginSuccess({
          user: userData,
          token: token
        }));
      } catch (error) {
        if (error.response?.status === 401) {
          dispatch(loginFailure('Session expired. Please log in again.'));
        } else {
          console.error('Auth check error:', error);
        }
      }
    };

    checkAuth();
  }, [dispatch]);

  const renderFallback = (
    <div className="flex min-h-screen items-center justify-center text-gray-600">
      Loading...
    </div>
  );

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 w-full overflow-x-hidden">
        <Suspense fallback={renderFallback}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <>
                <Navbar />
                <LoginPage />
                <Footer />
              </>
            } />

            <Route path="/signup" element={
              <>
                <Navbar />
                <SignupPage />
                <Footer />
              </>
            } />

            <Route path="/" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <HomePage />
                </main>
                <Footer />
              </>
            } />

            <Route path="/products" element={
              <>
                <Navbar />
                <ProductList />
                <Footer />
              </>
            } />

            <Route path="/product/:id" element={
              <>
                <Navbar />
                <ProductPage />
                <Footer />
              </>
            } />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={
                <>
                  <Navbar />
                  <CartPage />
                  <Footer />
                </>
              } />

              <Route path="/wishlist" element={
                <>
                  <Navbar />
                  <Wishlist />
                  <Footer />
                </>
              } />

              <Route path="/checkout" element={
                <>
                  <Navbar />
                  <CheckoutPage />
                  <Footer />
                </>
              } />

              <Route path="/order/:id" element={
                <>
                  <Navbar />
                  <OrderSuccess />
                  <Footer />
                </>
              } />

              <Route path="/dashboard" element={
                <>
                  <Navbar />
                  <DashboardPage />
                  <Footer />
                </>
              } />

              <Route path="/admin" element={
                <>
                  <Navbar />
                  <AdminDashboard />
                  <Footer />
                </>
              } />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={
              <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
              </div>
            } />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
