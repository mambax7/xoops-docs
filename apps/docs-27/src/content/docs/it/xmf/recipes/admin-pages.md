---
title: "Pagine di Amministrazione del Modulo"
description: "Creazione di pagine di amministrazione standardizzate e forward-compatible con XMF"
---

La classe `Xmf\Module\Admin` fornisce un modo coerente di creare interfacce di amministrazione dei moduli. L'utilizzo di XMF per le pagine admin assicura la compatibilità forward con le versioni future di XOOPS mantenendo un'esperienza utente uniforme.

## Panoramica

La classe ModuleAdmin in XOOPS Frameworks ha reso l'amministrazione più facile, ma la sua API si è evoluta tra le versioni. Il wrapper `Xmf\Module\Admin`:

- Fornisce un'API stabile che funziona tra le versioni XOOPS
- Gestisce automaticamente le differenze API tra le versioni
- Assicura che il vostro codice admin sia forward-compatible
- Offre metodi statici convenienti per i compiti comuni

## Iniziare

### Creazione di un'Istanza Admin

```php
$admin = \Xmf\Module\Admin::getInstance();
```

Questo ritorna sia un'istanza `Xmf\Module\Admin` che una classe nativa del sistema se già compatibile.

## Gestione delle Icone

### Il Problema della Posizione delle Icone

Le icone si sono spostate tra le versioni XOOPS, causando problemi di manutenzione. XMF risolve questo con metodi di utilità.

### Ricerca delle Icone

**Modo vecchio (dipendente dalla versione):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**Modo XMF:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

Il metodo `iconUrl()` ritorna un URL completo, quindi non dovete preoccuparvi della costruzione del percorso.

### Dimensioni delle Icone

```php
// Icone 16x16
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// Icone 32x32 (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Solo il percorso (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### Icone di Menu

Per i file admin menu.php:

**Modo vecchio:**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon32 = $module->getInfo('icons32');

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => '../../' . $pathIcon32 . '/home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => '../../' . $pathIcon32 . '/about.png'
];
```

**Modo XMF:**
```php
// Ottieni percorso delle icone
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## Pagine di Amministrazione Standardizzate

### Pagina di Indice

**Formato vecchio:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**Formato XMF:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### Pagina About

**Formato vecchio:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**Formato XMF:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **Nota:** Nelle versioni future di XOOPS, le informazioni di PayPal sono impostate in xoops_version.php. La chiamata `setPaypal()` assicura la compatibilità con le versioni correnti senza avere effetto nelle versioni più nuove.

## Navigazione

### Visualizzazione del Menu di Navigazione

```php
$admin = \Xmf\Module\Admin::getInstance();

// Visualizza la navigazione per la pagina corrente
$admin->displayNavigation('items.php');

// O ottieni la stringa HTML
$navHtml = $admin->renderNavigation('items.php');
```

## Box di Informazioni

### Creazione di Box di Informazioni

```php
$admin = \Xmf\Module\Admin::getInstance();

// Aggiungi un box di informazioni
$admin->addInfoBox('Module Statistics');

// Aggiungi linee al box di informazioni
$admin->addInfoBoxLine('Total Items: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Active Users: ' . $userCount, 'default', 'blue');

// Visualizza il box di informazioni
$admin->displayInfoBox();
```

## Box di Configurazione

I box di configurazione mostrano i requisiti di sistema e i controlli dello stato.

### Linee di Configurazione di Base

```php
$admin = \Xmf\Module\Admin::getInstance();

// Aggiungi un messaggio semplice
$admin->addConfigBoxLine('Module is properly configured', 'default');

// Controlla se la cartella esiste
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// Controlla la cartella con i permessi
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// Controlla se il modulo è installato
$admin->addConfigBoxLine('xlanguage', 'module');

// Controlla il modulo con avviso invece di errore se mancante
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```

### Metodi di Convenienza

```php
$admin = \Xmf\Module\Admin::getInstance();

// Aggiungi messaggio di errore
$admin->addConfigError('Upload directory is not writable');

// Aggiungi messaggio di successo/accettazione
$admin->addConfigAccept('Database tables verified');

