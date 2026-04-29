---
title: "SQL Injection Prevention"
description: "Databasesikkerhedspraksis og forebyggelse af SQL-injektion i XOOPS"
---

SQL-injektion er en af de farligste og mest almindelige sårbarheder i webapplikationer. Denne vejledning dækker, hvordan du beskytter dine XOOPS-moduler mod SQL-injektionsangreb.

## Relateret dokumentation

- Sikkerhed-Bedste Praksis - Omfattende sikkerhedsvejledning
- CSRF-Beskyttelse - Tokensystem og XoopsSecurity klasse
- Input-sanering - MyTextSanitizer og validering

## Forståelse af SQL Injection

SQL-injektion opstår, når brugerinput er inkluderet direkte i SQL-forespørgsler uden korrekt desinficering eller parametrering.

### Eksempel på sårbar kode

```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

Hvis en bruger sender `1 OR 1=1` som id, bliver forespørgslen:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

Dette returnerer alle poster i stedet for kun én.

## Brug af parametriserede forespørgsler

Det mest effektive forsvar mod SQL-injektion er at bruge parametriserede forespørgsler (forberedte udsagn).

### Grundlæggende parametriseret forespørgsel

```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### Flere parametre

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### Navngivne parametre

Nogle databaseabstraktioner understøtter navngivne parametre:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## Brug af XoopsObject og XoopsObjectHandler

XOOPS giver objektorienteret databaseadgang, der hjælper med at forhindre SQL-injektion gennem Criteria-systemet.

### Grundlæggende kriteriebrug

```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```

### CriteriaCompo for flere tilstande

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

### Kriterier Operatører

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

### ELLER Betingelser

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## Tabelpræfikser

Brug altid XOOPS tabelpræfikssystemet:

```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## INSERT Forespørgsler

### Brug af forberedte udsagn

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

### Brug af XoopsObject

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

## UPDATE Forespørgsler

### Brug af forberedte udsagn

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

### Brug af XoopsObject

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

## DELETE Forespørgsler

### Brug af forberedte udsagn

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Brug af XoopsObject

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### Masseslet med kriterier

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## Undslipper, når det er nødvendigt

Hvis du ikke kan bruge forberedte udsagn, skal du bruge korrekt escape:

```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

Dog **foretrækker du altid forberedte udtalelser** frem for at undslippe.

## Opbygning af dynamiske forespørgsler sikkert

### Sikre dynamiske kolonnenavne

Kolonnenavne kan ikke parametreres. Valider mod en hvidliste:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### Sikre dynamiske tabelnavne

På samme måde skal du validere tabelnavne:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### Opbygning af WHERE-klausuler dynamisk

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

## LIKE Forespørgsler

Vær forsigtig med LIKE-forespørgsler for at undgå indsprøjtning af jokertegn:

```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## IN-klausuler

Når du bruger IN-sætninger, skal du sikre dig, at alle værdier er korrekt indtastet:

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

Eller med kriterier:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## Transaktionssikkerhed

Når du udfører flere relaterede forespørgsler:

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

## Fejlhåndtering

Udsæt aldrig SQL-fejl for brugere:

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

## Almindelige fejl at undgå

### Fejl 1: Direkte variabel interpolation

```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Fejl 2: Brug af addslashes()

```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### Fejl 3: Tillid til numeriske id'er

```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### Fejl 4: Andenordens injektion

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

## Sikkerhedstest

### Test dine forespørgsler

Test dine formularer med disse input for at tjekke for SQL-injektion:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Hvis nogen af disse forårsager uventet adfærd eller fejl, har du en sårbarhed.

### Automatiseret test

Brug automatiserede SQL injektionstestværktøjer under udvikling:

- SQLMap
- Burp Suite
- OWASP ZAP

## Oversigt over bedste praksis

1. **Brug altid parametriserede forespørgsler** (forberedte udsagn)
2. **Brug XoopsObject/XoopsObjectHandler**, når det er muligt
3. **Brug Criteria-klasser** til at bygge forespørgsler
4. **Hvidliste tilladte værdier** for kolonner og tabelnavne
5. **Cast numeriske værdier** eksplicit med `(int)` eller `(float)`
6. **Udvis aldrig databasefejl** for brugere
7. **Brug transaktioner** til flere relaterede forespørgsler
8. **Test for SQL injektion** under udvikling
9. **Escape LIKE jokertegn** i søgeforespørgsler
10. **Desinficer IN-klausulens værdier** individuelt

---#sikkerhed #sql-injection #database #xoops #forberedte-erklæringer #Kriterier
