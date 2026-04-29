---
title: "Lampiran 3: Menerjemahkan XOOPS ke Bahasa Lokal"
---

XOOPS 2.7.0 dikirimkan hanya dengan file berbahasa Inggris. Terjemahan ke bahasa lain dikelola oleh komunitas dan didistribusikan melalui GitHub dan berbagai situs dukungan lokal XOOPS.

## Di mana menemukan terjemahan yang ada

- **GitHub** — terjemahan komunitas semakin banyak diterbitkan sebagai repositori terpisah di bawah [organisasi XOOPS](https://github.com/XOOPS) dan di akun kontributor individu. Cari GitHub untuk `xoops-language-<your-language>` atau telusuri organisasi XOOPS untuk paket saat ini.
- **Situs dukungan XOOPS lokal** — banyak komunitas XOOPS regional menerbitkan terjemahan di situs mereka sendiri. Kunjungi [https://xoops.org](https://xoops.org) dan ikuti tautan ke komunitas lokal.
- **Terjemahan module** — terjemahan untuk module komunitas individual biasanya berada di sebelah module itu sendiri di organisasi GitHub `XoopsModules25x` (`25x` dalam namanya bersifat historis; module di sana dipertahankan untuk XOOPS 2.5.x dan 2.7.x).

Jika terjemahan untuk bahasa Anda sudah ada, masukkan direktori bahasa ke instalasi XOOPS Anda (lihat "Cara menginstal terjemahan" di bawah).

## Apa yang perlu diterjemahkan

XOOPS 2.7.0 menyimpan file bahasa di samping kode yang menggunakannya. Terjemahan lengkap mencakup semua lokasi berikut:

- **core** — `htdocs/language/english/` — konstanta seluruh situs yang digunakan oleh setiap halaman (login, kesalahan umum, tanggal, template email, dll.).
- **Installer** — `htdocs/install/language/english/` — string yang ditampilkan oleh wizard instalasi. Terjemahkan ini *sebelum* menjalankan penginstal jika Anda menginginkan pengalaman penginstalan yang dilokalkan.
- **module sistem** — `htdocs/modules/system/language/english/` — sejauh ini merupakan kumpulan terbesar; mencakup seluruh Panel Kontrol admin.
- **module yang dibundel** — masing-masing `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/`, dan `htdocs/modules/debugbar/language/english/`.
- **theme** — beberapa theme mengirimkan file bahasanya sendiri; periksa `htdocs/themes/<theme>/language/` jika ada.

Terjemahan "hanya core" adalah unit minimum yang berguna dan sesuai dengan dua poin pertama di atas.

## Cara menerjemahkan

1. Salin direktori `english/` di sebelahnya dan ganti nama salinannya sesuai bahasa Anda. Nama direktori harus berupa nama bahasa Inggris huruf kecil (`spanish`, `german`, `french`, `japanese`, `arabic`, dll.).

   
   ```
   htdocs/language/english/    →    htdocs/language/spanish/
   
   ```

2. Buka setiap file `.php` di direktori baru dan terjemahkan **nilai string** di dalam panggilan `define()`. Jangan **jangan** mengubah nama konstanta — nama tersebut direferensikan dari kode PHP di seluruh core.

   
   ```php
   // Before:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // After (Spanish):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   
   ```

3. **Simpan setiap file sebagai UTF-8 *tanpa* BOM.** XOOPS 2.7.0 menggunakan `utf8mb4` end-to-end (database, sesi, output) dan menolak file dengan tanda urutan byte. Di Notepad++ ini adalah opsi **"UTF-8"**, *bukan* "UTF-8-BOM". Dalam VS Code ini adalah defaultnya; cukup konfirmasikan pengkodean di bilah status.

4. Perbarui metadata bahasa dan rangkaian karakter di bagian atas setiap file agar sesuai dengan bahasa Anda:

   
   ```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   
   ```

   `_LANGCODE` harus berupa kode [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) untuk bahasa Anda. `_CHARSET` selalu `UTF-8` di XOOPS 2.7.0 — tidak ada lagi varian ISO-8859-1.

5. Ulangi untuk penginstal, module Sistem, dan module paket apa pun yang Anda perlukan.

## Cara memasang terjemahan

Jika Anda memperoleh terjemahan yang sudah selesai sebagai pohon direktori:

1. Salin setiap direktori `<language>/` ke dalam induk `language/english/` yang cocok di instalasi XOOPS Anda. Misalnya copy `language/spanish/` ke `htdocs/language/`, `install/language/spanish/` ke `htdocs/install/language/`, dan seterusnya.
2. Pastikan kepemilikan dan izin file dapat dibaca oleh server web.
3. Pilih bahasa baru pada waktu instalasi (wizard memindai `htdocs/language/` untuk mencari bahasa yang tersedia) atau, di situs yang sudah ada, ubah bahasa di **Admin → Sistem → Preferensi → Pengaturan Umum**.

## Membagikan terjemahan Anda kembali

Silakan sumbangkan terjemahan Anda kembali ke komunitas.1. Buat repositori GitHub (atau buat repositori bahasa yang sudah ada jika ada untuk bahasa Anda).
2. Gunakan nama yang jelas seperti `xoops-language-<language-code>` (misal `xoops-language-es`, `xoops-language-pt-br`).
3. Cerminkan struktur direktori XOOPS di dalam repositori Anda sehingga file sejajar dengan tempat salinannya:

   
   ```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   
   ```

4. Sertakan dokumentasi `README.md`:
   - Nama bahasa dan kode ISO
   - Kompatibilitas versi XOOPS (mis. `XOOPS 2.7.0+`)
   - Penerjemah dan kredit
   - Apakah terjemahannya hanya core atau mencakup module yang dibundel
5. Buka permintaan tarik terhadap repositori module/core yang relevan di GitHub atau posting pengumuman di [https://xoops.org](https://xoops.org) sehingga komunitas dapat menemukannya.

> **Catatan**
>
> Jika bahasa Anda memerlukan perubahan core untuk format tanggal atau kalender, sertakan juga perubahan tersebut dalam paket. Bahasa dengan skrip kanan-ke-kiri (Arab, Ibrani, Persia, Urdu) langsung dapat digunakan di XOOPS 2.7.0 — Dukungan RTL telah ditambahkan dalam rilis ini dan theme individual diambil secara otomatis.
