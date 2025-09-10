'use client';

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, SessionData } from '@/types';
import { getSession, saveSession } from '@/utils/storage';

export default function OrderPage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const sessionData = getSession();
    if (!sessionData) {
      router.push('/');
      return;
    }
    
    setSession(sessionData);
    setCart(sessionData.cart);
    setLoading(false);
  }, [router]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    const updatedCart = cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    updateCart(updatedCart);
  };

  const removeItem = (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    updateCart(updatedCart);
  };

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (session) {
      const updatedSession = { ...session, cart: newCart };
      saveSession(updatedSession);
      setSession(updatedSession);
    }
  };

  const updateItemNotes = (itemId: string, newNotes: string) => {
    const updatedCart = cart.map(item => 
      item.id === itemId ? { ...item, notes: newNotes.trim() || undefined } : item
    );
    updateCart(updatedCart);
  };

  const handleEditNotes = (itemId: string, currentNotes?: string) => {
    setEditingNotes(itemId);
    setTempNotes(currentNotes || '');
  };

  const handleSaveNotes = (itemId: string) => {
    updateItemNotes(itemId, tempNotes);
    setEditingNotes(null);
    setTempNotes('');
  };

  const handleCancelEditNotes = () => {
    setEditingNotes(null);
    setTempNotes('');
  };

  const calculateItemPrice = (item: CartItem) => {
    let price = item.menuItem.price;
    
    if (item.selectedVariations && item.menuItem.variations) {
      item.menuItem.variations.forEach(variation => {
        const selectedOption = variation.options.find(opt => opt.label === item.selectedVariations![variation.name]);
        if (selectedOption) {
          price += selectedOption.price;
        }
      });
    }
    
    return price;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (calculateItemPrice(item) * item.quantity), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-6"></div>
          <p className="text-responsive-body text-gray-600">Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="glassmorphism border-b border-white/20">
        <div className="container-responsive py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/menu')}
                className="mr-3 sm:mr-4 text-gray-600 hover:text-gray-800 text-xl sm:text-2xl bg-white/80 rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale"
              >
                ←
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1">Keranjang Belanja</h1>
                <p className="text-sm sm:text-base text-gray-600 flex items-center">
                  <span className="mr-2">🍽️</span>
                  Meja {session?.tableNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-responsive py-4 sm:py-6">
        {cart.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="card max-w-md mx-auto">
              <div className="card-body text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🛒</span>
                </div>
                <h2 className="text-responsive-subtitle text-gray-800 mb-3">Keranjang Masih Kosong</h2>
                <p className="text-responsive-body text-gray-600 mb-6 leading-relaxed">
                  Yuk, pilih menu favorit Anda untuk mulai memesan!
                </p>
                <button
                  onClick={() => router.push('/menu')}
                  className="btn-primary w-full"
                >
                  <span className="mr-2">🍽️</span>
                  Lihat Menu
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="spacing-responsive">
            {/* Cart Items */}
            {cart.map(item => (
              <div key={item.id} className="card hover-lift">
                <div className="card-body">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg">{item.menuItem.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg px-3 py-1 text-sm font-medium transition-all duration-200 hover-scale"
                    >
                      ✕ Hapus
                    </button>
                  </div>

                  {/* Variations */}
                  {item.selectedVariations && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-xl">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">Pilihan:</h4>
                      {Object.entries(item.selectedVariations).map(([key, value]) => (
                        <p key={key} className="text-sm text-blue-700">
                          <span className="font-medium">{key}:</span> {value}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  <div className="mb-4">
                    {editingNotes === item.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="Tambahkan catatan..."
                          className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveNotes(item.id)}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover-scale"
                          >
                            ✓ Simpan
                          </button>
                          <button
                            onClick={handleCancelEditNotes}
                            className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl text-sm font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-lg hover-scale"
                          >
                            ✕ Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-700 mb-1">Catatan:</h4>
                            {item.notes ? (
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {item.notes}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-400 italic">
                                Belum ada catatan
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleEditNotes(item.id, item.notes)}
                            className="ml-3 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg px-2 py-1 text-sm font-medium transition-all duration-200 hover-scale"
                          >
                            ✏️ Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-semibold text-gray-700">Jumlah:</span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-base font-bold hover:from-gray-300 hover:to-gray-400 transition-all duration-200 hover-scale"
                        >
                          -
                        </button>
                        <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-base font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover-scale"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Subtotal:</p>
                      <p className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        {formatPrice(calculateItemPrice(item) * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="card border-2 border-blue-200">
              <div className="card-body bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-responsive-subtitle text-gray-800 mb-1">Total Pembayaran</h3>
                    <p className="text-sm text-gray-600">Semua item sudah termasuk</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {formatPrice(getTotalPrice())}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white py-4 sm:py-5 px-6 rounded-2xl font-bold text-lg sm:text-xl hover:from-green-700 hover:via-green-800 hover:to-emerald-800 transition-all duration-300 shadow-2xl hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden group"
              style={{
                filter: 'drop-shadow(0 20px 25px rgb(0 0 0 / 0.15))',
                transition: 'all 0.3s ease, filter 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0 25px 35px rgb(0 0 0 / 0.25))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0 20px 25px rgb(0 0 0 / 0.15))';
              }}
            >
              <span className="relative z-10 flex items-center justify-center">
                <span className="mr-3 text-2xl">🚀</span>
                Pesan Sekarang
                <span className="ml-3 text-xl">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}