import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Quote, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchReviews } from '../../services/reviewsService.js';

const PAGE_SIZE = 3;
const ROTATE_MS = 6000;

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let active = true;
    fetchReviews({ limit: 30 }).then((r) => {
      if (active) setReviews(r);
    });
    return () => {
      active = false;
    };
  }, []);

  const pages = useMemo(() => {
    const out = [];
    for (let i = 0; i < reviews.length; i += PAGE_SIZE) {
      out.push(reviews.slice(i, i + PAGE_SIZE));
    }
    return out;
  }, [reviews]);

  useEffect(() => {
    if (paused || pages.length <= 1) return;
    const t = setTimeout(() => {
      setPage((p) => (p + 1) % pages.length);
    }, ROTATE_MS);
    return () => clearTimeout(t);
  }, [page, paused, pages.length]);

  const visible = pages[page] || [];
  const goto = (i) => setPage(((i % pages.length) + pages.length) % pages.length);

  return (
    <section
      id="reviews"
      className="section scroll-mt-24 py-16 lg:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="pill-leaf">Guests say</span>
        <h2 className="heading-display mt-4 text-3xl sm:text-4xl">
          Loved by 2,600+ guests on Google.
        </h2>
        <p className="mt-3 text-leaf-700/80">
          Real reviews from Google Maps — pilgrims, locals, and travellers who
          have eaten with us. Light grammar cleanup; voice and meaning preserved.
        </p>
      </div>

      <div className="relative mt-12 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-5 md:grid-cols-3"
          >
            {visible.map((r) => (
              <ReviewCard key={r.id} r={r} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {pages.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goto(page - 1)}
            aria-label="Previous reviews"
            className="rounded-full border border-leaf-200 bg-white/70 p-2 text-leaf-700 transition-colors hover:bg-leaf-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show review set ${i + 1}`}
                aria-current={i === page}
                onClick={() => setPage(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === page
                    ? 'w-8 bg-leaf-600'
                    : 'w-2 bg-leaf-300 hover:bg-leaf-400'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goto(page + 1)}
            aria-label="Next reviews"
            className="rounded-full border border-leaf-200 bg-white/70 p-2 text-leaf-700 transition-colors hover:bg-leaf-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

    </section>
  );
}

function ReviewCard({ r }) {
  return (
    <figure className="glass-card relative flex h-full flex-col p-6">
      <Quote className="absolute right-5 top-5 h-8 w-8 text-leaf-200" />
      <div className="flex items-center gap-1 text-spice-500">
        {Array.from({ length: r.rating || 5 }).map((_, j) => (
          <Star key={j} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-leaf-800">
        “{r.text}”
      </blockquote>
      <figcaption className="mt-5 border-t border-leaf-100 pt-4">
        <div className="flex items-center gap-1.5">
          <p className="font-display font-semibold text-leaf-900">{r.name}</p>
          {r.localGuide && (
            <span title="Google Local Guide">
              <BadgeCheck className="h-4 w-4 text-leaf-600" />
            </span>
          )}
        </div>
        {(r.meta || r.location) && (
          <p className="text-xs text-leaf-600">{r.meta || r.location}</p>
        )}
      </figcaption>
    </figure>
  );
}
