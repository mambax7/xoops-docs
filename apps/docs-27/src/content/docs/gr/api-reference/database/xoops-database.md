---
title: "Τάξη XoopsDatabase"
description: "Επίπεδο αφαίρεσης βάσης δεδομένων που παρέχει διαχείριση σύνδεσης, εκτέλεση ερωτημάτων και χειρισμό αποτελεσμάτων"
---

Η κλάση `XoopsDatabase` παρέχει ένα επίπεδο αφαίρεσης βάσης δεδομένων για το XOOPS, τη διαχείριση της σύνδεσης, την εκτέλεση ερωτημάτων, την επεξεργασία αποτελεσμάτων και τον χειρισμό σφαλμάτων. Υποστηρίζει πολλαπλά προγράμματα οδήγησης βάσης δεδομένων μέσω μιας αρχιτεκτονικής προγραμμάτων οδήγησης.

## Επισκόπηση τάξης

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

## Ιεραρχία τάξης

```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```

## Λήψη παρουσίας βάσης δεδομένων

## # Χρήση του εργοστασίου

```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

## # Χρήση getInstance

```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```

## # Καθολική μεταβλητή

```php
// Legacy: Use global variable
global $xoopsDB;
```

## Βασικές Μέθοδοι

## # σύνδεση

Δημιουργεί μια σύνδεση βάσης δεδομένων.

```php
abstract public function connect(bool $selectdb = true): bool
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `$selectdb` | bool | Εάν θα επιλέξετε τη βάση δεδομένων |

**Επιστροφές:** `bool` - True σε επιτυχημένη σύνδεση

**Παράδειγμα:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

## # ερώτημα

Εκτελεί ένα ερώτημα SQL.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `$sql` | χορδή | SQL συμβολοσειρά ερωτήματος |
| `$limit` | int | Μέγιστες σειρές προς επιστροφή (0 = χωρίς όριο) |
| `$start` | int | Μετατόπιση εκκίνησης |

**Επιστρέφει:** `resource|bool` - Πηγή αποτελέσματος ή ψευδής σε περίπτωση αποτυχίας

**Παράδειγμα:**
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

## # ερώτημαF

Εκτελεί ένα ερώτημα που επιβάλλει τη λειτουργία (παρακάμπτει τους ελέγχους ασφαλείας).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**Περιπτώσεις χρήσης:**
- Λειτουργίες INSERT, UPDATE, DELETE
- Όταν πρέπει να παρακάμψετε περιορισμούς μόνο για ανάγνωση

**Παράδειγμα:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

## # πρόθεμα

Προετοιμάζει το πρόθεμα πίνακα βάσης δεδομένων.

```php
public function prefix(string $table = ''): string
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `$table` | χορδή | Όνομα πίνακα χωρίς πρόθεμα |

**Επιστρέφει:** `string` - Όνομα πίνακα με πρόθεμα

**Παράδειγμα:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```

---

## # fetchArray

Ανακτά μια σειρά αποτελεσμάτων ως συσχετιστικό πίνακα.

```php
abstract public function fetchArray($result): ?array
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `$result` | πόρος | Πηγή αποτελεσμάτων ερωτήματος |

**Επιστρέφει:** `array|null` - Συσχετικός πίνακας ή μηδενικός εάν δεν υπάρχουν άλλες σειρές

**Παράδειγμα:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "User: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```

---

## # fetchObject

Ανακτά μια σειρά αποτελέσματος ως αντικείμενο.

```php
abstract public function fetchObject($result): ?object
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `$result` | πόρος | Πηγή αποτελεσμάτων ερωτήματος |

**Επιστρέφει:** `object|null` - Αντικείμενο με ιδιότητες για κάθε στήλη

**Παράδειγμα:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Username: " . $user->uname;
    echo "Email: " . $user->email;
}
```

---

## # fetchRow

Ανακτά μια σειρά αποτελεσμάτων ως αριθμητικό πίνακα.

```php
abstract public function fetchRow($result): ?array
```

**Παράδειγμα:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

## # fetchBoth

Ανακτά μια σειρά αποτελεσμάτων τόσο ως συσχετιστικό όσο και ως αριθμητικό πίνακα.

```php
abstract public function fetchBoth($result): ?array
```

**Παράδειγμα:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```

---

## # getRowsNum

Λαμβάνει τον αριθμό των σειρών σε ένα σύνολο αποτελεσμάτων.

```php
abstract public function getRowsNum($result): int
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `$result` | πόρος | Πηγή αποτελεσμάτων ερωτήματος |

**Επιστροφές:** `int` - Αριθμός σειρών

**Παράδειγμα:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

## # getAffectedRows

Λαμβάνει τον αριθμό των επηρεαζόμενων σειρών από το τελευταίο ερώτημα.

```php
abstract public function getAffectedRows(): int
```

**Επιστροφές:** `int` - Αριθμός επηρεαζόμενων σειρών

