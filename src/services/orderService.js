import { getSupabase } from '../lib/supabase.js';

// Persists an order to Supabase if configured. Returns a result object
// either way so the caller can still proceed to the WhatsApp send step
// even when the database is unavailable — WhatsApp is the source of
// truth in Phase 1; Supabase is a record/admin convenience.

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

  const { data, error } = await supabase
    .from('orders')
    .insert(payload)
    .select('id')
    .single();

  if (error) {
    console.error('[orderService] failed to persist order', error);
    // Don't block the customer — they can still reach WhatsApp
    return { ok: false, error: error.message, offline: true, payload };
  }

  return { ok: true, orderId: data?.id, payload };
}
