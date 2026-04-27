import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Sparkles } from 'lucide-react';
import { restaurant } from '../../config/restaurant.js';
import OrderCards from './OrderCards.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative background blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-leaf-200/50 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-leaf-100/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-spice-400/15 blur-3xl" />
      </div>

      <div className="section grid gap-12 pt-12 pb-20 lg:grid-cols-12 lg:gap-10 lg:pt-20">
        {/* Left: copy block */}
        <div className="lg:col-span-7">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="pill-leaf"
          >
            <Sparkles className="h-3.5 w-3.5" /> Heritage kitchen · Since 1963
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="heading-display mt-5 text-4xl leading-[1.05] sm:text-5xl lg:text-[64px]"
          >
            A taste of Deoghar's
            <br />
            <span className="gradient-text">pure-vegetarian heritage.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-6 max-w-xl text-base leading-relaxed text-leaf-800/80 sm:text-lg"
          >
            Three generations of Kailash family recipes — thalis, paneer, dals, and
            handmade rotis — served fresh on Station Road. Now a tap away on Zomato
            and Swiggy.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link to="/menu" className="btn-primary">
              Explore the Menu
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={restaurant.orderLinks.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <MapPin className="h-4 w-4" />
              Find us on Maps
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {restaurant.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/70 bg-white/60 px-3 py-3 text-center backdrop-blur"
              >
                <div className="font-display text-xl font-bold text-leaf-800">{s.value}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wide text-leaf-600/80">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: order cards */}
        <div className="lg:col-span-5">
          <OrderCards />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="section -mt-6 mb-2"
      >
        <div className="divider-leaf">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Star className="h-4 w-4 fill-spice-500 text-spice-500" /> Listed on Zomato &amp; Swiggy
          </span>
        </div>
      </motion.div>
    </section>
  );
}
