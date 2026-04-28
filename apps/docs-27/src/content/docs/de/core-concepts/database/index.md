---
title: "Datenbankschicht"
description: "Umfassender Leitfaden zur XOOPS-Datenbankabstraktion, XoopsObject, Handlern und dem Criteria-System"
---

# 🗄️ Datenbankschicht

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

> Verständnis der XOOPS-Datenbankabstraktion, Objektpersistenz und Query-Building.

:::tip[Zukunftssicher Ihre Datenzugriffe]
Das Handler/Criteria-Pattern funktioniert in beiden Versionen. Um sich auf XOOPS 4.0 vorzubereiten, erwägen Sie, Handler in [Repository-Klassen](../../03-Module-Development/Patterns/Repository-Pattern.md) zu wrappen für bessere Testbarkeit. Siehe [Wählen eines Data-Access-Patterns](../../03-Module-Development/Choosing-Data-Access-Pattern.md).
:::

---

## Übersicht

Die XOOPS-Datenbankschicht bietet eine robuste Abstraktion über MySQL/MariaDB mit folgenden Features:

- **Factory Pattern** - Zentrale Datenbankverbindungsverwaltung
- **Object-Relational Mapping** - XoopsObject und Handler
- **Query Building** - Criteria System für komplexe Abfragen
- **Connection Reuse** - Einzelne Verbindung via Singleton Factory (kein Pooling)

---

## 🏗️ Architektur

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

## 🔌 Datenbankverbindung

### Verbindung abrufen

```php
// Empfohlen: Verwenden Sie die globale Datenbankinstanz
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Legacy: Globale Variable (funktioniert noch immer)
global $xoopsDB;
```

### XoopsDatabaseFactory

Die Factory-Pattern stellt sicher, dass eine einzelne Datenbankverbindung wiederverwendet wird:

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

Die Basisklasse für alle Datenobjekte in XOOPS.

### Objekt definieren

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

### Datentypen

| Konstante | Typ | Beschreibung |
|----------|------|-------------|
| `XOBJ_DTYPE_INT` | Integer | Numerische Werte |
| `XOBJ_DTYPE_TXTBOX` | String | Kurzer Text (< 255 Zeichen) |
| `XOBJ_DTYPE_TXTAREA` | Text | Langer Text-Inhalt |
| `XOBJ_DTYPE_EMAIL` | Email | E-Mail-Adressen |
| `XOBJ_DTYPE_URL` | URL | Web-Adressen |
| `XOBJ_DTYPE_FLOAT` | Float | Dezimalzahlen |
| `XOBJ_DTYPE_ARRAY` | Array | Serialisierte Arrays |
| `XOBJ_DTYPE_OTHER` | Mixed | Rohdaten |

### Mit Objekten arbeiten

```php
// Neues Objekt erstellen
$article = new Article();

// Werte setzen
$article->setVar('title', 'My Article');
$article->setVar('content', 'Article content here...');
$article->setVar('category_id', 5);
$article->setVar('author_id', $xoopsUser->getVar('uid'));

// Werte abrufen
$title = $article->getVar('title');           // Rohwert
$titleDisplay = $article->getVar('title', 'e'); // Zum Bearbeiten (HTML-Entities)
$titleShow = $article->getVar('title', 's');    // Zum Anzeigen (bereinigt)

// Massenweise aus Array zuweisen
$article->assignVars([
    'title' => 'New Title',
    'status' => 'published'
]);

// In Array konvertieren
$data = $article->toArray();
```

---

## 🔧 Object Handler

### XoopsPersistableObjectHandler

Die Handler-Klasse verwaltet CRUD-Operationen für XoopsObject-Instanzen.

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

### Handler-Methoden

```php
// Handler-Instanz abrufen
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Neues Objekt erstellen
$article = $articleHandler->create();

// Nach ID abrufen
$article = $articleHandler->get(123);

// Einfügen (erstellen oder aktualisieren)
$success = $articleHandler->insert($article);

// Löschen
$success = $articleHandler->delete($article);

// Mehrere Objekte abrufen
$articles = $articleHandler->getObjects($criteria);

// Zählen
$count = $articleHandler->getCount($criteria);

// Als Array abrufen (key => value)
$list = $articleHandler->getList($criteria);

// Mehrere löschen
$deleted = $articleHandler->deleteAll($criteria);
```

### Benutzerdefinierte Handler-Methoden

```php
<?php

namespace XoopsModules\MyModule;

class ArticleHandler extends \XoopsPersistableObjectHandler
{
    // ... Konstruktor

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

## 🔍 Criteria System

Das Criteria-System bietet eine leistungsstarke, objektorientierte Möglichkeit, SQL WHERE-Klauseln zu bauen.

### Basic Criteria

```php
// Einfache Gleichheit
$criteria = new \Criteria('status', 'published');

