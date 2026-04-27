import { motion } from 'framer-motion';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { restaurant } from '../../config/restaurant.js';

export default function VisitCta() {
  return (
    <section className="section pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-leaf-700 via-leaf-600 to-leaf-500 p-10 text-white shadow-glow lg:p-14"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_80%_85%,rgba(232,163,82,0.25),transparent_60%)]"
        />
        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              Catering &amp; private bookings
            </span>
            <h2 className="heading-display mt-5 text-3xl text-white sm:text-4xl">
              Hosting a wedding, birthday or sankalp? Let our kitchen feed your guests.
            </h2>
            <p className="mt-4 max-w-xl text-white/85">
              {restaurant.notes.bookings}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="btn !bg-white !text-leaf-800 hover:!bg-cream-50"
              >
                Plan an event
              </Link>
              <a
                href={`tel:${restaurant.phone}`}
                className="btn border border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                <Phone className="h-4 w-4" />
                {restaurant.phone}
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoTile icon={MapPin} title="Find us">
              {restaurant.address.line1}
              <br />
              {restaurant.address.city}, {restaurant.address.state}
            </InfoTile>
            <InfoTile icon={Clock} title="Open daily">
              {restaurant.hours[0].value}
            </InfoTile>
            <InfoTile icon={Phone} title="Call directly" full>
              {restaurant.phone} — takeaway orders welcome on call
            </InfoTile>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function InfoTile({ icon: Icon, title, children, full = false }) {
  return (
    <div
      className={`rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur ${
        full ? 'sm:col-span-2' : ''
      }`}
    >
      <div className="flex items-center gap-2 text-white/70">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">{title}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-white">{children}</p>
    </div>
  );
}
