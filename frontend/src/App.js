import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CollectionsPage from './components/CollectionsPage';
import ProductPage from './components/ProductPage';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AboutPage from './components/AboutPage';
import ProfilePage from './components/ProfilePage';
import WishlistPage from './components/WishlistPage';
import CarePage from './components/CarePage';
import ShippingPage from './components/ShippingPage';
import AppointmentPage from './components/AppointmentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/category/:id" element={<CollectionsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/care" element={<CarePage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
