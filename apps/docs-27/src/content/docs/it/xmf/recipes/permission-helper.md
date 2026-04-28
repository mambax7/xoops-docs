---
title: "Permission Helper"
description: "Gestione dei permessi di gruppo XOOPS con XMF Permission Helper"
---

XOOPS ha un sistema di permessi potente e flessibile basato sull'appartenenza al gruppo di utenti. L'XMF Permission Helper semplifica l'uso di questi permessi, riducendo i controlli di permesso complessi a singole chiamate di metodo.

## Panoramica

Il sistema di permessi XOOPS associa i gruppi con:
- ID Modulo
- Nome Permesso
- ID Elemento

Controllare i permessi tradizionalmente richiede di trovare i gruppi di utenti, cercare gli ID dei moduli e interrogare le tabelle dei permessi. L'XMF Permission Helper gestisce tutto questo automaticamente.

## Iniziare

### Creazione di un Permission Helper

```php
// Per il modulo corrente
$permHelper = new \Xmf\Module\Helper\Permission();

// Per un modulo specifico
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```

L'helper utilizza automaticamente i gruppi dell'utente corrente e l'ID del modulo specificato.

## Controllo dei Permessi

### L'Utente Ha Permesso?

Controlla se l'utente corrente ha un permesso specifico per un elemento:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Controlla se l'utente può visualizzare il topic ID 42
$canView = $permHelper->checkPermission('viewtopic', 42);

if ($canView) {
    // Visualizza il topic
} else {
    // Mostra messaggio di accesso negato
}
```

### Controlla con Reindirizzamento

Reindirizza automaticamente gli utenti che non hanno il permesso:

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Reindirizza a index.php dopo 3 secondi se non autorizzato
$permHelper->checkPermissionRedirect(
    'viewtopic',
    $topicId,
    'index.php',
    3,
    'You are not allowed to view that topic'
);

// Il codice qui viene eseguito solo se l'utente ha il permesso
displayTopic($topicId);
```

### Override per Admin

Per impostazione predefinita, gli utenti admin hanno sempre il permesso. Per controllare anche per gli admin:

```php
// Controllo normale - gli admin hanno sempre il permesso
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Controlla anche per gli admin (terzo parametro = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```

### Ottieni ID Elementi Autorizzati

Recupera tutti gli ID degli elementi che specifici gruppi hanno il permesso di accedere:

```php
// Ottieni elementi che i gruppi dell'utente corrente possono visualizzare
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Ottieni elementi che uno specifico gruppo può visualizzare
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Usa nelle query
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```

## Gestione dei Permessi

### Ottieni Gruppi per un Elemento

Trova quali gruppi hanno un permesso specifico:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Ottieni i gruppi che possono visualizzare il topic 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Ritorna: [1, 2, 5] (array di ID gruppo)
```

### Salva Permessi

Concedi il permesso a specifici gruppi:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Consenti ai gruppi 1, 2 e 3 di visualizzare il topic 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```

### Elimina Permessi

