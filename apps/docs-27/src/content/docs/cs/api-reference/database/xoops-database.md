---
title: "Třída XoopsDatabase"
description: "Vrstva abstrakce databáze poskytující správu připojení, provádění dotazů a zpracování výsledků"
---

Třída `XOOPSDatabase` poskytuje databázovou abstrakční vrstvu pro XOOPS, která zajišťuje správu připojení, provádění dotazů, zpracování výsledků a zpracování chyb. Podporuje více databázových ovladačů prostřednictvím architektury ovladačů.

## Přehled třídy

```php
namespace XOOPS\Database;

abstract class XOOPSDatabase
{
    protected $conn;
    protected $prefix;
    protected $logger;

    abstract public function connect(bool $selectdb = true): bool;
    abstract public function query(string $sql, int $limit = 0, int $start = 0);
    abstract public function fetchArray($result): ?array;
    abstract public function fetchObject($result): ?object;
    abstract public function getRowsNum($result): int;
    abstract public function getAffectedRows(): int;
    abstract public function getInsertId(): int;
    abstract public function escape(string $string): string;
}
```

## Hierarchie tříd

```
XOOPSDatabase (Abstract Base)
├── XOOPSMySQLDatabase (MySQL Extension)
│   └── XOOPSMySQLDatabaseProxy (Security Proxy)
└── XOOPSMySQLiDatabase (MySQLi Extension)
    └── XOOPSMySQLiDatabaseProxy (Security Proxy)

XOOPSDatabaseFactory
└── Creates appropriate driver instances
```

## Získání instance databáze

### Použití továrny

```php
// Recommended: Use the factory
$db = XOOPSDatabaseFactory::getDatabaseConnection();
```

### Pomocí getInstance

```php
// Alternative: Direct singleton access
$db = XOOPSDatabase::getInstance();
```

### Globální proměnná

```php
// Legacy: Use global variable
global $xoopsDB;
```

## Základní metody

### připojit

Naváže připojení k databázi.

```php
abstract public function connect(bool $selectdb = true): bool
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$selectdb` | bool | Zda vybrat databázi |

**Vrátí:** `bool` - True při úspěšném připojení

**Příklad:**
```php
$db = XOOPSDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

### dotaz

Provede dotaz SQL.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$sql` | řetězec | Řetězec dotazu SQL |
| `$limit` | int | Maximální počet vrácených řádků (0 = bez omezení) |
| `$start` | int | Počáteční offset |

**Vrátí:** `resource|bool` – Zdroj výsledku nebo false při selhání

**Příklad:**
```php
$db = XOOPSDatabaseFactory::getDatabaseConnection();

// Simple query
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid > 0";
$result = $db->query($sql);

// Query with limit
$sql = "SELECT * FROM " . $db->prefix('users');
$result = $db->query($sql, 10, 0); // First 10 rows

// Query with offset
$result = $db->query($sql, 10, 20); // 10 rows starting at row 20
```

---

### dotazF

Provede dotaz vynucující operaci (obchází bezpečnostní kontroly).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**Případy použití:**
- operace INSERT, UPDATE, DELETE
- Když potřebujete obejít omezení pouze pro čtení

**Příklad:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

### předpona

Přidá předponu databázové tabulky.

```php
public function prefix(string $table = ''): string
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$table` | řetězec | Název tabulky bez předpony |

**Vrátí:** `string` – Název tabulky s předponou

**Příklad:**
```php
$db = XOOPSDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```

---

### fetchArray

Načte řádek výsledku jako asociativní pole.

```php
abstract public function fetchArray($result): ?array
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$result` | zdroj | Zdroj výsledku dotazu |

**Vrátí:** `array|null` – Asociativní pole nebo null, pokud žádné další řádky

**Příklad:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "User: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```

---

### fetchObject

Načte výsledný řádek jako objekt.

```php
abstract public function fetchObject($result): ?object
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$result` | zdroj | Zdroj výsledku dotazu |

**Vrátí:** `object|null` - Objekt s vlastnostmi pro každý sloupec

