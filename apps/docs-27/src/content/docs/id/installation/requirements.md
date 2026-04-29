---
title: "Persyaratan"
---

## Lingkungan Perangkat Lunak (Tumpukan)

Sebagian besar situs produksi XOOPS berjalan pada tumpukan _LAMP_ (sistem **L**inux yang menjalankan **A**pache, **M**ySQL dan **P**HP) tetapi, ada banyak kemungkinan tumpukan yang berbeda.

Seringkali paling mudah membuat prototipe situs baru di mesin lokal. Untuk kasus ini, banyak pengguna XOOPS memilih tumpukan _WAMP_ (menggunakan **W**indows sebagai OS), sementara yang lain menjalankan tumpukan _LAMP_ atau _MAMP_ (**M**AC).

### PHP

Versi PHP apa pun &gt;= 8.2.0 (PHP 8.4 atau lebih tinggi sangat disarankan)

> **Penting:** XOOPS 2.7.0 memerlukan **PHP 8.2 atau lebih baru**. PHP 7.x dan versi lebih lama tidak lagi didukung. Jika Anda mengupgrade situs lama, konfirmasikan host Anda menawarkan PHP 8.2+ sebelum memulai.

### MySQL

MySQL server 5.7 atau lebih tinggi (MySQL Server 8.4 atau lebih tinggi sangat disarankan.) MySQL 9.0 juga didukung. MariaDB adalah pengganti drop-in biner yang kompatibel dari MySQL, dan juga berfungsi baik dengan XOOPS.

### Server web

Server web yang mendukung menjalankan skrip PHP, seperti Apache, NGINX, LiteSpeed, dll.

### Ekstensi PHP yang Diperlukan

Penginstal XOOPS memverifikasi ekstensi berikut dimuat sebelum mengizinkan instalasi untuk melanjutkan:

* `mysqli` — driver basis data MySQL
* `session` — penanganan sesi
* `pcre` — ekspresi reguler yang kompatibel dengan Perl
* `filter` — pemfilteran dan validasi masukan
* `fileinfo` — Deteksi tipe MIME untuk unggahan

### Diperlukan Pengaturan PHP

Selain ekstensi di atas, penginstal memverifikasi pengaturan `php.ini` berikut:

* `file_uploads` harus **Aktif** — tanpanya, XOOPS tidak dapat menerima file yang diunggah

### Ekstensi PHP yang Direkomendasikan

Pemasang juga memeriksa ekstensi ini. Mereka tidak sepenuhnya diperlukan, tetapi XOOPS dan sebagian besar module mengandalkannya untuk fungsionalitas penuh. Aktifkan sebanyak yang diizinkan oleh host Anda:

* `mbstring` — penanganan string multi-byte
* `intl` — internasionalisasi
* `iconv` — konversi kumpulan karakter
* `xml` — penguraian XML
* `zlib` — kompresi
* `gd` — pemrosesan gambar
* `exif` — metadata gambar
* `curl` — Klien HTTP untuk feed dan panggilan API

## Layanan

### Akses Sistem File (untuk Akses Webmaster)

Anda memerlukan beberapa metode (FTP, SFTP, dll.) untuk mentransfer file distribusi XOOPS ke server web.

### Akses Sistem File (untuk Proses Server Web)

Untuk menjalankan XOOPS diperlukan kemampuan membuat, membaca dan menghapus file dan direktori. Jalur berikut harus dapat ditulis oleh proses server web untuk instalasi normal dan operasi normal sehari-hari:

*`uploads/`
*`uploads/avatars/`
*`uploads/files/`
*`uploads/images/`
*`uploads/ranks/`
*`uploads/smilies/`
* `mainfile.php` (dapat ditulis saat instalasi dan upgrade)
*`xoops_data/`
*`xoops_data/caches/`
*`xoops_data/caches/xoops_cache/`
*`xoops_data/caches/smarty_cache/`
*`xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
*`xoops_data/configs/captcha/`
*`xoops_data/configs/textsanitizer/`
*`xoops_data/data/`
*`xoops_data/protector/`

### Basis Data

XOOPS perlu membuat, memodifikasi, dan menanyakan tabel di MySQL. Untuk melakukan ini, Anda memerlukan:

* akun pengguna dan kata sandi MySQL
* database MySQL yang semua hak istimewanya dimiliki oleh pengguna (atau sebagai alternatif, pengguna dapat memiliki hak istimewa untuk membuat database tersebut)

### Surel

Untuk situs aktif, Anda memerlukan alamat email aktif yang dapat digunakan XOOPS untuk komunikasi pengguna, seperti aktivasi akun dan pengaturan ulang kata sandi. Meskipun tidak sepenuhnya diwajibkan, disarankan jika memungkinkan untuk menggunakan alamat email yang cocok dengan domain tempat XOOPS Anda dijalankan. Hal ini membantu menghindari komunikasi Anda ditolak atau ditandai sebagai spam.

## Alat

Anda mungkin memerlukan beberapa alat tambahan untuk menyiapkan dan menyesuaikan instalasi XOOPS Anda. Ini mungkin termasuk:* Perangkat Lunak Klien FTP
* Penyunting Teks
* Perangkat Lunak Arsip untuk bekerja dengan file rilis XOOPS (_.zip_ atau _.tar.gz_).

Lihat bagian [Alat Perdagangan](../tools/tools.md) untuk beberapa saran mengenai alat dan tumpukan server web yang sesuai jika diperlukan.

## Topik Khusus

Beberapa kombinasi perangkat lunak sistem tertentu mungkin memerlukan beberapa konfigurasi tambahan agar dapat berfungsi dengan XOOPS. Jika Anda menggunakan lingkungan SELinux, atau mengupgrade situs lama dengan theme khusus, silakan lihat [Topik Khusus](specialtopics.md) untuk informasi lebih lanjut.