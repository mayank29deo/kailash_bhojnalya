import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Instagram, Facebook, Mail } from 'lucide-react';
import Logo from './Logo.jsx';
import { restaurant } from '../../config/restaurant.js';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-leaf-100/70 bg-gradient-to-b from-cream-50/80 to-leaf-50/90">
      <div className="absolute inset-0 -z-10 bg-leaf-soft opacity-60" />
      <div className="section grid gap-12 py-16 lg:grid-cols-4">
        <div className="lg:col-span-2 max-w-md">
          <Logo size={64} />
          <p className="mt-5 text-sm leading-relaxed text-leaf-700/80">
            {restaurant.story.short}
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={restaurant.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-leaf-200 bg-white/70 p-2.5 text-leaf-700 transition-colors hover:bg-leaf-100"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={restaurant.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-full border border-leaf-200 bg-white/70 p-2.5 text-leaf-700 transition-colors hover:bg-leaf-100"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${restaurant.email}`}
              aria-label="Email"
              className="rounded-full border border-leaf-200 bg-white/70 p-2.5 text-leaf-700 transition-colors hover:bg-leaf-100"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-leaf-800">Visit</h4>
          <ul className="mt-4 space-y-3 text-sm text-leaf-700/85">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-leaf-500" />
              <span>
                {restaurant.address.line1}
                <br />
                {restaurant.address.city}, {restaurant.address.state}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-leaf-500" />
              <a href={`tel:${restaurant.phone}`} className="hover:text-leaf-900">
                {restaurant.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-leaf-500" />
              <span>{restaurant.hours[0].value}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-leaf-800">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-leaf-700/85">
            <li>
              <Link to="/menu" className="hover:text-leaf-900">
                Full Menu
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-leaf-900">
                Heritage Story
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-leaf-900">
                Catering & Bookings
              </Link>
            </li>
            <li>
              <a
                href={restaurant.orderLinks.zomato}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-leaf-900"
              >
                Order on Zomato
              </a>
            </li>
            <li>
              <a
                href={restaurant.orderLinks.swiggy}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-leaf-900"
              >
                Order on Swiggy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-leaf-100/70">
        <div className="section flex flex-col items-center justify-between gap-2 py-5 text-xs text-leaf-700/70 sm:flex-row">
          <p>
            © {year} Kailash Bhojnalaya · Station Road, Deoghar · {restaurant.notes.gst}
          </p>
          <div className="flex items-center gap-4">
            <p className="font-medium text-leaf-700">Service is our motto.</p>
            <span aria-hidden className="hidden h-3 w-px bg-leaf-200 sm:block" />
            <Link
              to="/admin/login"
              className="text-leaf-500/80 transition-colors hover:text-leaf-800"
              title="Owner login — Bindeshwar's admin console"
            >
              Owner login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
