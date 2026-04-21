# Sistem Inventaris Lab Multimedia 📦

Sistem manajemen inventaris berbasis web yang dirancang untuk memudahkan pencatatan, pelacakan, dan pengelolaan aset di Laboratorium Multimedia. Dibangun menggunakan MERN Stack (MongoDB, Express, React, Node.js).

## 🚀 Fitur Utama

- **Otorisasi Multi-Role**: Sistem akun untuk Admin dan Member (Staff/Asisten).
- **Admin Approval**: Pendaftaran akun baru wajib disetujui oleh Admin sebelum bisa login.
- **Data Master Barang**: Kelola daftar barang, kategori, dan satuan secara terpusat.
- **Transaksi Barang Masuk/Keluar**: Pencatatan stok yang akurat dengan sistem **Atomic Update** (mencegah duplikasi atau kesalahan hitung stok saat input bersamaan).
- **Audit Trail**: Setiap transaksi mencatat nama operator yang melakukan input untuk pertanggungjawaban.
- **Dashboard Statis**: Ringkasan kondisi inventaris secara real-time.
- **Responsive Design**: Tampilan modern dan nyaman dibuka di berbagai perangkat.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Vanilla CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JSON Web Token (JWT) & Bcryptjs.

## 📦 Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/USERNAME_ANDA/sistem-inventaris-multimedia.git
   cd sistem-inventaris-multimedia
   ```

2. **Instalasi Dependencies**
   
   Instal untuk backend (root):
   ```bash
   npm install
   ```
   Instal untuk frontend:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Konfigurasi Environment**
   Buat file `.env` di folder root dan isi dengan:
   ```env
   PORT=5000
   MONGO_URI=isi_dengan_url_mongodb_anda
   JWT_SECRET=rahasia_anda_disini
   ```

## 🏃 Cara Menjalankan

Cukup jalankan satu perintah di folder root untuk menyalakan Backend dan Frontend sekaligus:

```bash
npm run dev
```

- **Backend**: Berjalan di `http://localhost:5000`
- **Frontend**: Berjalan di `http://localhost:5173`

## 👤 Kontribusi
Proyek ini dikembangkan untuk kebutuhan internal Laboratorium Multimedia. Jika ingin berkontribusi, silakan lakukan fork dan kirimkan Pull Request.
