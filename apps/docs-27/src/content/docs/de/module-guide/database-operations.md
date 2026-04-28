---
title: "Datenbankoperationen"
---

## Überblick

XOOPS bietet eine Datenbankabstraktionsschicht, die sowohl veraltete prozedurale Muster als auch moderne objektorientierte Ansätze unterstützt. Dieser Leitfaden behandelt häufige Datenbankoperationen für die Modulentwicklung.

## Datenbankverbindung

### Datenbankinstanz abrufen

```php
// Veralteter Ansatz
global $xoopsDB;

// Moderner Ansatz über Factory
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Über XMF-Helper
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## Grundlegende Operationen

### SELECT-Queries

```php
// Einfache Query
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE status = 1";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo $row['title'];
}

// Mit Parametern (sicherer Ansatz)
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);

// Einzelne Zeile
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = " . intval($id);
$result = $db->query($sql);
$row = $db->fetchArray($result);
```

### INSERT-Operationen

```php
// Grundlegendes Insert
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);

// Letzten Insert-ID abrufen
$newId = $db->getInsertId();
```

### UPDATE-Operationen

```php
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    time(),
    intval($id)
);
$db->queryF($sql);

// Betroffene Zeilen überprüfen
$affectedRows = $db->getAffectedRows();
```

### DELETE-Operationen

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## Kriterien verwenden

Das Criteria-System bietet eine typsichere Möglichkeit, Queries zu erstellen:

```php
use Criteria;
use CriteriaCompo;

// Einfache Kriterien
$criteria = new Criteria('status', 1);
$items = $itemHandler->getObjects($criteria);

// Zusammengesetzte Kriterien
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart($offset);

$items = $itemHandler->getObjects($criteria);
$count = $itemHandler->getCount($criteria);
```

### Kriterienoperatoren

| Operator | Beschreibung |
|----------|-------------|
| `=` | Gleich (Standard) |
| `!=` | Nicht gleich |
| `<` | Kleiner als |
| `>` | Größer als |
| `<=` | Kleiner als oder gleich |
| `>=` | Größer als oder gleich |
| `LIKE` | Pattern-Matching |
| `IN` | In Wertemenge |

```php
// LIKE-Kriterien
$criteria = new Criteria('title', '%search%', 'LIKE');

// IN-Kriterien
$criteria = new Criteria('id', '(1,2,3)', 'IN');

// Datumsbereich
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('created', $startDate, '>='));
$criteria->add(new Criteria('created', $endDate, '<='));
```

## Objekt-Handler

### Handler-Methoden

```php
$handler = xoops_getModuleHandler('item', 'mymodule');

// Neues Objekt erstellen
$item = $handler->create();

// Nach ID abrufen
$item = $handler->get($id);

// Mehrere abrufen
$items = $handler->getObjects($criteria);

// Als Array abrufen
$items = $handler->getAll($criteria);

// Zählen
$count = $handler->getCount($criteria);

// Speichern
$success = $handler->insert($item);

// Löschen
$success = $handler->delete($item);
```

### Benutzerdefinierte Handler-Methoden

```php
class ItemHandler extends \XoopsPersistableObjectHandler
{
    public function getPublished(int $limit = 10): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 'published'));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    public function getByCategory(int $categoryId): array
    {
        $criteria = new Criteria('category_id', $categoryId);
        return $this->getObjects($criteria);
    }
}
```

## Transaktionen

```php
// Transaktion beginnen
$db->query('START TRANSACTION');

try {
    // Mehrere Operationen durchführen
    $db->queryF($sql1);
    $db->queryF($sql2);
    $db->queryF($sql3);

    // Bei Erfolg aktualisieren
    $db->query('COMMIT');
} catch (\Exception $e) {
    // Bei Fehler zurückrollen
    $db->query('ROLLBACK');
    throw $e;
}
```

## Prepared Statements (Modernes)

```php
// Über PDO durch XOOPS-Datenbankschicht
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## Schema-Verwaltung

### Tabellen erstellen

```sql
-- sql/mysql.sql
CREATE TABLE `{PREFIX}_mymodule_items` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT,
    `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    `author_id` INT(11) UNSIGNED NOT NULL,
    `created` INT(11) UNSIGNED NOT NULL,
    `updated` INT(11) UNSIGNED DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_author` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migrationen

```php
// migrations/001_create_items.php
return new class {
    public function up(\XoopsDatabase $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS " . $db->prefix('mymodule_items') . " (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            created INT UNSIGNED NOT NULL
        )";
        $db->queryF($sql);
    }

    public function down(\XoopsDatabase $db): void
    {
        $sql = "DROP TABLE IF EXISTS " . $db->prefix('mymodule_items');
        $db->queryF($sql);
    }
};
```

## Best Practices

1. **Immer Zeichenfolgen zitieren** - Verwenden Sie `$db->quoteString()` für Benutzereingaben
2. **Intval verwenden** - Zahlen mit `intval()` oder Typdeklarationen casten
3. **Handler bevorzugen** - Verwenden Sie Objekt-Handler gegenüber rohem SQL, wenn möglich
4. **Criteria verwenden** - Erstellen Sie Queries mit Criteria für Typsicherheit
5. **Fehler behandeln** - Überprüfen Sie Rückgabewerte und behandeln Sie Fehler
6. **Transaktionen verwenden** - Umwickeln Sie zusammenhängende Operationen in Transaktionen

## Verwandte Dokumentation

- ../04-API-Reference/Kernel/Criteria - Query-Erstellung mit Criteria
- ../04-API-Reference/Core/XoopsObjectHandler - Handler-Muster
- ../02-Core-Concepts/Database/Database-Layer - Datenbankabstraktion
- Database/Database-Schema - Schema-Design-Leitfaden
