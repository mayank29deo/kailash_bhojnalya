import { motion } from 'framer-motion';

export default function MenuItemCard({ item, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
      className="group relative flex items-start justify-between gap-4 rounded-2xl border border-white/70 bg-white/65 p-4 backdrop-blur transition-all hover:bg-white hover:shadow-soft"
    >
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
    </motion.div>
  );
}
