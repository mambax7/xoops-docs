---
title: "module FAQ"
description: "XOOPS modülleri hakkında sık sorulan sorular"
---
# module Sıkça Sorulan Sorular

> XOOPS modülleri, kurulumu ve yönetimi hakkında sık sorulan sorular ve yanıtlar.

---

## Kurulum ve Etkinleştirme

### S: XOOPS'ye nasıl module yüklerim?

**C:**
1. module zip dosyasını indirin
2. XOOPS Yönetici > modules > Modülleri Yönet'e gidin
3. "Gözat"a tıklayın ve zip dosyasını seçin
4. "Yükle"ye tıklayın
5. module listede görünür (genellikle devre dışıdır)
6. Etkinleştirmek için etkinleştirme simgesine tıklayın

Alternatif olarak, zip dosyasını doğrudan `/xoops_root/modules/`'ye çıkartın ve yönetici paneline gidin.

---

### S: module yükleme işlemi "İzin reddedildi" ile başarısız oluyor

**C:** Bu bir dosya izni sorunudur:
```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```
Daha fazla ayrıntı için bkz. module Kurulum Hataları.

---

### S: Kurulumdan sonra modülü neden yönetici panelinde göremiyorum?

**C:** Aşağıdakileri kontrol edin:

1. **module etkinleştirilmedi** - modules listesinde göz simgesine tıklayın
2. **Yönetici sayfası eksik** - Modülde xoopsversion.php dosyasında `hasAdmin = 1` bulunmalıdır
3. **Dil dosyaları eksik** - `language/english/admin.php` gerekiyor
4. **cache temizlenmedi** - Önbelleği temizleyin ve tarayıcıyı yenileyin
```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```
---

### S: Bir modülü nasıl kaldırabilirim?

**C:**
1. XOOPS Yönetici > modules > Modülleri Yönet'e gidin
2. Modülü devre dışı bırakın (göz simgesine tıklayın)
3. trash/delete simgesine tıklayın
4. Tamamen kaldırmak istiyorsanız module klasörünü manuel olarak silin:
```bash
rm -rf /path/to/xoops/modules/modulename
```
---

## module Yönetimi

### S: Devre dışı bırakma ile kaldırma arasındaki fark nedir?

**C:**
- **Devre Dışı Bırak**: Modülü devre dışı bırakın (göz simgesine tıklayın). database tabloları kalır.
- **Kaldırma**: Modülü çıkarın. database tablolarını siler ve listeden kaldırır.

Gerçekten kaldırmak için klasörü de silin:
```bash
rm -rf modules/modulename
```
---

### S: Bir modülün düzgün şekilde kurulup kurulmadığını nasıl kontrol ederim?

**C:** Hata ayıklama komut dosyasını kullanın:
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

### S: Aynı modülün birden fazla sürümünü çalıştırabilir miyim?

**C:** Hayır, XOOPS bunu yerel olarak desteklemiyor. Ancak şunları yapabilirsiniz:

1. Farklı bir dizin adıyla bir kopya oluşturun: `mymodule` ve `mymodule2`
2. Her iki modülün xoopsversion.php dosyasındaki dizin adını güncelleyin
3. Ensure unique database table names

Aynı kodu paylaştıklarından bu önerilmez.

---

## module Yapılandırması

### Q: Where do I configure module settings?

**C:**
1. Go to XOOPS Admin > Modules
2. Modülün yanındaki settings/gear simgesine tıklayın
3. Tercihleri yapılandırın

Ayarlar `xoops_config` tablosunda saklanır.

**Kodla erişim:**
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

### S: module yapılandırma seçeneklerini nasıl tanımlarım?

**A:** xoopsversion.php'de:
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

## module Özellikleri

### S: Modülüme nasıl yönetici sayfası eklerim?

**A:** Yapıyı oluşturun:
```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```
xoopsversion.php'de:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```
`admin/index.php` oluşturun:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```
---

### S: Modülüme arama işlevini nasıl eklerim?

**C:**
1. xoopsversion.php dosyasında ayarlayın:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```
2. `search.php` oluşturun:
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

### S: Modülüme nasıl bildirim eklerim?

**C:**
1. xoopsversion.php dosyasında ayarlayın:
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
2. Kodda bildirimi tetikleyin:
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

## module İzinleri

### S: module izinlerini nasıl ayarlarım?

**C:**
1. XOOPS Yönetici > modules > module İzinleri'ne gidin
2. Modülü seçin
3. user/group'yi ve izin düzeyini seçin
4. Kaydet

**Kodda:**
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

## module database

### S: module database tabloları nerede saklanıyor?

**A:** Hepsi ana XOOPS veritabanında, tablo ön ekinizle başlar (genellikle `xoops_`):
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

### S: module database tablolarını nasıl güncellerim?

**C:** Modülünüzde bir güncelleme komut dosyası oluşturun:
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

## module Bağımlılıkları

### S: Gerekli modüllerin kurulu olup olmadığını nasıl kontrol edebilirim?

**A:**
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

### S: modules diğer modüllere bağlı olabilir mi?

**C:** Evet, xoopsversion.php'de şunu bildirin:
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

## Sorun Giderme

### S: module listede görünüyor ancak etkinleştirilmiyor

**C:** Kontrol edin:
1. xoopsversion.php söz dizimi - PHP linter'ı kullanın:
```bash
php -l modules/mymodule/xoopsversion.php
```
2. database SQL dosyası:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```
3. Dil dosyaları:
```bash
ls -la modules/mymodule/language/english/
```
Ayrıntılı tanılama için module Kurulum Hataları bölümüne bakın.

---

### S: module etkinleştirildi ancak ana sitede görünmüyor

**C:**
1. xoopsversion.php dosyasında `hasMain = 1` değerini ayarlayın:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```
2. `modules/mymodule/index.php` oluşturun:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```
---

### S: module "beyaz ölüm ekranına" neden oluyor

**A:** Hatayı bulmak için hata ayıklamayı etkinleştirin:
```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```
Hata günlüğünü kontrol edin:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```
Çözümler için Ölümün Beyaz Ekranına bakın.

---

## Performans

### S: module yavaş, nasıl optimize edebilirim?

**C:**
1. **database sorgularını kontrol edin** - Sorgu günlüğünü kullanın
2. **Verileri önbelleğe al** - XOOPS önbelleğini kullanın:
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
3. **Şablonları optimize edin** - Şablonlardaki döngülerden kaçının
4. **PHP opcode önbelleğini etkinleştirin** - APCu, XDebug, vb.

Daha fazla ayrıntı için Performans FAQ'ye bakın.

---

## module Geliştirme

### S: module geliştirme belgelerini nerede bulabilirim?

**C:** Bakınız:
- module Geliştirme Kılavuzu
- module Yapısı
- İlk Modülünüzü Oluşturma

---

## İlgili Belgeler

- module Kurulum Hataları
- module Yapısı
- Performans FAQ
- Hata Ayıklama Modunu Etkinleştir

---

#xoops #modules #sss #sorun giderme