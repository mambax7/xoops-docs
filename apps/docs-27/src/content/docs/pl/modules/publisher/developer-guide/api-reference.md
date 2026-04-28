---
title: "Publisher - Dokumentacja API"
description: "Kompletna dokumentacja API modułu Publisher zawierająca klasy, metody i przykłady kodu"
---

# Dokumentacja API Publisher

> Kompletna dokumentacja klas, metod, funkcji i punktów końcowych API modułu Publisher.

---

## Struktura Modułu

### Organizacja Klas

```
Klasy Modułu Publisher:

├── Item / ItemHandler
│   ├── Pobierz artykuły
│   ├── Utwórz artykuły
│   ├── Zaktualizuj artykuły
│   └── Usuń artykuły
│
├── Category / CategoryHandler
│   ├── Pobierz kategorie
│   ├── Utwórz kategorie
│   ├── Zaktualizuj kategorie
│   └── Usuń kategorie
│
├── Comment / CommentHandler
│   ├── Pobierz komentarze
│   ├── Utwórz komentarze
│   ├── Moderuj komentarze
│   └── Usuń komentarze
│
└── Helper
    ├── Funkcje narzędziowe
    ├── Funkcje formatowania
    └── Sprawdzenie uprawnień
```

---

## Klasa Item

### Przegląd

Klasa `Item` reprezentuje pojedynczy artykuł/element w Publisher.

**Namespace:** `XoopsModules\Publisher\`

**File:** `modules/publisher/class/Item.php`

### Konstruktor

```php
// Utwórz nowy element
$item = new Item();

// Pobierz istniejący element
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);
```

### Właściwości i Metody

#### Pobierz Właściwości

```php
// Pobierz ID artykułu
$itemId = $item->getVar('itemid');
$itemId = $item->id();

// Pobierz tytuł
$title = $item->getVar('title');
$title = $item->title();

// Pobierz opis
$description = $item->getVar('description');
$description = $item->description();

// Pobierz treść/zawartość
$body = $item->getVar('body');
$body = $item->body();

// Pobierz podtytuł
$subtitle = $item->getVar('subtitle');
$subtitle = $item->subtitle();

// Pobierz autora
$authorId = $item->getVar('uid');
$authorId = $item->authorId();

// Pobierz nazwę autora
$authorName = $item->getVar('uname');
$authorName = $item->uname();

// Pobierz kategorię
$categoryId = $item->getVar('categoryid');
$categoryId = $item->categoryId();

// Pobierz status
$status = $item->getVar('status');
$status = $item->status();

// Pobierz datę publikacji
$date = $item->getVar('datesub');
$date = $item->date();

// Pobierz datę modyfikacji
$modified = $item->getVar('datemod');
$modified = $item->modified();

// Pobierz liczbę wyświetleń
$views = $item->getVar('counter');
$views = $item->views();

// Pobierz obraz
$image = $item->getVar('image');
$image = $item->image();

// Pobierz status wyróżnienia
$featured = $item->getVar('featured');
```

#### Ustaw Właściwości

```php
// Ustaw tytuł
$item->setVar('title', 'Nowy Tytuł Artykułu');

// Ustaw treść
$item->setVar('body', '<p>Treść artykułu tutaj</p>');

// Ustaw opis
$item->setVar('description', 'Krótki opis');

// Ustaw kategorię
$item->setVar('categoryid', 5);

// Ustaw status (0=szkic, 1=opublikowany, itp)
$item->setVar('status', 1);

// Ustaw wyróżnienie
$item->setVar('featured', 1);

// Ustaw obraz
$item->setVar('image', 'path/to/image.jpg');
```

#### Metody

```php
// Pobierz sformatowaną datę
$formatted = $item->date('Y-m-d H:i:s');
$formatted = $item->date('l, F j, Y');

// Pobierz URL elementu
$url = $item->url();

// Pobierz URL kategorii
$catUrl = $item->categoryUrl();

// Sprawdź czy opublikowany
$isPublished = $item->isPublished();

// Pobierz URL edycji
$editUrl = $item->editUrl();

// Pobierz URL usuwania
$deleteUrl = $item->deleteUrl();

// Pobierz wyciąg/streszczenie
$summary = $item->getSummary(100);
$summary = $item->description();

// Pobierz wszystkie tagi
$tags = $item->getTags();

// Pobierz komentarze
$comments = $item->getComments();
$commentCount = $item->getCommentCount();

// Pobierz ocenę
$rating = $item->getRating();

// Pobierz liczbę ocen
$ratingCount = $item->getRatingCount();
```

---

## Klasa ItemHandler

### Przegląd

Klasa `ItemHandler` zarządza operacjami CRUD dla artykułów.

**File:** `modules/publisher/class/ItemHandler.php`

### Pobierz Elementy

```php
// Pobierz pojedynczy element po ID
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

