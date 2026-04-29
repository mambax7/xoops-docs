---
title: "Λειτουργίες Βάσεων Δεδομένων"
---

## Επισκόπηση

Το XOOPS παρέχει ένα επίπεδο αφαίρεσης βάσης δεδομένων που υποστηρίζει τόσο παλαιού τύπου διαδικαστικά μοτίβα όσο και σύγχρονες αντικειμενοστρεφείς προσεγγίσεις. Αυτός ο οδηγός καλύπτει κοινές λειτουργίες βάσης δεδομένων για την ανάπτυξη λειτουργικών μονάδων.

## Σύνδεση βάσης δεδομένων

## # Λήψη της παρουσίας της βάσης δεδομένων

```php
// Legacy approach
global $xoopsDB;

// Modern approach via helper
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Via XMF helper
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## Βασικές λειτουργίες

## # SELECT Ερωτήματα

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

## # INSERT Λειτουργίες

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

## # UPDATE Λειτουργίες

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

## # DELETE Λειτουργίες

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## Χρήση κριτηρίων

Το σύστημα Criteria παρέχει έναν ασφαλή τρόπο δημιουργίας ερωτημάτων:

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

## # Κριτήρια Χειριστές

| Χειριστής | Περιγραφή |
|----------|-------------|
| `=` | Ίσο (προεπιλογή) |
| `!=` | Όχι ίσο |
| `<` | Λιγότερο από |
| `>` | Μεγαλύτερο από |
| `<=` | Λιγότερο ή ίσο |
| `>=` | Μεγαλύτερο ή ίσο |
| `LIKE` | Ταίριασμα μοτίβων |
| `IN` | Σε σύνολο τιμών |

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

## Χειριστές αντικειμένων

## # Μέθοδοι χειρισμού

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

## # Μέθοδοι προσαρμοσμένου χειριστή

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

## Συναλλαγές

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

## Έτοιμες Δηλώσεις (Σύγχρονες)

```php
// Using PDO through XOOPS database layer
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## Διαχείριση Σχήματος

## # Δημιουργία πινάκων

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

## # Μεταναστεύσεις

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

## Βέλτιστες πρακτικές

1. **Always Quote String** - Χρησιμοποιήστε το `$db->quoteString()` για εισαγωγή από τον χρήστη
2. **Χρησιμοποιήστε Intval** - Μεταδώστε ακέραιους αριθμούς με `intval()` ή δηλώσεις τύπου
3. **Προτιμήστε χειριστές** - Χρησιμοποιήστε συσκευές χειρισμού αντικειμένων πάνω από ακατέργαστο SQL όταν είναι δυνατόν
4. **Χρήση κριτηρίων** - Δημιουργήστε ερωτήματα με κριτήρια για ασφάλεια τύπου
5. **Χειρισμός σφαλμάτων** - Ελέγξτε τις τιμές επιστροφής και χειριστείτε τις αποτυχίες
6. **Χρήση Συναλλαγών** - Αναδιπλώστε τις σχετικές λειτουργίες σε συναλλαγές

## Σχετική τεκμηρίωση

- ../04-API-Reference/Kernel/Criteria - Κτίριο ερωτημάτων με κριτήρια
- ../04-API-Reference/Core/XoopsObjectHandler - Μοτίβο χειριστή
- ../02-Core-Concepts/Database/Database-Layer - Αφαίρεση βάσης δεδομένων
- Database/Database-Schema - Οδηγός σχεδίασης σχήματος
