import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Award, Heart, Users } from 'lucide-react';
import { restaurant } from '../config/restaurant.js';
import Storefront from '../components/home/Storefront.jsx';

const HERITAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

const timeline = [
  {
    year: '1963',
    title: 'A small kitchen on Station Road',
    body:
      'The first Kailash kitchen opens its doors with a single goal — to serve home-style vegetarian food to pilgrims and travellers passing through Deoghar.',
    photos: [
      {
        base: '/heritage-1963',
        caption: 'Founder Hari Prasad Sah with his founder employees',
      },
    ],
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
      'Kailash Bhojnalaya finally stepped onto Zomato in late 2019, and Swiggy followed just months later — right as the pandemic reshaped how India ate. Suddenly pilgrims arriving at Baidyanath Dham could browse our menu before they even left their hotels. The numbers grew organically — no ads, no influencers — just word of mouth from regulars who walked in once and kept coming back.',
    extraBody:
      'And along the way, more than ten well-known faces have shared a meal at our table — Bhojpuri film stars, MLAs, journalists, social leaders. Some came once on a pilgrimage and stayed for the thali; others now make us a regular stop whenever they pass through Deoghar.',
    highlights: [
      { value: '2019', label: 'Listed on Zomato' },
      { value: '2020', label: 'Swiggy + Google Maps' },
      { value: '10+', label: 'Celebrity guests so far' },
      { value: '4.5★', label: 'On 2,600+ Google reviews' },
    ],
    photos: [
      {
        base: '/heritage-2010v1',
        caption: 'A treasured moment with our beloved celebrity guests',
      },
      {
        base: '/heritage-2010v2',
        caption: 'Another cherished visit from the same era',
      },
    ],
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
        <div className="mx-auto max-w-4xl">
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
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                  <div className="flex-1">
                    <p className="font-script text-lg text-leaf-600">{t.year}</p>
                    <h3 className="mt-1 font-display text-xl font-semibold text-leaf-900">
                      {t.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-leaf-700/85">{t.body}</p>
                    {t.extraBody && (
                      <p className="mt-3 text-sm leading-relaxed text-leaf-700/85">
                        {t.extraBody}
                      </p>
                    )}
                    {t.highlights && (
                      <ul className="mt-5 grid gap-3 rounded-2xl border border-leaf-100 bg-leaf-50/60 p-4 sm:grid-cols-2">
                        {t.highlights.map((h) => (
                          <li
                            key={h.value + h.label}
                            className="flex items-baseline gap-3"
                          >
                            <span className="font-display text-lg font-bold leading-none text-leaf-700">
                              {h.value}
                            </span>
                            <span className="text-xs leading-snug text-leaf-700/85">
                              {h.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {t.photos && t.photos.length > 0 && (
                    <div className="flex flex-col gap-5 sm:w-60">
                      {t.photos.map((photo, idx) => (
                        <HeritagePhoto key={photo.base} photo={photo} index={idx} />
                      ))}
                    </div>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

// Subtle polaroid-style frame for the founder photo. Uses a slight
// tilt + cream paper background to evoke a physical print pinned to
// the timeline. When stacked (multiple photos in one timeline entry),
// alternates tilt direction so the stack looks naturally piled rather
// than uniformly skewed. Multi-extension auto-detect; hides if no file.
function HeritagePhoto({ photo, index = 0 }) {
  const [extIdx, setExtIdx] = useState(0);
  const [hidden, setHidden] = useState(false);

  const handleError = () => {
    if (extIdx < HERITAGE_EXTENSIONS.length - 1) {
      setExtIdx((i) => i + 1);
    } else {
      setHidden(true);
    }
  };

  if (hidden) return null;

  // alternate tilt: -2.5°, +1.8°, -1.4° ...
  const tilt = index % 2 === 0 ? -2.5 : 1.8;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 14, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.2 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ rotate: 0, scale: 1.02, transition: { duration: 0.3 } }}
      className="relative cursor-default"
    >
      <div className="rounded-md bg-cream-50 p-2 shadow-[0_18px_40px_-18px_rgba(31,79,53,0.55)] ring-1 ring-leaf-100">
        <img
          src={`${photo.base}.${HERITAGE_EXTENSIONS[extIdx]}`}
          alt={photo.caption}
          loading="lazy"
          onError={handleError}
          className="block aspect-square w-full object-cover"
        />
        <figcaption className="px-1.5 pt-2.5 text-[11px] leading-snug text-leaf-700/85">
          <span className="font-script text-[15px] text-leaf-700">From the archives</span>
          <span className="mt-0.5 block">{photo.caption}</span>
        </figcaption>
      </div>
      {/* tape strip detail at the top — purely decorative */}
      <span
        aria-hidden
        className="absolute -top-2 left-1/2 h-3 w-12 -translate-x-1/2 -rotate-3 rounded-sm bg-leaf-200/70"
      />
    </motion.figure>
  );
}
