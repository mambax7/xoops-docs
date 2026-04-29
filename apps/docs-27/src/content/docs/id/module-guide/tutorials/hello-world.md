---
title: "module Halo Dunia"
description: "Tutorial langkah demi langkah untuk membuat module XOOPS pertama Anda"
---

# Tutorial module Halo Dunia

Tutorial ini memandu Anda dalam membuat module XOOPS pertama Anda. Pada akhirnya, Anda akan memiliki module kerja yang menampilkan "Hello World" di area front-end dan admin.

## Prasyarat

- XOOPS 2.5.x terinstal dan berjalan
- PHP 8.0 atau lebih tinggi
- Pengetahuan dasar PHP
- Editor teks atau IDE (disarankan PhpStorm)

## Langkah 1: Buat Struktur Direktori

Buat struktur direktori berikut di `/modules/helloworld/`:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## Langkah 2: Buat Definisi module

Buat `xoops_version.php`:

```php
<?php
/**
 * Hello World Module - Module Definition
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// Basic Module Information
$modversion['name']        = _MI_HELLOWORLD_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_HELLOWORLD_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['help']        = 'page=help';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'helloworld';

// Module Status
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// Admin Configuration
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// Main Menu
$modversion['hasMain'] = 1;

// Templates
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// Admin Templates
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// No database tables needed for this simple module
$modversion['tables'] = [];
```

## Langkah 3: Buat File Bahasa

### modinfo.php (Informasi module)

Buat `language/english/modinfo.php`:

```php
<?php
/**
 * Module Information Language Constants
 */

// Module Info
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'A simple Hello World module for learning XOOPS development.');

// Template Descriptions
define('_MI_HELLOWORLD_INDEX_TPL', 'Main index page template');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', 'Admin index page template');
```

### main.php (Bahasa Depan)

Buat `language/english/main.php`:

```php
<?php
/**
 * front-end Language Constants
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```

### admin.php (Bahasa Admin)

Buat `language/english/admin.php`:

```php
<?php
/**
 * Admin Language Constants
 */

define('_AM_HELLOWORLD_INDEX', 'Dashboard');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World Administration');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Welcome to the Hello World Module Administration');
define('_AM_HELLOWORLD_MODULE_INFO', 'Module Information');
define('_AM_HELLOWORLD_VERSION', 'Version:');
define('_AM_HELLOWORLD_AUTHOR', 'Author:');
```

## Langkah 4: Buat Indeks front-end

Buat `index.php` di root module:

```php
<?php
/**
 * Hello World Module - front-end Index
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// Load language file
xoops_loadLanguage('main', 'helloworld');

// Get the module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');

// Set page template
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// Include XOOPS header
require XOOPS_ROOT_PATH . '/header.php';

// Get module configuration
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// Generate page content
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// Simple visitor counter (using session)
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// Assign variables to template
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// Include XOOPS footer
require XOOPS_ROOT_PATH . '/footer.php';
```

## Langkah 5: Buat template front-end

Buat `templates/helloworld_index.tpl`:

```smarty
<{* Hello World Module - Index Template *}>

<div class="helloworld-container">
    <h1><{$page_title}></h1>

    <div class="helloworld-welcome">
        <p class="lead"><{$welcome_message}></p>
    </div>

    <div class="helloworld-content">
        <p><{$content_message}></p>
    </div>

    <div class="helloworld-info">
        <ul>
            <li><strong><{$time_label}></strong> <{$current_time}></li>
            <li><strong><{$visitor_label}></strong> <{$visitor_count}></li>
        </ul>
    </div>
</div>

<style>
.helloworld-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.helloworld-welcome {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
}

.helloworld-content {
    margin: 20px 0;
}

.helloworld-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
}

.helloworld-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.helloworld-info li {
    padding: 5px 0;
}
</style>
```

## Langkah 6: Buat File Admin

### Tajuk Admin

Buat `admin/admin_header.php`:

```php
<?php
/**
 * Admin Header
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// Load admin language file
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// Get module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');
$adminObject = \Xmf\Module\Admin::getInstance();

// Module directory
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```

### Catatan Kaki Admin

Buat `admin/admin_footer.php`:

```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### Menu Admin

Buat `admin/menu.php`:

```php
<?php
/**
 * Admin Menu Configuration
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```

### Halaman Indeks Admin

Buat `admin/index.php`:

```php
<?php
/**
 * Admin Index Page
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// Display admin navigation
$adminObject->displayNavigation('index.php');

// Create admin info box
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// Display info box
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// Display admin footer
require_once __DIR__ . '/admin_footer.php';
```

## Langkah 7: Buat Template Admin

Buat `templates/admin/helloworld_admin_index.tpl`:

```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## Langkah 8: Buat Logo module

Buat atau salin gambar PNG (ukuran yang disarankan: 92x92 piksel) ke:
`assets/images/logo.png`

Anda dapat menggunakan editor gambar apa pun untuk membuat logo sederhana, atau menggunakan placeholder dari situs seperti placeholder.com.

## Langkah 9: Instal module

1. Masuk ke situs XOOPS Anda sebagai administrator
2. Buka **Admin Sistem** > **module**
3. Temukan "Hello World" dalam daftar module yang tersedia
4. Klik tombol **Instal**
5. Konfirmasikan instalasi

## Langkah 10: Uji module Anda

### Tes Bagian Depan

1. Navigasikan ke situs XOOPS Anda
2. Klik "Halo Dunia" di menu utama
3. Anda akan melihat pesan selamat datang dan waktu saat ini

### Tes Admin

1. Pergi ke area admin
2. Klik "Halo Dunia" di menu admin
3. Anda akan melihat dasbor admin

## Pemecahan masalah

### module Tidak Muncul di Daftar Instal

- Periksa izin file (755 untuk direktori, 644 untuk file)
- Verifikasi `xoops_version.php` tidak memiliki kesalahan sintaksis
- Hapus cache XOOPS

### template Tidak Dapat Dimuat

- Pastikan file template berada di direktori yang benar
- Periksa nama file template cocok dengan yang ada di `xoops_version.php`
- Pastikan sintaks Smarty sudah benar

### String Bahasa Tidak Ditampilkan

- Periksa jalur file bahasa
- Pastikan konstanta bahasa ditentukan
- Pastikan folder bahasa yang benar ada

## Langkah Selanjutnya

Sekarang Anda memiliki module yang berfungsi, lanjutkan belajar dengan:

- Membangun-a-CRUD-Module - Tambahkan fungsionalitas database
- ../Patterns/MVC-Pattern - Atur kode Anda dengan benar
- ../Best-Practices/Testing - Tambahkan tes PHPUnit

## Referensi File Lengkap

module Anda yang telah selesai seharusnya memiliki file-file ini:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## Ringkasan

Selamat! Anda telah membuat module XOOPS pertama Anda. Konsep-konsep utama yang dibahas:

1. **Struktur module** - Tata letak direktori module XOOPS standar
2. **xoops_version.php** - Definisi dan konfigurasi module
3. **File Bahasa** - Dukungan internasionalisasi
4. **template** - Integrasi template Smarty
5. **Antarmuka Admin** - Panel admin dasar

Lihat juga: ../Module-Development | Membangun-module-CRUD | ../Patterns/MVC-Pattern
