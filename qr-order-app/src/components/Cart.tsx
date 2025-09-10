import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartItem, Order, OrderStatus } from '../types';
import { 
  loadCart, 
  saveCart, 
  clearCart, 
  formatCurrency, 
  calculateCartTotal,
  generateOrderId,
  saveOrder,
  checkNetworkStatus 
} from '../utils/storageUtils';

const Cart: React.FC = () => {
  const { tableNumber } = useParams<{ tableNumber: string }>();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generalNotes, setGeneralNotes] = useState('');

  useEffect(() => {
    if (!tableNumber) {
      navigate('/menu?meja=01');
      return;
    }

    const existingCart = loadCart(tableNumber);
    setCart(existingCart);
    setLoading(false);
  }, [tableNumber, navigate]);

  const updateCartItem = (index: number, updates: Partial<CartItem>) => {
    const updatedCart = [...cart];
    const item = { ...updatedCart[index], ...updates };
    
    // Recalculate subtotal
    const basePrice = item.menuItem.price + (item.selectedVariation?.priceAdjustment || 0);
    item.subtotal = basePrice * item.quantity;
    
    updatedCart[index] = item;
    setCart(updatedCart);
    
    if (tableNumber) {
      saveCart(tableNumber, updatedCart);
    }
  };

  const removeCartItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    
    if (tableNumber) {
      saveCart(tableNumber, updatedCart);
    }
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeCartItem(index);
      return;
    }
    
    updateCartItem(index, { quantity: newQuantity });
  };

  const updateNotes = (index: number, notes: string) => {
    updateCartItem(index, { notes });
  };

  const getTotalAmount = (): number => {
    return calculateCartTotal(cart);
  };

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const submitOrder = async () => {
    if (!tableNumber || cart.length === 0) return;

    // Check network connection
    if (!checkNetworkStatus()) {
      alert('Tolong periksa kembali koneksi Anda.');
      return;
    }

    setSubmitting(true);

    try {
      // Create order object
      const order: Order = {
        id: generateOrderId(),
        tableNumber,
        items: cart,
        total: getTotalAmount(),
        timestamp: new Date(),
        status: OrderStatus.SUBMITTED,
        notes: generalNotes
      };

      // Save order
      saveOrder(order);

      // Clear cart after successful order
      clearCart(tableNumber);

      // Navigate to receipt
      navigate(`/receipt/${order.id}`);

    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const goBackToMenu = () => {
    navigate(`/menu/${tableNumber}`);
  };

  if (loading) {
    return (
      <div className=\"cart-container loading\">
        <div className=\"loading-spinner\"></div>
        <p>Memuat keranjang...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className=\"cart-container empty\">
        <div className=\"empty-cart\">
          <div className=\"empty-icon\">🛒</div>
          <h2>Keranjang Kosong</h2>
          <p>Belum ada item yang dipilih. Silakan pilih menu terlebih dahulu.</p>
          <button className=\"btn-primary\" onClick={goBackToMenu}>
            Lihat Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=\"cart-container\">
      {/* Header */}
      <div className=\"cart-header\">
        <div className=\"header-content\">
          <button className=\"back-button\" onClick={goBackToMenu}>
            ← Kembali ke Menu
          </button>
          <div className=\"cart-title\">
            <h2>Keranjang Belanja</h2>
            <div className=\"table-info\">
              <span>Meja {tableNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className=\"cart-items\">
        {cart.map((item, index) => (
          <CartItemCard
            key={`${item.menuItem.id}-${item.selectedVariation?.id || 'default'}-${index}`}
            item={item}
            onUpdateQuantity={(quantity) => updateQuantity(index, quantity)}
            onUpdateNotes={(notes) => updateNotes(index, notes)}
            onRemove={() => removeCartItem(index)}
          />
        ))}
      </div>

      {/* Order Notes */}
      <div className=\"order-notes\">
        <label htmlFor=\"general-notes\">Catatan Pesanan (opsional):</label>
        <textarea
          id=\"general-notes\"
          value={generalNotes}
          onChange={(e) => setGeneralNotes(e.target.value)}
          placeholder=\"Tambahkan catatan untuk keseluruhan pesanan...\"
          maxLength={200}
        />
      </div>

      {/* Order Summary */}
      <div className=\"order-summary\">
        <div className=\"summary-row\">
          <span>Total Item:</span>
          <span>{getTotalItems()} item</span>
        </div>
        <div className=\"summary-row total\">
          <span>Total Pembayaran:</span>
          <span className=\"total-amount\">{formatCurrency(getTotalAmount())}</span>
        </div>
      </div>

      {/* Submit Order */}
      <div className=\"order-actions\">
        <button 
          className=\"submit-order-button\"
          onClick={submitOrder}
          disabled={submitting || cart.length === 0}
        >
          {submitting ? 'Mengirim Pesanan...' : 'Kirim Pesanan'}
        </button>
      </div>
    </div>
  );
};

// Cart Item Card Component
interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onUpdateNotes: (notes: string) => void;
  onRemove: () => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ 
  item, 
  onUpdateQuantity, 
  onUpdateNotes, 
  onRemove 
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(item.notes);

  const handleNotesChange = (notes: string) => {
    setNotesValue(notes);
    onUpdateNotes(notes);
  };

  const getItemDisplayName = (): string => {
    let name = item.menuItem.name;
    if (item.selectedVariation) {
      name += ` (${item.selectedVariation.name})`;
    }
    return name;
  };

  const getUnitPrice = (): number => {
    return item.menuItem.price + (item.selectedVariation?.priceAdjustment || 0);
  };

  return (
    <div className=\"cart-item-card\">
      <div className=\"item-info\">
        <div className=\"item-image\">
          <img 
            src={item.menuItem.image} 
            alt={item.menuItem.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder.svg';
            }}
          />
        </div>
        
        <div className=\"item-details\">
          <h4 className=\"item-name\">{getItemDisplayName()}</h4>
          <p className=\"item-description\">{item.menuItem.description}</p>
          <div className=\"item-price\">
            <span className=\"unit-price\">{formatCurrency(getUnitPrice())}</span>
            <span className=\"price-separator\">×</span>
            <span className=\"quantity\">{item.quantity}</span>
          </div>
          
          {/* Notes Display */}
          {item.notes && (
            <div className=\"item-notes\">
              <small>Catatan: {item.notes}</small>
            </div>
          )}
        </div>
      </div>

      <div className=\"item-controls\">
        <div className=\"quantity-controls\">
          <button 
            className=\"quantity-button\"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
          >
            -
          </button>
          <span className=\"quantity-display\">{item.quantity}</span>
          <button 
            className=\"quantity-button\"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
          >
            +
          </button>
        </div>

        <div className=\"item-actions\">
          <button 
            className=\"notes-button\"
            onClick={() => setShowNotes(!showNotes)}
          >
            📝
          </button>
          <button 
            className=\"remove-button\"
            onClick={onRemove}
          >
            🗑️
          </button>
        </div>

        <div className=\"item-subtotal\">
          {formatCurrency(item.subtotal)}
        </div>
      </div>

      {/* Notes Input */}
      {showNotes && (
        <div className=\"notes-input-section\">
          <textarea
            value={notesValue}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder=\"Tambahkan catatan untuk item ini...\"
            maxLength={100}
          />
        </div>
      )}
    </div>
  );
};

export default Cart;