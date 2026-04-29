---
title: "Kelas XoopsDatabase"
description: "Lapisan abstraksi pangkalan data menyediakan pengurusan sambungan, pelaksanaan pertanyaan dan pengendalian hasil"
---
Kelas `XoopsDatabase` menyediakan lapisan abstraksi pangkalan data untuk XOOPS, pengendalian pengurusan sambungan, pelaksanaan pertanyaan, pemprosesan hasil dan pengendalian ralat. Ia menyokong berbilang pemacu pangkalan data melalui seni bina pemacu.## Gambaran Keseluruhan Kelas
```
php
namespace XOOPS\Database;

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
## Hierarki Kelas
```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```
## Mendapatkan Contoh Pangkalan Data### Menggunakan Kilang
```
php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```
### Menggunakan getInstance
```
php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```
### Pembolehubah Global
```
php
// Legacy: Use global variable
global $xoopsDB;
```
## Kaedah Teras### sambungMewujudkan sambungan pangkalan data.
```
php
abstract public function connect(bool $selectdb = true): bool
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$selectdb` | bool | Sama ada hendak memilih pangkalan data |**Pemulangan:** `bool` - Benar pada sambungan yang berjaya**Contoh:**
```
php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```
---

### pertanyaanMelaksanakan pertanyaan SQL.
```
php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$sql` | rentetan | Rentetan pertanyaan SQL |
| `$limit` | int | Baris maksimum untuk dikembalikan (0 = tiada had) |
| `$start` | int | Memulakan offset |**Pemulangan:** `resource|bool` - Sumber hasil atau palsu apabila gagal**Contoh:**
```
php
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

### pertanyaanFMelaksanakan pertanyaan memaksa operasi (memintas pemeriksaan keselamatan).
```
php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```
**Kes Penggunaan:**
- Operasi INSERT, UPDATE, DELETE
- Apabila anda perlu memintas sekatan baca sahaja**Contoh:**
```
php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```
---

### awalanMenandakan awalan jadual pangkalan data.
```
php
public function prefix(string $table = ''): string
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$table` | rentetan | Nama jadual tanpa awalan |**Pemulangan:** `string` - Nama jadual dengan awalan**Contoh:**
```
php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```
---

### fetchArrayMengambil baris hasil sebagai tatasusunan bersekutu.
```
php
abstract public function fetchArray($result): ?array
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$result` | sumber | Sumber hasil pertanyaan |**Pemulangan:** `array|null` - Tatasusunan bersekutu atau null jika tiada lagi baris**Contoh:**
```
php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "User: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```
---

### fetchObjectMengambil baris hasil sebagai objek.
```
php
abstract public function fetchObject($result): ?object
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$result` | sumber | Sumber hasil pertanyaan |**Pemulangan:** `object|null` - Objek dengan sifat untuk setiap lajur**Contoh:**
```
php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Username: " . $user->uname;
    echo "Email: " . $user->email;
}
```
---

### fetchRowMengambil baris hasil sebagai tatasusunan angka.
```
php
abstract public function fetchRow($result): ?array
```
**Contoh:**
```
php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```
---

### ambil KeduanyaMengambil baris hasil sebagai tatasusunan bersekutu dan berangka.
```
php
abstract public function fetchBoth($result): ?array
```
**Contoh:**
```
php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```
---

### getRowsNumMendapat bilangan baris dalam set hasil.
```
php
abstract public function getRowsNum($result): int
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$result` | sumber | Sumber hasil pertanyaan |**Pemulangan:** `int` - Bilangan baris**Contoh:**
```
php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```
---

### getAffectedRowsMendapat bilangan baris yang terjejas daripada pertanyaan terakhir.
```
php
abstract public function getAffectedRows(): int
```
**Pemulangan:** `int` - Bilangan baris yang terjejas**Contoh:**
```
php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```
---

