---
title: "Pencegahan Injeksi SQL"
description: "Praktik keamanan basis data dan mencegah injeksi SQL di XOOPS"
---

Injeksi SQL adalah salah satu kerentanan aplikasi web yang paling berbahaya dan umum. Panduan ini mencakup cara melindungi module XOOPS Anda dari serangan injeksi SQL.

## Dokumentasi Terkait

- Keamanan-Praktik Terbaik - Panduan keamanan komprehensif
- CSRF-Perlindungan - Sistem token dan kelas XoopsSecurity
- Sanitasi Masukan - MyTextSanitizer dan validasi

## Pengertian Injeksi SQL

Injeksi SQL terjadi ketika input pengguna disertakan langsung dalam kueri SQL tanpa sanitasi atau parameterisasi yang tepat.

### Contoh Kode Rentan

```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

Jika pengguna meneruskan `1 OR 1=1` sebagai ID, kuerinya menjadi:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

Ini mengembalikan semua catatan, bukan hanya satu.

## Menggunakan Kueri Berparameter

Pertahanan paling efektif terhadap injeksi SQL adalah menggunakan kueri berparameter (pernyataan yang disiapkan).

### Kueri Parameter Dasar

```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### Beberapa Parameter

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### Parameter Bernama

Beberapa abstraksi database mendukung parameter bernama:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## Menggunakan XoopsObject dan XoopsObjectHandler

XOOPS menyediakan akses database berorientasi objek yang membantu mencegah injeksi SQL melalui sistem Kriteria.

### Penggunaan Kriteria Dasar

```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```

### KriteriaCompo untuk Berbagai Kondisi

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

### Operator Kriteria

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

### ATAU Ketentuan

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## Awalan Tabel

Selalu gunakan sistem awalan tabel XOOPS:

```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## MASUKKAN Kueri

### Menggunakan Pernyataan yang Disiapkan

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

### Menggunakan XoopsObject

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

## PERBARUI Pertanyaan

### Menggunakan Pernyataan yang Disiapkan

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

### Menggunakan XoopsObject

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

## HAPUS Pertanyaan

### Menggunakan Pernyataan yang Disiapkan

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Menggunakan XoopsObject

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### Penghapusan Massal dengan Kriteria

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## Melarikan Diri Saat Diperlukan

Jika Anda tidak dapat menggunakan pernyataan yang sudah disiapkan, gunakan pelolosan yang tepat:

```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

Namun, **selalu lebih memilih pernyataan yang sudah disiapkan** daripada melarikan diri.

## Membangun Kueri Dinamis dengan Aman

### Nama Kolom Dinamis Aman

Nama kolom tidak dapat diparameterisasi. Validasi terhadap daftar putih:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### Nama Tabel Dinamis yang Aman

Demikian pula, validasi nama tabel:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### Membangun Klausul WHERE Secara Dinamis

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

## SEPERTI Pertanyaan

Hati-hati dengan pertanyaan LIKE untuk menghindari injeksi wildcard:

```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## DALAM Klausul

Saat menggunakan klausa IN, pastikan semua nilai diketik dengan benar:

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

Atau dengan Kriteria:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## Keamanan Transaksi

Saat melakukan beberapa kueri terkait:

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

## Penanganan Kesalahan

Jangan pernah memaparkan kesalahan SQL kepada pengguna:

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

## Kesalahan Umum yang Harus Dihindari

### Kesalahan 1: Interpolasi Variabel Langsung

```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Kesalahan 2: Menggunakan addslashes()

```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### Kesalahan 3: Mempercayai ID Numerik

```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### Kesalahan 4: Injeksi Orde Kedua

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

## Pengujian Keamanan

### Uji Pertanyaan Anda

Uji formulir Anda dengan masukan berikut untuk memeriksa injeksi SQL:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Jika salah satu dari hal ini menyebabkan perilaku atau kesalahan yang tidak diharapkan, Anda memiliki kerentanan.

### Pengujian Otomatis

Gunakan alat pengujian injeksi SQL otomatis selama pengembangan:

- SQLMap
- Suite Bersendawa
- OWASP ZAP

## Ringkasan Praktik Terbaik1. **Selalu gunakan kueri berparameter** (pernyataan yang telah disiapkan)
2. **Gunakan XoopsObject/XoopsObjectHandler** bila memungkinkan
3. **Gunakan kelas Kriteria** untuk membuat kueri
4. **Masukkan nilai yang diizinkan** untuk nama kolom dan tabel
5. **Menampilkan nilai numerik** secara eksplisit dengan `(int)` atau `(float)`
6. **Jangan pernah mengekspos kesalahan database** kepada pengguna
7. **Gunakan transaksi** untuk beberapa pertanyaan terkait
8. **Uji injeksi SQL** selama pengembangan
9. **Escape LIKE wildcard** dalam kueri penelusuran
10. **Sanitasi nilai klausa IN** satu per satu

---

#keamanan #sql-injection #database #xoops #prepared-statements #Criteria
