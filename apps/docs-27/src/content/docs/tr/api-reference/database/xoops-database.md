---
title: "XoopsDatabase Sınıfı"
description: "Bağlantı yönetimi, sorgu yürütme ve sonuç işleme sağlayan database soyutlama katmanı"
---
`XoopsDatabase` sınıfı, XOOPS için bağlantı yönetimini, sorgu yürütmeyi, sonuç işlemeyi ve hata işlemeyi yöneten bir database soyutlama katmanı sağlar. Bir sürücü mimarisi aracılığıyla birden fazla database sürücüsünü destekler.

## Sınıfa Genel Bakış
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
## Sınıf Hiyerarşisi
```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```
## database Örneği Alma

### Fabrikayı Kullanmak
```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```
### getInstance'ı kullanma
```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```
### Genel Değişken
```php
// Legacy: Use global variable
global $xoopsDB;
```
## Temel Yöntemler

### bağlan

database bağlantısı kurar.
```php
abstract public function connect(bool $selectdb = true): bool
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$selectdb` | bool | Veritabanının seçilip seçilmeyeceği |

**Döndürür:** `bool` - Başarılı bağlantıda doğru

**Örnek:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```
---

### sorgu

Bir SQL sorgusu yürütür.
```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$sql` | dize | SQL sorgu dizesi |
| `$limit` | int | Döndürülecek maksimum satır (0 = sınır yok) |
| `$start` | int | Başlangıç ​​ofseti |

**Döndürür:** `resource|bool` - Başarısızlık durumunda sonuç kaynağı veya yanlış

**Örnek:**
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

### sorguF

İşlemi zorlayan bir sorgu yürütür (güvenlik kontrollerini atlar).
```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```
**Kullanım Durumları:**
- INSERT, UPDATE, DELETE işlemleri
- Salt okunur kısıtlamaları atlamanız gerektiğinde

**Örnek:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```
---

### öneki

database tablosu önekini başına ekler.
```php
public function prefix(string $table = ''): string
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$table` | dize | Ön eksiz tablo adı |

**Döndürür:** `string` - Önek içeren tablo adı

**Örnek:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```
---

### fetchArray

Bir sonuç satırını ilişkisel bir dizi olarak getirir.
```php
abstract public function fetchArray($result): ?array
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$result` | kaynak | Sorgu sonucu kaynağı |

**Döndürür:** `array|null` - İlişkisel dizi veya başka satır yoksa null

**Örnek:**
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

Sonuç satırını nesne olarak getirir.
```php
abstract public function fetchObject($result): ?object
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$result` | kaynak | Sorgu sonucu kaynağı |

**Döndürür:** `object|null` - Her sütunun özelliklerini içeren nesne

**Örnek:**
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

Sonuç satırını sayısal dizi olarak getirir.
```php
abstract public function fetchRow($result): ?array
```
**Örnek:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```
---

### İkisini de getir

Bir sonuç satırını hem ilişkisel hem de sayısal dizi olarak getirir.
```php
abstract public function fetchBoth($result): ?array
```
**Örnek:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```
---

### getRowsNum

Sonuç kümesindeki satır sayısını alır.
```php
abstract public function getRowsNum($result): int
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$result` | kaynak | Sorgu sonucu kaynağı |

**Döndürür:** `int` - Satır sayısı

**Örnek:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```
---

### getAffectedRows

Son sorgudan etkilenen satırların sayısını alır.
```php
abstract public function getAffectedRows(): int
```
**Döndürür:** `int` - Etkilenen satır sayısı

**Örnek:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```
---

### getInsertId

Son INSERT'den otomatik olarak oluşturulan kimliği alır.
```php
abstract public function getInsertId(): int
```
**Returns:** `int` - Son ekleme kimliği

**Örnek:**
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

### kaçış

SQL sorgularında güvenli kullanım için bir dizeden çıkar.
```php
abstract public function escape(string $string): string
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$string` | dize | Kaçmak için dize |

**Döndürür:** `string` - Kaçınan dize (tırnak işaretleri olmadan)

**Örnek:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```
---

### alıntıDizesi

SQL için bir dizeden kaçar ve tırnak içine alır.
```php
public function quoteString(string $string): string
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$string` | dize | Alıntı yapılacak dize |

**Döndürür:** `string` - Kaçınan ve tırnak içine alınan dize

**Örnek:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```
---

### freeRecordSet

Bir sonuçla ilişkili belleği boşaltır.
```php
abstract public function freeRecordSet($result): void
```
**Örnek:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```
---

## Hata İşleme

### hata

Son hata mesajını alır.
```php
abstract public function error(): string
```
**Örnek:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```
---

### hata yok

Son hata numarasını alır.
```php
abstract public function errno(): int
```
**Örnek:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```
---

## Hazırlanan Ekstreler (MySQLi)

MySQLi sürücüsü, gelişmiş güvenlik için hazırlanmış ifadeleri destekler.

### hazırlan

Hazırlanmış bir ifade oluşturur.
```php
public function prepare(string $sql): mysqli_stmt|false
```
**Örnek:**
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
### Çoklu Parametrelerle Hazırlanmış İfade
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

## İşlem Desteği

### İşlemi başlat

Bir işlem başlatır.
```php
public function beginTransaction(): bool
```
### taahhüt

Geçerli işlemi taahhüt eder.
```php
public function commit(): bool
```
### geri alma

Geçerli işlemi geri alır.
```php
public function rollback(): bool
```
**Örnek:**
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

## Tam Kullanım Örnekleri

### Temel CRUD İşlemler
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
### Sayfalandırma Sorgusu
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
### LIKE ile Arama Sorgusu
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
### Sorguya Katılın
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

## SqlUtility Sınıfı

SQL dosya işlemleri için yardımcı sınıf.

### bölünmüşMySqlFile

Bir SQL dosyasını ayrı sorgulara böler.
```php
public static function splitMySqlFile(string $content): array
```
**Örnek:**
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
### önekSorgusu

Tablo yer tutucularını ön ekli tablo adlarıyla değiştirir.
```php
public static function prefixQuery(string $sql, string $prefix): string
```
**Örnek:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```
---

## En İyi Uygulamalar

### Güvenlik

1. **user girişinden her zaman kaçın**:
```php
$safe = $db->escape($_POST['input']);
```
2. **Mümkün olduğunda hazırlanmış ifadeleri kullanın**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```
3. **Değerler için quoteString'i kullanın**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```
### Performans

1. **Büyük tablolar için her zaman LIMIT kullanın**:
```php
$result = $db->query($sql, 100);  // Limit results
```
2. **İşlem tamamlandığında ücretsiz sonuç kümeleri**:
```php
$db->freeRecordSet($result);
```
3. Tablo tanımlarınızda **uygun dizinleri kullanın**

4. **Mümkünse ham SQL** yerine işleyicileri tercih edin

### Hata İşleme

1. **Her zaman hataları kontrol edin**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```
2. **İşlemleri birden fazla ilgili işlem için kullanın**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```
## İlgili Belgeler

- Kriterler - Sorgu kriterleri sistemi
- QueryBuilder - Akıcı sorgu oluşturma
- ../Core/XoopsObjectHandler - Nesne kalıcılığı

---

*Ayrıca bakınız: [XOOPS Kaynak Kodu](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*