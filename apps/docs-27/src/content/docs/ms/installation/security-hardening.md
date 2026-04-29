---
title: "Lampiran 5: Tingkatkan keselamatan pemasangan XOOPS anda"
---
Selepas memasang XOOPS 2.7.0, ambil langkah berikut untuk mengeraskan tapak. Setiap langkah adalah pilihan secara individu, tetapi bersama-sama mereka meningkatkan keselamatan garis dasar pemasangan dengan ketara.## 1. Pasang dan konfigurasikan modul PelindungModul `protector` yang digabungkan ialah tembok api XOOPS. Jika anda tidak memasangnya semasa wizard awal, pasangkannya dari skrin Pentadbir → Modul sekarang.![](/XOOPS-docs/2.7/img/installation/img_73.jpg)Buka panel pentadbir Protector dan semak amaran yang dipaparkan. Arahan PHP lama seperti `register_globals` tidak lagi wujud (PHP 8.2+ telah mengalih keluarnya), jadi anda tidak akan melihat amaran tersebut lagi. Amaran semasa biasanya berkaitan dengan kebenaran direktori, tetapan sesi dan konfigurasi laluan amanah.## 2. Kunci `mainfile.php` dan `secure.php`Apabila pemasang selesai, ia cuba menandakan kedua-dua fail sebagai baca sahaja, tetapi sesetengah hos mengembalikan kebenaran. Sahkan dan mohon semula jika perlu:- `mainfile.php` → `0444` (pemilik, kumpulan, baca sahaja yang lain)
- `xoops_data/data/secure.php` → `0444``mainfile.php` mentakrifkan pemalar laluan (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, ZXQPH00X0) dan pengeluaran. `secure.php` memegang bukti kelayakan pangkalan data:- Dalam 2.5.x, bukti kelayakan pangkalan data digunakan untuk hidup dalam `mainfile.php`. Ia kini disimpan dalam `xoops_data/data/secure.php`, yang dimuatkan oleh `mainfile.php` pada masa jalan. Menyimpan `secure.php` di dalam `xoops_data/` — direktori yang anda digalakkan untuk menempatkan semula di luar akar dokumen — menjadikannya lebih sukar bagi penyerang untuk mencapai bukti kelayakan melalui HTTP.## 3. Alihkan `xoops_lib/` dan `xoops_data/` di luar akar dokumenJika anda belum berbuat demikian, alihkan kedua-dua direktori ini satu tahap di atas akar web anda dan namakannya semula. Kemudian kemas kini pemalar yang sepadan dalam `mainfile.php`:
```
php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```
Meletakkan direktori ini di luar akar dokumen menghalang akses terus ke pepohon `vendor/` Komposer, templat cache, fail sesi, data yang dimuat naik dan bukti kelayakan pangkalan data dalam `secure.php`.## 4. Konfigurasi domain kukiXOOPS 2.7.0 memperkenalkan dua pemalar domain kuki dalam `mainfile.php`:
```
php
// Use the Public Suffix List (PSL) to derive the registrable domain.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Explicit cookie domain; may be blank, the full host, or the registrable domain.
define('XOOPS_COOKIE_DOMAIN', '');
```
Garis panduan:- Biarkan `XOOPS_COOKIE_DOMAIN` kosong jika anda menyediakan XOOPS daripada satu nama hos atau daripada IP.
- Gunakan hos penuh (cth. `www.example.com`) untuk menskop kuki kepada nama hos itu sahaja.
- Gunakan domain boleh didaftarkan (cth. `example.com`) apabila anda mahu kuki dikongsi di seluruh `www.example.com`, `blog.example.com`, dsb.
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` membolehkan XOOPS membahagi TLD kompaun dengan betul (`co.uk`, `com.au`, …) dan bukannya menetapkan kuki secara tidak sengaja pada TLD yang berkesan.## 5. Bendera pengeluaran dalam `mainfile.php``mainfile.dist.php` dihantar dengan dua bendera ini ditetapkan kepada `false` untuk pengeluaran:
```
php
define('XOOPS_DB_LEGACY_LOG', false); // disable legacy SQL usage logging
define('XOOPS_DEBUG',         false); // disable debug notices
```
Tinggalkan mereka pada pengeluaran. Dayakan mereka buat sementara waktu dalam persekitaran pembangunan atau pementasan apabila anda mahu:- memburu panggilan pangkalan data legasi yang berlarutan (`XOOPS_DB_LEGACY_LOG = true`);
- notis `E_USER_DEPRECATED` permukaan dan output nyahpepijat lain (`XOOPS_DEBUG = true`).## 6. Padam pemasangSelepas pemasangan selesai:1. Padamkan mana-mana direktori `install_remove_*` yang dinamakan semula daripada akar web.
2. Padamkan sebarang skrip `install_cleanup_*.php` yang dibuat oleh wizard semasa pembersihan.
3. Sahkan direktori `install/` tidak lagi boleh dicapai melalui HTTP.Meninggalkan direktori pemasang yang dilumpuhkan tetapi hadir adalah risiko yang rendah tetapi boleh dielakkan.## 7. Pastikan XOOPS dan modul sentiasa dikemas kiniXOOPS mengikut rentak tampalan biasa. Langgan repositori XoopsCore27 GitHub untuk pemberitahuan keluaran dan kemas kini tapak anda dan mana-mana modul pihak ketiga apabila keluaran baharu dihantar. Kemas kini keselamatan untuk 2.7.x diterbitkan melalui halaman Keluaran repositori.