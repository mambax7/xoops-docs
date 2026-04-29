---
title: "module Yönetici Sayfaları"
description: "XMF ile standartlaştırılmış ve ileriye dönük uyumlu module yönetim sayfaları oluşturma"
---
`Xmf\Module\Admin` sınıfı, module yönetim arayüzleri oluşturmak için tutarlı bir yol sağlar. Yönetici sayfaları için XMF kullanılması, aynı user deneyimini korurken gelecekteki XOOPS sürümleriyle ileriye dönük uyumluluk sağlar.

## Genel Bakış

XOOPS Çerçevelerindeki ModuleAdmin sınıfı, yönetimi kolaylaştırdı ancak API, sürümler arasında gelişti. `Xmf\Module\Admin` sarmalayıcısı:

- XOOPS sürümlerinde çalışan kararlı bir API sağlar
- Sürümler arasındaki API farklarını otomatik olarak yönetir
- Yönetici kodunuzun ileriye dönük uyumlu olmasını sağlar
- Ortak görevler için uygun statik yöntemler sunar

## Başlarken

### Yönetici Örneği Oluşturma
```php
$admin = \Xmf\Module\Admin::getInstance();
```
Bu, bir `Xmf\Module\Admin` örneğini veya zaten uyumluysa yerel sistem sınıfını döndürür.

## Simge Yönetimi

### Simge Konumu Sorunu

Simgelerin XOOPS sürümleri arasında taşınması bakım sorunlarına neden oldu. XMF bunu fayda yöntemleriyle çözer.

### Simgeleri Bulma

**Eski yöntem (versiyona bağlı):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```
**XMF yolu:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```
`iconUrl()` yöntemi tam URL değerini döndürür, dolayısıyla yol oluşturma konusunda endişelenmenize gerek yoktur.

### Simge Boyutları
```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```
### Menü Simgeleri

Admin menu.php dosyaları için:

**Eski yöntem:**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon32 = $module->getInfo('icons32');

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => '../../' . $pathIcon32 . '/home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => '../../' . $pathIcon32 . '/about.png'
];
```
**XMF yolu:**
```php
// Get path to icons
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```
## Standart Yönetici Sayfaları

### Dizin Sayfası

**Eski biçim:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```
**XMF biçimi:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```
### Sayfa Hakkında

**Eski biçim:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```
**XMF biçimi:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```
> **Not:** Gelecekteki XOOPS sürümlerinde, PayPal bilgileri xoops_version.php dosyasında ayarlanır. `setPaypal()` çağrısı mevcut sürümlerle uyumluluğu sağlarken yeni sürümlerde hiçbir etkisi yoktur.

## Navigasyon

### Gezinme Menüsünü Görüntüle
```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```
## Bilgi Kutuları

### Bilgi Kutuları Oluşturma
```php
$admin = \Xmf\Module\Admin::getInstance();

// Add an info box
$admin->addInfoBox('Module Statistics');

// Add lines to the info box
$admin->addInfoBoxLine('Total Items: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Active Users: ' . $userCount, 'default', 'blue');

// Display the info box
$admin->displayInfoBox();
```
## Yapılandırma Kutuları

Yapılandırma kutuları sistem gereksinimlerini ve durum kontrollerini görüntüler.

### Temel Yapılandırma Satırları
```php
$admin = \Xmf\Module\Admin::getInstance();

// Add a simple message
$admin->addConfigBoxLine('Module is properly configured', 'default');

// Check if directory exists
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// Check directory with permissions
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// Check if module is installed
$admin->addConfigBoxLine('xlanguage', 'module');

// Check module with warning instead of error if missing
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```
### Kolay Yöntemler
```php
$admin = \Xmf\Module\Admin::getInstance();

// Add error message
$admin->addConfigError('Upload directory is not writable');

// Add success/accept message
$admin->addConfigAccept('Database tables verified');

// Add warning message
$admin->addConfigWarning('Cache directory should be cleared');

