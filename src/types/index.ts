export interface Product {
  id: string;
  name: string;
  nameTE: string; // Telugu name
  price: number;
  unit: 'kg' | 'bunch' | 'packet' | 'liter' | 'ml' | 'piece';
  category: 'vegetables' | 'fruits' | 'flowers' | 'groceries' | 'milk';
  image: string;
  available: boolean;
  minQuantity: number; // in grams for kg, 1 for others
  incrementBy: number; // in grams for kg, 1 for others
}

export interface CartItem {
  product: Product;
  quantity: number; // in grams for kg products, count for others
}

export interface Address {
  fullName: string;
  primaryMobile: string;
  alternateMobile: string;
  houseNo: string;
  village: string;
  street: string;
  landMark: string;
}

export interface DeliverySlot {
  date: 'today' | 'tomorrow';
  time: string;
}

export type PaymentMode = 'cod' | 'upi';
