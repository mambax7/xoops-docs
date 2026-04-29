---
title: "Pemeriksaan Sebelum Penerbangan"
---

XOOPS 2.7.0 meningkatkan mesin templatingnya dari Smarty 3 menjadi Smarty 4. Smarty 4 lebih ketat mengenai sintaksis template dibandingkan Smarty 3, dan beberapa theme khusus dan template module mungkin perlu disesuaikan sebelum mereka bekerja dengan benar di XOOPS 2.7.0.

Untuk membantu mengidentifikasi dan memperbaiki masalah ini _sebelum_ Anda menjalankan pemutakhiran utama, XOOPS 2.7.0 dikirimkan dengan **pemindai preflight** di direktori `upgrade/`. Anda harus menjalankan pemindai pra-penerbangan setidaknya sekali sebelum alur kerja pemutakhiran utama memungkinkan Anda melanjutkan.

## Apa yang Dilakukan Pemindai

Pemindai pra-penerbangan menelusuri theme dan template module yang ada untuk mencari ketidakcocokan Smarty 4 yang diketahui. Itu bisa:

* **Pindai** direktori `themes/` dan `modules/` Anda untuk mencari file template `.tpl` dan `.html` yang mungkin memerlukan perubahan
* **Laporkan** masalah yang dikelompokkan berdasarkan file dan jenis masalah
* **Memperbaiki secara otomatis** banyak masalah umum saat Anda memintanya

Tidak semua masalah dapat diperbaiki secara otomatis. Beberapa template memerlukan pengeditan manual, terutama jika template tersebut menggunakan idiom Smarty 3 lama yang tidak memiliki padanan langsung di Smarty 4.

## Menjalankan Pemindai

1. Salin direktori distribusi `upgrade/` ke root web situs Anda (jika Anda belum melakukannya sebagai bagian dari langkah [Persiapan untuk Peningkatan](ustep-01.md)).
2. Arahkan browser Anda ke preflight URL:

   
   ```text
   http://example.com/upgrade/preflight.php
   
   ```

3. Masuk dengan akun administrator saat diminta.
4. Pemindai menampilkan formulir dengan tiga kontrol:
   * **Direktori template** — biarkan kosong untuk memindai `themes/` dan `modules/`. Masukkan jalur seperti `/themes/mytheme/` untuk mempersempit pemindaian ke satu direktori.
   * **Ekstensi template** — biarkan kosong untuk memindai file `.tpl` dan `.html`. Masukkan satu ekstensi untuk mempersempit pemindaian.
   * **Mencoba perbaikan otomatis** — centang kotak ini jika Anda ingin pemindai memperbaiki masalah yang diketahui cara memperbaikinya. Biarkan tidak dicentang untuk pemindaian hanya-baca.
5. Tekan tombol **Jalankan**. Pemindai menelusuri direktori yang dipilih dan melaporkan setiap masalah yang ditemukannya.

## Menafsirkan Hasil

Laporan pemindaian mencantumkan setiap file yang diperiksa dan setiap masalah yang ditemukan. Setiap entri terbitan memberi tahu Anda:

* File mana yang bermasalah
* Aturan Smarty 4 apa yang dilanggarnya
* Apakah pemindai dapat memperbaikinya secara otomatis

Jika Anda menjalankan pemindaian dengan _Mencoba perbaikan otomatis_ diaktifkan, laporan juga akan mengonfirmasi file mana yang telah ditulis ulang.

## Memperbaiki Masalah Secara Manual

Untuk masalah yang tidak dapat diperbaiki oleh pemindai secara otomatis, buka file template yang ditandai di editor dan buat perubahan yang diperlukan. Ketidakcocokan Smarty 4 yang umum meliputi:

* block `{php} ... {/php}` (tidak lagi didukung di Smarty 4)
* Pengubah dan panggilan fungsi tidak digunakan lagi
* Penggunaan pembatas yang sensitif terhadap spasi
* Asumsi plugin waktu pendaftaran yang berubah di Smarty 4

Jika Anda tidak nyaman mengedit template, pendekatan paling aman adalah beralih ke theme yang dikirimkan (`xbootstrap5`, `default`, `xswatch5`, dll.) dan menangani theme khusus secara terpisah setelah pemutakhiran selesai.

## Jalankan Ulang Sampai Bersih

Setelah melakukan perbaikan — baik otomatis atau manual — jalankan kembali pemindai pra-penerbangan. Ulangi hingga pemindaian melaporkan tidak ada masalah yang tersisa.

Setelah pemindaian selesai, Anda dapat mengakhiri sesi pra-penerbangan dengan menekan tombol **Keluar dari Pemindai** di UI pemindai. Ini menandai pra-penerbangan telah selesai dan memungkinkan pemutakhiran utama di `/upgrade/` untuk melanjutkan.

## Melanjutkan Peningkatan

Setelah preflight selesai, Anda dapat meluncurkan pemutakhiran utama di:

```text
http://example.com/upgrade/
```

Lihat [Menjalankan Peningkatan](ustep-02.md) untuk langkah selanjutnya.

## Jika Anda Melewati Pra-Penerbangan

Melewati pra-penerbangan sangat tidak disarankan, namun jika Anda meningkatkan versi tanpa menjalankannya dan sekarang melihat kesalahan template, lihat bagian Kesalahan template Smarty 4 pada [Pemecahan Masalah](ustep-03.md). Anda dapat menjalankan preflight setelah kejadian tersebut dan menghapus `xoops_data/caches/smarty_compile/` untuk memulihkan.
