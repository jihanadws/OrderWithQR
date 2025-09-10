import { SessionData } from '@/types';

const STORAGE_KEY = 'qr_order_session';
const MAX_TABLES = 50;

export function isValidTableNumber(tableNumber: number): boolean {
  return tableNumber >= 1 && tableNumber <= MAX_TABLES;
}

export function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function saveSession(session: SessionData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

export function getSession(): SessionData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}