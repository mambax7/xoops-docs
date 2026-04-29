---
title: "Třída XoopsObjectHandler"
description: "Základní třída obslužného programu pro operace CRUD na instancích XoopsObject s perzistencí databáze"
---

Třída `XOOPSObjectHandler` a její rozšíření `XOOPSPersistableObjectHandler` poskytují standardizované rozhraní pro provádění operací CRUD (Vytvoření, čtení, aktualizace, mazání) na instancích `XOOPSObject`. To implementuje vzor Data Mapper, oddělující doménovou logiku od přístupu k databázi.

## Přehled třídy

```php
namespace XOOPS\Core;

abstract class XOOPSObjectHandler
{
    protected XOOPSDatabase $db;

    public function __construct(XOOPSDatabase $db);
    abstract public function create(bool $isNew = true);
    abstract public function get(int $id);
    abstract public function insert(XOOPSObject $obj, bool $force = false): bool;
    abstract public function delete(XOOPSObject $obj, bool $force = false): bool;
}
```

## Hierarchie tříd

```
XOOPSObjectHandler (Abstract Base)
└── XOOPSPersistableObjectHandler (Extended Implementation)
    ├── XOOPSUserHandler
    ├── XOOPSGroupHandler
    ├── XOOPSModuleHandler
    ├── XOOPSBlockHandler
    ├── XOOPSConfigHandler
    └── [Custom Module Handlers]
```

## XOOPSObjectHandler

### Konstruktér

```php
public function __construct(XOOPSDatabase $db)
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$db` | XOOPSDatabase | Instance připojení databáze |

