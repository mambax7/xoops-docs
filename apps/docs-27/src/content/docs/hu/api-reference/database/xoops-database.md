---
title: "XOOPSDatabase Class"
description: "Adatbázis-absztrakciós réteg biztosítja a kapcsolatkezelést, a lekérdezések végrehajtását és az eredménykezelést"
---
A `XOOPSDatabase` osztály adatbázis-absztrakciós réteget biztosít a XOOPS számára, amely kezeli a kapcsolatkezelést, a lekérdezések végrehajtását, az eredményfeldolgozást és a hibakezelést. Több adatbázis-illesztőprogramot támogat egy illesztőprogram-architektúrán keresztül.

## Osztály áttekintése

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

## Osztályhierarchia

```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```

## Adatbázispéldány beszerzése

### A gyár használata

```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### A getInstance használata

```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```

### Globális változó

```php
// Legacy: Use global variable
global $xoopsDB;
```

## Alapvető módszerek

### csatlakozni

Létrehoz egy adatbázis-kapcsolatot.

```php
abstract public function connect(bool $selectdb = true): bool
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$selectdb` | bool | Az adatbázis kiválasztása |

**Visszaküldés:** `bool` - Sikeres csatlakozás esetén igaz

**Példa:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

### lekérdezés

SQL lekérdezést hajt végre.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$sql` | húr | SQL lekérdezési karakterlánc |
| `$limit` | int | Maximum visszaadható sorok száma (0 = nincs korlát) |
| `$start` | int | Kezdő eltolás |

**Visszaküldés:** `resource|bool` - Eredményforrás vagy hamis hiba esetén

**Példa:**
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

### lekérdezésF

A műveletet kényszerítő lekérdezést hajt végre (megkerüli a biztonsági ellenőrzéseket).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**Használati esetek:**
- INSERT, UPDATE, DELETE műveletek
- Ha ki kell kerülnie az írásvédett korlátozásokat

**Példa:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

### előtag

Előre fűzi az adatbázistábla előtagját.

```php
public function prefix(string $table = ''): string
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$table` | húr | Táblanév előtag nélkül |

**Visszaküldés:** `string` - A táblázat neve előtaggal

**Példa:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```

---

### fetchArray

Az eredménysort asszociatív tömbként kéri le.

```php
abstract public function fetchArray($result): ?array
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$result` | erőforrás | Lekérdezési eredményforrás |

**Vissza:** `array|null` – asszociatív tömb vagy null, ha nincs több sor

**Példa:**
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

Beolvas egy eredménysort objektumként.

```php
abstract public function fetchObject($result): ?object
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$result` | erőforrás | Lekérdezési eredményforrás |

**Vissza:** `object|null` - Objektum minden oszlophoz tartozó tulajdonságokkal

**Példa:**
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

Egy eredménysort numerikus tömbként kér le.

```php
abstract public function fetchRow($result): ?array
```

**Példa:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

### FetchBoth

Egy eredménysort asszociatív és numerikus tömbként is lekér.

```php
abstract public function fetchBoth($result): ?array
```

**Példa:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```

---

### getRowsNum

Lekéri az eredményhalmaz sorainak számát.

```php
abstract public function getRowsNum($result): int
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$result` | erőforrás | Lekérdezési eredményforrás |

**Visszaküldés:** `int` - Sorok száma

**Példa:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

### getAffectedRows

Lekéri az utolsó lekérdezés érintett sorainak számát.

```php
abstract public function getAffectedRows(): int
```

**Visszaküldés:** `int` - Az érintett sorok száma

**Példa:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

### getInsertId

A legutóbbi INSERT automatikusan generált ID-t kapja.

```php
abstract public function getInsertId(): int
```

**Visszaküldés:** `int` - Utolsó betét ID

**Példa:**
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

### menekülés

A SQL lekérdezésekben való biztonságos használat érdekében kihagyja a karakterláncot.

```php
abstract public function escape(string $string): string
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$string` | húr | String menekülni |

**Vissza:** `string` - Megtisztított karakterlánc (idézőjel nélkül)

**Példa:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

Escape és idézőjel a SQL karakterláncban.

```php
public function quoteString(string $string): string
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$string` | húr | Idézhető karakterlánc |

**Vissza:** `string` – Megtisztított és idézőjeles karakterlánc

**Példa:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### freeRecordSet

Felszabadítja az eredményhez társított memóriát.

```php
abstract public function freeRecordSet($result): void
```

**Példa:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```

---

## Hibakezelés

### hibaMegjelenik az utolsó hibaüzenet.

```php
abstract public function error(): string
```

**Példa:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

### hiba

Lekéri az utolsó hibaszámot.

```php
abstract public function errno(): int
```

**Példa:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## Elkészített kimutatások (MySQLi)

A MySQLi illesztőprogram támogatja az előkészített utasításokat a fokozott biztonság érdekében.

### készülj fel

Elkészített kimutatást hoz létre.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**Példa:**
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

### Elkészített kimutatás több paraméterrel

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

## Tranzakciós támogatás

### beginTransaction

Elindít egy tranzakciót.

```php
public function beginTransaction(): bool
```

### kötelezze el magát

Véglegesíti az aktuális tranzakciót.

```php
public function commit(): bool
```

### visszaállítás

Visszaállítja az aktuális tranzakciót.

```php
public function rollback(): bool
```

**Példa:**
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

## Teljes használati példák

### Alapvető CRUD műveletek

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

### Lapozási lekérdezés

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

### Keresés a LIKE segítségével

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

### Csatlakozás a lekérdezéshez

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

## SqlUtility osztály

Segítő osztály SQL fájlműveletekhez.

### SplitMySqlFile

Egy SQL fájlt különálló lekérdezésekre oszt fel.

```php
public static function splitMySqlFile(string $content): array
```

**Példa:**
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

A tábla helyőrzőit előtagolt táblanevekre cseréli.

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**Példa:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## Bevált gyakorlatok

### Biztonság

1. **Mindig ne hagyja ki a felhasználói bevitelt**:
```php
$safe = $db->escape($_POST['input']);
```

2. **Használjon elkészített kimutatásokat, ha rendelkezésre állnak**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **Használja a quoteString karakterláncot az értékekhez**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### Teljesítmény

1. **Mindig használja a LIMIT-t nagy asztalokhoz**:
```php
$result = $db->query($sql, 100);  // Limit results
```

2. **Ingyenes eredménykészletek, ha elkészült**:
```php
$db->freeRecordSet($result);
```

3. **Használjon megfelelő indexeket** a táblázat definícióiban

4. **Ha lehetséges, részesítse előnyben a kezelőket a nyers SQL** helyett

### Hibakezelés

1. **Mindig ellenőrizze a hibákat**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **Tranzakciók használata több kapcsolódó művelethez**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```

## Kapcsolódó dokumentáció

- Kritériumok - Lekérdezési kritériumrendszer
- QueryBuilder - Folyékony lekérdezésépítés
- ../Core/XOOPSObjectHandler - Objektum megmaradás

---

*Lásd még: [XOOPS forráskód](https://github.com/XOOPS/XOOPSCore27/tree/master/htdocs/class/database)*
