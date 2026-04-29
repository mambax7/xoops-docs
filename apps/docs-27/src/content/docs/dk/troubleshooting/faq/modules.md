---
title: "Modul FAQ"
description: "Ofte stillede spørgsmål om XOOPS moduler"
---

# Modul ofte stillede spørgsmål

> Almindelige spørgsmål og svar om XOOPS-moduler, installation og administration.

---

## Installation og aktivering

### Q: Hvordan installerer jeg et modul i XOOPS?

**A:**
1. Download modulets zip-fil
2. Gå til XOOPS Admin > Moduler > Administrer moduler
3. Klik på "Gennemse" og vælg zip-filen
4. Klik på "Upload"
5. Modulet vises på listen (normalt deaktiveret)
6. Klik på aktiveringsikonet for at aktivere det

Alternativt kan du udtrække zip'en direkte i `/xoops_root/modules/` og navigere til administrationspanelet.

---

### Q: Modulupload mislykkes med "Permission denied"

**A:** Dette er et problem med filtilladelse:

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

Se Modulinstallationsfejl for flere detaljer.

---

### Q: Hvorfor kan jeg ikke se modulet i admin panelet efter installationen?

**A:** Tjek følgende:

1. **Modul ikke aktiveret** - Klik på øjenikonet i Moduler-listen
2. **Mangler admin side** - Modulet skal have `hasAdmin = 1` i xoopsversion.php
3. **Sprogfiler mangler** - Behøver `language/english/admin.php`
4. **Cache ikke ryddet** - Ryd cache og opdater browser

```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### Q: Hvordan afinstallerer jeg et modul?

**A:**
1. Gå til XOOPS Admin > Moduler > Administrer moduler
2. Deaktiver modulet (klik på øjenikonet)
3. Klik på papirkurven/slet-ikonet
4. Slet modulmappen manuelt, hvis du ønsker fuldstændig fjernelse:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## Modulstyring

### Q: Hvad er forskellen mellem at deaktivere og afinstallere?

**A:**
- **Deaktiver**: Deaktiver modulet (klik på øjeikonet). Databasetabeller forbliver.
- **Afinstaller**: Fjern modulet. Sletter databasetabeller og fjerner fra listen.

For virkelig at fjerne, skal du også slette mappen:
```bash
rm -rf modules/modulename
```

---

### Q: Hvordan kontrollerer jeg, om et modul er korrekt installeret?

**A:** Brug fejlfindingsscriptet:

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

### Q: Kan jeg køre flere versioner af det samme modul?

**A:** Nej, XOOPS understøtter ikke dette indbygget. Du kan dog:

1. Opret en kopi med et andet mappenavn: `mymodule` og `mymodule2`
2. Opdater dirname i begge modulers xoopsversion.php
3. Sørg for unikke databasetabelnavne

Dette anbefales ikke, da de deler den samme kode.

---

## Modulkonfiguration

### Q: Hvor konfigurerer jeg modulindstillinger?

**A:**
1. Gå til XOOPS Admin > Moduler
2. Klik på indstillings-/gearikonet ved siden af modulet
3. Konfigurer præferencer

Indstillinger gemmes i tabellen `xoops_config`.

**Adgang i kode:**
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

### Q: Hvordan definerer jeg modulkonfigurationsmuligheder?

**A:** I xoopsversion.php:

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

## Modulfunktioner

### Q: Hvordan tilføjer jeg en admin-side til mit modul?

**A:** Opret strukturen:

```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```

I xoopsversion.php:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```

Opret `admin/index.php`:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```

---

### Q: Hvordan tilføjer jeg søgefunktionalitet til mit modul?

**A:**
1. Indstil i xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. Opret `search.php`:
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

### Q: Hvordan tilføjer jeg meddelelser til mit modul?

**A:**
1. Indstil i xoopsversion.php:
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

2. Udløs notifikation i kode:
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

## Modultilladelser

### Q: Hvordan indstiller jeg modultilladelser?

**A:**
1. Gå til XOOPS Admin > Moduler > Modultilladelser
2. Vælg modulet
3. Vælg bruger/gruppe og tilladelsesniveau
4. Gem

**I kode:**
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

## Moduldatabase

### Q: Hvor er moduldatabasetabeller gemt?

**A:** Alt sammen i XOOPS-databasen med præfiks med dit tabelpræfiks (normalt `xoops_`):

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

### Q: Hvordan opdaterer jeg moduldatabasetabeller?

**A:** Opret et opdateringsscript i dit modul:

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

## Modulafhængigheder

### Q: Hvordan kontrollerer jeg, om de nødvendige moduler er installeret?

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

### Q: Kan moduler afhænge af andre moduler?

**A:** Ja, erklær i xoopsversion.php:

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

## Fejlfinding

### Q: Modulet vises på listen, men vil ikke aktiveres**A:** Tjek:
1. xoopsversion.php syntaks - Brug PHP linter:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. Database SQL fil:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. Sprogfiler:
```bash
ls -la modules/mymodule/language/english/
```

Se modulinstallationsfejl for detaljeret diagnostik.

---

### Q: Modul aktiveret, men vises ikke på hovedsiden

**A:**
1. Indstil `hasMain = 1` i xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. Opret `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

### Q: Modulet forårsager "white screen of death"

**A:** Aktiver fejlfinding for at finde fejlen:

```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

Tjek fejlloggen:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

Se White Screen of Death for løsninger.

---

## Ydeevne

### Q: Modulet er langsomt, hvordan optimerer jeg?

**A:**
1. **Tjek databaseforespørgsler** - Brug forespørgselslogning
2. **Cachedata** - Brug XOOPS cache:
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

3. **Optimer skabeloner** - Undgå sløjfer i skabeloner
4. **Aktiver PHP opcode-cache** - APCu, XDebug osv.

Se Ydelse FAQ for flere detaljer.

---

## Moduludvikling

### Q: Hvor kan jeg finde moduludviklingsdokumentation?

**A:** Se:
- Moduludviklingsvejledning
- Modulstruktur
- Oprettelse af dit første modul

---

## Relateret dokumentation

- Modulinstallationsfejl
- Modulstruktur
- Ydeevne FAQ
- Aktiver fejlretningstilstand

---

#xoops #moduler #faq #fejlfinding
