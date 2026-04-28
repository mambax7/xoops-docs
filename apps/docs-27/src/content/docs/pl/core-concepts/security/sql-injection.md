---
title: "Zapobieganie wstrzykiwaniu SQL"
description: "Praktyki bezpieczeństwa bazy danych i zapobieganie atakom SQL injection w XOOPS"
---

Wstrzykiwanie SQL jest jedną z najpotężniejszych i najpowszechniejszych luk bezpieczeństwa w aplikacjach internetowych. Ten przewodnik obejmuje ochronę modułów XOOPS przed atakami SQL injection.

## Dokumentacja pokrewna

- Security-Best-Practices - Kompleksowy przewodnik bezpieczeństwa
- CSRF-Protection - System tokenów i klasa XoopsSecurity
- Input-Sanitization - MyTextSanitizer i walidacja

## Zrozumienie wstrzykiwania SQL

Wstrzykiwanie SQL występuje, gdy dane wejściowe użytkownika są zawarte bezpośrednio w zapytaniach SQL bez prawidłowej sanityzacji lub parametryzacji.

### Przykład podatnego kodu

```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

Jeśli użytkownik przesle `1 OR 1=1` jako ID, zapytanie staje się:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

To zwraca wszystkie rekordy zamiast tylko jednego.

## Korzystanie z zapytań sparametryzowanych

Najskuteczniejszą obroną przed wstrzykiwaniem SQL jest użycie zapytań sparametryzowanych (instrukcji przygotowanych).

### Podstawowe zapytanie sparametryzowane

```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### Wiele parametrów

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### Parametry nazwane

Niektóre abstrakcje baz danych obsługują parametry nazwane:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## Korzystanie z XoopsObject i XoopsObjectHandler

XOOPS zapewnia dostęp do bazy danych zorientowany obiektowo, który pomaga zapobiegać wstrzykiwaniu SQL poprzez system Criteria.

### Podstawowe użycie Criteria

```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```

### CriteriaCompo dla wielu warunków

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('category_id', (int)$categoryId));
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', (int)$userId));

// Optional: Add ordering and limits
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart(0);

$items = $itemHandler->getObjects($criteria);
```

### Operatory Criteria

```php
// Equal (default)
$criteria->add(new Criteria('status', 'active'));

// Not equal
$criteria->add(new Criteria('status', 'deleted', '!='));

// Greater than
$criteria->add(new Criteria('count', 100, '>'));

// Less than or equal
$criteria->add(new Criteria('price', 50, '<='));

// LIKE (for partial matching)
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));

// IN (multiple values)
$criteria->add(new Criteria('id', '(' . implode(',', $ids) . ')', 'IN'));
```

### Warunki OR

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## Prefiksy tabel

Zawsze używaj systemu prefiksu tabel XOOPS:

```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## Zapytania INSERT

### Korzystanie z instrukcji przygotowanych

```php
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') .
       " (title, content, uid, created) VALUES (?, ?, ?, ?)";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    (int)$userId,
    time()
]);

if ($result) {
    $newId = $xoopsDB->getInsertId();
}
```

### Korzystanie z XoopsObject

```php
// Create new object
$item = $itemHandler->create();

// Set values - handler escapes automatically
$item->setVar('title', $title);
$item->setVar('content', $content);
$item->setVar('uid', (int)$userId);
$item->setVar('created', time());

// Insert
if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}
```

## Zapytania UPDATE

### Korzystanie z instrukcji przygotowanych

```php
$sql = "UPDATE " . $xoopsDB->prefix('mytable') .
       " SET title = ?, content = ?, updated = ? WHERE id = ?";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    time(),
    (int)$id
]);
```

### Korzystanie z XoopsObject

```php
// Get existing object
$item = $itemHandler->get((int)$id);

if ($item) {
    $item->setVar('title', $title);
    $item->setVar('content', $content);
    $item->setVar('updated', time());

    $itemHandler->insert($item);
}
```

## Zapytania DELETE

### Korzystanie z instrukcji przygotowanych

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Korzystanie z XoopsObject

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### Hurtowe usuwanie z Criteria

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## Escapowanie, gdy jest konieczne

Jeśli nie możesz użyć instrukcji przygotowanych, użyj prawidłowego escapowania:

```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

Jednak **zawsze preferuj instrukcje przygotowane** zamiast escapowania.

## Bezpieczne budowanie dynamicznych zapytań

### Bezpieczne dynamiczne nazwy kolumn

Nazwy kolumn nie mogą być parametryzowane. Waliduj względem listy dozwolonych:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### Bezpieczne dynamiczne nazwy tabel

Podobnie waliduj nazwy tabel:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### Budowanie klauzul WHERE dynamicznie

```php
$criteria = new CriteriaCompo();

