import { motion } from 'framer-motion';

// Reusable thali illustration shared between the spotlight section and
// the landing intro. Internal animations (steam, sway, spice dots) loop
// indefinitely; the entrance reveal of katoris and rice plays on mount,
// not on viewport entry, so it works correctly inside a fixed overlay.
//
// The wrapper that mounts <ThaliSvg /> is responsible for its entrance.

export const KATORIS = [
  { angle: -90, label: 'Paneer', fill: '#f4b070', stroke: '#c87a2e' },
  { angle: -30, label: 'Dal', fill: '#f3d27a', stroke: '#b88820' },
  { angle: 30, label: 'Sabzi', fill: '#9bd3ae', stroke: '#3f9a64' },
  { angle: 90, label: 'Roti', fill: '#e8c891', stroke: '#a87c44' },
  { angle: 150, label: 'Chutney', fill: '#d96a6a', stroke: '#8a3030' },
  { angle: 210, label: 'Sweet', fill: '#f7c9d6', stroke: '#bf6c83' },
];

const PLATE_R = 170;
const KATORI_R = 38;
const ORBIT_R = 118;

function polar(angleDeg, radius) {
  const r = (angleDeg * Math.PI) / 180;
  return { x: 200 + radius * Math.cos(r), y: 200 + radius * Math.sin(r) };
}

let gradientCounter = 0;

export default function ThaliSvg({ className = '' }) {
  // unique id prefix per render so multiple ThaliSvgs on the same page
  // (e.g. spotlight + landing intro) don't collide on <defs> ids
  const idPrefix = `thali${++gradientCounter}`;

  return (
    <svg
      viewBox="0 0 400 400"
      className={`h-full w-full drop-shadow-[0_30px_40px_rgba(31,79,53,0.25)] ${className}`}
    >
      <defs>
        <radialGradient id={`${idPrefix}-plateOuter`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fdfcf7" />
          <stop offset="55%" stopColor="#f0d9a3" />
          <stop offset="100%" stopColor="#b58a3e" />
        </radialGradient>
        <radialGradient id={`${idPrefix}-plateInner`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fffbe9" />
          <stop offset="100%" stopColor="#e9cf95" />
        </radialGradient>
        {KATORIS.map((k, i) => (
          <radialGradient key={i} id={`${idPrefix}-katG-${i}`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="40%" stopColor={k.fill} />
            <stop offset="100%" stopColor={k.stroke} />
          </radialGradient>
        ))}
        <radialGradient id={`${idPrefix}-riceG`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0e6c8" />
        </radialGradient>
      </defs>

      {/* Soft halo */}
      <circle cx="200" cy="200" r="190" fill="#f3faf5" opacity="0.6" />

      {/* Plate (with subtle sway) */}
      <motion.g
        style={{ originX: '200px', originY: '200px' }}
        animate={{ rotate: [0, 1.5, -1.5, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="200" cy="200" r={PLATE_R} fill={`url(#${idPrefix}-plateOuter)`} />
        <circle cx="200" cy="200" r={PLATE_R - 18} fill={`url(#${idPrefix}-plateInner)`} />
        <circle
          cx="200"
          cy="200"
          r={PLATE_R - 6}
          fill="none"
          stroke="#a07a36"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Katoris — reveal on mount with stagger */}
        {KATORIS.map((k, i) => {
          const { x, y } = polar(k.angle, ORBIT_R);
          return (
            <motion.g
              key={k.label}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.25 + i * 0.07,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{ originX: `${x}px`, originY: `${y}px` }}
            >
              <ellipse cx={x} cy={y + KATORI_R - 4} rx={KATORI_R - 4} ry="3" fill="#000" opacity="0.12" />
              <circle cx={x} cy={y} r={KATORI_R} fill={k.stroke} />
              <circle cx={x} cy={y} r={KATORI_R - 4} fill={`url(#${idPrefix}-katG-${i})`} />
              <ellipse cx={x - 8} cy={y - 12} rx="14" ry="6" fill="#ffffff" opacity="0.45" />
            </motion.g>
          );
        })}

        {/* Center: rice mound */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          style={{ originX: '200px', originY: '200px' }}
        >
          <ellipse cx="200" cy="208" rx="42" ry="10" fill="#000" opacity="0.1" />
          <circle cx="200" cy="200" r="38" fill={`url(#${idPrefix}-riceG)`} />
          <ellipse cx="195" cy="190" rx="20" ry="6" fill="#ffffff" opacity="0.6" />
          {[
            [188, 195],
            [205, 192],
            [196, 205],
            [212, 200],
            [183, 205],
          ].map(([cx, cy], i) => (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx="2.5"
              ry="1"
              fill="#fffbe9"
              stroke="#d8c490"
              strokeWidth="0.5"
            />
          ))}
        </motion.g>
      </motion.g>

      {/* Steam wisps */}
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M ${190 + i * 10} 170 Q ${198 + i * 10} 150 ${190 + i * 10} 130 Q ${182 + i * 10} 110 ${190 + i * 10} 90`}
          stroke="#bcd9c6"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.6, 0.6, 0],
            y: [0, -20, -40],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Floating spice dots */}
      {[
        { cx: 60, cy: 80, r: 4, c: '#d6862c', d: 0 },
        { cx: 340, cy: 110, r: 3, c: '#3f9a64', d: 1 },
        { cx: 80, cy: 320, r: 5, c: '#b58a3e', d: 0.5 },
        { cx: 350, cy: 320, r: 3, c: '#67b685', d: 1.5 },
        { cx: 30, cy: 200, r: 4, c: '#e8a352', d: 2 },
        { cx: 370, cy: 200, r: 4, c: '#9bd3ae', d: 0.8 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          fill={p.c}
          opacity="0.6"
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: Infinity,
            delay: p.d,
            ease: 'easeInOut',
          }}
        />
      ))}
    </svg>
  );
}
