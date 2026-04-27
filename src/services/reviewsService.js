import { getSupabase } from '../lib/supabase.js';

// Reviews/testimonials. Until the Supabase project is wired up we fall back
// to a curated set so the home page still has social proof out of the box.

const FALLBACK_REVIEWS = [
  {
    id: 'r1',
    name: 'Anjali Sharma',
    location: 'Pilgrim from Patna',
    rating: 5,
    text:
      'The Kailash Special Thali is the most comforting meal I have ever had after Baba Baidyanath darshan. Tastes like home.',
  },
  {
    id: 'r2',
    name: 'Rohit Verma',
    location: 'Local, Deoghar',
    rating: 5,
    text:
      'Three generations of my family have eaten here. The dal makhani and butter naan never miss. Pure veg and clean every single time.',
  },
  {
    id: 'r3',
    name: 'Meera Kulkarni',
    location: 'Visiting from Mumbai',
    rating: 5,
    text:
      'Spotless kitchen, warm service, and a paneer butter masala that genuinely surprised us. Easy 5 stars.',
  },
  {
    id: 'r4',
    name: 'Sandeep K.',
    location: 'Frequent traveller',
    rating: 4,
    text:
      'Best vegetarian restaurant on Station Road. Their thali at ₹240 is unbeatable value — lots of variety, generous portions.',
  },
];

export async function fetchReviews({ limit = 6 } = {}) {
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
