// Admin data management utilities

export interface Category {
  id: string;
  name: string;
  nameVi: string;
  slug: string;
  description?: string;
  descriptionVi?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  nameVi: string;
  slug: string;
  description: string;
  descriptionVi: string;
  price: string;
  image: string;
  images: string[];
  origin: string;
  originVi: string;
  status: "contact" | "direct" | "out_of_stock";
  quantity: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface News {
  id: string;
  image: string;
  published: boolean;
  slug: string;
  timeReading: number;
  authorId: string | null;
  categoryId: string | null;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  // Vietnamese
  titleVi: string;
  excerptVi: string;
  contentVi: string;
  tagsVi: string[];
  // English
  titleEn: string;
  excerptEn: string;
  contentEn: string;
  tagsEn: string[];
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentStatus: "paid" | "pending";
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  nameVi: string;
  price: string;
  quantity: number;
  image: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

// Local storage keys
const KEYS = {
  CATEGORIES: "km_admin_categories",
  PRODUCTS: "km_admin_products",
  NEWS: "km_admin_news",
  ORDERS: "km_admin_orders",
  CONTACTS: "km_admin_contacts",
};

// Helper functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Categories
export function getCategories(): Category[] {
  return getFromStorage<Category[]>(KEYS.CATEGORIES, []);
}

export function saveCategories(categories: Category[]): void {
  saveToStorage(KEYS.CATEGORIES, categories);
}

export function addCategory(
  category: Omit<Category, "id" | "createdAt" | "updatedAt">,
): Category {
  const categories = getCategories();
  const newCategory: Category = {
    ...category,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  categories.push(newCategory);
  saveCategories(categories);
  return newCategory;
}

export function updateCategory(
  id: string,
  updates: Partial<Category>,
): Category | null {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;

  categories[index] = {
    ...categories[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveCategories(categories);
  return categories[index];
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  saveCategories(filtered);
  return true;
}

// Products
export function getProducts(): Product[] {
  return getFromStorage<Product[]>(KEYS.PRODUCTS, []);
}

export function saveProducts(products: Product[]): void {
  saveToStorage(KEYS.PRODUCTS, products);
}

export function addProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">,
): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(
  id: string,
  updates: Partial<Product>,
): Product | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

// News
export function getNews(): News[] {
  return getFromStorage<News[]>(KEYS.NEWS, []);
}

export function saveNews(news: News[]): void {
  saveToStorage(KEYS.NEWS, news);
}

export function addNews(
  newsItem: Omit<News, "id" | "createdAt" | "updatedAt">,
): News {
  const newsList = getNews();
  const newNewsItem: News = {
    ...newsItem,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  newsList.push(newNewsItem);
  saveNews(newsList);
  return newNewsItem;
}

export function updateNews(id: string, updates: Partial<News>): News | null {
  const newsList = getNews();
  const index = newsList.findIndex((n) => n.id === id);
  if (index === -1) return null;

  newsList[index] = {
    ...newsList[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveNews(newsList);
  return newsList[index];
}

export function deleteNews(id: string): boolean {
  const newsList = getNews();
  const filtered = newsList.filter((n) => n.id !== id);
  if (filtered.length === newsList.length) return false;
  saveNews(filtered);
  return true;
}

// Orders
export function getOrders(): Order[] {
  return getFromStorage<Order[]>(KEYS.ORDERS, []);
}

export function saveOrders(orders: Order[]): void {
  saveToStorage(KEYS.ORDERS, orders);
}

export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveOrders(orders);
  return orders[index];
}

// Contacts
export function getContacts(): Contact[] {
  return getFromStorage<Contact[]>(KEYS.CONTACTS, []);
}

export function saveContacts(contacts: Contact[]): void {
  saveToStorage(KEYS.CONTACTS, contacts);
}

export function updateContact(
  id: string,
  updates: Partial<Contact>,
): Contact | null {
  const contacts = getContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) return null;

  contacts[index] = {
    ...contacts[index],
    ...updates,
  };
  saveContacts(contacts);
  return contacts[index];
}

export function deleteContact(id: string): boolean {
  const contacts = getContacts();
  const filtered = contacts.filter((c) => c.id !== id);
  if (filtered.length === contacts.length) return false;
  saveContacts(filtered);
  return true;
}

// Re-export generateSlug from slug helper for backward compatibility
export { generateSlug } from "./slug";
