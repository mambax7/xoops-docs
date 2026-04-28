---
title: "XMF Module Helper"
description: 'Operazioni di modulo semplificate usando la classe Xmf\Module\Helper e helper correlati'
---

La classe `Xmf\Module\Helper` fornisce un modo facile di accedere alle informazioni relative al modulo, configurazioni, handler e altro. L'utilizzo del module helper semplifica il vostro codice e riduce il boilerplate.

## Panoramica

L'helper del modulo fornisce:

- Accesso semplificato alla configurazione
- Recupero dell'oggetto del modulo
- Istanziazione dei handler
- Risoluzione di percorsi e URL
- Helper di permessi e sessione
- Gestione della cache

## Ottenere un Module Helper

### Uso di Base

```php
use Xmf\Module\Helper;

// Ottieni helper per un modulo specifico
$helper = Helper::getHelper('mymodule');

// L'helper è automaticamente associato alla cartella del modulo
```

### Dal Modulo Corrente

Se non specificate un nome di modulo, utilizza il modulo attivo corrente:

```php
$helper = Helper::getHelper('');
// oppure
$helper = Helper::getHelper(basename(__DIR__));
```

## Accesso alla Configurazione

### Modo XOOPS Tradizionale

Ottenere la configurazione del modulo nel modo vecchio è verboso:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### Modo XMF

Con il module helper, lo stesso compito diventa semplice:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## Metodi dell'Helper

### getModule()

Ritorna l'oggetto XoopsModule per il modulo dell'helper.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

Ritorna un valore di configurazione del modulo o tutte le configurazioni.

