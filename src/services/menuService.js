import { getSupabase } from '../lib/supabase.js';
import { menuCategories as localMenu } from '../data/menu.js';

// Reads menu from Supabase (the source of truth after seed-menu.mjs has
// run) and normalises snake_case columns into the camelCase the app
// has historically used. Falls back to the bundled static menu if
// Supabase is unconfigured, errors out, or returns zero rows.
//
// Static-fallback is intentional: it keeps the menu page rendering
// during outages and during first-deploy windows before env vars or
// the seed have landed.

function normaliseItem(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    price: row.price,
    priceNum: row.price_num,
    tags: row.tags ?? [],
    imageUrl: row.image_url ?? null,
    isFeatured: Boolean(row.is_featured),
    isActive: Boolean(row.is_active),
    sortOrder: row.sort_order ?? 0,
  };
}

function normaliseCategory(row) {
  const items = (row.items || [])
    .filter((i) => i.is_active !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(normaliseItem);
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline ?? undefined,
    icon: row.icon ?? undefined,
    accent: row.accent ?? undefined,
    isFeatured: Boolean(row.is_featured),
    sortOrder: row.sort_order ?? 0,
    items,
  };
}

const FETCH_TIMEOUT_MS = 8000;

// Race the Supabase request against a timeout so a stalled mobile
// connection never leaves the menu page empty. On any failure
// (network drop, timeout, error response, empty response, thrown
// exception) we return the bundled static menu instead of throwing.
//
// Combined with Menu.jsx using localMenu as its initial state, the
// effect is: customers ALWAYS see the menu instantly, and DB data
// silently replaces it if it arrives.

export async function fetchMenuCategories() {
  const supabase = getSupabase();
  if (!supabase) return localMenu;

  try {
    const fetchPromise = supabase
      .from('menu_categories')
      .select('id, name, tagline, icon, accent, is_featured, sort_order, items:menu_items(*)')
      .order('sort_order', { ascending: true });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase request timed out')), FETCH_TIMEOUT_MS)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (error || !data || data.length === 0) {
      if (error && typeof window !== 'undefined') {
        console.warn('[menuService] Supabase fetch failed, using static fallback:', error.message);
      }
      return localMenu;
    }

    return data.map(normaliseCategory);
  } catch (err) {
    if (typeof window !== 'undefined') {
      console.warn('[menuService] fetch crashed, using static fallback:', err?.message);
    }
    return localMenu;
  }
}
