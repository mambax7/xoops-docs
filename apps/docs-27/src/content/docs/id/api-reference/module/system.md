---
title: "Sistem module XOOPS"
description: "Siklus hidup module, kelas XoopsModule, module installation/uninstallation, kait module, dan manajemen module"
---

Sistem module XOOPS menyediakan kerangka kerja lengkap untuk mengembangkan, menginstal, mengelola, dan memperluas fungsionalitas module. module adalah paket mandiri yang memperluas XOOPS dengan fitur dan kemampuan tambahan.

## Arsitektur module

```mermaid
graph TD
    A[Module Package] -->|contains| B[xoops_version.php]
    A -->|contains| C[Admin Interface]
    A -->|contains| D[User Interface]
    A -->|contains| E[Class Files]
    A -->|contains| F[SQL Schema]

    B -->|defines| G[Module Metadata]
    B -->|defines| H[Admin Pages]
    B -->|defines| I[User Pages]
    B -->|defines| J[Blocks]
    B -->|defines| K[Hooks]

    L[Module Manager] -->|reads| B
    L -->|controls| M[Installation]
    L -->|controls| N[Activation]
    L -->|controls| O[Update]
    L -->|controls| P[Uninstallation]
```

## Struktur module

Struktur direktori module XOOPS standar:

```
mymodule/
├── xoops_version.php          # Module manifest and configuration
├── admin.php                  # Admin main page
├── index.php                  # User main page
├── admin/                     # Admin pages directory
│   ├── main.php
│   ├── manage.php
│   └── settings.php
├── class/                     # Module classes
│   ├── Handler/
│   │   ├── ItemHandler.php
│   │   └── CategoryHandler.php
│   └── Objects/
│       ├── Item.php
│       └── Category.php
├── sql/                       # Database schemas
│   ├── mysql.sql
│   └── postgres.sql
├── include/                   # Include files
│   ├── common.inc.php
│   └── functions.php
├── templates/                 # Module templates
│   ├── admin/
│   │   └── main.tpl
│   └── user/
│       ├── index.tpl
│       └── item.tpl
├── blocks/                    # Module blocks
│   └── blocks.php
├── tests/                     # Unit tests
├── language/                  # Language files
│   ├── english/
│   │   └── main.php
│   └── spanish/
│       └── main.php
└── docs/                      # Documentation
```

## Kelas XoopsModule

Kelas XoopsModule mewakili module XOOPS yang diinstal.

### Ikhtisar Kelas

```php
namespace Xoops\Core\Module;

class XoopsModule extends XoopsObject
{
    protected int $moduleid = 0;
    protected string $name = '';
    protected string $dirname = '';
    protected string $version = '';
    protected string $description = '';
    protected array $config = [];
    protected array $blocks = [];
    protected array $adminPages = [];
    protected array $userPages = [];
}
```

### Properti

| Properti | Ketik | Deskripsi |
|----------|------|-------------|
| `$moduleid` | ke dalam | ID module unik |
| `$name` | tali | Nama tampilan module |
| `$dirname` | tali | Nama direktori module |
| `$version` | tali | Versi module saat ini |
| `$description` | tali | Deskripsi module |
| `$config` | susunan | Konfigurasi module |
| `$blocks` | susunan | block module |
| `$adminPages` | susunan | Halaman panel admin |
| `$userPages` | susunan | Halaman yang dilihat pengguna |

### Konstruktor

```php
public function __construct()
```

Membuat instance module baru dan menginisialisasi variabel.

### Metode core

#### dapatkan Nama

Mendapatkan nama tampilan module.

```php
public function getName(): string
```

**Pengembalian:** `string` - Nama tampilan module

**Contoh:**
```php
$module = new XoopsModule();
$module->setVar('name', 'Publisher');
echo $module->getName(); // "Publisher"
```

#### dapatkan NamaDirname

Mendapatkan nama direktori module.

```php
public function getDirname(): string
```

**Pengembalian:** `string` - Nama direktori module

**Contoh:**
```php
echo $module->getDirname(); // "publisher"
```

#### dapatkanVersi

