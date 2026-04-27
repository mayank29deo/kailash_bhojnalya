/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f3faf5',
          100: '#e3f4e8',
          200: '#c6e7d1',
          300: '#9bd3ae',
          400: '#67b685',
          500: '#3f9a64',
          600: '#2c7d4f',
          700: '#256340',
          800: '#1f4f35',
          900: '#1a412c',
          950: '#0d2418',
        },
        cream: {
          50: '#fdfcf7',
          100: '#fbf8ec',
          200: '#f5eccf',
        },
        spice: {
          400: '#e8a352',
          500: '#d6862c',
          600: '#b66a1d',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      backgroundImage: {
        'leaf-gradient':
          'linear-gradient(135deg, #fdfcf7 0%, #f3faf5 35%, #e3f4e8 70%, #c6e7d1 100%)',
        'leaf-soft':
          'radial-gradient(circle at 20% 10%, rgba(155, 211, 174, 0.35), transparent 55%), radial-gradient(circle at 90% 80%, rgba(232, 163, 82, 0.18), transparent 60%), linear-gradient(180deg, #fdfcf7 0%, #f3faf5 100%)',
        'hero-shine':
          'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(227,244,232,0.7) 50%, rgba(198,231,209,0.65) 100%)',
      },
      boxShadow: {
        glow: '0 20px 60px -25px rgba(44, 125, 79, 0.45)',
        soft: '0 10px 30px -15px rgba(31, 79, 53, 0.25)',
        ring: '0 0 0 1px rgba(44, 125, 79, 0.15), 0 18px 40px -22px rgba(31, 79, 53, 0.35)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        shimmer: 'shimmer 8s linear infinite',
      },
    },
  },
  plugins: [],
};
