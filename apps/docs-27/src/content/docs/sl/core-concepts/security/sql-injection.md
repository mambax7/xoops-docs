---
title: "SQL Preprečevanje vbrizgavanja"
description: "Varnostne prakse baze podatkov in preprečevanje vstavljanja SQL v XOOPS"
---
SQL vbrizgavanje je ena najnevarnejših in pogostih ranljivosti spletnih aplikacij. Ta priročnik pokriva, kako zaščititi svoje module XOOPS pred napadi z vbrizgavanjem SQL.

## Povezana dokumentacija

– Najboljše varnostne prakse – Obsežen varnostni vodnik
- CSRF-Zaščita - Sistem žetonov in varnostni razred XOOPS
- Input-Sanitization - MyTextSanitizer in validacija

## Razumevanje SQL Injection

Do vbrizgavanja SQL pride, ko je uporabniški vnos vključen neposredno v poizvedbe SQL brez ustrezne sanacije ali parametrizacije.

### Primer ranljive kode
```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```
Če uporabnik posreduje `1 OR 1=1` kot ID, postane poizvedba:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```
To vrne vse zapise namesto samo enega.

## Uporaba parametriziranih poizvedb

Najučinkovitejša obramba pred vbrizgavanjem SQL je uporaba parametriziranih poizvedb (pripravljenih stavkov).

### Osnovna parametrizirana poizvedba
```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```
### Več parametrov
```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```
### Imenovani parametri

Nekatere abstrakcije baze podatkov podpirajo imenovane parametre:
```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```
## Uporaba XoopsObject in XoopsObjectHandler

XOOPS zagotavlja objektno usmerjen dostop do baze podatkov, ki pomaga preprečiti vbrizgavanje SQL prek sistema Criteria.

### Uporaba osnovnih meril
```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```
### CriteriaCompo za več pogojev
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
### Operatorji kriterijev
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
### ALI pogoji
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```
## Predpone tabel

Vedno uporabljajte sistem predpon tabel XOOPS:
```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```
## INSERT Poizvedbe

### Uporaba pripravljenih stavkov
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
### Uporaba XoopsObject
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
## UPDATE Poizvedbe

### Uporaba pripravljenih stavkov
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
### Uporaba XoopsObject
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
## DELETE Poizvedbe

### Uporaba pripravljenih stavkov
```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```
### Uporaba XoopsObject
```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```
### Množično brisanje s kriteriji
```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```
## Pobeg po potrebi

Če ne morete uporabiti pripravljenih stavkov, uporabite pravilno ubežanje:
```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```
Vendar **vedno raje dajte pripravljene izjave** kot bežanje.

## Varno ustvarjanje dinamičnih poizvedb

### Varna dinamična imena stolpcev

Imen stolpcev ni mogoče parametrizirati. Preverite glede na beli seznam:
```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```
### Varna dinamična imena tabel

Podobno preverite imena tabel:
```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```
### Dinamično sestavljanje WHERE klavzul
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
## LIKE Poizvedbe

Bodite previdni pri poizvedbah LIKE, da preprečite vstavljanje nadomestnih znakov:
```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```
## Stavki IN

Pri uporabi stavkov IN zagotovite, da so vse vrednosti pravilno vnesene:
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
Ali s kriteriji:
```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```
## Varnost transakcij

Pri izvajanju več povezanih poizvedb:
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
## Obravnava napak

Nikoli ne izpostavljajte napak SQL uporabnikom:
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
## Pogoste napake, ki se jim je treba izogibati

### Napaka 1: Neposredna interpolacija spremenljivke
```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```
### Napaka 2: Uporaba addslashes()
```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```
### Napaka 3: Zaupanje številskim ID-jem
```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```
### Napaka 4: Injekcija drugega reda
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
## Varnostno testiranje

### Preizkusite svoje poizvedbe

Preizkusite svoje obrazce s temi vnosi, da preverite vnos SQL:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Če kar koli od tega povzroči nepričakovano vedenje ali napake, ste ranljivi.

### Samodejno testiranje

Med razvojem uporabite avtomatizirana orodja za testiranje vbrizgavanja SQL:

- SQLMap
- Suita Burp
- OWASP ZAP

## Povzetek najboljših praks

1. **Vedno uporabljaj parametrizirane poizvedbe** (pripravljene izjave)
2. **Uporabite XoopsObject/XoopsObjectHandler**, kadar je to mogoče
3. **Uporabite kriterijske razrede** za gradnjo poizvedb
4. **Dovoljene vrednosti na beli seznam** za imena stolpcev in tabel
5. **Prenesite številske vrednosti** izrecno z `(int)` ali `(float)`
6. **Nikoli ne izpostavljajte napak v bazi podatkov** uporabnikom
7. **Uporabite transakcije** za več povezanih poizvedb
8. **Test za vbrizgavanje SQL** med razvojem
9. **Escape LIKE nadomestnih znakov** v iskalnih poizvedbah
10. **Sanitize IN klavzule vrednosti** posamično

---

#security #sql-injection #database #XOOPS #prepared-statements #Criteria