# QR Order App - Sistem Pemesanan Berbasis QR Code

Aplikasi web untuk sistem pemesanan mandiri di restoran/kafe yang memungkinkan pelanggan memindai QR code di meja untuk mengakses menu digital dan melakukan pemesanan.

## 🚀 Fitur Utama

### Untuk Pelanggan
- **QR Code Scanning**: Scan QR code di meja untuk mengakses menu
- **Menu Digital**: Tampilan menu yang dikategorikan (Makanan, Minuman, Dessert)
- **Keranjang Belanja**: Tambah/kurangi item, edit quantity, tambah catatan
- **Variasi Menu**: Support untuk variasi item (contoh: es/panas untuk minuman)
- **Session Persistence**: Keranjang tersimpan di local storage (tidak hilang jika tab ditutup)
- **Receipt Digital**: Tampilan receipt dengan nomor pesanan untuk ditunjukkan ke kasir
- **Responsive Design**: Optimized untuk mobile device

### Keamanan & Error Handling
- **QR Validation**: Validasi format QR code dan nomor meja
- **Network Detection**: Deteksi koneksi internet
- **Error Boundary**: Handling error aplikasi
- **Session Management**: Satu meja satu sesi aktif

## 🏗️ Teknologi yang Digunakan

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: React Hooks + Local Storage
- **Styling**: CSS3 dengan responsive design
- **Icons**: Unicode Emoji

## 📱 URL Structure

- `/menu?meja=XX` - Landing page (dari QR scan)
- `/menu/:tableNumber` - Menu display 
- `/cart/:tableNumber` - Shopping cart
- `/receipt/:orderId` - Order receipt

## 🎯 User Flow

1. **QR Scan**: Pelanggan scan QR code di meja
2. **Landing**: Tampil welcome message dengan nomor meja
3. **Menu Browsing**: Browse menu berdasarkan kategori
4. **Add to Cart**: Tambah item ke keranjang (dengan variasi & notes)
5. **Cart Review**: Review pesanan, edit quantity/notes
6. **Order Submission**: Submit pesanan ke sistem
7. **Receipt**: Tampil receipt untuk ditunjukkan ke kasir
8. **Payment**: Pembayaran manual di kasir

## 🛠️ Instalasi & Development

### Prerequisites
- Node.js 16+
- npm atau yarn

### Setup Project
```bash
# Clone/download project
cd qr-order-app

# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev
```

### Build for Production
```bash
# Build untuk production
npm run build

# Preview build hasil
npm run preview
```

## 📊 Data Structure

### MenuItem
```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  variations?: MenuVariation[];
  available: boolean;
}
```

### Order
```typescript
interface Order {
  id: string;
  tableNumber: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  status: OrderStatus;
  notes?: string;
}
```

## 🎨 Customization

### Menu Data
Edit `src/data/menuData.ts` untuk mengubah:
- Daftar menu items
- Harga dan deskripsi
- Kategori menu
- Informasi restoran

### Styling
Edit `src/App.css` untuk mengubah:
- Color scheme
- Typography
- Layout components
- Responsive breakpoints

### Restaurant Branding
Edit `src/data/menuData.ts` bagian `restaurantInfo`:
```javascript
export const restaurantInfo = {
  name: 'Nama Restoran Anda',
  description: 'Deskripsi restoran',
  address: 'Alamat lengkap',
  phone: 'Nomor telepon'
};
```

## 🔧 Configuration

### Environment Variables
Buat file `.env` untuk konfigurasi:
```
VITE_APP_NAME=QR Order App
VITE_RESTAURANT_NAME=Nama Restoran
```

### QR Code Generation
Generate QR code dengan format URL:
```
https://your-domain.com/menu?meja=01
https://your-domain.com/menu?meja=02
...dst
```

## 📋 Features Checklist

- ✅ Landing page dengan ekstraksi nomor meja dari URL
- ✅ Menu display dengan kategori dan item details  
- ✅ Shopping cart dengan quantity control dan notes
- ✅ Local storage untuk session persistence
- ✅ Order submission dan receipt generation
- ✅ Error handling untuk QR invalid dan network issues
- ✅ Responsive design untuk mobile devices
- ✅ Menu item variations support
- ✅ Order notes dan item notes
- ✅ Receipt printing capability

## 🚀 Deployment

### Static Hosting (Netlify/Vercel)
```bash
npm run build
# Upload dist/ folder ke hosting
```

### Server Deployment
```bash
# Build untuk production
npm run build

# Serve dengan web server (nginx/apache)
# Point document root ke dist/
```

## 📞 Support & Contact

Untuk bantuan teknis atau customization lebih lanjut, silakan hubungi developer.

---

**Note**: Aplikasi ini adalah frontend-only solution. Untuk integrasi dengan system POS atau kitchen display system, diperlukan development backend API tambahan.