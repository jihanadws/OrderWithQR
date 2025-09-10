'use client';

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types';
import { clearSession } from '@/utils/storage';

interface OrderData {
  orderNumber: string;
  tableNumber: number;
  items: CartItem[];
  totalPrice: number;
  timestamp: string;
}

export default function ReceiptPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get order data from localStorage
    try {
      const stored = localStorage.getItem('currentOrder');
      if (!stored) {
        router.push('/');
        return;
      }
      
      const order: OrderData = JSON.parse(stored);
      setOrderData(order);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load order data:', error);
      router.push('/');
    }
  }, [router]);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePaymentComplete = () => {
    // Clear order data and session
    localStorage.removeItem('currentOrder');
    clearSession();
    
    // Redirect to home with success message
    router.push('/?payment=success');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-6"></div>
          <p className="text-responsive-body text-gray-600">Memuat receipt...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="card max-w-md mx-auto">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⚠️</span>
              </div>
              <h2 className="text-responsive-subtitle text-gray-800 mb-4">Receipt tidak ditemukan</h2>
              <button
                onClick={() => router.push('/')}
                className="btn-primary w-full"
              >
                <span className="mr-2">🏠</span>
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="glassmorphism border-b border-white/20 print:shadow-none">
        <div className="container-responsive py-6 sm:py-8 print:px-0">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                <span className="text-white text-2xl sm:text-3xl lg:text-4xl">✓</span>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-20 animate-pulse"></div>
            </div>
            <h1 className="text-responsive-title mb-3 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Pesanan Berhasil!
            </h1>
            <p className="text-responsive-body text-gray-600">Receipt pesanan Anda sudah siap</p>
          </div>
        </div>
      </div>

      <div className="container-responsive py-4 sm:py-6 print:px-0">
        {/* Receipt Card */}
        <div className="card shadow-2xl print:shadow-none print:border max-w-2xl mx-auto">
          {/* Restaurant Info */}
          <div className="card-header text-center border-b-2 border-gray-200">
            <h2 className="text-responsive-subtitle text-gray-800 mb-2">Restoran Cita Rasa</h2>
            <p className="text-responsive-body text-gray-600 flex items-center justify-center">
              <span className="mr-2">🏭</span>
              Receipt Pesanan
            </p>
          </div>

          <div className="card-body">
            {/* Order Info */}
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📄</span>
                Informasi Pesanan
              </h3>
              <div className="spacing-tight">
                <div className="flex justify-between items-center py-2 border-b border-blue-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">Nomor Pesanan:</span>
                  <span className="font-mono font-bold text-sm bg-white px-3 py-1 rounded-lg">{orderData.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">Nomor Meja:</span>
                  <span className="font-bold bg-blue-600 text-white px-3 py-1 rounded-lg">{orderData.tableNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Waktu Pesanan:</span>
                  <span className="text-sm font-medium">{formatDateTime(orderData.timestamp)}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🍽️</span>
                Daftar Pesanan
              </h3>
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-800 text-base">{item.menuItem.name}</span>
                      <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        {formatPrice(calculateItemPrice(item) * item.quantity)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-medium mr-2">
                        Jumlah: {item.quantity}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
                        @ {formatPrice(calculateItemPrice(item))}
                      </span>
                    </div>

                    {/* Variations */}
                    {item.selectedVariations && (
                      <div className="mb-2 p-3 bg-blue-50 rounded-xl">
                        <h4 className="text-sm font-semibold text-blue-800 mb-1">Pilihan:</h4>
                        {Object.entries(item.selectedVariations).map(([key, value]) => (
                          <div key={key} className="text-sm text-blue-700">
                            <span className="font-medium">{key}:</span> {value}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                        <span className="text-sm font-semibold text-yellow-800">Catatan: </span>
                        <span className="text-sm text-yellow-700">{item.notes}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-responsive-subtitle text-gray-800 flex items-center">
                    <span className="mr-2">💰</span>
                    Total Biaya
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Sudah termasuk semua item</p>
                </div>
                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {formatPrice(orderData.totalPrice)}
                </span>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-5 mb-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-white text-xl">💳</span>
                </div>
                <div>
                  <h4 className="font-bold text-yellow-800 mb-2 text-base">Instruksi Pembayaran</h4>
                  <p className="text-sm text-yellow-700 leading-relaxed">
                    Silakan tunjukkan receipt ini ke kasir untuk melakukan pembayaran. Terima kasih!
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 print:hidden">
              <button
                onClick={handlePrintReceipt}
                className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center"
              >
                <span className="mr-3 text-xl">🖨️</span>
                Cetak Receipt
              </button>
              
              <button
                onClick={handlePaymentComplete}
                className="w-full btn-success py-4 text-base font-bold flex items-center justify-center"
              >
                <span className="mr-3 text-xl">✅</span>
                Pembayaran Selesai
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full btn-secondary py-4 text-base font-bold flex items-center justify-center"
              >
                <span className="mr-3 text-xl">🏠</span>
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 print:hidden">
          <div className="card max-w-md mx-auto">
            <div className="card-body text-center bg-gradient-to-r from-blue-50 to-indigo-50">
              <p className="text-responsive-body text-gray-700 font-medium mb-2">
                Terima kasih telah memesan di Restoran Cita Rasa!
              </p>
              <p className="text-responsive-body text-gray-600">
                Semoga Anda menikmati hidangan kami 😊
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}