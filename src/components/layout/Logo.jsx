import { useState } from 'react';

// Logo component — tries the user-supplied asset first, falls back to a
// crafted SVG so the layout never breaks before the real logo is dropped in.
//
// The uploaded logo is a square wordmark (leaf emblem + "Kailash Bhojnalaya"
// text). We render it with `object-contain` and rounded corners so nothing
// is cropped, and skip the side text wordmark by default since the logo
// already contains it. Pass `withWordmark` if you need the script tagline
// alongside the mark in marketing surfaces.

const FALLBACK_PATHS = ['/logo.png', '/logo.jpg', '/logo.jpeg', '/logo.svg'];

export default function Logo({ size = 52, withWordmark = false, className = '' }) {
  const [pathIndex, setPathIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  const tryNext = () => {
    if (pathIndex < FALLBACK_PATHS.length - 1) {
      setPathIndex((i) => i + 1);
    } else {
      setAllFailed(true);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {allFailed ? (
        <SvgFallback size={size} />
      ) : (
        <img
          src={FALLBACK_PATHS[pathIndex]}
          alt="Kailash Bhojnalaya logo"
          width={size}
          height={size}
          onError={tryNext}
          className="rounded-xl bg-white object-contain p-0.5 shadow-soft"
          style={{ width: size, height: size }}
        />
      )}
      {withWordmark && (
        <div className="flex flex-col leading-tight">
          <span className="font-script text-[15px] text-leaf-700">
            Pure Vegetarian · Since 1963
          </span>
        </div>
      )}
    </div>
  );
}

function SvgFallback({ size }) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-leaf-100 to-leaf-300 shadow-soft ring-2 ring-leaf-200/70"
      style={{ width: size, height: size }}
      aria-label="Kailash Bhojnalaya"
    >
      <svg viewBox="0 0 64 64" width={size * 0.62} height={size * 0.62} aria-hidden="true">
        <defs>
          <linearGradient id="leafG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#67b685" />
            <stop offset="100%" stopColor="#256340" />
          </linearGradient>
        </defs>
        <path
          d="M32 8 C 18 18, 18 38, 32 56 C 46 38, 46 18, 32 8 Z"
          fill="url(#leafG)"
        />
        <path d="M32 14 L 32 50" stroke="#fdfcf7" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M32 22 C 26 26, 24 32, 28 38"
          stroke="#fdfcf7"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M32 22 C 38 26, 40 32, 36 38"
          stroke="#fdfcf7"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
