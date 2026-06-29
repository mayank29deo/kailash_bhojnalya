// Menu data — extracted directly from the printed menu (with handwritten
// price updates honoured where present). Single source of truth used by
// the Menu page and any preview snippets in the home page.
//
// Schema:
//   id        — stable kebab-case slug, used as React key
//   name      — display name
//   price     — string (₹ included so we can render dual prices like '20 / 25')
//   priceNum  — numeric for sorting / range filters
//   tags      — optional badges shown on a card
//   description — optional flavour text shown on hover or expanded card
//
// All items are pure vegetarian; the `veg` flag is implicit.

export const menuMeta = {
  notice: 'GST charges extra. Pure vegetarian kitchen.',
  packagingNote: 'A flat ₹20 delivery charge is added to every order.',
};

export const menuCategories = [
  {
    id: 'thali',
    name: 'Thali',
    tagline: 'Complete meals, the heart of Kailash',
    icon: '🍽️',
    accent: 'from-leaf-200/70 to-leaf-100/60',
    featured: true,
    items: [
      {
        id: 'thali-rice',
        name: 'Rice Thali',
        price: '₹100',
        priceNum: 100,
        description: 'Dal, sabzi, bhujia, chatni — served with steamed rice.',
      },
      {
        id: 'thali-roti',
        name: 'Roti Thali (4 pcs)',
        price: '₹90',
        priceNum: 90,
        description: 'Dal, sabzi, bhujia, chatni with four tawa rotis.',
      },
      {
        id: 'thali-butter-roti',
        name: 'Butter Roti Thali (4 pcs)',
        price: '₹110',
        priceNum: 110,
        description: 'Dal, sabzi, bhujia, chatni with four buttered rotis.',
      },
      {
        id: 'thali-basmati',
        name: 'Basmati Rice Thali',
        price: '₹130',
        priceNum: 130,
        description: 'Long-grain basmati with dal, sabzi, bhujia, chatni.',
      },
      {
        id: 'thali-green-veg',
        name: 'Green Veg Thali',
        price: '₹170',
        priceNum: 170,
        description: 'Two seasonal sabzis, green bhujia, dal, two rotis & rice.',
        tags: ['Popular'],
      },
      {
        id: 'thali-special',
        name: 'Kailash Special Thali',
        price: '₹240',
        priceNum: 240,
        description:
          'Paneer, seasonal sabzi, dal, two rotis, basmati rice, papad & sweet — the signature spread.',
        tags: ['Signature', 'Recommended'],
      },
      {
        id: 'thali-chinese',
        name: 'Chinese Thali',
        price: '₹200',
        priceNum: 200,
        description: 'Chowmein, fried rice, manchurian, paneer chilli & Chinese salad.',
      },
    ],
  },
  {
    id: 'paneer',
    name: 'Paneer',
    tagline: 'Fresh-made paneer in twelve avatars',
    icon: '🧀',
    accent: 'from-cream-100/80 to-leaf-50/80',
    featured: true,
    items: [
      { id: 'paneer-butter-masala', name: 'Paneer Butter Masala', price: '₹200', priceNum: 200 },
      {
        id: 'shahi-paneer',
        name: 'Shahi Paneer',
        price: '₹250',
        priceNum: 250,
        tags: ['Rich'],
      },
      { id: 'malai-kofta', name: 'Malai Kofta', price: '₹250', priceNum: 250 },
      { id: 'mattar-paneer', name: 'Mattar Paneer', price: '₹190', priceNum: 190 },
      { id: 'paneer-pakoda', name: 'Paneer Pakoda (8 pcs)', price: '₹170', priceNum: 170 },
      { id: 'paneer-do-pyaja', name: 'Paneer Do Pyaja', price: '₹230', priceNum: 230 },
      { id: 'paneer-kadhai', name: 'Paneer Kadhai', price: '₹230', priceNum: 230 },
      { id: 'mix-veg', name: 'Mix Veg', price: '₹180', priceNum: 180 },
      { id: 'palak-paneer', name: 'Palak Paneer', price: '₹200', priceNum: 200 },
      { id: 'paneer-chatpatta', name: 'Paneer Chatpatta', price: '₹230', priceNum: 230 },
      { id: 'paneer-garlic', name: 'Paneer Garlic', price: '₹230', priceNum: 230 },
      {
        id: 'paneer-tikka',
        name: 'Paneer Tikka',
        price: '₹270',
        priceNum: 270,
        tags: ['Tandoor'],
      },
    ],
  },
  {
    id: 'soya',
    name: 'Soya Veggies',
    tagline: 'Smoky, hearty, protein-rich',
    icon: '🌱',
    accent: 'from-leaf-100/70 to-cream-50/70',
    items: [
      { id: 'soya-veggets', name: 'Soya Veggets', price: '₹150', priceNum: 150 },
      { id: 'soya-ball-manchurian', name: 'Soya Ball Manchurian', price: '₹160', priceNum: 160 },
      { id: 'soya-chikka-butter', name: 'Soya Chikka Butter Masala', price: '₹200', priceNum: 200 },
      { id: 'soya-chop-stick', name: 'Soya Chop Stick (Dry)', price: '₹170', priceNum: 170 },
      { id: 'soya-bhurji', name: 'Soya Scrambled Bhurji', price: '₹150', priceNum: 150 },
      { id: 'soya-chilli', name: 'Soya Chilli', price: '₹210', priceNum: 210 },
    ],
  },
  {
    id: 'mushroom',
    name: 'Mushroom',
    tagline: 'Earthy, slow-cooked classics',
    icon: '🍄',
    accent: 'from-cream-100/70 to-leaf-100/60',
    items: [
      { id: 'mushroom-butter-masala', name: 'Mushroom Butter Masala', price: '₹230', priceNum: 230 },
      { id: 'mushroom-do-pyaja', name: 'Mushroom Do Pyaja', price: '₹240', priceNum: 240 },
      { id: 'mushroom-kadhai', name: 'Mushroom Kadhai', price: '₹250', priceNum: 250 },
      { id: 'mushroom-capsicum', name: 'Mushroom Capsicum Masala', price: '₹250', priceNum: 250 },
      { id: 'mushroom-garlic', name: 'Mushroom Garlic', price: '₹250', priceNum: 250 },
    ],
  },
  {
    id: 'green-veg',
    name: 'Green Veg',
    tagline: 'Garden-fresh seasonal sabzis',
    icon: '🥬',
    accent: 'from-leaf-100/70 to-leaf-50/60',
    items: [
      { id: 'chana-masala', name: 'Chana Masala', price: '₹160', priceNum: 160 },
      {
        id: 'aloo-trio',
        name: 'Aloo Do Pyaja / Dum Aloo / Aloo Jeera',
        price: '₹110',
        priceNum: 110,
      },
      {
        id: 'aloo-gobhi-trio',
        name: 'Aloo Gobhi / Aloo Palak / Aloo Parwal',
        price: '₹130',
        priceNum: 130,
      },
      {
        id: 'gobhi-parwal-bhindi',
        name: 'Gobhi / Parwal / Bhindi Masala',
        price: '₹150',
        priceNum: 150,
      },
    ],
  },
  {
    id: 'dal',
    name: 'Dal',
    tagline: 'Slow-simmered lentils',
    icon: '🥣',
    accent: 'from-cream-100/80 to-leaf-50/70',
    items: [
      { id: 'dal-fry', name: 'Dal Fry', price: '₹110', priceNum: 110 },
      { id: 'butter-dal-fry', name: 'Butter Dal Fry', price: '₹130', priceNum: 130 },
      { id: 'paneer-tadka', name: 'Paneer Tadka', price: '₹150', priceNum: 150 },
      { id: 'butter-tadka', name: 'Butter Tadka', price: '₹130', priceNum: 130 },
      { id: 'plain-tadka', name: 'Plain Tadka', price: '₹110', priceNum: 110 },
      {
        id: 'dal-makhani',
        name: 'Dal Makhani',
        price: '₹150',
        priceNum: 150,
        tags: ['House favourite'],
      },
    ],
  },
  {
    id: 'bhujiya',
    name: 'Bhujiya',
    tagline: 'Stir-fried, light, full of crunch',
    icon: '🥦',
    accent: 'from-leaf-100/60 to-cream-100/70',
    items: [
      { id: 'aloo-bhujiya', name: 'Aloo Bhujiya', price: '₹60', priceNum: 60 },
      { id: 'parval-bhujiya', name: 'Parval Bhujiya', price: '₹90', priceNum: 90 },
      { id: 'bhindi-bhujiya', name: 'Bhindi Bhujiya', price: '₹90', priceNum: 90 },
      { id: 'karela-bhujiya', name: 'Karela Bhujiya', price: '₹90', priceNum: 90 },
      { id: 'gobhi-bhujiya', name: 'Gobhi Bhujiya', price: '₹90', priceNum: 90 },
      { id: 'paneer-bhujiya', name: 'Paneer Bhujiya', price: '₹150', priceNum: 150 },
    ],
  },
  {
    id: 'roti',
    name: 'Roti & Parantha',
    tagline: 'From the tandoor & tawa',
    icon: '🫓',
    accent: 'from-cream-100/80 to-leaf-50/60',
    items: [
      { id: 'tawa-roti', name: 'Tawa Roti', price: '₹10', priceNum: 10 },
      { id: 'butter-tawa-roti', name: 'Butter Tawa Roti', price: '₹15', priceNum: 15 },
      { id: 'tandoori-roti', name: 'Tandoori Roti', price: '₹15', priceNum: 15 },
      { id: 'butter-tandoori-roti', name: 'Butter Tandoori Roti', price: '₹20', priceNum: 20 },
      { id: 'plain-parantha', name: 'Plain Parantha (Ghee)', price: '₹40', priceNum: 40 },
      { id: 'butter-naan', name: 'Butter Naan', price: '₹60', priceNum: 60 },
      { id: 'stuff-naan', name: 'Stuff Naan / Kulcha', price: '₹70', priceNum: 70 },
      { id: 'aloo-parantha', name: 'Aloo Parantha', price: '₹40', priceNum: 40 },
      { id: 'paneer-parantha', name: 'Paneer Parantha', price: '₹60', priceNum: 60 },
      { id: 'gobhi-parantha', name: 'Gobhi Parantha', price: '₹60', priceNum: 60 },
      { id: 'lachha-parantha', name: 'Lachha Parantha', price: '₹40', priceNum: 40 },
      {
        id: 'millet-roti',
        name: 'Bajara / Ragi / Makka / Jowar Roti',
        price: '₹20 / ₹25',
        priceNum: 20,
        description: '₹20 plain · ₹25 buttered',
      },
    ],
  },
  {
    id: 'rice',
    name: 'Rice',
    tagline: 'Steamed, fragrant, and biryani-fresh',
    icon: '🍚',
    accent: 'from-leaf-50/80 to-cream-100/70',
    items: [
      { id: 'jeera-rice', name: 'Jeera Rice', price: '₹90', priceNum: 90 },
      { id: 'steam-rice-fine', name: 'Steam Rice (Fine)', price: '₹70', priceNum: 70 },
      { id: 'steam-rice-miniket', name: 'Steam Rice (Miniket)', price: '₹50', priceNum: 50 },
      {
        id: 'veg-biryani',
        name: 'Veg Biryani',
        price: '₹140',
        priceNum: 140,
        tags: ['Bestseller'],
      },
      { id: 'veg-fried-rice', name: 'Veg Fried Rice', price: '₹130', priceNum: 130 },
      { id: 'veg-pulao', name: 'Veg Pulao', price: '₹130', priceNum: 130 },
      { id: 'mutter-pulao', name: 'Mutter Pulao', price: '₹130', priceNum: 130 },
    ],
  },
  {
    id: 'south-indian',
    name: 'South Indian',
    tagline: 'Crisp dosas & soft idlis',
    icon: '🥞',
    accent: 'from-leaf-100/70 to-cream-50/70',
    items: [
      { id: 'plain-dosa', name: 'Plain Dosa', price: '₹80', priceNum: 80 },
      { id: 'masala-dosa', name: 'Masala Dosa', price: '₹90', priceNum: 90 },
      { id: 'onion-dosa', name: 'Onion Dosa', price: '₹80', priceNum: 80 },
      { id: 'masala-paneer-dosa', name: 'Masala Paneer Dosa', price: '₹120', priceNum: 120 },
      { id: 'butter-masala-dosa', name: 'Butter Masala Dosa', price: '₹100', priceNum: 100 },
      { id: 'cheese-plain-dosa', name: 'Cheese Plain Dosa', price: '₹120', priceNum: 120 },
      { id: 'cheese-masala-dosa', name: 'Cheese Masala Dosa', price: '₹130', priceNum: 130 },
      { id: 'uttapam', name: 'Uttapam (Onion / Tomato)', price: '₹60', priceNum: 60 },
      { id: 'idli-sambar', name: 'Idli Sambar (2 pcs)', price: '₹60', priceNum: 60 },
    ],
  },
  {
    id: 'chinese',
    name: 'Chinese',
    tagline: 'Indo-Chinese, the Kailash way',
    icon: '🥡',
    accent: 'from-cream-100/70 to-leaf-100/70',
    items: [
      { id: 'veg-chowmein', name: 'Veg Chowmein', price: '₹120', priceNum: 120 },
      { id: 'special-chowmein', name: 'Special Chowmein', price: '₹160', priceNum: 160 },
      {
        id: 'mushroom-chilli',
        name: 'Mushroom Chilli (Dry / Gravy)',
        price: '₹240',
        priceNum: 240,
      },
      {
        id: 'paneer-chilli',
        name: 'Paneer Chilli (Dry / Gravy)',
        price: '₹230',
        priceNum: 230,
      },
      { id: 'veg-manchurian', name: 'Veg Manchurian', price: '₹190', priceNum: 190 },
    ],
  },
  {
    id: 'papad-salad',
    name: 'Papad & Salad',
    tagline: 'Sides, raitas & coolers',
    icon: '🥗',
    accent: 'from-leaf-50/70 to-cream-100/70',
    items: [
      { id: 'papad', name: 'Papad', price: '₹15', priceNum: 15 },
      { id: 'green-salad', name: 'Green Salad', price: '₹60', priceNum: 60 },
      { id: 'onion-salad', name: 'Onion Salad', price: '₹30', priceNum: 30 },
      {
        id: 'raita',
        name: 'Raita (Mix / Pineapple / Boondi)',
        price: '₹80',
        priceNum: 80,
      },
      { id: 'dahi-milk', name: 'Dahi / Milk (200 ml)', price: '₹30', priceNum: 30 },
    ],
  },
  {
    id: 'milkshakes',
    name: 'Milkshakes',
    tagline: 'Thick, creamy, hand-blended',
    icon: '🥤',
    accent: 'from-cream-100/80 to-leaf-100/60',
    items: [
      { id: 'shake-chocolate', name: 'Chocolate Milkshake', price: '₹119', priceNum: 119 },
      { id: 'shake-vanilla', name: 'Vanilla Milkshake', price: '₹119', priceNum: 119 },
      { id: 'shake-strawberry', name: 'Strawberry Milkshake', price: '₹119', priceNum: 119 },
      { id: 'shake-oreo', name: 'Oreo Milkshake', price: '₹119', priceNum: 119 },
      {
        id: 'shake-butterscotch',
        name: 'Butterscotch Milkshake',
        price: '₹129',
        priceNum: 129,
      },
      { id: 'shake-blackcurrent', name: 'Black Current Milkshake', price: '₹119', priceNum: 119 },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    tagline: 'Sweet endings',
    icon: '🍮',
    accent: 'from-leaf-100/60 to-cream-100/80',
    items: [
      { id: 'gulab-jamun', name: 'Gulab Jamun', price: '₹25', priceNum: 25 },
      { id: 'ras-malai', name: 'Ras Malai', price: '₹60', priceNum: 60 },
      { id: 'kheer', name: 'Kheer', price: '₹60', priceNum: 60 },
    ],
  },
];

// Helpers used by UI / future Supabase sync.
export function getCategoryById(id) {
  return menuCategories.find((c) => c.id === id) || null;
}

export function getAllItems() {
  return menuCategories.flatMap((c) =>
    c.items.map((item) => ({ ...item, categoryId: c.id, categoryName: c.name }))
  );
}

export function searchItems(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAllItems().filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.categoryName.toLowerCase().includes(q) ||
      (i.description && i.description.toLowerCase().includes(q))
  );
}

// Curated picks shown on the home page preview.
export const featuredItemIds = [
  'thali-special',
  'shahi-paneer',
  'paneer-tikka',
  'veg-biryani',
  'dal-makhani',
  'masala-dosa',
];

export function getFeaturedItems() {
  const all = getAllItems();
  return featuredItemIds
    .map((id) => all.find((i) => i.id === id))
    .filter(Boolean);
}