Mendapatkan versi module saat ini.

```php
public function getVersion(): string
```

**Pengembalian:** `string` - String versi

**Contoh:**
```php
echo $module->getVersion(); // "2.1.0"
```

#### dapatkanDeskripsi

Mendapatkan deskripsi module.

```php
public function getDescription(): string
```

**Pengembalian:** `string` - Deskripsi module

**Contoh:**
```php
$desc = $module->getDescription();
```

#### dapatkan Konfigurasi

Mengambil konfigurasi module.

```php
public function getConfig(string $key = null): mixed
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$key` | tali | Kunci konfigurasi (null untuk semua) |

**Pengembalian:** `mixed` - Nilai atau array konfigurasi

**Contoh:**
```php
$config = $module->getConfig();
$itemsPerPage = $module->getConfig('items_per_page');
```

#### setConfig

Mengatur konfigurasi module.

```php
public function setConfig(string $key, mixed $value): void
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$key` | tali | Kunci konfigurasi |
| `$value` | campuran | Nilai konfigurasi |

**Contoh:**
```php
$module->setConfig('items_per_page', 20);
$module->setConfig('enable_cache', true);
```

#### dapatkan Jalur

Mendapatkan jalur sistem file lengkap ke module.

```php
public function getPath(): string
```

**Pengembalian:** `string` - Jalur direktori module absolut

**Contoh:**
```php
$path = $module->getPath(); // "/var/www/xoops/modules/publisher"
$classPath = $module->getPath() . '/class';
```

#### dapatkan Url

Mendapatkan URL ke module.

```php
public function getUrl(): string
```

**Pengembalian:** `string` - module URL

**Contoh:**
```php
$url = $module->getUrl(); // "http://example.com/modules/publisher"
```

## Proses Instalasi module

### Fungsi xoops_module_install

Fungsi instalasi module yang ditentukan dalam `xoops_version.php`:

```php
function xoops_module_install_modulename($module)
{
    // $module is an XoopsModule instance

    // Create database tables
    // Initialize default configuration
    // Create default folders
    // Set up file permissions

    return true; // Success
}
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$module` | XoopsModul | module yang sedang diinstal |

**Pengembalian:** `bool` - Benar jika berhasil, salah jika gagal

**Contoh:**
```php
function xoops_module_install_publisher($module)
{
    // Get module path
    $modulePath = $module->getPath();

    // Create uploads directory
    $uploadsPath = XOOPS_ROOT_PATH . '/uploads/publisher';
    if (!is_dir($uploadsPath)) {
        mkdir($uploadsPath, 0755, true);
    }

    // Get database connection
    global $xoopsDB;

    // Execute SQL installation script
    $sqlFile = $modulePath . '/sql/mysql.sql';
    if (file_exists($sqlFile)) {
        $sqlQueries = file_get_contents($sqlFile);
        // Execute queries (simplified)
        $xoopsDB->queryFromFile($sqlFile);
    }

    // Set default configuration
    $module->setConfig('items_per_page', 10);
    $module->setConfig('enable_comments', true);

    return true;
}
```

### xoops_module_uninstall Fungsi

Fungsi penghapusan module:

```php
function xoops_module_uninstall_modulename($module)
{
    // Drop database tables
    // Remove uploaded files
    // Clean up configuration

    return true;
}
```

**Contoh:**
```php
function xoops_module_uninstall_publisher($module)
{
    global $xoopsDB;

    // Drop tables
    $tables = ['publisher_items', 'publisher_categories', 'publisher_comments'];
    foreach ($tables as $table) {
        $xoopsDB->query('DROP TABLE IF EXISTS ' . $xoopsDB->prefix($table));
    }

    // Remove upload folder
    $uploadsPath = XOOPS_ROOT_PATH . '/uploads/publisher';
    if (is_dir($uploadsPath)) {
        // Recursive directory deletion
        $this->recursiveRemoveDir($uploadsPath);
    }

    return true;
}
```

## Kait module

hook module memungkinkan module berintegrasi dengan module lain dan sistem.

### Deklarasi Kait