Rimuovi tutti i permessi per un elemento (tipicamente quando si elimina l'elemento):

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Elimina il permesso di visualizzazione per questo topic
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```

Per molteplici tipi di permesso:

```php
// Elimina molteplici tipi di permesso contemporaneamente
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```

## Integrazione del Modulo

### Aggiunta di Selezione dei Permessi ai Moduli

L'helper può creare un elemento di modulo per selezionare i gruppi:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Costruisci il tuo modulo
$form = new XoopsThemeForm('Edit Topic', 'topicform', 'save.php');

// Aggiungi campo titolo, ecc.
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $topic->getVar('title')));

// Aggiungi selettore di permessi
$form->addElement(
    $permHelper->getGroupSelectFormForItem(
        'viewtopic',                           // Nome permesso
        $topicId,                              // ID elemento
        'Groups with View Topic Permission'   // Didascalia
    )
);

$form->addElement(new XoopsFormButton('', 'submit', 'Save', 'submit'));
```

### Opzioni Elemento Modulo

La firma completa del metodo:

```php
getGroupSelectFormForItem(
    $gperm_name,      // Nome permesso
    $gperm_itemid,    // ID elemento
    $caption,         // Didascalia elemento modulo
    $name,            // Nome elemento (auto-generato se vuoto)
    $include_anon,    // Includi gruppo anonimo (default: false)
    $size,            // Numero di righe visibili (default: 5)
    $multiple         // Consenti selezione multipla (default: true)
)
```

### Elaborazione dell'Invio del Modulo

```php
use Xmf\Request;

$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = Request::getInt('topic_id', 0);

// Ottieni il nome del campo auto-generato
$fieldName = $permHelper->defaultFieldName('viewtopic', $topicId);

// Ottieni i gruppi selezionati dal modulo
$selectedGroups = Request::getArray($fieldName, [], 'POST');

// Salva i permessi
$permHelper->savePermissionForItem('viewtopic', $topicId, $selectedGroups);
```

### Nome Campo Predefinito

L'helper genera nomi di campo coerenti:

```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Ritorna qualcosa come: 'mymodule_viewtopic_42'
```

## Esempio Completo: Elementi Protetti da Permessi

### Creazione di un Elemento con Permessi

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$op = Request::getCmd('op', 'form');
$itemId = Request::getInt('id', 0);

switch ($op) {
    case 'save':
        // Salva i dati dell'elemento
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
        }

        $item->setVar('title', Request::getString('title', ''));
        $item->setVar('content', Request::getText('content', ''));

        if ($handler->insert($item)) {
            $newId = $item->getVar('item_id');

            // Salva il permesso di visualizzazione
            $viewFieldName = $permHelper->defaultFieldName('view', $newId);
            $viewGroups = Request::getArray($viewFieldName, [], 'POST');
            $permHelper->savePermissionForItem('view', $newId, $viewGroups);

            // Salva il permesso di modifica
            $editFieldName = $permHelper->defaultFieldName('edit', $newId);
            $editGroups = Request::getArray($editFieldName, [], 'POST');
            $permHelper->savePermissionForItem('edit', $newId, $editGroups);

            redirect_header('index.php', 2, 'Item saved');
        }
        break;

    case 'form':
    default:
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
            $itemId = 0;
        }

        $form = new XoopsThemeForm('Edit Item', 'itemform', 'edit.php');
        $form->addElement(new XoopsFormHidden('op', 'save'));
        $form->addElement(new XoopsFormHidden('id', $itemId));

        $form->addElement(new XoopsFormText('Title', 'title', 50, 255, $item->getVar('title')));
        $form->addElement(new XoopsFormTextArea('Content', 'content', $item->getVar('content')));

        // Selettore di permesso di visualizzazione
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('view', $itemId, 'Groups that can view')
        );

        // Selettore di permesso di modifica
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('edit', $itemId, 'Groups that can edit')
        );

        $form->addElement(new XoopsFormButton('', 'submit', 'Save', 'submit'));

        $form->display();
        break;
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### Visualizzazione con Controllo dei Permessi

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Controlla il permesso di visualizzazione - reindirizza se negato
$permHelper->checkPermissionRedirect(
    'view',
    $itemId,
    'index.php',
    3,
    'You do not have permission to view this item'
);

require_once XOOPS_ROOT_PATH . '/header.php';

// L'utente ha il permesso, visualizza l'elemento
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

$xoopsTpl->assign('item', $item->toArray());

// Mostra il pulsante di modifica solo se l'utente ha il permesso di modifica
if ($permHelper->checkPermission('edit', $itemId)) {
    $xoopsTpl->assign('can_edit', true);
    $xoopsTpl->assign('edit_url', $helper->url('edit.php?id=' . $itemId));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### Eliminazione con Pulizia dei Permessi

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Elimina l'elemento
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

if ($item && $handler->delete($item)) {
    // Pulisci tutti i permessi per questo elemento
    $permissionNames = ['view', 'edit', 'delete'];
    $permHelper->deletePermissionForItem($permissionNames, $itemId);

    redirect_header('index.php', 2, 'Item deleted');
}
```

## Riferimento API

| Metodo | Descrizione |
|--------|-------------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | Controlla se l'utente ha il permesso |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | Controlla e reindirizza se negato |
| `getItemIds($name, $groupIds)` | Ottieni ID elementi che i gruppi possono accedere |
| `getGroupsForItem($name, $itemId)` | Ottieni i gruppi con il permesso |
| `savePermissionForItem($name, $itemId, $groups)` | Salva i permessi |
| `deletePermissionForItem($name, $itemId)` | Elimina i permessi |
| `getGroupSelectFormForItem(...)` | Crea elemento selettore modulo |
| `defaultFieldName($name, $itemId)` | Ottieni il nome del campo modulo predefinito |

## Vedere Anche

- ../Basics/XMF-Module-Helper - Documentazione module helper
- Module-Admin-Pages - Creazione di interfaccia di amministrazione
- ../Basics/Getting-Started-with-XMF - Fondamenti di XMF

---

#xmf #permissions #security #groups #forms
