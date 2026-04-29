---
title: "Setelah Peningkatan"
---

## Perbarui module Sistem

Setelah semua patch yang diperlukan telah diterapkan, memilih _Lanjutkan_ akan mengatur semuanya untuk memperbarui module **sistem**. Ini adalah langkah yang sangat penting dan diperlukan untuk menyelesaikan peningkatan dengan benar.

![XOOPS Update System Module](/xoops-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Pilih _Update_ untuk melakukan pembaruan module Sistem.

## Perbarui module XOOPS Lainnya yang Disediakan

XOOPS dikirimkan dengan tiga module opsional - pm (Pesan Pribadi,) profil (Profil Pengguna) dan pelindung (Pelindung) Anda harus melakukan pembaruan pada salah satu module yang diinstal ini.

![XOOPS Update Other Modules](/xoops-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Perbarui module Lainnya

Kemungkinan besar ada pembaruan pada module lain yang memungkinkan module bekerja lebih baik di bawah XOOPS Anda yang sekarang diperbarui. Anda harus menyelidiki dan menerapkan pembaruan module yang sesuai.

## Tinjau Preferensi Pengerasan Cookie Baru

Peningkatan XOOPS 2.7.0 menambahkan dua preferensi baru yang mengontrol cara cookie sesi dikeluarkan:

* **`session_cookie_samesite`** — mengontrol atribut cookie SameSite. `Lax` adalah default yang aman untuk sebagian besar situs. Gunakan `Strict` untuk perlindungan maksimal jika situs Anda tidak mengandalkan navigasi lintas asal. `None` hanya sesuai jika Anda membutuhkannya.
* **`session_cookie_secure`** — bila diaktifkan, cookie sesi hanya dikirim melalui koneksi HTTPS. Aktifkan ini jika situs Anda berjalan pada HTTPS.

Anda dapat meninjau pengaturan ini di bawah Opsi Sistem → Preferensi → Pengaturan Umum.

## Validasi theme Khusus

Jika situs Anda menggunakan theme khusus, telusuri bagian depan dan area admin untuk mengonfirmasi bahwa halaman ditampilkan dengan benar. Peningkatan ke Smarty 4 dapat memengaruhi template khusus meskipun pemindaian pra-penerbangan berhasil. Jika Anda melihat masalah rendering, kunjungi kembali [Pemecahan Masalah](ustep-03.md).

## Bersihkan Instalasi dan Tingkatkan File

Demi keamanan, hapus direktori berikut dari root web Anda setelah pemutakhiran dipastikan berfungsi:

* `upgrade/` — direktori alur kerja pemutakhiran
* `install/` — jika ada, baik sebagai `install/` atau sebagai direktori `installremove*` yang diganti namanya

Membiarkannya tetap di tempatnya akan memperlihatkan skrip pemutakhiran dan pemasangan kepada siapa pun yang dapat membuka situs Anda.

## Buka Situs Anda

Jika Anda mengikuti saran untuk _Matikan situs Anda_, Anda harus mengaktifkannya kembali setelah Anda memastikan bahwa situs tersebut berfungsi dengan benar.