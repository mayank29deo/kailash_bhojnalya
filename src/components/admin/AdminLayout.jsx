import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  UtensilsCrossed,
  LogOut,
  ChefHat,
  ExternalLink,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { useAuth } from '../../state/AuthContext.jsx';

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: Receipt, end: false },
  { to: '/admin/menu', label: 'Menu', icon: UtensilsCrossed, end: false },
];

export default function AdminLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream-50/60">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-leaf-100 bg-white/85 backdrop-blur">
        <div className="section flex h-16 items-center justify-between gap-4">
          <Link to="/admin" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700">
              <ChefHat className="h-4 w-4" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-sm font-bold text-leaf-900">Kailash Admin</span>
              <span className="text-[10px] uppercase tracking-wider text-leaf-500">
                Owner console
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-leaf-700 text-white shadow-soft'
                      : 'text-leaf-700 hover:bg-leaf-100'
                  }`
                }
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </NavLink>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="hidden items-center gap-2 md:flex">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-leaf-200 bg-white px-3 py-1.5 text-xs font-medium text-leaf-700 transition-colors hover:bg-leaf-50"
              title="View the customer site"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View site
            </a>
            <div className="ml-2 flex items-center gap-2">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-semibold text-leaf-800 leading-tight">
                  {profile?.full_name || 'Owner'}
                </p>
                <p className="text-[10px] text-leaf-500 leading-tight">
                  {profile?.email}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-full bg-leaf-50 px-3 py-1.5 text-xs font-medium text-leaf-700 transition-colors hover:bg-leaf-100"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2 text-leaf-700 hover:bg-leaf-100 md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav sheet */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="border-t border-leaf-100 bg-white md:hidden"
            >
              <nav className="section flex flex-col gap-1 py-3">
                {NAV.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                        isActive ? 'bg-leaf-100 text-leaf-900' : 'text-leaf-700'
                      }`
                    }
                  >
                    <n.icon className="h-4 w-4" />
                    {n.label}
                  </NavLink>
                ))}
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-leaf-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  View customer site
                </a>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-leaf-700"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
