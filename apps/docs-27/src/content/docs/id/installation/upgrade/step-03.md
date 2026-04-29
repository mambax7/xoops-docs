---
title: "Pemecahan Masalah"
---

## Smarty 4 Kesalahan template

Kelas masalah yang paling umum saat memutakhirkan dari XOOPS 2.5.x ke 2.7.0 adalah ketidakcocokan template Smarty 4. Jika Anda melewatkan atau tidak menyelesaikan [Pemeriksaan Preflight](preflight.md), Anda mungkin melihat kesalahan template di bagian depan atau di area admin setelah peningkatan.

Untuk memulihkan:

1. **Jalankan kembali pemindai pra-penerbangan** di `/upgrade/preflight.php`. Terapkan perbaikan otomatis apa pun yang ditawarkannya, atau perbaiki template yang ditandai secara manual.
2. **Hapus cache template yang telah dikompilasi.** Hapus semuanya kecuali `index.html` dari `xoops_data/caches/smarty_compile/`. template yang dikompilasi Smarty 3 tidak kompatibel dengan Smarty 4 dan file basi dapat menyebabkan kesalahan yang membingungkan.
3. **Beralih ke theme yang dikirimkan untuk sementara.** Dari area admin, pilih `xbootstrap5` atau `default` sebagai theme aktif. Ini akan mengonfirmasi apakah masalahnya terbatas pada theme khusus atau seluruh situs.
4. **Validasi semua theme khusus dan template module** sebelum mengaktifkan kembali lalu lintas produksi. Berikan perhatian khusus pada template yang menggunakan block `{php}`, pengubah yang tidak digunakan lagi, atau sintaksis pembatas non-standar — ini adalah kerusakan Smarty 4 yang paling umum.

Lihat juga bagian Smarty 4 di [Topik Khusus](../../installation/specialtopics.md).

## Masalah Izin

Peningkatan XOOPS mungkin perlu menulis ke file yang sebelumnya telah dibuat hanya-baca. Jika demikian, Anda akan melihat pesan seperti ini:

![XOOPS Upgrade Make Writable Error](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

Solusinya adalah dengan mengubah izin. Anda dapat mengubah izin menggunakan FTP jika Anda tidak memiliki akses langsung. Berikut ini contoh penggunaan FileZilla:

![FileZilla Change Permission](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Keluaran Debug

Anda dapat mengaktifkan keluaran debug tambahan di logger dengan menambahkan parameter debug ke URL yang digunakan untuk meluncurkan Peningkatan:

```text
http://example.com/upgrade/?debug=1
```
