---
title: "Adatbázis réteg"
description: "Átfogó útmutató a XOOPS adatbázis-absztrakcióhoz, a XOOPSObjecthez, a kezelőkhöz és a Criteria rendszerhez"
---
# 🗄️ Adatbázis réteg

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

> Ismerje meg a XOOPS adatbázis-absztrakciót, az objektumok megmaradását és a lekérdezésépítést.

:::tipp[Jövőbiztos adathozzáférés]
A handler/Criteria minta mindkét változatban működik. A XOOPS 4.0-ra való felkészüléshez fontolja meg a kezelők [Repository classes](../../03-module-Development/Patterns/Repository-Pattern.md) becsomagolását a jobb tesztelhetőség érdekében. Lásd: [Adat-hozzáférési minta kiválasztása](../../03-module-Development/Choosing-Data-Access-Pattern.md).
:::

---

## Áttekintés

A XOOPS adatbázisréteg robusztus absztrakciót biztosít a MySQL/MariaDB felett, és a következőket tartalmazza:

- **Gyári minta** - Központosított adatbázis-kapcsolatkezelés
- **Object-Relational Mapping** - XOOPSObject és kezelők
- **Lekérdezésépítés** - Kritériumrendszer összetett lekérdezésekhez
- **Csatlakozás újrafelhasználása** - Egyetlen csatlakozás a singleton gyáron keresztül (nem pooling)

---

## 🏗️ Építészet

```mermaid
flowchart TB
    subgraph App["📱 Application Code"]
        AppCode["Your Module Code"]
    end

    subgraph Handler["🔧 XoopsPersistableObjectHandler"]
        HandlerMethods["create() | get() | insert() | delete()<br/>getObjects() | getCount() | deleteAll()"]
    end

    subgraph Object["📦 XoopsObject"]
        ObjectMethods["initVar() | getVar() | setVar() | toArray()"]
    end

    subgraph Criteria["🔍 Criteria System"]
        CriteriaMethods["Criteria | CriteriaCompo | CriteriaElement"]
    end

    subgraph Database["🗄️ XoopsDatabase"]
        DatabaseMethods["query() | queryF() | fetchArray() | insert()"]
    end

    subgraph Storage["💾 MySQL / MariaDB"]
        DB[(Database)]
    end

    App --> Handler
    Handler --> Object
    Object --> Criteria
    Criteria --> Database
    Database --> Storage

    style App fill:#e3f2fd,stroke:#1976d2
    style Handler fill:#e8f5e9,stroke:#388e3c
    style Object fill:#fff3e0,stroke:#f57c00
    style Criteria fill:#f3e5f5,stroke:#7b1fa2
    style Database fill:#fce4ec,stroke:#c2185b
    style Storage fill:#eceff1,stroke:#546e7a
```

---

## 🔌 Adatbázis kapcsolat

### A kapcsolat létrehozása

```php
// Recommended: Use the global database instance
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Legacy: Global variable (still works)
global $xoopsDB;
```

### XOOPSDatabaseFactory

A gyári minta biztosítja, hogy egyetlen adatbázis-kapcsolat újrafelhasználható legyen:

```php
<?php

class XoopsDatabaseFactory
{
    private static ?XoopsDatabase $instance = null;

    public static function getDatabaseConnection(): XoopsDatabase
    {
        if (self::$instance === null) {
            self::$instance = new XoopsMySQLDatabase();
        }
        return self::$instance;
    }
}
```

---

## 📦 XOOPSObject

A XOOPS összes adatobjektumának alaposztálya.

### Objektum meghatározása

```php
<?php

namespace XoopsModules\MyModule;

class Article extends \XoopsObject
{
    public function __construct()
    {
        $this->initVar('article_id', \XOBJ_DTYPE_INT, null, false);
        $this->initVar('category_id', \XOBJ_DTYPE_INT, 0, true);
        $this->initVar('title', \XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', \XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('author_id', \XOBJ_DTYPE_INT, 0, true);
        $this->initVar('status', \XOBJ_DTYPE_TXTBOX, 'draft', true, 20);
        $this->initVar('views', \XOBJ_DTYPE_INT, 0, false);
        $this->initVar('created', \XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', \XOBJ_DTYPE_INT, 0, false);
    }
}
```

### Adattípusok

| Állandó | Típus | Leírás |
|----------|------|--------------|
| `XOBJ_DTYPE_INT` | Egész | Numerikus értékek |
| `XOBJ_DTYPE_TXTBOX` | String | Rövid szöveg (< 255 karakter) |
| `XOBJ_DTYPE_TXTAREA` | Szöveg | Hosszú szöveges tartalom |
| `XOBJ_DTYPE_EMAIL` | E-mail | E-mail címek |
| `XOBJ_DTYPE_URL` | URL | Webcímek |
| `XOBJ_DTYPE_FLOAT` | Úszó | Tizedes számok |
| `XOBJ_DTYPE_ARRAY` | Array | Soros tömbök |
| `XOBJ_DTYPE_OTHER` | Vegyes | Nyers adatok |

