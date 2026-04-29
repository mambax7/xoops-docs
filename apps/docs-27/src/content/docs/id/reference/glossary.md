---
title: "Glosarium XOOPS"
description: "Definisi istilah dan konsep khusus XOOPS"
---

> Glosarium komprehensif terminologi dan konsep khusus XOOPS.

---

## SEBUAH

### Kerangka Admin
Kerangka kerja antarmuka administratif standar yang diperkenalkan di XOOPS 2.3, menyediakan halaman admin yang konsisten di seluruh module.

### Memuat otomatis
Pemuatan otomatis kelas PHP saat dibutuhkan, menggunakan standar PSR-4 di XOOPS modern.

---

##B

### Blokir
Unit konten mandiri yang dapat ditempatkan di wilayah theme. block dapat menampilkan konten module, HTML khusus, atau data dinamis.

```php
// Block definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### Bootstrap
Proses inisialisasi core XOOPS sebelum mengeksekusi kode module, biasanya melalui `mainfile.php` dan `header.php`.

---

## C

### Kriteria/KriteriaCompo
Kelas untuk membangun kondisi kueri database dengan cara berorientasi objek.

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (Pemalsuan Permintaan Lintas Situs)
Serangan keamanan dicegah di XOOPS menggunakan token keamanan melalui `XoopsFormHiddenToken`.

---

##D

### DI (Injeksi Ketergantungan)
Pola desain yang direncanakan untuk XOOPS 4.0 di mana dependensi dimasukkan, bukan dibuat secara internal.

### Nama Dirham
Nama direktori module, digunakan sebagai pengidentifikasi unik di seluruh sistem.

### DTYPE (Tipe Data)
Konstanta yang menentukan bagaimana variabel XoopsObject disimpan dan dibersihkan:
- `XOBJ_DTYPE_INT` - Bilangan Bulat
- `XOBJ_DTYPE_TXTBOX` - Teks (satu baris)
- `XOBJ_DTYPE_TXTAREA` - Teks (multi-baris)
- `XOBJ_DTYPE_EMAIL` - Alamat email

---

## E

### Acara
Kejadian dalam siklus hidup XOOPS yang dapat memicu kode khusus melalui pramuat atau kait.

---

## F

### Kerangka
Lihat XMF (Kerangka module XOOPS).

### Elemen Formulir
Komponen sistem formulir XOOPS yang mewakili bidang formulir HTML.

---

## G

### Grup
Kumpulan pengguna dengan izin bersama. Kelompok core meliputi: Webmaster, Pengguna Terdaftar, Anonim.

---

## H

### Pengendali
Kelas yang mengelola operasi CRUD untuk instance XoopsObject.

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### Pembantu
Kelas utilitas yang menyediakan akses mudah ke handler module, konfigurasi, dan layanan.

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### Kernel
Kelas core XOOPS menyediakan fungsionalitas dasar: akses database, manajemen pengguna, keamanan, dll.

---

## L

### Berkas Bahasa
File PHP berisi konstanta untuk internasionalisasi, disimpan di direktori `language/[code]/`.

---

## M

### mainfile.php
File konfigurasi utama untuk XOOPS yang berisi kredensial database dan definisi jalur.

### MCP (Model-Pengontrol-Presenter)
Pola arsitektur yang mirip dengan MVC, sering digunakan dalam pengembangan module XOOPS.

### Perangkat Tengah
Perangkat lunak yang berada di antara permintaan dan respons, direncanakan untuk XOOPS 4.0 menggunakan PSR-15.

### module
Paket mandiri yang memperluas fungsionalitas XOOPS, diinstal di direktori `modules/`.

### MOC (Peta Konten)
Konsep Obsidian untuk catatan ikhtisar yang tertaut ke konten terkait.

---

## N

### Ruang nama
Fitur PHP untuk mengatur kelas, digunakan di XOOPS 2.5+:
```php
namespace XoopsModules\MyModule;
```

### Pemberitahuan
Sistem XOOPS untuk memperingatkan pengguna tentang acara melalui email atau PM.

---

## HAI

### Objek
Lihat XoopsObject.

---

## hal

### Izin
Kontrol akses dikelola melalui grup dan handler izin.

### Pramuat
Kelas yang terhubung ke peristiwa XOOPS, dimuat secara otomatis dari direktori `preloads/`.

### PSR (Rekomendasi Standar PHP)
Standar dari PHP-FIG yang akan diterapkan sepenuhnya oleh XOOPS 4.0.

---

## R

### Penyaji
Kelas yang mengeluarkan elemen formulir atau komponen UI lainnya dalam format tertentu (Bootstrap, dll.).

---

## S

### Smarty
Mesin template yang digunakan oleh XOOPS untuk memisahkan presentasi dari logika.

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### Layanan
Kelas yang menyediakan logika bisnis yang dapat digunakan kembali, biasanya diakses melalui Helper.

---

## T### template
File Smarty (`.tpl` atau `.html`) yang mendefinisikan lapisan presentasi untuk module.

### theme
Kumpulan template dan aset yang menentukan tampilan visual situs.

### Tanda
Mekanisme keamanan (perlindungan CSRF) memastikan pengiriman formulir berasal dari sumber yang sah.

---

## kamu

### cairan
ID Pengguna - pengidentifikasi unik untuk setiap pengguna dalam sistem.

---

##V

### Variabel (Var)
Bidang yang ditentukan pada XoopsObject menggunakan `initVar()`.

---

## W

### Widget
Komponen UI mandiri yang kecil, mirip dengan block.

---

## X

### XMF (Kerangka module XOOPS)
Kumpulan utilitas dan kelas untuk pengembangan module XOOPS modern.

### XOBJ_DTYPE
Konstanta untuk mendefinisikan tipe data variabel di XoopsObject.

### XoopsDatabase
Lapisan abstraksi database menyediakan eksekusi dan pelolosan kueri.

### XoopsFormulir
Sistem pembuatan formulir untuk membuat formulir HTML secara terprogram.

### XoopsObject
Kelas dasar untuk semua objek data di XOOPS, yang menyediakan pengelolaan dan sanitasi variabel.

### xoops_version.php
File manifes module yang mendefinisikan properti module, tabel, block, template, dan konfigurasi.

---

## Akronim Umum

| Akronim | Arti |
|---------|---------|
| XOOPS | Sistem Portal Berorientasi Objek yang Dapat Diperluas |
| XMF | Kerangka module XOOPS |
| CSRF | Pemalsuan Permintaan Lintas Situs |
| XSS | Skrip Lintas Situs |
| ORM | Pemetaan Objek-Relasional |
| PSR | Rekomendasi Standar PHP |
| DI | Injeksi Ketergantungan |
| MVC | Pengontrol Tampilan Model |
| CRUD | Buat, Baca, Perbarui, Hapus |

---

## 🔗 Dokumentasi Terkait

- Konsep core
- Referensi API
- Sumber Daya Eksternal

---

#xoops #glosarium #referensi #terminologi #definisi
