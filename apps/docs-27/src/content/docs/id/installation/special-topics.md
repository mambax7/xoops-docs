---
title: "Topik Khusus"
---

Beberapa kombinasi perangkat lunak sistem tertentu mungkin memerlukan beberapa konfigurasi tambahan agar dapat berfungsi
 dengan XOOPS. Berikut adalah beberapa detail masalah umum dan panduan untuk mengatasinya.

## Lingkungan SELinux

File dan direktori tertentu harus dapat ditulisi selama instalasi, peningkatan, dan pengoperasian normal
dari XOOPS. Dalam lingkungan Linux tradisional, hal ini dicapai dengan memastikan bahwa
pengguna sistem yang menjalankan server web memiliki izin pada direktori XOOPS, biasanya dengan 
mengatur grup yang sesuai untuk direktori tersebut.

Sistem yang mendukung SELinux (seperti CentOS dan RHEL) memiliki konteks keamanan tambahan
dapat membatasi kemampuan proses untuk mengubah sistem file. Sistem ini mungkin memerlukan 
perubahan pada konteks keamanan agar XOOPS berfungsi dengan benar.

XOOPS mengharapkan dapat dengan bebas menulis ke direktori tertentu selama operasi normal. 
Selain itu, selama instalasi dan peningkatan XOOPS, file tertentu juga harus dapat ditulis.
 
Selama operasi normal, XOOPS mengharapkan untuk dapat menulis file dan membuat sub direktori 
di direktori ini:

- `uploads` di root web utama XOOPS
- `xoops_data` dimanapun ia dipindahkan selama instalasi

Selama proses instalasi atau peningkatan, XOOPS perlu menulis ke file ini:

- `mainfile.php` di root web utama XOOPS

Untuk sistem berbasis CentOS Apache pada umumnya, konteks keamanan mungkin berubah 
dicapai dengan perintah ini:

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

Anda dapat membuat mainfile.php dapat ditulis dengan:

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

Catatan: Saat menginstal, Anda dapat menyalin mainfile.php dari direktori *ekstra*.

Anda juga harus mengizinkan httpd untuk mengirim email:

```
setsebool -P httpd_can_sendmail=1
```

Pengaturan lain yang mungkin Anda perlukan meliputi:

Izinkan httpd untuk membuat koneksi jaringan, misalnya mengambil rss feed atau melakukan panggilan API:

```
setsebool -P httpd_can_network_connect 1
```

Aktifkan koneksi jaringan ke database dengan:

```
setsebool -P httpd_can_network_connect_db=1
```

Untuk informasi lebih lanjut, konsultasikan dokumentasi sistem Anda and/or administrator sistem.

## Smarty 4 dan theme Khusus

XOOPS 2.7.0 meningkatkan mesin templatingnya dari Smarty 3 menjadi **Smarty 4**. Smarty 4 lebih ketat
tentang sintaks template daripada Smarty 3, dan beberapa pola yang ditoleransi di template lama
sekarang akan menyebabkan kesalahan. Jika Anda menginstal salinan baru XOOPS 2.7.0 hanya menggunakan theme
dan module yang dikirimkan bersama rilis ini, tidak ada yang perlu dikhawatirkan — setiap template yang dikirimkan
telah diperbarui untuk kompatibilitas Smarty 4.

Kekhawatiran ini berlaku ketika Anda:

- memutakhirkan situs XOOPS 2.5.x yang sudah ada yang memiliki theme khusus, atau
- menginstal theme khusus atau module pihak ketiga yang lebih lama ke XOOPS 2.7.0.

Sebelum mengalihkan lalu lintas langsung ke situs yang ditingkatkan, jalankan pemindai pra-penerbangan yang dikirimkan dalam
Direktori `/upgrade/`. Ini memindai `/themes/` dan `/modules/` mencari ketidakcocokan Smarty 4
dan secara otomatis dapat memperbaiki banyak di antaranya. Lihat
Halaman [Pemeriksaan Pra-penerbangan](../upgrading/upgrade/preflight.md) untuk detailnya.

Jika Anda menemukan kesalahan template setelah instalasi atau peningkatan:

1. Jalankan kembali `/upgrade/preflight.php` dan atasi semua masalah yang dilaporkan.
2. Hapus cache template yang dikompilasi dengan menghapus semuanya kecuali `index.html` dari
   `xoops_data/caches/smarty_compile/`.
3. Beralih sementara ke theme yang dikirimkan seperti `xbootstrap5` atau `default` untuk mengonfirmasi masalahnya
   bersifat spesifik theme, bukan seluruh situs.
4. Validasi setiap perubahan theme khusus atau template module sebelum mengembalikan situs ke produksi.