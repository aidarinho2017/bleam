export type Purchase = {
  product: string;
  quantity: number;
  date: string; // ISO string
};

export type Contact = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lastActivity: string; // ISO
  purchaseHistory: Purchase[];
  notes?: string;
};

// Clothing shop catalogue types
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type SizeStock = {
  size: Size;
  available: number;
};

export type CatalogueItem = {
  id: string;
  name: string;
  price: number; // per item (KZT)
  sizes: SizeStock[]; // availability per size
};

// Sales (purchases) records for the shop
export type PurchaseItem = {
  itemId: string; // CatalogueItem.id
  name: string; // denormalized for easier rendering
  quantity: number;
};

export type PurchaseRecord = {
  id: string;
  salesperson: string;
  items: PurchaseItem[];
  price: number; // total price for the purchase
  date: string; // ISO date
};
