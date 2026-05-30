import { getSupabase } from '../lib/supabase.js';

// Server-of-truth wrapper for everything Bindeshwar's admin dashboard
// reads/writes. All functions assume the caller is an authenticated
// admin (RLS enforces this on the server). They return either the
// fresh data or throw — components display error toasts.

// ─────────────────────────────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────────────────────────────

export async function listOrders({ status, limit = 200 } = {}) {
  const supabase = getSupabase();
  if (!supabase) return [];

  let q = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (status) q = q.eq('status', status);

  const { data, error } = await q;
  if (error) throw new Error(`Failed to load orders: ${error.message}`);
  return data ?? [];
}

export async function updateOrderStatus(orderId, status) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select('*')
    .single();
  if (error) throw new Error(`Failed to update order: ${error.message}`);
  return data;
}

// Pulls counts + revenue for the overview dashboard. Done in one call
// so the dashboard loads with a single round-trip.
export async function fetchOverviewStats() {
  const supabase = getSupabase();
  if (!supabase) {
    return { todayCount: 0, todayRevenue: 0, totalCount: 0, statusCounts: {} };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const [{ data: todayOrders, error: e1 }, { data: allOrders, error: e2 }] = await Promise.all([
    supabase.from('orders').select('total,status,created_at').gte('created_at', todayIso),
    supabase.from('orders').select('status'),
  ]);
  if (e1 || e2) throw new Error((e1 || e2).message);

  const statusCounts = (allOrders || []).reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const todayRevenue = (todayOrders || []).reduce((sum, o) => sum + (o.total || 0), 0);

  return {
    todayCount: (todayOrders || []).length,
    todayRevenue,
    totalCount: (allOrders || []).length,
    statusCounts,
  };
}

// ─────────────────────────────────────────────────────────────────────
// Menu (categories + items)
// ─────────────────────────────────────────────────────────────────────

export async function listMenuForAdmin() {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('menu_categories')
    .select('id, name, tagline, icon, accent, sort_order, is_featured, items:menu_items(*)')
    .order('sort_order', { ascending: true });
  if (error) throw new Error(`Failed to load menu: ${error.message}`);
  return data ?? [];
}

export async function updateMenuItem(id, patch) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('menu_items')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(`Failed to update item: ${error.message}`);
  return data;
}

export async function createMenuItem(payload) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('menu_items')
    .insert(payload)
    .select('*')
    .single();
  if (error) throw new Error(`Failed to create item: ${error.message}`);
  return data;
}

export async function deleteMenuItem(id) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete item: ${error.message}`);
  return true;
}

export async function updateCategory(id, patch) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('menu_categories')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(`Failed to update category: ${error.message}`);
  return data;
}

// ─────────────────────────────────────────────────────────────────────
// Image upload (menu-images bucket)
// ─────────────────────────────────────────────────────────────────────

export async function uploadMenuImage(itemId, file) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  // Path includes a timestamp so re-uploads bust browser caches without
  // needing to wait for CDN purge.
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${itemId}-${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage.from('menu-images').upload(path, file, {
    contentType: file.type || `image/${ext}`,
    upsert: false,
  });
  if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

  const { data } = supabase.storage.from('menu-images').getPublicUrl(path);
  const publicUrl = data?.publicUrl;
  if (!publicUrl) throw new Error('Failed to read uploaded public URL');

  return publicUrl;
}