// Pobierz wszystkie elementy
$items = $itemHandler->getAll();

// Pobierz elementy z warunkami
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));  // Tylko opublikowane
$criteria->add(new Criteria('categoryid', 5)); // Określona kategoria
$criteria->setLimit(10);
$criteria->setStart(0);
$items = $itemHandler->getObjects($criteria);

// Pobierz elementy po kategorii
$items = $itemHandler->getByCategory($categoryId, $limit = 10);

// Pobierz ostatnie elementy
$items = $itemHandler->getRecent($limit = 10);

// Pobierz wyróżnione elementy
$items = $itemHandler->getFeatured($limit = 5);

// Policz elementy
$total = $itemHandler->getCount($criteria);
```

### Utwórz Element

```php
// Utwórz nowy element
$item = $itemHandler->create();

// Ustaw właściwości
$item->setVar('title', 'Tytuł Artykułu');
$item->setVar('body', '<p>Zawartość</p>');
$item->setVar('description', 'Krótki opis');
$item->setVar('categoryid', 1);
$item->setVar('uid', $userId);
$item->setVar('status', 0); // Szkic
$item->setVar('datesub', time());

// Zapisz
if ($itemHandler->insert($item)) {
    $itemId = $item->getVar('itemid');
    echo "Artykuł utworzony: " . $itemId;
} else {
    echo "Błąd: " . implode(', ', $item->getErrors());
}
```

### Zaktualizuj Element

```php
// Pobierz element
$item = $itemHandler->get($itemId);

// Modyfikuj
$item->setVar('title', 'Zaktualizowany Tytuł');
$item->setVar('body', '<p>Zaktualizowana treść</p>');
$item->setVar('status', 1); // Opublikuj

// Zapisz
if ($itemHandler->insert($item)) {
    echo "Element zaktualizowany";
} else {
    echo "Błąd: " . implode(', ', $item->getErrors());
}
```

### Usuń Element

```php
// Pobierz element
$item = $itemHandler->get($itemId);

// Usuń
if ($itemHandler->delete($item)) {
    echo "Element usunięty";
} else {
    echo "Błąd podczas usuwania elementu";
}

// Usuń po ID
$itemHandler->deleteByPrimary($itemId);
```

---

## Klasa Category

### Przegląd

Klasa `Category` reprezentuje kategorię lub sekcję.

**File:** `modules/publisher/class/Category.php`

### Metody

```php
// Pobierz ID kategorii
$catId = $category->getVar('categoryid');
$catId = $category->id();

// Pobierz nazwę
$name = $category->getVar('name');
$name = $category->name();

// Pobierz opis
$desc = $category->getVar('description');
$desc = $category->description();

// Pobierz obraz
$image = $category->getVar('image');
$image = $category->image();

// Pobierz kategorię nadrzędną
$parentId = $category->getVar('parentid');
$parentId = $category->parentId();

// Pobierz status
$status = $category->getVar('status');

// Pobierz URL
$url = $category->url();

// Pobierz liczbę elementów
$count = $category->itemCount();

// Pobierz podkategorie
$subs = $category->getSubCategories();

// Pobierz obiekt kategorii nadrzędnej
$parent = $category->getParent();
```

---

## Klasa CategoryHandler

### Przegląd

Klasa `CategoryHandler` zarządza operacjami CRUD kategorii.

**File:** `modules/publisher/class/CategoryHandler.php`

### Pobierz Kategorie

```php
// Pobierz pojedynczą kategorię
$catHandler = xoops_getModuleHandler('Category', 'publisher');
$category = $catHandler->get($categoryId);

// Pobierz wszystkie kategorie
$categories = $catHandler->getAll();

// Pobierz kategorie główne (bez nadrzędnej)
$roots = $catHandler->getRoots();

// Pobierz podkategorie
$subs = $catHandler->getByParent($parentId);

// Pobierz kategorie z warunkami
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$categories = $catHandler->getObjects($criteria);
```

### Utwórz Kategorię

```php
// Utwórz nową
$category = $catHandler->create();

// Ustaw wartości
$category->setVar('name', 'Wiadomości');
$category->setVar('description', 'Elementy wiadomości');
$category->setVar('parentid', 0); // Poziom główny
$category->setVar('status', 1);

// Zapisz
if ($catHandler->insert($category)) {
    $catId = $category->getVar('categoryid');
} else {
    echo "Błąd";
}
```

### Zaktualizuj Kategorię

```php
// Pobierz kategorię
$category = $catHandler->get($categoryId);

