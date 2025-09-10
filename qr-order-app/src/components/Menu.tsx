import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuItem, MenuCategory, CartItem, MenuVariation } from '../types';
import { menuItems } from '../data/menuData';
import { loadCart, saveCart, formatCurrency, getSession } from '../utils/storageUtils';

const Menu: React.FC = () => {
  const { tableNumber } = useParams<{ tableNumber: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>(MenuCategory.MAKANAN);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tableNumber) {
      navigate('/menu?meja=01');
      return;
    }

    // Load existing cart
    const existingCart = loadCart(tableNumber);
    setCart(existingCart);
    setLoading(false);
  }, [tableNumber, navigate]);

  const categories = [
    { key: MenuCategory.MAKANAN, label: 'Makanan', icon: '🍽️' },
    { key: MenuCategory.MINUMAN, label: 'Minuman', icon: '🥤' },
    { key: MenuCategory.DESSERT, label: 'Dessert', icon: '🍰' }
  ];

  const filteredItems = menuItems.filter(item => 
    item.category === selectedCategory && item.available
  );

  const addToCart = (menuItem: MenuItem, variation?: MenuVariation, notes: string = '') => {
    const existingItemIndex = cart.findIndex(item => 
      item.menuItem.id === menuItem.id && 
      item.selectedVariation?.id === variation?.id
    );

    let updatedCart: CartItem[];

    if (existingItemIndex > -1) {
      // Update existing item
      updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1,
        notes: notes || updatedCart[existingItemIndex].notes,
        subtotal: calculateSubtotal(menuItem, variation, updatedCart[existingItemIndex].quantity + 1)
      };
    } else {
      // Add new item
      const newCartItem: CartItem = {
        menuItem,
        quantity: 1,
        selectedVariation: variation,
        notes,
        subtotal: calculateSubtotal(menuItem, variation, 1)
      };
      updatedCart = [...cart, newCartItem];
    }

    setCart(updatedCart);
    if (tableNumber) {
      saveCart(tableNumber, updatedCart);
    }
  };

  const calculateSubtotal = (menuItem: MenuItem, variation?: MenuVariation, quantity: number = 1): number => {
    const basePrice = menuItem.price + (variation?.priceAdjustment || 0);
    return basePrice * quantity;
  };

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const goToCart = () => {
    navigate(`/cart/${tableNumber}`);
  };

  if (loading) {
    return (
      <div className=\"menu-container loading\">
        <div className=\"loading-spinner\"></div>
        <p>Memuat menu...</p>
      </div>
    );
  }

  return (
    <div className=\"menu-container\">
      {/* Header */}
      <div className=\"menu-header\">
        <div className=\"header-content\">
          <button className=\"back-button\" onClick={() => navigate(`/menu?meja=${tableNumber}`)}>
            ← Kembali
          </button>
          <div className=\"table-info\">
            <span className=\"table-label\">Meja</span>
            <span className=\"table-number\">{tableNumber}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className=\"category-tabs\">
        {categories.map(category => (
          <button
            key={category.key}
            className={`category-tab ${selectedCategory === category.key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.key)}
          >
            <span className=\"category-icon\">{category.icon}</span>
            <span className=\"category-label\">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className=\"menu-items\">
        {filteredItems.length === 0 ? (
          <div className=\"empty-category\">
            <p>Tidak ada item yang tersedia untuk kategori ini.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <MenuItemCard 
              key={item.id}
              item={item}
              onAddToCart={addToCart}
            />
          ))
        )}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className=\"cart-summary\">
          <div className=\"cart-info\">
            <span className=\"cart-count\">{getTotalItems()} item</span>
            <span className=\"cart-total\">{formatCurrency(getTotalPrice())}</span>
          </div>
          <button className=\"cart-button\" onClick={goToCart}>
            Lihat Keranjang
          </button>
        </div>
      )}
    </div>
  );
};

// Menu Item Card Component
interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (menuItem: MenuItem, variation?: MenuVariation, notes?: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  const [showVariations, setShowVariations] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<MenuVariation | undefined>();
  const [notes, setNotes] = useState('');

  const handleAddToCart = () => {
    if (item.variations && item.variations.length > 0) {
      setShowVariations(true);
    } else {
      onAddToCart(item, undefined, notes);
      setNotes('');
    }
  };

  const handleVariationSelect = (variation: MenuVariation) => {
    setSelectedVariation(variation);
    onAddToCart(item, variation, notes);
    setShowVariations(false);
    setSelectedVariation(undefined);
    setNotes('');
  };

  const getDisplayPrice = (variation?: MenuVariation): number => {
    return item.price + (variation?.priceAdjustment || 0);
  };

  return (
    <div className=\"menu-item-card\">
      <div className=\"item-image\">
        <img src={item.image} alt={item.name} onError={(e) => {
          (e.target as HTMLImageElement).src = '/images/placeholder.svg';
        }} />
      </div>
      
      <div className=\"item-details\">
        <h3 className=\"item-name\">{item.name}</h3>
        <p className=\"item-description\">{item.description}</p>
        <div className=\"item-price\">
          {formatCurrency(item.price)}
          {item.variations && item.variations.length > 0 && (
            <span className=\"variations-note\">*variasi tersedia</span>
          )}
        </div>
      </div>

      <div className=\"item-actions\">
        <button 
          className=\"add-to-cart-button\"
          onClick={handleAddToCart}
        >
          +
        </button>
      </div>

      {/* Variations Modal */}
      {showVariations && (
        <div className=\"variations-modal\">
          <div className=\"modal-content\">
            <div className=\"modal-header\">
              <h4>{item.name}</h4>
              <button 
                className=\"close-button\"
                onClick={() => setShowVariations(false)}
              >
                ×
              </button>
            </div>
            
            <div className=\"modal-body\">
              <h5>Pilih Variasi:</h5>
              <div className=\"variations-list\">
                {item.variations?.map(variation => (
                  <button
                    key={variation.id}
                    className=\"variation-option\"
                    onClick={() => handleVariationSelect(variation)}
                  >
                    <span className=\"variation-name\">{variation.name}</span>
                    <span className=\"variation-price\">
                      {formatCurrency(getDisplayPrice(variation))}
                    </span>
                  </button>
                ))}
              </div>

              <div className=\"notes-section\">
                <label htmlFor=\"notes\">Catatan (opsional):</label>
                <textarea
                  id=\"notes\"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder=\"Tambahkan catatan khusus...\"
                  maxLength={100}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;