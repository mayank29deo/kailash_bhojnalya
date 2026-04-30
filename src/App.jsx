import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Checkout from './pages/Checkout.jsx';
import ScrollToTop from './components/util/ScrollToTop.jsx';
import CartFab from './components/cart/CartFab.jsx';

export default function App() {
  const { pathname } = useLocation();
  // Hide the cart FAB on /checkout — the cart is already in view there.
  const showCartFab = pathname !== '/checkout';

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {showCartFab && <CartFab />}
      <Footer />
    </div>
  );
}
