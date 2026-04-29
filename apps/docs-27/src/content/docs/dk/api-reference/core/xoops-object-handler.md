---
title: "XoopsObjectHandler klasse"
description: "Base handler klasse for CRUD operationer på XoopsObject instanser med database persistens"
---

Klassen `XoopsObjectHandler` og dens udvidelse `XoopsPersistableObjectHandler` giver en standardiseret grænseflade til udførelse af CRUD (Create, Read, Update, Delete) operationer på `XoopsObject`-forekomster. Dette implementerer Data Mapper-mønsteret, der adskiller domænelogik fra databaseadgang.

## Klasseoversigt

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

## Klassehierarki

```
XoopsObjectHandler (Abstract Base)
└── XoopsPersistableObjectHandler (Extended Implementation)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [Custom Module Handlers]
```

## XoopsObjectHandler

### Konstruktør

```php
public function __construct(XoopsDatabase $db)
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$db` | XoopsDatabase | Forekomst af databaseforbindelse |

**Eksempel:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### oprette

Opretter en ny objektinstans.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$isNew` | bool | Om objektet er nyt (standard: sand) |

**Returnerer:** `XoopsObject|null` - Ny objektforekomst

**Eksempel:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### få

Henter et objekt ved dets primære nøgle.

```php
abstract public function get(int $id): ?XoopsObject
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$id` | int | Primær nøgleværdi |

**Returnerer:** `XoopsObject|null` - Objektforekomst eller null, hvis det ikke findes

**Eksempel:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### indsæt

Gemmer et objekt i databasen (indsæt eller opdater).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$obj` | XoopsObject | Objekt at gemme |
| `$force` | bool | Tving drift, selvom objektet er uændret |

**Returneringer:** `bool` - Sand på succes

**Eksempel:**
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

### slet

Sletter et objekt fra databasen.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$obj` | XoopsObject | Objekt der skal slettes |
| `$force` | bool | Tving sletning |

**Returneringer:** `bool` - Sand på succes

**Eksempel:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler` udvider `XoopsObjectHandler` med yderligere metoder til forespørgsler og masseoperationer.

### Konstruktør

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$db` | XoopsDatabase | Databaseforbindelse |
| `$table` | streng | Tabelnavn (uden præfiks) |
| `$className` | streng | Objektets fulde klassenavn |
| `$keyName` | streng | Primært nøglefeltnavn |
| `$identifierName` | streng | Menneskelæsbart identifikatorfelt |

**Eksempel:**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // Table name
            'Article',               // Class name
            'article_id',            // Primary key
            'title'                  // Identifier field
        );
    }
}
```

---

### getObjects

Henter flere objekter, der matcher kriterier.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$criteria` | CriteriaElement | Forespørgselskriterier (valgfrit) |
| `$idAsKey` | bool | Brug primærnøgle som arraynøgle |
| `$asObject` | bool | Returner objekter (sand) eller arrays (falsk) |

**Returneringer:** `array` - Array af objekter eller associative arrays

**Eksempel:**
```php
$handler = xoops_getHandler('user');

// Get all active users
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// Get users with ID as key
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // Access by ID

// Get as arrays instead of objects
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```

---

### getCount

Tæller objekter, der matcher kriterier.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$criteria` | CriteriaElement | Forespørgselskriterier (valgfrit) |

**Returneringer:** `int` - Antal matchende objekter

**Eksempel:**
```php
$handler = xoops_getHandler('user');

// Count all users
$totalUsers = $handler->getCount();

// Count active users
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total: $totalUsers, Active: $activeUsers";
```

---

### getAll

Henter alle objekter (alias for getObjects uden kriterier).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$criteria` | CriteriaElement | Forespørgselskriterier |
| `$fields` | række | Specifikke felter at hente |
| `$asObject` | bool | Returner som objekter |
| `$idAsKey` | bool | Brug ID som array-nøgle |

**Eksempel:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getIds

Henter kun de primære nøgler til matchende objekter.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$criteria` | CriteriaElement | Forespørgselskriterier |

**Returneringer:** `array` - Matrix af primære nøgleværdier

