---
title: "Publisher - Riferimento API"
description: "Riferimento API completo per il modulo Publisher con classi, metodi ed esempi di codice"
---

# Riferimento API Publisher

> Riferimento completo per classi del modulo Publisher, metodi, funzioni ed endpoint API.

---

## Struttura Modulo

### Organizzazione Classi

```
Classi Modulo Publisher:

├── Item / ItemHandler
│   ├── Ottieni articoli
│   ├── Crea articoli
│   ├── Aggiorna articoli
│   └── Elimina articoli
│
├── Category / CategoryHandler
│   ├── Ottieni categorie
│   ├── Crea categorie
│   ├── Aggiorna categorie
│   └── Elimina categorie
│
├── Comment / CommentHandler
│   ├── Ottieni commenti
│   ├── Crea commenti
│   ├── Modera commenti
│   └── Elimina commenti
│
└── Helper
    ├── Funzioni utilità
    ├── Funzioni formato
    └── Controlli autorizzazione
```

---

## Classe Item

### Panoramica

La classe `Item` rappresenta un singolo articolo/elemento in Publisher.

**Namespace:** `XoopsModules\Publisher\`

**File:** `modules/publisher/class/Item.php`

### Costruttore

```php
// Crea nuovo elemento
$item = new Item();

// Ottieni elemento esistente
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);
```

### Proprietà e Metodi

#### Ottieni Proprietà

```php
// Ottieni ID articolo
$itemId = $item->getVar('itemid');
$itemId = $item->id();

// Ottieni titolo
$title = $item->getVar('title');
$title = $item->title();

// Ottieni descrizione
$description = $item->getVar('description');
$description = $item->description();

// Ottieni corpo/contenuto
$body = $item->getVar('body');
$body = $item->body();

// Ottieni sottotitolo
$subtitle = $item->getVar('subtitle');
$subtitle = $item->subtitle();

// Ottieni autore
$authorId = $item->getVar('uid');
$authorId = $item->authorId();

// Ottieni nome autore
$authorName = $item->getVar('uname');
$authorName = $item->uname();

// Ottieni categoria
$categoryId = $item->getVar('categoryid');
$categoryId = $item->categoryId();

// Ottieni stato
$status = $item->getVar('status');
$status = $item->status();

// Ottieni data pubblicazione
$date = $item->getVar('datesub');
$date = $item->date();

// Ottieni data modifica
$modified = $item->getVar('datemod');
$modified = $item->modified();

// Ottieni conteggio visualizzazioni
$views = $item->getVar('counter');
$views = $item->views();

// Ottieni immagine
$image = $item->getVar('image');
$image = $item->image();

// Ottieni stato in evidenza
$featured = $item->getVar('featured');
```

#### Imposta Proprietà

```php
// Imposta titolo
$item->setVar('title', 'Nuovo Titolo Articolo');

// Imposta corpo
$item->setVar('body', '<p>Contenuto articolo qui</p>');

// Imposta descrizione
$item->setVar('description', 'Breve descrizione');

// Imposta categoria
$item->setVar('categoryid', 5);

// Imposta stato (0=bozza, 1=pubblicato, ecc)
$item->setVar('status', 1);

// Imposta in evidenza
$item->setVar('featured', 1);

// Imposta immagine
$item->setVar('image', 'path/to/image.jpg');
```

#### Metodi

```php
// Ottieni data formattata
$formatted = $item->date('Y-m-d H:i:s');
$formatted = $item->date('l, F j, Y');

// Ottieni URL elemento
$url = $item->url();

// Ottieni URL categoria
$catUrl = $item->categoryUrl();

// Verifica se pubblicato
$isPublished = $item->isPublished();

// Ottieni URL modifica
$editUrl = $item->editUrl();

// Ottieni URL eliminazione
$deleteUrl = $item->deleteUrl();

// Ottieni estratto/riepilogo
$summary = $item->getSummary(100);
$summary = $item->description();

// Ottieni tutti i tag
$tags = $item->getTags();

// Ottieni commenti
$comments = $item->getComments();
$commentCount = $item->getCommentCount();

// Ottieni valutazione
$rating = $item->getRating();

// Ottieni conteggio valutazione
$ratingCount = $item->getRatingCount();
```

---

## Classe ItemHandler

### Panoramica

ItemHandler gestisce operazioni CRUD per articoli.

**File:** `modules/publisher/class/ItemHandler.php`

### Recupera Elementi

```php
// Ottieni singolo elemento per ID
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

// Ottieni tutti elementi
$items = $itemHandler->getAll();

