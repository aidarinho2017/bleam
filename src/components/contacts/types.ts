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
