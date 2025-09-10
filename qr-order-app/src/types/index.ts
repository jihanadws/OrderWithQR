// Type definitions for QR Order App

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  variations?: MenuVariation[];
  available: boolean;
}

export interface MenuVariation {
  id: string;
  name: string;
  priceAdjustment: number; // additional price for this variation
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedVariation?: MenuVariation;
  notes: string;
  subtotal: number;
}

export interface Order {
  id: string;
  tableNumber: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  status: OrderStatus;
  notes?: string;
}

export interface OrderReceipt {
  orderId: string;
  tableNumber: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  instructions: string;
}

export enum MenuCategory {
  MAKANAN = 'Makanan',
  MINUMAN = 'Minuman', 
  DESSERT = 'Dessert'
}

export enum OrderStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed'
}

export interface TableSession {
  tableNumber: string;
  sessionId: string;
  startTime: Date;
  cart: CartItem[];
  currentOrder?: Order;
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
}

export enum ErrorType {
  INVALID_QR = 'invalid_qr',
  NETWORK_ERROR = 'network_error',
  VALIDATION_ERROR = 'validation_error',
  STORAGE_ERROR = 'storage_error'
}