// Check module version
$admin->addConfigModuleVersion('xlanguage', '1.0');
```
### Yapılandırma Kutusu Türleri

| Tür | Değer | Davranış |
|------|----------|----------|
| `default` | Mesaj dizisi | Mesajı doğrudan görüntüler |
| `folder` | Dizin yolu | Varsa kabulü, yoksa hatayı gösterir |
| `chmod` | `[path, permission]` | Dizinin izinle mevcut olup olmadığını kontrol eder |
| `module` | module adı | Yüklüyse kabul et, değilse hata |
| `module` | `[name, 'warning']` | Yüklüyse kabul edin, değilse uyarı |

## Öğe Düğmeleri

Yönetici sayfalarına eylem düğmeleri ekleyin:
```php
$admin = \Xmf\Module\Admin::getInstance();

// Add buttons
$admin->addItemButton('Add New Item', 'item.php?op=new', 'add');
$admin->addItemButton('Import Items', 'import.php', 'import');

// Display buttons (left aligned by default)
$admin->displayButton('left');

// Or get HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```
## Tam Yönetici Sayfası Örnekleri

### indeks.php
```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Display navigation
$adminObject->displayNavigation(basename(__FILE__));

// Add info box with statistics
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// Check configuration
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// Check optional modules
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// Display the index page
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```
### öğeler.php
```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Get operation
$op = \Xmf\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // Add action buttons
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // List items
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // Display table
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // Form handling code...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```
### about.php
```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// Set PayPal ID for donations (optional)
\Xmf\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// Display about page
// Pass false to hide XOOPS logo, true to show it
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```
### menü.php
```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// Get icon path using XMF
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// Items
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// Categories
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// Permissions
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// About
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```
## API Referans

### Statik Yöntemler

| Yöntem | Açıklama |
|----------|----------------|
| `getInstance()` | Yönetici örneğini alın |
| `iconUrl($name, $size)` | Simgeyi al URL (boyut: 16 veya 32) |
| `menuIconPath($image)` | menu.php için simge yolunu alın |
| `setPaypal($paypal)` | Yaklaşık sayfa için PayPal Kimliğini ayarlayın |

### Örnek Yöntemleri

| Yöntem | Açıklama |
|----------|----------------|
| `displayNavigation($menu)` | Gezinme menüsünü görüntüle |
| `renderNavigation($menu)` | Navigasyona geri dön HTML |
| `addInfoBox($title)` | Bilgi kutusu ekle |
| `addInfoBoxLine($text, $type, $color)` | Bilgi kutusuna satır ekle |
| `displayInfoBox()` | Bilgi kutusunu görüntüle |
| `renderInfoBox()` | İade bilgi kutusu HTML |
| `addConfigBoxLine($value, $type)` | Yapılandırma kontrol satırı ekle |
| `addConfigError($value)` | Yapılandırma kutusuna hata ekle |
| `addConfigAccept($value)` | Yapılandırma kutusuna başarı ekleyin |
| `addConfigWarning($value)` | Yapılandırma kutusuna uyarı ekle |
| `addConfigModuleVersion($moddir, $version)` | module sürümünü kontrol edin |
| `addItemButton($title, $link, $icon, $extra)` | Eylem düğmesi ekle |
| `displayButton($position, $delimiter)` | Ekran düğmeleri |
| `renderButton($position, $delimiter)` | Geri Dön butonu HTML |
| `displayIndex()` | Dizin sayfasını görüntüle |
| `renderIndex()` | Dizin sayfasına dön HTML |
| `displayAbout($logo_xoops)` | Sayfa hakkında görüntüle |
| `renderAbout($logo_xoops)` | Sayfa hakkında geri dön HTML |

## Ayrıca Bakınız

- ../Basics/XMF-Module-Helper - module yardımcı sınıfı
- İzin Yardımcısı - İzin yönetimi
- ../XMF-Framework - Çerçeveye genel bakış

---

#xmf #admin #module geliştirme #navigasyon #simgeler