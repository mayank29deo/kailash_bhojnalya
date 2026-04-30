import { useState } from 'react';
import { motion } from 'framer-motion';

// Subtle cinematic backdrop for the hero — the actual restaurant
// storefront, heavily blurred and wrapped in a cream-leaf wash so the
// brand palette stays dominant. Adds "place" without competing with
// the wordmark and order cards in the foreground.
//
// Multi-extension fallback so the same file works whether saved as
// .jpg / .jpeg / .png / .webp. Hides itself if no file is found.

const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

export default function HeroBackdrop() {
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

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Storefront image — softly blurred, slow Ken Burns zoom */}
      <motion.img
        src={`/storefront.${EXTENSIONS[extIdx]}`}
        alt=""
        onError={handleError}
        loading="eager"
        decoding="async"
        initial={{ scale: 1.08 }}
        animate={{ scale: [1.08, 1.16, 1.08] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        style={{ filter: 'blur(6px) saturate(1.05)' }}
      />

      {/* Lighter cream-leaf wash — lets the storefront warmth come through */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-50/55 via-leaf-50/40 to-leaf-100/55" />

      {/* Top vignette to soften the navbar boundary */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cream-50/70 to-transparent" />
      {/* Bottom vignette so the section blends into the next */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-cream-50/85 to-transparent" />
    </div>
  );
}
