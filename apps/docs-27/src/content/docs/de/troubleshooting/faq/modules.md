---
title: "Module-FAQ"
description: "Häufig gestellte Fragen zu XOOPS-Modulen"
---

# Module - Häufig gestellte Fragen

> Allgemeine Fragen und Antworten zu XOOPS-Modulen, Installation und Verwaltung.

---

## Installation & Aktivierung

### F: Wie installiere ich ein Modul in XOOPS?

**A:**
1. Module-ZIP-Datei herunterladen
2. Gehen Sie zu XOOPS Admin > Module > Module verwalten
3. Klicken Sie auf "Durchsuchen" und wählen Sie die ZIP-Datei
4. Klicken Sie auf "Hochladen"
5. Das Modul wird in der Liste angezeigt (normalerweise deaktiviert)
6. Klicken Sie auf das Aktivierungssymbol, um es zu aktivieren

Alternativ extrahieren Sie die ZIP-Datei direkt in `/xoops_root/modules/` und navigieren Sie zum Admin-Panel.

---

### Q: Module upload fails with "Permission denied"

**A:** Dies ist ein Dateiberechtigungsproblem:

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

See Module Installation Failures for more details.

---

### Q: Why can't I see the module in the admin panel after installation?

**A:** Überprüfen Sie Folgendes:

1. **Modul nicht aktiviert** - Klicken Sie auf das Augensymbol in der Modulliste
2. **Admin-Seite fehlt** - Das Modul muss `hasAdmin = 1` in xoopsversion.php haben
3. **Sprachdateien fehlen** - Benötigt `language/english/admin.php`
4. **Cache nicht geleert** - Cache leeren und Browser aktualisieren

```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### Q: How do I uninstall a module?

**A:**
1. Gehen Sie zu XOOPS Admin > Module > Module verwalten
2. Deaktivieren Sie das Modul (klicken Sie auf das Augensymbol)
3. Klicken Sie auf das Papierkorb-/Löschsymbol
4. Löschen Sie den Modulordner manuell, wenn Sie eine vollständige Entfernung möchten:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## Module Management

### Q: What's the difference between disabling and uninstalling?

**A:**
- **Deaktivieren**: Deaktivieren Sie das Modul (klicken Sie auf das Augensymbol). Datenbanktabellen bleiben bestehen.
- **Deinstallieren**: Entfernen Sie das Modul. Löscht Datenbanktabellen und entfernt sie aus der Liste.

To truly remove, also delete the folder:
```bash
rm -rf modules/modulename
```

---

### Q: How do I check if a module is properly installed?

**A:** Verwenden Sie das Debug-Skript:

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

### Q: Can I run multiple versions of the same module?

**A:** Nein, XOOPS unterstützt dies nicht nativ. Sie können jedoch:

1. Eine Kopie mit einem anderen Verzeichnisnamen erstellen: `mymodule` und `mymodule2`
2. Den dirname in den xoopsversion.php-Dateien beider Module aktualisieren
3. Eindeutige Datenbanktabellennamen sicherstellen

Dies wird nicht empfohlen, da sie denselben Code teilen.

---

## Module Configuration

### Q: Where do I configure module settings?

**A:**
1. Gehen Sie zu XOOPS Admin > Module
2. Klicken Sie auf das Einstellungs-/Zahnradsymbol neben dem Modul
3. Konfigurieren Sie die Einstellungen

Einstellungen werden in der `xoops_config`-Tabelle gespeichert.

**Zugriff im Code:**
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

### Q: How do I define module configuration options?

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

## Module Features

### Q: How do I add an admin page to my module?

**A:** Erstellen Sie die Struktur:

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

Create `admin/index.php`:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```

---

### F: Wie füge ich Suchfunktionalität zu meinem Modul hinzu?

**A:**
1. Setzen Sie in xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. Erstellen Sie `search.php`:
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

### F: Wie füge ich Benachrichtigungen zu meinem Modul hinzu?

**A:**
1. Setzen Sie in xoopsversion.php:
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

2. Benachrichtigung im Code auslösen:
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

## Module Permissions

### Q: How do I set module permissions?

**A:**
1. Gehen Sie zu XOOPS Admin > Module > Modulberechtigungen
2. Wählen Sie das Modul
3. Wählen Sie Benutzer/Gruppe und Berechtigungsstufe
4. Speichern Sie

**Im Code:**
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

### Q: Where are module database tables stored?

**A:** Alle in der Haupt-XOOPS-Datenbank, Präfix mit Ihrem Tabellenpräfix (normalerweise `xoops_`):

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

### Q: How do I update module database tables?

**A:** Erstellen Sie ein Update-Skript in Ihrem Modul:

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

## Module Dependencies

### Q: How do I check if required modules are installed?

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

### Q: Can modules depend on other modules?

**A:** Ja, deklarieren Sie in xoopsversion.php:

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

## Troubleshooting

### Q: Module appears in list but won't activate

**A:** Überprüfen Sie:
1. xoopsversion.php-Syntax - Verwenden Sie PHP-Linter:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. Datenbank-SQL-Datei:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. Sprachdateien:
```bash
ls -la modules/mymodule/language/english/
```

Siehe Modul-Installationsfehler für ausführliche Diagnose.

---

### Q: Module activated but doesn't show in main site

**A:**
1. Setzen Sie `hasMain = 1` in xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. Erstellen Sie `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

### Q: Module causes "white screen of death"

**A:** Aktivieren Sie Debugging, um den Fehler zu finden:

```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

Überprüfen Sie das Fehlerprotokoll:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

Siehe Weißer Bildschirm des Todes für Lösungen.

---

## Performance

### Q: Module is slow, how do I optimize?

**A:**
1. **Datenbank-Abfragen überprüfen** - Verwenden Sie Abfrage-Protokollierung
2. **Daten zwischenspeichern** - Verwenden Sie XOOPS-Cache:
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

3. **Templates optimieren** - Vermeiden Sie Schleifen in Templates
4. **PHP-Opcode-Cache aktivieren** - APCu, XDebug, usw.

Weitere Informationen finden Sie unter Performance FAQ.

---

## Module Development

### Q: Where can I find module development documentation?

**A:** See:
- Module Development Guide
- Module Structure
- Creating Your First Module

---

## Zugehörige Dokumentation

- Modul-Installationsfehler
- Modulstruktur
- Performance-FAQ
- Debug-Modus aktivieren

---

#xoops #modules #faq #troubleshooting
