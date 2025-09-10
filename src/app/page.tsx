'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isValidTableNumber, generateSessionId, saveSession } from '@/utils/storage';
import { SessionData } from '@/types';

function HomePageContent() {
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if we're online
    if (!navigator.onLine) {
      setError('Tolong periksa kembali koneksi Anda.');
      setLoading(false);
      return;
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">Terjadi Kesalahan</h2>
            <p>{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="btn-primary w-full"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="max-w-md w-full text-center">
        {/* Restaurant Logo/Header */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">QR</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Selamat Datang di
          </h1>
          <h2 className="text-2xl font-semibold text-blue-600">
            Restoran Cita Rasa
          </h2>
        </div>

        {/* Table Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl font-bold">
                {tableNumber}
              </span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Anda berada di Meja Nomor {tableNumber}
          </h3>
          <p className="text-gray-600 text-sm">
            Silakan mulai memesan dengan menekan tombol di bawah ini
          </p>
        </div>

        {/* Start Order Button */}
        <button
          onClick={handleStartOrder}
          className="btn-primary w-full text-lg py-4"
        >
          Mulai Memesan 🍽️
        </button>

        {/* Additional Information */}
        <div className="mt-6 text-sm text-gray-500">
          <p>💡 Tips: Pastikan koneksi internet Anda stabil untuk pengalaman terbaik</p>
        </div>

        {/* Connection Status */}
        <div className="mt-4 flex items-center justify-center text-sm">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            navigator.onLine ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className={navigator.onLine ? 'text-green-600' : 'text-red-600'}>
            {navigator.onLine ? 'Terhubung' : 'Tidak terhubung'}
          </span>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat...</p>
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