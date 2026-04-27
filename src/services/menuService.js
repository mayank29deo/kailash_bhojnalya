import { getSupabase } from '../lib/supabase.js';
import { menuCategories as localMenu } from '../data/menu.js';

// Menu service — currently reads from the bundled menu data.
// Once the Supabase `menu_items` table is populated the same shape is
// returned, so callers don't change.

export async function fetchMenuCategories() {
  const supabase = getSupabase();
  if (!supabase) return localMenu;

  const { data, error } = await supabase
    .from('menu_categories')
    .select('id, name, tagline, icon, accent, items:menu_items(*)')
    .order('sort_order', { ascending: true });

  if (error || !data || data.length === 0) {
    return localMenu;
  }
  return data;
}
