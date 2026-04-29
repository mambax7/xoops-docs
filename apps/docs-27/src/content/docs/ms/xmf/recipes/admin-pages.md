---
title: "Halaman Pentadbiran Modul"
description: "Mencipta halaman pentadbiran modul yang standard dan serasi ke hadapan dengan XMF"
---
Kelas `XMF\Module\Admin` menyediakan cara yang konsisten untuk mencipta antara muka pentadbiran modul. Menggunakan XMF untuk halaman pentadbir memastikan keserasian ke hadapan dengan versi XOOPS masa hadapan sambil mengekalkan pengalaman pengguna yang seragam.

## Gambaran Keseluruhan

Kelas ModuleAdmin dalam Rangka Kerja XOOPS memudahkan pentadbiran, tetapi APInya telah berkembang merentas versi. Pembalut `XMF\Module\Admin`:

- Menyediakan API yang stabil yang berfungsi merentas XOOPS versi
- Secara automatik mengendalikan API perbezaan antara versi
- Memastikan kod pentadbir anda serasi ke hadapan
- Menawarkan kaedah statik yang mudah untuk tugasan biasa

## Bermula

### Mencipta Instance Pentadbir
```php
$admin = \Xmf\Module\Admin::getInstance();
```
Ini mengembalikan sama ada contoh `XMF\Module\Admin` atau kelas sistem asli jika sudah serasi.

## Pengurusan Ikon

### Masalah Lokasi Ikon

Ikon telah berpindah antara versi XOOPS, menyebabkan sakit kepala penyelenggaraan. XMF menyelesaikannya dengan kaedah utiliti.

### Mencari Ikon

**Cara lama (bergantung pada versi):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```
**XMF cara:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```
Kaedah `iconUrl()` mengembalikan URL penuh, jadi anda tidak perlu risau tentang pembinaan laluan.

### Saiz Ikon
```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```
### Ikon Menu

Untuk menu admin.php files:

**Cara lama:**
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
**XMF cara:**
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
## Halaman Pentadbiran Standard

### Halaman Indeks

**Format lama:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```
**XMF format:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```
### Mengenai Halaman

**Format lama:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```
**XMF format:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```
> **Nota:** Dalam versi XOOPS akan datang, maklumat PayPal ditetapkan dalam xoops_version.php. Panggilan `setPaypal()` memastikan keserasian dengan versi semasa sementara tidak memberi kesan pada versi yang lebih baharu.

## Navigasi

### Paparkan Menu Navigasi
```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```
## Kotak Maklumat

### Mencipta Kotak Maklumat
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
## Kotak Konfigurasi

Kotak konfigurasi memaparkan keperluan sistem dan semakan status.

### Garis Konfigurasi Asas
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
### Kaedah Kemudahan
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
### Jenis Kotak Konfigurasi

| Taip | Nilai | Tingkah laku |
|------|-------|----------|
| `default` | Rentetan mesej | Memaparkan mesej secara langsung |
| `folder` | Laluan direktori | Tunjuk terima jika wujud, ralat jika tidak |
| `chmod` | `[path, permission]` | Semak direktori wujud dengan kebenaran |
| `module` | Nama modul | Terima jika dipasang, ralat jika tidak |
| `module` | `[name, 'warning']` | Terima jika dipasang, amaran jika tidak |

## Butang Item

Tambahkan butang tindakan pada halaman pentadbir:
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
## Contoh Halaman Pentadbiran Lengkap

### index.php
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
### item.php
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
### tentang.php
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
### menu.php
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
## API Rujukan

### Kaedah Statik

| Kaedah | Penerangan |
|--------|--------------|
| `getInstance()` | Dapatkan contoh pentadbir |
| `iconUrl($name, $size)` | Dapatkan ikon URL (saiz: 16 atau 32) |
| `menuIconPath($image)` | Dapatkan laluan ikon untuk menu.php |
| `setPaypal($paypal)` | Tetapkan ID PayPal untuk halaman tentang |

### Kaedah Contoh

| Kaedah | Penerangan |
|--------|--------------|
| `displayNavigation($menu)` | Paparkan menu navigasi |
| `renderNavigation($menu)` | Navigasi kembali HTML |
| `addInfoBox($title)` | Tambah kotak maklumat |
| `addInfoBoxLine($text, $type, $color)` | Tambahkan baris pada kotak maklumat |
| `displayInfoBox()` | Paparkan kotak maklumat |
| `renderInfoBox()` | Kembalikan kotak maklumat HTML |
| `addConfigBoxLine($value, $type)` | Tambah baris semak konfigurasi |
| `addConfigError($value)` | Tambah ralat pada kotak konfigurasi |
| `addConfigAccept($value)` | Tambahkan kejayaan pada kotak konfigurasi |
| `addConfigWarning($value)` | Tambahkan amaran pada kotak konfigurasi |
| `addConfigModuleVersion($moddir, $version)` | Semak versi modul |
| `addItemButton($title, $link, $icon, $extra)` | Tambah butang tindakan |
| `displayButton($position, $delimiter)` | Butang paparan |
| `renderButton($position, $delimiter)` | Butang kembali HTML |
| `displayIndex()` | Paparkan halaman indeks |
| `renderIndex()` | Kembalikan halaman indeks HTML |
| `displayAbout($logo_xoops)` | Paparkan tentang halaman |
| `renderAbout($logo_xoops)` | Kembali tentang halaman HTML |## Lihat Juga

- ../Asas/XMF-Modul-Helper - Kelas pembantu modul
- Permission-Helper - Pengurusan kebenaran
- ../XMF-Rangka Kerja - Gambaran keseluruhan rangka kerja

---

#XMF #admin #module-development #navigation #icons