**Παράδειγμα:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

## # getInsertId

Λαμβάνει το αναγνωριστικό που δημιουργείται αυτόματα από το τελευταίο INSERT.

```php
abstract public function getInsertId(): int
```

**Επιστροφές:** `int` - Τελευταία εισαγωγή αναγνωριστικού

**Παράδειγμα:**
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

## # απόδραση

Διαφεύγει μια συμβολοσειρά για ασφαλή χρήση σε ερωτήματα SQL.

```php
abstract public function escape(string $string): string
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `$string` | χορδή | Χορδή να ξεφύγω |

**Επιστρέφει:** `string` - Συμβολοσειρά διαφυγής (χωρίς εισαγωγικά)

**Παράδειγμα:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

## # quoteString

Escapes και παραθέτει μια συμβολοσειρά για SQL.

```php
public function quoteString(string $string): string
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `$string` | χορδή | Συμβολοσειρά σε παράθεση |

**Επιστρέφει:** `string` - Συμβολοσειρά διαφυγής και εισαγωγικών

**Παράδειγμα:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

## # freeRecordSet

Απελευθερώνει τη μνήμη που σχετίζεται με ένα αποτέλεσμα.

```php
abstract public function freeRecordSet($result): void
```

**Παράδειγμα:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```

---

## Χειρισμός σφαλμάτων

## # σφάλμα

Λαμβάνει το τελευταίο μήνυμα σφάλματος.

```php
abstract public function error(): string
```

**Παράδειγμα:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

## # λάθος

Λαμβάνει τον τελευταίο αριθμό σφάλματος.

```php
abstract public function errno(): int
```

**Παράδειγμα:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## Προετοιμασμένες δηλώσεις (MySQLi)

Το πρόγραμμα οδήγησης MySQLi υποστηρίζει προετοιμασμένες δηλώσεις για βελτιωμένη ασφάλεια.

## # ετοιμαστείτε

Δημιουργεί μια προετοιμασμένη δήλωση.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**Παράδειγμα:**
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

## # Έτοιμη δήλωση με πολλαπλές παραμέτρους

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

## Υποστήριξη συναλλαγών

## # έναρξη Συναλλαγής

Ξεκινά μια συναλλαγή.

```php
public function beginTransaction(): bool
```

## # δέσμευση

Δεσμεύει την τρέχουσα συναλλαγή.

```php
public function commit(): bool
```

## # επαναφορά

Επαναφέρει την τρέχουσα συναλλαγή.

```php
public function rollback(): bool
```

**Παράδειγμα:**
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

## Ολοκληρωμένα Παραδείγματα Χρήσης

## # Βασικές λειτουργίες CRUD

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

## # Ερώτημα σελιδοποίησης

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

## # Ερώτημα αναζήτησης με LIKE

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

## # Συμμετοχή στο ερώτημα

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

## Κλάση SqlUtility

Βοηθητική κλάση για λειτουργίες αρχείων SQL.

## # splitMySqlFile

Διαχωρίζει ένα αρχείο SQL σε μεμονωμένα ερωτήματα.

```php
public static function splitMySqlFile(string $content): array
```

**Παράδειγμα:**
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

## # πρόθεμα Ερώτηση

Αντικαθιστά τα σύμβολα κράτησης θέσης πίνακα με ονόματα πινάκων με πρόθεμα.

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**Παράδειγμα:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## Βέλτιστες πρακτικές

## # Ασφάλεια

1. **Πάντα διαφυγή εισόδου χρήστη**:
```php
$safe = $db->escape($_POST['input']);
```

2. **Χρησιμοποιήστε έτοιμες καταστάσεις όταν είναι διαθέσιμες**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **Χρησιμοποιήστε quoteString για τιμές**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

## # Απόδοση

1. **Να χρησιμοποιείτε πάντα LIMIT για μεγάλα τραπέζια**:
```php
$result = $db->query($sql, 100);  // Limit results
```

2. **Δωρεάν σετ αποτελεσμάτων όταν τελειώσετε**:
```php
$db->freeRecordSet($result);
```

3. **Χρησιμοποιήστε κατάλληλα ευρετήρια** στους ορισμούς των πινάκων σας

4. **Προτιμήστε τους χειριστές έναντι των ακατέργαστων SQL** όταν είναι δυνατόν

## # Χειρισμός σφαλμάτων

1. **Να ελέγχετε πάντα για σφάλματα**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **Χρησιμοποιήστε συναλλαγές για πολλαπλές σχετικές λειτουργίες**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```

## Σχετική τεκμηρίωση

- Κριτήρια - Σύστημα κριτηρίων ερωτήματος
- QueryBuilder - Fluent query building
- ../Core/XoopsObjectHandler - Εμμονή αντικειμένου

---

*Δείτε επίσης: [XOOPS Πηγαίος κώδικας](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*
