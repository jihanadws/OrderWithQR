'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isValidTableNumber, generateSessionId, saveSession } from '@/utils/storage';
import { SessionData } from '@/types';

function HomePageContent() {
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if we're online
    if (!navigator.onLine) {
      setError('Tolong periksa kembali koneksi Anda.');
      setLoading(false);
      return;
    }

    // Check for payment success message
    const paymentSuccess = searchParams.get('payment');
    if (paymentSuccess === 'success') {
      setShowPaymentSuccess(true);
      // Show success message briefly then clear URL
      setTimeout(() => {
        setShowPaymentSuccess(false);
        window.history.replaceState({}, '', window.location.pathname);
      }, 5000);
    }

    // Get table number from URL parameters
    const meja = searchParams.get('meja');
    
    if (!meja) {
      setError('QR Code tidak valid. Silakan scan ulang QR Code di meja Anda.');
      setLoading(false);
      return;
    }

    const tableNum = parseInt(meja);
    
    if (!isValidTableNumber(tableNum)) {
      setError('Nomor meja tidak valid. Silakan scan ulang QR Code di meja Anda.');
      setLoading(false);
      return;
    }

    setTableNumber(tableNum);
    setLoading(false);
  }, [searchParams]);

  const handleStartOrder = () => {
    if (!tableNumber) return;

    // Create new session
    const sessionData: SessionData = {
      tableNumber,
      cart: [],
      sessionId: generateSessionId(),
    };

    // Save session to localStorage
    saveSession(sessionData);

    // Navigate to menu page
    router.push('/menu');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-6"></div>
          <p className="text-responsive-body text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
        <div className="container-responsive text-center">
          <div className="card border-red-200 mb-6">
            <div className="card-body bg-gradient-to-r from-red-50 to-pink-50">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">⚠️</span>
                </div>
              </div>
              <h2 className="text-responsive-subtitle text-red-800 mb-3">Terjadi Kesalahan</h2>
              <p className="text-responsive-body text-red-700 leading-relaxed">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRetry}
            className="btn-warning w-full"
          >
            <span className="mr-2">🔄</span>
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="container-responsive text-center">
        {/* Payment Success Message */}
        {showPaymentSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 padding-responsive rounded-lg mb-6">
            <h2 className="text-responsive-subtitle mb-2">Pembayaran Berhasil! ✅</h2>
            <p className="text-responsive-body">Terima kasih telah memesan di Restoran Cita Rasa. Pesanan Anda sedang diproses.</p>
          </div>
        )}

        {/* Restaurant Logo/Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">QR</span>
          </div>
          <h1 className="text-responsive-title text-gray-800 mb-4">
            Selamat datang di Restoran Cita Rasa
          </h1>
        </div>

        {/* Table Information */}
        <div className="card mb-8 hover-lift">
          <div className="card-body text-center">
            <div className="flex items-center justify-center mb-5">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">
                    {tableNumber}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
            <h3 className="text-responsive-subtitle text-gray-800 mb-3">
              Anda berada di Meja Nomor {tableNumber}
            </h3>
            <p className="text-responsive-body text-gray-600 leading-relaxed">
              Silakan mulai memesan dengan menekan tombol di bawah ini
            </p>
          </div>
        </div>

        {/* Start Order Button */}
        <div className="mb-8">
          <button
            onClick={handleStartOrder}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-4 sm:py-5 px-8 rounded-2xl text-lg sm:text-xl font-bold hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 shadow-2xl hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden group"
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
              <span className="mr-3 text-2xl">🍽️</span>
              Mulai Memesan
              <span className="ml-3 text-xl">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-center text-responsive-body text-gray-500 bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <span className="mr-2 text-lg">💡</span>
            <p>Pastikan koneksi internet Anda stabil untuk pengalaman terbaik</p>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-center text-responsive-body bg-white/50 backdrop-blur-sm rounded-xl p-3">
            <div className={`w-3 h-3 rounded-full mr-3 ${
              navigator.onLine ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <span className={navigator.onLine ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {navigator.onLine ? 'Terhubung ke Internet' : 'Tidak terhubung ke Internet'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-6"></div>
        <p className="text-responsive-body text-gray-600">Memuat...</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomePageContent />
    </Suspense>
  );
}