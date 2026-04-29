---
title: "Modul FAQ"
description: "Soalan lazim tentang XOOPS modul"
---
# Modul Soalan Lazim

> Soalan dan jawapan biasa tentang XOOPS modul, pemasangan dan pengurusan.

---

## Pemasangan & Pengaktifan

### S: Bagaimanakah cara saya memasang modul dalam XOOPS?

**J:**
1. Muat turun fail zip modul
2. Pergi ke XOOPS Pentadbir > Modul > Urus Modul
3. Klik "Semak imbas" dan pilih fail zip
4. Klik "Muat naik"
5. Modul muncul dalam senarai (biasanya dinyahaktifkan)
6. Klik ikon pengaktifan untuk mendayakannya

Sebagai alternatif, ekstrak zip terus ke dalam `/xoops_root/modules/` dan navigasi ke panel pentadbir.

---

### S: Muat naik modul gagal dengan "Kebenaran ditolak"

**J:** Ini ialah isu kebenaran fail:
```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```
Lihat Kegagalan Pemasangan Modul untuk mendapatkan butiran lanjut.

---

### S: Mengapa saya tidak dapat melihat modul dalam panel pentadbir selepas pemasangan?

**J:** Semak perkara berikut:

1. **Modul tidak diaktifkan** - Klik ikon mata dalam senarai Modul
2. **Halaman pentadbir tiada** - Modul mesti mempunyai `hasAdmin = 1` dalam xoopsversion.php
3. **Language files missing** - Need `language/english/admin.php`
4. **Cache tidak dibersihkan** - Kosongkan cache dan muat semula penyemak imbas
```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```
---

### S: Bagaimanakah cara saya menyahpasang modul?

**J:**
1. Pergi ke XOOPS Pentadbir > Modul > Urus Modul
2. Nyahaktifkan modul (klik ikon mata)
3. Klik ikon trash/delete
4. Padam folder modul secara manual jika anda mahu pengalihan keluar sepenuhnya:
```bash
rm -rf /path/to/xoops/modules/modulename
```
---

## Pengurusan Modul

### S: Apakah perbezaan antara melumpuhkan dan menyahpasang?

**J:**
- **Lumpuhkan**: Nyahaktifkan modul (klik ikon mata). Jadual pangkalan data kekal.
- **Nyahpasang**: Alih keluar modul. Memadam jadual pangkalan data dan mengalih keluar daripada senarai.

Untuk benar-benar mengalih keluar, padamkan juga folder:
```bash
rm -rf modules/modulename
```
---

### S: Bagaimanakah cara saya menyemak sama ada modul dipasang dengan betul?

**J:** Gunakan skrip nyahpepijat:
```php
<?php
// Create admin/debug_modules.php
require_once XOOPS_ROOT_PATH . '/mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

echo "<h1>Module Debug</h1>";

// List all modules
$module_handler = xoops_getHandler('module');
$modules = $module_handler->getObjects();

foreach ($modules as $module) {
    echo "<h2>" . $module->getVar('name') . "</h2>";
    echo "Status: " . ($module->getVar('isactive') ? "Active" : "Inactive") . "<br>";
    echo "Directory: " . $module->getVar('dirname') . "<br>";
    echo "Mid: " . $module->getVar('mid') . "<br>";
    echo "Version: " . $module->getVar('version') . "<br>";
}
?>
```
---

### S: Bolehkah saya menjalankan berbilang versi modul yang sama?

**J:** Tidak, XOOPS tidak menyokong ini secara asli. Walau bagaimanapun, anda boleh:

1. Buat salinan dengan nama direktori yang berbeza: `mymodule` dan `mymodule2`
2. Kemas kini diname dalam kedua-dua modul' xoopsversion.php
3. Ensure unique database table names

Ini tidak disyorkan kerana mereka berkongsi kod yang sama.

---

## Konfigurasi Modul

### S: Di manakah saya boleh mengkonfigurasi tetapan modul?

**J:**
1. Pergi ke XOOPS Admin > Modules
2. Klik ikon settings/gear di sebelah modul
3. Konfigurasikan pilihan

Tetapan disimpan dalam jadual `xoops_config`.

**Akses dalam kod:**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```
---

### S: Bagaimanakah cara saya menentukan pilihan konfigurasi modul?

**J:** Dalam xoopsversion.php:
```php
<?php
$modversion['config'] = [
    [
        'name' => 'items_per_page',
        'title' => '_AM_MYMODULE_ITEMS_PER_PAGE',
        'description' => '_AM_MYMODULE_ITEMS_PER_PAGE_DESC',
        'formtype' => 'text',
        'valuetype' => 'int',
        'default' => 10
    ],
    [
        'name' => 'enable_feature',
        'title' => '_AM_MYMODULE_ENABLE_FEATURE',
        'description' => '_AM_MYMODULE_ENABLE_FEATURE_DESC',
        'formtype' => 'yesno',
        'valuetype' => 'bool',
        'default' => 1
    ]
];
?>
```
---

## Ciri-ciri Modul

### S: Bagaimanakah cara saya menambah halaman pentadbir pada modul saya?

**J:** Cipta struktur:
```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```
Dalam xoopsversion.php:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```
Buat `admin/index.php`:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```
---

### S: Bagaimanakah cara saya menambah fungsi carian pada modul saya?

**J:**
1. Tetapkan dalam xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```
2. Cipta `search.php`:
```php
<?php
function mymodule_search($queryArray, $andor, $limit, $offset) {
    // Search implementation
    $results = [];
    return $results;
}
?>
```
---