// Aggiungi messaggio di avviso
$admin->addConfigWarning('Cache directory should be cleared');

// Controlla la versione del modulo
$admin->addConfigModuleVersion('xlanguage', '1.0');
```

### Tipi di Config Box

| Tipo | Valore | Comportamento |
|------|-------|----------|
| `default` | Stringa messaggio | Visualizza il messaggio direttamente |
| `folder` | Percorso cartella | Mostra accettazione se esiste, errore se non esiste |
| `chmod` | `[path, permission]` | Controlla che la cartella esista con i permessi |
| `module` | Nome modulo | Accetta se installato, errore se no |
| `module` | `[name, 'warning']` | Accetta se installato, avviso se no |

## Pulsanti Elemento

Aggiungi pulsanti di azione alle pagine admin:

```php
$admin = \Xmf\Module\Admin::getInstance();

// Aggiungi pulsanti
$admin->addItemButton('Add New Item', 'item.php?op=new', 'add');
$admin->addItemButton('Import Items', 'import.php', 'import');

// Visualizza pulsanti (allineati a sinistra per impostazione predefinita)
$admin->displayButton('left');

// O ottieni HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```

## Esempi Completi di Pagina Admin

### index.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Visualizza la navigazione
$adminObject->displayNavigation(basename(__FILE__));

// Aggiungi box di informazioni con statistiche
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// Controlla la configurazione
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// Controlla moduli opzionali
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// Visualizza la pagina di indice
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```

### items.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Ottieni operazione
$op = \Xmf\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // Aggiungi pulsanti di azione
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // Elenca gli elementi
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // Visualizza la tabella
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // Codice di gestione del form...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```

### about.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// Imposta ID PayPal per le donazioni (opzionale)
\Xmf\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// Visualizza la pagina about
// Passa false per nascondere il logo XOOPS, true per mostrarlo
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```

### menu.php

```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// Ottieni il percorso dell'icona usando XMF
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// Elementi
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// Categorie
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// Permessi
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// About
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## Riferimento API

### Metodi Statici

| Metodo | Descrizione |
|--------|-------------|
| `getInstance()` | Ottieni istanza admin |
| `iconUrl($name, $size)` | Ottieni URL icona (size: 16 o 32) |
| `menuIconPath($image)` | Ottieni percorso icona per menu.php |
| `setPaypal($paypal)` | Imposta ID PayPal per la pagina about |

### Metodi di Istanza

| Metodo | Descrizione |
|--------|-------------|
| `displayNavigation($menu)` | Visualizza il menu di navigazione |
| `renderNavigation($menu)` | Ritorna HTML di navigazione |
| `addInfoBox($title)` | Aggiungi box di informazioni |
| `addInfoBoxLine($text, $type, $color)` | Aggiungi linea al box di informazioni |
| `displayInfoBox()` | Visualizza il box di informazioni |
| `renderInfoBox()` | Ritorna HTML del box di informazioni |
| `addConfigBoxLine($value, $type)` | Aggiungi linea di controllo config |
| `addConfigError($value)` | Aggiungi errore al box config |
| `addConfigAccept($value)` | Aggiungi successo al box config |
| `addConfigWarning($value)` | Aggiungi avviso al box config |
| `addConfigModuleVersion($moddir, $version)` | Controlla versione modulo |
| `addItemButton($title, $link, $icon, $extra)` | Aggiungi pulsante di azione |
| `displayButton($position, $delimiter)` | Visualizza pulsanti |
| `renderButton($position, $delimiter)` | Ritorna HTML pulsanti |
| `displayIndex()` | Visualizza pagina di indice |
| `renderIndex()` | Ritorna HTML pagina di indice |
| `displayAbout($logo_xoops)` | Visualizza pagina about |
| `renderAbout($logo_xoops)` | Ritorna HTML pagina about |

## Vedere Anche

- ../Basics/XMF-Module-Helper - Classe module helper
- Permission-Helper - Gestione dei permessi
- ../XMF-Framework - Panoramica del framework

---

#xmf #admin #module-development #navigation #icons
