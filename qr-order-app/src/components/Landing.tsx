import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTableNumberFromUrl, validateQRCode, createSession, checkNetworkStatus } from '../utils/storageUtils';
import { restaurantInfo } from '../data/menuData';
import { AppError, ErrorType } from '../types';

const Landing: React.FC = () => {
  const [tableNumber, setTableNumber] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check network status
    if (!checkNetworkStatus()) {
      setError({
        type: ErrorType.NETWORK_ERROR,
        message: 'Tolong periksa kembali koneksi Anda.'
      });
      setLoading(false);
      return;
    }

    // Extract table number from URL
    const tableFromUrl = getTableNumberFromUrl();
    
    if (!tableFromUrl) {
      setError({
        type: ErrorType.INVALID_QR,
        message: 'QR code tidak valid. Nomor meja tidak ditemukan.'
      });
      setLoading(false);
      return;
    }

    // Validate QR code format
    const currentUrl = window.location.href;
    const validation = validateQRCode(currentUrl);
    
    if (!validation.isValid) {
      setError({
        type: ErrorType.INVALID_QR,
        message: validation.error || 'QR code tidak valid'
      });
      setLoading(false);
      return;
    }

    // Set table number and create session
    setTableNumber(tableFromUrl);
    createSession(tableFromUrl);
    setLoading(false);
  }, []);

  const handleProceedToMenu = () => {
    if (tableNumber) {
      navigate(`/menu/${tableNumber}`);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className=\"landing-container loading\">
        <div className=\"loading-spinner\"></div>
        <p>Memuat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className=\"landing-container error\">
        <div className=\"error-content\">
          <div className=\"error-icon\">⚠️</div>
          <h2>Oops! Terjadi Kesalahan</h2>
          <p className=\"error-message\">{error.message}</p>
          <div className=\"error-actions\">
            <button onClick={handleRetry} className=\"btn-primary\">
              Coba Lagi
            </button>
            {error.type === ErrorType.INVALID_QR && (
              <p className=\"error-help\">
                Pastikan Anda memindai QR code yang benar dari meja restoran.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=\"landing-container\">
      <div className=\"landing-content\">
        <div className=\"restaurant-header\">
          <div className=\"restaurant-logo\">
            <span className=\"logo-icon\">🍽️</span>
          </div>
          <h1 className=\"restaurant-name\">{restaurantInfo.name}</h1>
          <p className=\"restaurant-description\">{restaurantInfo.description}</p>
        </div>

        <div className=\"table-info\">
          <div className=\"table-number-display\">
            <h2>Selamat datang!</h2>
            <div className=\"table-badge\">
              <span className=\"table-label\">Meja Nomor</span>
              <span className=\"table-number\">{tableNumber}</span>
            </div>
          </div>
        </div>

        <div className=\"welcome-message\">
          <p>
            Silakan lihat menu digital kami dan lakukan pemesanan langsung dari meja Anda.
            Pesanan akan dikirim ke kasir untuk proses pembayaran.
          </p>
        </div>

        <div className=\"action-section\">
          <button 
            onClick={handleProceedToMenu}
            className=\"btn-primary btn-large\"
          >
            Lihat Menu
          </button>
        </div>

        <div className=\"info-footer\">
          <div className=\"contact-info\">
            <p>{restaurantInfo.address}</p>
            <p>{restaurantInfo.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;