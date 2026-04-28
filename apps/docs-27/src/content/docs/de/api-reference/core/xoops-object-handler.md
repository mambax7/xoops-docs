---
title: "XoopsObjectHandler Klasse"
description: "Handler-Basisklasse für CRUD-Operationen auf XoopsObject-Instanzen mit Datenbankpersistenz"
---

Die `XoopsObjectHandler` Klasse und ihre Erweiterung `XoopsPersistableObjectHandler` bieten eine standardisierte Schnittstelle für die Durchführung von CRUD-Operationen (Create, Read, Update, Delete) auf `XoopsObject` Instanzen. Dies implementiert das Data Mapper Muster, das Domain-Logik von Datenbankzugriff trennt.

## Klassenübersicht

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

## Klassenhierarchie

```
XoopsObjectHandler (Abstrakte Basis)
└── XoopsPersistableObjectHandler (Erweiterte Implementierung)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [Custom Module Handler]
```

## XoopsObjectHandler

### Konstruktor

```php
public function __construct(XoopsDatabase $db)
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$db` | XoopsDatabase | Datenbankverbindungsinstanz |

**Beispiel:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### create

Erstellt eine neue Objektinstanz.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$isNew` | bool | Gibt an, ob das Objekt neu ist (Standard: true) |

**Rückgabewert:** `XoopsObject|null` - Neue Objektinstanz

**Beispiel:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### get

Ruft ein Objekt nach seinem Primärschlüssel ab.

```php
abstract public function get(int $id): ?XoopsObject
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$id` | int | Primärschlüsselwert |

**Rückgabewert:** `XoopsObject|null` - Objektinstanz oder null, falls nicht gefunden

**Beispiel:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### insert

Speichert ein Objekt in der Datenbank (Einfügen oder Aktualisieren).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$obj` | XoopsObject | Zu speicherndes Objekt |
| `$force` | bool | Operation erzwingen, auch wenn Objekt unverändert |

**Rückgabewert:** `bool` - True bei Erfolg

**Beispiel:**
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

Löscht ein Objekt aus der Datenbank.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$obj` | XoopsObject | Zu löschendes Objekt |
| `$force` | bool | Löschung erzwingen |

**Rückgabewert:** `bool` - True bei Erfolg

**Beispiel:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XoopsPersistableObjectHandler

Die `XoopsPersistableObjectHandler` erweitert `XoopsObjectHandler` mit zusätzlichen Methoden für Abfragen und Massenoperationen.

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

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$db` | XoopsDatabase | Datenbankverbindung |
| `$table` | string | Tabellenname (ohne Präfix) |
| `$className` | string | Vollständiger Klassenname des Objekts |
| `$keyName` | string | Primärschlüsselfeldname |
| `$identifierName` | string | Benutzerfreundlicher Identifikatorfeldname |

**Beispiel:**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // Tabellenname
            'Article',               // Klassenname
            'article_id',            // Primärschlüssel
            'title'                  // Identifikatorfeldname
        );
    }
}
```

---

### getObjects

Ruft mehrere Objekte ab, die den Kriterien entsprechen.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$criteria` | CriteriaElement | Abfragekriterien (optional) |
| `$idAsKey` | bool | Primärschlüssel als Array-Schlüssel verwenden |
| `$asObject` | bool | Objekte (true) oder Arrays (false) zurückgeben |

**Rückgabewert:** `array` - Array von Objekten oder assoziativen Arrays

**Beispiel:**
```php
$handler = xoops_getHandler('user');

// Alle aktiven Benutzer abrufen
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// Benutzer mit ID als Schlüssel
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // Nach ID zugreifen

// Als Arrays statt Objekte
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```

---

### getCount

Zählt Objekte, die den Kriterien entsprechen.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$criteria` | CriteriaElement | Abfragekriterien (optional) |

**Rückgabewert:** `int` - Anzahl der entsprechenden Objekte

**Beispiel:**
```php
$handler = xoops_getHandler('user');

// Alle Benutzer zählen
$totalUsers = $handler->getCount();

// Aktive Benutzer zählen
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total: $totalUsers, Active: $activeUsers";
```

---

### getAll

Ruft alle Objekte ab (Alias für getObjects ohne Kriterien).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$criteria` | CriteriaElement | Abfragekriterien |
| `$fields` | array | Spezifische Felder zum Abrufen |
| `$asObject` | bool | Als Objekte zurückgeben |
| `$idAsKey` | bool | ID als Array-Schlüssel verwenden |

**Beispiel:**
```php
$handler = xoops_getHandler('module');

// Alle Module abrufen
$modules = $handler->getAll();

// Nur bestimmte Felder abrufen
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getIds

Ruft nur die Primärschlüssel der entsprechenden Objekte ab.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$criteria` | CriteriaElement | Abfragekriterien |

**Rückgabewert:** `array` - Array von Primärschlüsselwerten

**Beispiel:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array von Admin-Benutzer-IDs
```

---

### getList

Ruft eine Schlüssel-Wert-Liste für Dropdown-Menüs ab.

```php
public function getList(CriteriaElement $criteria = null): array
```

**Rückgabewert:** `array` - Assoziatives Array [id => Identifier]

**Beispiel:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// Für Select-Dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### deleteAll

Löscht alle Objekte, die den Kriterien entsprechen.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$criteria` | CriteriaElement | Kriterien für zu löschende Objekte |
| `$force` | bool | Löschung erzwingen |
| `$asObject` | bool | Objekte vor dem Löschen laden (löst Events aus) |

