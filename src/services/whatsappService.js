import { restaurant } from '../config/restaurant.js';

// Builds a wa.me deep-link with a formatted order summary as the
// pre-filled message. The customer's tap opens WhatsApp (web or app)
// pre-addressed to the owner's number — no API key, no infrastructure.
//
// Owner workflow: receive WhatsApp → reply to confirm → call customer
// for any clarification → mark order in admin dashboard once that ships.

function pad2(n) {
  return n.toString().padStart(2, '0');
}

function formatTimestamp(date = new Date()) {
  const day = pad2(date.getDate());
  const month = date.toLocaleString('en-IN', { month: 'short' });
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = pad2(date.getMinutes());
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${pad2(hours)}:${minutes} ${ampm}, ${day} ${month} ${year}`;
}

function rupee(n) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export function formatOrderMessage({ order, cart }) {
  const lines = [];

  lines.push('*NEW ORDER — Kailash Bhojnalaya*');
  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push('');

  lines.push('*Customer*');
  lines.push(order.customerName);
  lines.push(order.customerPhone);
  if (order.customerEmail) lines.push(order.customerEmail);
  lines.push('');

  lines.push('*Delivery Address*');
  lines.push(order.address.line1);
  if (order.address.line2) lines.push(order.address.line2);
  if (order.address.landmark) lines.push(`Landmark: ${order.address.landmark}`);
  lines.push(
    `${order.address.city || 'Deoghar'}, ${order.address.pincode || ''}`.trim().replace(/, $/, '')
  );
  lines.push('');

  lines.push(`*Items (${cart.itemCount})*`);
  cart.items.forEach((i) => {
    const lineTotal = i.priceNum * i.quantity;
    lines.push(`• ${i.name} × ${i.quantity} — ${rupee(lineTotal)}`);
  });
  lines.push('');

  lines.push('*Bill*');
  lines.push(`Subtotal: ${rupee(cart.subtotal)}`);
  if (cart.deliveryFee > 0) lines.push(`Delivery: ${rupee(cart.deliveryFee)}`);
  lines.push(`GST (${cart.gstPercent}%): ${rupee(cart.gstAmount)}`);
  lines.push(`*Total: ${rupee(cart.total)}*`);
  lines.push('');

  lines.push(`Payment: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}`);
  if (order.specialInstructions) {
    lines.push('');
    lines.push('*Notes*');
    lines.push(order.specialInstructions);
  }
  lines.push('');
  lines.push(`Placed at ${formatTimestamp()}`);
  lines.push('Order placed via website');

  return lines.join('\n');
}

export function buildWhatsappLink({ order, cart, phoneOverride }) {
  const number = (phoneOverride || restaurant.whatsapp).replace(/\D/g, '');
  const message = formatOrderMessage({ order, cart });
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// Open WhatsApp in a new tab. Returns the link string in case the
// caller wants to surface a fallback ("Tap here if WhatsApp didn't open").
export function sendOrderToWhatsapp({ order, cart }) {
  const link = buildWhatsappLink({ order, cart });
  if (typeof window !== 'undefined') {
    window.open(link, '_blank', 'noopener,noreferrer');
  }
  return link;
}
