import { CartItem, TableSession, Order } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Local Storage Keys
const CART_STORAGE_KEY = 'qr_order_cart';
const SESSION_STORAGE_KEY = 'qr_order_session';
const ORDER_HISTORY_KEY = 'qr_order_history';

// Cart Management
export const saveCart = (tableNumber: string, cartItems: CartItem[]): void => {
  try {
    const cartData = {
      tableNumber,
      items: cartItems,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`${CART_STORAGE_KEY}_${tableNumber}`, JSON.stringify(cartData));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

export const loadCart = (tableNumber: string): CartItem[] => {
  try {
    const cartData = localStorage.getItem(`${CART_STORAGE_KEY}_${tableNumber}`);
    if (!cartData) return [];
    
    const parsed = JSON.parse(cartData);
    return parsed.items || [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

export const clearCart = (tableNumber: string): void => {
  try {
    localStorage.removeItem(`${CART_STORAGE_KEY}_${tableNumber}`);
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

// Session Management
export const createSession = (tableNumber: string): TableSession => {
  const session: TableSession = {
    tableNumber,
    sessionId: uuidv4(),
    startTime: new Date(),
    cart: []
  };
  
  try {
    localStorage.setItem(`${SESSION_STORAGE_KEY}_${tableNumber}`, JSON.stringify(session));
  } catch (error) {
    console.error('Error creating session:', error);
  }
  
  return session;
};

export const getSession = (tableNumber: string): TableSession | null => {
  try {
    const sessionData = localStorage.getItem(`${SESSION_STORAGE_KEY}_${tableNumber}`);
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    return {
      ...session,
      startTime: new Date(session.startTime)
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

export const updateSession = (session: TableSession): void => {
  try {
    localStorage.setItem(`${SESSION_STORAGE_KEY}_${session.tableNumber}`, JSON.stringify(session));
  } catch (error) {
    console.error('Error updating session:', error);
  }
};

export const clearSession = (tableNumber: string): void => {
  try {
    localStorage.removeItem(`${SESSION_STORAGE_KEY}_${tableNumber}`);
    clearCart(tableNumber);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

// Order Management
export const saveOrder = (order: Order): void => {
  try {
    // Save individual order
    localStorage.setItem(`order_${order.id}`, JSON.stringify(order));
    
    // Update order history
    const history = getOrderHistory();
    history.push(order.id);
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving order:', error);
  }
};

export const getOrder = (orderId: string): Order | null => {
  try {
    const orderData = localStorage.getItem(`order_${orderId}`);
    if (!orderData) return null;
    
    const order = JSON.parse(orderData);
    return {
      ...order,
      timestamp: new Date(order.timestamp)
    };
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
};

export const getOrderHistory = (): string[] => {
  try {
    const history = localStorage.getItem(ORDER_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting order history:', error);
    return [];
  }
};

// Utility Functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const calculateCartTotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => total + item.subtotal, 0);
};

export const generateOrderId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

// Network status check
export const checkNetworkStatus = (): boolean => {
  return navigator.onLine;
};

// URL parameter extraction
export const getTableNumberFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('meja');
};

// QR validation
export const validateQRCode = (url: string): { isValid: boolean; tableNumber?: string; error?: string } => {
  try {
    const urlObj = new URL(url);
    const tableNumber = urlObj.searchParams.get('meja');
    
    if (!tableNumber) {
      return { isValid: false, error: 'Nomor meja tidak ditemukan dalam QR code' };
    }
    
    // Validate table number format (should be 2 digits)
    if (!/^\d{2}$/.test(tableNumber)) {
      return { isValid: false, error: 'Format nomor meja tidak valid' };
    }
    
    return { isValid: true, tableNumber };
  } catch (error) {
    return { isValid: false, error: 'QR code tidak valid' };
  }
};