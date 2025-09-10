import { MenuItem, MenuCategory } from '../types';

// Sample menu data untuk demonstrasi
export const menuItems: MenuItem[] = [
  // Makanan
  {
    id: 'food-001',
    name: 'Nasi Goreng Spesial',
    description: 'Nasi goreng dengan ayam, udang, dan telur mata sapi',
    price: 25000,
    image: '/images/nasi-goreng.jpg',
    category: MenuCategory.MAKANAN,
    available: true
  },
  {
    id: 'food-002',
    name: 'Mie Ayam Bakso',
    description: 'Mie ayam dengan bakso sapi dan pangsit goreng',
    price: 18000,
    image: '/images/mie-ayam.jpg',
    category: MenuCategory.MAKANAN,
    available: true
  },
  {
    id: 'food-003',
    name: 'Gado-gado Jakarta',
    description: 'Sayuran segar dengan bumbu kacang khas Jakarta',
    price: 15000,
    image: '/images/gado-gado.jpg',
    category: MenuCategory.MAKANAN,
    available: true
  },
  {
    id: 'food-004',
    name: 'Sate Ayam',
    description: 'Sate ayam dengan bumbu kacang dan lontong',
    price: 20000,
    image: '/images/sate-ayam.jpg',
    category: MenuCategory.MAKANAN,
    available: true
  },
  
  // Minuman
  {
    id: 'drink-001',
    name: 'Es Teh Manis',
    description: 'Teh manis dingin segar',
    price: 5000,
    image: '/images/es-teh.jpg',
    category: MenuCategory.MINUMAN,
    variations: [
      { id: 'var-001', name: 'Panas', priceAdjustment: 0 },
      { id: 'var-002', name: 'Es', priceAdjustment: 0 }
    ],
    available: true
  },
  {
    id: 'drink-002',
    name: 'Es Jeruk',
    description: 'Jeruk segar dengan es batu',
    price: 8000,
    image: '/images/es-jeruk.jpg',
    category: MenuCategory.MINUMAN,
    available: true
  },
  {
    id: 'drink-003',
    name: 'Kopi Hitam',
    description: 'Kopi hitam tubruk tradisional',
    price: 6000,
    image: '/images/kopi-hitam.jpg',
    category: MenuCategory.MINUMAN,
    variations: [
      { id: 'var-003', name: 'Panas', priceAdjustment: 0 },
      { id: 'var-004', name: 'Es', priceAdjustment: 1000 }
    ],
    available: true
  },
  {
    id: 'drink-004',
    name: 'Jus Alpukat',
    description: 'Jus alpukat segar dengan susu kental manis',
    price: 12000,
    image: '/images/jus-alpukat.jpg',
    category: MenuCategory.MINUMAN,
    available: true
  },
  
  // Dessert
  {
    id: 'dessert-001',
    name: 'Es Krim Vanilla',
    description: 'Es krim vanilla dengan topping coklat',
    price: 10000,
    image: '/images/es-krim.jpg',
    category: MenuCategory.DESSERT,
    available: true
  },
  {
    id: 'dessert-002',
    name: 'Puding Coklat',
    description: 'Puding coklat lembut dengan whipped cream',
    price: 8000,
    image: '/images/puding.jpg',
    category: MenuCategory.DESSERT,
    available: true
  },
  {
    id: 'dessert-003',
    name: 'Pisang Goreng',
    description: 'Pisang goreng crispy dengan gula halus',
    price: 7000,
    image: '/images/pisang-goreng.jpg',
    category: MenuCategory.DESSERT,
    available: true
  }
];

// Restaurant information
export const restaurantInfo = {
  name: 'Warung Digital',
  description: 'Warung tradisional dengan pelayanan digital modern',
  address: 'Jl. Teknologi No. 123, Jakarta',
  phone: '021-12345678'
};