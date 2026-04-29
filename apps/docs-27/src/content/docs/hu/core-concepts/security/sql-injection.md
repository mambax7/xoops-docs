---
title: "SQL-injektálás megelőzése"
description: "Adatbázisbiztonsági gyakorlatok és az SQL-befecskendezés megakadályozása XOOPS-ban"
---
A SQL injekció az egyik legveszélyesebb és legáltalánosabb webalkalmazás-sérülékenység. Ez az útmutató bemutatja, hogyan védheti meg XOOPS moduljait a SQL injekciós támadásokkal szemben.

## Kapcsolódó dokumentáció

- Biztonság – legjobb gyakorlatok – Átfogó biztonsági útmutató
- CSRF-védelem - Token rendszer és XOOPS biztonsági osztály
- Input-Sanitization - MyTextSanitizer és érvényesítés

## A SQL befecskendezés megértése

A SQL befecskendezés akkor történik, ha a felhasználói bevitel közvetlenül szerepel a SQL lekérdezésekben megfelelő fertőtlenítés vagy paraméterezés nélkül.

### Sebezhető kód példa

```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

Ha egy felhasználó a `1 OR 1=1` értéket adja meg ID-ként, a lekérdezés a következő lesz:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

Ez az összes rekordot visszaadja egy helyett.

## Paraméterezett lekérdezések használata

A SQL injekció elleni leghatékonyabb védekezés a paraméterezett lekérdezések (előkészített utasítások) használata.

### Alapvető paraméterezett lekérdezés

```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### Több paraméter

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### Elnevezett paraméterek

Egyes adatbázis-absztrakciók támogatják az elnevezett paramétereket:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## XOOPSObject és XOOPSObjectHandler használata

A XOOPS objektumorientált adatbázis-hozzáférést biztosít, amely segít megelőzni a SQL befecskendezést a Criteria rendszeren keresztül.

### Alapvető kritériumok használata

```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```

### CriteriaCompo több feltételhez

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

### Kritériumkezelők

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

### VAGY Feltételek

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## Táblázat előtagok

Mindig a XOOPS táblázat előtagrendszert használja:

```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## INSERT Lekérdezések

### Előkészített kimutatások használata

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

### Az XOOPSObject használata

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

## UPDATE Lekérdezések

### Előkészített kimutatások használata

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

### Az XOOPSObject használata

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

## DELETE Lekérdezések

### Előkészített kimutatások használata

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Az XOOPSObject használata

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### Tömeges törlés feltételekkel

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## Menekülés, amikor szükséges

Ha nem tud elkészített nyilatkozatokat használni, használjon megfelelő menekülést:

```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

Mindazonáltal **mindig előnyben részesítjük az előkészített nyilatkozatokat**, mint a szökést.

## Dinamikus lekérdezések biztonságos felépítése

### Biztonságos dinamikus oszlopnevek

Az oszlopnevek nem paraméterezhetők. Érvényesítés engedélyezési lista alapján:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### Biztonságos dinamikus táblanevek

Hasonlóképpen ellenőrizze a táblaneveket:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### WHERE záradékok dinamikus felépítése

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

## LIKE Lekérdezések

Legyen óvatos a LIKE lekérdezésekkel a helyettesítő karakterek beszúrásának elkerülése érdekében:

```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## IN záradékok

IN záradék használatakor ügyeljen arra, hogy minden érték helyesen legyen beírva:

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

Vagy kritériumokkal:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## Tranzakcióbiztonság

Több kapcsolódó lekérdezés végrehajtásakor:

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

## Hibakezelés

Soha ne tegye ki a SQL hibákat a felhasználóknak:

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

## Gyakori hibák, amelyeket el kell kerülni

### 1. hiba: Közvetlen változó interpoláció

```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### 2. hiba: addslashes()

```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### 3. hiba: Megbízunk a numerikus azonosítókban

```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### 4. hiba: Másodrendű injekció

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

## Biztonsági tesztelés

### Tesztelje lekérdezéseit

Tesztelje űrlapjait ezekkel a bemenetekkel, hogy ellenőrizze a SQL injekciót:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Ha ezek bármelyike váratlan viselkedést vagy hibákat okoz, akkor biztonsági rés van.

### Automatizált tesztelés

A fejlesztés során használjon automatizált SQL befecskendezést tesztelő eszközöket:

- SQLMap
- Burp lakosztály
- OWASP ZAP

## A legjobb gyakorlatok összefoglalása

1. **Mindig paraméterezett lekérdezéseket használjon** (előkészített utasítások)
2. **Ha lehetséges, használja a XOOPSObject/XOOPSObjectHandler** értéket
3. **Használja a Criteria osztályokat** a lekérdezések összeállításához
4. **Tegye fel az engedélyezett értékeket** az oszlopok és táblázatok neveihez
5. **Numerikus értékek átküldése** kifejezetten `(int)` vagy `(float)`
6. **Soha ne tegye ki adatbázishibákat** a felhasználóknak
7. **Tranzakciók használata** több kapcsolódó lekérdezéshez
8. **A fejlesztés során tesztelje a SQL befecskendezést**
9. **Kilépés LIKE helyettesítő karakterek** a keresési lekérdezésekben
10. **Sanitize IN záradékértékek** egyenként

---#biztonság #sql-injekció #adatbázis #xoops #elkészített nyilatkozatok #Criteria