### Munka objektumokkal

```php
// Create new object
$article = new Article();

// Set values
$article->setVar('title', 'My Article');
$article->setVar('content', 'Article content here...');
$article->setVar('category_id', 5);
$article->setVar('author_id', $xoopsUser->getVar('uid'));

// Get values
$title = $article->getVar('title');           // Raw value
$titleDisplay = $article->getVar('title', 'e'); // For editing (HTML entities)
$titleShow = $article->getVar('title', 's');    // For display (sanitized)

// Bulk assign from array
$article->assignVars([
    'title' => 'New Title',
    'status' => 'published'
]);

// Convert to array
$data = $article->toArray();
```

---

## 🔧 Objektumkezelők

### XOOPSPersistableObjectHandler

A kezelő osztály kezeli a CRUD műveleteket az XOOPSObject példányokhoz.

```php
<?php

namespace XoopsModules\MyModule;

class ArticleHandler extends \XoopsPersistableObjectHandler
{
    public function __construct(\XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'mymodule_articles',  // Table name
            Article::class,       // Object class
            'article_id',         // Primary key
            'title'               // Identifier field
        );
    }
}
```

### Kezelő módszerek

```php
// Get handler instance
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Create new object
$article = $articleHandler->create();

// Get by ID
$article = $articleHandler->get(123);

// Insert (create or update)
$success = $articleHandler->insert($article);

// Delete
$success = $articleHandler->delete($article);

// Get multiple objects
$articles = $articleHandler->getObjects($criteria);

// Get count
$count = $articleHandler->getCount($criteria);

// Get as array (key => value)
$list = $articleHandler->getList($criteria);

// Delete multiple
$deleted = $articleHandler->deleteAll($criteria);
```

### Egyéni kezelői módszerek

```php
<?php

namespace XoopsModules\MyModule;

class ArticleHandler extends \XoopsPersistableObjectHandler
{
    // ... constructor

    /**
     * Get published articles
     */
    public function getPublished(int $limit = 10, int $start = 0): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('status', 'published'));
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by category
     */
    public function getByCategory(int $categoryId, int $limit = 10): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('category_id', $categoryId));
        $criteria->add(new \Criteria('status', 'published'));
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by author
     */
    public function getByAuthor(int $authorId): array
    {
        $criteria = new \Criteria('author_id', $authorId);
        return $this->getObjects($criteria);
    }

    /**
     * Increment view count
     */
    public function incrementViews(int $articleId): bool
    {
        $sql = sprintf(
            'UPDATE %s SET views = views + 1 WHERE article_id = %d',
            $this->table,
            $articleId
        );
        return $this->db->queryF($sql) !== false;
    }

    /**
     * Get popular articles
     */
    public function getPopular(int $limit = 5): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('status', 'published'));
        $criteria->setSort('views');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }
}
```

---

## 🔍 Kritériumrendszer

A Criteria rendszer hatékony, objektumorientált módot biztosít a SQL WHERE záradékok létrehozására.

### Alapvető kritériumok

```php
// Simple equality
$criteria = new \Criteria('status', 'published');

// With operator
$criteria = new \Criteria('views', 100, '>=');

// Column comparison
$criteria = new \Criteria('updated', 'created', '>');
```

### CriteriaCompo (kritériumok kombinálása)

```php
$criteria = new \CriteriaCompo();

// AND conditions (default)
$criteria->add(new \Criteria('status', 'published'));
$criteria->add(new \Criteria('category_id', 5));

// OR conditions
$criteria->add(new \Criteria('featured', 1), 'OR');

// Nested conditions
$subCriteria = new \CriteriaCompo();
$subCriteria->add(new \Criteria('author_id', 1));
$subCriteria->add(new \Criteria('author_id', 2), 'OR');
$criteria->add($subCriteria);
```

### Rendezés és lapozás

```php
$criteria = new \CriteriaCompo();
$criteria->add(new \Criteria('status', 'published'));

// Sorting
$criteria->setSort('created');
$criteria->setOrder('DESC');

// Multiple sort fields
$criteria->setSort('category_id, created');
$criteria->setOrder('ASC, DESC');

// Pagination
$criteria->setLimit(10);    // Items per page
$criteria->setStart(20);    // Offset

// Group by
$criteria->setGroupby('category_id');
```

### Üzemeltetők

