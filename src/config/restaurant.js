// Single source of truth for restaurant business info.
// Anything that varies (links, hours, address) lives here so it's editable
// without touching component code.

export const restaurant = {
  name: 'Kailash Bhojnalaya',
  tagline: 'Add Spice to Your Life',
  established: 1963,
  cuisineTags: ['Pure Vegetarian', 'North Indian', 'South Indian', 'Chinese', 'Thali'],

  address: {
    line1: 'Station Road',
    city: 'Deoghar',
    state: 'Jharkhand',
    country: 'India',
    full: 'Station Road, Deoghar, Jharkhand, India',
  },

  phone: import.meta.env.VITE_PHONE || '+919835777116',
  whatsapp: import.meta.env.VITE_WHATSAPP || '+919835777116',
  email: 'hello@kailashbhojnalya.in',

  hours: [
    { day: 'Monday – Sunday', value: '9:00 AM – 10:30 PM' },
    { day: 'Festive days', value: 'Extended hours during Shravani Mela' },
  ],

  // Live ordering links. Hero CTAs route here.
  orderLinks: {
    zomato:
      import.meta.env.VITE_ZOMATO_URL ||
      'https://www.zomato.com/deoghar/kailash-bhojnalya-station-road',
    swiggy:
      import.meta.env.VITE_SWIGGY_URL ||
      'https://www.swiggy.com/restaurants/kailash-bhojnalya-deoghar',
    googleMaps: 'https://www.google.com/maps/search/?api=1&query=Kailash+Bhojnalaya+Deoghar',
  },

  social: {
    instagram: 'https://instagram.com/kailashbhojnalya',
    facebook: 'https://facebook.com/kailashbhojnalya',
  },

  // Used in About / hero copy.
  story: {
    short:
      'Three generations of pure-vegetarian flavour, lovingly served from Station Road, Deoghar — since 1963.',
    long:
      'For over six decades, Kailash Bhojnalaya has been the heart of authentic vegetarian dining in Deoghar. What began in 1963 as a humble kitchen on Station Road has grown into a beloved name across Jharkhand — celebrated by pilgrims, locals, and travellers for thalis, parathas, and paneer dishes that taste exactly the way they did when our grandfathers first cooked them.',
    pillars: [
      {
        title: 'Pure Vegetarian, Always',
        description: 'Not a single non-veg ingredient ever crosses our kitchen door.',
      },
      {
        title: 'Heritage Recipes',
        description: 'Spice blends and dal techniques passed down three generations.',
      },
      {
        title: 'Locally Sourced',
        description: 'Fresh paneer, seasonal sabzi, and Jharkhand-grown grains every morning.',
      },
    ],
  },

  // Stats shown in hero / about for social proof.
  stats: [
    { value: '60+', label: 'Years of heritage' },
    { value: '2.6K+', label: 'Google reviews & visits' },
    { value: '4.5★', label: 'Average rating' },
    { value: '100%', label: 'Pure vegetarian' },
  ],

  notes: {
    gst: 'GST charges will be extra as per applicable rates.',
    alcohol: 'Alcohol is strictly prohibited on our premises.',
    thaliPackaging: 'An additional ₹20 is charged for thali packaging on takeaway.',
    bookings:
      'We host marriage parties, birthdays, meetings & ceremonies on a per-plate basis. Call to enquire.',
  },
};