### S: Bagaimanakah cara saya menambah pemberitahuan pada modul saya?

**J:**
1. Tetapkan dalam xoopsversion.php:
```php
<?php
$modversion['hasNotification'] = 1;
$modversion['notification_categories'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
$modversion['notifications'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
?>
```
2. Pemberitahuan pencetus dalam kod:
```php
<?php
$notification_handler = xoops_getHandler('notification');
$notification_handler->triggerEvent(
    'item_published',
    $item_id,
    'Item published',
    'description'
);
?>
```
---

## Kebenaran Modul

### S: Bagaimanakah cara saya menetapkan kebenaran modul?

**J:**
1. Pergi ke XOOPS Pentadbir > Modul > Kebenaran Modul
2. Pilih modul
3. Pilih user/group dan tahap kebenaran
4. Jimat

**Dalam kod:**
```php
<?php
// Check if user can access module
if (!xoops_isUser()) {
    exit('Login required');
}

// Check specific permission
$mperm_handler = xoops_getHandler('member_permission');
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('mymodule');

if (!$mperm_handler->userCanAccess($module->mid())) {
    exit('Access denied');
}
?>
```
---

## Pangkalan Data Modul

### S: Di manakah jadual pangkalan data modul disimpan?

**J:** Semua dalam pangkalan data XOOPS utama, diawali dengan awalan jadual anda (biasanya `xoops_`):
```bash
# List all module tables
mysql> SHOW TABLES LIKE 'xoops_mymodule_%';

# Or in PHP
<?php
$result = $GLOBALS['xoopsDB']->query(
    "SHOW TABLES LIKE '" . XOOPS_DB_PREFIX . "mymodule_%'"
);
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>
```
---

### S: Bagaimanakah cara saya mengemas kini jadual pangkalan data modul?

**J:** Buat skrip kemas kini dalam modul anda:
```php
<?php
// modules/mymodule/update.php
require_once '../../mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

// Add new column
$sql = "ALTER TABLE `" . XOOPS_DB_PREFIX . "mymodule_items`
        ADD COLUMN `new_field` VARCHAR(255)";

if ($GLOBALS['xoopsDB']->query($sql)) {
    echo "✓ Updated successfully";
} else {
    echo "✗ Error: " . $GLOBALS['xoopsDB']->error;
}
?>
```
---

## Kebergantungan Modul

### S: Bagaimanakah cara saya menyemak sama ada modul yang diperlukan dipasang?

**J:**
```php
<?php
$module_handler = xoops_getHandler('module');

// Check if a module exists
$module = $module_handler->getByDirname('required_module');

if (!$module || !$module->getVar('isactive')) {
    die('Error: required_module is not installed or active');
}
?>
```
---

### S: Bolehkah modul bergantung pada modul lain?

**J:** Ya, isytiharkan dalam xoopsversion.php:
```php
<?php
$modversion['dependencies'] = [
    [
        'dirname' => 'required_module',
        'version_min' => '1.0',
        'version_max' => 0,  // 0 = unlimited
        'order' => 1
    ]
];
?>
```
---

## Menyelesaikan masalah

### S: Modul muncul dalam senarai tetapi tidak akan diaktifkan

**J:** Semak:
1. xoopsversion.php syntax - Use PHP linter:
```bash
php -l modules/mymodule/xoopsversion.php
```
2. Fail pangkalan data SQL:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```
3. Fail bahasa:
```bash
ls -la modules/mymodule/language/english/
```
Lihat Kegagalan Pemasangan Modul untuk diagnostik terperinci.

---

### S: Modul diaktifkan tetapi tidak dipaparkan di tapak utama

**J:**
1. Tetapkan `hasMain = 1` dalam xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```
2. Cipta `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```
---

### S: Modul menyebabkan "skrin putih kematian"

**J:** Dayakan penyahpepijatan untuk mencari ralat:
```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```
Semak log ralat:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```
Lihat Skrin Kematian Putih untuk penyelesaian.

---

## Prestasi

### S: Modul lambat, bagaimana cara saya mengoptimumkan?

**J:**
1. **Semak pertanyaan pangkalan data** - Gunakan pengelogan pertanyaan
2. **Data cache** - Gunakan cache XOOPS:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 hour
}
?>
```
3. **Optimumkan templat** - Elakkan gelung dalam templat
4. **Dayakan PHP cache opcode** - APCu, XDebug, dsb.

Lihat Prestasi FAQ untuk butiran lanjut.

---

## Pembangunan Modul

### S: Di manakah saya boleh mencari dokumentasi pembangunan modul?

**J:** Lihat:
- Panduan Pembangunan Modul
- Struktur Modul
- Mencipta Modul Pertama Anda

---

## Dokumentasi Berkaitan

- Kegagalan Pemasangan Modul
- Struktur Modul
- Prestasi FAQ
- Dayakan Mod Nyahpepijat

---

#XOOPS #modul #faq #penyelesaianmasalah