**Eksempel:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```

---

### getList

Henter en nøgleværdiliste til rullemenuer.
```php
public function getList(CriteriaElement $criteria = null): array
```

**Returneringer:** `array` - Associativ array [id => identifikator]

**Eksempel:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### sletAlle

Sletter alle objekter, der matcher kriterier.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$criteria` | CriteriaElement | Kriterier for at objekter skal slettes |
| `$force` | bool | Tving sletning |
| `$asObject` | bool | Indlæs objekter før sletning (udløser hændelser) |

**Returneringer:** `bool` - Sand på succes

**Eksempel:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```

---

### opdaterAlle

Opdaterer en feltværdi for alle matchende objekter.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$fieldname` | streng | Felt der skal opdateres |
| `$fieldvalue` | blandet | Ny værdi |
| `$criteria` | CriteriaElement | Kriterier for opdatering af objekter |
| `$force` | bool | Tving opdatering |

**Returneringer:** `bool` - Sand på succes

**Eksempel:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Mark all articles by an author as draft
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// Update view count
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```

---

### indsæt (Udvidet)

Den udvidede indsatsmetode med ekstra funktionalitet.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Adfærd:**
- Hvis objektet er nyt (`isNew() === true`): INSERT
- Hvis objektet findes (`isNew() === false`): UPDATE
- Ringer automatisk til `cleanVars()`
- Indstiller auto-increment ID på nye objekter

**Eksempel:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Create new article
$article = $handler->create();
$article->setVar('title', 'New Article');
$article->setVar('content', 'Content here');
$handler->insert($article);
echo "Created with ID: " . $article->getVar('article_id');

// Update existing article
$article = $handler->get(5);
$article->setVar('title', 'Updated Title');
$handler->insert($article);
```

---

## Hjælpefunktioner

### xoops_getHandler

Global funktion til at hente en kernebehandler.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$name` | streng | Behandlernavn (bruger, modul, gruppe osv.) |
| `$optional` | bool | Returner null i stedet for at udløse fejl |

**Eksempel:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

Henter en modulspecifik handler.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$name` | streng | Behandler navn |
| `$dirname` | streng | Modulkatalognavn |
| `$optional` | bool | Returner null ved fejl |

**Eksempel:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## Oprettelse af brugerdefinerede handlere

### Basic Handler Implementering

```php
<?php
namespace XoopsModules\MyModule;

use XoopsPersistableObjectHandler;
use XoopsDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * Handler for Article objects
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
    /**
     * Constructor
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
     * Get published articles
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
     * Get articles by author
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
     * Get articles by category
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
     * Search articles
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
     * Get popular articles by view count
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
     * Increment view count
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
     * Override insert for custom behavior
     */
    public function insert(\XoopsObject $obj, bool $force = false): bool
    {
        // Set updated timestamp
        $obj->setVar('updated', time());

        // If new, set created timestamp
        if ($obj->isNew()) {
            $obj->setVar('created', time());
        }

        return parent::insert($obj, $force);
    }

    /**
     * Override delete for cascade operations
     */
    public function delete(\XoopsObject $obj, bool $force = false): bool
    {
        // Delete associated comments
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```

### Brug af Custom Handler

```php
// Get the handler
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Create a new article
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

// Get published articles
$articles = $articleHandler->getPublished(10);

// Search articles
$results = $articleHandler->search('xoops');

// Get popular articles
$popular = $articleHandler->getPopular(5);

// Update view count
$articleHandler->incrementViews($articleId);
```

## Bedste praksis

1. **Brug Criteria for Queries**: Brug altid Criteria-objekter til typesikre forespørgsler

2. **Udvid for brugerdefinerede metoder**: Tilføj domænespecifikke forespørgselsmetoder til behandlere

3. **Tilsidesæt indsæt/slet**: Tilføj kaskadehandlinger og tidsstempler i tilsidesættelser

4. **Brug transaktion hvor det er nødvendigt**: Indpak komplekse operationer i transaktioner

5. **Udnyt getList**: Brug `getList()` til udvalgte rullemenuer for at reducere forespørgsler

6. **Indeksnøgler**: Sørg for, at databasefelter, der bruges i kriterier, er indekseret

7. **Begræns resultater**: Brug altid `setLimit()` til potentielt store resultatsæt

## Relateret dokumentation

- XoopsObject - Basisobjektklasse
- ../Database/Criteria - Opbygning af forespørgselskriterier
- ../Database/XoopsDatabase - Databaseoperationer

---

*Se også: [XOOPS kildekode](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
