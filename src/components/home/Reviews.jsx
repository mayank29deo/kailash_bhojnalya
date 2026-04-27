import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { fetchReviews } from '../../services/reviewsService.js';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let active = true;
    fetchReviews({ limit: 3 }).then((r) => {
      if (active) setReviews(r);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section py-16 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="pill-leaf">Guests say</span>
        <h2 className="heading-display mt-4 text-3xl sm:text-4xl">
          Loved by 2,600+ guests on Google.
        </h2>
        <p className="mt-3 text-leaf-700/80">
          From pilgrims who walk to Baba Baidyanath to families who have
          been coming for decades — here's what they say.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.figure
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass-card relative flex h-full flex-col p-6"
          >
            <Quote className="absolute right-5 top-5 h-8 w-8 text-leaf-200" />
            <div className="flex items-center gap-1 text-spice-500">
              {Array.from({ length: r.rating || 5 }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-leaf-800">
              "{r.text}"
            </blockquote>
            <figcaption className="mt-5 border-t border-leaf-100 pt-4">
              <p className="font-display font-semibold text-leaf-900">{r.name}</p>
              {r.location && (
                <p className="text-xs text-leaf-600">{r.location}</p>
              )}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
