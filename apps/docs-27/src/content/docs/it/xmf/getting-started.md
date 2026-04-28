---
title: "Iniziare con XMF"
description: "Installazione, concetti fondamentali e primi passi con XOOPS Module Framework"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Questa guida copre i concetti fondamentali di XOOPS Module Framework (XMF) e come iniziare a utilizzarlo nei vostri moduli.

## Prerequisiti

- XOOPS 2.5.8 o successivo installato
- PHP 7.2 o successivo
- Conoscenza base della programmazione orientata agli oggetti in PHP

## Comprensione dei Namespace

XMF usa i namespace PHP per organizzare le sue classi e evitare conflitti di nominazione. Tutte le classi XMF sono nello spazio dei nomi `Xmf`.

### Problema dello Spazio Globale

Senza namespace, tutte le classi PHP condividono uno spazio globale. Questo può causare conflitti:

```php
<?php
// Questo entrerebbe in conflitto con ArrayObject della classe PHP
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Errore fatale: Cannot redeclare class ArrayObject
```

### Soluzione dei Namespace

I namespace creano contesti di naming isolati:

```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Nessun conflitto - questo è \MyNamespace\ArrayObject
```

### Utilizzo dei Namespace XMF

Potete referenziare le classi XMF in diversi modi:

**Percorso completo dello spazio dei nomi:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**Con dichiarazione use:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**Importazioni multiple:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## Autoloading

Una delle maggiori comodità di XMF è il caricamento automatico delle classi. Non dovrete mai includere manualmente i file delle classi XMF.

### Caricamento XOOPS Tradizionale

Il modo vecchio richiedeva caricamento esplicito:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### Autoloading XMF

Con XMF, le classi si caricano automaticamente quando referenziate:

```php
$input = Xmf\Request::getString('input', '');
```

Oppure con una dichiarazione use:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

L'autoloader segue lo standard [PSR-4](http://www.php-fig.org/psr/psr-4/) e gestisce anche le dipendenze di cui XMF si affida.

## Esempi di Utilizzo di Base

### Lettura dell'Input della Richiesta

```php
use Xmf\Request;

// Ottieni valore intero con default di 0
$id = Request::getInt('id', 0);

// Ottieni valore stringa con default stringa vuota
$title = Request::getString('title', '');

// Ottieni comando (alfanumerico, minuscolo)
$op = Request::getCmd('op', 'list');

// Ottieni email con validazione
$email = Request::getEmail('email', '');

// Ottieni da hash specifico (POST, GET, etc.)
$formData = Request::getString('data', '', 'POST');
```

### Utilizzo del Module Helper

```php
use Xmf\Module\Helper;

// Ottieni helper per il tuo modulo
$helper = Helper::getHelper('mymodule');

// Leggi la configurazione del modulo
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// Accedi all'oggetto del modulo
$module = $helper->getModule();
$version = $module->getVar('version');

// Ottieni un handler
$itemHandler = $helper->getHandler('items');

// Carica il file della lingua
$helper->loadLanguage('admin');

// Controlla se modulo corrente
if ($helper->isCurrentModule()) {
    // Siamo in questo modulo
}

// Controlla i diritti di admin
if ($helper->isUserAdmin()) {
    // L'utente ha accesso admin
}
```

### Helper di Percorsi e URL

```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// Ottieni l'URL del modulo
$moduleUrl = $helper->url('images/logo.png');
// Ritorna: https://example.com/modules/mymodule/images/logo.png

// Ottieni il percorso del modulo
$modulePath = $helper->path('templates/view.tpl');
// Ritorna: /var/www/html/modules/mymodule/templates/view.tpl

// Percorsi di upload
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```

## Debug con XMF

XMF fornisce strumenti di debug utili:

```php
// Dump di una variabile con formattazione piacevole
\Xmf\Debug::dump($myVariable);

// Dump di variabili multiple
\Xmf\Debug::dump($var1, $var2, $var3);

// Dump di dati POST
\Xmf\Debug::dump($_POST);

// Mostra uno stack trace
\Xmf\Debug::backtrace();
```

L'output di debug è collassabile e mostra oggetti e array in un formato facile da leggere.

## Raccomandazione della Struttura del Progetto

Quando costruite moduli basati su XMF, organizzate il vostro codice:

```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Helper personalizzato opzionale
    ItemHandler.php     # I vostri handler
  include/
    common.php
  language/
    english/
      main.php
      admin.php
      modinfo.php
  templates/
    mymodule_index.tpl
  index.php
  xoops_version.php
```

## Pattern di Include Comune

Un tipico punto di ingresso del modulo:

```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Ottieni operazione dalla richiesta
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Includi header XOOPS
require_once XOOPS_ROOT_PATH . '/header.php';

// La vostra logica del modulo qui
switch ($op) {
    case 'view':
        // Gestisci view
        break;
    case 'list':
    default:
        // Gestisci list
        break;
}

// Includi footer XOOPS
require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Prossimi Passi

Ora che comprendete le basi, esplorate:

- XMF-Request - Documentazione dettagliata sulla gestione delle richieste
- XMF-Module-Helper - Riferimento completo del module helper
- ../Recipes/Permission-Helper - Gestione dei permessi utente
- ../Recipes/Module-Admin-Pages - Costruzione di interfacce di amministrazione

## Vedere Anche

- ../XMF-Framework - Panoramica del framework
- ../Reference/JWT - Supporto JSON Web Token
- ../Reference/Database - Utilità di database

---

#xmf #getting-started #namespaces #autoloading #basics
