---
title: "Klasa XoopsObjectHandler"
description: "Klasa handlera bazowa do operacji CRUD na instancjach XoopsObject z trwałością bazy danych"
---

Klasa `XoopsObjectHandler` i jej rozszerzenie `XoopsPersistableObjectHandler` zapewniają standardowy interfejs do wykonywania operacji CRUD (Create, Read, Update, Delete) na instancjach `XoopsObject`. Implementuje to wzorzec Data Mapper, oddzielając logikę domeny od dostępu do bazy danych.

## Przegląd Klasy

```php
namespace Xoops\Core;

abstract class XoopsObjectHandler
{
    protected XoopsDatabase $db;

    public function __construct(XoopsDatabase $db);
    abstract public function create(bool $isNew = true);
    abstract public function get(int $id);
    abstract public function insert(XoopsObject $obj, bool $force = false): bool;
    abstract public function delete(XoopsObject $obj, bool $force = false): bool;
}
```

## Hierarchia Klas

```
XoopsObjectHandler (Klasa Bazowa Abstrakcyjna)
└── XoopsPersistableObjectHandler (Rozszerzona Implementacja)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [Niestandardowe Handlery Modułów]
```

## XoopsObjectHandler

### Konstruktor

```php
public function __construct(XoopsDatabase $db)
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$db` | XoopsDatabase | Instancja połączenia bazy danych |

**Przykład:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### create

Tworzy nową instancję obiektu.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$isNew` | bool | Czy obiekt jest nowy (domyślnie: true) |

**Zwraca:** `XoopsObject|null` - Nowa instancja obiektu

**Przykład:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### get

Pobiera obiekt po kluczu podstawowym.

```php
abstract public function get(int $id): ?XoopsObject
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$id` | int | Wartość klucza podstawowego |

**Zwraca:** `XoopsObject|null` - Instancja obiektu lub null jeśli nie znaleźliśmy

**Przykład:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### insert

Zapisuje obiekt do bazy danych (wstawienie lub aktualizacja).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$obj` | XoopsObject | Obiekt do zapisania |
| `$force` | bool | Wymuś operację nawet jeśli obiekt się nie zmienił |

**Zwraca:** `bool` - True na powodzenie

**Przykład:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'testuser');
$user->setVar('email', 'test@example.com');

if ($handler->insert($user)) {
    echo "User saved with ID: " . $user->getVar('uid');
} else {
    echo "Save failed: " . implode(', ', $user->getErrors());
}
```

---

### delete

Usuwa obiekt z bazy danych.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$obj` | XoopsObject | Obiekt do usunięcia |
| `$force` | bool | Wymuś usunięcie |

**Zwraca:** `bool` - True na powodzenie

**Przykład:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler` rozszerza `XoopsObjectHandler` o dodatkowe metody do wykonywania zapytań i operacji zbiorczych.

### Konstruktor

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$db` | XoopsDatabase | Połączenie bazy danych |
| `$table` | string | Nazwa tabeli (bez prefiksu) |
| `$className` | string | Pełna nazwa klasy obiektu |
| `$keyName` | string | Nazwa pola klucza podstawowego |
| `$identifierName` | string | Pole identyfikatora czytelnego dla człowieka |

**Przykład:**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // Nazwa tabeli
            'Article',               // Nazwa klasy
            'article_id',            // Klucz podstawowy
            'title'                  // Pole identyfikatora
        );
    }
}
```

---

### getObjects

Pobiera wiele obiektów spełniających kryteria.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$criteria` | CriteriaElement | Kryteria zapytania (opcjonalne) |
| `$idAsKey` | bool | Użyj klucza podstawowego jako klucz tablicy |
| `$asObject` | bool | Zwróć obiekty (true) lub tablice (false) |

**Zwraca:** `array` - Tablica obiektów lub tablic asocjacyjnych

**Przykład:**
```php
$handler = xoops_getHandler('user');

// Pobierz wszystkich aktywnych użytkowników
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// Pobierz użytkowników z ID jako klucz
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // Dostęp po ID

// Pobierz jako tablice zamiast obiektów
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```

---

### getCount

Zlicza obiekty spełniające kryteria.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$criteria` | CriteriaElement | Kryteria zapytania (opcjonalne) |

**Zwraca:** `int` - Liczba pasujących obiektów

**Przykład:**
```php
$handler = xoops_getHandler('user');

