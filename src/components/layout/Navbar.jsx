import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import Logo from './Logo.jsx';
import { restaurant } from '../../config/restaurant.js';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'Our Story' },
  { to: '/contact', label: 'Visit Us' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_6px_30px_-20px_rgba(31,79,53,0.45)] border-b border-leaf-100/70'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="section flex h-20 items-center justify-between gap-4">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-leaf-800'
                      : 'text-leaf-700/80 hover:text-leaf-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-leaf-400 to-leaf-700" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${restaurant.phone}`}
            className="btn-ghost group !px-4 !py-2 text-xs"
            aria-label="Call Kailash Bhojnalaya"
          >
            <Phone className="h-4 w-4 transition-transform group-hover:rotate-12" />
            {restaurant.phone}
          </a>
          <a
            href={restaurant.orderLinks.zomato}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !px-5 !py-2.5 text-xs"
          >
            Order Now
          </a>
        </div>

        <button
          type="button"
          className="lg:hidden rounded-full p-2 text-leaf-800 hover:bg-leaf-100/60"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-leaf-100/70 bg-white/95 backdrop-blur-xl">
          <ul className="section flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-leaf-100/80 text-leaf-800'
                        : 'text-leaf-800 hover:bg-leaf-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2 grid grid-cols-2 gap-2">
              <a
                href={`tel:${restaurant.phone}`}
                className="btn-ghost !text-xs !py-2.5"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
              <a
                href={restaurant.orderLinks.zomato}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !text-xs !py-2.5"
              >
                Order Now
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