**Příklad:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Username: " . $user->uname;
    echo "Email: " . $user->email;
}
```

---

### fetchRow

Načte řádek výsledku jako číselné pole.

```php
abstract public function fetchRow($result): ?array
```

**Příklad:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

### načístOba

Načte řádek výsledku jako asociativní i číselné pole.

```php
abstract public function fetchBoth($result): ?array
```

**Příklad:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```

---

### getRowsNum

Získá počet řádků v sadě výsledků.

```php
abstract public function getRowsNum($result): int
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$result` | zdroj | Zdroj výsledku dotazu |

**Vrátí:** `int` - Počet řádků

**Příklad:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

### getAffectedRows

Získá počet ovlivněných řádků z posledního dotazu.

```php
abstract public function getAffectedRows(): int
```

**Vrátí:** `int` – Počet ovlivněných řádků

**Příklad:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

### getInsertId

Získá automaticky vygenerované ID z posledního INSERT.

```php
abstract public function getInsertId(): int
```

**Vrátí:** `int` – ID posledního vložení

**Příklad:**
```php
$sql = sprintf(
    "INSERT INTO %s (title, content) VALUES (%s, %s)",
    $db->prefix('articles'),
    $db->quoteString($title),
    $db->quoteString($content)
);
$db->queryF($sql);
$newId = $db->getInsertId();
echo "Created article with ID: $newId";
```

---

### uniknout

Escape řetězec pro bezpečné použití v dotazech SQL.

```php
abstract public function escape(string $string): string
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$string` | řetězec | Řetězec k útěku |

**Vrátí:** `string` – Uniklý řetězec (bez uvozovek)

**Příklad:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

Escapes a cituje řetězec pro SQL.

```php
public function quoteString(string $string): string
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$string` | řetězec | Řetězec pro citaci |

**Vrátí:** `string` – řetězec s kódováním a uvozovkami

**Příklad:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### freeRecordSet

Uvolňuje paměť spojenou s výsledkem.

```php
abstract public function freeRecordSet($result): void
```

**Příklad:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```

---

## Zpracování chyb

### chyba

Získá poslední chybovou zprávu.

```php
abstract public function error(): string
```

**Příklad:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

### chyba

Získá poslední číslo chyby.

```php
abstract public function errno(): int
```

**Příklad:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## Připravené výpisy (MySQLi)

Ovladač MySQLi podporuje připravené příkazy pro vyšší zabezpečení.

### připravitVytvoří připravený výpis.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**Příklad:**
```php
$db = XOOPSDatabaseFactory::getDatabaseConnection();

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = ?";
$stmt = $db->prepare($sql);

$stmt->bind_param('i', $userId);
$userId = 5;
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    echo $row['uname'];
}
$stmt->close();
```

### Připravený výpis s více parametry

```php
$sql = "INSERT INTO " . $db->prefix('articles') . " (title, content, author_id) VALUES (?, ?, ?)";
$stmt = $db->prepare($sql);

$stmt->bind_param('ssi', $title, $content, $authorId);

$title = "My Article";
$content = "Article content here";
$authorId = 1;

if ($stmt->execute()) {
    echo "Article created with ID: " . $stmt->insert_id;
}

$stmt->close();
```

---

## Podpora transakcí

### zahájit transakci

Zahájí transakci.

```php
public function beginTransaction(): bool
```

### se zavázat

Potvrdí aktuální transakci.

```php
public function commit(): bool
```

### vrácení zpět

Vrátí aktuální transakci zpět.

```php
public function rollback(): bool
```

**Příklad:**
```php
$db = XOOPSDatabaseFactory::getDatabaseConnection();

try {
    $db->beginTransaction();

    // Multiple operations
    $sql1 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance - 100 WHERE id = 1";
    $db->queryF($sql1);

    $sql2 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance + 100 WHERE id = 2";
    $db->queryF($sql2);

    // Check for errors
    if ($db->errno()) {
        throw new Exception($db->error());
    }

    $db->commit();
    echo "Transaction completed";

} catch (Exception $e) {
    $db->rollback();
    echo "Transaction failed: " . $e->getMessage();
}
```

---

## Kompletní příklady použití

### Základní operace CRUD

```php
$db = XOOPSDatabaseFactory::getDatabaseConnection();

