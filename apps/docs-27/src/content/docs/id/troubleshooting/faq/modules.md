---
title: "FAQ module"
description: "Pertanyaan umum tentang module XOOPS"
---

# module Pertanyaan yang Sering Diajukan

> Pertanyaan dan jawaban umum tentang module, instalasi, dan manajemen XOOPS.

---

## Instalasi & Aktivasi

### Q: Bagaimana cara menginstal module di XOOPS?

**J:**
1. Unduh file zip module
2. Buka Admin XOOPS > module > Kelola module
3. Klik "Jelajahi" dan pilih file zip
4. Klik "Unggah"
5. module muncul dalam daftar (biasanya dinonaktifkan)
6. Klik ikon aktivasi untuk mengaktifkannya

Alternatifnya, ekstrak zip langsung ke `/xoops_root/modules/` dan navigasikan ke panel admin.

---

### T: Pengunggahan module gagal dengan "Izin ditolak"

**A:** Ini adalah masalah izin file:

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

Lihat Kegagalan Instalasi module untuk lebih jelasnya.

---

### Q: Mengapa saya tidak dapat melihat module di panel admin setelah instalasi?

**J:** Periksa hal berikut:

1. **module tidak diaktifkan** - Klik ikon mata di daftar module
2. **Halaman admin tidak ada** - module harus memiliki `hasAdmin = 1` di xoopsversion.php
3. **File bahasa hilang** - Perlu `language/english/admin.php`
4. **Cache tidak dibersihkan** - Hapus cache dan segarkan browser

```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### T: Bagaimana cara menghapus instalasi module?

**J:**
1. Buka Admin XOOPS > module > Kelola module
2. Nonaktifkan module (klik ikon mata)
3. Klik ikon trash/delete
4. Hapus folder module secara manual jika Anda ingin penghapusan total:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## Manajemen module

### T: Apa perbedaan antara menonaktifkan dan menghapus instalasi?

**J:**
- **Nonaktifkan**: Menonaktifkan module (klik ikon mata). Tabel database tetap ada.
- **Copot pemasangan**: Lepaskan module. Menghapus tabel database dan menghapus dari daftar.

Untuk benar-benar menghapus, hapus juga foldernya:
```bash
rm -rf modules/modulename
```

---

### T: Bagaimana cara memeriksa apakah module terpasang dengan benar?

**A:** Gunakan skrip debug:

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

### T: Bisakah saya menjalankan beberapa versi dari module yang sama?

**A:** Tidak, XOOPS tidak mendukung ini secara asli. Namun, Anda dapat:

1. Buat salinan dengan nama direktori berbeda: `mymodule` dan `mymodule2`
2. Perbarui nama dir di xoopsversion.php kedua module
3. Pastikan nama tabel database unik

Ini tidak disarankan karena keduanya berbagi kode yang sama.

---

## Konfigurasi module

### T: Di mana saya dapat mengonfigurasi pengaturan module?

**J:**
1. Buka Admin XOOPS > module
2. Klik ikon settings/gear di sebelah module
3. Konfigurasikan preferensi

Pengaturan disimpan di tabel `xoops_config`.

**Akses dalam kode:**
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

### T: Bagaimana cara menentukan opsi konfigurasi module?

**J:** Di xoopsversion.php:

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

## Fitur module

### T: Bagaimana cara menambahkan halaman admin ke module saya?

**A:** Buat struktur:

```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```

Di xoopsversion.php:
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

### T: Bagaimana cara menambahkan fungsi pencarian ke module saya?

**J:**
1. Diatur di xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. Buat `search.php`:
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

### T: Bagaimana cara menambahkan notifikasi ke module saya?

**J:**
1. Diatur di xoopsversion.php:
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

2. Memicu notifikasi dalam kode:
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

## Izin module

### T: Bagaimana cara mengatur izin module?

**J:**
1. Buka Admin XOOPS > module > Izin module
2. Pilih module
3. Pilih user/group dan tingkat izin
4. Simpan

**Dalam kode:**
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

## module Basis Data

### T: Di mana tabel database module disimpan?

**A:** Semua di database utama XOOPS, diawali dengan awalan tabel Anda (biasanya `xoops_`):

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

### T: Bagaimana cara memperbarui tabel database module?

**A:** Buat skrip pembaruan di module Anda:

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

## Ketergantungan module

### T: Bagaimana cara memeriksa apakah module yang diperlukan sudah diinstal?

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

### T: Apakah module dapat bergantung pada module lain?

**A:** Ya, nyatakan di xoopsversion.php:

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

## Pemecahan masalah

### Q: module muncul di daftar tetapi tidak aktif

**J:** Periksa:
1. Sintaks xoopsversion.php - Gunakan linter PHP:
```bash
php -l modules/mymodule/xoopsversion.php
```
2. File basis data SQL:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. File bahasa:
```bash
ls -la modules/mymodule/language/english/
```

Lihat Kegagalan Pemasangan module untuk diagnostik terperinci.

---

### Q: module diaktifkan tetapi tidak muncul di situs utama

**J:**
1. Tetapkan `hasMain = 1` di xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. Buat `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

### T: module menyebabkan "layar putih kematian"

**A:** Aktifkan debugging untuk menemukan kesalahan:

```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

Periksa log kesalahan:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

Lihat Layar Putih Kematian untuk solusinya.

---

## Kinerja

### Q: module lambat, bagaimana cara mengoptimalkannya?

**J:**
1. **Periksa kueri basis data** - Gunakan pencatatan kueri
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

3. **Optimalkan template** - Hindari loop dalam template
4. **Aktifkan cache opcode PHP** - APCu, XDebug, dll.

Lihat FAQ Kinerja untuk lebih jelasnya.

---

## Pengembangan module

### T: Di mana saya dapat menemukan dokumentasi pengembangan module?

**J:** Lihat:
- Panduan Pengembangan module
- Struktur module
- Membuat module Pertama Anda

---

## Dokumentasi Terkait

- Kegagalan Instalasi module
- Struktur module
- FAQ Kinerja
- Aktifkan Mode Debug

---

#xoops #modules #faq #pemecahan masalah
