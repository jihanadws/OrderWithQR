import { MenuItem } from '@/types';

export const menuItems: MenuItem[] = [
  // Food Items
  {
    id: 'nasi-goreng',
    name: 'Nasi Goreng Spesial',
    description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
    price: 25000,
    category: 'food',
    available: true,
    image: '🍛',
    variations: [
      {
        name: 'Level Pedas',
        options: [
          { label: 'Tidak Pedas', price: 0 },
          { label: 'Sedang', price: 0 },
          { label: 'Pedas', price: 0 },
          { label: 'Extra Pedas', price: 2000 }
        ]
      }
    ]
  },
  {
    id: 'mie-ayam',
    name: 'Mie Ayam Bakso',
    description: 'Mie ayam dengan bakso dan sayuran',
    price: 20000,
    category: 'food',
    available: true,
    image: '🍜',
    variations: [
      {
        name: 'Ukuran',
        options: [
          { label: 'Regular', price: 0 },
          { label: 'Jumbo', price: 5000 }
        ]
      }
    ]
  },
  {
    id: 'gado-gado',
    name: 'Gado-Gado',
    description: 'Sayuran segar dengan bumbu kacang',
    price: 18000,
    category: 'food',
    available: true,
    image: '🥗'
  },
  {
    id: 'ayam-bakar',
    name: 'Ayam Bakar',
    description: 'Ayam bakar dengan nasi dan lalapan',
    price: 30000,
    category: 'food',
    available: true,
    image: '🍗',
    variations: [
      {
        name: 'Bagian Ayam',
        options: [
          { label: 'Paha', price: 0 },
          { label: 'Dada', price: 0 },
          { label: 'Sayap', price: -3000 }
        ]
      }
    ]
  },

  // Drinks
  {
    id: 'es-teh',
    name: 'Es Teh Manis',
    description: 'Teh manis dengan es batu',
    price: 5000,
    category: 'drinks',
    available: true,
    image: '🧊',
    variations: [
      {
        name: 'Level Manis',
        options: [
          { label: 'Kurang Manis', price: 0 },
          { label: 'Normal', price: 0 },
          { label: 'Extra Manis', price: 1000 }
        ]
      }
    ]
  },
  {
    id: 'jus-jeruk',
    name: 'Jus Jeruk Segar',
    description: 'Jus jeruk murni tanpa pengawet',
    price: 12000,
    category: 'drinks',
    available: true,
    image: '🍊',
    variations: [
      {
        name: 'Tambahan Es',
        options: [
          { label: 'Tanpa Es', price: 0 },
          { label: 'Dengan Es', price: 0 },
          { label: 'Extra Es', price: 1000 }
        ]
      }
    ]
  },
  {
    id: 'kopi-hitam',
    name: 'Kopi Hitam',
    description: 'Kopi hitam original tanpa gula',
    price: 8000,
    category: 'drinks',
    available: true,
    image: '☕'
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Kopi dengan susu dan foam',
    price: 15000,
    category: 'drinks',
    available: true,
    image: '☕',
    variations: [
      {
        name: 'Ukuran',
        options: [
          { label: 'Regular', price: 0 },
          { label: 'Large', price: 5000 }
        ]
      }
    ]
  },

  // Desserts
  {
    id: 'es-krim-vanilla',
    name: 'Es Krim Vanilla',
    description: 'Es krim vanilla dengan topping',
    price: 10000,
    category: 'desserts',
    available: true,
    image: '🍦',
    variations: [
      {
        name: 'Topping',
        options: [
          { label: 'Tanpa Topping', price: 0 },
          { label: 'Coklat', price: 2000 },
          { label: 'Stroberi', price: 2000 },
          { label: 'Mix', price: 3000 }
        ]
      }
    ]
  },
  {
    id: 'pisang-goreng',
    name: 'Pisang Goreng',
    description: 'Pisang goreng crispy dengan madu',
    price: 8000,
    category: 'desserts',
    available: true,
    image: '🍌'
  },
  {
    id: 'klepon',
    name: 'Klepon',
    description: 'Klepon dengan gula merah dan kelapa parut',
    price: 6000,
    category: 'desserts',
    available: true,
    image: '🍡'
  }
];