```php
// Ottieni singola configurazione con default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Ottieni tutte le configurazioni come array
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

Ritorna un object handler per il modulo.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Utilizza l'handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### loadLanguage($name)

Carica un file di lingua per il modulo.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

Controlla se questo modulo è il modulo attivo corrente.

```php
if ($helper->isCurrentModule()) {
    // Siamo nelle pagine del modulo
} else {
    // Chiamato da un altro modulo o posizione
}
```

### isUserAdmin()

Controlla se l'utente corrente ha diritti di admin per questo modulo.

```php
if ($helper->isUserAdmin()) {
    // Mostra opzioni di admin
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## Metodi di Percorsi e URL

### url($url)

Ritorna un URL assoluto per un percorso relativo al modulo.

```php
$logoUrl = $helper->url('images/logo.png');
// Ritorna: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Ritorna: https://example.com/modules/mymodule/admin/index.php
```

### path($path)

Ritorna un percorso filesystem assoluto per un percorso relativo al modulo.

```php
$templatePath = $helper->path('templates/view.tpl');
// Ritorna: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

Ritorna un URL assoluto per i file di upload del modulo.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### uploadPath($path)

Ritorna un percorso filesystem assoluto per i file di upload del modulo.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### redirect($url, $time, $message)

Reindirizza all'interno del modulo verso un URL relativo al modulo.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## Supporto del Debug

### setDebug($bool)

Abilita o disabilita la modalità debug per l'helper.

```php
$helper->setDebug(true);  // Abilita
$helper->setDebug(false); // Disabilita
$helper->setDebug();      // Abilita (default è true)
```

### addLog($log)

Aggiunge un messaggio al log del modulo.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## Classi Helper Correlate

XMF fornisce helper specializzati che estendono `Xmf\Module\Helper\AbstractHelper`:

### Permission Helper

Vedere ../Recipes/Permission-Helper per documentazione dettagliata.

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Controlla il permesso
if ($permHelper->checkPermission('view', $itemId)) {
    // L'utente ha il permesso
}

// Controlla e reindirizza se non autorizzato
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

### Session Helper

Storage di sessione consapevole del modulo con prefisso automatico della chiave.

```php
$session = new \Xmf\Module\Helper\Session('mymodule');

// Memorizza valore
$session->set('last_viewed', $itemId);

// Recupera valore
$lastViewed = $session->get('last_viewed', 0);

// Elimina valore
$session->del('last_viewed');

// Pulisci tutti i dati di sessione del modulo
$session->destroy();
```

### Cache Helper

Cache consapevole del modulo con prefisso automatico della chiave.

```php
$cache = new \Xmf\Module\Helper\Cache('mymodule');

// Scrivi nella cache (TTL in secondi)
$cache->write('item_' . $id, $itemData, 3600);

// Leggi dalla cache
$data = $cache->read('item_' . $id, null);

// Elimina dalla cache
$cache->delete('item_' . $id);

// Leggi con rigenerazione automatica
$data = $cache->cacheRead(
    'expensive_data',
    function() {
        // Questo viene eseguito solo se cache miss
        return computeExpensiveData();
    },
    3600
);
```

## Esempio Completo

Ecco un esempio completo usando il module helper:

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;
use Xmf\Module\Helper\Session;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Inizializza gli helper
$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');
$session = new Session('mymodule');

// Carica la lingua
$helper->loadLanguage('main');

// Ottieni la configurazione
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableComments = $helper->getConfig('enable_comments', true);

// Gestisci la richiesta
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

require_once XOOPS_ROOT_PATH . '/header.php';

switch ($op) {
    case 'view':
        // Controlla il permesso
        if (!$permHelper->checkPermission('view', $id)) {
            redirect_header($helper->url('index.php'), 3, _NOPERM);
        }

        // Traccia nella sessione
        $session->set('last_viewed', $id);

        // Ottieni handler e elemento
        $itemHandler = $helper->getHandler('items');
        $item = $itemHandler->get($id);

        if (!$item) {
            redirect_header($helper->url('index.php'), 3, 'Item not found');
        }

        // Visualizza l'elemento
        $xoopsTpl->assign('item', $item->toArray());
        break;

    case 'list':
    default:
        $itemHandler = $helper->getHandler('items');

        $criteria = new CriteriaCompo();
        $criteria->setLimit($itemsPerPage);
        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        $items = $itemHandler->getObjects($criteria);
        $xoopsTpl->assign('items', $items);

        // Mostra l'ultimo visualizzato se esiste
        $lastViewed = $session->get('last_viewed', 0);
        if ($lastViewed > 0) {
            $xoopsTpl->assign('last_viewed', $lastViewed);
        }
        break;
}

// Link admin se autorizzato
if ($helper->isUserAdmin()) {
    $xoopsTpl->assign('admin_url', $helper->url('admin/index.php'));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Classe Base AbstractHelper

Tutte le classi helper XMF estendono `Xmf\Module\Helper\AbstractHelper`, che fornisce:

### Costruttore

```php
public function __construct($dirname)
```

Istanzia con un nome di cartella del modulo. Se vuoto, utilizza il modulo corrente.

### dirname()

Ritorna il nome della cartella del modulo associato all'helper.

```php
$dirname = $helper->dirname();
```

### init()

Chiamato dal costruttore dopo il caricamento del modulo. Sovrascrivete nei custom helper per la logica di inizializzazione.

## Creazione di Custom Helper

Potete estendere l'helper per la funzionalità specifica del modulo:

```php
<?php
// mymodule/class/Helper.php
namespace XoopsModules\Mymodule;

class Helper extends \Xmf\Module\Helper\GenericHelper
{
    public function init()
    {
        // Inizializzazione personalizzata
    }

    public function getItemUrl($id)
    {
        return $this->url('item.php?id=' . $id);
    }

    public function getUploadDirectory()
    {
        $path = $this->uploadPath('');
        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }
        return $path;
    }
}
```

## Vedere Anche

- Getting-Started-with-XMF - Utilizzo di base di XMF
- XMF-Request - Gestione delle richieste
- ../Recipes/Permission-Helper - Gestione dei permessi
- ../Recipes/Module-Admin-Pages - Creazione di interfacce di amministrazione

---

#xmf #module-helper #configuration #handlers #session #cache
