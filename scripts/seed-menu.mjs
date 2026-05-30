// scripts/seed-menu.mjs
//
// One-time (or as-needed) seed of public.menu_categories and public.menu_items
// from src/data/menu.js. Idempotent — uses upsert on primary key, so re-running
// is safe and will pick up any local data edits.
//
// Requires the Supabase SERVICE-ROLE key (the "secret" one) because the
// menu tables have admin-only write policies. The service role bypasses RLS.
// NEVER commit the service role key. Treat it like a DB password.
//
// Usage:
//   1. Fetch service-role key from Supabase Dashboard → Project Settings →
//      API Keys → "service_role" (long JWT starting eyJ...).
//   2. Add to local .env (already gitignored):
//        SUPABASE_SERVICE_ROLE_KEY=eyJ...
//   3. Run: node scripts/seed-menu.mjs
//   4. (Optional but recommended) remove the service-role line from .env
//      once you're done. The site itself only needs the anon key.

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { menuCategories, featuredItemIds } from '../src/data/menu.js';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  console.error('Missing VITE_SUPABASE_URL in .env');
  process.exit(1);
}
if (!serviceKey) {
  console.error(
    'Missing SUPABASE_SERVICE_ROLE_KEY in .env.\n' +
      'Grab it from Supabase → Project Settings → API Keys (the "service_role" key).\n' +
      'Add a temporary line to .env, run this script, then remove it.'
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const FEATURED = new Set(featuredItemIds);

async function seedCategories() {
  const rows = menuCategories.map((c, i) => ({
    id: c.id,
    name: c.name,
    tagline: c.tagline ?? null,
    icon: c.icon ?? null,
    accent: c.accent ?? null,
    sort_order: i + 1,
    is_featured: Boolean(c.featured),
  }));

  const { error } = await supabase
    .from('menu_categories')
    .upsert(rows, { onConflict: 'id' });

  if (error) throw new Error(`menu_categories upsert failed: ${error.message}`);
  console.log(`✓ menu_categories — upserted ${rows.length} rows`);
}

async function seedItems() {
  const rows = menuCategories.flatMap((cat) =>
    cat.items.map((item, idx) => ({
      id: item.id,
      category_id: cat.id,
      name: item.name,
      description: item.description ?? null,
      price: item.price,           // display string, e.g. "₹240"
      price_num: item.priceNum,    // numeric anchor for sorting/calc
      tags: item.tags ?? [],
      is_active: true,
      is_featured: FEATURED.has(item.id),
      sort_order: idx + 1,
      // image_url stays null — admin uploads via dashboard; menu cards
      // fall back to /menu/<id>.jpg if image_url is null.
    }))
  );

  // Batch in chunks of 100 so we don't hit any payload limits.
  const BATCH = 100;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase
      .from('menu_items')
      .upsert(batch, { onConflict: 'id' });
    if (error) throw new Error(`menu_items upsert failed: ${error.message}`);
    console.log(`✓ menu_items — upserted ${i + 1}–${Math.min(i + BATCH, rows.length)} of ${rows.length}`);
  }
}

async function main() {
  console.log(`Seeding Supabase at ${url}\n`);
  await seedCategories();
  await seedItems();
  console.log(
    '\n✅ Done. The public site (once menuService is wired to read from DB) and the admin dashboard will both see this data.'
  );
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
