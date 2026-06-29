import { getSupabase } from '../lib/supabase.js';

// Persists an order to Supabase if configured. Returns a result object
// either way so the caller can still proceed to the WhatsApp send step
// even when the database is unavailable — WhatsApp is the source of
// truth for the customer; Supabase is a record/admin convenience.
//
// Notes:
//   - We deliberately don't request the inserted row back (no .select()
//     chained). PostgREST would otherwise run a SELECT on the new row
//     which evaluates the "orders admin read" RLS policy → calls
//     is_admin() → fails for anon if the function's EXECUTE grant
//     ever drifts. Plus we don't actually use the returned id.
//   - Wrapped in Promise.race with a 6s timeout so a stalled mobile
//     connection can never hang the checkout button.

const PERSIST_TIMEOUT_MS = 6000;

export async function persistOrder({ order, cart }) {
  const supabase = getSupabase();
  const payload = {
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    customer_email: order.customerEmail || null,
    delivery_address: order.address,
    items: cart.items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      price_num: i.priceNum,
      quantity: i.quantity,
      category_id: i.categoryId,
    })),
    subtotal: cart.subtotal,
    packaging_fee: cart.packagingFee,
    gst_amount: cart.gstAmount,
    total: cart.total,
    payment_method: order.paymentMethod || 'cod',
    status: 'pending',
    special_instructions: order.specialInstructions || null,
  };

  if (!supabase) {
    return { ok: true, offline: true, payload };
  }

  try {
    const insertPromise = supabase.from('orders').insert(payload);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase insert timed out')), PERSIST_TIMEOUT_MS)
    );
    const { error } = await Promise.race([insertPromise, timeoutPromise]);

    if (error) {
      console.warn('[orderService] failed to persist order:', error.message);
      return { ok: false, error: error.message, payload };
    }
    return { ok: true, payload };
  } catch (err) {
    console.warn('[orderService] persist crashed or timed out:', err?.message);
    return { ok: false, error: err?.message ?? 'unknown error', payload };
  }
}
