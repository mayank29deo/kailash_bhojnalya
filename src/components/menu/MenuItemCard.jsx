import { useState } from 'react';
import { motion } from 'framer-motion';

// Looks for /menu/<id>.jpg. If absent, the thumbnail block hides
// completely so a partial image rollout still looks clean.
// Filenames are documented in MENU_IMAGES.md; standardising on .jpg keeps
// the menu page from generating 80+ fallback requests when empty.

function DishThumb({ id, name }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[28%] bg-leaf-50 ring-1 ring-leaf-100/80 sm:h-20 sm:w-20">
      <img
        src={`/menu/${id}.jpg`}
        alt={name}
        loading="lazy"
        onError={() => setHidden(true)}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[28%] ring-1 ring-inset ring-white/40"
      />
    </div>
  );
}

export default function MenuItemCard({ item, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
      className="group relative flex items-start gap-4 rounded-2xl border border-white/70 bg-white/65 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-leaf-200 hover:bg-white hover:shadow-soft"
    >
      <DishThumb id={item.id} name={item.name} />

      <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="veg-dot shrink-0" aria-label="Pure vegetarian" />
            <h4 className="font-display text-[17px] font-semibold leading-snug text-leaf-900">
              {item.name}
            </h4>
          </div>
          {item.description && (
            <p className="mt-1.5 text-[13px] leading-relaxed text-leaf-700/80">
              {item.description}
            </p>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-spice-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-spice-600"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-right">
          <span className="font-display text-lg font-bold text-leaf-800">{item.price}</span>
        </div>
      </div>
    </motion.div>
  );
}
