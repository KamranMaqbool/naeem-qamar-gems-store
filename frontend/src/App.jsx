import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/Cart';
import About from './pages/About';
import Checkout from './pages/Checkout';
import { useCart } from './context/CartContext';

function AppContent() {
  const { isCartOpen, closeCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    // React Router keeps the same document while changing routes. Reset the
    // viewport explicitly so every page opens at its own top edge.
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/education" element={<div className="py-section-gap px-5 md:px-20 max-w-[1440px] mx-auto text-center"><h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">Education</h1><p className="font-body text-body-lg text-on-surface-variant">Coming soon...</p></div>} />
          <Route path="/about" element={<About />} />
          <Route path="/bespoke" element={<div className="py-section-gap px-5 md:px-20 max-w-[1440px] mx-auto text-center"><h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">Bespoke Design</h1><p className="font-body text-body-lg text-on-surface-variant">Coming soon...</p></div>} />
          <Route path="/sourcing" element={<div className="py-section-gap px-5 md:px-20 max-w-[1440px] mx-auto text-center"><h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">Our Sourcing</h1><p className="font-body text-body-lg text-on-surface-variant">Coming soon...</p></div>} />
          <Route path="/warranty" element={<div className="py-section-gap px-5 md:px-20 max-w-[1440px] mx-auto text-center"><h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">Warranty</h1><p className="font-body text-body-lg text-on-surface-variant">Coming soon...</p></div>} />
          <Route path="/terms" element={<div className="py-section-gap px-5 md:px-20 max-w-[1440px] mx-auto text-center"><h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">Terms of Service</h1><p className="font-body text-body-lg text-on-surface-variant">Coming soon...</p></div>} />
          <Route path="/contact" element={<div className="py-section-gap px-5 md:px-20 max-w-[1440px] mx-auto text-center"><h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">Contact Us</h1><p className="font-body text-body-lg text-on-surface-variant">Coming soon...</p></div>} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}