Di `xoops_version.php`:

```php
$modversion['hooks'] = [
    'system.page.footer' => [
        'function' => 'publisher_page_footer'
    ],
    'user.profile.view' => [
        'function' => 'publisher_user_articles'
    ],
];
```

### Implementasi Kait

```php
// In a module file (e.g., include/hooks.php)

function publisher_page_footer()
{
    // Return HTML for footer
    return '<div class="publisher-footer">Publisher Footer Content</div>';
}

function publisher_user_articles($user_id)
{
    global $xoopsDB;

    // Get user's articles
    $result = $xoopsDB->query(
        'SELECT * FROM ' . $xoopsDB->prefix('publisher_articles') .
        ' WHERE author_id = ? ORDER BY published DESC LIMIT 5',
        [$user_id]
    );

    $articles = [];
    while ($row = $xoopsDB->fetchAssoc($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

### Kait Sistem yang Tersedia

| Kait | Parameter | Deskripsi |
|------|-----------|-------------|
| `system.page.header` | Tidak ada | Keluaran tajuk halaman |
| `system.page.footer` | Tidak ada | Keluaran footer halaman |
| `user.login.success` | Objek $user | Setelah pengguna login |
| `user.logout` | Objek $user | Setelah pengguna logout |
| `user.profile.view` | $user_id | Melihat profil pengguna |
| `module.install` | Objek $module | Pemasangan module |
| `module.uninstall` | Objek $module | Penghapusan module |

## Layanan Manajer module

Layanan ModuleManager menangani operasi module.

### Metode#### getModule

Mengambil module berdasarkan nama.

```php
public function getModule(string $dirname): ?XoopsModule
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$dirname` | tali | Nama direktori module |

**Pengembalian:** `?XoopsModule` - Contoh module atau nol

**Contoh:**
```php
$moduleManager = $kernel->getService('module');
$publisher = $moduleManager->getModule('publisher');
if ($publisher) {
    echo $publisher->getName();
}
```

#### dapatkanSemuaModul

Mendapatkan semua module yang terpasang.

```php
public function getAllModules(bool $activeOnly = true): array
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$activeOnly` | bodoh | Hanya kembalikan module aktif |

**Pengembalian:** `array` - Array objek XoopsModule

**Contoh:**
```php
$activeModules = $moduleManager->getAllModules(true);
foreach ($activeModules as $module) {
    echo $module->getName() . " - " . $module->getVersion() . "\n";
}
```

#### adalahModuleActive

Memeriksa apakah module aktif.

```php
public function isModuleActive(string $dirname): bool
```

**Contoh:**
```php
if ($moduleManager->isModuleActive('publisher')) {
    // Publisher module is active
}
```

#### aktifkanModul

Mengaktifkan module.

```php
public function activateModule(string $dirname): bool
```

**Contoh:**
```php
if ($moduleManager->activateModule('publisher')) {
    echo "Publisher activated";
}
```

#### nonaktifkanModul

Menonaktifkan module.

```php
public function deactivateModule(string $dirname): bool
```

**Contoh:**
```php
if ($moduleManager->deactivateModule('publisher')) {
    echo "Publisher deactivated";
}
```

## Konfigurasi module (xoops_version.php)

Contoh manifes module lengkap:

```php
<?php
/**
 * Module manifest for Publisher
 */

