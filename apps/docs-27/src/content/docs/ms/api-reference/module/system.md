---
title: "Sistem Modul XOOPS"
description: "Kitaran hayat modul, kelas XoopsModule, modul cangkuk modul installation/uninstallation, dan pengurusan modul"
---
Sistem Modul XOOPS menyediakan rangka kerja lengkap untuk membangun, memasang, mengurus dan melanjutkan fungsi modul. Modul ialah pakej serba lengkap yang memanjangkan XOOPS dengan ciri dan keupayaan tambahan.## Seni Bina Modul
```
mermaid
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
## Struktur ModulStruktur direktori modul XOOPS standard:
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
## Kelas XoopsModuleKelas XoopsModule mewakili modul XOOPS yang dipasang.### Gambaran Keseluruhan Kelas
```
php
namespace XOOPS\Core\Module;

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
### Hartanah| Hartanah | Taip | Penerangan |
|----------|------|-------------|
| `$moduleid` | int | ID modul unik |
| `$name` | rentetan | Nama paparan modul |
| `$dirname` | rentetan | Nama direktori modul |
| `$version` | rentetan | Versi modul semasa |
| `$description` | rentetan | Penerangan modul |
| `$config` | tatasusunan | Konfigurasi modul |
| `$blocks` | tatasusunan | Blok modul |
| `$adminPages` | tatasusunan | Halaman panel pentadbir |
| `$userPages` | tatasusunan | Halaman yang menghadap pengguna |### Pembina
```
php
public function __construct()
```
Mencipta contoh modul baharu dan memulakan pembolehubah.### Kaedah Teras#### getNameMendapat nama paparan modul.
```
php
public function getName(): string
```
**Pemulangan:** `string` - Nama paparan modul**Contoh:**
```
php
$module = new XoopsModule();
$module->setVar('name', 'Publisher');
echo $module->getName(); // "Publisher"
```
#### getDirnameMendapat nama direktori modul.
```
php
public function getDirname(): string
```
**Pemulangan:** `string` - Nama direktori modul**Contoh:**
```
php
echo $module->getDirname(); // "publisher"
```
#### getVersionMendapat versi modul semasa.
```
php
public function getVersion(): string
```
**Pemulangan:** `string` - Rentetan versi**Contoh:**
```
php
echo $module->getVersion(); // "2.1.0"
```
#### getDescriptionMendapat penerangan modul.
```
php
public function getDescription(): string
```
**Pemulangan:** `string` - Perihalan modul**Contoh:**
```
php
$desc = $module->getDescription();
```
#### getConfigMendapatkan semula konfigurasi modul.
```
php
public function getConfig(string $key = null): mixed
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$key` | rentetan | Kekunci konfigurasi (null untuk semua) |**Pemulangan:** `mixed` - Nilai konfigurasi atau tatasusunan**Contoh:**
```
php
$config = $module->getConfig();
$itemsPerPage = $module->getConfig('items_per_page');
```
#### setConfigMenetapkan konfigurasi modul.
```
php
public function setConfig(string $key, mixed $value): void
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$key` | rentetan | Kekunci konfigurasi |
| `$value` | bercampur | Nilai konfigurasi |**Contoh:**
```
php
$module->setConfig('items_per_page', 20);
$module->setConfig('enable_cache', true);
```
#### getPathMendapat laluan sistem fail penuh ke modul.
```
php
public function getPath(): string
```
**Pemulangan:** `string` - Laluan direktori modul mutlak**Contoh:**
```
php
$path = $module->getPath(); // "/var/www/XOOPS/modules/publisher"
$classPath = $module->getPath() . '/class';
```
#### getUrlMendapatkan URL ke modul.
```
php
public function getUrl(): string
```
**Pemulangan:** `string` - URL Modul**Contoh:**
```
php
$url = $module->getUrl(); // "http://example.com/modules/publisher"
```
## Proses Pemasangan Modul### Fungsi xoops_module_installFungsi pemasangan modul yang ditakrifkan dalam `xoops_version.php`:
```
php
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
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$module` | XoopsModule | Modul sedang dipasang |**Pulangan:** `bool` - Benar apabila berjaya, salah apabila gagal**Contoh:**
```
php
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
### Fungsi xoops_module_uninstallFungsi penyahpasangan modul:
```
php
function xoops_module_uninstall_modulename($module)
{
    // Drop database tables
    // Remove uploaded files
    // Clean up configuration

    return true;
}
```
**Contoh:**
```
php
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
## Cangkuk ModulCangkuk modul membolehkan modul disepadukan dengan modul lain dan sistem.### Pengisytiharan CangkukDalam `xoops_version.php`:
```
php
$modversion['hooks'] = [
    'system.page.footer' => [
        'function' => 'publisher_page_footer'
    ],
    'user.profile.view' => [
        'function' => 'publisher_user_articles'
    ],
];
```
### Pelaksanaan Cangkuk
```
php
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
### Cangkuk Sistem Tersedia| Cangkuk | Parameter | Penerangan |
|------|-----------|-------------|
| `system.page.header` | Tiada | Output pengepala halaman |
| `system.page.footer` | Tiada | Output pengaki halaman |
| `user.login.success` | $user objek | Selepas log masuk pengguna |
| `user.logout` | $user objek | Selepas pengguna log keluar |
| `user.profile.view` | $user_id | Melihat profil pengguna |
| `module.install` | $module objek | Pemasangan modul |
| `module.uninstall` | $module objek | Penyahpasangan modul |## Perkhidmatan Pengurus ModulPerkhidmatan ModuleManager mengendalikan operasi modul.### Kaedah#### getModuleMendapatkan semula modul mengikut nama.
```
php
public function getModule(string $dirname): ?XoopsModule
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$dirname` | rentetan | Nama direktori modul |**Pemulangan:** `?XoopsModule` - Contoh modul atau batal**Contoh:**
```
php
$moduleManager = $kernel->getService('module');
$publisher = $moduleManager->getModule('publisher');
if ($publisher) {
    echo $publisher->getName();
}
```
#### getAllModulesMendapat semua modul yang dipasang.
```
php
public function getAllModules(bool $activeOnly = true): array
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$activeOnly` | bool | Hanya kembalikan modul aktif |**Pemulangan:** `array` - Tatasusunan objek XoopsModule**Contoh:**
```
php
$activeModules = $moduleManager->getAllModules(true);
foreach ($activeModules as $module) {
    echo $module->getName() . " - " . $module->getVersion() . "\n";
}
```
#### ialahModuleActiveMenyemak sama ada modul aktif.
```
php
public function isModuleActive(string $dirname): bool
```
**Contoh:**
```
php
if ($moduleManager->isModuleActive('publisher')) {
    // Publisher module is active
}
```
#### activateModuleMengaktifkan modul.
```
php
public function activateModule(string $dirname): bool
```
**Contoh:**
```
php
if ($moduleManager->activateModule('publisher')) {
    echo "Publisher activated";
}
```
#### nyahaktifkanModulMenyahaktifkan modul.
```
php
public function deactivateModule(string $dirname): bool
```
**Contoh:**
```
php
if ($moduleManager->deactivateModule('publisher')) {
    echo "Publisher deactivated";
}
```
## Konfigurasi Modul (xoops_version.php)Contoh manifes modul lengkap:
```
php
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
## Amalan Terbaik1. **Ruang Nama Kelas Anda** - Gunakan ruang nama khusus modul untuk mengelakkan konflik2. **Gunakan Pengendali** - Sentiasa gunakan kelas pengendali untuk operasi pangkalan data3. **Mengantarabangsakan Kandungan** - Gunakan pemalar bahasa untuk semua rentetan yang dihadapi pengguna4. **Buat Skrip Pemasangan** - Sediakan skema SQL untuk jadual pangkalan data5. **Cangkuk Dokumen** - Dokumen dengan jelas apa cangkuk yang disediakan oleh modul anda6. **Versi Modul Anda** - Tambah nombor versi dengan keluaran7. **Pemasangan Ujian** - Uji proses install/uninstall dengan teliti8. **Kendalikan Kebenaran** - Semak kebenaran pengguna sebelum membenarkan tindakan## Contoh Modul Lengkap
```
php
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
## Dokumentasi Berkaitan- ../Kernel/Kernel-Classes - Inisialisasi kernel dan perkhidmatan teras
- ../Template/Template-System - Templat modul dan penyepaduan tema
- ../Database/QueryBuilder - Pembinaan pertanyaan pangkalan data
- ../Core/XoopsObject - Kelas objek asas---

*Lihat juga: [Panduan Pembangunan Modul XOOPS](https://github.com/XOOPS/XoopsCore27/wiki/Module-Development)*