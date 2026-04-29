---
title: "SQL Enjeksiyon Önleme"
description: "database güvenliği uygulamaları ve XOOPS'ye SQL enjeksiyonunun önlenmesi"
---
SQL enjeksiyonu en tehlikeli ve yaygın web uygulaması güvenlik açıklarından biridir. Bu kılavuz, XOOPS modüllerinizi SQL enjeksiyon saldırılarına karşı nasıl koruyacağınızı kapsar.

## İlgili Belgeler

- En İyi Güvenlik Uygulamaları - Kapsamlı güvenlik kılavuzu
- CSRF-Koruma - Token sistemi ve XoopsSecurity sınıfı
- Giriş Temizleme - MyTextSanitizer ve doğrulama

## SQL Enjeksiyonunu Anlamak

SQL enjeksiyonu, user girişinin uygun temizleme veya parametrelendirme olmadan doğrudan SQL sorgularına dahil edilmesi durumunda gerçekleşir.

### Savunmasız Kod Örneği
```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```
Bir user kimlik olarak `1 OR 1=1`'yi geçerse sorgu şu şekilde olur:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```
Bu, yalnızca bir kayıt yerine tüm kayıtları döndürür.

## Parametreli Sorguları Kullanma

SQL enjeksiyonuna karşı en etkili savunma parametreli sorguların (hazırlanmış ifadelerin) kullanılmasıdır.

### Temel Parametreli Sorgu
```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```
### Çoklu Parametreler
```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```
### Adlandırılmış Parametreler

Bazı database soyutlamaları adlandırılmış parametreleri destekler:
```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```
## XoopsObject ve XoopsObjectHandler'yi kullanma

XOOPS, Criteria sistemi aracılığıyla SQL enjeksiyonunun önlenmesine yardımcı olan nesne yönelimli database erişimi sağlar.

### Temel Kriter Kullanımı
```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```
### Çoklu Koşullar için CriteriaCompo
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
### Kriter Operatörleri
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
### VEYA Koşullar
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```
## Tablo Önekleri

Her zaman XOOPS tablo önek sistemini kullanın:
```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```
## INSERT Sorgular

### Hazırlanmış İfadeleri Kullanma
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
### XoopsObject'yi kullanma
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
## UPDATE Sorgular

### Hazırlanmış İfadeleri Kullanma
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
### XoopsObject'yi kullanma
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
## DELETE Sorgular

### Hazırlanmış İfadeleri Kullanma
```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```
### XoopsObject'yi kullanma
```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```
### Kriterlerle Toplu Silme
```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```
## Gerektiğinde Kaçmak

Hazırlanmış ifadeleri kullanamıyorsanız uygun kaçış yöntemini kullanın:
```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```
Ancak kaçmak yerine **her zaman önceden hazırlanmış açıklamaları tercih edin**.

## Dinamik Sorguları Güvenle Oluşturma

### Güvenli Dinamik Sütun Adları

Sütun adları parametrelendirilemez. Beyaz listeye göre doğrulama:
```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```
### Güvenli Dinamik Tablo Adları

Benzer şekilde tablo adlarını doğrulayın:
```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```
### WHERE Cümlelerini Dinamik Olarak Oluşturma
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
## LIKE Sorgular

Joker karakter enjeksiyonunu önlemek için LIKE sorgularına dikkat edin:
```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```
## IN Maddeleri

IN cümlelerini kullanırken tüm değerlerin doğru şekilde yazıldığından emin olun:
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
Veya Kriterlerle:
```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```
## İşlem Güvenliği

Birden fazla ilgili sorgu gerçekleştirirken:
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
## Hata İşleme

SQL hatalarını asla kullanıcılara göstermeyin:
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
## Kaçınılması Gereken Yaygın Hatalar

### Hata 1: Doğrudan Değişken İnterpolasyonu
```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```
### Hata 2: addslashes()'yi kullanmak
```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```
### Hata 3: Sayısal Kimliklere Güvenmek
```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```
### Hata 4: İkinci Dereceden Enjeksiyon
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
## Güvenlik Testi

### Sorgularınızı Test Edin

SQL enjeksiyonunu kontrol etmek için formlarınızı bu girişlerle test edin:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Bunlardan herhangi biri beklenmeyen davranışlara veya hatalara neden oluyorsa, bir güvenlik açığınız var demektir.

### Otomatik Test

Geliştirme sırasında otomatik SQL enjeksiyon test araçlarını kullanın:

- SQLMap
- Geğirme Süiti
- OWASP ZAP

## En İyi Uygulamaların Özeti

1. **Her zaman parametreli sorgular kullanın** (hazırlanmış ifadeler)
2. **Mümkün olduğunda XoopsObject/XoopsObjectHandler** kullanın
3. **Sorgu oluşturmak için Ölçüt sınıflarını kullanın**
4. Sütunlar ve tablo adları için **izin verilen değerleri beyaz listeye alın**
5. **Sayısal değerleri** açıkça `(int)` veya `(float)` ile yayınlayın
6. **database hatalarını asla kullanıcılara göstermeyin**
7. Birden fazla ilgili sorgu için **işlemleri kullanın**
8. **Geliştirme sırasında SQL enjeksiyonunu test edin**
9. **Arama sorgularında LIKE joker karakterlerinden kaçının**
10. **IN yan tümcesi değerlerini ayrı ayrı temizleyin**

---

#güvenlik #sql enjeksiyonu #database #xoops #hazırlanmış ifadeler #Kriterler