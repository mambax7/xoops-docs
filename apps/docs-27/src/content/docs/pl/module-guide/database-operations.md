---
title: "Operacje na bazie danych"
---

## Przegląd

XOOPS zapewnia warstwę abstrakcji bazy danych, która obsługuje zarówno starsze wzorce proceduralne, jak i nowoczesne podejścia obiektowo zorientowane. Ten przewodnik obejmuje typowe operacje na bazie danych dla rozwoju modułów.

## Połączenie z bazą danych

### Uzyskanie instancji bazy danych

```php
// Podejście legacy
global $xoopsDB;

// Nowoczesne podejście za pośrednictwem helpera
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Za pośrednictwem helpera XMF
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## Operacje podstawowe

### Zapytania SELECT

```php
// Proste zapytanie
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE status = 1";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo $row['title'];
}

// Z parametrami (bezpieczne podejście)
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);

// Jeden wiersz
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = " . intval($id);
$result = $db->query($sql);
$row = $db->fetchArray($result);
```

### Operacje INSERT

```php
// Podstawowy insert
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);

// Pobierz ostatni wstawiony ID
$newId = $db->getInsertId();
```

### Operacje UPDATE

```php
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    time(),
    intval($id)
);
$db->queryF($sql);

// Sprawdź wiersze, których to dotyczy
$affectedRows = $db->getAffectedRows();
```

### Operacje DELETE

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## Używanie kryteriów

System kryteriów zapewnia typowy bezpieczny sposób konstruowania zapytań:

```php
use Criteria;
use CriteriaCompo;

// Proste kryteria
$criteria = new Criteria('status', 1);
$items = $itemHandler->getObjects($criteria);

// Złożone kryteria
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

### Operatory kryteriów

| Operator | Opis |
|----------|-------------|
| `=` | Równy (domyślnie) |
| `!=` | Nierówny |
| `<` | Mniej niż |
| `>` | Więcej niż |
| `<=` | Mniej lub równy |
| `>=` | Więcej lub równy |
| `LIKE` | Dopasowanie wzorca |
| `IN` | W zestawie wartości |

```php
// Kryteria LIKE
$criteria = new Criteria('title', '%search%', 'LIKE');

// Kryteria IN
$criteria = new Criteria('id', '(1,2,3)', 'IN');

// Zakres dat
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('created', $startDate, '>='));
$criteria->add(new Criteria('created', $endDate, '<='));
```

## Handlery obiektu

### Metody handlera

```php
$handler = xoops_getModuleHandler('item', 'mymodule');

// Utwórz nowy obiekt
$item = $handler->create();

// Pobierz po ID
$item = $handler->get($id);

// Pobierz wiele
$items = $handler->getObjects($criteria);

// Pobierz jako tablicę
$items = $handler->getAll($criteria);

// Liczba
$count = $handler->getCount($criteria);

// Zapisz
$success = $handler->insert($item);

// Usuń
$success = $handler->delete($item);
```

### Niestandardowe metody handlera

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

## Transakcje

```php
// Rozpocznij transakcję
$db->query('START TRANSACTION');

try {
    // Wykonaj wiele operacji
    $db->queryF($sql1);
    $db->queryF($sql2);
    $db->queryF($sql3);

    // Zatwierdź jeśli wszystko się powiedzie
    $db->query('COMMIT');
} catch (\Exception $e) {
    // Wycofaj w razie błędu
    $db->query('ROLLBACK');
    throw $e;
}
```

## Instrukcje przygotowane (nowoczesne)

```php
// Używanie PDO przez warstwę bazy danych XOOPS
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## Zarządzanie schematem

### Tworzenie tabel

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

### Migracje

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

## Najlepsze praktyki

1. **Zawsze cytuj łańcuchy** - Używaj `$db->quoteString()` dla danych wejściowych użytkownika
2. **Używaj Intval** - Rzutuj liczby całkowite za pomocą `intval()` lub deklaracji typów
3. **Preferuj handlery** - Używaj handlerów obiektów zamiast surowego SQL, gdy to możliwe
4. **Używaj kryteriów** - Konstruuj zapytania za pomocą kryteriów dla bezpieczeństwa typów
5. **Obsługuj błędy** - Sprawdzaj wartości zwracane i obsługuj awarie
6. **Używaj transakcji** - Opatruj powiązane operacje w transakcjach

## Powiązana dokumentacja

- ../04-API-Reference/Kernel/Criteria - Konstruowanie zapytań za pomocą kryteriów
- ../04-API-Reference/Core/XoopsObjectHandler - Wzorzec handlera
- ../02-Core-Concepts/Database/Database-Layer - Abstrakcja bazy danych
- Database/Database-Schema - Przewodnik projektowania schematu
