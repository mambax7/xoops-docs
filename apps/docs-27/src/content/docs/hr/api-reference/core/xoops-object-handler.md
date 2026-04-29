---
title: "XoopsObjectHandler klasa"
description: "Bazni rukovatelj class za operacije CRUD na instancama XoopsObject s postojanošću baze podataka"
---
`XoopsObjectHandler` class i njegovo proširenje `XoopsPersistableObjectHandler` pružaju standardizirano sučelje za izvođenje operacija CRUD (Stvaranje, čitanje, ažuriranje, brisanje) na `XoopsObject` instance. Ovo implementira obrazac Data Mapper, odvajajući logiku domene od pristupa bazi podataka.

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

## Hijerarhija klasa

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

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$db` | XoopsBaza podataka | Instanca veze s bazom podataka |

**Primjer:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### stvarati

Stvara novu instancu objekta.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$isNew` | bool | Je li objekt nov (zadano: istinito) |

**Vraća:** `XoopsObject|null` - Nova instanca objekta

**Primjer:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### dobiti

Dohvaća objekt po primarnom ključu.

```php
abstract public function get(int $id): ?XoopsObject
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$id` | int | Vrijednost primarnog ključa |

**Vraća:** `XoopsObject|null` - Instanca objekta ili null ako nije pronađen

**Primjer:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### umetnite

Sprema objekt u bazu podataka (umetanje ili ažuriranje).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$obj` | XoopsObject | Objekt za spremanje |
| `$force` | bool | Prisilni rad čak i ako je objekt nepromijenjen |

**Povrat:** `bool` - Istina nakon uspjeha

**Primjer:**
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

Briše objekt iz baze podataka.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$obj` | XoopsObject | Objekt za brisanje |
| `$force` | bool | Prisilno brisanje |

**Povrat:** `bool` - Istina nakon uspjeha

**Primjer:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler` proširuje `XoopsObjectHandler` dodatnim metodama za upite i skupne operacije.

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

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$db` | XoopsBaza podataka | Veza s bazom podataka |
| `$table` | niz | Naziv tablice (bez prefiksa) |
| `$className` | niz | Puni class naziv objekta |
| `$keyName` | niz | Naziv polja primarnog ključa |
| `$identifierName` | niz | Čovjeku čitljivo polje identifikatora |

**Primjer:**
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

Dohvaća više objekata koji odgovaraju kriterijima.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$criteria` | KriterijElement | Kriteriji upita (neobavezno) |
| `$idAsKey` | bool | Koristite primarni ključ kao ključ polja |
| `$asObject` | bool | Vrati objekte (true) ili nizove (false) |

**Vraća:** `array` - Niz objekata ili asocijativni nizovi

**Primjer:**
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

Broji objekte koji odgovaraju kriterijima.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$criteria` | KriterijElement | Kriteriji upita (neobavezno) |**Vraća:** `int` - Broj podudarnih objekata

**Primjer:**
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

Dohvaća sve objekte (alias za getObjects bez kriterija).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$criteria` | KriterijElement | Kriteriji upita |
| `$fields` | niz | Specifična polja za dohvaćanje |
| `$asObject` | bool | Vrati kao objekte |
| `$idAsKey` | bool | Koristi ID kao ključ polja |

**Primjer:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getIds

Dohvaća samo primarne ključeve odgovarajućih objekata.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$criteria` | KriterijElement | Kriteriji upita |

**Vraća:** `array` - Niz vrijednosti primarnog ključa

**Primjer:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```

---

### getList

Dohvaća popis ključeva i vrijednosti za padajuće izbornike.

```php
public function getList(CriteriaElement $criteria = null): array
```

**Vraća:** `array` - Asocijativni niz [id => identifikator]

**Primjer:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### izbriši sve

Briše sve objekte koji odgovaraju kriterijima.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$criteria` | KriterijElement | Kriteriji za objekte za brisanje |
| `$force` | bool | Prisilno brisanje |
| `$asObject` | bool | Učitaj objekte prije brisanja (pokreće događaje) |

**Povrat:** `bool` - Istina nakon uspjeha

**Primjer:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```

---

### ažurirajSve

Ažurira vrijednost polja za sve podudarne objekte.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$fieldname` | niz | Polje za ažuriranje |
| `$fieldvalue` | mješoviti | Nova vrijednost |
| `$criteria` | KriterijElement | Kriteriji za objekte za ažuriranje |
| `$force` | bool | Prisilno ažuriranje |

**Povrat:** `bool` - Istina nakon uspjeha

**Primjer:**
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

### umetnuti (prošireno)

Proširena metoda umetanja s dodatnom funkcionalnošću.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Ponašanje:**
- Ako je objekt nov (`isNew() === true`): INSERT
- Ako objekt postoji (`isNew() === false`): AŽURIRAJTE
- Automatski poziva `cleanVars()`
- Postavlja auto-inkrement ID na nove objekte

**Primjer:**
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

## Pomoćne funkcije

### xoops_getHandler

Globalna funkcija za dohvaćanje jezgre rukovatelja.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$name` | niz | Ime rukovatelja (korisnik, modul, grupa itd.) |
| `$optional` | bool | Vrati null umjesto pokretanja pogreške |

**Primjer:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

Dohvaća rukovatelj specifičan za modul.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$name` | niz | Ime rukovatelja |
| `$dirname` | niz | Naziv direktorija modula |
| `$optional` | bool | Vrati null u slučaju neuspjeha |

**Primjer:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## Stvaranje prilagođenih rukovatelja

### Osnovna implementacija rukovatelja

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

### Korištenje prilagođenog rukovatelja

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

## Najbolji primjeri iz prakse

1. **Koristite kriterije za upite**: Uvijek koristite objekte kriterija za upite koji su sigurni za tip2. **Proširi za prilagođene metode**: Dodajte metode upita specifične za domenu rukovateljima

3. **Nadjačavanje umetanja/brisanja**: Dodajte kaskadne operacije i vremenske oznake u nadjačavanja

4. **Koristite transakciju gdje je potrebno**: Zamotajte složene operacije u transakcije

5. **Iskoristite getList**: koristite `getList()` za odabir padajućih izbornika kako biste smanjili upite

6. **Indeksni ključevi**: Osigurajte da su polja baze podataka korištena u kriterijima indeksirana

7. **Ograničenje rezultata**: Uvijek koristite `setLimit()` za potencijalno velike skupove rezultata

## Povezana dokumentacija

- XoopsObject - Osnovni objekt class
- ../Database/Criteria - Izrada kriterija upita
- ../Database/XoopsDatabase - Operacije baze podataka

---

*Vidi također: [XOOPS izvorni kod](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
