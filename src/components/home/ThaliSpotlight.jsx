import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import ThaliVisual from './ThaliVisual.jsx';
import { KATORIS } from './ThaliSvg.jsx';

export default function ThaliSpotlight() {
  return (
    <section
      id="thali-spotlight"
      className="section relative overflow-hidden py-16 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_50%,rgba(155,211,174,0.35),transparent_55%),radial-gradient(circle_at_20%_80%,rgba(232,163,82,0.18),transparent_60%)]"
      />

      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Copy column */}
        <div className="order-2 lg:order-1">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="pill-leaf"
          >
            <Sparkles className="h-3.5 w-3.5" /> Our Signature
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="heading-display mt-5 text-3xl sm:text-4xl lg:text-5xl"
          >
            The <span className="gradient-text">Kailash Special Thali</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-md text-leaf-700/85"
          >
            Paneer, seasonal sabzi, dal, two rotis, basmati rice, papad and a
            sweet — six bowls of heritage on one brass plate. The plate that
            built our reputation since 1963.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-7 flex flex-wrap items-center gap-4"
          >
            <span className="font-display text-3xl font-bold text-leaf-800">
              ₹240
            </span>
            <span className="text-sm text-leaf-600">/ plate</span>
            <Link to="/menu#cat-thali" className="btn-primary !px-5 !py-2.5">
              See full thali menu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
            }}
            className="mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-leaf-800/85"
          >
            {KATORIS.map((k) => (
              <motion.li
                key={k.label}
                variants={{
                  hidden: { opacity: 0, x: -8 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                }}
                className="flex items-center gap-2"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: k.fill, boxShadow: `0 0 0 2px ${k.stroke}33` }}
                />
                {k.label}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Animated thali column */}
        <div className="order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto aspect-[3/2] w-full max-w-lg"
          >
            {/* warm glow under the plate */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(232,163,82,0.22),transparent_60%)] blur-2xl"
            />
            <motion.div
              className="relative h-full w-full"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ThaliVisual shape="soft" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