// Ottieni elementi con condizioni
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));  // Solo pubblicati
$criteria->add(new Criteria('categoryid', 5)); // Categoria specifica
$criteria->setLimit(10);
$criteria->setStart(0);
$items = $itemHandler->getObjects($criteria);

// Ottieni elementi per categoria
$items = $itemHandler->getByCategory($categoryId, $limit = 10);

// Ottieni elementi recenti
$items = $itemHandler->getRecent($limit = 10);

// Ottieni elementi in evidenza
$items = $itemHandler->getFeatured($limit = 5);

// Conta elementi
$total = $itemHandler->getCount($criteria);
```

### Crea Elemento

```php
// Crea nuovo elemento
$item = $itemHandler->create();

// Imposta proprietà
$item->setVar('title', 'Titolo Articolo');
$item->setVar('body', '<p>Contenuto</p>');
$item->setVar('description', 'Breve desc');
$item->setVar('categoryid', 1);
$item->setVar('uid', $userId);
$item->setVar('status', 0); // Bozza
$item->setVar('datesub', time());

// Salva
if ($itemHandler->insert($item)) {
    $itemId = $item->getVar('itemid');
    echo "Articolo creato: " . $itemId;
} else {
    echo "Errore: " . implode(', ', $item->getErrors());
}
```

### Aggiorna Elemento

```php
// Ottieni elemento
$item = $itemHandler->get($itemId);

// Modifica
$item->setVar('title', 'Titolo Aggiornato');
$item->setVar('body', '<p>Contenuto aggiornato</p>');
$item->setVar('status', 1); // Pubblica

// Salva
if ($itemHandler->insert($item)) {
    echo "Elemento aggiornato";
} else {
    echo "Errore: " . implode(', ', $item->getErrors());
}
```

### Elimina Elemento

```php
// Ottieni elemento
$item = $itemHandler->get($itemId);

// Elimina
if ($itemHandler->delete($item)) {
    echo "Elemento eliminato";
} else {
    echo "Errore eliminazione elemento";
}

// Elimina per ID
$itemHandler->deleteByPrimary($itemId);
```

---

## Classe Category

### Panoramica

La classe `Category` rappresenta una categoria o sezione.

**File:** `modules/publisher/class/Category.php`

### Metodi

```php
// Ottieni ID categoria
$catId = $category->getVar('categoryid');
$catId = $category->id();

// Ottieni nome
$name = $category->getVar('name');
$name = $category->name();

// Ottieni descrizione
$desc = $category->getVar('description');
$desc = $category->description();

// Ottieni immagine
$image = $category->getVar('image');
$image = $category->image();

// Ottieni categoria genitore
$parentId = $category->getVar('parentid');
$parentId = $category->parentId();

// Ottieni stato
$status = $category->getVar('status');

// Ottieni URL
$url = $category->url();

// Ottieni conteggio elementi
$count = $category->itemCount();

// Ottieni sottocategorie
$subs = $category->getSubCategories();

// Ottieni oggetto categoria genitore
$parent = $category->getParent();
```

---

## Classe CategoryHandler

### Panoramica

CategoryHandler gestisce operazioni CRUD categoria.

**File:** `modules/publisher/class/CategoryHandler.php`

### Recupera Categorie

```php
// Ottieni singola categoria
$catHandler = xoops_getModuleHandler('Category', 'publisher');
$category = $catHandler->get($categoryId);

// Ottieni tutte le categorie
$categories = $catHandler->getAll();

// Ottieni categorie radice (senza genitore)
$roots = $catHandler->getRoots();

// Ottieni sottocategorie
$subs = $catHandler->getByParent($parentId);

// Ottieni categorie con criteria
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$categories = $catHandler->getObjects($criteria);
```

### Crea Categoria

```php
// Crea nuovo
$category = $catHandler->create();

// Imposta valori
$category->setVar('name', 'Notizie');
$category->setVar('description', 'Elementi notizie');
$category->setVar('parentid', 0); // Livello radice
$category->setVar('status', 1);

// Salva
if ($catHandler->insert($category)) {
    $catId = $category->getVar('categoryid');
} else {
    echo "Errore";
}
```

### Aggiorna Categoria

```php
// Ottieni categoria
$category = $catHandler->get($categoryId);

// Modifica
$category->setVar('name', 'Nome Aggiornato');

// Salva
$catHandler->insert($category);
```

### Elimina Categoria

```php
// Ottieni categoria
$category = $catHandler->get($categoryId);

// Elimina
$catHandler->delete($category);
```

---

## Funzioni Helper

### Funzioni Utilità

La classe Helper fornisce funzioni utilità:

**File:** `modules/publisher/class/Helper.php`

```php
// Ottieni istanza helper
$helper = \XoopsModules\Publisher\Helper::getInstance();

