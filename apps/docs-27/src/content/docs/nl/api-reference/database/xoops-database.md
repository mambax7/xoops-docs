---
title: "XoopsDatabase-klasse"
description: "Database-abstractielaag die verbindingsbeheer, query-uitvoering en resultaatverwerking biedt"
---
De klasse `XoopsDatabase` biedt een database-abstractielaag voor XOOPS, die het verbindingsbeheer, de uitvoering van query's, de resultaatverwerking en de foutafhandeling afhandelt. Het ondersteunt meerdere databasestuurprogramma's via een stuurprogrammaarchitectuur.

## Klassenoverzicht

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

## Klassenhiërarchie

```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```

## Een database-instantie verkrijgen

### De fabriek gebruiken

```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### GetInstance gebruiken

```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```

### Globale variabele

```php
// Legacy: Use global variable
global $xoopsDB;
```

## Kernmethoden

### verbinden

Brengt een databaseverbinding tot stand.

```php
abstract public function connect(bool $selectdb = true): bool
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$selectdb` | bool | Of de database |

**Retourzendingen:** `bool` - Waar bij succesvolle verbinding

**Voorbeeld:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

### vraag

Voert een SQL-query uit.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$sql` | tekenreeks | SQL-querytekenreeks |
| `$limit` | int | Maximaal aantal rijen dat moet worden geretourneerd (0 = geen limiet) |
| `$start` | int | Beginoffset |

**Retourneert:** `resource|bool` - Resultaatbron of onwaar bij fout

**Voorbeeld:**
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

### vraagF

Voert een query uit waardoor de bewerking wordt geforceerd (omzeilt beveiligingscontroles).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**Gebruiksscenario's:**
- INSERT, UPDATE, DELETE-bewerkingen
- Wanneer u alleen-lezenbeperkingen moet omzeilen

**Voorbeeld:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

### voorvoegsel

Staat vóór het voorvoegsel van de databasetabel.

```php
public function prefix(string $table = ''): string
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$table` | tekenreeks | Tabelnaam zonder voorvoegsel |

**Retourneert:** `string` - Tabelnaam met voorvoegsel

**Voorbeeld:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```

---

### fetchArray

Haalt een resultaatrij op als een associatieve array.

```php
abstract public function fetchArray($result): ?array
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$result` | bron | Bron van queryresultaten |

**Retourneert:** `array|null` - Associatieve array of null als er geen rijen meer zijn

**Voorbeeld:**
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

Haalt een resultaatrij op als een object.

```php
abstract public function fetchObject($result): ?object
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$result` | bron | Bron van queryresultaten |

**Retourneert:** `object|null` - Object met eigenschappen voor elke kolom

**Voorbeeld:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Username: " . $user->uname;
    echo "Email: " . $user->email;
}
```

---

### haal rij op

Haalt een resultaatrij op als een numerieke array.

```php
abstract public function fetchRow($result): ?array
```

**Voorbeeld:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

### beide ophalen

Haalt een resultaatrij op als zowel associatieve als numerieke array.

```php
abstract public function fetchBoth($result): ?array
```

**Voorbeeld:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```

---

### getRowsNum

Haalt het aantal rijen in een resultatenset op.

```php
abstract public function getRowsNum($result): int
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$result` | bron | Bron van queryresultaten |

**Retouren:** `int` - Aantal rijen

**Voorbeeld:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

### getAffectedRows

Haalt het aantal betrokken rijen uit de laatste query op.

```php
abstract public function getAffectedRows(): int
```

**Retouren:** `int` - Aantal betrokken rijen

**Voorbeeld:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

### getInsertId

Haalt de automatisch gegenereerde ID op van de laatste INSERT.

```php
abstract public function getInsertId(): int
```

**Retourzendingen:** `int` - Laatste invoeg-ID

**Voorbeeld:**
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

### ontsnappen

Escapen van een tekenreeks voor veilig gebruik in SQL-query's.

```php
abstract public function escape(string $string): string
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$string` | tekenreeks | Tekenreeks om te ontsnappen |

**Retourneert:** `string` - Escaped-tekenreeks (zonder aanhalingstekens)

**Voorbeeld:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

Escapet en citeert een tekenreeks voor SQL.

```php
public function quoteString(string $string): string
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$string` | tekenreeks | Tekenreeks om te citeren |

**Retourneert:** `string` - Tekenreeks met escapetekens en aanhalingstekens

**Voorbeeld:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### gratisRecordSet

Maakt geheugen vrij dat aan een resultaat is gekoppeld.

```php
abstract public function freeRecordSet($result): void
```

**Voorbeeld:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```

---

## Foutafhandeling

### fout

Krijgt de laatste foutmelding.
```php
abstract public function error(): string
```

**Voorbeeld:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

### fout

Krijgt het laatste foutnummer.

```php
abstract public function errno(): int
```

**Voorbeeld:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## Opgestelde verklaringen (MySQLi)

Het MySQLi-stuurprogramma ondersteunt voorbereide instructies voor verbeterde beveiliging.

### voorbereiden

Creëert een voorbereide verklaring.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**Voorbeeld:**
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

### Opgestelde verklaring met meerdere parameters

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

## Transactieondersteuning

### beginTransactie

Start een transactie.

```php
public function beginTransaction(): bool
```

### vastlegging

Voert de huidige transactie uit.

```php
public function commit(): bool
```

### terugdraaien

Draait de huidige transactie terug.

```php
public function rollback(): bool
```

**Voorbeeld:**
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

## Volledige gebruiksvoorbeelden

### Basis CRUD-bewerkingen

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

### Pagineringquery

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

### Zoekopdracht met LIKE

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

### Sluit je aan bij de zoekopdracht

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

## SqlUtility-klasse

Helperklasse voor SQL-bestandsbewerkingen.

### splitMySqlFile

Splitst een SQL-bestand op in afzonderlijke query's.

```php
public static function splitMySqlFile(string $content): array
```

**Voorbeeld:**
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

Vervangt tijdelijke aanduidingen voor tabellen door vooraf ingestelde tabelnamen.

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**Voorbeeld:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## Beste praktijken

### Beveiliging

1. **Gebruikersinvoer altijd ontwijken**:
```php
$safe = $db->escape($_POST['input']);
```

2. **Gebruik voorbereide verklaringen indien beschikbaar**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **Gebruik quoteString voor waarden**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### Prestaties

1. **Gebruik altijd LIMIT voor grote tafels**:
```php
$result = $db->query($sql, 100);  // Limit results
```

2. **Gratis resultatensets als je klaar bent**:
```php
$db->freeRecordSet($result);
```

3. **Gebruik de juiste indexen** in uw tabeldefinities

4. **Geef indien mogelijk de voorkeur aan handlers boven onbewerkte SQL**

### Foutafhandeling

1. **Controleer altijd op fouten**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **Gebruik transacties voor meerdere gerelateerde bewerkingen**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```

## Gerelateerde documentatie

- Criteria - Zoekcriteriasysteem
- QueryBuilder - Vloeiend query's bouwen
- ../Core/XoopsObjectHandler - Objectpersistentie

---

*Zie ook: [XOOPS-broncode](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*