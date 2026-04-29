---
title: "Menjalankan Peningkatan"
---

Sebelum menjalankan pemutakhiran utama, pastikan Anda telah menyelesaikan [Pemeriksaan Preflight](preflight.md). UI pemutakhiran memerlukan pra-penerbangan untuk dijalankan setidaknya sekali dan akan mengarahkan Anda ke sana jika belum.

Luncurkan pemutakhiran dengan mengarahkan browser Anda ke direktori _upgrade_ situs Anda:

```text
http://example.com/upgrade/
```

Ini akan menampilkan halaman seperti ini:

![XOOPS Upgrade Startup](/xoops-docs/2.7/img/installation/upgrade-01.png)

Pilih tombol "Lanjutkan" untuk melanjutkan.

Setiap "Lanjutkan" maju melalui patch lain. Lanjutkan terus hingga semua patch diterapkan, dan halaman Pembaruan module Sistem ditampilkan.

![XOOPS Upgrade Applied Patch](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## Apa yang Diterapkan pada Peningkatan 2.5.11 → 2.7.0

Saat memutakhirkan dari XOOPS 2.5.11 ke 2.7.0, pemutakhiran menerapkan patch berikut. Masing-masing disajikan sebagai langkah terpisah dalam wizard sehingga Anda dapat mengonfirmasi apa yang diubah:

1. **Hapus paket PHPMailer yang sudah usang.** Salinan paket PHPMailer di dalam module Protector akan dihapus. PHPMailer sekarang disediakan melalui Komposer di `xoops_lib/vendor/`.
2. **Hapus folder HTMLPurifier yang sudah usang.** Demikian pula, folder HTMLPurifier lama di dalam module Protector akan dihapus. HTMLPurifier sekarang disediakan melalui Composer.
3. **Buat tabel `tokens`.** Tabel `tokens` baru ditambahkan untuk penyimpanan token cakupan umum. Tabel ini memiliki kolom untuk id token, id pengguna, cakupan, hash, dan stempel waktu issued/expires/used, dan digunakan oleh fitur berbasis token di XOOPS 2.7.0.
4. **Lebarkan `bannerclient.passwd`.** Kolom `bannerclient.passwd` diperlebar menjadi `VARCHAR(255)` sehingga dapat menyimpan hash kata sandi modern (bcrypt, argon2) dan bukan kolom sempit lama.
5. **Tambahkan preferensi cookie sesi.** Dua preferensi baru dimasukkan: `session_cookie_samesite` (untuk atribut cookie SameSite) dan `session_cookie_secure` (untuk memaksa cookie khusus HTTPS). Lihat [Setelah Peningkatan](ustep-04.md) untuk mengetahui cara meninjaunya setelah peningkatan selesai.

Tak satu pun dari langkah-langkah ini menyentuh data konten Anda. Pengguna, postingan, gambar, dan data module Anda tetap tidak tersentuh.

## Memilih Bahasa

Distribusi utama XOOPS hadir dengan dukungan bahasa Inggris. Dukungan untuk lokal tambahan disediakan oleh [Situs dukungan lokal XOOPS](https://xoops.org/modules/xoopspartners/). Dukungan ini bisa datang dalam bentuk distribusi yang disesuaikan, atau file tambahan untuk ditambahkan ke distribusi utama.

Terjemahan XOOPS disimpan di [transifex](https://www.transifex.com/xoops/public/)

Jika XOOPS Upgrader Anda memiliki dukungan bahasa tambahan, Anda dapat mengubah bahasa dengan memilih ikon bahasa di menu atas, dan memilih bahasa lain.

![XOOPS Upgrade Language](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)