| Üzemeltető | Példa | SQL Kimenet |
|----------|---------|-------------|
| `=` | `new Criteria('status', 'published')` | `status = 'published'` |
| `!=` | `new Criteria('status', 'draft', '!=')` | `status != 'draft'` |
| `>` | `new Criteria('views', 100, '>')` | `views > 100` |
| `>=` | `new Criteria('views', 100, '>=')` | `views >= 100` |
| `<` | `new Criteria('views', 100, '<')` | `views < 100` |
| `<=` | `new Criteria('views', 100, '<=')` | `views <= 100` |
| `LIKE` | `new Criteria('title', '%php%', 'LIKE')` | `title LIKE '%php%'` |
| `NOT LIKE` | `new Criteria('title', '%test%', 'NOT LIKE')` | `title NOT LIKE '%test%'` |
| `IN` | `new Criteria('id', '(1,2,3)', 'IN')` | `id IN (1,2,3)` |
| `NOT IN` | `new Criteria('id', '(1,2,3)', 'NOT IN')` | `id NOT IN (1,2,3)` |

### Összetett példa

```php
// Find published articles in specific categories,
// with search term in title, sorted by views
$criteria = new \CriteriaCompo();

// Status must be published
$criteria->add(new \Criteria('status', 'published'));

// In categories 1, 2, or 3
$criteria->add(new \Criteria('category_id', '(1, 2, 3)', 'IN'));

// Title contains search term
$searchTerm = '%' . $db->escape($searchQuery) . '%';
$criteria->add(new \Criteria('title', $searchTerm, 'LIKE'));

// Created in last 30 days
$thirtyDaysAgo = time() - (30 * 24 * 60 * 60);
$criteria->add(new \Criteria('created', $thirtyDaysAgo, '>='));

// Sort by views descending
$criteria->setSort('views');
$criteria->setOrder('DESC');

// Paginate
$criteria->setLimit(10);
$criteria->setStart($page * 10);

$articles = $articleHandler->getObjects($criteria);
$totalCount = $articleHandler->getCount($criteria);
```

---

## 📝 Közvetlen lekérdezések

A Criteria segítségével nem lehetséges összetett lekérdezések esetén használja a közvetlen SQL parancsot.

### Biztonságos lekérdezések (Olvasás)

```php
$db = \XoopsDatabaseFactory::getDatabaseConnection();

$sql = sprintf(
    'SELECT a.*, c.category_name
     FROM %s a
     LEFT JOIN %s c ON a.category_id = c.category_id
     WHERE a.status = %s
     ORDER BY a.created DESC
     LIMIT %d',
    $db->prefix('mymodule_articles'),
    $db->prefix('mymodule_categories'),
    $db->quoteString('published'),
    10
);

$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    // Process row
    echo $row['title'];
}
```

### Lekérdezések írása

```php
// Insert
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_articles'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);
$newId = $db->getInsertId();

// Update
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('mymodule_articles'),
    $articleId
);
$db->queryF($sql);
$affectedRows = $db->getAffectedRows();

// Delete
$sql = sprintf(
    "DELETE FROM %s WHERE article_id = %d",
    $db->prefix('mymodule_articles'),
    $articleId
);
$db->queryF($sql);
```

### Menekülés az értékektől

```php
// String escaping
$safeString = $db->quoteString($userInput);
// or
$safeString = $db->escape($userInput);

// Integer (no escaping needed, just cast)
$safeInt = (int) $userInput;
```

---

## ⚠️ Bevált biztonsági gyakorlatok

### Mindig elkerülje a felhasználói bevitelt

```php
// NEVER do this
$sql = "SELECT * FROM articles WHERE title = '$_GET[title]'"; // SQL Injection!

// DO this
$title = $db->escape($_GET['title']);
$sql = "SELECT * FROM articles WHERE title = '$title'";

// Or better, use Criteria
$criteria = new \Criteria('title', $db->escape($_GET['title']));
```

### Paraméterezett lekérdezések használata (XMF)

```php
use Xmf\Database\TableLoad;

// Safe bulk insert
$tableLoad = new TableLoad('mymodule_articles');
$tableLoad->insert([
    ['title' => 'Article 1', 'content' => 'Content 1'],
    ['title' => 'Article 2', 'content' => 'Content 2'],
]);
```

### Beviteli típusok érvényesítése

```php
use Xmf\Request;

$id = Request::getInt('id', 0, 'GET');
$title = Request::getString('title', '', 'POST');
```

---

## 📊 Adatbázisséma példa

```sql
-- sql/mysql.sql

CREATE TABLE `{PREFIX}_mymodule_articles` (
    `article_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `title` VARCHAR(255) NOT NULL DEFAULT '',
    `content` TEXT,
    `author_id` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'draft',
    `views` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `created` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `updated` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`article_id`),
    KEY `category_id` (`category_id`),
    KEY `author_id` (`author_id`),
    KEY `status` (`status`),
    KEY `created` (`created`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🔗 Kapcsolódó dokumentáció

- [Criteria System Deep Dive](../../04-API-Reference/Kernel/Criteria.md)
- [Dizájnminták – Gyári](../Architecture/Design-Patterns.md)
- [SQL befecskendezés megelőzés](../Security/SQL-Injection-Prevention.md)
- [XOOPSDatabase API referencia](../../04-API-Reference/Database/XOOPSDatabase.md)

---

#xoops #adatbázis #orm #kritériumok #kezelők #mysql
