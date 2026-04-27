import { motion } from 'framer-motion';
import { ExternalLink, Clock, Truck } from 'lucide-react';
import { restaurant } from '../../config/restaurant.js';

// The hero CTA — primary conversion path. Two big tappable cards, one
// per delivery partner. Both open in a new tab.

const partners = [
  {
    id: 'zomato',
    name: 'Zomato',
    href: restaurant.orderLinks.zomato,
    accent: 'from-[#fef0f0] to-[#fde0e0]',
    ring: 'ring-[#e23744]/30',
    badge: 'bg-[#e23744]',
    text: 'text-[#e23744]',
    description: 'Fastest delivery within Deoghar',
    note: '30–45 min ETA',
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    href: restaurant.orderLinks.swiggy,
    accent: 'from-[#fff5e9] to-[#ffe4c4]',
    ring: 'ring-[#fc8019]/30',
    badge: 'bg-[#fc8019]',
    text: 'text-[#fc8019]',
    description: 'Live tracking & instant offers',
    note: 'Free delivery on Swiggy One',
  },
];

export default function OrderCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative p-6 lg:p-7"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-leaf-600">
            Order online
          </p>
          <h3 className="heading-display mt-1 text-2xl">Pick your platform</h3>
        </div>
        <div className="hidden sm:flex items-center gap-1 rounded-full bg-leaf-100/80 px-3 py-1 text-[11px] font-medium text-leaf-700">
          <Clock className="h-3 w-3" /> Open now
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {partners.map((p, i) => (
          <motion.a
            key={p.id}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
            whileHover={{ y: -3 }}
            className={`group relative overflow-hidden rounded-2xl border border-white bg-gradient-to-r ${p.accent} p-5 ring-1 ${p.ring} transition-shadow hover:shadow-soft`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${p.badge} text-white shadow-soft`}
              >
                <span className="font-display text-xl font-bold">
                  {p.name[0]}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className={`font-display text-xl font-bold ${p.text}`}>
                    Order on {p.name}
                  </span>
                  <ExternalLink
                    className={`h-4 w-4 ${p.text} transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
                  />
                </div>
                <p className="mt-0.5 text-sm text-leaf-800/80">{p.description}</p>
                <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-leaf-700/80">
                  <Truck className="h-3 w-3" />
                  {p.note}
                </p>
              </div>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/40 blur-2xl transition-transform duration-500 group-hover:scale-110"
            />
          </motion.a>
        ))}
      </div>

      <p className="mt-5 rounded-2xl bg-leaf-50/80 px-4 py-3 text-xs leading-relaxed text-leaf-700">
        Prefer to call?{' '}
        <a
          href={`tel:${restaurant.phone}`}
          className="font-semibold text-leaf-800 underline-offset-2 hover:underline"
        >
          {restaurant.phone}
        </a>{' '}
        — we take takeaway orders directly during opening hours.
      </p>
    </motion.div>
  );
}
