# UTS Pemrograman Web Dasar – AromaCraft

## Identitas Mahasiswa

- Nama: Riziki Ramadhan I.P
- NIM: 2405101050
- Kelas: 5D
- Program Studi: TEKNIK INFORMATIKA
- Mata Kuliah: Pemrograman Web Dasar
- Tahun Akademik: 2026/2027

## Deskripsi

Repository ini berisi source code, dokumentasi hasil pengerjaan Ujian Tengah Semester (UTS)
mata kuliah Pemrograman Web Dasar.

## Deskripsi Pengerjaan UTS

**AromaCraft** adalah aplikasi web toko parfum online dengan fitur *custom fragrance* (racik aroma sendiri).
Aplikasi dibuat sebagai *single page application* sederhana menggunakan **HTML, CSS, dan JavaScript murni**
(tanpa framework dan tanpa backend). Seluruh data (produk, pengguna, keranjang, pesanan, stok) disimpan di
`localStorage` browser, sehingga aplikasi bisa langsung dijalankan tanpa instalasi server atau database.

Halaman dirender lewat *hash routing* (`#katalog`, `#keranjang`, `#admin`, dst.) dan memiliki dua peran:

- **Pelanggan**: menelusuri katalog, meracik parfum, berbelanja, membayar, dan melacak pesanan.
- **Admin**: mengelola produk, stok, verifikasi pembayaran, pengiriman, pengguna, dan laporan penjualan.

Teknologi yang dipakai: HTML5, CSS3 (variabel CSS, grid/flexbox, desain responsif), JavaScript ES6,
Web Storage (`localStorage`), SVG inline untuk ilustrasi botol, serta Google Fonts (Cormorant Garamond dan DM Sans).

## Fitur yang Diimplementasikan

**Pelanggan**

1. **Autentikasi**: registrasi dengan validasi (nama, email, nomor WhatsApp, kata sandi), login, logout, dan simulasi lupa password.
2. **Beranda**: hero banner, *best seller* (dihitung otomatis dari pesanan yang sudah dibayar), dan kategori favorit.
3. **Katalog parfum**: pencarian (nama, notes, kategori), filter aroma dan gender, serta urut harga termurah/termahal.
4. **Detail produk**: deskripsi, konsentrasi (EDT/EDP/Parfum), *pyramid notes* (top, middle, base), pilihan ukuran 30/50/100 ml dengan stok per ukuran, jumlah, dan nama di label botol.
5. **Racik aroma kustom (Custom Blend)**: memilih sendiri top, middle, dan base note, ukuran botol, dan label nama.
6. **Fragrance Quiz**: 3 pertanyaan singkat yang menghasilkan 3 rekomendasi parfum berdasarkan skor kecocokan.
7. **Keranjang**: ubah jumlah, hapus item, validasi stok, dan subtotal.
8. **Checkout**: pilih alamat, ekspedisi (JNE, J&T, SiCepat), dan proteksi kemasan, dengan ringkasan biaya yang dihitung otomatis.
9. **Pembayaran**: transfer BCA atau QRIS dengan unggah bukti bayar, batas waktu 1 jam (pesanan otomatis *Kedaluwarsa*), dan opsi batalkan pesanan.
10. **Riwayat dan pelacakan transaksi**: filter status, detail pesanan, nomor resi, tombol "Pesanan diterima", dan **Pesan lagi** (re-order).
11. **Profil**: ubah data diri, ganti kata sandi, dan kelola banyak alamat (alamat utama, tambah, hapus).

**Admin**

12. **Dasbor**: omzet hari ini/bulan ini beserta persentase perubahan, jumlah pesanan perlu diverifikasi/diproses, dan peringatan stok menipis.
13. **Kelola produk**: tambah, ubah, aktif/nonaktifkan, dan hapus produk, termasuk unggah foto produk dan kelola kategori aroma.
14. **Kelola stok**: tambah stok per ukuran, dengan riwayat perubahan stok.
15. **Kelola transaksi**: terima atau tolak bukti bayar (stok otomatis berkurang saat diterima), ubah status ke Dikemas, dan input nomor resi untuk status Dikirim.
16. **Kelola pengguna**: aktifkan atau nonaktifkan akun pelanggan.
17. **Laporan penjualan**: filter rentang tanggal, rekap per hari/bulan, produk terlaris, salin CSV, dan cetak.

**Tambahan**

18. **Ganti wallpaper**: pilihan tema warna atau unggah gambar sendiri (disimpan di `localStorage`).
19. **Keamanan tampilan**: seluruh teks pengguna di-*escape* untuk mencegah XSS, dan halaman admin dilindungi pengecekan peran.
20. **Responsif dan aksesibel**: tampilan menyesuaikan layar HP, memakai atribut `aria-*` dan label pada form.

**Akun untuk pengujian**

| Peran     | Email           | Kata sandi |
|-----------|-----------------|------------|
| Admin     | admin@gmail.com | admin123   |
| Pelanggan | rizki@gmail.com | rizki123   |

## Struktur Folder

- `uts/`: Source code dan file pendukung UTS.
  - `index.html`: kerangka halaman, ilustrasi SVG inline, dan panel wallpaper.
  - `style.css`: seluruh gaya tampilan dan tata letak responsif.
  - `script.js`: logika aplikasi (data, routing, tampilan, aksi pelanggan dan admin).
  - `images/`: foto produk bawaan (`p1.jpg` sampai `p8.jpg`); jika tidak ada, otomatis diganti ilustrasi botol SVG.
- `uts/screenshots/`: Bukti visual hasil implementasi.

## Cara Menjalankan Aplikasi

Aplikasi berjalan sepenuhnya di sisi klien, sehingga tidak perlu PHP, Node.js, maupun database.

1. Unduh atau *clone* repository ini, lalu masuk ke folder `uts/`.
2. Pastikan `index.html`, `style.css`, dan `script.js` berada dalam satu folder.
3. Buka `index.html` langsung di browser modern (Chrome, Edge, Firefox). Atau jalankan server lokal, misalnya:
   - VS Code: ekstensi *Live Server* lalu klik **Go Live**, atau
   - Terminal: `python -m http.server 8000` di folder `uts/`, lalu buka `http://localhost:8000`.
4. Masuk dengan akun pengujian di atas untuk mencoba peran admin maupun pelanggan.
5. Untuk mengembalikan data ke kondisi awal, hapus data situs (`localStorage`) di pengaturan browser atau lewat DevTools: Application, lalu Local Storage, lalu hapus kunci `aromacraft_v1`.

> Catatan: koneksi internet dibutuhkan hanya untuk memuat Google Fonts. Tanpa internet, aplikasi tetap berfungsi dengan font cadangan.

## Referensi

- MDN Web Docs – JavaScript, HTML, CSS, Web Storage API: https://developer.mozilla.org
- MDN Web Docs – Hash routing dengan `hashchange` event dan `Intl`/`toLocaleString` untuk format Rupiah dan tanggal: https://developer.mozilla.org
- Google Fonts – Cormorant Garamond dan DM Sans: https://fonts.google.com
- Materi dan modul perkuliahan Pemrograman Web Dasar.
