---
title: "Επίπεδο βάσης δεδομένων"
description: "Πλήρης οδηγός για την αφαίρεση βάσης δεδομένων XOOPS, το XoopsObject, τους χειριστές και το σύστημα κριτηρίων"
---

# 🗄️ Επίπεδο βάσης δεδομένων

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

> Κατανόηση της αφαίρεσης βάσης δεδομένων XOOPS, της εμμονής αντικειμένων και της δημιουργίας ερωτημάτων.

:::tip[Future-Proof Your Data Access]
Το μοτίβο handler/Criteria λειτουργεί και στις δύο εκδόσεις. Για να προετοιμαστείτε για το XOOPS 4.0, εξετάστε το ενδεχόμενο να τυλίξετε τους χειριστές σε [Repository classes](../../03-Module-Development/Patterns/Repository-Pattern.md) για καλύτερη δυνατότητα δοκιμής. Ανατρέξτε στην ενότητα [Επιλογή μοτίβου πρόσβασης δεδομένων](../../03-Module-Development/Choosing-Data-Access-Pattern.md).
:::

---

## Επισκόπηση

Το επίπεδο βάσης δεδομένων XOOPS παρέχει μια ισχυρή αφαίρεση σε σχέση με το MySQL/MariaDB, με τα εξής χαρακτηριστικά:

- **Factory Pattern** - Κεντρική διαχείριση σύνδεσης βάσης δεδομένων
- **Αντικείμενο-Σχεσιακή Χαρτογράφηση** - XoopsObject και χειριστές
- **Δημιουργία ερωτημάτων** - Σύστημα κριτηρίων για σύνθετα ερωτήματα
- **Σύνδεση Επαναχρησιμοποίηση** - Μονή σύνδεση μέσω εργοστασίου singleton (όχι ομαδοποίηση)

---

## 🏗️ Αρχιτεκτονική

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

## 🔌 Σύνδεση βάσης δεδομένων

## # Λήψη της σύνδεσης

```php
// Recommended: Use the global database instance
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Legacy: Global variable (still works)
global $xoopsDB;
```

## # XoopsDatabaseFactory

Το εργοστασιακό μοτίβο διασφαλίζει την επαναχρησιμοποίηση μιας ενιαίας σύνδεσης βάσης δεδομένων:

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

## 📦 XoopsObject

Η βασική κλάση για όλα τα αντικείμενα δεδομένων στο XOOPS.

## # Ορισμός αντικειμένου

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

## # Τύποι δεδομένων

| Σταθερά | Τύπος | Περιγραφή |
|----------|------|-------------|
| `XOBJ_DTYPE_INT` | Ακέραιος | Αριθμητικές τιμές |
| `XOBJ_DTYPE_TXTBOX` | Χορδή | Σύντομο κείμενο (< 255 χαρακτήρες) |
| `XOBJ_DTYPE_TXTAREA` | Κείμενο | Περιεχόμενο μεγάλου κειμένου |
| `XOBJ_DTYPE_EMAIL` | Email | Διευθύνσεις email |
| `XOBJ_DTYPE_URL` | URL | Διευθύνσεις Ιστού |
| `XOBJ_DTYPE_FLOAT` | Πλωτήρας | Δεκαδικοί αριθμοί |
| `XOBJ_DTYPE_ARRAY` | Συστοιχία | Σειριακές συστοιχίες |
| `XOBJ_DTYPE_OTHER` | Μικτή | Ακατέργαστα δεδομένα |

## # Εργασία με αντικείμενα

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

## 🔧 Χειριστές αντικειμένων

## # XoopsPersistableObjectHandler

Η κλάση χειριστή διαχειρίζεται λειτουργίες CRUD για παρουσίες XoopsObject.

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

## # Μέθοδοι χειρισμού

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

## # Μέθοδοι προσαρμοσμένου χειριστή

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

## 🔍 Σύστημα κριτηρίων

