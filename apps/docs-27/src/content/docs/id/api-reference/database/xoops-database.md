---
title: "Kelas XoopsDatabase"
description: "Lapisan abstraksi database menyediakan manajemen koneksi, eksekusi kueri, dan penanganan hasil"
---

Kelas `XoopsDatabase` menyediakan lapisan abstraksi database untuk XOOPS, menangani manajemen koneksi, eksekusi kueri, pemrosesan hasil, dan penanganan kesalahan. Ini mendukung beberapa driver database melalui arsitektur driver.

## Ikhtisar Kelas

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

## Hirarki Kelas

```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```

## Mendapatkan Instans Basis Data

### Menggunakan Pabrik

```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### Menggunakan getInstance

```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```

### Variabel Global

```php
// Legacy: Use global variable
global $xoopsDB;
```

## Metode core

### terhubung

Membuat koneksi database.

```php
abstract public function connect(bool $selectdb = true): bool
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$selectdb` | bodoh | Apakah akan memilih database |

**Pengembalian:** `bool` - Benar jika koneksi berhasil

**Contoh:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

### kueri

Menjalankan kueri SQL.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$sql` | tali | String kueri SQL |
| `$limit` | ke dalam | Baris maksimum yang akan dikembalikan (0 = tanpa batas) |
| `$start` | ke dalam | Mulai mengimbangi |

**Pengembalian:** `resource|bool` - Sumber daya hasil atau salah jika gagal

**Contoh:**
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

### kueriF

Menjalankan kueri yang memaksa operasi (melewati pemeriksaan keamanan).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**Kasus Penggunaan:**
- Operasi MASUKKAN, PERBARUI, HAPUS
- Saat Anda perlu melewati batasan hanya-baca

**Contoh:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

### awalan

Menambahkan awalan tabel database.

```php
public function prefix(string $table = ''): string
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$table` | tali | Nama tabel tanpa awalan |

**Pengembalian:** `string` - Nama tabel dengan awalan

**Contoh:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```

---

### ambilArray

Mengambil baris hasil sebagai array asosiatif.

```php
abstract public function fetchArray($result): ?array
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$result` | sumber daya | Sumber daya hasil kueri |

**Pengembalian:** `array|null` - Array asosiatif atau null jika tidak ada baris lagi

**Contoh:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "User: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```

---

### mengambil Objek

Mengambil baris hasil sebagai objek.

```php
abstract public function fetchObject($result): ?object
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$result` | sumber daya | Sumber daya hasil kueri |

**Pengembalian:** `object|null` - Objek dengan properti untuk setiap kolom

**Contoh:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Username: " . $user->uname;
    echo "Email: " . $user->email;
}
```

---

### ambilBaris

Mengambil baris hasil sebagai array numerik.

```php
abstract public function fetchRow($result): ?array
```

**Contoh:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

### ambilKeduanya

Mengambil baris hasil sebagai array asosiatif dan numerik.

```php
abstract public function fetchBoth($result): ?array
```

**Contoh:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```

---

### dapatkanRowsNum

Mendapatkan jumlah baris dalam kumpulan hasil.

```php
abstract public function getRowsNum($result): int
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$result` | sumber daya | Sumber daya hasil kueri |

**Pengembalian:** `int` - Jumlah baris

**Contoh:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

### dapatkan Baris yang Terkena Dampak

Mendapatkan jumlah baris yang terpengaruh dari kueri terakhir.

```php
abstract public function getAffectedRows(): int
```

**Pengembalian:** `int` - Jumlah baris yang terpengaruh

**Contoh:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

### dapatkanInsertId

Mendapatkan ID yang dibuat secara otomatis dari INSERT terakhir.

```php
abstract public function getInsertId(): int
```

**Pengembalian:** `int` - ID yang dimasukkan terakhir

**Contoh:**
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

### melarikan diri

Mengeluarkan string untuk penggunaan yang aman dalam kueri SQL.

```php
abstract public function escape(string $string): string
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$string` | tali | String untuk keluar |

**Pengembalian:** `string` - String yang lolos (tanpa tanda kutip)

**Contoh:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### kutipanString

Lolos dan mengutip string untuk SQL.

```php
public function quoteString(string $string): string
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$string` | tali | String untuk mengutip |

**Pengembalian:** `string` - String yang lolos dan dikutip

**Contoh:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### Kumpulan Rekaman gratis

Membebaskan memori yang terkait dengan suatu hasil.

```php
abstract public function freeRecordSet($result): void
```
**Contoh:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```

---

## Penanganan Kesalahan

### kesalahan

Mendapat pesan kesalahan terakhir.

```php
abstract public function error(): string
```

**Contoh:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

### salah

Mendapatkan nomor kesalahan terakhir.

```php
abstract public function errno(): int
```

**Contoh:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## Pernyataan yang Disiapkan (MySQLi)

Driver MySQLi mendukung pernyataan yang disiapkan untuk meningkatkan keamanan.

### bersiap

Membuat pernyataan yang sudah disiapkan.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**Contoh:**
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

### Pernyataan yang Disiapkan dengan Banyak Parameter

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

## Dukungan Transaksi

### memulaiTransaksi

Memulai transaksi.

```php
public function beginTransaction(): bool
```

### berkomitmen

Melakukan transaksi saat ini.

```php
public function commit(): bool
```

### kembalikan

Mengembalikan transaksi saat ini.

```php
public function rollback(): bool
```

**Contoh:**
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

## Contoh Penggunaan Lengkap

### Operasi Dasar CRUD

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

### Kueri Penomoran Halaman

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

### Permintaan Pencarian dengan LIKE

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

### Gabung Kueri

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

## Kelas SqlUtility

Kelas pembantu untuk operasi file SQL.

### membagi FileMySql

Membagi file SQL menjadi kueri individual.

```php
public static function splitMySqlFile(string $content): array
```

**Contoh:**
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

### awalan Kueri

Menggantikan placeholder tabel dengan nama tabel yang diawali.

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**Contoh:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## Praktik Terbaik

### Keamanan

1. **Selalu menghindari masukan pengguna**:
```php
$safe = $db->escape($_POST['input']);
```

2. **Gunakan pernyataan yang telah disiapkan bila tersedia**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **Gunakan quoteString untuk nilai**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### Performa

1. **Selalu gunakan LIMIT untuk tabel besar**:
```php
$result = $db->query($sql, 100);  // Limit results
```

2. **Hasil gratis ditetapkan setelah selesai**:
```php
$db->freeRecordSet($result);
```

3. **Gunakan indeks yang sesuai** dalam definisi tabel Anda

4. **Pilih handler daripada SQL mentah** jika memungkinkan

### Penanganan Kesalahan

1. **Selalu periksa kesalahan**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **Gunakan transaksi untuk beberapa operasi terkait**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```

## Dokumentasi Terkait

- Kriteria - Sistem kriteria kueri
- QueryBuilder - Pembuatan kueri yang lancar
- ../Core/XoopsObjectHandler - Kegigihan objek

---

*Lihat juga: [Kode Sumber XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*
