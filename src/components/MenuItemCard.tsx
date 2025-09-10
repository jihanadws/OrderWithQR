'use client';

import { useState } from 'react';
import { MenuItem, CartItem } from '@/types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (cartItem: CartItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<{ [key: string]: string }>({});
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const calculatePrice = () => {
    let totalPrice = item.price;
    
    if (item.variations) {
      item.variations.forEach(variation => {
        const selectedOption = variation.options.find(opt => opt.label === selectedVariations[variation.name]);
        if (selectedOption) {
          totalPrice += selectedOption.price;
        }
      });
    }
    
    return totalPrice;
  };

  const handleVariationChange = (variationName: string, optionLabel: string) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationName]: optionLabel
    }));
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItem: item,
      quantity,
      selectedVariations: Object.keys(selectedVariations).length > 0 ? selectedVariations : undefined,
      notes: notes.trim() || undefined
    };
    
    onAddToCart(cartItem);
    
    // Reset form
    setQuantity(1);
    setSelectedVariations({});
    setNotes('');
    setIsExpanded(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!item.available) {
    return (
      <div className="card opacity-60 grayscale">
        <div className="card-body">
          <div className="w-full h-28 sm:h-32 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
            <span className="text-4xl opacity-50">{item.image || '🍽️'}</span>
          </div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-400 line-clamp-2">{item.name}</h3>
            <span className="text-red-500 text-sm font-medium bg-red-100 px-2 py-1 rounded-lg">Habis</span>
          </div>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
          <p className="text-gray-400 font-medium">{formatPrice(item.price)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full flex flex-col hover-lift group">
      {/* Menu Item Image and Content */}
      <div className="card-body flex-1">
        {/* Image with gradient overlay */}
        <div className="relative w-full h-32 sm:h-36 lg:h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
          {item.image ? (
            <>
              <span className="text-4xl sm:text-5xl lg:text-6xl z-10 relative">{item.image}</span>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          ) : (
            <span className="text-gray-400 text-sm font-medium">No Image</span>
          )}
          {/* Price badge */}
          <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-xl text-sm font-semibold shadow-lg">
            {formatPrice(calculatePrice())}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
            {item.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>

          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group flex items-center justify-center"
            >
              <span className="mr-2">+</span>
              <span>Tambah ke Keranjang</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-xl"></div>
            </button>
          ) : null}
        </div>
      </div>

      {/* Expanded Form */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="p-4 sm:p-5 space-y-4">
            {/* Variations */}
            {item.variations && item.variations.map(variation => (
              <div key={variation.name} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {variation.name}
                </label>
                <div className="space-y-2">
                  {variation.options.map(option => (
                    <label key={option.label} className="flex items-center p-2 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name={variation.name}
                        value={option.label}
                        checked={selectedVariations[variation.name] === option.label}
                        onChange={() => handleVariationChange(variation.name, option.label)}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm flex-1">
                        {option.label}
                        {option.price !== 0 && (
                          <span className="text-blue-600 font-medium ml-2">
                            ({option.price > 0 ? '+' : ''}{formatPrice(option.price)})
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Jumlah
              </label>
              <div className="flex items-center justify-center space-x-4 bg-white rounded-xl p-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-lg font-bold hover:from-gray-300 hover:to-gray-400 transition-all duration-200 hover-scale"
                >
                  -
                </button>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent min-w-[2rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover-scale"
                >
                  +
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Catatan (Opsional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Tidak pakai cabe, extra keju..."
                className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="flex-1 btn-secondary py-3 text-sm font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary py-3 text-sm font-semibold relative overflow-hidden group"
                style={{ flexGrow: 2 }}
              >
                <span className="relative z-10">
                  Tambah ({formatPrice(calculatePrice() * quantity)})
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-xl"></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}