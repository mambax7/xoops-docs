---
title: "En İyi Güvenlik Uygulamaları"
description: "XOOPS module geliştirme için kapsamlı güvenlik kılavuzu"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Güvenlik APIs sürümler arasında kararlıdır]
Burada belgelenen güvenlik uygulamaları ve APIs, hem XOOPS 2.5.x hem de XOOPS 4.0.x'te çalışır. Temel güvenlik sınıfları (`XoopsSecurity`, `MyTextSanitizer`) sabit kalır.
:::

Bu belge, XOOPS module geliştiricileri için kapsamlı güvenlik en iyi uygulamalarını sağlar. Bu yönergeleri takip etmek, modüllerinizin güvenli olduğundan emin olmanıza ve XOOPS kurulumlarında güvenlik açıklarına yol açmamasına yardımcı olacaktır.

## Güvenlik İlkeleri

Her XOOPS geliştiricisinin şu temel güvenlik ilkelerine uyması gerekir:

1. **Derinlemesine Savunma**: Birden fazla güvenlik kontrolü katmanı uygulayın
2. **En Az Ayrıcalık**: Yalnızca gerekli minimum erişim haklarını sağlayın
3. **Giriş Doğrulaması**: user girişine asla güvenmeyin
4. **Varsayılan Olarak Güvenli**: Güvenlik varsayılan yapılandırma olmalıdır
5. **Basit Tutun**: Karmaşık sistemlerin güvenliğinin sağlanması daha zordur

## İlgili Belgeler

- CSRF-Koruma - Token sistemi ve XoopsSecurity sınıfı
- Giriş Temizleme - MyTextSanitizer ve doğrulama
- SQL-Enjeksiyon-Önleme - database güvenliği uygulamaları

## Hızlı Referans Kontrol Listesi

Modülünüzü serbest bırakmadan önce şunları doğrulayın:

- [ ] Tüm formlar XOOPS jetonlarını içerir
- [ ] Tüm user girdileri doğrulandı ve temizlendi
- [ ] Tüm çıktıların düzgün şekilde atlanması
- [ ] Tüm database sorguları parametreli ifadeler kullanır
- [ ] Dosya yüklemeleri düzgün bir şekilde doğrulandı
- [ ] Kimlik doğrulama ve yetkilendirme kontrolleri mevcut
- [ ] Hata işleme hassas bilgileri ortaya çıkarmaz
- [ ] Hassas konfigürasyon korunmaktadır
- [ ] Üçüncü taraf kitaplıkları güncel
- [ ] Güvenlik testi gerçekleştirildi

## Kimlik Doğrulama ve Yetkilendirme

### user Kimlik Doğrulamasını Kontrol Etme
```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```
### user İzinlerini Kontrol Etme
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
### module İzinlerini Ayarlama
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
## Oturum Güvenliği

### Oturum Yönetimi En İyi Uygulamaları

1. Oturumda hassas bilgileri saklamayın
2. login/privilege değişikliklerinden sonra oturum kimliklerini yeniden oluşturun
3. Kullanmadan önce oturum verilerini doğrulayın
```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```
### Oturum Sabitlemesini Önleme
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
## Dosya Yükleme Güvenliği

### Dosya Yüklemelerini Doğrulama
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
### XOOPS Yükleyiciyi Kullanma
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
### Yüklenen Dosyaları Güvenli Bir Şekilde Saklama
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
## Hata İşleme ve Günlüğe Kaydetme

### Güvenli Hata İşleme
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
### Güvenlik Olaylarını Günlüğe Kaydetme
```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```
## Yapılandırma Güvenliği

### Hassas Yapılandırmanın Saklanması
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
### Yapılandırma Dosyalarını Koruma

Yapılandırma dosyalarını korumak için `.htaccess` kullanın:
```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```
## Third-Party Libraries

### Selecting Libraries

1. Aktif olarak bakımı yapılan kitaplıkları seçin
2. Güvenlik açıklarını kontrol edin
3. Kütüphanenin lisansının XOOPS ile uyumlu olduğunu doğrulayın

### Updating Libraries
```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```
### Kitaplıkları Yalıtmak
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
## Güvenlik Testi

### Manuel Test Kontrol Listesi

1. Tüm formları geçersiz girişle test edin
2. Kimlik doğrulama ve yetkilendirmeyi atlamaya çalışın
3. Dosya yükleme işlevini kötü amaçlı dosyalarla test edin
4. Tüm çıktılarda XSS güvenlik açıklarını kontrol edin
5. Tüm database sorgularında SQL enjeksiyonunu test edin

### Otomatik Test

Güvenlik açıklarını taramak için otomatik araçları kullanın:

1. Statik kod analiz araçları
2. Web uygulaması tarayıcıları
3. Üçüncü taraf kütüphaneler için bağımlılık denetleyicileri

## Çıkış Çıkışı

### HTML Bağlam
```php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```
### JavaScript Bağlam
```php
// For data used in JavaScript
echo json_encode($variable);

// For inline JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```
### URL Bağlam
```php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```
### template Değişkenleri
```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```
## Kaynaklar

- [OWASP İlk On](https://owasp.org/www-project-top-ten/)
- [PHP Güvenlik Hile Sayfası](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS Belgeler](https://xoops.org/)

---

#güvenlik #en iyi uygulamalar #xoops #module geliştirme #kimlik doğrulama #yetkilendirme