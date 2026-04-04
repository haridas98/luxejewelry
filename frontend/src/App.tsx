import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};
import HomePage from './components/HomePage.jsx';
import CollectionsPage from './components/CollectionsPage.jsx';
import ProductPage from './components/ProductPage.jsx';
import CartPage from './components/CartPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import AboutPage from './components/AboutPage.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import WishlistPage from './components/WishlistPage.jsx';
import CarePage from './components/CarePage.jsx';
import ShippingPage from './components/ShippingPage.jsx';
import AppointmentPage from './components/AppointmentPage.jsx';
import SearchResults from './components/SearchResults.jsx';
import CheckoutPage from './components/CheckoutPage.jsx';
import CraftsmanshipPage from './components/CraftsmanshipPage';
import SustainabilityPage from './components/SustainabilityPage';
import ContactPage from './components/ContactPage';
import ManufacturePage from './components/ManufacturePage';
import { PageTransition } from './components/animations';

// Animated Routes component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path="/collections"
          element={
            <PageTransition>
              <CollectionsPage />
            </PageTransition>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PageTransition>
              <ProductPage />
            </PageTransition>
          }
        />
        <Route
          path="/category/:id"
          element={
            <PageTransition>
              <CollectionsPage />
            </PageTransition>
          }
        />
        <Route
          path="/cart"
          element={
            <PageTransition>
              <CartPage />
            </PageTransition>
          }
        />
        <Route
          path="/checkout"
          element={
            <PageTransition>
              <CheckoutPage />
            </PageTransition>
          }
        />
        <Route
          path="/manufacture"
          element={
            <PageTransition>
              <ManufacturePage />
            </PageTransition>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PageTransition>
              <WishlistPage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <RegisterPage />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <AboutPage />
            </PageTransition>
          }
        />
        <Route
          path="/craftsmanship"
          element={
            <PageTransition>
              <CraftsmanshipPage />
            </PageTransition>
          }
        />
        <Route
          path="/sustainability"
          element={
            <PageTransition>
              <SustainabilityPage />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <ContactPage />
            </PageTransition>
          }
        />
        <Route
          path="/profile"
          element={
            <PageTransition>
              <ProfilePage />
            </PageTransition>
          }
        />
        <Route
          path="/care"
          element={
            <PageTransition>
              <CarePage />
            </PageTransition>
          }
        />
        <Route
          path="/shipping"
          element={
            <PageTransition>
              <ShippingPage />
            </PageTransition>
          }
        />
        <Route
          path="/appointment"
          element={
            <PageTransition>
              <AppointmentPage />
            </PageTransition>
          }
        />
        <Route
          path="/search"
          element={
            <PageTransition>
              <SearchResults />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
