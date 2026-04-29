---
title: "Module FAQ"
description: "Veelgestelde vragen over XOOPS-modules"
---
# Module Veelgestelde vragen

> Veelgestelde vragen en antwoorden over XOOPS-modules, installatie en beheer.

---

## Installatie en activering

### V: Hoe installeer ik een module in XOOPS?

**EEN:**
1. Download het zipbestand van de module
2. Ga naar XOOPS Beheerder > Modules > Modules beheren
3. Klik op "Bladeren" en selecteer het zipbestand
4. Klik op ‘Uploaden’
5. De module verschijnt in de lijst (meestal gedeactiveerd)
6. Klik op het activeringspictogram om dit in te schakelen

U kunt de zip ook rechtstreeks uitpakken in `/xoops_root/modules/` en naar het beheerderspaneel gaan.

---

### V: Module-upload mislukt met 'Toestemming geweigerd'

**A:** Dit is een probleem met bestandsrechten:

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

Zie Module-installatiefouten voor meer details.

---

### V: Waarom kan ik de module na installatie niet zien in het beheerderspaneel?

**A:** Controleer het volgende:

1. **Module niet geactiveerd** - Klik op het oogpictogram in de Modulelijst
2. **Ontbrekende beheerderspagina** - Module moet `hasAdmin = 1` bevatten in xoopsversion.php
3. **Taalbestanden ontbreken** - `language/english/admin.php` nodig
4. **Cache niet gewist** - Wis de cache en vernieuw de browser

```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### V: Hoe verwijder ik een module?

**EEN:**
1. Ga naar XOOPS Beheerder > Modules > Modules beheren
2. Deactiveer de module (klik op het oogpictogram)
3. Klik op het prullenbak-/verwijderpictogram
4. Verwijder de modulemap handmatig als u volledige verwijdering wilt:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## Modulebeheer

### V: Wat is het verschil tussen uitschakelen en verwijderen?

**EEN:**
- **Uitschakelen**: deactiveer de module (klik op het oogpictogram). Databasetabellen blijven bestaan.
- **Verwijderen**: verwijder de module. Verwijdert databasetabellen en verwijdert uit de lijst.

Om echt te verwijderen, verwijdert u ook de map:
```bash
rm -rf modules/modulename
```

---

### V: Hoe controleer ik of een module correct is geïnstalleerd?

**A:** Gebruik het foutopsporingsscript:

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

### V: Kan ik meerdere versies van dezelfde module gebruiken?

**A:** Nee, XOOPS ondersteunt dit niet standaard. U kunt echter:

1. Maak een kopie met een andere mapnaam: `mymodule` en `mymodule2`
2. Update de mapnaam in xoopsversion.php van beide modules
3. Zorg voor unieke databasetabelnamen

Dit wordt niet aanbevolen omdat ze dezelfde code delen.

---

## Moduleconfiguratie

### V: Waar configureer ik de module-instellingen?

**EEN:**
1. Ga naar XOOPS Beheerder > Modules
2. Klik op het instellingen/tandwielpictogram naast de module
3. Configureer voorkeuren

Instellingen worden opgeslagen in de tabel `xoops_config`.

**Toegang in code:**
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

### V: Hoe definieer ik moduleconfiguratieopties?

**A:** In xoopsversion.php:

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

## Modulefuncties

### V: Hoe voeg ik een beheerderspagina toe aan mijn module?

**A:** Maak de structuur:

```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```

In xoopsversion.php:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```

`admin/index.php` aanmaken:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```

---

### V: Hoe voeg ik zoekfunctionaliteit toe aan mijn module?

**EEN:**
1. Stel in xoopsversion.php in:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. `search.php` aanmaken:
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

### V: Hoe voeg ik meldingen toe aan mijn module?

**EEN:**
1. Stel in xoopsversion.php in:
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

2. Melding activeren in code:
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

## Modulerechten

### V: Hoe stel ik modulerechten in?

**EEN:**
1. Ga naar XOOPS Beheerder > Modules > Modulemachtigingen
2. Selecteer de module
3. Kies gebruiker/groep en machtigingsniveau
4. Opslaan

**In code:**
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

## Moduledatabase

### V: Waar worden moduledatabasetabellen opgeslagen?

**A:** Alles in de hoofddatabase XOOPS, voorafgegaan door uw tabelvoorvoegsel (meestal `xoops_`):

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

### V: Hoe update ik moduledatabasetabellen?

**A:** Maak een updatescript in uw module:

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

## Moduleafhankelijkheden

### V: Hoe controleer ik of de vereiste modules zijn geïnstalleerd?

**EEN:**
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

### V: Kunnen modules afhankelijk zijn van andere modules?

**A:** Ja, declareer in xoopsversion.php:

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

## Problemen oplossen

### V: Module verschijnt in de lijst, maar kan niet worden geactiveerd**A:** Controleer:
1. xoopsversion.php-syntaxis - Gebruik PHP-linter:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. Database SQL-bestand:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. Taalbestanden:
```bash
ls -la modules/mymodule/language/english/
```

Zie Module-installatiefouten voor gedetailleerde diagnostiek.

---

### V: Module geactiveerd maar wordt niet weergegeven op de hoofdsite

**EEN:**
1. Stel `hasMain = 1` in xoopsversion.php in:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. Maak `modules/mymodule/index.php` aan:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

### V: Module veroorzaakt "wit scherm van de dood"

**A:** Schakel foutopsporing in om de fout te vinden:

```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

Controleer het foutenlogboek:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

Zie White Screen of Death voor oplossingen.

---

## Prestaties

### V: Module is traag, hoe kan ik optimaliseren?

**EEN:**
1. **Controleer databasequery's** - Gebruik querylogboekregistratie
2. **Cachegegevens** - Gebruik XOOPS-cache:
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

3. **Sjablonen optimaliseren** - Vermijd lussen in sjablonen
4. **Zaak PHP opcode cache in** - APCu, XDebug, enz.

Zie Prestaties FAQ voor meer details.

---

## Moduleontwikkeling

### V: Waar kan ik documentatie voor moduleontwikkeling vinden?

**A:** Zie:
- Module-ontwikkelingsgids
- Modulestructuur
- Uw eerste module maken

---

## Gerelateerde documentatie

- Module-installatiefouten
- Modulestructuur
- Prestaties FAQ
- Schakel de foutopsporingsmodus in

---

#xoops #modules #faq #probleemoplossing