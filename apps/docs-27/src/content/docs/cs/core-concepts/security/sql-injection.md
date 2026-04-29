---
title: "SQL Prevence vstřikování"
description: "Postupy zabezpečení databáze a zabránění vložení SQL do XOOPS"
---

Injekce SQL je jednou z nejnebezpečnějších a nejběžnějších zranitelností webových aplikací. Tato příručka popisuje, jak chránit vaše moduly XOOPS před útoky injekcí SQL.

## Související dokumentace

- Bezpečnostní-Best-Practices - Komplexní bezpečnostní průvodce
- CSRF-Protection - Systém tokenů a třída XOOPSSecurity
- Input-Sanitization - MyTextSanitizer a validace

## Pochopení SQL Injection

Injekce SQL nastává, když je uživatelský vstup zahrnut přímo do dotazů SQL bez řádné dezinfekce nebo parametrizace.

### Příklad zranitelného kódu

```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

Pokud uživatel předá `1 OR 1=1` jako ID, dotaz bude: 
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

Tím se vrátí všechny záznamy namísto pouze jednoho.

## Použití parametrizovaných dotazů

Nejúčinnější obranou proti injekci SQL je použití parametrizovaných dotazů (připravených příkazů).

### Základní parametrizovaný dotaz

```php
// Get database connection
$xoopsDB = XOOPSDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### Více parametrů

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### Pojmenované parametry

Některé databázové abstrakce podporují pojmenované parametry:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## Použití XOOPSObject a XOOPSObjectHandler

XOOPS poskytuje objektově orientovaný přístup k databázi, který pomáhá zabránit vkládání SQL prostřednictvím systému Criteria.

### Použití základních kritérií

```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```

### CriteriaCompo pro více podmínek

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

### Operátoři kritérií

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

### NEBO Podmínky

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## Předpony tabulky

Vždy používejte systém předpon tabulky XOOPS:

```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## Dotazy INSERT

### Použití připravených výpisů

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

### Použití XOOPSObject

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

## Dotazy UPDATE

### Použití připravených výpisů

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

### Použití XOOPSObject

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

## Dotazy DELETE

### Použití připravených výpisů

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Použití XOOPSObject

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### Hromadné mazání s kritérii

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## Útěk, když je to nutné

Pokud nemůžete použít připravené příkazy, použijte správné escapování:

```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

Před escapováním však **vždy preferujte připravené výpisy**.

## Bezpečné vytváření dynamických dotazů

### Názvy bezpečných dynamických sloupců

Názvy sloupců nelze parametrizovat. Ověření proti bílé listině:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### Bezpečné názvy dynamických tabulek

Podobně ověřte názvy tabulek:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### Dynamické vytváření klauzulí WHERE

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

## Dotazy LIKE

Buďte opatrní s dotazy LIKE, abyste se vyhnuli vložení zástupných znaků:

```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## Klauzule IN

Při použití klauzulí IN se ujistěte, že jsou všechny hodnoty správně napsány:

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

Nebo s kritérii:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## Bezpečnost transakcí

Při provádění více souvisejících dotazů:

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

## Zpracování chyb

Nikdy uživatelům nevystavujte chyby SQL:

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

## Běžné chyby, kterým je třeba se vyhnout

### Chyba 1: Přímá proměnná interpolace

```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Chyba 2: Použití lomítek ()

```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### Chyba 3: Důvěřování číselným ID

```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### Chyba 4: Injekce druhého řádu

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

## Testování zabezpečení

### Otestujte své dotazy

Otestujte své formuláře pomocí těchto vstupů, abyste zkontrolovali vstřikování SQL:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Pokud některá z těchto příčin způsobí neočekávané chování nebo chyby, jedná se o chybu zabezpečení.

### Automatické testování

Během vývoje používejte automatizované nástroje pro testování vstřikování SQL:

- SQLMap
- Burp Suite
- OWASP ZAP

## Shrnutí osvědčených postupů

1. **Vždy používejte parametrizované dotazy** (připravené příkazy)
2. **Pokud je to možné, použijte XOOPSObject/XOOPSObjectHandler**
3. **Použijte třídy Criteria** pro vytváření dotazů
4. **Povolené hodnoty na seznamu povolených hodnot** pro názvy sloupců a tabulek
5. **Přenášejte číselné hodnoty** explicitně pomocí `(int)` nebo `(float)`
6. **Nikdy nevystavujte uživatelům chyby databáze**
7. **Použijte transakce** pro více souvisejících dotazů
8. **Test pro vstřikování SQL** během vývoje
9. **Escape LIKE zástupné znaky** ve vyhledávacích dotazech
10. **Dezinfikujte hodnoty klauzule IN** jednotlivě

---

#security #sql-injection #database #xoops #prepared-statements #Criteria