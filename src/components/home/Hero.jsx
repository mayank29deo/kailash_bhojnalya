import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, ChefHat } from 'lucide-react';
import { restaurant } from '../../config/restaurant.js';
import OrderCards from './OrderCards.jsx';
import HeroBackdrop from './HeroBackdrop.jsx';

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
      {/* Storefront photo, heavily blurred + cream-leaf wash */}
      <HeroBackdrop />

      {/* Decorative blobs sit on top of the backdrop for extra colour */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-leaf-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-leaf-100/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-spice-400/15 blur-3xl" />
      </div>

      <div className="section grid gap-12 pt-8 pb-20 lg:grid-cols-12 lg:gap-10 lg:pt-14">
        {/* Left: copy block */}
        <div className="lg:col-span-7">
          {/* Brand wordmark — Hindi signage as primary, English transliteration below */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <h1
              className="font-devanagari text-[44px] font-bold leading-[1.18] sm:text-6xl lg:text-[84px]"
              style={{
                color: '#c1272d',
                textShadow:
                  '0 2px 0 rgba(120,18,22,0.28), 0 4px 0 rgba(0,0,0,0.12), 0 14px 32px rgba(193,39,45,0.22)',
                letterSpacing: '0.005em',
              }}
            >
              कैलाश भोजनालय
            </h1>
            <p className="heading-display mt-3 text-xl tracking-tight text-leaf-800 sm:text-2xl lg:text-3xl">
              Kailash <span className="gradient-text">Bhojnalaya</span>
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="h-px w-10 bg-leaf-300" />
              <p className="font-script text-base text-leaf-700/90 sm:text-lg">
                Add Spice to Your Life · Pure Vegetarian Since 1963
              </p>
            </div>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="mt-8 max-w-xl font-display text-2xl leading-snug text-leaf-900 sm:text-[28px]"
          >
            A taste of Deoghar's <span className="gradient-text">pure-vegetarian heritage.</span>
          </motion.p>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-4 max-w-xl text-base leading-relaxed text-leaf-800/80"
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
            <Link
              to="/#catering"
              className="btn border border-spice-500/60 bg-spice-400/35 text-spice-600 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-spice-600/70 hover:bg-spice-400/55 hover:text-spice-600 focus:ring-spice-500/40"
            >
              <ChefHat className="h-4 w-4" />
              Catering Services
            </Link>
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
