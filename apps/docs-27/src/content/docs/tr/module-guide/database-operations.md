---
title: "database İşlemleri"
---
## Genel Bakış

XOOPS, hem eski prosedür kalıplarını hem de modern nesne yönelimli yaklaşımları destekleyen bir database soyutlama katmanı sağlar. Bu kılavuz, module geliştirmeye yönelik ortak database işlemlerini kapsar.

## database Bağlantısı

### database Örneğini Alma
```php
// Legacy approach
global $xoopsDB;

// Modern approach via helper
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Via XMF helper
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```
## Temel İşlemler

### SELECT Sorgular
```php
// Simple query
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE status = 1";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo $row['title'];
}

// With parameters (safe approach)
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);

// Single row
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = " . intval($id);
$result = $db->query($sql);
$row = $db->fetchArray($result);
```
### INSERT İşlemler
```php
// Basic insert
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);

// Get last insert ID
$newId = $db->getInsertId();
```
### UPDATE İşlemler
```php
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    time(),
    intval($id)
);
$db->queryF($sql);

// Check affected rows
$affectedRows = $db->getAffectedRows();
```
### DELETE İşlemler
```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```
## Kriterleri Kullanma

Ölçüt sistemi, sorgu oluşturmak için tür açısından güvenli bir yol sağlar:
```php
use Criteria;
use CriteriaCompo;

// Simple criteria
$criteria = new Criteria('status', 1);
$items = $itemHandler->getObjects($criteria);

// Compound criteria
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart($offset);

$items = $itemHandler->getObjects($criteria);
$count = $itemHandler->getCount($criteria);
```
### Kriter Operatörleri

| Operatör | Açıklama |
|----------|----------------|
| `=` | Eşittir (varsayılan) |
| `!=` | Eşit değil |
| `<` | |'dan az |
| `>` | Şundan büyük: |
| `<=` | Küçük veya eşit |
| `>=` | Büyük veya eşittir |
| `LIKE` | Desen eşleştirme |
| `IN` | Değerler kümesinde |
```php
// LIKE criteria
$criteria = new Criteria('title', '%search%', 'LIKE');

// IN criteria
$criteria = new Criteria('id', '(1,2,3)', 'IN');

// Date range
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('created', $startDate, '>='));
$criteria->add(new Criteria('created', $endDate, '<='));
```
## Nesne İşleyicileri

### İşleyici Yöntemleri
```php
$handler = xoops_getModuleHandler('item', 'mymodule');

// Create new object
$item = $handler->create();

// Get by ID
$item = $handler->get($id);

// Get multiple
$items = $handler->getObjects($criteria);

// Get as array
$items = $handler->getAll($criteria);

// Count
$count = $handler->getCount($criteria);

// Save
$success = $handler->insert($item);

// Delete
$success = $handler->delete($item);
```
### Özel İşleyici Yöntemleri
```php
class ItemHandler extends \XoopsPersistableObjectHandler
{
    public function getPublished(int $limit = 10): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 'published'));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    public function getByCategory(int $categoryId): array
    {
        $criteria = new Criteria('category_id', $categoryId);
        return $this->getObjects($criteria);
    }
}
```
## İşlemler
```php
// Begin transaction
$db->query('START TRANSACTION');

try {
    // Perform multiple operations
    $db->queryF($sql1);
    $db->queryF($sql2);
    $db->queryF($sql3);

    // Commit if all succeed
    $db->query('COMMIT');
} catch (\Exception $e) {
    // Rollback on error
    $db->query('ROLLBACK');
    throw $e;
}
```
## Hazırlanan İfadeler (Modern)
```php
// Using PDO through XOOPS database layer
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```
## Şema Yönetimi

### Tablo Oluşturma
```sql
-- sql/mysql.sql
CREATE TABLE `{PREFIX}_mymodule_items` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT,
    `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    `author_id` INT(11) UNSIGNED NOT NULL,
    `created` INT(11) UNSIGNED NOT NULL,
    `updated` INT(11) UNSIGNED DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_author` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
### Taşımalar
```php
// migrations/001_create_items.php
return new class {
    public function up(\XoopsDatabase $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS " . $db->prefix('mymodule_items') . " (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            created INT UNSIGNED NOT NULL
        )";
        $db->queryF($sql);
    }

    public function down(\XoopsDatabase $db): void
    {
        $sql = "DROP TABLE IF EXISTS " . $db->prefix('mymodule_items');
        $db->queryF($sql);
    }
};
```
## En İyi Uygulamalar

1. **Her Zaman Alıntı Dizeleri** - user girişi için `$db->quoteString()` kullanın
2. **Intval Kullan** - Tamsayıları `intval()` ile yayınlayın veya bildirimleri yazın
3. **İşleyicileri Tercih Edin** - Mümkün olduğunda ham SQL yerine nesne işleyicileri kullanın
4. **Kriterleri Kullan** - Tür güvenliği için Kriterlerle sorgular oluşturun
5. **Hataları İşle** - Dönüş değerlerini kontrol edin ve hataları ele alın
6. **İşlemleri Kullan** - İlgili işlemleri işlemlere sarın

## İlgili Belgeler

- ../04-API-Reference/Kernel/Criteria - Kriterlerle sorgu oluşturma
- ../04-API-Reference/Core/XoopsObjectHandler - İşleyici düzeni
- ../02-Core-Concepts/Database/Database-Layer - database soyutlaması
- Database/Database-Schema - Şema tasarım kılavuzu