### getInsertIdMendapat ID yang dijana secara automatik daripada INSERT yang terakhir.
```
php
abstract public function getInsertId(): int
```
**Pemulangan:** `int` - ID sisipan terakhir**Contoh:**
```
php
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

### melarikan diriMelarikan diri daripada rentetan untuk kegunaan selamat dalam pertanyaan SQL.
```
php
abstract public function escape(string $string): string
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$string` | rentetan | Rentetan untuk melarikan diri |**Pemulangan:** `string` - Rentetan terlepas (tanpa petikan)**Contoh:**
```
php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```
---

### quoteStringMelarikan diri dan memetik rentetan untuk SQL.
```
php
public function quoteString(string $string): string
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$string` | rentetan | Rentetan untuk dipetik |**Pemulangan:** `string` - Rentetan yang dilepaskan dan dipetik**Contoh:**
```
php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```
---

### SetRekod percumaMembebaskan ingatan yang dikaitkan dengan hasil.
```
php
abstract public function freeRecordSet($result): void
```
**Contoh:**
```
php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```
---

## Pengendalian Ralat### ralatMendapat mesej ralat terakhir.
```
php
abstract public function error(): string
```
**Contoh:**
```
php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```
---

### errnoMendapat nombor ralat terakhir.
```
php
abstract public function errno(): int
```
**Contoh:**
```
php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```
---

## Penyata Disediakan (MySQLi)Pemacu MySQLi menyokong pernyataan yang disediakan untuk keselamatan yang dipertingkatkan.### sediakanMencipta pernyataan yang disediakan.
```
php
public function prepare(string $sql): mysqli_stmt|false
```
**Contoh:**
```
php
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
### Penyata Disediakan dengan Pelbagai Parameter
```
php
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

## Sokongan Transaksi### mulakan TransaksiMemulakan transaksi.
```
php
public function beginTransaction(): bool
```
### komitedMelakukan transaksi semasa.
```
php
public function commit(): bool
```
### gulung balikMenggulung semula urus niaga semasa.
```
php
public function rollback(): bool
```
**Contoh:**
```
php
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

## Contoh Penggunaan Lengkap### Operasi Asas CRUD
```
php
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
### Pertanyaan Penomboran
```
php
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
### Pertanyaan Carian dengan LIKE
```
php
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
### Sertai Pertanyaan
```
php
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

## Kelas SqlUtilityKelas pembantu untuk operasi fail SQL.### splitMySqlFileMembahagikan fail SQL kepada pertanyaan individu.
```
php
public static function splitMySqlFile(string $content): array
```
**Contoh:**
```
php
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
### prefixQueryMenggantikan ruang letak jadual dengan nama jadual awalan.
```
php
public static function prefixQuery(string $sql, string $prefix): string
```
**Contoh:**
```
php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```
---

## Amalan Terbaik### Keselamatan1. **Sentiasa melarikan diri dari input pengguna**:
```
php
$safe = $db->escape($_POST['input']);
```
2. **Gunakan pernyataan yang disediakan apabila tersedia**:
```
php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```
3. **Gunakan quoteString untuk nilai**:
```
php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```
### Prestasi1. **Sentiasa gunakan LIMIT untuk meja besar**:
```
php
$result = $db->query($sql, 100);  // Limit results
```
2. **Set keputusan percuma apabila selesai**:
```
php
$db->freeRecordSet($result);
```
3. **Gunakan indeks yang sesuai** dalam takrif jadual anda4. **Meutamakan pengendali daripada SQL mentah** apabila boleh### Pengendalian Ralat1. **Sentiasa semak ralat**:
```
php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```
2. **Gunakan transaksi untuk berbilang operasi berkaitan**:
```
php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```
## Dokumentasi Berkaitan- Kriteria - Sistem kriteria pertanyaan
- QueryBuilder - Pembinaan pertanyaan yang lancar
- ../Core/XoopsObjectHandler - Kegigihan objek---

*Lihat juga: [XOOPS Kod Sumber](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*