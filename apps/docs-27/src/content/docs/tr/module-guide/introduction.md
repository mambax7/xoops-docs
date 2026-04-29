---
title: "module Geliştirme"
description: "Modern PHP uygulamalarını kullanarak XOOPS modüllerini geliştirmeye yönelik kapsamlı kılavuz"
---
Bu bölüm, modern PHP uygulamalarını, tasarım modellerini ve en iyi uygulamaları kullanarak XOOPS modüllerinin geliştirilmesine yönelik kapsamlı belgeler sağlar.

## Genel Bakış

XOOPS modülünün gelişimi yıllar içinde önemli ölçüde gelişti. Modern modüllerin gücü:

- **MVC Mimari** - Sorunların net bir şekilde ayrılması
- **PHP 8.x Özellikleri** - Tür bildirimleri, nitelikler, adlandırılmış argümanlar
- **Tasarım Desenleri** - Depo, DTO, Hizmet Katmanı desenleri
- **Test** - PHPUnit modern test uygulamalarıyla
- **XMF Çerçeve** - XOOPS module Çerçevesi yardımcı programları

## Dokümantasyon Yapısı

### Öğreticiler

XOOPS modüllerini sıfırdan oluşturmak için adım adım kılavuzlar.

- Tutorials/Hello-World-Module - İlk XOOPS modülünüz
- Tutorials/Building-a-CRUD-Module - Oluşturma, Okuma, Güncelleme, Silme işlevini tamamlayın

### Tasarım Desenleri

Modern XOOPS modülü geliştirmede kullanılan mimari desenler.

- Patterns/MVC-Pattern - Model-Görünüm-Denetleyici mimarisi
- Patterns/Repository-Pattern - Veri erişimi soyutlaması
- Patterns/DTO-Pattern - Temiz veri akışı için Veri Aktarım Nesneleri

### En İyi Uygulamalar

Sürdürülebilir, yüksek kaliteli kod yazmaya yönelik yönergeler.

- Best-Practices/Clean-Code - XOOPS için kod ilkelerini temizleme
- Best-Practices/Code-Smells - Yaygın anti-kalıplar ve bunların nasıl düzeltileceği
- Best-Practices/Testing - PHPUnit test stratejileri

### Örnekler

Gerçek dünyadaki module analizi ve uygulama örnekleri.

- Publisher Modülü Analizi - Publisher modülüne derinlemesine bakış

## module Dizin Yapısı

İyi organize edilmiş bir XOOPS modülü şu dizin yapısını takip eder:
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
## Anahtar Dosyaların Açıklaması

### xoops_version.php

XOOPS'ye modülünüz hakkında bilgi veren module tanım dosyası:
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
### Ortak Dahil Etme Dosyası

Modülünüz için ortak bir önyükleme dosyası oluşturun:
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
## PHP Sürüm Gereksinimleri

Modern XOOPS modülleri, kaldıraç için PHP 8.0 veya üzerini hedeflemelidir:

- **İnşaatçı Mülk Promosyonu**
- **Adlandırılmış Bağımsız Değişkenler**
- **Birleşim Türleri**
- **İfadeleri Eşleştir**
- **Nitelikler**
- **Nullsafe Operatörü**

## Başlarken

1. Tutorials/Hello-World-Module öğreticisiyle başlayın
2. Tutorials/Building-a-CRUD-Module'ye ilerleyin
3. Mimari rehberliği için Patterns/MVC-Pattern'yi inceleyin
4. Best-Practices/Clean-Code uygulamalarını baştan sona uygulayın
5. Best-Practices/Testing'yi baştan uygulayın

## İlgili Kaynaklar

- ../05-XMF-Framework/XMF-Framework - XOOPS module Çerçevesi yardımcı programları
- database İşlemleri - XOOPS veritabanıyla çalışma
- ../04-API-Reference/Template/Template-System - Smarty XOOPS'de template oluşturma
- ../02-Core-Concepts/Security/Security-Best-Practices - Modülünüzün güvenliği sağlanıyor

## Sürüm Geçmişi

| Sürüm | Tarih | Değişiklikler |
|-----------|------|-----------|
| 1.0 | 2025-01-28 | İlk belgeler |