---
title: Meningkatkan dari XOOPS 2.5 ke 2.7
description: Panduan langkah demi langkah untuk meningkatkan instalasi XOOPS Anda dengan aman dari 2.5.x ke 2.7.x.
---

:::hati-hati[Back up dulu]
Selalu buat cadangan database dan file Anda sebelum melakukan upgrade. Tidak ada pengecualian.
:::

## Apa yang Berubah di 2.7

- **PHP 8.2+ diperlukan** — PHP 7.x tidak lagi didukung
- **Dependensi yang dikelola komposer** — Pustaka core yang dikelola melalui `composer.json`
- **PSR-4 autoloading** — Kelas module dapat menggunakan namespace
- **Peningkatan XoopsObject** — Keamanan tipe `getVar()` baru, `obj2Array()` tidak digunakan lagi
- **Bootstrap 5 admin** — Panel admin dibangun kembali dengan Bootstrap 5

## Daftar Periksa Pra-Peningkatan

- [ ] PHP 8.2+ tersedia di server Anda
- [ ] Pencadangan basis data penuh (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Cadangan file lengkap instalasi Anda
- [ ] Daftar module yang diinstal dan versinya
- [ ] theme khusus dicadangkan secara terpisah

## Langkah Peningkatan

### 1. Letakkan situs dalam mode pemeliharaan

```php
// mainfile.php — add temporarily
define('XOOPS_MAINTENANCE', true);
```

### 2. Unduh XOOPS 2.7

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. Ganti file core

Unggah file baru, **tidak termasuk**:
- `uploads/` — file yang Anda unggah
- `xoops_data/` — konfigurasi Anda
- `modules/` — module yang Anda pasang
- `themes/` — theme Anda
- `mainfile.php` — konfigurasi situs Anda

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. Jalankan skrip pemutakhiran

Navigasikan ke `https://yourdomain.com/upgrade/` di browser Anda.
Wizard pemutakhiran akan menerapkan migrasi basis data.

### 5. Perbarui module

module XOOPS 2.7 harus kompatibel dengan PHP 8.2.
Periksa [Module Ecosystem](/xoops-docs/2.7/module-guide/introduction/) untuk versi terbaru.

Di Admin → module, klik **Perbarui** untuk setiap module yang diinstal.

### 6. Hapus mode pemeliharaan dan uji

Hapus baris `XOOPS_MAINTENANCE` dari `mainfile.php` dan
verifikasi semua halaman dimuat dengan benar.

## Masalah Umum

**Kesalahan "Kelas tidak ditemukan" setelah peningkatan**
- Jalankan `composer dump-autoload` di root XOOPS
- Hapus direktori `xoops_data/caches/`

**module rusak setelah pembaruan**
- Periksa rilis GitHub module untuk versi yang kompatibel dengan 2.7
- module mungkin memerlukan perubahan kode untuk PHP 8.2 (fungsi yang tidak digunakan lagi, properti yang diketik)

**Panel Admin CSS rusak**
- Hapus cache browser Anda
- Pastikan `xoops_lib/` telah diganti sepenuhnya selama pengunggahan file