// Add conditions based on input
if (!empty($_GET['category'])) {
    $criteria->add(new Criteria('category_id', (int)$_GET['category']));
}

if (!empty($_GET['status'])) {
    $allowed_statuses = ['draft', 'published', 'archived'];
    if (in_array($_GET['status'], $allowed_statuses)) {
        $criteria->add(new Criteria('status', $_GET['status']));
    }
}

if (!empty($_GET['search'])) {
    $search = '%' . $_GET['search'] . '%';
    $criteria->add(new Criteria('title', $search, 'LIKE'));
}

$items = $itemHandler->getObjects($criteria);
```

## Zapytania LIKE

Bądź ostrożny z zapytaniami LIKE, aby uniknąć wstrzykiwania symboli wieloznacznych:

```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## Klauzule IN

Podczas korzystania z klauzul IN, upewnij się, że wszystkie wartości są prawidłowo wpisane:

```php
// Array of IDs from user input
$inputIds = $_POST['ids'] ?? [];

// Sanitize: ensure all are integers
$safeIds = array_map('intval', $inputIds);
$safeIds = array_filter($safeIds, function($id) { return $id > 0; });

if (!empty($safeIds)) {
    $idList = implode(',', $safeIds);
    $sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
           " WHERE id IN ({$idList})";
    $result = $xoopsDB->query($sql);
}
```

Lub z Criteria:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## Bezpieczeństwo transakcji

Podczas wykonywania wielu powiązanych zapytań:

```php
// Start transaction
$xoopsDB->query("START TRANSACTION");

try {
    // Query 1
    $sql1 = "INSERT INTO " . $xoopsDB->prefix('items') . " (title) VALUES (?)";
    $result1 = $xoopsDB->query($sql1, [$title]);

    if (!$result1) {
        throw new Exception('Insert failed');
    }

    $itemId = $xoopsDB->getInsertId();

    // Query 2
    $sql2 = "INSERT INTO " . $xoopsDB->prefix('item_meta') .
            " (item_id, meta_key, meta_value) VALUES (?, ?, ?)";
    $result2 = $xoopsDB->query($sql2, [$itemId, 'author', $author]);

    if (!$result2) {
        throw new Exception('Meta insert failed');
    }

    // Commit
    $xoopsDB->query("COMMIT");

} catch (Exception $e) {
    // Rollback on error
    $xoopsDB->query("ROLLBACK");
    throw $e;
}
```

## Obsługa błędów

Nigdy nie ujawniaj błędów SQL użytkownikom:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);

if (!$result) {
    // Log the actual error for debugging
    error_log('Database error: ' . $xoopsDB->error());

    // Show generic message to user
    redirect_header('index.php', 3, 'An error occurred. Please try again.');
    exit();
}
```

## Typowe błędy do uniknięcia

### Błąd 1: Bezpośrednia interpolacja zmiennych

```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Błąd 2: Użycie addslashes()

```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### Błąd 3: Ufanie numerycznym ID

```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### Błąd 4: Wstrzykiwanie drugiego rzędu

```php
// Data from database is NOT automatically safe
$userData = $itemHandler->get($id);
$username = $userData->getVar('username');

// WRONG - trusting data from database
$sql = "SELECT * FROM log WHERE username = '" . $username . "'";

// RIGHT - always use parameters
$sql = "SELECT * FROM log WHERE username = ?";
$result = $xoopsDB->query($sql, [$username]);
```

## Testy bezpieczeństwa

### Testuj swoje zapytania

Testuj swoje formularze za pomocą tych danych wejściowych, aby sprawdzić wstrzykiwanie SQL:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Jeśli którykolwiek z nich powoduje nieoczekiwane zachowanie lub błędy, masz podatność.

### Testy automatyczne

Używaj zautomatyzowanych narzędzi do testowania wstrzykiwania SQL podczas opracowywania:

- SQLMap
- Burp Suite
- OWASP ZAP

## Streszczenie najlepszych praktyk

1. **Zawsze używaj zapytań sparametryzowanych** (instrukcji przygotowanych)
2. **Używaj XoopsObject/XoopsObjectHandler**, gdy jest to możliwe
3. **Używaj klas Criteria** do budowania zapytań
4. **Lista dozwolonych wartości** dla nazw kolumn i tabel
5. **Rzutuj wartości numeryczne** jawnie za pomocą `(int)` lub `(float)`
6. **Nigdy nie ujawniaj błędów bazy danych** użytkownikom
7. **Używaj transakcji** dla wielu powiązanych zapytań
8. **Testuj wstrzykiwanie SQL** podczas opracowywania
9. **Escapuj symbole wieloznaczne LIKE** w zapytaniach wyszukiwania
10. **Sanityzuj wartości klauzuli IN** indywidualnie

---

#security #sql-injection #database #xoops #prepared-statements #Criteria
