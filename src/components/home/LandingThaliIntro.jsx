import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ThaliVisual from './ThaliVisual.jsx';

// Plays once per browser session: a beautifully plated thali descends
// gently from above, settles in the centre with a soft golden glow and
// a heritage tagline, then is carried downward off-screen toward the
// signature thali section.
//
// Designed for a "professional restaurant" feel rather than a playful
// drop — slow easing, minimal rotation, breathing-room hold.

const STORAGE_KEY = 'kb-thali-intro-shown';

const TOTAL = 5.5;
// keyframe progress points
const ENTER_END = 0.32; // 0.00 → 1.76s : descend
const HOLD_END = 0.74;  // 1.76 → 4.07s : sit & breathe
// 0.74 → 1.00 (4.07 → 5.50s)            : carry away

// silky, restaurant-grade easing
const enterEase = [0.16, 1, 0.3, 1];   // easeOutQuint
const exitEase = [0.7, 0, 0.84, 0];    // easeInQuint

export default function LandingThaliIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, '1');
    setShow(true);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="thali-intro"
          className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          {/* refined backdrop — cream-leaf wash with a touch of blur */}
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-cream-50/95 via-leaf-50/85 to-leaf-100/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: TOTAL,
              times: [0, ENTER_END * 0.6, HOLD_END, 1],
              ease: 'easeInOut',
            }}
          />

          {/* warm golden halo behind the plate during the hold */}
          <motion.div
            aria-hidden
            className="absolute h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(232,163,82,0.35),rgba(155,211,174,0.18)_45%,transparent_70%)]"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: [0, 0, 0.85, 0.85, 0],
              scale: [0.7, 0.85, 1, 1.04, 1.1],
            }}
            transition={{
              duration: TOTAL,
              times: [0, ENTER_END * 0.7, ENTER_END, HOLD_END, 1],
              ease: 'easeInOut',
            }}
          />

          {/* the thali itself */}
          <motion.div
            className="relative aspect-[3/2] w-80 sm:w-[32rem] lg:w-[40rem]"
            initial={{ y: '-100vh', scale: 0.7, opacity: 0, rotate: -4 }}
            animate={{
              y: ['-100vh', '0%', '0%', '100vh'],
              scale: [0.7, 1, 1.025, 0.55],
              opacity: [0, 1, 1, 0],
              rotate: [-4, 0, 0, 3],
            }}
            transition={{
              duration: TOTAL,
              times: [0, ENTER_END, HOLD_END, 1],
              ease: [enterEase, [0.42, 0, 0.58, 1], exitEase],
            }}
            onAnimationComplete={() => setShow(false)}
          >
            <ThaliVisual shape="soft" />

            {/* heritage tagline appears mid-hold, leaves before exit */}
            <motion.div
              className="absolute inset-x-0 -bottom-20 text-center sm:-bottom-24"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: [0, 0, 0, 1, 1, 0], y: [12, 12, 12, 0, 0, -6] }}
              transition={{
                duration: TOTAL,
                times: [0, ENTER_END, ENTER_END + 0.08, ENTER_END + 0.18, HOLD_END - 0.04, HOLD_END],
                ease: 'easeInOut',
              }}
            >
              <div className="mx-auto flex max-w-md items-center justify-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-leaf-400" />
                <p className="font-script text-2xl text-leaf-700 sm:text-3xl">
                  Welcome to Kailash Bhojnalaya
                </p>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-leaf-400" />
              </div>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.4em] text-leaf-600/85">
                Our signature thali · Since 1963
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
