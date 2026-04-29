---
title: "Merhaba Dünya Modülü"
description: "İlk XOOPS modülünüzü oluşturmak için adım adım eğitim"
---
# Merhaba Dünya Modülü Eğitimi

Bu eğitim, ilk XOOPS modülünüzü oluşturmanızda size yol gösterir. Sonunda, hem ön uç hem de yönetici alanlarında "Merhaba Dünya"yı görüntüleyen bir çalışma modülünüz olacak.

## Önkoşullar

- XOOPS 2.5.x kurulu ve çalışıyor
- PHP 8.0 veya üzeri
- Temel PHP bilgisi
- Metin editörü veya IDE (PhpStorm önerilir)

## Adım 1: Dizin Yapısını Oluşturun

`/modules/helloworld/`'de aşağıdaki dizin yapısını oluşturun:
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
## Adım 2: module Tanımını Oluşturun

`xoops_version.php` oluşturun:
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
## Adım 3: Dil Dosyaları Oluşturun

### modinfo.php (module Bilgileri)

`language/english/modinfo.php` oluşturun:
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
### main.php (Ön Uç Dili)

`language/english/main.php` oluşturun:
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
### admin.php (Yönetici Dili)

`language/english/admin.php` oluşturun:
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
## Adım 4: Ön Uç Dizinini Oluşturun

module kökünde `index.php` oluşturun:
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
## Adım 5: Ön Uç Şablonunu Oluşturun

`templates/helloworld_index.tpl` oluşturun:
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
## Adım 6: Yönetici Dosyaları Oluşturun

### Yönetici Başlığı

`admin/admin_header.php` oluşturun:
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
### Yönetici Altbilgisi

`admin/admin_footer.php` oluşturun:
```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```
### Yönetici Menüsü

`admin/menu.php` oluşturun:
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
### Yönetici Dizini Sayfası

`admin/index.php` oluşturun:
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
## Adım 7: Yönetici Şablonu Oluşturun

`templates/admin/helloworld_admin_index.tpl` oluşturun:
```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```
## Adım 8: module Logosunu Oluşturun

Bir PNG görseli (önerilen boyut: 92x92 piksel) oluşturun veya şuraya kopyalayın:
`assets/images/logo.png`

Basit bir logo oluşturmak için herhangi bir resim düzenleyiciyi kullanabilir veya placeholder.com gibi bir sitedeki yer tutucuyu kullanabilirsiniz.

## Adım 9: Modülü Kurun

1. XOOPS sitenize yönetici olarak giriş yapın
2. **Sistem Yöneticisi** > **modules**'e gidin
3. Mevcut modules listesinde "Merhaba Dünya"yı bulun
4. **Yükle** düğmesini tıklayın
5. Kurulumu onaylayın

## Adım 10: Modülünüzü Test Edin

### Ön Uç Testi

1. XOOPS sitenize gidin
2. Ana menüde "Merhaba Dünya"ya tıklayın
3. Karşılama mesajını ve geçerli saati görmelisiniz

### Yönetici Testi

1. Yönetici alanına gidin
2. Yönetici menüsünde "Merhaba Dünya"ya tıklayın
3. Yönetici kontrol panelini görmelisiniz

## Sorun Giderme

### module Kurulum Listesinde Görünmüyor

- Dosya izinlerini kontrol edin (dizinler için 755, dosyalar için 644)
- `xoops_version.php`'de sözdizimi hatası olmadığını doğrulayın
- XOOPS önbelleğini temizleyin

### template Yüklenmiyor

- template dosyalarının doğru dizinde olduğundan emin olun
- template dosya adlarının `xoops_version.php` içindekilerle eşleştiğini kontrol edin
- Smarty sözdiziminin doğru olduğunu doğrulayın

### Dil Dizeleri Gösterilmiyor

- Dil dosyası yollarını kontrol edin
- Dil sabitlerinin tanımlandığından emin olun
- Doğru dil klasörünün mevcut olduğunu doğrulayın

## Sonraki Adımlar

Artık çalışan bir modülünüz olduğuna göre öğrenmeye devam edin:

- Building-a-CRUD-Module - database işlevselliği ekleme
- ../Patterns/MVC-Pattern - Kodunuzu doğru şekilde düzenleyin
- ../Best-Practices/Testing - PHPUnit testleri ekle

## Tam Dosya Referansı

Tamamlanan modülünüzde şu dosyalar bulunmalıdır:
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
## Özet

Tebrikler! İlk XOOPS modülünüzü oluşturdunuz. Kapsanan temel kavramlar:

1. **module Yapısı** - Standart XOOPS module dizini düzeni
2. **xoops_version.php** - module tanımı ve yapılandırması
3. **Dil Dosyaları** - Uluslararasılaştırma desteği
4. **templates** - Smarty template entegrasyonu
5. **Yönetici Arayüzü** - Temel yönetici paneli

Ayrıca bakınız: ../Module-Development | Building-a-CRUD-module | ../Patterns/MVC-Pattern