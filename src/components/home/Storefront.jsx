import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

// Cinematic showcase of the actual restaurant facade. Loads
// /storefront.<ext> with a multi-extension fallback so the owner can
// save the file as .jpg, .jpeg, .png, or .webp without renaming.
// If the file doesn't exist, the component hides itself entirely so
// the surrounding page stays clean.

const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

export default function Storefront({ variant = 'home' }) {
  const [extIdx, setExtIdx] = useState(0);
  const [hidden, setHidden] = useState(false);

  const handleError = () => {
    if (extIdx < EXTENSIONS.length - 1) {
      setExtIdx((i) => i + 1);
    } else {
      setHidden(true);
    }
  };

  if (hidden) return null;

  // Slightly different copy when used on the About page vs the Home page
  const copy =
    variant === 'about'
      ? {
          eyebrow: 'Where it all happens',
          heading: 'Same doors, same kitchen, three generations.',
          body:
            'Every dish on our menu is cooked here, on Station Road. Step in for lunch or dinner — the warm lights stay on till 10:30 PM.',
        }
      : {
          eyebrow: 'Step inside',
          heading: 'Where every plate has been served since 1963.',
          body:
            'Our home on Station Road, Deoghar — the same red signboards, the same warm lights, the same kitchen behind them.',
        };

  return (
    <section className="section my-12 lg:my-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-leaf-100 shadow-[0_40px_80px_-30px_rgba(31,79,53,0.5)] ring-1 ring-leaf-200/60"
      >
        <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[21/9]">
          <motion.img
            src={`/storefront.${EXTENSIONS[extIdx]}`}
            alt="Kailash Bhojnalaya storefront on Station Road, Deoghar"
            loading="lazy"
            onError={handleError}
            initial={{ scale: 1.06 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Bottom-up dark gradient for caption legibility */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-leaf-950/85 via-leaf-900/30 to-transparent"
          />

          {/* Caption block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10 lg:p-14"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <MapPin className="h-3.5 w-3.5" />
              {copy.eyebrow} · Station Road, Deoghar
            </span>
            <h3 className="heading-display mt-4 text-2xl text-white sm:text-3xl lg:text-[40px] lg:leading-[1.05]">
              {copy.heading}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-leaf-50/85 sm:text-base">
              {copy.body}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
