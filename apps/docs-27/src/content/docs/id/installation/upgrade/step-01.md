---
title: "Persiapan untuk Peningkatan"
---

## Matikan Situs

Sebelum memulai proses pemutakhiran XOOPS, Anda harus menyetel opsi "Matikan situs Anda?" item ke _Ya_ di Preferensi -&gt; Opsi Sistem -> Halaman Pengaturan Umum di Menu Administrasi.

Hal ini mencegah pengguna menemukan situs yang rusak selama peningkatan. Hal ini juga meminimalkan perebutan sumber daya untuk memastikan peningkatan yang lebih lancar.

Alih-alih kesalahan dan situs rusak, pengunjung Anda akan melihat sesuatu seperti ini:

![Site Closed on Mobile](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## Cadangan

Sebaiknya gunakan bagian _Pemeliharaan_ administrasi XOOPS untuk _Membersihkan folder cache_ untuk semua cache sebelum membuat cadangan penuh file situs Anda. Jika situs dinonaktifkan, disarankan juga untuk menggunakan _Kosongkan tabel sesi_ sehingga jika pemulihan diperlukan, sesi yang sudah usang tidak akan menjadi bagian darinya.

### File

Cadangan file dapat dilakukan dengan FTP, menyalin semua file ke mesin lokal Anda. Jika Anda memiliki akses shell langsung ke server, akan _lebih cepat_ membuat salinan (atau salinan arsip) di sana.

### Basis Data

Untuk membuat cadangan basis data, Anda dapat menggunakan fungsi bawaan di bagian _Pemeliharaan_ administrasi XOOPS. Anda juga dapat menggunakan fungsi _Export_ di _phpMyAdmin_, jika tersedia. Jika Anda memiliki akses shell, Anda dapat menggunakan perintah _mysql_ untuk membuang database Anda.

Menjadi fasih dalam membuat cadangan, dan _memulihkan_ database Anda adalah keterampilan webmaster yang penting. Ada banyak sumber online yang dapat Anda gunakan untuk mempelajari lebih lanjut tentang operasi ini sesuai dengan instalasi Anda, seperti [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![phpMyAdmin Export](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Salin File Baru ke Situs

Menyalin file baru ke situs Anda hampir sama dengan langkah [Persiapan](../../installation/preparations/) selama instalasi. Anda harus menyalin direktori _xoops_data_ dan _xoops_lib_ ke mana pun direktori tersebut dipindahkan selama instalasi. Kemudian, salin sisa isi direktori _htdocs_ distribusi (dengan beberapa pengecualian yang dibahas di bagian selanjutnya) ke file dan direktori yang ada di root web Anda.

Di XOOPS 2.7.0, menyalin distribusi baru di atas situs yang sudah ada **tidak akan menimpa file konfigurasi yang sudah ada** seperti `mainfile.php` atau `xoops_data/data/secure.php`. Ini adalah perubahan yang disambut baik dari versi sebelumnya, namun Anda tetap harus membuat cadangan penuh sebelum memulai.

Salin seluruh direktori _upgrade_ dari distribusi ke root web Anda, buat direktori _upgrade_ di sana.

## Jalankan Pemeriksaan Pra-Penerbangan Smarty 4

Sebelum meluncurkan alur kerja utama `/upgrade/`, Anda harus menjalankan pemindai preflight yang dikirimkan dalam direktori `upgrade/`. Ini memeriksa theme dan template module Anda yang ada untuk masalah kompatibilitas Smarty 4 dan dapat secara otomatis memperbaiki banyak di antaranya.

1. Arahkan browser Anda ke _your-site-url_/upgrade/preflight.php
2. Masuk dengan akun administrator
3. Jalankan pemindaian dan tinjau laporannya
4. Terapkan perbaikan otomatis apa pun yang ditawarkan, atau perbaiki template yang ditandai secara manual
5. Jalankan kembali scan hingga bersih
6. Baru kemudian lanjutkan ke upgrade utama

Lihat halaman [Pemeriksaan Preflight](preflight.md) untuk panduan lengkapnya.

### Hal-Hal yang Mungkin Tidak Ingin Anda Salin

Anda tidak boleh menyalin ulang direktori _install_ ke sistem XOOPS yang berfungsi. Membiarkan folder instalasi di instalasi XOOPS membuat sistem Anda berpotensi mengalami masalah keamanan. Penginstal mengganti namanya secara acak, tetapi Anda harus menghapusnya dan pastikan Anda tidak menyalin yang lain.

Ada beberapa file yang mungkin telah Anda edit untuk menyesuaikan situs Anda, dan Anda ingin menyimpannya. Berikut adalah daftar penyesuaian umum.

* _xoops_data/configs/xoopsconfig.php_ jika sudah diubah sejak situs diinstal
* direktori apa pun di _themes_ jika disesuaikan untuk situs Anda. Dalam hal ini Anda mungkin ingin membandingkan file untuk mengidentifikasi pembaruan yang berguna.
*file apa pun di _class/captcha/_ dimulai dengan "config" jika telah diubah sejak situs diinstal
* penyesuaian apa pun di _class/textsanitizer_
* penyesuaian apa pun di _class/xoopseditor_

Jika Anda menyadari setelah pemutakhiran bahwa ada sesuatu yang tertimpa secara tidak sengaja, jangan panik -- itulah sebabnya Anda memulai dengan pencadangan penuh. _(Kamu memang membuat cadangan kan?)_## Centang mainfile.php (Upgrade dari Pra-2.5 XOOPS)

Langkah ini hanya berlaku jika Anda mengupgrade dari versi XOOPS yang lama (2.3 atau lebih lama). Jika Anda mengupgrade dari XOOPS 2.5.x Anda dapat melewati bagian ini.

Versi lama XOOPS memerlukan beberapa perubahan manual yang harus dilakukan di `mainfile.php` untuk mengaktifkan module Pelindung. Di root web Anda, Anda harus memiliki file bernama `mainfile.php`. Buka file itu di editor Anda dan cari baris ini:

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

dan

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

Hapus baris-baris ini jika Anda menemukannya, dan simpan file sebelum melanjutkan.
