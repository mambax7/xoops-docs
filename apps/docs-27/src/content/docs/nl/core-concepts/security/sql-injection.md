---
title: "SQL Injectiepreventie"
description: "Databasebeveiligingspraktijken en het voorkomen van SQL-injectie in XOOPS"
---
SQL-injectie is een van de gevaarlijkste en meest voorkomende kwetsbaarheden in webapplicaties. In deze handleiding wordt beschreven hoe u uw XOOPS-modules kunt beschermen tegen SQL-injectieaanvallen.

## Gerelateerde documentatie

- Best-practices op het gebied van beveiliging - Uitgebreide beveiligingsgids
- CSRF-bescherming - Tokensysteem en XoopsSecurity-klasse
- Invoer-opschoning - MyTextSanitizer en validatie

## SQL-injectie begrijpen

SQL-injectie vindt plaats wanneer gebruikersinvoer rechtstreeks wordt opgenomen in SQL-query's zonder de juiste opschoning of parametrisering.

### Kwetsbaar codevoorbeeld

```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

Als een gebruiker `1 OR 1=1` als ID doorgeeft, wordt de query:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

Hiermee worden alle records geretourneerd in plaats van slechts één.

## Geparametriseerde zoekopdrachten gebruiken

De meest effectieve verdediging tegen SQL-injectie is het gebruik van geparametriseerde queries (opgestelde instructies).

### Basisgeparametriseerde query

```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### Meerdere parameters

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### Benoemde parameters

Sommige databaseabstracties ondersteunen benoemde parameters:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## XoopsObject en XoopsObjectHandler gebruiken

XOOPS biedt objectgeoriënteerde databasetoegang die injectie van SQL via het Criteria-systeem helpt voorkomen.

### Gebruik van basiscriteria

```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```

### CriteriaCompo voor meerdere aandoeningen

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

### Criteria-operatoren

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

### OF Voorwaarden

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## Tabelvoorvoegsels

Gebruik altijd het tabelvoorvoegsel XOOPS:

```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## INSERT-query's

### Opgestelde verklaringen gebruiken

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

### XoopsObject gebruiken

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

## UPDATE-query's

### Opgestelde verklaringen gebruiken

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

### XoopsObject gebruiken

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

## DELETE-query's

### Opgestelde verklaringen gebruiken

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### XoopsObject gebruiken

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### Bulkverwijdering met criteria

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## Ontsnappen wanneer dat nodig is

Als u geen voorbereide uitspraken kunt gebruiken, gebruik dan de juiste ontsnapping:

```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

**Geef echter altijd de voorkeur aan voorbereide verklaringen** boven ontsnappen.

## Veilig dynamische zoekopdrachten bouwen

### Veilige dynamische kolomnamen

Kolomnamen kunnen niet worden geparametriseerd. Valideren op basis van een witte lijst:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### Veilige dynamische tabelnamen

Valideer op dezelfde manier de tabelnamen:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### WHERE-clausules dynamisch opbouwen

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

## LIKE-query's

Wees voorzichtig met LIKE-query's om wildcard-injectie te voorkomen:

```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## IN-clausules

Zorg er bij het gebruik van IN-clausules voor dat alle waarden correct zijn getypt:

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

Of met criteria:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## Transactieveiligheid

Bij het uitvoeren van meerdere gerelateerde zoekopdrachten:

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

## Foutafhandeling

Stel SQL-fouten nooit bloot aan gebruikers:

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

## Veelvoorkomende fouten die u moet vermijden

### Fout 1: Directe variabele interpolatie

```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Fout 2: Addlashes() gebruiken

```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### Fout 3: Numerieke ID's vertrouwen

```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### Fout 4: Injectie van de tweede orde

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

## Beveiligingstests

### Test uw zoekopdrachten

Test uw formulieren met deze invoer om te controleren op SQL-injectie:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Als een van deze onverwachte gedragingen of fouten veroorzaakt, is er sprake van een kwetsbaarheid.

### Geautomatiseerd testen

Gebruik tijdens de ontwikkeling geautomatiseerde SQL-injectietesttools:

-SQLMap
- Burp-suite
- OWASP ZAP

## Samenvatting van beste praktijken

1. **Gebruik altijd geparametriseerde queries** (opgestelde instructies)
2. **Gebruik XoopsObject/XoopsObjectHandler** indien mogelijk
3. **Gebruik Criteriaklassen** voor het bouwen van query's
4. **Toegestane waarden op de witte lijst** voor kolommen en tabelnamen
5. **Cast numerieke waarden** expliciet met `(int)` of `(float)`
6. **Stel nooit databasefouten** bloot aan gebruikers
7. **Gebruik transacties** voor meerdere gerelateerde zoekopdrachten
8. **Test voor SQL-injectie** tijdens de ontwikkeling
9. **Escape LIKE jokertekens** in zoekopdrachten
10. **In-clausulewaarden** afzonderlijk opschonen

---#security #sql-injection #database #xoops #prepared-statements #Criteria