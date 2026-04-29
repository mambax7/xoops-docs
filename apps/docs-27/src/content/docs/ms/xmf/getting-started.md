---
title: "Bermula dengan XMF"
description: "Pemasangan, konsep asas dan langkah pertama dengan Rangka Kerja Modul XOOPS"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Panduan ini merangkumi konsep asas Rangka Kerja Modul XOOPS (XMF) dan cara mula menggunakannya dalam modul anda.

## Prasyarat

- XOOPS 2.5.8 atau lebih baru dipasang
- PHP 7.2 atau lebih baru
- Pemahaman asas tentang PHP pengaturcaraan berorientasikan objek

## Memahami Ruang Nama

XMF menggunakan PHP ruang nama untuk mengatur kelasnya dan mengelakkan konflik penamaan. Semua XMF kelas berada dalam `XMF` ruang nama.

### Masalah Angkasa Global

Tanpa ruang nama, semua kelas PHP berkongsi ruang global. Ini boleh menyebabkan konflik:
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
### Penyelesaian Ruang Nama

Ruang nama mencipta konteks penamaan terpencil:
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
### Menggunakan XMF Ruang nama

Anda boleh merujuk XMF kelas dalam beberapa cara:

**Laluan ruang nama penuh:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```
**Dengan pernyataan penggunaan:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```
**Berbilang import:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```
## Autoloading

Salah satu kemudahan terbesar XMF ialah pemuatan kelas automatik. Anda tidak perlu memasukkan XMF fail kelas secara manual.

### Tradisional XOOPS Memuatkan

Cara lama memerlukan pemuatan eksplisit:
```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```
### XMF Autoloading

Dengan XMF, kelas dimuatkan secara automatik apabila dirujuk:
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
Autoloader mengikut piawaian [PSR-4](http://www.php-fig.org/psr/psr-4/) dan juga menguruskan kebergantungan yang XMF bergantung pada.

## Contoh Penggunaan Asas

### Input Permintaan Membaca
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
### Menggunakan Pembantu Modul
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
### Laluan dan URL Pembantu
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
## Menyahpepijat dengan XMF

XMF menyediakan alat penyahpepijatan yang berguna:
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
Output nyahpepijat boleh dilipat dan memaparkan objek dan tatasusunan dalam format yang mudah dibaca.

## Syor Struktur Projek

Apabila membina modul berasaskan XMF, susun kod anda:
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
## Corak Sertakan Biasa

Titik kemasukan modul biasa:
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
## Langkah Seterusnya

Sekarang setelah anda memahami asasnya, terokai:

- XMF-Permintaan - Dokumentasi pengendalian permintaan terperinci
- XMF-Modul-Helper - Rujukan pembantu modul lengkap
- ../Recipes/Permission-Helper - Mengurus kebenaran pengguna
- ../Recipes/Module-Admin-Pages - Membina antara muka pentadbir

## Lihat Juga

- ../XMF-Rangka Kerja - Gambaran keseluruhan rangka kerja
- ../Rujukan/JWT - JSON Sokongan Token Web
- ../Reference/Database - Utiliti pangkalan data

---

#XMF #bermula #ruang nama #pemuatanauto #asas