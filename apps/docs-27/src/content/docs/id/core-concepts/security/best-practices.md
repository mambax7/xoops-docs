---
title: "Praktik Terbaik Keamanan"
description: "Panduan keamanan komprehensif untuk pengembangan module XOOPS"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[API Keamanan stabil di seluruh versi]
Praktik keamanan dan API yang didokumentasikan di sini berfungsi di XOOPS 2.5.x dan XOOPS 4.0.x. Kelas keamanan core (`XoopsSecurity`, `MyTextSanitizer`) tetap stabil.
:::

Dokumen ini memberikan praktik terbaik keamanan komprehensif untuk pengembang module XOOPS. Mengikuti panduan ini akan membantu memastikan bahwa module Anda aman dan tidak menimbulkan kerentanan pada instalasi XOOPS.

## Prinsip Keamanan

Setiap pengembang XOOPS harus mengikuti prinsip keamanan dasar berikut:

1. **Pertahanan Mendalam**: Menerapkan kontrol keamanan berlapis
2. **Hak Istimewa Terkecil**: Hanya memberikan hak akses minimum yang diperlukan
3. **Validasi Input**: Jangan pernah mempercayai input pengguna
4. **Aman secara Default**: Keamanan harus menjadi konfigurasi default
5. **Tetap Sederhana**: Sistem yang kompleks lebih sulit diamankan

## Dokumentasi Terkait

- CSRF-Protection - Sistem token dan kelas XoopsSecurity
- Sanitasi Masukan - MyTextSanitizer dan validasi
- SQL-Pencegahan Injeksi - Praktik keamanan basis data

## Daftar Periksa Referensi Cepat

Sebelum merilis module Anda, verifikasi:

- [ ] Semua formulir termasuk token XOOPS
- [ ] Semua masukan pengguna divalidasi dan dibersihkan
- [ ] Semua output di-escape dengan benar
- [ ] Semua kueri basis data menggunakan pernyataan berparameter
- [ ] Unggahan file divalidasi dengan benar
- [ ] Pemeriksaan autentikasi dan otorisasi telah dilakukan
- [ ] Penanganan kesalahan tidak mengungkapkan informasi sensitif
- [ ] Konfigurasi sensitif dilindungi
- [ ] Perpustakaan pihak ketiga sudah diperbarui
- [ ] Pengujian keamanan telah dilakukan

## Otentikasi dan Otorisasi

### Memeriksa Otentikasi Pengguna

```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Memeriksa Izin Pengguna

```php
// Check if user has permission to access this module
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// Check specific permission
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Menyiapkan Izin module

```php
// Create permission in install/update function
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// Add permission for all groups
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```

## Keamanan Sesi

### Praktik Terbaik Penanganan Sesi

1. Jangan menyimpan informasi sensitif dalam sesi tersebut
2. Buat ulang ID sesi setelah login/privilege berubah
3. Validasi data sesi sebelum menggunakannya

```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```

### Mencegah Fiksasi Sesi

```php
// After successful login
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// On subsequent requests
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // Possible session hijacking attempt
    session_destroy();
    redirect_header('index.php', 3, 'Session error');
    exit();
}
```

## Keamanan Pengunggahan File

### Memvalidasi Unggahan File

```php
// Check if file was uploaded properly
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'File upload error');
    exit();
}

// Check file size
if ($_FILES['userfile']['size'] > 1000000) { // 1MB limit
    redirect_header('index.php', 3, 'File too large');
    exit();
}

// Check file type
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, 'Invalid file type');
    exit();
}

// Validate file extension
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, 'Invalid file extension');
    exit();
}
```

### Menggunakan Pengunggah XOOPS

```php
include_once XOOPS_ROOT_PATH . '/class/uploader.php';

$allowed_mimetypes = ['image/gif', 'image/jpeg', 'image/png'];
$maxsize = 1000000; // 1MB
$maxwidth = 1024;
$maxheight = 768;
$upload_dir = XOOPS_ROOT_PATH . '/uploads/mymodule';

$uploader = new XoopsMediaUploader(
    $upload_dir,
    $allowed_mimetypes,
    $maxsize,
    $maxwidth,
    $maxheight
);

if ($uploader->fetchMedia('userfile')) {
    $uploader->setPrefix('mymodule_');

    if ($uploader->upload()) {
        $filename = $uploader->getSavedFileName();
        // Save filename to database
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```

### Menyimpan File yang Diunggah dengan Aman

```php
// Define upload directory outside web root
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// Create directory if it doesn't exist
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Move uploaded file
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```

## Penanganan Kesalahan dan Pencatatan

### Penanganan Kesalahan Aman

```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('Operation failed');
    }
} catch (Exception $e) {
    // Log the error
    xoops_error($e->getMessage());

    // Display a generic error message to the user
    redirect_header('index.php', 3, 'An error occurred. Please try again later.');
    exit();
}
```

### Mencatat Peristiwa Keamanan

```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## Keamanan Konfigurasi

### Menyimpan Konfigurasi Sensitif

```php
// Define configuration path outside web root
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// Load configuration
if (file_exists($config_path)) {
    include $config_path;
} else {
    // Handle missing configuration
}
```

### Melindungi File Konfigurasi

Gunakan `.htaccess` untuk melindungi file konfigurasi:

```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## Perpustakaan Pihak Ketiga

### Memilih Perpustakaan

1. Pilih perpustakaan yang dipelihara secara aktif
2. Periksa kerentanan keamanan
3. Verifikasikan lisensi perpustakaan kompatibel dengan XOOPS

### Memperbarui Perpustakaan

```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### Mengisolasi Perpustakaan

```php
// Load library in a controlled way
function loadLibrary($file)
{
    $allowed = ['parser.php', 'formatter.php'];

    if (!in_array($file, $allowed)) {
        return false;
    }

    include_once XOOPS_ROOT_PATH . '/modules/mymodule/libraries/' . $file;
    return true;
}
```

## Pengujian Keamanan

### Daftar Periksa Pengujian Manual

1. Uji semua formulir dengan input yang tidak valid
2. Mencoba melewati otentikasi dan otorisasi
3. Uji fungsionalitas unggah file dengan file berbahaya
4. Periksa kerentanan XSS di semua output
5. Uji injeksi SQL di semua kueri database

### Pengujian Otomatis

Gunakan alat otomatis untuk memindai kerentanan:

1. Alat analisis kode statis
2. Pemindai aplikasi web
3. Pemeriksa ketergantungan untuk perpustakaan pihak ketiga

## Keluaran Keluar

### Konteks HTML

```php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### JavaScript Konteks

```php
// For data used in JavaScript
echo json_encode($variable);

// For inline JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```

### URL Konteks

```php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### Variabel template

```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## Sumber Daya

- [Sepuluh Besar OWASP](https://owasp.org/www-project-top-ten/)
- [Lembar Cheat Keamanan PHP](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [Dokumentasi XOOPS](https://xoops.org/)

---

#keamanan #praktik terbaik #xoops #pengembangan module #autentikasi #otorisasi