// Modyfikuj
$category->setVar('name', 'Zaktualizowana Nazwa');

// Zapisz
$catHandler->insert($category);
```

### Usuń Kategorię

```php
// Pobierz kategorię
$category = $catHandler->get($categoryId);

// Usuń
$catHandler->delete($category);
```

---

## Funkcje Pomocnicze

### Funkcje Narzędziowe

Klasa Helper dostarcza funkcje narzędziowe:

**File:** `modules/publisher/class/Helper.php`

```php
// Pobierz instancję pomocnika
$helper = \XoopsModules\Publisher\Helper::getInstance();

// Pobierz instancję modułu
$module = $helper->getModule();

// Pobierz handler
$itemHandler = $helper->getHandler('Item');
$catHandler = $helper->getHandler('Category');

// Pobierz wartość konfiguracji
$editorName = $helper->getConfig('editor');
$itemsPerPage = $helper->getConfig('items_per_page');

// Sprawdź uprawnienie
$canView = $helper->hasPermission('view', $categoryId);
$canEdit = $helper->hasPermission('edit', $itemId);
$canDelete = $helper->hasPermission('delete', $itemId);
$canApprove = $helper->hasPermission('approve');

// Pobierz URL
$indexUrl = $helper->url('index.php');
$itemUrl = $helper->url('index.php?op=showitem&itemid=' . $itemId);

// Pobierz ścieżkę bazową
$basePath = $helper->getPath();
$templatePath = $helper->getPath('templates');
```

### Funkcje Formatowania

```php
// Sformatuj datę
$formatted = $helper->formatDate($timestamp, 'Y-m-d');

// Skróć tekst
$excerpt = $helper->truncate($text, $length = 100);

// Oczyszcz dane wejściowe
$clean = $helper->sanitize($input);

// Przygotuj dane wyjściowe
$output = $helper->prepare($data);

// Pobierz łańcuch stron
$breadcrumb = $helper->getBreadcrumb($itemId);
```

---

## API JavaScript

### Funkcje JavaScript Frontend

Publisher zawiera API JavaScript do interakcji z frontendem:

```javascript
// Dołącz bibliotekę JS Publisher
<script src="/modules/publisher/assets/js/publisher.js"></script>

// Sprawdź czy obiekt Publisher istnieje
if (typeof Publisher !== 'undefined') {
    // Użyj API Publisher
}

// Pobierz dane artykułu
var item = Publisher.getItem(itemId);
console.log(item.title);
console.log(item.url);

// Pobierz dane kategorii
var category = Publisher.getCategory(categoryId);
console.log(category.name);

// Prześlij ocenę
Publisher.submitRating(itemId, rating, function(response) {
    console.log('Ocena zapisana');
});

// Załaduj więcej artykułów
Publisher.loadMore(categoryId, page, limit, function(articles) {
    // Obsłuż załadowane artykuły
});

// Szukaj artykułów
Publisher.search(query, function(results) {
    // Obsłuż wyniki wyszukiwania
});
```

### Punkty Końcowe Ajax

Publisher dostarcza punkty końcowe AJAX do interakcji z frontendem:

```javascript
// Pobierz artykuł przez AJAX
fetch('/modules/publisher/ajax.php?op=getItem&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));

// Prześlij komentarz przez AJAX
fetch('/modules/publisher/ajax.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'op=addComment&itemid=' + itemId + '&text=' + comment
})
.then(response => response.json())
.then(data => console.log(data));