// Ottieni istanza modulo
$module = $helper->getModule();

// Ottieni handler
$itemHandler = $helper->getHandler('Item');
$catHandler = $helper->getHandler('Category');

// Ottieni valore configurazione
$editorName = $helper->getConfig('editor');
$itemsPerPage = $helper->getConfig('items_per_page');

// Controlla autorizzazione
$canView = $helper->hasPermission('view', $categoryId);
$canEdit = $helper->hasPermission('edit', $itemId);
$canDelete = $helper->hasPermission('delete', $itemId);
$canApprove = $helper->hasPermission('approve');

// Ottieni URL
$indexUrl = $helper->url('index.php');
$itemUrl = $helper->url('index.php?op=showitem&itemid=' . $itemId);

// Ottieni percorso base
$basePath = $helper->getPath();
$templatePath = $helper->getPath('templates');
```

### Funzioni Formato

```php
// Formatta data
$formatted = $helper->formatDate($timestamp, 'Y-m-d');

// Tronca testo
$excerpt = $helper->truncate($text, $length = 100);

// Sanitizza input
$clean = $helper->sanitize($input);

// Prepara output
$output = $helper->prepare($data);

// Ottieni breadcrumb
$breadcrumb = $helper->getBreadcrumb($itemId);
```

---

## JavaScript API

### Funzioni JavaScript Frontend

Publisher include API JavaScript per interazioni frontend:

```javascript
// Includi libreria JS Publisher
<script src="/modules/publisher/assets/js/publisher.js"></script>

// Controlla se esiste oggetto Publisher
if (typeof Publisher !== 'undefined') {
    // Usa API Publisher
}

// Ottieni dati articolo
var item = Publisher.getItem(itemId);
console.log(item.title);
console.log(item.url);

// Ottieni dati categoria
var category = Publisher.getCategory(categoryId);
console.log(category.name);

// Invia valutazione
Publisher.submitRating(itemId, rating, function(response) {
    console.log('Valutazione salvata');
});

// Carica altri articoli
Publisher.loadMore(categoryId, page, limit, function(articles) {
    // Gestisci articoli caricati
});

// Cerca articoli
Publisher.search(query, function(results) {
    // Gestisci risultati ricerca
});
```

### Endpoint Ajax

Publisher fornisce endpoint AJAX per interazioni frontend:

```javascript
// Ottieni articolo via AJAX
fetch('/modules/publisher/ajax.php?op=getItem&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));

// Invia commento via AJAX
fetch('/modules/publisher/ajax.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'op=addComment&itemid=' + itemId + '&text=' + comment
})
.then(response => response.json())
.then(data => console.log(data));

// Ottieni valutazioni
fetch('/modules/publisher/ajax.php?op=getRatings&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));
```

---

## REST API (Se Abilitata)

### Endpoint API

Se Publisher espone REST API:

```
GET /modules/publisher/api/items
GET /modules/publisher/api/items/{id}
GET /modules/publisher/api/categories
GET /modules/publisher/api/categories/{id}
POST /modules/publisher/api/items
PUT /modules/publisher/api/items/{id}
DELETE /modules/publisher/api/items/{id}
```

### Esempio Chiamate API

```php
// Ottieni elementi via REST
$url = 'http://example.com/modules/publisher/api/items';
$response = file_get_contents($url);
$items = json_decode($response, true);

// Ottieni singolo elemento
$url = 'http://example.com/modules/publisher/api/items/1';
$response = file_get_contents($url);
$item = json_decode($response, true);

// Crea elemento
$url = 'http://example.com/modules/publisher/api/items';
$data = array(
    'title' => 'Nuovo Articolo',
    'body' => 'Contenuto qui',
    'categoryid' => 1
);
$options = array(
    'http' => array(
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => json_encode($data)
    )
);
$response = file_get_contents($url, false, stream_context_create($options));
```

---

## Schema Database

### Tabelle

#### publisher_categories

```
- categoryid (PK)
- name
- description
- image
- parentid (FK)
- status
- created
- modified
```

#### publisher_items

```
- itemid (PK)
- categoryid (FK)
- uid (FK a users)
- title
- subtitle
- description
- body
- image
- status
- featured
- datesub
- datemod
- counter (views)
```

#### publisher_comments

```
- commentid (PK)
- itemid (FK)
- uid (FK)
- comment
- datesub
- approved
```

#### publisher_files

```
- fileid (PK)
- itemid (FK)
- filename
- description
- uploaded
```

---

## Eventi e Hook

### Eventi Publisher

```php
// Evento creazione elemento
$modHandler = xoops_getHandler('module');
$modHandler->activateModule('publisher');
$publisher = xoops_getModuleHandler('Item', 'publisher');
xoops_events()->trigger(
    'publisher.item.created',
    array('item' => $item)
);

// Elemento aggiornato
xoops_events()->trigger(
    'publisher.item.updated',
    array('item' => $item)
);

// Elemento eliminato
xoops_events()->trigger(
    'publisher.item.deleted',
    array('itemid' => $itemId)
);

// Articolo commentato
xoops_events()->trigger(
    'publisher.comment.added',
    array('comment' => $comment)
);
```

### Ascolta Eventi

```php
// Registra listener evento
xoops_events()->attach(
    'publisher.item.created',
    array($myClass, 'onItemCreated')
);

// O in plugin
public function onItemCreated($item) {
    // Gestisci creazione elemento
}
```

---

## Esempi di Codice

### Ottieni Articoli Recenti

```php
<?php
// Ottieni articoli pubblicati recenti
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1)); // Pubblicato
$criteria->setSort('datesub');
$criteria->setOrder('DESC');
$criteria->setLimit(5);

