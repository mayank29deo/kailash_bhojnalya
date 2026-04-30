import { motion } from 'framer-motion';
import { Sparkles, Leaf, Award, Heart, Users } from 'lucide-react';
import { restaurant } from '../config/restaurant.js';
import Storefront from '../components/home/Storefront.jsx';

const timeline = [
  {
    year: '1963',
    title: 'A small kitchen on Station Road',
    body:
      'The first Kailash kitchen opens its doors with a single goal — to serve home-style vegetarian food to pilgrims and travellers passing through Deoghar.',
  },
  {
    year: '1980s',
    title: 'A second generation steps in',
    body:
      'Family recipes are codified, the thali is born, and Kailash becomes a household name on Station Road.',
  },
  {
    year: '2010s',
    title: 'Listed online — Zomato, Swiggy, Maps',
    body:
      'Travellers start finding us before they arrive. Our 4.5★ rating and 2,600+ Google interactions are entirely organic.',
  },
  {
    year: 'Today',
    title: 'A web home of our own',
    body:
      'This is the digital extension of the same kitchen — same hands, same spices, same care. Just easier to find and order from.',
  },
];

const values = [
  {
    icon: Leaf,
    title: 'Pure vegetarian, always',
    body: 'Not a single non-veg ingredient has ever entered our kitchen. Sixty years and counting.',
  },
  {
    icon: Award,
    title: 'Heritage recipes',
    body: 'Spice blends and dal techniques passed down three generations.',
  },
  {
    icon: Heart,
    title: 'Made with care',
    body: 'Fresh paneer every morning, locally sourced sabzi, and the same warm hospitality.',
  },
  {
    icon: Users,
    title: 'For every guest',
    body: 'Pilgrims, families, students, business travellers — there is a thali on our menu for everyone.',
  },
];

export default function About() {
  return (
    <>
      <section className="section pt-12 pb-10 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="pill-leaf">
            <Sparkles className="h-3.5 w-3.5" /> Our Story
          </span>
          <h1 className="heading-display mt-5 text-4xl sm:text-5xl">
            Sixty years of <span className="gradient-text">vegetarian heritage</span> in Deoghar.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-leaf-700/85">
            {restaurant.story.long}
          </p>
        </motion.div>
      </section>

      <section className="section pb-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-leaf-900">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-leaf-700/80">{v.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Storefront variant="about" />

      <section className="section pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="heading-display text-3xl sm:text-4xl text-center">
            A timeline of our kitchen.
          </h2>
          <ol className="mt-12 relative border-l-2 border-leaf-200 pl-6 sm:pl-10">
            {timeline.map((t, i) => (
              <motion.li
                key={t.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative mb-12 last:mb-0"
              >
                <span
                  aria-hidden
                  className="absolute -left-[34px] sm:-left-[50px] top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-leaf-400 to-leaf-700 text-white shadow-soft"
                >
                  <Leaf className="h-3.5 w-3.5" />
                </span>
                <p className="font-script text-lg text-leaf-600">{t.year}</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-leaf-900">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-leaf-700/85">{t.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
