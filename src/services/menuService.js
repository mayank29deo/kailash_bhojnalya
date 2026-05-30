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

export async function fetchMenuCategories() {
  const supabase = getSupabase();
  if (!supabase) return localMenu;

  const { data, error } = await supabase
    .from('menu_categories')
    .select('id, name, tagline, icon, accent, is_featured, sort_order, items:menu_items(*)')
    .order('sort_order', { ascending: true });

  if (error || !data || data.length === 0) {
    if (error && typeof window !== 'undefined') {
      console.warn('[menuService] Supabase fetch failed, using static fallback:', error.message);
    }
    return localMenu;
  }

  return data
    .map(normaliseCategory)
    .filter((c) => c.items.length > 0 || !error); // keep empty categories visible too
}
