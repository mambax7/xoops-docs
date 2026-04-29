---
title: "Modul Hello Dunia"
description: "Tutorial langkah demi langkah untuk mencipta modul XOOPS pertama anda"
---
# Tutorial Modul Hello Dunia

Tutorial ini membimbing anda membuat modul XOOPS pertama anda. Pada akhirnya, anda akan mempunyai modul berfungsi yang memaparkan "Hello World" pada kedua-dua bahagian hadapan dan kawasan pentadbir.

## Prasyarat

- XOOPS 2.5.x dipasang dan berjalan
- PHP 8.0 atau lebih tinggi
- Pengetahuan asas PHP
- Editor teks atau IDE (PhpStorm disyorkan)

## Langkah 1: Buat Struktur Direktori

Cipta struktur direktori berikut dalam `/modules/helloworld/`:
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
## Langkah 2: Cipta Definisi Modul

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
## Langkah 3: Cipta Fail Bahasa

### modinfo.php (Module Information)

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
### utama.php (Frontend Language)

Buat `language/english/main.php`:
```php
<?php
/**
 * Frontend Language Constants
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```
### admin.php (Admin Language)

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
## Langkah 4: Buat Indeks Frontend

Buat `index.php` dalam akar modul:
```php
<?php
/**
 * Hello World Module - Frontend Index
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
## Langkah 5: Cipta Templat Frontend

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
## Langkah 6: Buat Fail Pentadbir

### Tajuk Pentadbir

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
### Pengaki Pentadbir

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
### Menu Pentadbir

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
### Halaman Indeks Pentadbiran

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
## Langkah 7: Cipta Templat Pentadbiran

Buat `templates/admin/helloworld_admin_index.tpl`:
```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```
## Langkah 8: Cipta Logo Modul

Cipta atau salin imej PNG (saiz disyorkan: 92x92 piksel) ke:
`assets/images/logo.png`

Anda boleh menggunakan mana-mana editor imej untuk mencipta logo ringkas atau menggunakan pemegang tempat daripada tapak seperti placeholder.com.

## Langkah 9: Pasang Modul

1. Log masuk ke tapak XOOPS anda sebagai pentadbir
2. Pergi ke **Pentadbir Sistem** > **Modul**
3. Cari "Hello World" dalam senarai modul yang tersedia
4. Klik butang **Pasang**
5. Sahkan pemasangan

## Langkah 10: Uji Modul Anda

### Ujian Bahagian Hadapan

1. Navigasi ke tapak XOOPS anda
2. Klik pada "Hello World" dalam menu utama
3. Anda sepatutnya melihat mesej alu-aluan dan masa semasa

### Ujian Pentadbiran

1. Pergi ke kawasan admin
2. Klik pada "Hello World" dalam menu admin
3. Anda sepatutnya melihat papan pemuka pentadbir

## Menyelesaikan masalah

### Modul Tidak Muncul dalam Senarai Pemasangan

- Semak kebenaran fail (755 untuk direktori, 644 untuk fail)
- Sahkan `xoops_version.php` tidak mempunyai ralat sintaks
- Kosongkan XOOPS cache

### Templat Tidak Memuatkan

- Pastikan fail templat berada dalam direktori yang betul
- Semak nama fail templat sepadan dengan nama dalam `xoops_version.php`
- Sahkan sintaks Smarty adalah betul

### Rentetan Bahasa Tidak Ditunjukkan

- Semak laluan fail bahasa
- Pastikan pemalar bahasa ditakrifkan
- Sahkan wujud folder bahasa yang betul## Langkah Seterusnya

Sekarang anda mempunyai modul yang berfungsi, teruskan belajar dengan:

- Membina-CRUD-Modul - Tambah kefungsian pangkalan data
- ../Corak/MVC-Corak - Susun kod anda dengan betul
- ../Best-Practices/Testing - Tambah ujian PHPUnit

## Rujukan Fail Lengkap

Modul lengkap anda harus mempunyai fail ini:
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

tahniah! Anda telah mencipta modul XOOPS pertama anda. Konsep utama yang diliputi:

1. **Struktur Modul** - Reka letak direktori modul Standard XOOPS
2. **xoops_version.php** - Definisi dan konfigurasi modul
3. **Fail Bahasa** - Sokongan pengantarabangsaan
4. **Templat** - Penyepaduan templat Smarty
5. **Antaramuka Pentadbiran** - Panel pentadbir asas

Lihat juga: ../Module-Development | Membina-CRUD-Modul | ../Corak/MVC-Corak