$modversion = [
    'name' => 'Publisher',
    'version' => '2.1.0',
    'description' => 'Professional content publishing module',
    'author' => 'XOOPS Community',
    'credits' => 'Based on original work by...',
    'license' => 'GPL v2',
    'official' => 1,
    'image' => 'images/logo.png',
    'dirname' => 'publisher',
    'onInstall' => 'xoops_module_install_publisher',
    'onUpdate' => 'xoops_module_update_publisher',
    'onUninstall' => 'xoops_module_uninstall_publisher',

    // Admin pages
    'hasAdmin' => 1,
    'adminindex' => 'admin/main.php',
    'adminmenu' => [
        [
            'title' => 'Dashboard',
            'link' => 'admin/main.php',
            'icon' => 'dashboard.png'
        ],
        [
            'title' => 'Manage Items',
            'link' => 'admin/items.php',
            'icon' => 'items.png'
        ],
        [
            'title' => 'Settings',
            'link' => 'admin/settings.php',
            'icon' => 'settings.png'
        ]
    ],

    // User pages
    'hasMain' => 1,
    'main_file' => 'index.php',

    // Blocks
    'blocks' => [
        [
            'file' => 'blocks/recent.php',
            'name' => 'Recent Articles',
            'description' => 'Display recent published articles',
            'show_func' => 'publisher_recent_show',
            'edit_func' => 'publisher_recent_edit',
            'options' => '5|0|0',
            'template' => 'publisher_block_recent.tpl'
        ],
        [
            'file' => 'blocks/featured.php',
            'name' => 'Featured Articles',
            'description' => 'Display featured articles',
            'show_func' => 'publisher_featured_show',
            'edit_func' => 'publisher_featured_edit'
        ]
    ],

    // Module hooks
    'hooks' => [
        'system.page.footer' => [
            'function' => 'publisher_page_footer'
        ],
        'user.profile.view' => [
            'function' => 'publisher_user_articles'
        ]
    ],

    // Configuration items
    'config' => [
        [
            'name' => 'items_per_page',
            'title' => '_MI_PUBLISHER_ITEMS_PER_PAGE',
            'description' => '_MI_PUBLISHER_ITEMS_PER_PAGE_DESC',
            'formtype' => 'text',
            'valuetype' => 'int',
            'default' => '10'
        ],
        [
            'name' => 'enable_comments',
            'title' => '_MI_PUBLISHER_ENABLE_COMMENTS',
            'description' => '_MI_PUBLISHER_ENABLE_COMMENTS_DESC',
            'formtype' => 'yesno',
            'valuetype' => 'int',
            'default' => '1'
        ]
    ]
];

function xoops_module_install_publisher($module)
{
    // Installation logic
    return true;
}

function xoops_module_update_publisher($module)
{
    // Update logic
    return true;
}

function xoops_module_uninstall_publisher($module)
{
    // Uninstallation logic
    return true;
}
```

## Praktik Terbaik

1. **namespace Kelas Anda** - Gunakan namespace khusus module untuk menghindari konflik

2. **Gunakan handler** - Selalu gunakan kelas handler untuk operasi database

3. **Internasionalisasi Konten** - Gunakan konstanta bahasa untuk semua string yang dilihat pengguna

4. **Buat Skrip Instalasi** - Menyediakan skema SQL untuk tabel database

5. **Dokumen Kait** - Dokumentasikan dengan jelas kait apa yang disediakan module Anda

6. **Versi module Anda** - Tingkatkan nomor versi dengan rilis

7. **Uji Instalasi** - Uji proses install/uninstall secara menyeluruh

8. **Menangani Izin** - Periksa izin pengguna sebelum mengizinkan tindakan

## Contoh module Lengkap

```php
<?php
/**
 * Custom Article Module Main Page
 */

include __DIR__ . '/include/common.inc.php';

// Get module instance
$module = xoops_getModuleByDirname('mymodule');

// Check if module is active
if (!$module) {
    die('Module not found');
}

// Get module configuration
$itemsPerPage = $module->getConfig('items_per_page');

// Get item handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Fetch items with pagination
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$items = $itemHandler->getObjects($criteria, $itemsPerPage);

// Prepare template
$xoopsTpl->assign('items', $items);
$xoopsTpl->assign('module_name', $module->getName());
$xoopsTpl->display($module->getPath() . '/templates/user/index.tpl');
```

## Dokumentasi Terkait

- ../Kernel/Kernel-Classes - Inisialisasi kernel dan layanan core
- ../Template/Template-System - template module dan integrasi theme
- ../Database/QueryBuilder - Pembuatan kueri basis data
- ../Core/XoopsObject - Kelas objek dasar

---

*Lihat juga: [Panduan Pengembangan module XOOPS](https://github.com/XOOPS/XoopsCore27/wiki/Module-Development)*