**Příklad:**
```php
$db = XOOPSDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### vytvořit

Vytvoří novou instanci objektu.

```php
abstract public function create(bool $isNew = true): ?XOOPSObject
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$isNew` | bool | Zda je objekt nový (výchozí: true) |

**Vrátí:** `XOOPSObject|null` - Nová instance objektu

**Příklad:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### získat

Načte objekt podle jeho primárního klíče.

```php
abstract public function get(int $id): ?XOOPSObject
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$id` | int | Hodnota primárního klíče |

**Vrátí:** `XOOPSObject|null` - Instance objektu nebo null, pokud nebyl nalezen

**Příklad:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### vložit

Uloží objekt do databáze (vložení nebo aktualizace).

```php
abstract public function insert(
    XOOPSObject $obj,
    bool $force = false
): bool
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$obj` | XOOPSObject | Objekt k uložení |
| `$force` | bool | Vynutit operaci, i když se objekt nezmění |

**Vrátí se:** `bool` - Pravda při úspěchu

**Příklad:**
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

### smazat

Odstraní objekt z databáze.

```php
abstract public function delete(
    XOOPSObject $obj,
    bool $force = false
): bool
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$obj` | XOOPSObject | Objekt ke smazání |
| `$force` | bool | Vynutit smazání |

**Vrátí se:** `bool` – Pravda při úspěchu

**Příklad:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XOOPSPersitableObjectHandler

`XOOPSPersistableObjectHandler` rozšiřuje `XOOPSObjectHandler` o další metody pro dotazování a hromadné operace.

### Konstruktér

```php
public function __construct(
    XOOPSDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$db` | XOOPSDatabase | Připojení k databázi |
| `$table` | řetězec | Název tabulky (bez předpony) |
| `$className` | řetězec | Celý název třídy objektu |
| `$keyName` | řetězec | Název pole primárního klíče |
| `$identifierName` | řetězec | Lidsky čitelné pole identifikátoru |

**Příklad:**
```php
class ArticleHandler extends XOOPSPersistableObjectHandler
{
    public function __construct(XOOPSDatabase $db)
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

Načte více objektů odpovídajících kritériím.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Kritéria dotazu (volitelné) |
| `$idAsKey` | bool | Použít primární klíč jako klíč pole |
| `$asObject` | bool | Vrátit objekty (true) nebo pole (false) |

**Vrátí:** `array` - Pole objektů nebo asociativních polí

**Příklad:**
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

Počítá objekty odpovídající kritériím.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Kritéria dotazu (volitelné) |

**Vrátí:** `int` - Počet odpovídajících objektů

**Příklad:**
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

Načte všechny objekty (alias pro getObjects bez kritérií).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Kritéria dotazu |
| `$fields` | pole | Konkrétní pole k načtení |
| `$asObject` | bool | Návrat jako objekty |
| `$idAsKey` | bool | Použít ID jako klíč pole |

**Příklad:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getIds

Načte pouze primární klíče odpovídajících objektů.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Kritéria dotazu |

**Vrátí:** `array` – Pole hodnot primárního klíče

**Příklad:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```

---

### getList

Načte seznam párů klíč–hodnota pro rozevírací seznamy.

```php
public function getList(CriteriaElement $criteria = null): array
```

**Vrátí:** `array` – Asociativní pole [id => identifikátor]

**Příklad:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XOOPSFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### smazat vše

Odstraní všechny objekty odpovídající kritériím.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**Parametry:**| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Kritéria pro objekty k odstranění |
| `$force` | bool | Vynutit smazání |
| `$asObject` | bool | Načíst objekty před odstraněním (spouští události) |

**Vrátí se:** `bool` – Pravda při úspěchu

**Příklad:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```

---

### aktualizovatVše

Aktualizuje hodnotu pole pro všechny odpovídající objekty.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$fieldname` | řetězec | Pole k aktualizaci |
| `$fieldvalue` | smíšené | Nová hodnota |
| `$criteria` | CriteriaElement | Kritéria pro objekty k aktualizaci |
| `$force` | bool | Vynutit aktualizaci |

**Vrátí se:** `bool` – Pravda při úspěchu

**Příklad:**
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

### vložka (rozšířená)

Metoda rozšířené vložky s dalšími funkcemi.

```php
public function insert(
    XOOPSObject $obj,
    bool $force = false
): bool
```

**Chování:**
- Pokud je objekt nový (`isNew() === true`): INSERT
- Pokud objekt existuje (`isNew() === false`): UPDATE
- Automaticky volá `cleanVars()`
- Nastaví automatické zvýšení ID u nových objektů

**Příklad:**
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

## Pomocné funkce

### xoops_getHandler

Globální funkce pro načtení základního obslužného programu.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XOOPSObjectHandler
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$name` | řetězec | Název obslužného programu (uživatel, modul, skupina atd.) |
| `$optional` | bool | Vraťte null místo spouštění chyby |

**Příklad:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

Načte obslužnou rutinu specifickou pro modul.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XOOPSObjectHandler
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$name` | řetězec | Jméno psovoda |
| `$dirname` | řetězec | Název adresáře modulu |
| `$optional` | bool | Návrat null při selhání |

**Příklad:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## Vytváření vlastních obslužných programů

### Základní implementace obslužného programu

```php
<?php
namespace XOOPSModules\MyModule;

use XOOPSPersistableObjectHandler;
use XOOPSDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * Handler for Article objects
 */
class ArticleHandler extends XOOPSPersistableObjectHandler
{
    /**
     * Constructor
     */
    public function __construct(XOOPSDatabase $db = null)
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
    public function insert(\XOOPSObject $obj, bool $force = false): bool
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
    public function delete(\XOOPSObject $obj, bool $force = false): bool
    {
        // Delete associated comments
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```

### Použití Custom Handler

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

## Nejlepší postupy

1. **Použít kritéria pro dotazy**: Vždy používejte objekty Criteria pro typově bezpečné dotazy

2. **Extend for Custom Methods**: Přidejte k obslužným rutinám metody dotazů specifické pro doménu

3. **Přepsat insert/delete**: Přidejte kaskádové operace a časová razítka do přepisů

4. **Použijte transakce tam, kde je to nutné**: Zabalte složité operace do transakcí

5. **Využijte getList**: Použijte `getList()` pro vybrané rozbalovací nabídky, abyste snížili počet dotazů

6. **Indexové klíče**: Zajistěte, aby databázová pole použitá v kritériích byla indexována

7. **Omezit výsledky**: Vždy používejte `setLimit()` pro potenciálně velké sady výsledků

## Související dokumentace

- XOOPSObject - Základní třída objektů
- ../Database/Criteria - Sestavení kritérií dotazu
- ../Database/XOOPSDatabase - Operace s databází

---

*Viz také: [XOOPS Zdrojový kód](https://github.com/XOOPS/XOOPSCore27/blob/master/htdocs/class/xoopsobject.php)*