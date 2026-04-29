---
title: "modul GYIK"
description: "Gyakran ismételt kérdések a XOOPS modulokkal kapcsolatban"
---
# modul Gyakran Ismételt Kérdések

> Gyakori kérdések és válaszok a XOOPS modulokkal, telepítéssel és kezeléssel kapcsolatban.

---

## Telepítés és aktiválás

### K: Hogyan telepíthetek modult a XOOPS-ba?

**A:**
1. Töltse le a modul zip fájlját
2. Lépjen a XOOPS Adminisztráció > modulok > modulok kezelése oldalra.
3. Kattintson a "Tallózás" gombra, és válassza ki a zip fájlt
4. Kattintson a "Feltöltés" gombra.
5. A modul megjelenik a listában (általában deaktiválva)
6. Az aktiváláshoz kattintson az aktiválási ikonra

Alternatív megoldásként bontsa ki a ZIP-fájlt közvetlenül a `/xoops_root/modules/`-ba, és navigáljon az adminisztrációs panelre.

---

### K: A modul feltöltés sikertelen "Engedély megtagadva" esetén

**V:** Ez egy fájlengedély-probléma:

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

További részletekért lásd: modul telepítési hibák.

---

### K: Miért nem látom a modult az adminisztrációs panelen a telepítés után?

**V:** Ellenőrizze a következőket:

1. **A modul nincs aktiválva** - Kattintson a szem ikonra a modulok listában
2. **Hiányzó adminisztrátori oldal** - A modulnak tartalmaznia kell a `hasAdmin = 1` értéket a xoopsversion.php-ban
3. **Hiányoznak a nyelvi fájlok** – `language/english/admin.php`
4. **A gyorsítótár nem törölve** - A gyorsítótár törlése és a böngésző frissítése

```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### K: Hogyan távolíthatok el egy modult?

**A:**
1. Lépjen a XOOPS Adminisztráció > modulok > modulok kezelése oldalra.
2. Inaktiválja a modult (kattintson a szem ikonra)
3. Kattintson a trash/delete ikonra
4. Manuálisan törölje a modul mappáját, ha teljes mértékben el szeretné távolítani:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## modulkezelés

### K: Mi a különbség a letiltás és az eltávolítás között?

**A:**
- **Letiltás**: Inaktiválja a modult (kattintson a szem ikonra). Az adatbázistáblák megmaradnak.
- **Eltávolítás**: Távolítsa el a modult. Törli az adatbázistáblákat és eltávolítja a listáról.

A tényleges eltávolításhoz törölje a mappát is:
```bash
rm -rf modules/modulename
```

---

### K: Hogyan ellenőrizhetem, hogy a modul megfelelően van-e telepítve?

**V:** Használja a hibakereső szkriptet:

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

### K: Futhatok ugyanannak a modulnak több verzióját?

**V:** Nem, a XOOPS ezt natívan nem támogatja. Azonban a következőket teheti:

1. Hozzon létre egy másolatot egy másik könyvtárnévvel: `mymodule` és `mymodule2`
2. Frissítse a dirnevet mindkét modulban: xoopsversion.php
3. Gondoskodjon egyedi adatbázis-táblanevekről

Ez nem ajánlott, mivel ugyanazt a kódot használják.

---

## modul konfigurálása

### K: Hol konfigurálhatom a modul beállításait?

**A:**
1. Nyissa meg a XOOPS Admin > modules menüpontot
2. Kattintson a modul melletti settings/gear ikonra
3. Adja meg a beállításokat

A beállítások a `xoops_config` táblázatban tárolódnak.

**Hozzáférés kódban:**
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

### K: Hogyan határozhatom meg a modul konfigurációs beállításait?

**A:** xoopsversion.php-ban:

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

## modul jellemzői

### K: Hogyan adhatok adminisztrátori oldalt a modulomhoz?

**V:** Hozza létre a szerkezetet:

```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```

xoopsversion.php esetén:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```

`admin/index.php` létrehozása:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```

---

### K: Hogyan adhatok keresési funkciót a modulomhoz?

**A:**
1. Állítsa be a xoopsversion.php-ban:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. Hozzon létre `search.php`:
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

### K: Hogyan adhatok hozzá értesítéseket a modulomhoz?

**A:**
1. Állítsa be a xoopsversion.php-ban:
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

2. Értesítés aktiválása a kódban:
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

## modulengedélyek

### K: Hogyan állíthatom be a modulengedélyeket?

**A:**
1. Lépjen a XOOPS Adminisztráció > modulok > modulengedélyek oldalra.
2. Válassza ki a modult
3. Válassza ki a user/group lehetőséget és az engedélyszintet
4. Mentés

**Kódban:**
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

## modul adatbázis

### K: Hol tárolják a modul adatbázis tábláit?

**V:** Minden a fő XOOPS adatbázisban, a táblázat előtagjával (általában `xoops_`) előtagozva:

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

### K: Hogyan frissíthetem a modul adatbázis tábláit?

**V:** Hozzon létre egy frissítési szkriptet a modulban:

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

## modul függőségek

### K: Hogyan ellenőrizhetem, hogy a szükséges modulok telepítve vannak-e?

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

### K: Függhetnek a modulok más moduloktól?

**V:** Igen, nyilatkozzon a xoopsversion.php-ban:

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

## Hibaelhárítás

### K: A modul megjelenik a listában, de nem aktiválódik

**V:** Ellenőrizze:
1. xoopsversion.php szintaxis – PHP linter használata:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. Adatbázis SQL fájl:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. Nyelvi fájlok:
```bash
ls -la modules/mymodule/language/english/
```
A részletes diagnosztikát lásd: modul telepítési hibák.

---

### K: A modul aktiválva van, de nem jelenik meg a főoldalon

**A:**
1. Állítsa be a `hasMain = 1`-t a xoopsversion.php-ban:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. Hozzon létre `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

### K: A modul a "halál fehér képernyőjét" okozza

**V:** Engedélyezze a hibakeresést a hiba megtalálásához:

```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

Ellenőrizze a hibanaplót:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

A megoldásokért lásd a Halál fehér képernyőjét.

---

## Teljesítmény

### K: A modul lassú, hogyan optimalizálhatom?

**A:**
1. **Ellenőrizze az adatbázis-lekérdezéseket** - Lekérdezések naplózása
2. **Gyorsítótár adatok** – XOOPS gyorsítótár használata:
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

3. **Sablonok optimalizálása** – Kerülje el a hurkokat a sablonokban
4. **A PHP műveleti kód gyorsítótár engedélyezése** – APCu, XDebug stb.

További részletekért lásd: Teljesítmény FAQ.

---

## modulfejlesztés

### K: Hol találom a modulfejlesztési dokumentációt?

**A:** Lásd:
- modulfejlesztési útmutató
- modul felépítése
- Az első modul létrehozása

---

## Kapcsolódó dokumentáció

- modul telepítési hibák
- modul felépítése
- Teljesítmény FAQ
- Engedélyezze a hibakeresési módot

---

#xoops #modulok #gyik #hibaelhárítás