**Rückgabewert:** `bool` - True bei Erfolg

**Beispiel:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Alle Kommentare für einen bestimmten Artikel löschen
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Mit Objektladung löschen (löst Lösch-Events aus)
$handler->deleteAll($criteria, true, true);
```

---

### updateAll

Aktualisiert einen Feldwert für alle entsprechenden Objekte.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$fieldname` | string | Zu aktualisierendes Feld |
| `$fieldvalue` | mixed | Neuer Wert |
| `$criteria` | CriteriaElement | Kriterien für zu aktualisierende Objekte |
| `$force` | bool | Update erzwingen |

**Rückgabewert:** `bool` - True bei Erfolg

**Beispiel:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Alle Artikel eines Autors als Entwurf kennzeichnen
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// Aufrufscount aktualisieren
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```

---

### insert (Erweitert)

Die erweiterte insert-Methode mit zusätzlicher Funktionalität.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Verhalten:**
- Wenn Objekt neu ist (`isNew() === true`): INSERT
- Wenn Objekt existiert (`isNew() === false`): UPDATE
- Ruft `cleanVars()` automatisch auf
- Setzt Auto-Increment-ID auf neuen Objekten

**Beispiel:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Neuen Artikel erstellen
$article = $handler->create();
$article->setVar('title', 'New Article');
$article->setVar('content', 'Content here');
$handler->insert($article);
echo "Created with ID: " . $article->getVar('article_id');

// Existierenden Artikel aktualisieren
$article = $handler->get(5);
$article->setVar('title', 'Updated Title');
$handler->insert($article);
```

---

## Helper-Funktionen

### xoops_getHandler

Globale Funktion zum Abrufen eines Core-Handlers.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$name` | string | Handler-Name (user, module, group, etc.) |
| `$optional` | bool | null statt Fehler zurückgeben |

**Beispiel:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

Ruft einen Modul-spezifischen Handler ab.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$name` | string | Handler-Name |
| `$dirname` | string | Modul-Verzeichnisname |
| `$optional` | bool | null bei Fehler zurückgeben |

**Beispiel:**
```php
// Handler aus aktuellem Modul abrufen
$articleHandler = xoops_getModuleHandler('article');

// Handler aus bestimmtem Modul abrufen
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## Erstellen von benutzerdefinierten Handlern

### Einfache Handler-Implementierung

```php
<?php
namespace XoopsModules\MyModule;

use XoopsPersistableObjectHandler;
use XoopsDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * Handler für Article-Objekte
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
     * Veröffentlichte Artikel abrufen
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
     * Artikel nach Autor abrufen
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
     * Artikel nach Kategorie abrufen
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
     * Artikel suchen
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
     * Beliebte Artikel nach Aufrufsanzahl abrufen
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
     * Aufrufscount erhöhen
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
     * Insert für benutzerdefiniertes Verhalten überschreiben
     */
    public function insert(\XoopsObject $obj, bool $force = false): bool
    {
        // Aktualisierungs-Zeitstempel setzen
        $obj->setVar('updated', time());

        // Falls neu, erstelle Zeitstempel setzen
        if ($obj->isNew()) {
            $obj->setVar('created', time());
        }

        return parent::insert($obj, $force);
    }

    /**
     * Delete für Kaskadenoperationen überschreiben
     */
    public function delete(\XoopsObject $obj, bool $force = false): bool
    {
        // Zugehörige Kommentare löschen
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```

### Verwenden des benutzerdefinierten Handlers

```php
// Handler abrufen
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Neuen Artikel erstellen
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

// Veröffentlichte Artikel abrufen
$articles = $articleHandler->getPublished(10);

// Artikel suchen
$results = $articleHandler->search('xoops');

// Beliebte Artikel abrufen
$popular = $articleHandler->getPopular(5);

// Aufrufscount aktualisieren
$articleHandler->incrementViews($articleId);
```

## Best Practices

1. **Verwenden Sie Criteria für Abfragen**: Verwenden Sie immer Criteria-Objekte für typsichere Abfragen

2. **Erweitern Sie für benutzerdefinierte Methoden**: Fügen Sie Domain-spezifische Abfragemethoden zu Handlern hinzu

3. **Überschreiben Sie insert/delete**: Fügen Sie Kaskadenoperationen und Zeitstempel in Überridden-Methoden hinzu

4. **Verwenden Sie Transaktionen wo nötig**: Umwickeln Sie komplexe Operationen mit Transaktionen

5. **Nutzen Sie getList**: Verwenden Sie `getList()` für Select-Dropdown-Menüs, um Abfragen zu reduzieren

6. **Indexieren Sie Schlüssel**: Stellen Sie sicher, dass in Kriterien verwendete Datenbankfelder indexiert sind

7. **Begrenzen Sie Ergebnisse**: Verwenden Sie immer `setLimit()` für möglicherweise große Ergebnismengen

## Zugehörige Dokumentation

- XoopsObject - Basis-Objektklasse
- ../Database/Criteria - Aufbau von Abfragekriterien
- ../Database/XoopsDatabase - Datenbankoperationen

---

*Siehe auch: [XOOPS Source Code](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
