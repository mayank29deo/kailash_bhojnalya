import { useState } from 'react';
import ThaliSvg from './ThaliSvg.jsx';

// Renders /thali-hero.<ext> when present (preferred — a real plated
// thali photograph), falls back to the animated SVG illustration when
// missing. Extensions are tried in order until one loads, so the user
// can save the file as .jpg, .jpeg, .png, or .webp without renaming.

const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

export default function ThaliVisual({ className = '', shape = 'soft' }) {
  const [extIdx, setExtIdx] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-[2rem]';

  const handleError = () => {
    if (extIdx < EXTENSIONS.length - 1) {
      setExtIdx((i) => i + 1);
    } else {
      setAllFailed(true);
    }
  };

  if (allFailed) {
    return (
      <div className={`relative h-full w-full overflow-hidden ${radius} ${className}`}>
        <ThaliSvg />
      </div>
    );
  }

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${radius} bg-leaf-50 shadow-[0_40px_80px_-25px_rgba(31,79,53,0.55)] ring-1 ring-leaf-200/60 ${className}`}
    >
      <img
        src={`/thali-hero.${EXTENSIONS[extIdx]}`}
        alt="Traditional Indian thali at Kailash Bhojnalaya"
        onError={handleError}
        className="h-full w-full object-cover"
        loading="eager"
      />
      {/* soft inner sheen so the photo sits beautifully against the page */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/10"
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${radius} ring-1 ring-inset ring-white/30`}
      />
    </div>
  );
}
