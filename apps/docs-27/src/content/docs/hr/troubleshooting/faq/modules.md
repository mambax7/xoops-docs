---
title: "FAQ o modulu"
description: "Često postavljana pitanja o XOOPS modules"
---
# modul Često postavljana pitanja

> Uobičajena pitanja i odgovori o XOOPS modules, instalaciji i upravljanju.

---

## Instalacija i aktivacija

### P: Kako mogu instalirati modul u XOOPS?

**A:**
1. Preuzmite zip datoteku modula
2. Idite na XOOPS Admin > moduli > Upravljanje modulima
3. Pritisnite "Pregledaj" i odaberite zip datoteku
4. Kliknite "Učitaj"
5. modul se pojavljuje na popisu (obično deaktiviran)
6. Pritisnite ikonu za aktivaciju da biste je omogućili

Alternativno, izvucite zip izravno u `/xoops_root/modules/` i idite na ploču admin.

---

### P: Prijenos modula ne uspijeva s "dozvola odbijena"

**O:** Ovo je problem s dozvolom datoteke:

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

Za više detalja pogledajte Neuspješne instalacije modula.

---

### P: Zašto ne mogu vidjeti modul na ploči admin nakon instalacije?

**A:** Provjerite sljedeće:

1. **modul nije aktiviran** - kliknite ikonu oka na popisu modula
2. **Nedostaje admin stranica** - modul mora imati `hasAdmin = 1` u xoopsverziji.php
3. **Language files missing** - Need `language/english/admin.php`
4. **predmemorija nije izbrisana** - Obrišite cache i osvježite preglednik

```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### P: Kako mogu deinstalirati modul?

**A:**
1. Idite na XOOPS Admin > moduli > Upravljanje modulima
2. Deaktivirajte modul (kliknite ikonu oka)
3. Pritisnite ikonu za smeće/brisanje
4. Ručno izbrišite mapu modula ako želite potpuno uklanjanje:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## Upravljanje modulom

### P: Koja je razlika između onemogućavanja i deinstaliranja?

**A:**
- **Onemogući**: Deaktivirajte modul (kliknite ikonu oka). Ostaju tablice baze podataka.
- **Deinstaliraj**: Uklonite modul. Briše tablice baze podataka i uklanja s popisa.

Za stvarno uklanjanje, izbrišite i mapu:
```bash
rm -rf modules/modulename
```

---

### P: Kako mogu provjeriti je li modul ispravno instaliran?

**A:** Koristite skriptu za otklanjanje pogrešaka:

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

### P: Mogu li pokrenuti više verzija istog modula?

**O:** Ne, XOOPS to izvorno ne podržava. Međutim, možete:

1. Napravite kopiju s drugim nazivom direktorija: `mymodule` i `mymodule2`
2. Ažurirajte dirname u obje modules' xoopsversion.php
3. Ensure unique database table names

To se ne preporučuje jer dijele isti kod.

---

## Konfiguracija modula

### P: Gdje mogu konfigurirati postavke modula?

**A:**
1. Idite na XOOPS Admin > moduli
2. Pritisnite ikonu postavki/zupčanika pored modula
3. Konfigurirajte postavke

Postavke su pohranjene u tablici `xoops_config`.

**Pristup u kodu:**
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

### P: Kako mogu definirati opcije konfiguracije modula?

**A:** U xoopsversion.php:

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

## Značajke modula

### P: Kako mogu dodati stranicu admin svom modulu?

**A:** Napravite strukturu:

```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```

U xoopsversion.php:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```

Kreirajte `admin/index.php`:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```

---

### P: Kako mogu svom modulu dodati funkciju pretraživanja?

**A:**
1. Postavite u xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. Kreirajte `search.php`:
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

### P: Kako mogu dodati obavijesti svom modulu?

**A:**
1. Postavite u xoopsversion.php:
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

2. Pokreni obavijest u kodu:
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

## dozvole modula

### P: Kako postaviti dopuštenja modula?**A:**
1. Idite na XOOPS Admin > moduli > dozvole modula
2. Odaberite modul
3. Odaberite korisnika/grupu i razinu dopuštenja
4. Spremiti

**U kodu:**
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

## baza podataka modula

### P: Gdje su pohranjene tablice baze podataka modula?

**A:** Sve u glavnoj bazi podataka XOOPS, s prefiksom vaše tablice (obično `xoops_`):

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

### P: Kako mogu ažurirati tablice baze podataka modula?

**O:** Napravite skriptu za ažuriranje u svom modulu:

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

## Ovisnosti modula

### P: Kako mogu provjeriti jesu li potrebni modules instalirani?

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

### P: Može li modules ovisiti o drugom modules?

**A:** Da, deklariraj u xoopsversion.php:

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

## Rješavanje problema

### P: modul se pojavljuje na popisu, ali se ne aktivira

**A:** Provjerite:
1. xoopsverzija.php syntax - Use PHP linter:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. Datoteka baze podataka SQL:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. Jezične datoteke:
```bash
ls -la modules/mymodule/language/english/
```

Pogledajte Neuspješne instalacije modula za detaljnu dijagnostiku.

---

### P: modul je aktiviran, ali se ne prikazuje na glavnoj stranici

**A:**
1. Postavite `hasMain = 1` u xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. Kreirajte `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

### P: modul uzrokuje "bijeli ekran smrti"

**O:** Omogućite otklanjanje pogrešaka da biste pronašli pogrešku:

```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

Provjerite zapisnik grešaka:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

Za rješenja pogledajte Bijeli ekran smrti.

---

## Izvedba

### P: modul je spor, kako da optimiziram?

**A:**
1. **Provjerite upite baze podataka** - Koristite bilježenje upita
2. **Podaci iz predmemorije** - Koristite XOOPS cache:
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

3. **Optimiziraj templates** - Izbjegavajte petlje u templates
4. **Omogući PHP operativni kod cache** - APCu, XDebug, itd.

Za više detalja pogledajte FAQ o izvedbi.

---

## Razvoj modula

### P: Gdje mogu pronaći dokumentaciju za razvoj modula?

**A:** Vidi:
- Vodič za razvoj modula
- Struktura modula
- Stvaranje vašeg prvog modula

---

## Povezana dokumentacija

- Greške pri instalaciji modula
- Struktura modula
- Česta pitanja o izvedbi
- Omogućite način otklanjanja pogrešaka

---

#xoops #modules #faq #troubleshooting
