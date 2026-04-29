---
title: "Lampiran 5: Tingkatkan keamanan instalasi XOOPS Anda"
---

Setelah menginstal XOOPS 2.7.0, lakukan langkah-langkah berikut untuk memperkuat situs. Setiap langkah bersifat opsional, namun jika digabungkan, langkah-langkah tersebut akan meningkatkan keamanan dasar instalasi secara signifikan.

## 1. Instal dan konfigurasikan module Pelindung

module `protector` yang dibundel adalah firewall XOOPS. Jika Anda tidak menginstalnya pada wizard awal, instal dari layar Admin → module sekarang.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Buka panel admin Protector dan tinjau peringatan yang ditampilkannya. Direktif PHP lama seperti `register_globals` sudah tidak ada lagi (PHP 8.2+ telah menghapusnya), jadi Anda tidak akan melihat peringatan tersebut lagi. Peringatan saat ini biasanya berhubungan dengan izin direktori, pengaturan sesi, dan konfigurasi jalur kepercayaan.

## 2. Kunci `mainfile.php` dan `secure.php`

Ketika penginstal selesai, ia mencoba menandai kedua file sebagai hanya-baca, tetapi beberapa host mengembalikan izinnya. Verifikasi dan ajukan permohonan kembali jika diperlukan:

- `mainfile.php` → `0444` (pemilik, grup, read-only lainnya)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` mendefinisikan konstanta jalur (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, `XOOPS_COOKIE_DOMAIN_USE_PSL`) dan bendera produksi. `secure.php` menyimpan kredensial database:

- Di 2.5.x, kredensial database dulu ada di `mainfile.php`. Mereka sekarang disimpan di `xoops_data/data/secure.php`, yang dimuat oleh `mainfile.php` saat runtime. Menyimpan `secure.php` di dalam `xoops_data/` — direktori yang disarankan untuk Anda pindahkan ke luar root dokumen — mempersulit penyerang untuk mencapai kredensial melalui HTTP.

## 3. Pindahkan `xoops_lib/` dan `xoops_data/` ke luar root dokumen

Jika Anda belum melakukannya, pindahkan kedua direktori ini satu tingkat di atas root web Anda dan ganti namanya. Kemudian perbarui konstanta terkait di `mainfile.php`:

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

Menempatkan direktori ini di luar akar dokumen mencegah akses langsung ke pohon `vendor/` Komposer, template cache, file sesi, data yang diunggah, dan kredensial basis data di `secure.php`.

## 4. Konfigurasi domain kue

XOOPS 2.7.0 memperkenalkan dua konstanta domain cookie di `mainfile.php`:

```php
// Use the Public Suffix List (PSL) to derive the registrable domain.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Explicit cookie domain; may be blank, the full host, or the registrable domain.
define('XOOPS_COOKIE_DOMAIN', '');
```

Pedoman:

- Biarkan `XOOPS_COOKIE_DOMAIN` kosong jika Anda menyajikan XOOPS dari satu nama host atau dari IP.
- Gunakan host lengkap (misalnya `www.example.com`) untuk mencakup cookie hanya pada nama host tersebut.
- Gunakan domain yang dapat didaftarkan (misalnya `example.com`) bila Anda ingin cookie dibagikan ke `www.example.com`, `blog.example.com`, dll.
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` memungkinkan XOOPS membagi TLD gabungan dengan benar (`co.uk`, `com.au`, …) alih-alih menyetel cookie pada TLD efektif secara tidak sengaja.

## 5. Bendera produksi di `mainfile.php`

`mainfile.dist.php` dikirimkan dengan dua bendera berikut yang disetel ke `false` untuk produksi:

```php
define('XOOPS_DB_LEGACY_LOG', false); // disable legacy SQL usage logging
define('XOOPS_DEBUG',         false); // disable debug notices
```

Biarkan mereka tidak berproduksi. Aktifkan untuk sementara di lingkungan pengembangan atau pementasan saat Anda ingin:

- memburu panggilan database lama (`XOOPS_DB_LEGACY_LOG = true`);
- pemberitahuan permukaan `E_USER_DEPRECATED` dan keluaran debug lainnya (`XOOPS_DEBUG = true`).

## 6. Hapus penginstal

Setelah instalasi selesai:

1. Hapus direktori `install_remove_*` yang telah diganti namanya dari root web.
2. Hapus skrip `install_cleanup_*.php` yang dibuat wizard selama pembersihan.
3. Konfirmasikan bahwa direktori `install/` tidak lagi dapat dijangkau melalui HTTP.

Membiarkan direktori penginstal yang dinonaktifkan namun masih ada adalah risiko yang tingkat keparahannya rendah namun dapat dihindari.

## 7. Selalu perbarui XOOPS dan module

XOOPS mengikuti irama patch reguler. Berlangganan ke repositori GitHub XoopsCore27 untuk pemberitahuan rilis, dan perbarui situs Anda dan module pihak ketiga mana pun setiap kali rilis baru dikirimkan. Pembaruan keamanan untuk 2.7.x dipublikasikan melalui halaman Rilis repositori.
