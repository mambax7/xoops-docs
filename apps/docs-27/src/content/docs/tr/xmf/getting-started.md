---
title: "XMF'ye Başlarken"
description: "XOOPS module Çerçevesi ile kurulum, temel kavramlar ve ilk adımlar"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Bu kılavuz, XOOPS module Çerçevesi'nin (XMF) temel kavramlarını ve bunu modüllerinizde nasıl kullanmaya başlayacağınızı kapsar.

## Önkoşullar

- XOOPS 2.5.8 veya üzeri yüklü
- PHP 7.2 veya üstü
- PHP nesne yönelimli programlamanın temel anlayışı

## Ad Alanlarını Anlamak

XMF, sınıflarını düzenlemek ve adlandırma çakışmalarını önlemek için PHP ad alanlarını kullanır. Tüm XMF sınıfları `Xmf` ad alanındadır.

### Küresel Uzay Sorunu

Ad alanları olmadan tüm PHP sınıfları global bir alanı paylaşır. Bu, çatışmalara neden olabilir:
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
### Ad Alanları Çözümü

Ad alanları yalıtılmış adlandırma bağlamları oluşturur:
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
### XMF Ad Alanlarını Kullanma

XMF sınıflarına çeşitli şekillerde başvurabilirsiniz:

**Tam ad alanı yolu:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```
**Kullanım ifadesiyle:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```
**Birden fazla içe aktarma:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```
## Otomatik yükleme

XMF'nin en büyük kolaylıklarından biri otomatik sınıf yüklemesidir. XMF sınıf dosyalarını manuel olarak eklemenize asla gerek yoktur.

### Geleneksel XOOPS Yükleniyor

Eski yöntem açık yükleme gerektiriyordu:
```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```
### XMF Otomatik yükleme

XMF ile sınıflar referans alındığında otomatik olarak yüklenir:
```php
$input = Xmf\Request::getString('input', '');
```
Veya bir use ifadesiyle:
```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```
Otomatik yükleyici, [PSR-4](PH000000¤) standardını izler ve aynı zamanda XMF'ün dayandığı bağımlılıkları da yönetir.

## Temel Kullanım Örnekleri

### Okuma İsteği Girişi
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
### module Yardımcısını Kullanma
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
### Yol ve URL Yardımcılar
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
## XMF ile hata ayıklama

XMF yararlı hata ayıklama araçları sağlar:
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
Hata ayıklama çıktısı daraltılabilir ve nesneleri ve dizileri okunması kolay bir biçimde görüntüler.

## Proje Yapısı Önerisi

XMF tabanlı modules oluştururken kodunuzu düzenleyin:
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
## Ortak Dahil Etme Deseni

Tipik bir module giriş noktası:
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
## Sonraki Adımlar

Artık temelleri anladığınıza göre şunları keşfedin:

- XMF-Talep - Ayrıntılı talep işleme belgeleri
- XMF-Module-Helper - Tam module yardımcı referansı
- ../Recipes/Permission-Helper - user izinlerini yönetme
- ../Recipes/Module-Admin-Pages - Yönetici arayüzleri oluşturma

## Ayrıca Bakınız

- ../XMF-Framework - Çerçeveye genel bakış
- ../Reference/JWT - JSON Web Token desteği
- ../Reference/Database - database yardımcı programları

---

#xmf #başlarken #ad alanları #otomatik yükleme #temel bilgiler