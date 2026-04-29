---
title: "Pengembangan module"
description: "Panduan komprehensif untuk mengembangkan module XOOPS menggunakan praktik PHP modern"
---

Bagian ini memberikan dokumentasi komprehensif untuk mengembangkan module XOOPS menggunakan praktik PHP modern, pola desain, dan praktik terbaik.

## Ikhtisar

Pengembangan module XOOPS telah berkembang secara signifikan selama bertahun-tahun. Manfaat module modern:

- **Arsitektur MVC** - Pemisahan kekhawatiran yang bersih
- **Fitur PHP 8.x** - Ketik deklarasi, atribut, argumen bernama
- **Pola Desain** - Repositori, DTO, pola Lapisan Layanan
- **Pengujian** - PHPUnit dengan praktik pengujian modern
- **Kerangka XMF** - Utilitas Kerangka module XOOPS

## Struktur Dokumentasi

### Tutorial

Panduan langkah demi langkah untuk membuat module XOOPS dari awal.

- Tutorials/Hello-World-Module - module XOOPS pertama Anda
- Tutorials/Building-a-CRUD-Module - Fungsi Buat, Baca, Perbarui, Hapus Lengkap

### Pola Desain

Pola arsitektur yang digunakan dalam pengembangan module XOOPS modern.

- Patterns/MVC-Pattern - Arsitektur Model-View-Controller
- Patterns/Repository-Pattern - Abstraksi akses data
- Patterns/DTO-Pattern - Objek Transfer Data untuk aliran data yang bersih

### Praktik Terbaik

Pedoman untuk menulis kode yang dapat dipelihara dan berkualitas tinggi.

- Best-Practices/Clean-Code - Prinsip kode bersih untuk XOOPS
- Best-Practices/Code-Smells - Anti-pola umum dan cara memperbaikinya
- Best-Practices/Testing - Strategi pengujian PHPUnit

### Contoh

Contoh analisis dan implementasi module dunia nyata.

- Analisis-module-Penerbit - Pelajari lebih dalam module Penerbit

## Struktur Direktori module

module XOOPS yang terorganisir dengan baik mengikuti struktur direktori ini:

```
/modules/mymodule/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /css/
        /js/
        /images/
    /blocks/
        myblock.php
    /class/
        /Controller/
        /Entity/
        /Repository/
        /Service/
    /include/
        common.php
        install.php
        uninstall.php
        update.php
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /preloads/
        core.php
    /sql/
        mysql.sql
    /templates/
        /admin/
        /blocks/
        main_index.tpl
    /test/
        bootstrap.php
        /Unit/
        /Integration/
    index.php
    xoops_version.php
```

## File Kunci Dijelaskan

### xoops_version.php

File definisi module yang memberi tahu XOOPS tentang module Anda:

```php
<?php
$modversion = [];

// Basic Information
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// Module Flags
$modversion['hasMain']     = 1;  // Has front-end pages
$modversion['hasAdmin']    = 1;  // Has admin section
$modversion['system_menu'] = 1;  // Show in admin menu

// Admin Configuration
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// Database
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// Templates
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'Index page template',
];

// Blocks
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// Module Preferences
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```

### Umum Sertakan File

Buat file bootstrap umum untuk module Anda:

```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// Module constants
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// Autoload classes
require_once MYMODULE_PATH . '/class/autoload.php';
```

## Persyaratan Versi PHP

module XOOPS modern harus menargetkan PHP 8.0 atau lebih tinggi untuk memanfaatkan:

- **Promosi Properti Konstruktor**
- **Argumen yang Dinamakan**
- **Jenis Serikat**
- **Pertandingan Ekspresi**
- **Atribut**
- **Operator Nullsafe**

## Memulai

1. Mulailah dengan tutorial Tutorials/Hello-World-Module
2. Kemajuan ke Tutorials/Building-a-CRUD-Module
3. Pelajari Patterns/MVC-Pattern untuk panduan arsitektur
4. Terapkan praktik Best-Practices/Clean-Code secara menyeluruh
5. Implementasikan Best-Practices/Testing dari awal

## Sumber Daya Terkait

- ../05-XMF-Framework/XMF-Framework - Utilitas Kerangka module XOOPS
- Operasi Basis Data - Bekerja dengan basis data XOOPS
- ../04-API-Reference/Template/Template-System - template Smarty di XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - Mengamankan module Anda

## Riwayat Versi

| Versi | Tanggal | Perubahan |
|---------|------|---------|
| 1.0 | 28-01-2025 | Dokumentasi awal |