$items = $itemHandler->getObjects($criteria);

foreach ($items as $item) {
    echo $item->title() . "\n";
    echo $item->date('Y-m-d') . "\n";
    echo $item->description() . "\n";
    echo "<a href='" . $item->url() . "'>Leggi Di Più</a>\n\n";
}
?>
```

### Crea Articolo Programmaticamente

```php
<?php
// Crea articolo
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->create();

$item->setVar('title', 'Articolo Programmatico');
$item->setVar('description', 'Creato via API');
$item->setVar('body', '<p>Contenuto completo qui</p>');
$item->setVar('categoryid', 1);
$item->setVar('uid', 1);
$item->setVar('status', 1); // Pubblicato
$item->setVar('datesub', time());

if ($itemHandler->insert($item)) {
    echo "Articolo creato: " . $item->getVar('itemid');
} else {
    echo "Errore: " . implode(', ', $item->getErrors());
}
?>
```

### Ottieni Articoli per Categoria

```php
<?php
// Ottieni articoli categoria
$catId = 5;
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$items = $itemHandler->getByCategory($catId, $limit = 10);

echo "Articoli nella categoria " . $catId . ":\n";
foreach ($items as $item) {
    echo "- " . $item->title() . "\n";
}
?>
```

### Aggiorna Stato Articolo

```php
<?php
// Cambia stato articolo
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

if ($item) {
    $item->setVar('status', 1); // Pubblica

    if ($itemHandler->insert($item)) {
        echo "Articolo pubblicato";
    } else {
        echo "Errore pubblicazione articolo";
    }
} else {
    echo "Articolo non trovato";
}
?>
```

### Ottieni Albero Categorie

```php
<?php
// Crea albero categorie
$catHandler = xoops_getModuleHandler('Category', 'publisher');
$roots = $catHandler->getRoots();

function displayTree($category, $level = 0) {
    echo str_repeat("  ", $level) . $category->name() . "\n";

    $subs = $category->getSubCategories();
    foreach ($subs as $sub) {
        displayTree($sub, $level + 1);
    }
}

foreach ($roots as $root) {
    displayTree($root);
}
?>
```

---

## Gestione Errori

### Gestisci Errori

```php
<?php
// Try/catch gestione errori
try {
    $itemHandler = xoops_getModuleHandler('Item', 'publisher');
    $item = $itemHandler->get($itemId);

    if (!$item) {
        throw new Exception('Elemento non trovato');
    }

    $item->setVar('title', 'Nuovo Titolo');

    if (!$itemHandler->insert($item)) {
        throw new Exception('Errore salvataggio elemento');
    }
} catch (Exception $e) {
    error_log('Errore Publisher: ' . $e->getMessage());
    // Gestisci errore
}
?>
```

### Ottieni Messaggi Errore

```php
<?php
// Ottieni messaggi errore da oggetto
$item = $itemHandler->create();
// ... imposta variabili ...

if (!$itemHandler->insert($item)) {
    $errors = $item->getErrors();
    foreach ($errors as $error) {
        echo "Errore: " . $error . "\n";
    }
}
?>
```

---

## Documentazione Correlata

- Hook e Eventi
- Template Personalizzati
- Analisi Modulo Publisher
- Template e Blocchi in Publisher
- Creazione Articoli
- Gestione Categorie

---

## Risorse

- [Publisher GitHub](https://github.com/XoopsModules25x/publisher)
- [XOOPS API](../../04-API-Reference/API-Reference.md)
- [Documentazione PHP](https://www.php.net/docs.php)

---

#publisher #api #reference #code #classes #methods #xoops
