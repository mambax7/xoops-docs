---
title: "XOOPSObjectHandler osztály"
description: "Alapkezelő osztály CRUD-műveletekhez XOOPSObject példányokon, adatbázis-perzisztenciával"
---
A `XOOPSObjectHandler` osztály és a `XOOPSPersistableObjectHandler` kiterjesztése szabványos felületet biztosít a CRUD (létrehozás, olvasás, frissítés, törlés) műveletek végrehajtásához a `XOOPSObject` példányokon. Ez megvalósítja a Data Mapper mintát, elválasztva a tartomány logikáját az adatbázis-hozzáféréstől.

## Osztály áttekintése

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

## Osztályhierarchia

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

## XOOPSObjectHandler

### Konstruktor

```php
public function __construct(XoopsDatabase $db)
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$db` | XOOPSDatabase | Adatbázis-kapcsolati példány |

**Példa:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### létrehozni

Új objektumpéldányt hoz létre.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$isNew` | bool | Az objektum új-e (alapértelmezett: igaz) |

**Vissza:** `XOOPSObject|null` - Új objektumpéldány

**Példa:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### kap

Lekér egy objektumot az elsődleges kulcsával.

```php
abstract public function get(int $id): ?XoopsObject
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$id` | int | Elsődleges kulcs értéke |

**Vissza:** `XOOPSObject|null` - Objektumpéldány vagy nulla, ha nem található

**Példa:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### beszúrás

Objektumot ment az adatbázisba (beszúrás vagy frissítés).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$obj` | XOOPSObject | Mentendő objektum |
| `$force` | bool | Működés kényszerítése akkor is, ha az objektum változatlan |

**Visszaküldés:** `bool` - Igaz a sikerre

**Példa:**
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

### törlés

Töröl egy objektumot az adatbázisból.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$obj` | XOOPSObject | Törölendő objektum |
| `$force` | bool | Törlés kényszerítése |

**Visszaküldés:** `bool` - Igaz a sikerre

**Példa:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XOOPSPersistableObjectHandler

A `XOOPSPersistableObjectHandler` további módszerekkel bővíti a `XOOPSObjectHandler` lekérdezési és tömeges műveleteket.

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

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$db` | XOOPSDatabase | Adatbázis kapcsolat |
| `$table` | húr | A táblázat neve (előtag nélkül) |
| `$className` | húr | Az objektum teljes osztályneve |
| `$keyName` | húr | Elsődleges kulcs mező neve |
| `$identifierName` | húr | Ember által olvasható azonosító mező |

**Példa:**
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

Több objektumot kér le, amelyek megfelelnek a feltételeknek.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$criteria` | CriteriaElement | Lekérdezési feltételek (nem kötelező) |
| `$idAsKey` | bool | Az elsődleges kulcs használata tömbkulcsként |
| `$asObject` | bool | Objektumok visszaadása (igaz) vagy tömbök (hamis) |

**Vissza:** `array` - Objektumok vagy asszociatív tömbök tömbje

**Példa:**
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

Megszámolja a feltételeknek megfelelő objektumokat.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$criteria` | CriteriaElement | Lekérdezési feltételek (nem kötelező) |

**Visszaküldés:** `int` - Egyező objektumok száma

**Példa:**
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

Lekéri az összes objektumot (a getObjects álneve feltételek nélkül).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$criteria` | CriteriaElement | Lekérdezési feltételek |
| `$fields` | tömb | Meghatározott lekérendő mezők |
| `$asObject` | bool | Vissza objektumként |
| `$idAsKey` | bool | A ID használata tömbkulcsként |

**Példa:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getIds

Csak az egyező objektumok elsődleges kulcsait kéri le.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$criteria` | CriteriaElement | Lekérdezési feltételek |

**Vissza:** `array` - Az elsődleges kulcs értékeinek tömbje

**Példa:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```

---

### getList

Lekér egy kulcsérték-listát a legördülő menükhöz.

```php
public function getList(CriteriaElement $criteria = null): array
```
**Vissza:** `array` – asszociatív tömb [id => azonosító]

**Példa:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### Mindent töröl

Törli az összes kritériumnak megfelelő objektumot.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$criteria` | CriteriaElement | Törölendő objektumok kritériumai |
| `$force` | bool | Törlés kényszerítése |
| `$asObject` | bool | Objektumok betöltése törlés előtt (események kiváltása) |

**Visszaküldés:** `bool` - Igaz a sikerre

**Példa:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```

---

### updateAll

Frissít egy mezőértéket az összes egyező objektumhoz.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$fieldname` | húr | Frissítendő mező |
| `$fieldvalue` | vegyes | Új érték |
| `$criteria` | CriteriaElement | A frissítendő objektumok kritériumai |
| `$force` | bool | Frissítés kényszerítése |

**Visszaküldés:** `bool` - Igaz a sikerre

**Példa:**
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

### beszúrás (bővített)

A kiterjesztett beillesztési módszer további funkciókkal.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Viselkedés:**
- Ha az objektum új (`isNew() === true`): INSERT
- Ha létezik objektum (`isNew() === false`): UPDATE
- Automatikusan hívja a `cleanVars()`-t
- Beállítja az automatikus növekedés ID új objektumokon

**Példa:**
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

## Segítő funkciók

### xoops_getHandler

Globális függvény a központi kezelő lekéréséhez.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$name` | húr | Kezelő neve (felhasználó, modul, csoport stb.) |
| `$optional` | bool | A hiba kiváltása helyett nullát tér vissza |

**Példa:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getmoduleHandler

Lekér egy modulspecifikus kezelőt.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$name` | húr | Kezelő neve |
| `$dirname` | húr | modul könyvtár neve |
| `$optional` | bool | Hiba esetén nulla |

**Példa:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## Egyéni kezelők létrehozása

### Alapvető kezelő megvalósítás

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

### Az egyéni kezelő használata

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

## Bevált gyakorlatok

1. **Feltételek használata lekérdezésekhez**: Mindig használjon Criteria objektumokat a típusbiztos lekérdezésekhez

2. **Extend for Custom Methods**: Domainspecifikus lekérdezési metódusok hozzáadása a kezelőkhöz

3. **insert/delete** felülírása: Kaszkád műveletek és időbélyegek hozzáadása a felülírásokhoz

4. **Tranzakciót használjon, ahol szükséges**: Az összetett műveleteket a tranzakciókba csomagolja

5. **A getList kihasználása**: Használja a `getList()` legördülő listákat a lekérdezések számának csökkentése érdekében

6. **Indexkulcsok**: Győződjön meg arról, hogy a feltételekben használt adatbázismezők indexelve vannak

7. **Eredmények határértéke**: Mindig használja a `setLimit()`-t potenciálisan nagy eredményhalmazokhoz

## Kapcsolódó dokumentáció

- XOOPSObject - Alap objektumosztály
- ../Database/Criteria - Lekérdezési feltételek kiépítése
- ../Database/XOOPSDatabase - Adatbázisműveletek

---

*Lásd még: [XOOPS forráskód](https://github.com/XOOPS/XOOPSCore27/blob/master/htdocs/class/xoopsobject.php)*
