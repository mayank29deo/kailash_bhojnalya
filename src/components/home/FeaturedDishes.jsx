import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getFeaturedItems } from '../../data/menu.js';

export default function FeaturedDishes() {
  const items = getFeaturedItems();

  return (
    <section className="section py-16 lg:py-20">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div className="max-w-xl">
          <span className="pill-leaf">Most loved</span>
          <h2 className="heading-display mt-4 text-3xl sm:text-4xl">
            Dishes our regulars swear by.
          </h2>
          <p className="mt-3 text-leaf-700/80">
            Generations of guests have made these the heart of our menu.
            Try them once and you'll know why.
          </p>
        </div>
        <Link
          to="/menu"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-leaf-700 hover:text-leaf-900"
        >
          See full menu
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-ring"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-leaf-600">
                  {item.categoryName}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-leaf-900">
                  {item.name}
                </h3>
              </div>
              <span className="veg-dot mt-1" aria-label="Pure vegetarian" />
            </div>
            {item.description && (
              <p className="mt-3 text-sm leading-relaxed text-leaf-700/80">
                {item.description}
              </p>
            )}
            <div className="mt-5 flex items-center justify-between">
              <span className="font-display text-2xl font-bold text-leaf-800">
                {item.price}
              </span>
              {item.tags && item.tags.length > 0 && (
                <span className="rounded-full bg-spice-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-spice-600">
                  {item.tags[0]}
                </span>
              )}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-leaf-200/40 blur-2xl transition-transform duration-500 group-hover:scale-125"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
