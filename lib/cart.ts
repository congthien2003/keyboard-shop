export type CartItem = {
  id: string; // Product ID (UUID/string)
  name: string;
  nameVi: string;
  price: number; // e.g. "180.000đ/kg" or "350.000đ/hộp"
  priceVND: number; // e.g. "180.000USD/kg" or "350.000USD/hộp"
  image: string;
  unit?: string;
  unitVi?: string;
  quantity: number;
};

const CART_KEY = "km_cart";

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<CartItem[]>(localStorage.getItem(CART_KEY), []);
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  // Dispatch custom event to notify components of cart changes
  window.dispatchEvent(new CustomEvent("cartUpdated"));
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
  // Dispatch custom event to notify components of cart changes
  window.dispatchEvent(new CustomEvent("cartUpdated"));
}

export function addToCart(
  item: Omit<CartItem, "quantity"> & { quantity?: number },
) {
  const quantity = item.quantity ?? 1;
  const cart = getCart();
  const existingIndex = cart.findIndex((it) => it.id === item.id);
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }
  saveCart(cart);
  return cart;
}

export function updateQuantity(id: string, quantity: number) {
  const cart = getCart();
  const idx = cart.findIndex((it) => it.id === id);
  if (idx >= 0) {
    cart[idx].quantity = Math.max(1, quantity);
    saveCart(cart);
  }
  return cart;
}

export function removeFromCart(id: string) {
  const cart = getCart().filter((it) => it.id !== id);
  saveCart(cart);
  return cart;
}

export function parsePriceToVnd(price: string): number {
  // Extract digits from strings like "180.000đ/kg"
  const digits = price.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function getTotals(items: CartItem[], locale: string) {
  const subtotal = items.reduce(
    (sum, it) => sum + (locale === "vi" ? it.priceVND : it.price) * it.quantity,
    0,
  );
  const shipping = items.length > 0 ? (locale === "vi" ? 30000 : 10) : 0; // flat demo fee
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}
