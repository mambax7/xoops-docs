---
title: "Pembangunan Modul"
description: "Panduan komprehensif untuk membangunkan modul XOOPS menggunakan amalan PHP moden"
---
Bahagian ini menyediakan dokumentasi komprehensif untuk membangunkan modul XOOPS menggunakan amalan PHP moden, corak reka bentuk dan amalan terbaik.

## Gambaran Keseluruhan

XOOPS pembangunan modul telah berkembang dengan ketara sepanjang tahun. Modul moden memanfaatkan:

- **MVC Seni Bina** - Pemisahan kebimbangan yang bersih
- **PHP 8.x Ciri** - Taipkan pengisytiharan, atribut, hujah bernama
- **Corak Reka Bentuk** - Repositori, DTO, Corak Lapisan Perkhidmatan
- **Pengujian** - PHPUnit dengan amalan ujian moden
- **XMF Rangka Kerja** - XOOPS Utiliti Rangka Kerja Modul

## Struktur Dokumentasi

### Tutorial

Panduan langkah demi langkah untuk membina modul XOOPS dari awal.

- Tutorials/Hello-World-Module - Modul XOOPS pertama anda
- Tutorials/Building-a-CRUD-Modul - Selesaikan fungsi Cipta, Baca, Kemas Kini, Padam

### Corak Rekaan

Corak seni bina yang digunakan dalam pembangunan modul XOOPS moden.

- Corak/MVC-Corak - Seni bina Model-View-Controller
- Patterns/Repository-Pattern - Abstraksi capaian data
- Corak/DTO-Corak - Objek Pemindahan Data untuk aliran data yang bersih

### Amalan Terbaik

Garis panduan untuk menulis kod yang boleh diselenggara dan berkualiti tinggi.

- Best-Practices/Clean-Code - Prinsip kod bersih untuk XOOPS
- Best-Practices/Code-Smells - Corak anti biasa dan cara membetulkannya
- Best-Practices/Testing - Strategi ujian PHPUnit### Contoh

Contoh analisis dan pelaksanaan modul dunia sebenar.

- Analisis-Modul-Penerbit - Menyelami modul Penerbit

## Struktur Direktori Modul

Modul XOOPS yang teratur mengikut struktur direktori ini:
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
## Fail Utama Diterangkan

### xoops_version.php

The module definition file that tells XOOPS about your module:
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
$modversion['hasMain']     = 1;  // Has frontend pages
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
### Biasa Sertakan Fail

Buat fail bootstrap biasa untuk modul anda:
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
## PHP Keperluan Versi

Modul XOOPS moden harus menyasarkan PHP 8.0 atau lebih tinggi untuk memanfaatkan:

- **Promosi Hartanah Pembina**
- **Argumen Dinamakan**
- **Jenis Kesatuan**
- **Ungkapan Padan**
- **Atribut**
- **Pengendali Nullsafe**

## Bermula

1. Mulakan dengan tutorial Tutorials/Hello-World-Module
2. Kemajuan ke Tutorials/Building-a-CRUD-Modul
3. Kaji Corak/MVC-Corak untuk panduan seni bina
4. Mengaplikasikan amalan Best-Practices/Clean-Code sepanjang
5. Laksanakan Best-Practices/Testing dari awal

## Sumber Berkaitan

- ../05-XMF-Kerangka/XMF-Kerangka - XOOPS Utiliti Rangka Kerja Modul
- Operasi Pangkalan Data - Bekerja dengan pangkalan data XOOPS
- ../04-API-Reference/Template/Template-System - Templat pintar dalam XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - Mengamankan modul anda

## Sejarah Versi

| Versi | Tarikh | Perubahan |
|---------|------|---------|
| 1.0 | 28-01-2025 | Dokumentasi awal |