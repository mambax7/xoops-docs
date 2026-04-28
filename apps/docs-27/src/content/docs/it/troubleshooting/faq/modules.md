---
title: "FAQ moduli"
description: "Domande frequenti sui moduli XOOPS"
---

# Domande frequenti sui moduli

> Domande e risposte comuni sui moduli XOOPS, l'installazione e la gestione.

---

## Installazione e attivazione

### D: Come installo un modulo in XOOPS?

**R:**
1. Scarica il file zip del modulo
2. Vai ad XOOPS Admin > Modules > Manage Modules
3. Fai clic su "Browse" e seleziona il file zip
4. Fai clic su "Upload"
5. Il modulo appare nell'elenco (di solito disattivato)
6. Fai clic sull'icona di attivazione per abilitarlo

In alternativa, estrai lo zip direttamente in `/xoops_root/modules/` e passa al pannello di amministrazione.

---

### D: Il caricamento del modulo non riesce con "Permesso negato"

**R:** Si tratta di un problema di autorizzazione dei file:

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

Consulta i guasti all'installazione del modulo per ulteriori dettagli.

---

### D: Perché non riesco a vedere il modulo nel pannello di amministrazione dopo l'installazione?

**R:** Controlla quanto segue:

1. **Modulo non attivato** - Fai clic sull'icona dell'occhio nell'elenco dei moduli
2. **Pagina amministrativa mancante** - Il modulo deve avere `hasAdmin = 1` in xoopsversion.php
3. **File di lingua mancanti** - È necessario `language/english/admin.php`
4. **Cache non cancellata** - Cancella la cache e aggiorna il browser

```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### D: Come disinstallo un modulo?

**R:**
1. Vai ad XOOPS Admin > Modules > Manage Modules
2. Disattiva il modulo (fai clic sull'icona dell'occhio)
3. Fai clic sull'icona del cestino/elimina
4. Elimina manualmente la cartella del modulo se desideri una rimozione completa:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## Gestione del modulo

### D: Qual è la differenza tra disabilitare e disinstallare?

**R:**
- **Disabilita**: Disattiva il modulo (fai clic sull'icona dell'occhio). Le tabelle del database rimangono.
- **Disinstalla**: Rimuovi il modulo. Elimina le tabelle del database e le rimuove dall'elenco.

Per rimuovere completamente, elimina anche la cartella:
```bash
rm -rf modules/modulename
```

---

### D: Come faccio a controllare se un modulo è installato correttamente?

**R:** Utilizza lo script di debug:

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

### D: Posso eseguire più versioni dello stesso modulo?

**R:** No, XOOPS non supporta questo nativamente. Tuttavia, puoi:

1. Creare una copia con un nome di directory diverso: `mymodule` e `mymodule2`
2. Aggiorna il dirname nel xoopsversion.php di entrambi i moduli
3. Assicurati che i nomi delle tabelle del database siano univoci

Questo non è consigliato poiché condividono lo stesso codice.

---

## Configurazione del modulo

### D: Dove configuro le impostazioni del modulo?

**R:**
1. Vai ad XOOPS Admin > Modules
2. Fai clic sull'icona delle impostazioni/ingranaggio accanto al modulo
3. Configura le preferenze

Le impostazioni vengono archiviate nella tabella `xoops_config`.

**Accedi nel codice:**
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

### D: Come definisco le opzioni di configurazione del modulo?

**R:** In xoopsversion.php:

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

## Caratteristiche del modulo

### D: Come aggiungo una pagina di amministrazione al mio modulo?

**R:** Crea la struttura:

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

Crea `admin/index.php`:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```

---

### D: Come aggiungo la funzionalità di ricerca al mio modulo?

**R:**
1. Imposta in xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. Crea `search.php`:
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

### D: Come aggiungo le notifiche al mio modulo?

**R:**
1. Imposta in xoopsversion.php:
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

2. Attiva la notifica nel codice:
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

## Autorizzazioni del modulo

### D: Come imposto le autorizzazioni del modulo?

**R:**
1. Vai ad XOOPS Admin > Modules > Module Permissions
2. Seleziona il modulo
3. Scegli l'utente/gruppo e il livello di autorizzazione
4. Salva

**Nel codice:**
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

## Database del modulo

### D: Dove vengono archiviate le tabelle del database del modulo?

**R:** Tutto nel database XOOPS principale, con prefisso con il tuo prefisso di tabella (di solito `xoops_`):

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

### D: Come aggiorno le tabelle del database del modulo?

**R:** Crea uno script di aggiornamento nel tuo modulo:

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

## Dipendenze del modulo

### D: Come faccio a controllare se i moduli richiesti sono installati?

**R:**
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

### D: I moduli possono dipendere da altri moduli?

**R:** Sì, dichiara in xoopsversion.php:

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

## Risoluzione dei problemi

### D: Il modulo appare nell'elenco ma non si attiva

**R:** Controlla:
1. Sintassi xoopsversion.php - Usa il linter PHP:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. File SQL del database:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. File di lingua:
```bash
ls -la modules/mymodule/language/english/
```

Consulta Guasti all'installazione del modulo per una diagnostica dettagliata.

---

### D: Il modulo è attivato ma non viene visualizzato nel sito principale

**R:**
1. Imposta `hasMain = 1` in xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. Crea `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

### D: Il modulo causa "schermata bianca della morte"

**R:** Abilita il debug per trovare l'errore:

```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

Controlla il registro degli errori:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

Consulta Schermata bianca della morte per le soluzioni.

---

## Prestazioni

### D: Il modulo è lento, come lo ottimizzodirò?

**R:**
1. **Controlla le query del database** - Usa la registrazione delle query
2. **Memorizza nella cache i dati** - Usa la cache XOOPS:
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

3. **Ottimizza i template** - Evita i loop nei template
4. **Abilita la cache del codice operativo PHP** - APCu, XDebug, ecc.

Consulta FAQ prestazioni per ulteriori dettagli.

---

## Sviluppo del modulo

### D: Dove posso trovare la documentazione sullo sviluppo dei moduli?

**R:** Vedi:
- Guida allo sviluppo del modulo
- Struttura del modulo
- Creazione del tuo primo modulo

---

## Documentazione correlata

- Guasti all'installazione del modulo
- Struttura del modulo
- FAQ prestazioni
- Abilita modalità debug

---

#xoops #modules #faq #troubleshooting
