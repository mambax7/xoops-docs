---
title: "Razred XoopsObjectHandler"
description: "Osnovni razred obravnave za CRUD operacij na primerkih XoopsObject z obstojnostjo baze podatkov"
---
Razred `XoopsObjectHandler` in njegova razširitev `XoopsPersistableObjectHandler` nudita standardiziran vmesnik za izvajanje operacij CRUD (ustvari, preberi, posodobi, izbriši) na primerkih `XoopsObject`. To izvaja vzorec Data Mapper, ki ločuje domensko logiko od dostopa do baze podatkov.

## Pregled razreda
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
## Hierarhija razreda
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

### Konstruktor
```php
public function __construct(XoopsDatabase $db)
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$db` | XoopsDatabase | Primerek povezave z bazo podatkov |

**Primer:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```
---

### ustvarjaj

Ustvari nov primerek predmeta.
```php
abstract public function create(bool $isNew = true): ?XoopsObject
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$isNew` | bool | Ali je predmet nov (privzeto: res) |

**Vrne:** `XoopsObject|null` - Nov primerek predmeta

**Primer:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```
---

### dobiš

Pridobi objekt po primarnem ključu.
```php
abstract public function get(int $id): ?XoopsObject
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$id` | int | Vrednost primarnega ključa |

**Vrne:** `XoopsObject|null` - primerek predmeta ali nič, če ni najden

**Primer:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```
---

### vstavi

Shrani objekt v zbirko podatkov (vstavi ali posodobi).
```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$obj` | XoopsObject | Objekt za shranjevanje |
| `$force` | bool | Vsili operacijo, tudi če je objekt nespremenjen |

**Vrni:** `bool` - Resnično ob uspehu

**Primer:**
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

### izbriši

Izbriše objekt iz baze podatkov.
```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$obj` | XoopsObject | Predmet za brisanje |
| `$force` | bool | Vsili brisanje |

**Vrni:** `bool` - Resnično ob uspehu

**Primer:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```
---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler` razširja `XoopsObjectHandler` z dodatnimi metodami za poizvedovanje in množične operacije.

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
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$db` | XoopsDatabase | Povezava z bazo podatkov |
| `$table` | niz | Ime tabele (brez predpone) |
| `$className` | niz | Polno ime razreda predmeta |
| `$keyName` | niz | Ime polja primarnega ključa |
| `$identifierName` | niz | Človeku berljivo identifikatorsko polje |

**Primer:**
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

Pridobi več predmetov, ki se ujemajo s kriteriji.
```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$criteria` | KriterijElement | Merila poizvedbe (neobvezno) |
| `$idAsKey` | bool | Uporabi primarni ključ kot matrični ključ |
| `$asObject` | bool | Vrne predmete (true) ali nize (false) |

**Vrne:** `array` - Niz predmetov ali asociativni nizi

**Primer:**
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

Šteje predmete, ki se ujemajo s kriteriji.
```php
public function getCount(CriteriaElement $criteria = null): int
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$criteria` | KriterijElement | Merila poizvedbe (neobvezno) |

**Vrnitve:** `int` - Število ujemajočih se predmetov

**Primer:**
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

Pridobi vse predmete (vzdevek za getObjects brez kriterijev).
```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$criteria` | KriterijElement | Merila poizvedbe |
| `$fields` | niz | Posebna polja za pridobitev |
| `$asObject` | bool | Vrni kot predmete |
| `$idAsKey` | bool | Uporabi ID kot matrični ključ |

**Primer:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```
---

### getIds

Pridobi le primarne ključe ujemajočih se predmetov.
```php
public function getIds(CriteriaElement $criteria = null): array
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$criteria` | KriterijElement | Merila poizvedbe |

**Vrne:** `array` - Niz vrednosti primarnega ključa

**Primer:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```
---

### getList

Pridobi seznam ključev in vrednosti za spustne menije.
```php
public function getList(CriteriaElement $criteria = null): array
```
**Vrne:** `array` - Asociativno polje [id => identifikator]

**Primer:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```
---

### izbriši vse

Izbriše vse predmete, ki ustrezajo kriterijem.
```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$criteria` | KriterijElement | Merila za objekte za brisanje |
| `$force` | bool | Vsili brisanje |
| `$asObject` | bool | Naloži objekte pred brisanjem (sproži dogodke) |

**Vrni:** `bool` - Resnično ob uspehu

**Primer:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```
---

### posodobi vse

Posodobi vrednost polja za vse ujemajoče se predmete.
```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$fieldname` | niz | Polje za posodobitev |
| `$fieldvalue` | mešano | Nova vrednost |
| `$criteria` | KriterijElement | Merila za objekte za posodobitev |
| `$force` | bool | Vsili posodobitev |

**Vrni:** `bool` - Resnično ob uspehu

**Primer:**
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

### vstavi (razširjeno)

Razširjena metoda vstavljanja z dodatno funkcionalnostjo.
```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```
**Vedenje:**
- Če je objekt nov (`isNew() === true`): INSERT
- Če objekt obstaja (`isNew() === false`): UPDATE
- Samodejno pokliče `cleanVars()`
- Nastavi samodejno povečevanje ID-ja za nove predmete

**Primer:**
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

## Pomožne funkcije

### xoops_getHandler

Globalna funkcija za pridobivanje jedrnega obdelovalca.
```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$name` | niz | Ime upravljalnika (uporabnik, modul, skupina itd.) |
| `$optional` | bool | Vrni nič namesto sprožitve napake |

**Primer:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```
---

### xoops_getModuleHandler

Pridobi obravnavo, specifično za modul.
```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$name` | niz | Ime upravljavca |
| `$dirname` | niz | Ime imenika modula |
| `$optional` | bool | Vrni nič ob neuspehu |

**Primer:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```
---

## Ustvarjanje obdelovalcev po meri

### Izvedba osnovnega upravljalnika
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
### Uporaba obdelovalnika po meri
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
## Najboljše prakse

1. **Uporabite kriterije za poizvedbe**: vedno uporabite objekte kriterijev za tipsko varne poizvedbe

2. **Razširitev za metode po meri**: Dodajte metode poizvedb, specifične za domeno, v obdelovalnike

3. **Preglasi insert/delete**: dodajte kaskadne operacije in časovne žige v preglasitve

4. **Uporabite transakcijo, kjer je to potrebno**: zavijte zapletene operacije v transakcije

5. **Izkoristite getList**: uporabite `getList()` za izbiro spustnih menijev za zmanjšanje poizvedb

6. **Indeksni ključi**: Zagotovite, da so polja baze podatkov, uporabljena v kriterijih, indeksirana

7. **Omeji rezultate**: vedno uporabite `setLimit()` za potencialno velike nize rezultatov

## Povezana dokumentacija

- XoopsObject - osnovni objektni razred
- ../Database/Criteria - Gradnja kriterijev poizvedbe
- ../Database/XoopsDatabase - Podatkovne operacije

---

*Glejte tudi: [XOOPS Izvorna koda](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*