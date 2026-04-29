---
title: "Databasebewerkingen"
---
## Overzicht

XOOPS biedt een database-abstractielaag die zowel oudere procedurele patronen als moderne objectgeoriënteerde benaderingen ondersteunt. Deze handleiding behandelt algemene databasebewerkingen voor moduleontwikkeling.

## Databaseverbinding

### Het database-exemplaar ophalen

```php
// Legacy approach
global $xoopsDB;

// Modern approach via helper
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Via XMF helper
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## Basisbewerkingen

### SELECT-query's

```php
// Simple query
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE status = 1";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo $row['title'];
}

// With parameters (safe approach)
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);

// Single row
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = " . intval($id);
$result = $db->query($sql);
$row = $db->fetchArray($result);
```

### INSERT-bewerkingen

```php
// Basic insert
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);

// Get last insert ID
$newId = $db->getInsertId();
```

### UPDATE-bewerkingen

```php
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    time(),
    intval($id)
);
$db->queryF($sql);

// Check affected rows
$affectedRows = $db->getAffectedRows();
```

### DELETE-bewerkingen

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## Criteria gebruiken

Het Criteria-systeem biedt een typeveilige manier om query's te bouwen:

```php
use Criteria;
use CriteriaCompo;

// Simple criteria
$criteria = new Criteria('status', 1);
$items = $itemHandler->getObjects($criteria);

// Compound criteria
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

### Criteria-operatoren

| Exploitant | Beschrijving |
|----------|------------|
| `=` | Gelijk (standaard) |
| `!=` | Niet gelijk |
| `<` | Minder dan |
| `>` | Groter dan |
| `<=` | Kleiner dan of gelijk |
| `>=` | Groter dan of gelijk |
| `LIKE` | Patroonaanpassing |
| `IN` | In reeks waarden |

```php
// LIKE criteria
$criteria = new Criteria('title', '%search%', 'LIKE');

// IN criteria
$criteria = new Criteria('id', '(1,2,3)', 'IN');

// Date range
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('created', $startDate, '>='));
$criteria->add(new Criteria('created', $endDate, '<='));
```

## Objectbehandelaars

### Handlermethoden

```php
$handler = xoops_getModuleHandler('item', 'mymodule');

// Create new object
$item = $handler->create();

// Get by ID
$item = $handler->get($id);

// Get multiple
$items = $handler->getObjects($criteria);

// Get as array
$items = $handler->getAll($criteria);

// Count
$count = $handler->getCount($criteria);

// Save
$success = $handler->insert($item);

// Delete
$success = $handler->delete($item);
```

### Aangepaste afhandelingsmethoden

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

## Transacties

```php
// Begin transaction
$db->query('START TRANSACTION');

try {
    // Perform multiple operations
    $db->queryF($sql1);
    $db->queryF($sql2);
    $db->queryF($sql3);

    // Commit if all succeed
    $db->query('COMMIT');
} catch (\Exception $e) {
    // Rollback on error
    $db->query('ROLLBACK');
    throw $e;
}
```

## Opgestelde verklaringen (modern)

```php
// Using PDO through XOOPS database layer
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## Schemabeheer

### Tabellen maken

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

### Migraties

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

## Beste praktijken

1. **Teksten altijd citeren** - Gebruik `$db->quoteString()` voor gebruikersinvoer
2. **Gebruik Intval** - Gehele getallen casten met `intval()` of type-declaraties
3. **Geef de voorkeur aan handlers** - Gebruik indien mogelijk objecthandlers boven onbewerkte SQL
4. **Gebruik criteria**: maak query's met criteria voor typeveiligheid
5. **Fouten afhandelen** - Controleer retourwaarden en handel fouten af
6. **Gebruik transacties** - Verpak gerelateerde bewerkingen in transacties

## Gerelateerde documentatie

- ../04-API-Reference/Kernel/Criteria - Query bouwen met criteria
- ../04-API-Reference/Core/XoopsObjectHandler - Handlerpatroon
- ../02-Core-Concepts/Database/Database-Layer - Database-abstractie
- Database/Database-Schema - Handleiding voor schemaontwerp