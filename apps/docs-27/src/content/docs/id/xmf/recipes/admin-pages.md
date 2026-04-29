---
title: "Halaman Admin module"
description: "Membuat halaman administrasi module yang terstandarisasi dan kompatibel ke depan dengan XMF"
---

Kelas `Xmf\Module\Admin` menyediakan cara yang konsisten untuk membuat antarmuka administrasi module. Menggunakan XMF untuk halaman admin memastikan kompatibilitas ke depan dengan versi XOOPS di masa mendatang sambil mempertahankan pengalaman pengguna yang seragam.

## Ikhtisar

Kelas ModuleAdmin di Kerangka XOOPS membuat administrasi lebih mudah, tetapi API-nya telah berkembang di berbagai versi. Pembungkus `Xmf\Module\Admin`:

- Menyediakan API stabil yang berfungsi di seluruh versi XOOPS
- Secara otomatis menangani perbedaan API antar versi
- Memastikan kode admin Anda kompatibel ke depan
- Menawarkan metode statis yang nyaman untuk tugas-tugas umum

## Memulai

### Membuat Mesin Virtual Admin

```php
$admin = \Xmf\Module\Admin::getInstance();
```

Ini mengembalikan instans `Xmf\Module\Admin` atau kelas sistem asli jika sudah kompatibel.

## Manajemen Ikon

### Masalah Lokasi Ikon

Ikon telah berpindah antara versi XOOPS, menyebabkan sakit kepala dalam pemeliharaan. XMF menyelesaikan ini dengan metode utilitas.

### Menemukan Ikon

**Cara lama (tergantung versi):**
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

Metode `iconUrl()` mengembalikan URL penuh, jadi Anda tidak perlu khawatir tentang konstruksi jalur.

### Ukuran Ikon

```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### Ikon Menu

Untuk file admin menu.php:

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

## Halaman Admin Standar

### Halaman Indeks

**Format lama:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**Format XMF:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### Tentang Halaman

**Format lama:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**Format XMF:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **Catatan:** Di versi XOOPS mendatang, informasi PayPal diatur di xoops_version.php. Panggilan `setPaypal()` memastikan kompatibilitas dengan versi saat ini dan tidak berpengaruh pada versi yang lebih baru.

## Navigasi

### Menampilkan Menu Navigasi

```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## Kotak Info

### Membuat Kotak Info

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

Kotak konfigurasi menampilkan persyaratan sistem dan pemeriksaan status.

### Baris Konfigurasi Dasar

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

### Metode Kenyamanan

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

| Ketik | Nilai | Perilaku |
|------|-------|----------|
| `default` | Rangkaian pesan | Menampilkan pesan secara langsung |
| `folder` | Jalur direktori | Menunjukkan terima jika ada, error jika tidak |
| `chmod` | `[path, permission]` | Direktori pemeriksaan ada dengan izin |
| `module` | Nama module | Terima jika dipasang, error jika tidak |
| `module` | `[name, 'warning']` | Terima jika terpasang, peringatan jika tidak |

## Tombol Barang

Tambahkan tombol tindakan ke halaman admin:

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

## Contoh Halaman Admin Lengkap

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

### items.php

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

## Referensi API

### Metode Statis

| Metode | Deskripsi |
|--------|-------------|
| `getInstance()` | Dapatkan contoh admin |
| `iconUrl($name, $size)` | Dapatkan ikon URL (ukuran: 16 atau 32) |
| `menuIconPath($image)` | Dapatkan jalur ikon untuk menu.php |
| `setPaypal($paypal)` | Tetapkan ID PayPal untuk halaman tentang |

### Metode Instans| Metode | Deskripsi |
|--------|-------------|
| `displayNavigation($menu)` | Tampilkan menu navigasi |
| `renderNavigation($menu)` | Navigasi kembali HTML |
| `addInfoBox($title)` | Tambahkan kotak info |
| `addInfoBoxLine($text, $type, $color)` | Tambahkan baris ke kotak info |
| `displayInfoBox()` | Tampilkan kotak info |
| `renderInfoBox()` | Kotak info pengembalian HTML |
| `addConfigBoxLine($value, $type)` | Tambahkan baris centang konfigurasi |
| `addConfigError($value)` | Tambahkan kesalahan ke kotak konfigurasi |
| `addConfigAccept($value)` | Tambahkan kesuksesan ke kotak konfigurasi |
| `addConfigWarning($value)` | Tambahkan peringatan ke kotak konfigurasi |
| `addConfigModuleVersion($moddir, $version)` | Periksa versi module |
| `addItemButton($title, $link, $icon, $extra)` | Tombol Tambahkan tindakan |
| `displayButton($position, $delimiter)` | Tombol tampilan |
| `renderButton($position, $delimiter)` | Tombol kembali HTML |
| `displayIndex()` | Tampilkan halaman indeks |
| `renderIndex()` | Kembalikan halaman indeks HTML |
| `displayAbout($logo_xoops)` | Tampilan tentang halaman |
| `renderAbout($logo_xoops)` | Kembali tentang halaman HTML |

## Lihat Juga

- ../Basics/XMF-Module-Helper - Kelas pembantu module
- Izin-Pembantu - Manajemen izin
- ../XMF-Framework - Ikhtisar kerangka kerja

---

#xmf #admin #pengembangan module #navigasi #icons