// CREATE
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('articles'),
    $db->quoteString('New Article'),
    $db->quoteString('Article content'),
    time()
);
$db->queryF($sql);
$articleId = $db->getInsertId();

// READ
$sql = "SELECT * FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$result = $db->query($sql);
$article = $db->fetchArray($result);

// UPDATE
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('articles'),
    $db->quoteString('Updated Title'),
    time(),
    $articleId
);
$db->queryF($sql);

// DELETE
$sql = "DELETE FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$db->queryF($sql);
```

### Dotaz na stránkování

```php
function getArticles(int $page = 1, int $perPage = 10): array
{
    $db = XOOPSDatabaseFactory::getDatabaseConnection();
    $start = ($page - 1) * $perPage;

    // Get total count
    $sql = "SELECT COUNT(*) as total FROM " . $db->prefix('articles') . " WHERE published = 1";
    $result = $db->query($sql);
    $row = $db->fetchArray($result);
    $total = $row['total'];

    // Get page of results
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE published = 1 ORDER BY created DESC";
    $result = $db->query($sql, $perPage, $start);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return [
        'articles' => $articles,
        'total' => $total,
        'pages' => ceil($total / $perPage),
        'current' => $page
    ];
}
```

### Vyhledávací dotaz pomocí LIKE

```php
function searchArticles(string $keyword): array
{
    $db = XOOPSDatabaseFactory::getDatabaseConnection();

    $keyword = $db->escape($keyword);
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE title LIKE '%" . $keyword . "%'" .
           " OR content LIKE '%" . $keyword . "%'" .
           " ORDER BY created DESC";

    $result = $db->query($sql, 50);  // Limit to 50 results

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

### Připojte se k dotazu

```php
function getArticlesWithAuthors(): array
{
    $db = XOOPSDatabaseFactory::getDatabaseConnection();

    $sql = "SELECT a.*, u.uname as author_name, u.email as author_email
            FROM " . $db->prefix('articles') . " a
            LEFT JOIN " . $db->prefix('users') . " u ON a.author_id = u.uid
            WHERE a.published = 1
            ORDER BY a.created DESC";

    $result = $db->query($sql, 20);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

---

## Třída SQLUtility

Pomocná třída pro operace se soubory SQL.

### splitMySQLFile

Rozdělí soubor SQL na jednotlivé dotazy.

```php
public static function splitMySQLFile(string $content): array
```

**Příklad:**
```php
$sqlContent = file_get_contents('install.sql');
$queries = SQLUtility::splitMySQLFile($sqlContent);

foreach ($queries as $query) {
    $db->queryF($query);
    if ($db->errno()) {
        echo "Error executing: " . $query . "\n";
        echo "Error: " . $db->error() . "\n";
    }
}
```

### prefixQuery

Nahradí zástupné symboly tabulek názvy tabulek s předponou.

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**Příklad:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSQL = SQLUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## Nejlepší postupy

### Zabezpečení

1. **Vždy opustit uživatelský vstup**:
```php
$safe = $db->escape($_POST['input']);
```

2. **Použijte připravená prohlášení, jsou-li k dispozici**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **Pro hodnoty použijte quoteString**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### Výkon

1. **Vždy používejte LIMIT pro velké stoly**:
```php
$result = $db->query($sql, 100);  // Limit results
```

2. **Bezplatné sady výsledků po dokončení**:
```php
$db->freeRecordSet($result);
```

3. **Použijte vhodné indexy** v definicích tabulek

4. **Pokud je to možné, upřednostňujte ovladače před nezpracovanými SQL**

### Zpracování chyb

1. **Vždy zkontrolujte chyby**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **Použijte transakce pro více souvisejících operací**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```

## Související dokumentace

- Kritéria - Systém kritérií dotazu
- QueryBuilder - Plynulé vytváření dotazů
- ../Core/XOOPSObjectHandler - Trvalost objektu

---

*Viz také: [XOOPS Zdrojový kód](https://github.com/XOOPS/XOOPSCore27/tree/master/htdocs/class/database)*