// Mit Operator
$criteria = new \Criteria('views', 100, '>=');

// Spalten-Vergleich
$criteria = new \Criteria('updated', 'created', '>');
```

### CriteriaCompo (Criteria kombinieren)

```php
$criteria = new \CriteriaCompo();

// AND Bedingungen (Standard)
$criteria->add(new \Criteria('status', 'published'));
$criteria->add(new \Criteria('category_id', 5));

// OR Bedingungen
$criteria->add(new \Criteria('featured', 1), 'OR');

// Verschachtelte Bedingungen
$subCriteria = new \CriteriaCompo();
$subCriteria->add(new \Criteria('author_id', 1));
$subCriteria->add(new \Criteria('author_id', 2), 'OR');
$criteria->add($subCriteria);
```

### Sortieren und Paginierung

```php
$criteria = new \CriteriaCompo();
$criteria->add(new \Criteria('status', 'published'));

// Sortierung
$criteria->setSort('created');
$criteria->setOrder('DESC');

// Mehrere Sortierfelder
$criteria->setSort('category_id, created');
$criteria->setOrder('ASC, DESC');

// Paginierung
$criteria->setLimit(10);    // Elemente pro Seite
$criteria->setStart(20);    // Offset

// Group by
$criteria->setGroupby('category_id');
```

### Operatoren

| Operator | Beispiel | SQL-Ausgabe |
|----------|---------|------------|
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

### Komplexes Beispiel

```php
// Finde veröffentlichte Artikel in bestimmten Kategorien,
// mit Suchbegriff im Titel, sortiert nach Views
$criteria = new \CriteriaCompo();

// Status muss veröffentlicht sein
$criteria->add(new \Criteria('status', 'published'));

// In Kategorien 1, 2 oder 3
$criteria->add(new \Criteria('category_id', '(1, 2, 3)', 'IN'));

// Titel enthält Suchbegriff
$searchTerm = '%' . $db->escape($searchQuery) . '%';
$criteria->add(new \Criteria('title', $searchTerm, 'LIKE'));

// Erstellt in letzten 30 Tagen
$thirtyDaysAgo = time() - (30 * 24 * 60 * 60);
$criteria->add(new \Criteria('created', $thirtyDaysAgo, '>='));

// Sortiere nach Views absteigend
$criteria->setSort('views');
$criteria->setOrder('DESC');

// Paginierung
$criteria->setLimit(10);
$criteria->setStart($page * 10);

$articles = $articleHandler->getObjects($criteria);
$totalCount = $articleHandler->getCount($criteria);
```

---

## 📝 Direkte Abfragen

Für komplexe Abfragen, die nicht mit Criteria möglich sind, verwenden Sie direktes SQL.

### Sichere Abfragen (Lesen)

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
    // Row verarbeiten
    echo $row['title'];
}
```

### Write Abfragen

```php
// Einfügen
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

// Löschen
$sql = sprintf(
    "DELETE FROM %s WHERE article_id = %d",
    $db->prefix('mymodule_articles'),
    $articleId
);
$db->queryF($sql);
```

### Werte escapen

```php
// String escapen
$safeString = $db->quoteString($userInput);
// oder
$safeString = $db->escape($userInput);

// Integer (kein Escaping nötig, nur casten)
$safeInt = (int) $userInput;
```

---

## ⚠️ Sicherheit Best Practices

### Immer Benutzereingaben escapen

```php
// NIE so machen
$sql = "SELECT * FROM articles WHERE title = '$_GET[title]'"; // SQL Injection!

// SO machen
$title = $db->escape($_GET['title']);
$sql = "SELECT * FROM articles WHERE title = '$title'";

// Oder besser, verwenden Sie Criteria
$criteria = new \Criteria('title', $db->escape($_GET['title']));
```

### Verwenden Sie parametrisierte Abfragen (XMF)

```php
use Xmf\Database\TableLoad;

// Sichere Bulk-Einfügung
$tableLoad = new TableLoad('mymodule_articles');
$tableLoad->insert([
    ['title' => 'Article 1', 'content' => 'Content 1'],
    ['title' => 'Article 2', 'content' => 'Content 2'],
]);
```

### Validieren Sie Eingabetypen

```php
use Xmf\Request;

$id = Request::getInt('id', 0, 'GET');
$title = Request::getString('title', '', 'POST');
```

---

## 📊 Datenbank-Schema Beispiel

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

## 🔗 Verwandte Dokumentation

- [Criteria System Deep Dive](../../04-API-Reference/Kernel/Criteria.md)
- [Design Patterns - Factory](../Architecture/Design-Patterns.md)
- [SQL Injection Prevention](../Security/SQL-Injection-Prevention.md)
- [XoopsDatabase API Reference](../../04-API-Reference/Database/XoopsDatabase.md)

---

#xoops #database #orm #criteria #handlers #mysql
