---
title: "Lampiran 2: Mengunggah XOOPS melalui FTP"
---

Lampiran ini menjelaskan penerapan XOOPS 2.7.0 ke host jarak jauh menggunakan FTP atau SFTP. Panel kontrol apa pun (cPanel, Plesk, DirectAdmin, dll.) akan menampilkan langkah-langkah dasar yang sama.

## 1. Siapkan databasenya

Melalui panel kontrol host Anda:

1. Buat database MySQL baru untuk XOOPS.
2. Buat pengguna database dengan kata sandi yang kuat.
3. Memberikan hak penuh kepada pengguna pada database yang baru dibuat.
4. Catat nama database, nama pengguna, kata sandi, dan host — Anda akan memasukkannya ke dalam penginstal XOOPS.

> **Kiat**
>
> Panel kontrol modern menghasilkan kata sandi yang kuat untuk Anda. Karena aplikasi menyimpan kata sandi dalam `xoops_data/data/secure.php`, Anda tidak perlu sering mengetikkannya — lebih baik nilai yang panjang dan dibuat secara acak.

## 2. Buat kotak surat administrator

Buat kotak surat email yang akan menerima pemberitahuan administrasi situs. Pemasang XOOPS meminta alamat ini selama penyiapan akun webmaster dan memvalidasinya dengan `FILTER_VALIDATE_EMAIL`.

## 3. Unggah file

XOOPS 2.7.0 dikirimkan dengan dependensi pihak ketiga yang sudah diinstal sebelumnya di `xoops_lib/vendor/` (paket Komposer, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF, dan banyak lagi). Hal ini membuat `xoops_lib/` jauh lebih besar dibandingkan versi 2.5.x — diperkirakan berukuran puluhan megabita.

**Jangan melewatkan file secara selektif di dalam `xoops_lib/vendor/`.** Melewatkan file di pohon vendor Komposer akan merusak pemuatan otomatis dan penginstalan akan gagal.

Struktur unggahan (dengan asumsi `public_html` adalah root dokumen):

1. Unggah `xoops_data/` dan `xoops_lib/` **di sebelah** `public_html`, bukan di dalamnya. Menempatkannya di luar root web adalah postur keamanan yang disarankan untuk 2.7.0.

   
   ```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← upload here
   └── xoops_lib/      ← upload here
   
   ```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. Unggah sisa isi direktori distribusi `htdocs/` ke `public_html/`.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **Jika host Anda tidak mengizinkan direktori di luar root dokumen**
>
> Unggah `xoops_data/` dan `xoops_lib/` **di dalam** `public_html/` dan **ganti namanya menjadi nama yang tidak jelas** (misalnya `xdata_8f3k2/` dan `xlib_7h2m1/`). Anda akan memasukkan jalur yang diubah namanya ke dalam penginstal ketika meminta Jalur Data XOOPS dan Jalur Perpustakaan XOOPS.

## 4. Jadikan direktori yang dapat ditulisi dapat ditulisi

Melalui dialog CHMOD (atau SSH) klien FTP, buatlah direktori yang tercantum dalam Bab 2 dapat ditulis oleh server web. Pada sebagian besar host bersama, `0775` pada direktori dan `0664` pada `mainfile.php` sudah cukup. `0777` dapat diterima selama instalasi jika host Anda menjalankan PHP di bawah pengguna selain pengguna FTP, namun perketat izin setelah instalasi selesai.

## 5. Luncurkan penginstal

Arahkan browser Anda ke URL publik situs tersebut. Jika semua file sudah ada, Wizard Instalasi XOOPS akan dimulai dan Anda dapat mengikuti panduan selanjutnya mulai dari [Bab 2](chapter-2-introduction.md) dan seterusnya.
