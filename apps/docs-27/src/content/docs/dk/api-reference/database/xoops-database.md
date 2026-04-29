---
title: "XoopsDatabase klasse"
description: "Databaseabstraktionslag giver forbindelsesstyring, udførelse af forespørgsler og resultathåndtering"
---

Klassen `XoopsDatabase` giver et databaseabstraktionslag til XOOPS, håndtering af forbindelsesstyring, udførelse af forespørgsler, resultatbehandling og fejlhåndtering. Det understøtter flere databasedrivere gennem en driverarkitektur.

## Klasseoversigt

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

## Klassehierarki

```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```

## Hentning af en databaseinstans

### Brug af fabrikken

```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### Brug af getInstance

```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```

### Global variabel

```php
// Legacy: Use global variable
global $xoopsDB;
```

## Kernemetoder

### tilslut

Etablerer en databaseforbindelse.

```php
abstract public function connect(bool $selectdb = true): bool
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$selectdb` | bool | Om databasen skal vælges |

**Returneringer:** `bool` - Sand ved vellykket forbindelse

**Eksempel:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

### forespørgsel

Udfører en SQL-forespørgsel.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$sql` | streng | SQL forespørgselsstreng |
| `$limit` | int | Maksimalt antal rækker at returnere (0 = ingen grænse) |
| `$start` | int | Start offset |

**Returneringer:** `resource|bool` - Resultatressource eller falsk ved fejl

**Eksempel:**
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

### forespørgselF

Udfører en forespørgsel, der tvinger handlingen (omgår sikkerhedstjek).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**Brugstilfælde:**
- INSERT, UPDATE, DELETE operationer
- Når du skal omgå skrivebeskyttede begrænsninger

**Eksempel:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

### præfiks

Indsætter databasetabelpræfikset.

```php
public function prefix(string $table = ''): string
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$table` | streng | Tabelnavn uden præfiks |

**Returneringer:** `string` - Tabelnavn med præfiks

**Eksempel:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```

---

### henteArray

Henter en resultatrække som en associativ matrix.

```php
abstract public function fetchArray($result): ?array
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$result` | ressource | Forespørgselsresultatressource |

**Returneringer:** `array|null` - Associativ array eller null, hvis der ikke er flere rækker

**Eksempel:**
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

Henter en resultatrække som et objekt.

```php
abstract public function fetchObject($result): ?object
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$result` | ressource | Forespørgselsresultatressource |

**Returneringer:** `object|null` - Objekt med egenskaber for hver kolonne

**Eksempel:**
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

Henter en resultatrække som en numerisk matrix.

```php
abstract public function fetchRow($result): ?array
```

**Eksempel:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

### hente begge

Henter en resultatrække som både associativ og numerisk matrix.

```php
abstract public function fetchBoth($result): ?array
```

**Eksempel:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```

---

### get RowsNum

Henter antallet af rækker i et resultatsæt.

```php
abstract public function getRowsNum($result): int
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$result` | ressource | Forespørgselsresultatressource |

**Returneringer:** `int` - Antal rækker

**Eksempel:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

### getAffectedRows

Henter antallet af berørte rækker fra sidste forespørgsel.

```php
abstract public function getAffectedRows(): int
```

**Returneringer:** `int` - Antal berørte rækker

**Eksempel:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

### getInsertId

Henter det automatisk genererede ID fra den sidste INSERT.

```php
abstract public function getInsertId(): int
```

**Returneringer:** `int` - Sidste indsættelses-id

**Eksempel:**
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

### undslippe

Undgår en streng til sikker brug i SQL-forespørgsler.

```php
abstract public function escape(string $string): string
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$string` | streng | String for at undslippe |

**Returneringer:** `string` - Escaped streng (uden anførselstegn)

**Eksempel:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### citatString

Undslipper og citerer en streng for SQL.

```php
public function quoteString(string $string): string
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$string` | streng | Streng at citere |

**Returneringer:** `string` - Escaped og citeret streng

**Eksempel:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### freeRecordSet

Frigør hukommelse forbundet med et resultat.

```php
abstract public function freeRecordSet($result): void
```

**Eksempel:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```

---

## Fejlhåndtering

### fejl

Får den sidste fejlmeddelelse.
```php
abstract public function error(): string
```

**Eksempel:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

### fejl

Får det sidste fejlnummer.

```php
abstract public function errno(): int
```

**Eksempel:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## Forberedte erklæringer (MySQLi)

MySQLi-driveren understøtter forberedte sætninger for øget sikkerhed.

### forberede sig

Opretter en forberedt erklæring.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**Eksempel:**
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

### Forberedt erklæring med flere parametre

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

## Transaktionssupport

### startTransaction

Starter en transaktion.

```php
public function beginTransaction(): bool
```

### forpligte sig

Forpligter den aktuelle transaktion.

```php
public function commit(): bool
```

### tilbagerulning

Ruller den aktuelle transaktion tilbage.

```php
public function rollback(): bool
```

**Eksempel:**
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

## Komplet brugseksempler

### Grundlæggende CRUD-handlinger

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

### Sideinddelingsforespørgsel

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

### Søgeforespørgsel med LIKE

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

### Deltag i forespørgsel

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

## SqlUtility klasse

Hjælperklasse til SQL-filoperationer.

### splitMySqlFile

Opdeler en SQL-fil i individuelle forespørgsler.

```php
public static function splitMySqlFile(string $content): array
```

**Eksempel:**
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

### præfiksForespørgsel

Erstatter tabelpladsholdere med tabelnavne foran.

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**Eksempel:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## Bedste praksis

### Sikkerhed

1. **Undgå altid brugerinput**:
```php
$safe = $db->escape($_POST['input']);
```

2. **Brug forberedte udsagn, når de er tilgængelige**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **Brug quoteString for værdier**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### Ydeevne

1. **Brug altid LIMIT til store borde**:
```php
$result = $db->query($sql, 100);  // Limit results
```

2. **Gratis resultatsæt når færdig**:
```php
$db->freeRecordSet($result);
```

3. **Brug passende indekser** i dine tabeldefinitioner

4. **Foretrækker handlere frem for rå SQL**, når det er muligt

### Fejlhåndtering

1. **Kontroller altid for fejl**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **Brug transaktioner til flere relaterede operationer**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```

## Relateret dokumentation

- Kriterier - Forespørgselskriteriesystem
- QueryBuilder - Flydende forespørgselsbygning
- ../Core/XoopsObjectHandler - Objektvedholdenhed

---

*Se også: [XOOPS kildekode](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*