// Policz wszystkich użytkowników
$totalUsers = $handler->getCount();

// Policz aktywnych użytkowników
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total: $totalUsers, Active: $activeUsers";
```

---

### getAll

Pobiera wszystkie obiekty (alias dla getObjects bez kryteriów).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$criteria` | CriteriaElement | Kryteria zapytania |
| `$fields` | array | Konkretne pola do pobrania |
| `$asObject` | bool | Zwróć jako obiekty |
| `$idAsKey` | bool | Użyj ID jako klucz tablicy |

**Przykład:**
```php
$handler = xoops_getHandler('module');

// Pobierz wszystkie moduły
$modules = $handler->getAll();

// Pobierz tylko określone pola
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getIds

Pobiera tylko klucze podstawowe pasujących obiektów.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$criteria` | CriteriaElement | Kryteria zapytania |

**Zwraca:** `array` - Tablica wartości kluczy podstawowych

**Przykład:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Tablica identyfikatorów administratorów
```

---

### getList

Pobiera listę klucz-wartość dla rozwijanek.

```php
public function getList(CriteriaElement $criteria = null): array
```

**Zwraca:** `array` - Tablica asocjacyjna [id => identifier]

**Przykład:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// Dla rozwinięcia select
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### deleteAll

Usuwa wszystkie obiekty spełniające kryteria.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$criteria` | CriteriaElement | Kryteria dla obiektów do usunięcia |
| `$force` | bool | Wymuś usunięcie |
| `$asObject` | bool | Załaduj obiekty przed usunięciem (wyzwala zdarzenia) |

**Zwraca:** `bool` - True na powodzenie

**Przykład:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Usuń wszystkie komentarze dla konkretnego artykułu
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Usuń z załadowaniem obiektu (wyzwala zdarzenia usunięcia)
$handler->deleteAll($criteria, true, true);
```

---

### updateAll

Aktualizuje wartość pola dla wszystkich pasujących obiektów.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$fieldname` | string | Pole do aktualizacji |
| `$fieldvalue` | mixed | Nowa wartość |
| `$criteria` | CriteriaElement | Kryteria dla obiektów do aktualizacji |
| `$force` | bool | Wymuś aktualizację |

**Zwraca:** `bool` - True na powodzenie

**Przykład:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Oznacz wszystkie artykuły autora jako wersja robocza
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// Aktualizuj liczbę wyświetleń
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```

---

### insert (Rozszerzone)

Rozszerzona metoda insert z dodatkową funkcjonalnością.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Zachowanie:**
- Jeśli obiekt jest nowy (`isNew() === true`): INSERT
- Jeśli obiekt istnieje (`isNew() === false`): UPDATE
- Automatycznie wywołuje `cleanVars()`
- Ustawia ID autoznaacznika na nowych obiektach

**Przykład:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Utwórz nowy artykuł
$article = $handler->create();
$article->setVar('title', 'New Article');
$article->setVar('content', 'Content here');
$handler->insert($article);
echo "Created with ID: " . $article->getVar('article_id');

// Zaktualizuj istniejący artykuł
$article = $handler->get(5);
$article->setVar('title', 'Updated Title');
$handler->insert($article);
```

---

## Funkcje Pomocnicze

### xoops_getHandler

Globalna funkcja do pobrania handlera podstawowego.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$name` | string | Nazwa handlera (user, module, group, itp.) |
| `$optional` | bool | Zwróć null zamiast wywoływać błąd |

**Przykład:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

Pobiera handler specyficzny dla modułu.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$name` | string | Nazwa handlera |
| `$dirname` | string | Nazwa katalogu modułu |
| `$optional` | bool | Zwróć null w przypadku niepowodzenia |

**Przykład:**
```php
// Pobierz handler z bieżącego modułu
$articleHandler = xoops_getModuleHandler('article');

// Pobierz handler z konkretnego modułu
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## Tworzenie Niestandardowych Handlerów

### Podstawowa Implementacja Handlera

```php
<?php
namespace XoopsModules\MyModule;

