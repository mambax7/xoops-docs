---
title: "Memulai dengan XMF"
description: "Instalasi, konsep dasar, dan langkah pertama dengan Kerangka module XOOPS"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Panduan ini mencakup konsep dasar Kerangka module XOOPS (XMF) dan cara mulai menggunakannya dalam module Anda.

## Prasyarat

- XOOPS 2.5.8 atau lebih baru diinstal
- PHP 7.2 atau lebih baru
- Pemahaman dasar pemrograman berorientasi objek PHP

## Memahami namespace

XMF menggunakan namespace PHP untuk mengatur kelasnya dan menghindari konflik penamaan. Semua kelas XMF berada di namespace `Xmf`.

### Masalah Luar Angkasa Global

Tanpa namespace, semua kelas PHP berbagi ruang global. Hal ini dapat menyebabkan konflik:

```php
<?php
// This would conflict with PHP's built-in ArrayObject
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Fatal error: Cannot redeclare class ArrayObject
```

### Solusi namespace

namespace menciptakan konteks penamaan yang terisolasi:

```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// No conflict - this is \MyNamespace\ArrayObject
```

### Menggunakan namespace XMF

Anda dapat mereferensikan kelas XMF dengan beberapa cara:

**Jalur namespace lengkap:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**Dengan pernyataan penggunaan:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**Beberapa impor:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## Memuat otomatis

Salah satu kemudahan terbesar XMF adalah pemuatan kelas otomatis. Anda tidak perlu memasukkan file kelas XMF secara manual.

### Pemuatan XOOPS Tradisional

Cara lama memerlukan pemuatan eksplisit:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### XMF Pemuatan otomatis

Dengan XMF, kelas dimuat secara otomatis ketika direferensikan:

```php
$input = Xmf\Request::getString('input', '');
```

Atau dengan pernyataan penggunaan:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

Pemuat otomatis mengikuti standar [PSR-4](http://www.php-fig.org/psr/psr-4/) dan juga mengelola dependensi yang diandalkan oleh XMF.

## Contoh Penggunaan Dasar

### Masukan Permintaan Membaca

```php
use Xmf\Request;

// Get integer value with default of 0
$id = Request::getInt('id', 0);

// Get string value with default empty string
$title = Request::getString('title', '');

// Get command (alphanumeric, lowercase)
$op = Request::getCmd('op', 'list');

// Get email with validation
$email = Request::getEmail('email', '');

// Get from specific hash (POST, GET, etc.)
$formData = Request::getString('data', '', 'POST');
```

### Menggunakan module Helper

```php
use Xmf\Module\Helper;

// Get helper for your module
$helper = Helper::getHelper('mymodule');

// Read module configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// Access the module object
$module = $helper->getModule();
$version = $module->getVar('version');

// Get a handler
$itemHandler = $helper->getHandler('items');

// Load language file
$helper->loadLanguage('admin');

// Check if current module
if ($helper->isCurrentModule()) {
    // We are in this module
}

// Check admin rights
if ($helper->isUserAdmin()) {
    // User has admin access
}
```

### Jalur dan Pembantu URL

```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// Get module URL
$moduleUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

// Get module path
$modulePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

// Upload paths
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```

## Men-debug dengan XMF

XMF menyediakan alat debugging yang berguna:

```php
// Dump a variable with nice formatting
\Xmf\Debug::dump($myVariable);

// Dump multiple variables
\Xmf\Debug::dump($var1, $var2, $var3);

// Dump POST data
\Xmf\Debug::dump($_POST);

// Show a backtrace
\Xmf\Debug::backtrace();
```

Output debug dapat dilipat dan menampilkan objek dan array dalam format yang mudah dibaca.

## Rekomendasi Struktur Proyek

Saat membuat module berbasis XMF, atur kode Anda:

```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Optional custom helper
    ItemHandler.php     # Your handlers
  include/
    common.php
  language/
    english/
      main.php
      admin.php
      modinfo.php
  templates/
    mymodule_index.tpl
  index.php
  xoops_version.php
```

## Pola Penyertaan Umum

Titik masuk module yang khas:

```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Get operation from request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Include XOOPS header
require_once XOOPS_ROOT_PATH . '/header.php';

// Your module logic here
switch ($op) {
    case 'view':
        // Handle view
        break;
    case 'list':
    default:
        // Handle list
        break;
}

// Include XOOPS footer
require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Langkah Selanjutnya

Sekarang setelah Anda memahami dasar-dasarnya, jelajahi:

- XMF-Request - Dokumentasi penanganan permintaan terperinci
- XMF-Module-Helper - Referensi pembantu module lengkap
- ../Recipes/Permission-Helper - Mengelola izin pengguna
- ../Recipes/Module-Admin-Pages - Membangun antarmuka admin

## Lihat Juga

- ../XMF-Framework - Ikhtisar kerangka kerja
- ../Reference/JWT - Dukungan Token Web JSON
- ../Reference/Database - Utilitas basis data

---

#xmf #memulai #namespaces #autoloading #basics
