import { Plus, Minus } from 'lucide-react';
import { useCart } from '../../state/CartContext.jsx';

// Two-mode stepper:
//  - When item.quantity === 0: shows a single "Add" pill button
//  - When item.quantity > 0: shows a − {qty} + control
//
// Same component is used on menu cards and inside the cart drawer; the
// `compact` prop swaps to a tighter 28px height for cart-drawer rows.

export default function QuantityStepper({ item, compact = false }) {
  const { addItem, decrement, getQuantity } = useCart();
  const qty = getQuantity(item.id);

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => addItem(item)}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-leaf-300 bg-white text-leaf-700 font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-leaf-500 hover:bg-leaf-50 hover:shadow-soft ${
          compact ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm'
        }`}
        aria-label={`Add ${item.name} to cart`}
      >
        <Plus className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
        Add
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-full border border-leaf-500 bg-leaf-600 text-white shadow-soft ${
        compact ? 'h-8' : 'h-10'
      }`}
    >
      <button
        type="button"
        onClick={() => decrement(item.id)}
        className={`flex h-full items-center justify-center text-white/95 transition-colors hover:bg-leaf-700 ${
          compact ? 'w-7' : 'w-9'
        }`}
        aria-label={`Decrease ${item.name}`}
      >
        <Minus className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      </button>
      <span
        className={`flex h-full min-w-[28px] items-center justify-center font-display font-bold tabular-nums ${
          compact ? 'text-sm' : 'text-base'
        }`}
        aria-live="polite"
      >
        {qty}
      </span>
      <button
        type="button"
        onClick={() => addItem(item)}
        className={`flex h-full items-center justify-center text-white/95 transition-colors hover:bg-leaf-700 ${
          compact ? 'w-7' : 'w-9'
        }`}
        aria-label={`Increase ${item.name}`}
      >
        <Plus className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      </button>
    </div>
  );
}