// Pobierz oceny
fetch('/modules/publisher/ajax.php?op=getRatings&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));
```

---

## REST API (jeśli włączony)

### Punkty Końcowe API

Jeśli Publisher udostępnia REST API:

```
GET /modules/publisher/api/items
GET /modules/publisher/api/items/{id}
GET /modules/publisher/api/categories
GET /modules/publisher/api/categories/{id}
POST /modules/publisher/api/items
PUT /modules/publisher/api/items/{id}
DELETE /modules/publisher/api/items/{id}
```

### Przykładowe Wywołania API

```php
// Pobierz elementy przez REST
$url = 'http://example.com/modules/publisher/api/items';
$response = file_get_contents($url);
$items = json_decode($response, true);

// Pobierz pojedynczy element
$url = 'http://example.com/modules/publisher/api/items/1';
$response = file_get_contents($url);
$item = json_decode($response, true);

// Utwórz element
$url = 'http://example.com/modules/publisher/api/items';
$data = array(
    'title' => 'Nowy Artykuł',
    'body' => 'Treść tutaj',
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

## Schemat Bazy Danych

### Tabele

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
- uid (FK do users)
- title
- subtitle
- description
- body
- image
- status
- featured
- datesub
- datemod
- counter (wyświetlenia)
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

## Zdarzenia i Haki (Events & Hooks)

### Zdarzenia Publisher

```php
// Zdarzenie utworzenia elementu
$modHandler = xoops_getHandler('module');
$modHandler->activateModule('publisher');
$publisher = xoops_getModuleHandler('Item', 'publisher');
xoops_events()->trigger(
    'publisher.item.created',
    array('item' => $item)
);

// Element zaktualizowany
xoops_events()->trigger(
    'publisher.item.updated',
    array('item' => $item)
);

// Element usunięty
xoops_events()->trigger(
    'publisher.item.deleted',
    array('itemid' => $itemId)
);

// Artykuł skomentowany
xoops_events()->trigger(
    'publisher.comment.added',
    array('comment' => $comment)
);
```

### Nasłuchuj Zdarzeń

```php
// Zarejestruj słuchacza zdarzenia
xoops_events()->attach(
    'publisher.item.created',
    array($myClass, 'onItemCreated')
);

// Lub w wtyczce
public function onItemCreated($item) {
    // Obsłuż utworzenie elementu
}
```

---

## Przykłady Kodu

### Pobierz Ostatnie Artykuły

```php
<?php
// Pobierz ostatnio opublikowane artykuły
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1)); // Opublikowane
$criteria->setSort('datesub');
$criteria->setOrder('DESC');
$criteria->setLimit(5);

$items = $itemHandler->getObjects($criteria);

foreach ($items as $item) {
    echo $item->title() . "\n";
    echo $item->date('Y-m-d') . "\n";
    echo $item->description() . "\n";
    echo "<a href='" . $item->url() . "'>Czytaj więcej</a>\n\n";
}
?>
```

### Utwórz Artykuł Programowo

```php
<?php
// Utwórz artykuł
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->create();

$item->setVar('title', 'Artykuł Programowy');
$item->setVar('description', 'Utworzony przez API');
$item->setVar('body', '<p>Pełna zawartość tutaj</p>');
$item->setVar('categoryid', 1);
$item->setVar('uid', 1);
$item->setVar('status', 1); // Opublikowany
$item->setVar('datesub', time());

if ($itemHandler->insert($item)) {
    echo "Artykuł utworzony: " . $item->getVar('itemid');
} else {
    echo "Błąd: " . implode(', ', $item->getErrors());
}
?>
```

### Pobierz Artykuły po Kategorii

```php
<?php
// Pobierz artykuły kategorii
$catId = 5;
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$items = $itemHandler->getByCategory($catId, $limit = 10);

echo "Artykuły w kategorii " . $catId . ":\n";
foreach ($items as $item) {
    echo "- " . $item->title() . "\n";
}
?>
```

### Zaktualizuj Status Artykułu

```php
<?php
// Zmień status artykułu
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

if ($item) {
    $item->setVar('status', 1); // Opublikuj

    if ($itemHandler->insert($item)) {
        echo "Artykuł opublikowany";
    } else {
        echo "Błąd podczas publikowania artykułu";
    }
} else {
    echo "Artykuł nie znaleziony";
}
?>
```

### Pobierz Drzewo Kategorii

```php
<?php
// Zbuduj drzewo kategorii
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

## Obsługa Błędów

### Obsłuż Błędy

```php
<?php
// Obsługa błędów try/catch
try {
    $itemHandler = xoops_getModuleHandler('Item', 'publisher');
    $item = $itemHandler->get($itemId);

    if (!$item) {
        throw new Exception('Element nie znaleziony');
    }

    $item->setVar('title', 'Nowy Tytuł');

    if (!$itemHandler->insert($item)) {
        throw new Exception('Nie udało się zapisać elementu');
    }
} catch (Exception $e) {
    error_log('Błąd Publisher: ' . $e->getMessage());
    // Obsłuż błąd
}
?>
```

### Pobierz Komunikaty Błędów

```php
<?php
// Pobierz komunikaty błędów z obiektu
$item = $itemHandler->create();
// ... ustaw zmienne ...

if (!$itemHandler->insert($item)) {
    $errors = $item->getErrors();
    foreach ($errors as $error) {
        echo "Błąd: " . $error . "\n";
    }
}
?>
```

---

## Powiązana Dokumentacja

- Haki i Zdarzenia
- Własne Szablony
- Analiza Modułu Publisher
- Szablony i Bloki w Publisher
- Tworzenie Artykułów
- Zarządzanie Kategoriami

---

## Zasoby

- [Publisher GitHub](https://github.com/XoopsModules25x/publisher)
- [XOOPS API](../../04-API-Reference/API-Reference.md)
- [Dokumentacja PHP](https://www.php.net/docs.php)

---

#publisher #api #reference #code #classes #methods #xoops
