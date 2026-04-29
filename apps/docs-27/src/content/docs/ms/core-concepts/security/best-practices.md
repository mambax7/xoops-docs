---
title: "Amalan Terbaik Keselamatan"
description: "Panduan keselamatan yang komprehensif untuk pembangunan modul XOOPS"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>:::tip[API Keselamatan adalah stabil merentas versi]
Amalan keselamatan dan API yang didokumenkan di sini berfungsi dalam kedua-dua XOOPS 2.5.x dan XOOPS 4.0.x. Kelas keselamatan teras (`XoopsSecurity`, `MyTextSanitizer`) kekal stabil.
:::Dokumen ini menyediakan amalan terbaik keselamatan yang komprehensif untuk pembangun modul XOOPS. Mengikuti garis panduan ini akan membantu memastikan modul anda selamat dan tidak memperkenalkan kelemahan pada pemasangan XOOPS.## Prinsip KeselamatanSetiap pembangun XOOPS harus mengikut prinsip keselamatan asas ini:1. **Pertahanan Dalam Kedalaman**: Laksanakan berbilang lapisan kawalan keselamatan
2. **Keistimewaan Paling Rendah**: Berikan hanya hak akses minimum yang diperlukan
3. **Pengesahan Input**: Jangan sekali-kali mempercayai input pengguna
4. **Secure by Default**: Keselamatan hendaklah konfigurasi lalai
5. **Keep It Simple**: Sistem yang kompleks lebih sukar untuk dilindungi## Dokumentasi Berkaitan- CSRF-Protection - Sistem token dan kelas XoopsSecurity
- Input-Sanitization - MyTextSanitizer dan pengesahan
- SQL-Injection-Prevention - Amalan keselamatan pangkalan data## Senarai Semak Rujukan PantasSebelum mengeluarkan modul anda, sahkan:- [ ] Semua borang termasuk token XOOPS
- [ ] Semua input pengguna disahkan dan dibersihkan
- [ ] Semua output dikeluarkan dengan betul
- [ ] Semua pertanyaan pangkalan data menggunakan pernyataan berparameter
- [ ] Muat naik fail disahkan dengan betul
- [ ] Semakan pengesahan dan kebenaran ada
- [ ] Ralat pengendalian tidak mendedahkan maklumat sensitif
- [ ] Konfigurasi sensitif dilindungi
- [ ] Perpustakaan pihak ketiga adalah terkini
- [ ] Ujian keselamatan telah dilakukan## Pengesahan dan Kebenaran### Menyemak Pengesahan Pengguna
```
php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```
### Menyemak Kebenaran Pengguna
```
php
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
### Menyediakan Kebenaran Modul
```
php
// Create permission in install/update function
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// Add permission for all groups
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```
## Keselamatan Sesi### Amalan Terbaik Pengendalian Sesi1. Jangan simpan maklumat sensitif dalam sesi
2. Jana semula ID sesi selepas perubahan login/privilege
3. Sahkan data sesi sebelum menggunakannya
```
php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```
### Menghalang Penetapan Sesi
```
php
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
## Keselamatan Muat Naik Fail### Mengesahkan Muat Naik Fail
```
php
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
### Menggunakan Pemuat Naik XOOPS
```
php
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
### Menyimpan Fail Yang Dimuat Naik Dengan Selamat
```
php
// Define upload directory outside web root
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// Create directory if it doesn't exist
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Move uploaded file
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```
## Ralat Pengendalian dan Pembalakan### Pengendalian Ralat Selamat
```
php
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
### Melog Peristiwa Keselamatan
```
php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```
## Keselamatan Konfigurasi### Menyimpan Konfigurasi Sensitif
```
php
// Define configuration path outside web root
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// Load configuration
if (file_exists($config_path)) {
    include $config_path;
} else {
    // Handle missing configuration
}
```
### Melindungi Fail KonfigurasiGunakan `.htaccess` untuk melindungi fail konfigurasi:
```
apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```
## Perpustakaan Pihak Ketiga### Memilih Perpustakaan1. Pilih perpustakaan yang diselenggara secara aktif
2. Semak kelemahan keselamatan
3. Sahkan lesen perpustakaan serasi dengan XOOPS### Mengemas kini Perpustakaan
```
php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```
### Mengasingkan Perpustakaan
```
php
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
## Ujian Keselamatan### Senarai Semak Ujian Manual1. Uji semua borang dengan input yang tidak sah
2. Percubaan untuk memintas pengesahan dan kebenaran
3. Uji fungsi muat naik fail dengan fail berniat jahat
4. Semak kelemahan XSS dalam semua output
5. Uji suntikan SQL dalam semua pertanyaan pangkalan data### Ujian AutomatikGunakan alat automatik untuk mengimbas kelemahan:1. Alat analisis kod statik
2. Pengimbas aplikasi web
3. Penyemak kebergantungan untuk perpustakaan pihak ketiga## Keluar Keluar### Konteks HTML
```
php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```
### Konteks JavaScript
```
php
// For data used in JavaScript
echo json_encode($variable);

// For inline JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```
### Konteks URL
```
php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```
### Pembolehubah Templat
```
php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```
## Sumber- [OWASP Sepuluh Teratas](https://owasp.org/www-project-top-ten/)
- [Helaian Penipuan Keselamatan PHP](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [Dokumentasi XOOPS](https://XOOPS.org/)---

#keselamatan #amalan terbaik #XOOPS #pembangunan modul #pengesahan #kebenaran