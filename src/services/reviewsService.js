import { getSupabase } from '../lib/supabase.js';

// Reviews/testimonials. Until the Supabase project is wired up we fall back
// to a curated set so the home page still has social proof out of the box.

// Curated from real Google Maps reviews — verified Local Guides prioritised.
// Light grammar cleanup, voice preserved.

const FALLBACK_REVIEWS = [
  {
    id: 'mayank-narayan',
    name: 'Mayank Narayan',
    meta: 'Local Guide · 23 reviews',
    localGuide: true,
    rating: 5,
    text:
      'The veg menu is a perfect go-to. Love the food here. Would rate the service as one of the best in Deoghar.',
  },
  {
    id: 'susmita-paul',
    name: 'Susmita Paul',
    meta: 'Local Guide · 492 reviews',
    localGuide: true,
    rating: 5,
    text:
      'Good hygienic veg restaurant. Quantity justifies its price. Delicious food.',
  },
  {
    id: 'gulshan-kumar',
    name: 'Gulshan Kumar',
    meta: 'Local Guide · 27 reviews',
    localGuide: true,
    rating: 5,
    text:
      'One of the best restaurants you can trust for great food quality and timely service — at very affordable pricing. Staff is quick, management is good. Definitely visit with family or friends.',
  },
  {
    id: 'yatin-sharma',
    name: 'Yatin Sharma',
    meta: 'Local Guide · 107 reviews',
    localGuide: true,
    rating: 5,
    text:
      'The best place in terms of price, service, food quality, and atmosphere in Baidyanath Jyotirlinga.',
  },
  {
    id: 'amiya-sagar',
    name: 'Amiya Sagar',
    meta: 'Local Guide · 147 reviews',
    localGuide: true,
    rating: 5,
    text:
      'Place and ambience is very good. The best thing I liked is they serve fresh rotis in small amounts — timely, so you don\'t have to wait, even if you order more.',
  },
  {
    id: 'lalit-krishna',
    name: 'Lalit Krishna Nayak',
    meta: 'Local Guide · 45 reviews',
    localGuide: true,
    rating: 5,
    text:
      'Perfect price for perfect food. Taste and staff are cooperative. Overall good experience near Baidyanath Dham railway station. Without onion-garlic food — superb!',
  },
  {
    id: 'sonu-kumar',
    name: 'Sonu Kumar',
    meta: 'Verified Google review',
    rating: 5,
    text:
      'Amazing restaurant with a wide variety of menu options. Serving food in Deoghar since 1963.',
  },
  {
    id: 'diya-parekh',
    name: 'Diya Parekh',
    meta: 'Verified Google review',
    rating: 5,
    text:
      'The taste was really good — like home-made food. Staff service was good and the owner\'s behaviour was also good. Thanks for the better service and food.',
  },
  {
    id: 'harsh-gupta',
    name: 'Harsh Gupta',
    meta: 'Local Guide · 49 reviews',
    localGuide: true,
    rating: 5,
    text: 'Great food. Great proportion and taste. I loved the paneer paratha.',
  },
  {
    id: 'vishal-gupta',
    name: 'Vishal Gupta',
    meta: 'Local Guide · 43 reviews',
    localGuide: true,
    rating: 5,
    text:
      'The best budget-friendly food options are here, and you can get very good quality of food too.',
  },
  {
    id: 'rudraksh',
    name: 'Rudraksh',
    meta: 'Local Guide · 7 reviews',
    localGuide: true,
    rating: 5,
    text:
      'Wonderful food and service. The one and only option in the city for the best vegetarian food.',
  },
  {
    id: 'akansha-kumari',
    name: 'Akansha Kumari',
    meta: 'Verified Google review',
    rating: 5,
    text:
      'Kailash Bhojnalaya offered a remarkable dining experience for vegetarians. The restaurant boasted a welcoming ambiance and an enticing aroma that immediately captivated diners.',
  },
  {
    id: 'puneet-bahri',
    name: 'Puneet Bahri',
    meta: 'Local Guide · 7 reviews',
    localGuide: true,
    rating: 5,
    text:
      'A very neat and clean place. They serve well. They might take a little time to prepare your dish but it will be perfectly cooked. The way of serving is also good.',
  },
  {
    id: 'neharika',
    name: 'Neharika',
    meta: 'Local Guide · 14 reviews',
    localGuide: true,
    rating: 5,
    text:
      'Dishes were so luscious that you will not miss non-veg any more. Staff were well behaved, and food ordered and delivered within 5–8 minutes.',
  },
  {
    id: 'mini-mahanta',
    name: 'Mini Mahanta',
    meta: 'Verified Google review',
    rating: 5,
    text:
      'Food quality is really good. Food without onion-garlic also available. Good service too.',
  },
];

export async function fetchReviews({ limit = 24 } = {}) {
  const supabase = getSupabase();
  if (!supabase) return FALLBACK_REVIEWS.slice(0, limit);

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data || data.length === 0) {
    return FALLBACK_REVIEWS.slice(0, limit);
  }
  return data;
}
