export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'food' | 'drinks' | 'desserts';
  image?: string;
  available: boolean;
  variations?: Variation[];
}

export interface Variation {
  name: string;
  options: VariationOption[];
}

export interface VariationOption {
  label: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedVariations?: { [key: string]: string };
  notes?: string;
}

export interface SessionData {
  tableNumber: number;
  cart: CartItem[];
  sessionId: string;
}