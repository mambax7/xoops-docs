---
title: "Modul FAQ"
description: "Často kladené otázky o modulech XOOPS"
---

# Modul Často kladené otázky

> Běžné otázky a odpovědi týkající se modulů XOOPS, instalace a správy.

---

## Instalace a aktivace

### Otázka: Jak nainstaluji modul do XOOPS?

**A:**
1. Stáhněte si soubor zip modulu
2. Přejděte na XOOPS Admin > Moduly > Správa modulů
3. Klikněte na „Procházet“ a vyberte soubor zip
4. Klikněte na "Nahrát"
5. Modul se objeví v seznamu (obvykle deaktivován)
6. Klepnutím na ikonu aktivace ji povolíte

Případně extrahujte zip přímo do `/xoops_root/modules/` a přejděte na panel správce.

---

### Otázka: Nahrání modulu se nezdařilo s „Povolení odepřeno“

**A:** Toto je problém s oprávněním k souboru:

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

Další podrobnosti naleznete v části Selhání instalace modulu.

---

### Otázka: Proč po instalaci nevidím modul na panelu administrátora?

**A:** Zkontrolujte následující:

1. **Modul není aktivován** – Klikněte na ikonu oka v seznamu modulů
2. **Chybí stránka správce** – Modul musí mít `hasAdmin = 1` v xoopsversion.php
3. **Chybí jazykové soubory** – Potřebujete `language/english/admin.php`
4. **Cache not clear** – Vymažte mezipaměť a obnovte prohlížeč

```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### Otázka: Jak odinstaluji modul?

**A:**
1. Přejděte na XOOPS Admin > Moduly > Správa modulů
2. Deaktivujte modul (klikněte na ikonu oka)
3. Klepněte na ikonu trash/delete
4. Pokud chcete úplné odstranění, ručně odstraňte složku modulu:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## Správa modulů

### Otázka: Jaký je rozdíl mezi deaktivací a odinstalací?

**A:**
- **Zakázat**: Deaktivujte modul (klikněte na ikonu oka). Databázové tabulky zůstávají.
- **Odinstalovat**: Vyjměte modul. Smaže databázové tabulky a odstraní ze seznamu.

Chcete-li skutečně odstranit, odstraňte také složku: 
```bash
rm -rf modules/modulename
```

---

### Otázka: Jak zkontroluji, zda je modul správně nainstalován?

**A:** Použijte ladicí skript:

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

### Otázka: Mohu spustit více verzí stejného modulu?

**A:** Ne, XOOPS to nativně nepodporuje. Můžete však:

1. Vytvořte kopii s jiným názvem adresáře: `mymodule` a `mymodule2`
2. Aktualizujte dirname v xoopsversion.php obou modulů
3. Zajistěte jedinečné názvy databázových tabulek

To se nedoporučuje, protože sdílejí stejný kód.

---

## Konfigurace modulu

### Otázka: Kde nakonfiguruji nastavení modulu?

**A:**
1. Přejděte na XOOPS Admin > Moduly
2. Klikněte na ikonu settings/gear vedle modulu
3. Nakonfigurujte předvolby

Nastavení jsou uložena v tabulce `xoops_config`.

**Přístup v kódu:**
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

### Otázka: Jak mohu definovat možnosti konfigurace modulu?

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

## Funkce modulu

### Otázka: Jak přidám stránku správce do svého modulu?

**A:** Vytvořte strukturu:

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

Vytvořit `admin/index.php`:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```

---

### Otázka: Jak přidám funkci vyhledávání do svého modulu?

**A:**
1. Sada v xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. Vytvořte `search.php`:
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

### Otázka: Jak přidám upozornění do svého modulu?

**A:**
1. Sada v xoopsversion.php:
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

2. Spustit upozornění v kódu:
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

## Oprávnění modulu

### Otázka: Jak nastavím oprávnění modulu?

**A:**
1. Přejděte na XOOPS Admin > Moduly > Oprávnění modulu
2. Vyberte modul
3. Vyberte user/group a úroveň oprávnění
4. Uložit

**V kódu:**
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

## Databáze modulů

### Q: Kde jsou uloženy databázové tabulky modulů?

**A:** Vše v hlavní databázi XOOPS s předponou vaší tabulky (obvykle `xoops_`):

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

### Otázka: Jak aktualizuji databázové tabulky modulů?

**A:** Vytvořte ve svém modulu aktualizační skript:

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

## Závislosti modulu

### Otázka: Jak zkontroluji, zda jsou nainstalovány požadované moduly?

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

### Otázka: Mohou moduly záviset na jiných modulech?

**A:** Ano, deklarujte v xoopsversion.php:

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

## Odstraňování problémů

### Otázka: Modul se objeví v seznamu, ale neaktivuje se

**A:** Zkontrolujte:
1. Syntaxe xoopsversion.php – Použijte PHP linter:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. Soubor databáze SQL:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. Jazykové soubory:
```bash
ls -la modules/mymodule/language/english/
```

Podrobnou diagnostiku naleznete v části Selhání instalace modulu.

---

### Otázka: Modul je aktivován, ale nezobrazuje se na hlavní stránce

**A:**
1. Nastavte `hasMain = 1` v xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. Vytvořte `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---### Otázka: Modul způsobuje „bílou obrazovku smrti“

**A:** Povolte ladění, abyste našli chybu:

```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

Zkontrolujte protokol chyb: 
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

Řešení viz Bílá obrazovka smrti.

---

## Výkon

### Otázka: Modul je pomalý, jak mohu optimalizovat?

**A:**
1. **Zkontrolujte databázové dotazy** – Použijte protokolování dotazů
2. **Data mezipaměti** – Použijte mezipaměť XOOPS:
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

3. **Optimalizace šablon** – Vyhněte se smyčkám v šablonách
4. **Povolte mezipaměť operačních kódů PHP** - APCu, XDebug atd.

Další podrobnosti najdete v části Výkon FAQ.

---

## Vývoj modulu

### Otázka: Kde najdu dokumentaci k vývoji modulu?

**A:** Viz:
- Průvodce vývojem modulu
- Struktura modulu
- Vytvoření prvního modulu

---

## Související dokumentace

- Selhání instalace modulu
- Struktura modulu
- Výkon FAQ
- Povolit režim ladění

---

#xoops #modules #faq #odstranění problémů