---
title: "Pencegahan Suntikan SQL"
description: "Amalan keselamatan pangkalan data dan mencegah suntikan SQL dalam XOOPS"
---
Suntikan SQL ialah salah satu kelemahan aplikasi web yang paling berbahaya dan biasa. Panduan ini merangkumi cara melindungi modul XOOPS anda daripada serangan suntikan SQL.## Dokumentasi Berkaitan- Amalan Terbaik Keselamatan - Panduan keselamatan yang komprehensif
- CSRF-Protection - Sistem token dan kelas XoopsSecurity
- Input-Sanitization - MyTextSanitizer dan pengesahan## Memahami SQL InjectionSuntikan SQL berlaku apabila input pengguna dimasukkan terus dalam pertanyaan SQL tanpa sanitasi atau parameterisasi yang betul.### Contoh Kod Terdedah
```
php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```
Jika pengguna melepasi `1 OR 1=1` sebagai ID, pertanyaan menjadi:
```
sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```
Ini mengembalikan semua rekod dan bukannya satu sahaja.## Menggunakan Pertanyaan BerparameterPertahanan yang paling berkesan terhadap suntikan SQL adalah menggunakan pertanyaan berparameter (pernyataan yang disediakan).### Pertanyaan Berparameter Asas
```
php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```
### Berbilang Parameter
```
php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```
### Parameter DinamakanBeberapa abstraksi pangkalan data menyokong parameter bernama:
```
php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```
## Menggunakan XoopsObject dan XoopsObjectHandlerXOOPS menyediakan akses pangkalan data berorientasikan objek yang membantu menghalang suntikan SQL melalui sistem Kriteria.### Penggunaan Kriteria Asas
```
php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```
### CriteriaCompo untuk Pelbagai Syarat
```
php
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
### Pengendali Kriteria
```
php
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
### ATAU Syarat
```
php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```
## Awalan JadualSentiasa gunakan sistem awalan jadual XOOPS:
```
php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```
## INSERT Pertanyaan### Menggunakan Penyata yang Disediakan
```
php
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
```
php
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
## UPDATE Pertanyaan### Menggunakan Penyata yang Disediakan
```
php
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
```
php
// Get existing object
$item = $itemHandler->get((int)$id);

if ($item) {
    $item->setVar('title', $title);
    $item->setVar('content', $content);
    $item->setVar('updated', time());

    $itemHandler->insert($item);
}
```
## DELETE Pertanyaan### Menggunakan Penyata yang Disediakan
```
php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```
### Menggunakan XoopsObject
```
php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```
### Padam Pukal dengan Kriteria
```
php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```
## Melarikan diri Apabila PerluJika anda tidak boleh menggunakan pernyataan yang disediakan, gunakan pelarian yang betul:
```
php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```
Walau bagaimanapun, **sentiasa mengutamakan kenyataan yang disediakan** daripada melarikan diri.## Membina Pertanyaan Dinamik Dengan Selamat### Nama Lajur Dinamik SelamatNama lajur tidak boleh diparameterkan. Sahkan terhadap senarai putih:
```
php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```
### Nama Jadual Dinamik SelamatBegitu juga, sahkan nama jadual:
```
php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```
### Membina Klausa WHERE Secara Dinamik
```
php
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
## LIKE PertanyaanBerhati-hati dengan pertanyaan LIKE untuk mengelakkan suntikan kad bebas:
```
php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```
## DALAM KlausaApabila menggunakan klausa IN, pastikan semua nilai ditaip dengan betul:
```
php
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
```
php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```
## Keselamatan TransaksiApabila melakukan berbilang pertanyaan berkaitan:
```
php
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
## Pengendalian RalatJangan sekali-kali dedahkan ralat SQL kepada pengguna:
```
php
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
## Kesilapan Biasa yang Perlu Dielakkan### Kesilapan 1: Interpolasi Pembolehubah Langsung
```
php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```
### Kesilapan 2: Menggunakan addslashes()
```
php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```
### Kesilapan 3: Mempercayai ID Numerik
```
php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```
### Kesilapan 4: Suntikan Pesanan Kedua
```
php
// Data from database is NOT automatically safe
$userData = $itemHandler->get($id);
$username = $userData->getVar('username');

// WRONG - trusting data from database
$sql = "SELECT * FROM log WHERE username = '" . $username . "'";

// RIGHT - always use parameters
$sql = "SELECT * FROM log WHERE username = ?";
$result = $xoopsDB->query($sql, [$username]);
```
## Ujian Keselamatan### Uji Pertanyaan AndaUji borang anda dengan input ini untuk menyemak suntikan SQL:- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`Jika mana-mana perkara ini menyebabkan tingkah laku atau ralat yang tidak dijangka, anda mempunyai kelemahan.### Ujian AutomatikGunakan alat ujian suntikan SQL automatik semasa pembangunan:- SQLMap
- Suite Burp
- OWASP ZAP## Ringkasan Amalan Terbaik1. **Sentiasa gunakan pertanyaan berparameter** (pernyataan yang disediakan)
2. **Gunakan XoopsObject/XoopsObjectHandler** apabila boleh
3. **Gunakan kelas Kriteria** untuk membina pertanyaan
4. **Senarai putih nilai yang dibenarkan** untuk lajur dan nama jadual
5. **Hantar nilai angka** secara eksplisit dengan `(int)` atau `(float)`
6. **Jangan sekali-kali dedahkan ralat pangkalan data** kepada pengguna
7. **Gunakan transaksi** untuk berbilang pertanyaan berkaitan
8. **Ujian untuk suntikan SQL** semasa pembangunan
9. **Escape LIKE wildcard** dalam pertanyaan carian
10. **Sanitasi nilai klausa IN** secara individu---

#security #sql-injection #database #XOOPS #prepared-statements #Kriteria