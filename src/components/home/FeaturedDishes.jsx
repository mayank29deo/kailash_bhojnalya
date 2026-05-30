import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getFeaturedItems } from '../../data/menu.js';
import { fetchMenuCategories } from '../../services/menuService.js';

// Hero image at the top of each card. Admin-uploaded imageUrl wins;
// /menu/<id>.jpg is the fallback; if both fail the card collapses to
// the previous text-only layout.
function DishHero({ id, name, imageUrl }) {
  const [stage, setStage] = useState(imageUrl ? 'remote' : 'static');
  if (stage === 'hidden') return null;
  const src = stage === 'remote' ? imageUrl : `/menu/${id}.jpg`;
  const handleError = () => {
    if (stage === 'remote') setStage('static');
    else setStage('hidden');
  };
  return (
    <div className="relative -mx-6 -mt-6 mb-5 aspect-[16/10] overflow-hidden bg-leaf-50">
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={handleError}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      {/* subtle bottom gradient so the price/tags below feel anchored */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/15 to-transparent"
      />
    </div>
  );
}

export default function FeaturedDishes() {
  // Start with the static featured list so the section renders instantly;
  // swap in DB-driven featured items once the fetch resolves.
  const [items, setItems] = useState(() => getFeaturedItems());

  useEffect(() => {
    let active = true;
    fetchMenuCategories().then((cats) => {
      if (!active) return;
      const featured = cats.flatMap((c) =>
        (c.items || [])
          .filter((i) => i.isFeatured)
          .map((i) => ({ ...i, categoryName: c.name, categoryId: c.id }))
      );
      if (featured.length > 0) setItems(featured);
    });
    return () => {
      active = false;
    };
  }, []);

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

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-ring"
          >
            <DishHero id={item.id} name={item.name} imageUrl={item.imageUrl} />

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
