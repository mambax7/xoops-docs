---
title: "Modul FAQ"
description: "Pogosta vprašanja o XOOPS modulih"
---
# Modul Pogosta vprašanja

> Pogosta vprašanja in odgovori o XOOPS modulih, namestitvi in upravljanju.

---

## Namestitev in aktivacija

### V: Kako namestim modul v XOOPS?

**A:**
1. Prenesite datoteko zip modula
2. Pojdite na XOOPS Skrbnik > Moduli > Upravljanje modulov
3. Kliknite »Prebrskaj« in izberite datoteko zip
4. Kliknite »Naloži«
5. Modul se prikaže na seznamu (običajno je deaktiviran)
6. Kliknite ikono za aktiviranje, da ga omogočite

Druga možnost je, da razširite zip neposredno v `/xoops_root/modules/` in se pomaknete do skrbniške plošče.

---

### V: Nalaganje modula ne uspe z "Dovoljenje zavrnjeno"

**A:** To je težava z dovoljenjem datoteke:
```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```
Za več podrobnosti glejte Napake pri namestitvi modula.

---

### V: Zakaj po namestitvi ne vidim modula v skrbniški plošči?

**A:** Preverite naslednje:

1. **Modul ni aktiviran** - kliknite ikono očesa na seznamu modulov
2. **Manjka skrbniška stran** - Modul mora imeti `hasAdmin = 1` v različici XOOPS.php
3. **Language files missing** - Need `language/english/admin.php`
4. **Predpomnilnik ni počiščen** - Počistite predpomnilnik in osvežite brskalnik
```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```
---

### V: Kako odstranim modul?

**A:**
1. Pojdite na XOOPS Admin > Modules > Manage Modules
2. Deaktivirajte modul (kliknite ikono očesa)
3. Kliknite ikono trash/delete
4. Ročno izbrišite mapo modula, če želite popolno odstranitev:
```bash
rm -rf /path/to/xoops/modules/modulename
```
---

## Upravljanje modulov

### V: Kakšna je razlika med onemogočanjem in odstranitvijo?

**A:**
- **Onemogoči**: Deaktivirajte modul (kliknite ikono očesa). Tabele baze podatkov ostanejo.
- **Odstrani**: Odstranite modul. Izbriše tabele baze podatkov in odstrani s seznama.

Če želite resnično odstraniti, izbrišite tudi mapo:
```bash
rm -rf modules/modulename
```
---

### V: Kako preverim, ali je modul pravilno nameščen?

**A:** Uporabite skript za odpravljanje napak:
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

### V: Ali lahko izvajam več različic istega modula?

**O:** Ne, XOOPS tega izvorno ne podpira. Lahko pa:

1. Ustvarite kopijo z drugim imenom imenika: `mymodule` in `mymodule2`
2. Posodobite ime direktorija v različici XOOPS obeh modulov.php
3. Ensure unique database table names

To ni priporočljivo, saj imata isto kodo.

---

## Konfiguracija modula

### V: Kje lahko konfiguriram nastavitve modula?

**A:**
1. Pojdite na XOOPS Admin > Modules
2. Kliknite ikono settings/gear poleg modula
3. Konfigurirajte nastavitve

Nastavitve so shranjene v tabeli `xoops_config`.

**Dostop v kodi:**
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

### V: Kako definiram možnosti konfiguracije modula?

**A:** V xoopsversion.php:
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

## Funkcije modula

### V: Kako dodam skrbniško stran svojemu modulu?

**A:** Ustvarite strukturo:
```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```
V xoopsversion.php:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```
Ustvari `admin/index.php`:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```
---

### V: Kako svojemu modulu dodam funkcijo iskanja?

**A:**
1. Nastavite v xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```
2. Ustvarite `search.php`:
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

### V: Kako dodam obvestila svojemu modulu?

**A:**
1. Nastavite v xoopsversion.php:
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
2. Sproži obvestilo v kodi:
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

## Dovoljenja modula

### V: Kako nastavim dovoljenja za modul?

**A:**
1. Pojdite na XOOPS Admin > Modules > Module Permissions
2. Izberite modul
3. Izberite user/group in raven dovoljenja
4. Shrani

**V kodi:**
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

## Module Database

### V: Kje so shranjene tabele baze podatkov modulov?

**A:** Vse v glavni bazi podatkov XOOPS, s predpono vaše tabele (običajno `xoops_`):
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

### V: Kako posodobim tabele baze podatkov modulov?

**A:** Ustvarite posodobitveni skript v svojem modulu:
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

## Odvisnosti modula

### V: Kako preverim, ali so potrebni moduli nameščeni?

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

### V: Ali so lahko moduli odvisni od drugih modulov?

**A:** Da, prijavi v xoopsversion.php:
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

## Odpravljanje težav

### Q: Modul se pojavi na seznamu, vendar se ne aktivira

**A:** Preverite:
1. xoopsversion.php syntax - Use PHP linter:
```bash
php -l modules/mymodule/xoopsversion.php
```
2. Datoteka baze podatkov SQL:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```
3. Jezikovne datoteke:
```bash
ls -la modules/mymodule/language/english/
```
Za podrobno diagnostiko glejte Napake pri namestitvi modula.

---

### Q: Modul je aktiviran, vendar ni prikazan na glavnem mestu

**A:**
1. Nastavite `hasMain = 1` v xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```
2. Ustvarite `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```
---

### Q: Modul povzroča "bel zaslon smrti"

**A:** Omogočite odpravljanje napak, da poiščete napako:
```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```
Preverite dnevnik napak:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```
Za rešitve glejte Beli zaslon smrti.

---

## Zmogljivost

### V: Modul je počasen, kako optimiziram?

**A:**
1. **Preverite poizvedbe po bazi podatkov** - Uporabite beleženje poizvedb
2. **Podatki predpomnilnika** - Uporabite predpomnilnik XOOPS:
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
3. **Optimizirajte predloge** - Izogibajte se zankam v predlogah
4. **Omogoči predpomnilnik kode PHP** - APCu, XDebug itd.

Glejte Zmogljivost FAQ za več podrobnosti.

---

## Razvoj modula

### V: Kje lahko najdem dokumentacijo za razvoj modula?

**A:** Glej:
- Vodnik za razvoj modula
- Struktura modula
- Ustvarjanje vašega prvega modula

---

## Povezana dokumentacija

- Napake pri namestitvi modula
- Struktura modula
- Zmogljivost FAQ
- Omogoči način za odpravljanje napak

---

#XOOPS #moduli #faq #troubleshooting