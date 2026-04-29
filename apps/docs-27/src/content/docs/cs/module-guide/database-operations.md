---
title: "Operace databáze"
---

## Přehled

XOOPS poskytuje databázovou abstrakční vrstvu, která podporuje jak starší procedurální vzory, tak moderní objektově orientované přístupy. Tato příručka popisuje běžné databázové operace pro vývoj modulů.

## Připojení k databázi

### Získání instance databáze

```php
// Legacy approach
global $xoopsDB;

// Modern approach via helper
$db = \XOOPSDatabaseFactory::getDatabaseConnection();

// Via XMF helper
$helper = \XMF\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## Základní operace

### Dotazy SELECT

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

### Operace INSERT

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

### Operace UPDATE

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

### Operace DELETE

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## Použití kritérií

Systém Criteria poskytuje typově bezpečný způsob vytváření dotazů:

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

### Operátoři kritérií

| Provozovatel | Popis |
|----------|-------------|
| `=` | Rovná se (výchozí) |
| `!=` | Nerovná se |
| `<` | Méně než |
| `>` | Větší než |
| `<=` | Menší nebo rovno |
| `>=` | Větší nebo rovno |
| `LIKE` | Shoda vzorů |
| `IN` | V množině hodnot |

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

## Obslužné rutiny objektů

### Metody manipulátorů

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

### Vlastní manipulační metody

```php
class ItemHandler extends \XOOPSPersistableObjectHandler
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

## Transakce

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

## Připravené výpisy (moderní)

```php
// Using PDO through XOOPS database layer
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## Správa schémat

### Vytváření tabulek

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

### Migrace

```php
// migrations/001_create_items.php
return new class {
    public function up(\XOOPSDatabase $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS " . $db->prefix('mymodule_items') . " (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            created INT UNSIGNED NOT NULL
        )";
        $db->queryF($sql);
    }

    public function down(\XOOPSDatabase $db): void
    {
        $sql = "DROP TABLE IF EXISTS " . $db->prefix('mymodule_items');
        $db->queryF($sql);
    }
};
```

## Nejlepší postupy

1. **Vždy uvádějte řetězce** – Pro zadání uživatele použijte `$db->quoteString()`
2. **Použijte Intval** – Cast celá čísla pomocí `intval()` nebo deklarací typu
3. **Upřednostňujte obslužné rutiny** – Pokud je to možné, používejte obslužné rutiny objektů před nezpracovanými SQL
4. **Použít kritéria** – Sestavte dotazy s kritérii pro bezpečnost typu
5. **Handle Errors** – Kontrola návratových hodnot a zpracování selhání
6. **Použít transakce** – Zabalte související operace do transakcí

## Související dokumentace

- ../04-API-Reference/Kernel/Criteria - Dotaz na budovu s kritérii
- ../04-API-Reference/Core/XOOPSObjectHandler - Vzor manipulátoru
- ../02-Core-Concepts/Database/Database-Layer - Abstrakce databáze
- Database/Database-Schema - Průvodce návrhem schématu