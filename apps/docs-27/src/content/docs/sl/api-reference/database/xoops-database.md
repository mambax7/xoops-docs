---
title: "Razred XoopsDatabase"
description: "Abstraktna plast baze podatkov, ki zagotavlja upravljanje povezav, izvajanje poizvedb in obdelavo rezultatov"
---
Razred `XoopsDatabase` zagotavlja plast abstrakcije baze podatkov za XOOPS, ki obravnava upravljanje povezav, izvajanje poizvedb, obdelavo rezultatov in obravnavanje napak. Podpira več gonilnikov baze podatkov prek arhitekture gonilnika.

## Pregled razreda
```php
namespace Xoops\Database;

abstract class XoopsDatabase
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
## Hierarhija razreda
```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```
## Pridobivanje primerka baze podatkov

### Uporaba tovarne
```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```
### Uporaba getInstance
```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```
### Globalna spremenljivka
```php
// Legacy: Use global variable
global $xoopsDB;
```
## Temeljne metode

### poveži se

Vzpostavi povezavo z bazo podatkov.
```php
abstract public function connect(bool $selectdb = true): bool
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$selectdb` | bool | Ali izbrati zbirko podatkov |

**Vrne:** `bool` - True ob uspešni povezavi

**Primer:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```
---

### poizvedba

Izvede poizvedbo SQL.
```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$sql` | niz | SQL poizvedbeni niz |
| `$limit` | int | Največje število vrnjenih vrstic (0 = ni omejitve) |
| `$start` | int | Začetni odmik |

**Vrne:** `resource|bool` - Vir rezultata ali false v primeru napake

**Primer:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

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

### poizvedbaF

Izvede poizvedbo, ki prisili operacijo (zaobide varnostna preverjanja).
```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```
**Primeri uporabe:**
- INSERT, UPDATE, DELETE poslovanje
- Ko morate zaobiti omejitve samo za branje

**Primer:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```
---

### predpona

Doda predpono tabele zbirke podatkov.
```php
public function prefix(string $table = ''): string
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$table` | niz | Ime tabele brez predpone |

**Vrne:** `string` - Ime tabele s predpono

**Primer:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```
---

### fetchArray

Pridobi vrstico z rezultati kot asociativno polje.
```php
abstract public function fetchArray($result): ?array
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$result` | vir | Vir rezultatov poizvedbe |

**Vrne:** `array|null` - Asociativno polje ali nič, če ni več vrstic

**Primer:**
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

Pridobi vrstico z rezultati kot predmet.
```php
abstract public function fetchObject($result): ?object
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$result` | vir | Vir rezultatov poizvedbe |

**Vrne:** `object|null` - Objekt z lastnostmi za vsak stolpec

**Primer:**
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

Pridobi vrstico z rezultati kot številsko polje.
```php
abstract public function fetchRow($result): ?array
```
**Primer:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```
---

### prinesi oba

Pridobi vrstico z rezultati kot asociativno in številsko matriko.
```php
abstract public function fetchBoth($result): ?array
```
**Primer:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```
---

### getRowsNum

Pridobi število vrstic v naboru rezultatov.
```php
abstract public function getRowsNum($result): int
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$result` | vir | Vir rezultatov poizvedbe |

**Vrne:** `int` - Število vrstic

**Primer:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```
---

### getAffectedRows

Pridobi število prizadetih vrstic iz zadnje poizvedbe.
```php
abstract public function getAffectedRows(): int
```
**Vrnitve:** `int` - Število prizadetih vrstic

**Primer:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```
---

### getInsertId

Pridobi samodejno ustvarjen ID iz zadnjih INSERT.
```php
abstract public function getInsertId(): int
```
**Vrnitve:** `int` - ID zadnjega vstavka

**Primer:**
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

### pobegniti

Izogne nizu za varno uporabo v SQL poizvedbah.
```php
abstract public function escape(string $string): string
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$string` | niz | Niz za umik |

**Vrne:** `string` - Ubežni niz (brez narekovajev)

**Primer:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```
---

### quoteString

Ubeži in navede niz za SQL.
```php
public function quoteString(string $string): string
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$string` | niz | Niz za navajanje |

**Vrne:** `string` - Ubežni in narekovani niz

**Primer:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```
---

### freeRecordSet

Sprosti pomnilnik, povezan z rezultatom.
```php
abstract public function freeRecordSet($result): void
```
**Primer:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```
---

## Obravnava napak

### napaka

Pridobi zadnje sporočilo o napaki.
```php
abstract public function error(): string
```
**Primer:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```
---

### napaka

Pridobi zadnjo številko napake.
```php
abstract public function errno(): int
```
**Primer:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```
---

## Pripravljeni stavki (MySQLi)

Gonilnik MySQLi podpira pripravljene izjave za večjo varnost.

### pripravi

Ustvari pripravljeno izjavo.
```php
public function prepare(string $sql): mysqli_stmt|false
```
**Primer:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

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
### Pripravljena izjava z več parametri
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

## Transakcijska podpora

### začni transakcijo

Začne transakcijo.
```php
public function beginTransaction(): bool
```
### zaveži

Zaveže trenutno transakcijo.
```php
public function commit(): bool
```
### povrnitev nazaj

Prevrne trenutno transakcijo.
```php
public function rollback(): bool
```
**Primer:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

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

## Popolni primeri uporabe

### Osnovne CRUD operacije
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

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
### Poizvedba za paginacijo
```php
function getArticles(int $page = 1, int $perPage = 10): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();
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
### Iskalna poizvedba z LIKE
```php
function searchArticles(string $keyword): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

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
### Pridružite se poizvedbi
```php
function getArticlesWithAuthors(): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

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

## Razred SqlUtility

Pomožni razred za SQL operacij datotek.

### splitMySqlFile

Razdeli datoteko SQL na posamezne poizvedbe.
```php
public static function splitMySqlFile(string $content): array
```
**Primer:**
```php
$sqlContent = file_get_contents('install.sql');
$queries = SqlUtility::splitMySqlFile($sqlContent);

foreach ($queries as $query) {
    $db->queryF($query);
    if ($db->errno()) {
        echo "Error executing: " . $query . "\n";
        echo "Error: " . $db->error() . "\n";
    }
}
```
### prefixQuery

Zamenja ogradne oznake tabel s predponastimi imeni tabel.
```php
public static function prefixQuery(string $sql, string $prefix): string
```
**Primer:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```
---

## Najboljše prakse

### Varnost

1. **Vedno izogni uporabniškemu vnosu**:
```php
$safe = $db->escape($_POST['input']);
```
2. **Uporabite pripravljene izjave, ko so na voljo**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```
3. **Za vrednosti uporabite quoteString**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```
### Zmogljivost

1. **Vedno uporabite LIMIT za velike tabele**:
```php
$result = $db->query($sql, 100);  // Limit results
```
2. **Brezplačni nizi rezultatov, ko je končano**:
```php
$db->freeRecordSet($result);
```
3. **Uporabite ustrezne indekse** v definicijah tabel

4. **Daj prednost obdelovalcem kot neobdelanim SQL**, kadar je to mogoče

### Obravnava napak

1. **Vedno preverite napake**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```
2. **Uporabite transakcije za več povezanih operacij**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```
## Povezana dokumentacija

- Kriteriji - Sistem kriterijev poizvedb
- QueryBuilder - Tekoče ustvarjanje poizvedb
- ../Core/XoopsObjectHandler - Obstojnost objekta

---

*Glejte tudi: [XOOPS Izvorna koda](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*