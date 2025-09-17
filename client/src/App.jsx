import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import Wishlist from './pages/Wishlist';
import ProductList from './pages/ProductList';
import SignupPage from './pages/SignupPage';
import OrderSuccess from './components/OrderSuccess';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getCurrentUser } from './services/auth';
import { loginSuccess, loginFailure } from './store/slices/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

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

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 w-full overflow-x-hidden">
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
          </Route>

          {/* 404 Route */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-screen">
              <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;