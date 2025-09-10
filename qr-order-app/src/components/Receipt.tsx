import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { getOrder, formatCurrency } from '../utils/storageUtils';
import { restaurantInfo } from '../data/menuData';

const Receipt: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      navigate('/menu?meja=01');
      return;
    }

    const orderData = getOrder(orderId);
    if (!orderData) {
      alert('Pesanan tidak ditemukan');
      navigate('/menu?meja=01');
      return;
    }

    setOrder(orderData);
    setLoading(false);
  }, [orderId, navigate]);

  const handleNewOrder = () => {
    if (order?.tableNumber) {
      navigate(`/menu/${order.tableNumber}`);
    } else {
      navigate('/menu?meja=01');
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getTotalItems = (): number => {
    if (!order) return 0;
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className=\"receipt-container loading\">
        <div className=\"loading-spinner\"></div>
        <p>Memuat pesanan...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className=\"receipt-container error\">
        <div className=\"error-content\">
          <h2>Pesanan Tidak Ditemukan</h2>
          <p>Maaf, pesanan yang Anda cari tidak dapat ditemukan.</p>
          <button className=\"btn-primary\" onClick={handleNewOrder}>
            Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=\"receipt-container\">
      <div className=\"receipt-content\">
        {/* Receipt Header */}
        <div className=\"receipt-header\">
          <div className=\"restaurant-info\">
            <h1>{restaurantInfo.name}</h1>
            <p>{restaurantInfo.address}</p>
            <p>{restaurantInfo.phone}</p>
          </div>
          
          <div className=\"receipt-line\"></div>
          
          <div className=\"order-info\">
            <div className=\"order-number\">
              <strong>Nomor Pesanan: {order.id}</strong>
            </div>
            <div className=\"order-details\">
              <p>Meja: {order.tableNumber}</p>
              <p>Tanggal: {formatDate(order.timestamp)}</p>
              <p>Status: Menunggu Pembayaran</p>
            </div>
          </div>
        </div>

        <div className=\"receipt-line\"></div>

        {/* Order Items */}
        <div className=\"receipt-items\">
          <div className=\"items-header\">
            <h3>Detail Pesanan</h3>
          </div>
          
          <div className=\"items-list\">
            {order.items.map((item, index) => {
              const itemDisplayName = item.selectedVariation 
                ? `${item.menuItem.name} (${item.selectedVariation.name})`
                : item.menuItem.name;
              
              const unitPrice = item.menuItem.price + (item.selectedVariation?.priceAdjustment || 0);
              
              return (
                <div key={index} className=\"receipt-item\">
                  <div className=\"item-header\">
                    <span className=\"item-name\">{itemDisplayName}</span>
                    <span className=\"item-subtotal\">{formatCurrency(item.subtotal)}</span>
                  </div>
                  
                  <div className=\"item-details\">
                    <span className=\"item-price-qty\">
                      {formatCurrency(unitPrice)} × {item.quantity}
                    </span>
                  </div>
                  
                  {item.notes && (
                    <div className=\"item-notes\">
                      <small>Catatan: {item.notes}</small>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className=\"receipt-line\"></div>

        {/* Order Summary */}
        <div className=\"receipt-summary\">
          <div className=\"summary-row\">
            <span>Total Item:</span>
            <span>{getTotalItems()} item</span>
          </div>
          
          <div className=\"summary-row total-row\">
            <span><strong>TOTAL PEMBAYARAN:</strong></span>
            <span className=\"total-amount\">
              <strong>{formatCurrency(order.total)}</strong>
            </span>
          </div>
        </div>

        {/* General Notes */}
        {order.notes && (
          <>
            <div className=\"receipt-line\"></div>
            <div className=\"order-notes\">
              <h4>Catatan Pesanan:</h4>
              <p>{order.notes}</p>
            </div>
          </>
        )}

        <div className=\"receipt-line\"></div>

        {/* Payment Instructions */}
        <div className=\"payment-instructions\">
          <div className=\"instruction-box\">
            <h3>📝 Instruksi Pembayaran</h3>
            <p>
              Silakan tunjukkan receipt ini ke kasir untuk melakukan pembayaran.
              Pembayaran dapat dilakukan secara tunai atau menggunakan metode pembayaran 
              yang tersedia di kasir.
            </p>
          </div>
        </div>

        <div className=\"receipt-line\"></div>

        <div className=\"receipt-footer\">
          <p>Terima kasih atas kunjungan Anda!</p>
          <p>Selamat menikmati makanan Anda 😊</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className=\"receipt-actions no-print\">
        <button 
          className=\"btn-secondary\"
          onClick={printReceipt}
        >
          🖨️ Cetak Receipt
        </button>
        
        <button 
          className=\"btn-primary\"
          onClick={handleNewOrder}
        >
          Pesan Lagi
        </button>
      </div>

      {/* Success Message */}
      <div className=\"success-message no-print\">
        <div className=\"success-icon\">✅</div>
        <h2>Pesanan Berhasil Dikirim!</h2>
        <p>
          Pesanan Anda dengan nomor <strong>{order.id}</strong> telah berhasil 
          dikirim ke kasir. Silakan menuju ke kasir untuk melakukan pembayaran.
        </p>
      </div>
    </div>
  );
};

export default Receipt;