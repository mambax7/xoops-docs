---
title: "XOOPS Glosari"
description: "Definisi XOOPS-istilah dan konsep khusus"
---
> Glosari komprehensif XOOPS-istilah dan konsep khusus.

---

## A

### Rangka Kerja Pentadbiran
Rangka kerja antara muka pentadbiran piawai yang diperkenalkan dalam XOOPS 2.3, menyediakan halaman pentadbir yang konsisten merentas modul.

### Autoloading
Pemuatan automatik kelas PHP apabila ia diperlukan, menggunakan standard PSR-4 dalam XOOPS moden.

---

## B

### Sekat
Unit kandungan serba lengkap yang boleh diletakkan di kawasan tema. Blok boleh memaparkan kandungan modul, tersuai HTML atau data dinamik.
```php
// Block definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```
### Bootstrap
Proses memulakan XOOPS teras sebelum melaksanakan kod modul, biasanya melalui `mainfile.php` dan `header.php`.

---

## C

### Kriteria / KriteriaKompo
Kelas untuk membina keadaan pertanyaan pangkalan data dalam cara berorientasikan objek.
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```
### CSRF (Pemalsuan Permintaan Merentas Tapak)
Serangan keselamatan dihalang dalam XOOPS menggunakan token keselamatan melalui `XoopsFormHiddenToken`.

---

## D

### DI (Suntikan Kebergantungan)
Corak reka bentuk yang dirancang untuk XOOPS 4.0 di mana kebergantungan disuntik dan bukannya dicipta secara dalaman.

### Nama Dir
Nama direktori modul, digunakan sebagai pengecam unik di seluruh sistem.

### DTYPE (Jenis Data)
Pemalar yang menentukan cara pembolehubah XoopsObject disimpan dan dibersihkan:
- `XOBJ_DTYPE_INT` - Integer
- `XOBJ_DTYPE_TXTBOX` - Teks (baris tunggal)
- `XOBJ_DTYPE_TXTAREA` - Teks (berbilang baris)
- `XOBJ_DTYPE_EMAIL` - Alamat e-mel

---

## E

### Acara
Kejadian dalam kitaran hayat XOOPS yang boleh mencetuskan kod tersuai melalui pramuat atau cangkuk.

---

## F

### Rangka Kerja
Lihat XMF (XOOPS Rangka Kerja Modul).

### Elemen Borang
Komponen sistem bentuk XOOPS yang mewakili medan bentuk HTML.

---

## G

### Kumpulan
Koleksi pengguna dengan kebenaran dikongsi. Kumpulan teras termasuk: Juruweb, Pengguna Berdaftar, Tanpa Nama.

---

## H

### Pengendali
Kelas yang mengurus operasi CRUD untuk tika XoopsObject.
```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```
### Penolong
Kelas utiliti yang menyediakan akses mudah kepada pengendali modul, konfigurasi dan perkhidmatan.
```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```
---

## K

### Inti
Kelas teras XOOPS menyediakan fungsi asas: akses pangkalan data, pengurusan pengguna, keselamatan, dsb.

---

## L

### Fail Bahasa
PHP fail yang mengandungi pemalar untuk pengantarabangsaan, disimpan dalam `language/[code]/` direktori.

---

## M

### fail utama.php
The primary configuration file for XOOPS containing database credentials and path definitions.

### MCP (Penyampai-Pengawal-Model)
Corak seni bina yang serupa dengan MVC, sering digunakan dalam pembangunan modul XOOPS.

### Middleware
Perisian yang terletak di antara permintaan dan respons, dirancang untuk XOOPS 4.0 menggunakan PSR-15.

### Modul
Pakej serba lengkap yang memanjangkan fungsi XOOPS, dipasang dalam direktori `modules/`.

### MOC (Peta Kandungan)
Konsep Obsidian untuk nota gambaran keseluruhan yang memaut ke kandungan yang berkaitan.

---

## N

### Ruang nama
Ciri PHP untuk mengatur kelas, digunakan dalam XOOPS 2.5+:
```php
namespace XoopsModules\MyModule;
```
### Pemberitahuan
Sistem XOOPS untuk memaklumkan pengguna tentang acara melalui e-mel atau PM.

---

## O

### Objek
Lihat XoopsObject.

---

## P

### Kebenaran
Kawalan akses diurus melalui kumpulan dan pengendali kebenaran.

### Pramuat
Kelas yang dikaitkan dengan XOOPS acara, dimuatkan secara automatik daripada direktori `preloads/`.

### PSR (PHP Pengesyoran Piawaian)
Piawaian daripada PHP-FIG yang XOOPS 4.0 akan dilaksanakan sepenuhnya.

---

## R

### Penyampai
Kelas yang mengeluarkan elemen bentuk atau komponen UI lain dalam format tertentu (Bootstrap, dsb.).

---

## S

### Pintar
Enjin templat yang digunakan oleh XOOPS untuk memisahkan persembahan daripada logik.
```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```
### Perkhidmatan
Kelas yang menyediakan logik perniagaan boleh guna semula, biasanya diakses melalui Helper.

---

## T

### Templat
Fail Smarty (`.tpl` atau `.html`) mentakrifkan lapisan pembentangan untuk modul.

### Tema
Koleksi templat dan aset yang menentukan penampilan visual tapak.

### Token
Mekanisme keselamatan (CSRF perlindungan) memastikan penyerahan borang berasal daripada sumber yang sah.

---

## U

### uid
ID Pengguna - pengecam unik untuk setiap pengguna dalam sistem.

---

## V

### Pembolehubah (Var)
Medan yang ditakrifkan pada XoopsObject menggunakan `initVar()`.

---

## W

### Widget
Komponen UI serba lengkap yang kecil, serupa dengan blok.

---

## X

### XMF (XOOPS Rangka Kerja Modul)
Koleksi utiliti dan kelas untuk pembangunan modul XOOPS moden.

### XOBJ_DTYPE
Pemalar untuk menentukan jenis data pembolehubah dalam XoopsObject.

### XoopsDatabase
Lapisan abstraksi pangkalan data menyediakan pelaksanaan pertanyaan dan melarikan diri.

### XoopsForm
Sistem penjanaan borang untuk mencipta HTML membentuk secara pemrograman.

### XoopsObject
Kelas asas untuk semua objek data dalam XOOPS, menyediakan pengurusan pembolehubah dan sanitasi.

### xoops_version.php
The module manifest file defining module properties, tables, blocks, templates, and configuration.---

## Akronim Biasa

| Akronim | Maksudnya |
|---------|---------|
| XOOPS | Sistem Portal Berorientasikan Objek yang Boleh Diperpanjang |
| XMF | XOOPS Rangka Kerja Modul |
| CSRF | Pemalsuan Permintaan Merentas Tapak |
| XSS | Skrip Merentas Tapak |
| ORM | Pemetaan Perkaitan Objek |
| PSR | PHP Syor Piawaian |
| DI | Suntikan Ketergantungan |
| MVC | Model-View-Controller |
| CRUD | Cipta, Baca, Kemas Kini, Padam |

---

## 🔗 Dokumentasi Berkaitan

- Konsep Teras
- API Rujukan
- Sumber Luaran

---

#XOOPS #glosari #rujukan #terminologi #takrifan