Το σύστημα Criteria παρέχει έναν ισχυρό, αντικειμενοστραφή τρόπο για τη δημιουργία ρητρών SQL WHERE.

## # Βασικά κριτήρια

```php
// Simple equality
$criteria = new \Criteria('status', 'published');

// With operator
$criteria = new \Criteria('views', 100, '>=');

// Column comparison
$criteria = new \Criteria('updated', 'created', '>');
```

## # CriteriaCompo (Συνδυασμός κριτηρίων)

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

## # Ταξινόμηση και σελιδοποίηση

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

## # Χειριστές

| Χειριστής | Παράδειγμα | SQL Έξοδος |
|----------|---------|-------------|
| `=` | ` new Criteria('status', 'published') ` | ` status = 'published'` |
| `!=` | ` new Criteria('status', 'draft', '!=') ` | ` status != 'draft'` |
| `>` | ` new Criteria('views', 100, '>') ` | ` views > 100` |
| `>=` | ` new Criteria('views', 100, '>=') ` | ` views >= 100` |
| `<` | ` new Criteria('views', 100, '<') ` | ` views < 100` |
| `<=` | ` new Criteria('views', 100, '<=') ` | ` views <= 100` |
| `LIKE ` | ` new Criteria('title', '%php%', 'LIKE') ` | ` title LIKE '%php%'` |
| `NOT LIKE ` | ` new Criteria('title', '%test%', 'NOT LIKE') ` | ` title NOT LIKE '%test%'` |
| `IN ` | ` new Criteria('id', '(1,2,3)', 'IN') ` | ` id IN (1,2,3)` |
| `NOT IN ` | ` new Criteria('id', '(1,2,3)', 'NOT IN') ` | ` id NOT IN (1,2,3)` |

## # Σύνθετο Παράδειγμα

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

## 📝 Άμεσες ερωτήσεις

Για πολύπλοκα ερωτήματα που δεν είναι δυνατά με τα κριτήρια, χρησιμοποιήστε το direct SQL.

## # Ασφαλή ερωτήματα (Διαβάστε)

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

## # Γράψτε ερωτήματα

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

## # Διαφυγή τιμών

```php
// String escaping
$safeString = $db->quoteString($userInput);
// or
$safeString = $db->escape($userInput);

// Integer (no escaping needed, just cast)
$safeInt = (int) $userInput;
```

---

## ⚠️ Βέλτιστες πρακτικές ασφάλειας

## # Πάντα διαφυγή εισόδου χρήστη

```php
// NEVER do this
$sql = "SELECT * FROM articles WHERE title = '$_GET[title]'"; // SQL Injection!

// DO this
$title = $db->escape($_GET['title']);
$sql = "SELECT * FROM articles WHERE title = '$title'";

// Or better, use Criteria
$criteria = new \Criteria('title', $db->escape($_GET['title']));
```

## # Χρήση παραμετροποιημένων ερωτημάτων (XMF)

```php
use Xmf\Database\TableLoad;

// Safe bulk insert
$tableLoad = new TableLoad('mymodule_articles');
$tableLoad->insert([
    ['title' => 'Article 1', 'content' => 'Content 1'],
    ['title' => 'Article 2', 'content' => 'Content 2'],
]);
```

## # Επικύρωση τύπων εισόδου

```php
use Xmf\Request;

$id = Request::getInt('id', 0, 'GET');
$title = Request::getString('title', '', 'POST');
```

---

## 📊 Παράδειγμα σχήματος βάσης δεδομένων

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

## 🔗 Σχετική τεκμηρίωση

- [Criteria System Deep Dive](../../04-API-Reference/Kernel/Criteria.md)
- [Design Patterns - Factory](../Architecture/Design-Patterns.md)
- [SQL Πρόληψη ένεσης](../Security/SQL-Injection-Prevention.md)
- [XoopsDatabase API Αναφορά](../../04-API-Reference/Database/XoopsDatabase.md)

---

# XOOPS #database #orm #criteria #handlers #mysql
