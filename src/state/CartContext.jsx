import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

// Cart state lives in React Context with localStorage as the persistence
// layer. No server required for Phase 1 — orders are dispatched via
// WhatsApp once the user reaches checkout.
//
// Each cart entry is the canonical menu item id plus a quantity. We keep
// a denormalised name/price snapshot so the cart still renders correctly
// even if the menu data changes later.

const STORAGE_KEY = 'kb-cart-v1';

const CartContext = createContext(null);

// THALI_PACKAGING_FEE applies per thali quantity (per the printed menu)
const THALI_PACKAGING_FEE = 20;
// Conservative GST estimate — actual rate can vary; owner can adjust.
const GST_PERCENT = 5;

const initialState = {
  // { [itemId]: { id, name, price, priceNum, quantity, categoryId } }
  items: {},
};

function loadInitial() {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.items) return initialState;
    return parsed;
  } catch {
    return initialState;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { item } = action;
      const existing = state.items[item.id];
      const nextQty = (existing?.quantity ?? 0) + 1;
      return {
        ...state,
        items: {
          ...state.items,
          [item.id]: {
            id: item.id,
            name: item.name,
            price: item.price,
            priceNum: item.priceNum,
            categoryId: item.categoryId,
            quantity: nextQty,
          },
        },
      };
    }
    case 'decrement': {
      const { id } = action;
      const existing = state.items[id];
      if (!existing) return state;
      if (existing.quantity <= 1) {
        const { [id]: _, ...rest } = state.items;
        return { ...state, items: rest };
      }
      return {
        ...state,
        items: {
          ...state.items,
          [id]: { ...existing, quantity: existing.quantity - 1 },
        },
      };
    }
    case 'remove': {
      const { id } = action;
      const { [id]: _, ...rest } = state.items;
      return { ...state, items: rest };
    }
    case 'clear': {
      return { ...state, items: {} };
    }
    case 'hydrate': {
      return action.state || initialState;
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  // persist on every change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota or private mode — ignore */
    }
  }, [state]);

  const value = useMemo(() => {
    const items = Object.values(state.items);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + (i.priceNum || 0) * i.quantity, 0);

    const thaliQty = items
      .filter((i) => i.categoryId === 'thali')
      .reduce((sum, i) => sum + i.quantity, 0);
    const packagingFee = thaliQty * THALI_PACKAGING_FEE;
    const gstAmount = Math.round(((subtotal + packagingFee) * GST_PERCENT) / 100);
    const total = subtotal + packagingFee + gstAmount;

    return {
      items,
      itemsById: state.items,
      itemCount,
      subtotal,
      packagingFee,
      gstPercent: GST_PERCENT,
      gstAmount,
      total,
      addItem: (item) => dispatch({ type: 'add', item }),
      decrement: (id) => dispatch({ type: 'decrement', id }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
      getQuantity: (id) => state.items[id]?.quantity ?? 0,
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a <CartProvider>');
  }
  return ctx;
}
