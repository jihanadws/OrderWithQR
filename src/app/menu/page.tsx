'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { menuItems } from '@/data/menu';
import { CartItem, SessionData } from '@/types';
import { getSession, saveSession } from '@/utils/storage';
import MenuItemCard from '@/components/MenuItemCard';

export default function MenuPage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<'food' | 'drinks' | 'desserts'>('food');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sessionData = getSession();
    if (!sessionData) {
      // No session found, redirect to home
      router.push('/');
      return;
    }
    
    setSession(sessionData);
    setCart(sessionData.cart);
    setLoading(false);
  }, [router]);

  const handleAddToCart = (cartItem: CartItem) => {
    const updatedCart = [...cart, cartItem];
    setCart(updatedCart);
    
    if (session) {
      const updatedSession = { ...session, cart: updatedCart };
      saveSession(updatedSession);
      setSession(updatedSession);
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      let itemPrice = item.menuItem.price;
      
      if (item.selectedVariations && item.menuItem.variations) {
        item.menuItem.variations.forEach(variation => {
          const selectedOption = variation.options.find(opt => opt.label === item.selectedVariations![variation.name]);
          if (selectedOption) {
            itemPrice += selectedOption.price;
          }
        });
      }
      
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleViewCart = () => {
    router.push('/order');
  };

  const handleSubmitOrder = () => {
    if (cart.length === 0) {
      alert('Keranjang kosong! Silakan tambahkan item terlebih dahulu.');
      return;
    }
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${session?.tableNumber}`;
    
    // Create order data
    const orderData = {
      orderNumber,
      tableNumber: session?.tableNumber,
      items: cart,
      totalPrice: getTotalPrice(),
      timestamp: new Date().toISOString(),
    };
    
    // Save order to localStorage
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    
    // Clear cart and session
    if (session) {
      const clearedSession = { ...session, cart: [] };
      saveSession(clearedSession);
    }
    
    // Navigate to receipt
    router.push('/receipt');
  };

  const categories = [
    { key: 'food' as const, label: 'Makanan', icon: '🍽️' },
    { key: 'drinks' as const, label: 'Minuman', icon: '🥤' },
    { key: 'desserts' as const, label: 'Dessert', icon: '🍰' }
  ];

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="glassmorphism sticky top-0 z-10 border-b border-white/20">
        <div className="menu-grid-container py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1">Menu Restoran</h1>
              <p className="text-sm sm:text-base text-gray-600 flex items-center">
                <span className="mr-2">🍽️</span>
                Meja {session?.tableNumber}
              </p>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Cart Icon */}
              {cart.length > 0 && (
                <button
                  onClick={handleViewCart}
                  className="relative p-3 text-gray-600 hover:text-gray-800 bg-white/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-scale"
                >
                  <span className="text-xl sm:text-2xl">🛒</span>
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center font-bold animate-pulse">
                    {getTotalItems()}
                  </span>
                </button>
              )}
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-800 text-xl sm:text-2xl bg-white/80 rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="glassmorphism border-b border-white/20">
        <div className="menu-grid-container">
          <div className="flex space-x-1 p-1">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`flex-1 py-3 sm:py-4 px-2 sm:px-3 text-center rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.key
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg font-semibold'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                <div className="text-lg sm:text-xl mb-1">{category.icon}</div>
                <div className="text-xs sm:text-sm font-medium">{category.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-grid-container py-4 sm:py-6 pb-20 sm:pb-24">
        <div className="menu-grid">
          {filteredItems.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-responsive-body">Tidak ada item dalam kategori ini</p>
          </div>
        )}
      </div>

      {/* Cart Summary (Fixed Bottom) */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 glassmorphism border-t border-white/20 z-20">
          <div className="menu-grid-container py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleViewCart}
                className="flex-1 btn-secondary py-3 sm:py-4 px-4 font-semibold flex items-center justify-center text-sm sm:text-base hover-lift"
              >
                <span className="text-lg sm:text-xl mr-2">🛒</span>
                <span>Keranjang ({getTotalItems()})</span>
              </button>
              <button
                onClick={handleSubmitOrder}
                className="flex-1 btn-success py-3 sm:py-4 px-4 font-semibold flex items-center justify-center text-sm sm:text-base relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  <span className="mr-2 text-lg">🚀</span>
                  Kirim Pesanan
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            </div>
            <div className="text-center mt-3">
              <span className="text-gray-600 text-sm sm:text-base">Total: </span>
              <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}