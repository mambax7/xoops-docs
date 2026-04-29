---
title: "SQL Prevencija ubrizgavanja"
description: "Prakse sigurnosti baze podataka i sprječavanje ubacivanja SQL u XOOPS"
---
SQL injection jedna je od najopasnijih i najčešćih ranjivosti web aplikacija. Ovaj vodič pokriva kako zaštititi svoj XOOPS modules od napada ubrizgavanjem SQL.

## Povezana dokumentacija

- Najbolje sigurnosne prakse - Opsežan sigurnosni vodič
- CSRF-Protection - Token sustav i XoopsSecurity class
- Sanitizacija unosa - MyTextSanitizer i provjera valjanosti

## Razumijevanje SQL ubrizgavanja

Ubacivanje SQL događa se kada je korisnički unos included izravno u SQL upitima bez odgovarajuće sanacije ili parametrizacije.

### Primjer ranjivog koda

```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

Ako korisnik proslijedi `1 OR 1=1` kao ID, upit postaje:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

Ovo vraća sve zapise umjesto samo jednog.

## Korištenje parametriziranih upita

Najučinkovitija obrana od ubacivanja SQL je korištenje parametriziranih upita (pripremljenih izjava).

### Osnovni parametrizirani upit

```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### Više parametara

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### Imenovani parametri

Neke apstrakcije baze podataka podržavaju imenovane parametre:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## Korištenje XoopsObject i XoopsObjectHandler

XOOPS pruža objektno orijentirani pristup bazi podataka koji pomaže spriječiti ubacivanje SQL kroz Criteria sustav.

### Korištenje osnovnih kriterija

```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```

### CriteriaCompo za više uvjeta

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

### Operatori kriterija

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

### ILI uvjeti

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## Prefiksi tablice

Uvijek koristite XOOPS sustav prefiksa tablice:

```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## INSERT Upiti

### Korištenje pripremljenih izjava

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

### Korištenje XoopsObject

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

## AŽURIRAJ Upiti

### Korištenje pripremljenih izjava

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

### Korištenje XoopsObject

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

## IZBRIŠI upite

### Korištenje pripremljenih izjava

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Korištenje XoopsObject

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### Skupno brisanje s kriterijima

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## Bijeg kad je potrebno

Ako ne možete koristiti pripremljene izjave, upotrijebite ispravno izbjegavanje:

```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

Međutim, **uvijek dajte prednost pripremljenim izjavama** nego bijegu.

## Sigurno stvaranje dinamičkih upita

### Sigurni dinamički nazivi stupaca

Nazivi stupaca ne mogu se parametrizirati. Provjeri valjanost na popisu dopuštenih:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### Sigurna dinamička imena tablica

Slično, potvrdite nazive tablica:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### Dinamička izgradnja WHERE klauzula

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

## LIKE Upiti

Budite oprezni s LIKE upitima kako biste izbjegli ubacivanje zamjenskih znakova:

```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## IN klauzule

Kada koristite klauzule IN, provjerite jesu li sve vrijednosti ispravno upisane:

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

Ili s kriterijima:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## Sigurnost transakcije

Prilikom izvođenja više povezanih upita:

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

## Rješavanje grešaka

Nikada ne izlažite SQL pogreške korisnicima:

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

## Uobičajene pogreške koje treba izbjegavati

### Pogreška 1: izravna interpolacija varijable

```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Pogreška 2: Upotreba addslashes()

```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### Pogreška 3: Vjerovati numeričkim ID-ovima

```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### Pogreška 4: Injekcija drugog reda

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

## Sigurnosno testiranje

### Testirajte svoje upite

Testirajte svoje obrasce pomoću ovih unosa da biste provjerili ubrizgavanje SQL:- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Ako bilo što od toga uzrokuje neočekivano ponašanje ili pogreške, imate ranjivost.

### Automatizirano testiranje

Koristite automatizirane SQL alate za testiranje ubrizgavanja tijekom razvoja:

- SQLMap
- Podrigivanje
- OWASP ZAP

## Sažetak najboljih praksi

1. **Uvijek koristite parametrizirane upite** (pripremljene izjave)
2. **Koristite XoopsObject/XoopsObjectHandler** kada je to moguće
3. **Koristite kriterije classes** za izradu upita
4. **Bijeli popis dopuštenih vrijednosti** za nazive stupaca i tablica
5. **Prikaži numeričke vrijednosti** eksplicitno sa `(int)` ili `(float)`
6. **Nikada ne otkrivajte korisnicima pogreške u bazi podataka**
7. **Koristite transakcije** za više povezanih upita
8. **Test za ubrizgavanje SQL** tijekom razvoja
9. **Izbjegnite LIKE zamjenske znakove** u upitima za pretraživanje
10. **Sanitize IN klauzule vrijednosti** pojedinačno

---

#sigurnost #sql-injection #baza podataka #xoops #prepared-statements #Criteria
