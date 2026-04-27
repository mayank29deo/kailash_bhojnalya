import { motion } from 'framer-motion';
import { Leaf, Award, Heart } from 'lucide-react';
import { restaurant } from '../../config/restaurant.js';

const icons = [Leaf, Award, Heart];

export default function HeritageStrip() {
  return (
    <section className="section py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="pill-leaf">Why Kailash</span>
        <h2 className="heading-display mt-4 text-3xl sm:text-4xl">
          Sixty years of quietly perfecting one thing — <span className="gradient-text">vegetarian flavour</span>.
        </h2>
        <p className="mt-4 text-leaf-700/80">
          {restaurant.story.long}
        </p>
      </motion.div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {restaurant.story.pillars.map((p, i) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-leaf-900">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-leaf-700/80">
                {p.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
