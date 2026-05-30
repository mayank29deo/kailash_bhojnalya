import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Checkout from './pages/Checkout.jsx';
import ScrollToTop from './components/util/ScrollToTop.jsx';
import CartFab from './components/cart/CartFab.jsx';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute.jsx';

// Admin pages are lazy-loaded so customers don't ship the editor JS
// (saves ~250 KB on the customer bundle). The chunks load on demand
// when Bindeshwar hits /admin/*.
const AdminLayout = lazy(() => import('./components/admin/AdminLayout.jsx'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AdminHome = lazy(() => import('./pages/admin/AdminHome.jsx'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders.jsx'));
const AdminMenu = lazy(() => import('./pages/admin/AdminMenu.jsx'));

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 text-leaf-600">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  // Hide cart FAB on /checkout AND throughout /admin/* — neither needs it.
  const showCartFab = !isAdmin && pathname !== '/checkout';
  // Hide the customer Navbar/Footer on /admin/* — the AdminLayout has its own.
  const showCustomerChrome = !isAdmin;

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {showCustomerChrome && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Customer */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Admin */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Suspense fallback={<AdminFallback />}>
                  <AdminLayout />
                </Suspense>
              </ProtectedAdminRoute>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminHome />
                </Suspense>
              }
            />
            <Route
              path="orders"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminOrders />
                </Suspense>
              }
            />
            <Route
              path="menu"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminMenu />
                </Suspense>
              }
            />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {showCartFab && <CartFab />}
      {showCustomerChrome && <Footer />}
    </div>
  );
}