use XoopsPersistableObjectHandler;
use XoopsDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * Handler dla obiektów Article
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
    /**
     * Konstruktor
     */
    public function __construct(XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'mymodule_articles',
            Article::class,
            'article_id',
            'title'
        );
    }

    /**
     * Pobierz opublikowane artykuły
     */
    public function getPublished(int $limit = 10, int $start = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->add(new Criteria('publish_date', time(), '<='));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * Pobierz artykuły po autorze
     */
    public function getByAuthor(int $authorId, bool $publishedOnly = true): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('author_id', $authorId));

        if ($publishedOnly) {
            $criteria->add(new Criteria('published', 1));
        }

        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Pobierz artykuły po kategorii
     */
    public function getByCategory(int $categoryId, int $limit = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('category_id', $categoryId));
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        if ($limit > 0) {
            $criteria->setLimit($limit);
        }

        return $this->getObjects($criteria);
    }

    /**
     * Wyszukaj artykuły
     */
    public function search(string $query, array $fields = ['title', 'content']): array
    {
        $criteria = new CriteriaCompo();
        $searchCriteria = new CriteriaCompo();

        foreach ($fields as $field) {
            $searchCriteria->add(
                new Criteria($field, '%' . $query . '%', 'LIKE'),
                'OR'
            );
        }

        $criteria->add($searchCriteria);
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Pobierz popularne artykuły po liczbie wyświetleń
     */
    public function getPopular(int $limit = 5): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('views');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    /**
     * Zwiększ liczbę wyświetleń
     */
    public function incrementViews(int $articleId): bool
    {
        $sql = sprintf(
            "UPDATE %s SET views = views + 1 WHERE article_id = %d",
            $this->db->prefix($this->table),
            $articleId
        );

        return $this->db->queryF($sql) !== false;
    }

    /**
     * Zastąp insert dla niestandardowego zachowania
     */
    public function insert(\XoopsObject $obj, bool $force = false): bool
    {
        // Ustaw znacznik czasu aktualizacji
        $obj->setVar('updated', time());

        // Jeśli nowy, ustaw znacznik czasu utworzenia
        if ($obj->isNew()) {
            $obj->setVar('created', time());
        }

        return parent::insert($obj, $force);
    }

    /**
     * Zastąp delete dla operacji kaskadowych
     */
    public function delete(\XoopsObject $obj, bool $force = false): bool
    {
        // Usuń powiązane komentarze
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```

### Używanie Niestandardowego Handlera

```php
// Pobierz handler
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Utwórz nowy artykuł
$article = $articleHandler->create();
$article->setVars([
    'title' => 'My New Article',
    'content' => 'Article content here...',
    'author_id' => $xoopsUser->getVar('uid'),
    'category_id' => 1,
    'published' => 1,
    'publish_date' => time()
]);

if ($articleHandler->insert($article)) {
    redirect_header('article.php?id=' . $article->getVar('article_id'), 2, 'Article created');
}

// Pobierz opublikowane artykuły
$articles = $articleHandler->getPublished(10);

// Wyszukaj artykuły
$results = $articleHandler->search('xoops');

// Pobierz popularne artykuły
$popular = $articleHandler->getPopular(5);

// Aktualizuj liczbę wyświetleń
$articleHandler->incrementViews($articleId);
```

## Najlepsze Praktyki

1. **Używaj Kryteriów do Zapytań**: Zawsze używaj obiektów Criteria dla zapytań bezpiecznych typem

2. **Rozszerz dla Metod Niestandardowych**: Dodaj metody zapytań specyficzne dla domeny do handlerów

3. **Zastąp insert/delete**: Dodaj operacje kaskadowe i znaczniki czasu w zastąpieniach

4. **Używaj Transakcji Gdzie Potrzeba**: Opakowuj złożone operacje w transakcje

5. **Korzystaj z getList**: Używaj `getList()` dla rozwinięć select, aby zmniejszyć liczbę zapytań

6. **Indeksuj Klucze**: Upewnij się, że pola bazy danych używane w kryteriach są indeksowane

7. **Ogranicz Wyniki**: Zawsze używaj `setLimit()` dla potencjalnie dużych zestawów wyników

## Powiązana Dokumentacja

- XoopsObject - Klasa obiektu bazowego
- ../Database/Criteria - Budowanie kryteriów zapytań
- ../Database/XoopsDatabase - Operacje bazy danych

---

*Patrz też: [Kod Źródłowy XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
