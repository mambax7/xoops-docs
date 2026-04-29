---
title: "Operasi Basis Data"
---

## Ikhtisar

XOOPS menyediakan lapisan abstraksi database yang mendukung pola prosedur lama dan pendekatan berorientasi objek modern. Panduan ini mencakup operasi database umum untuk pengembangan module.

## Koneksi Basis Data

### Mendapatkan Instans Basis Data

```php
// Legacy approach
global $xoopsDB;

// Modern approach via helper
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Via XMF helper
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## Operasi Dasar

### PILIH Kueri

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

### Operasi MASUKKAN

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

### PERBARUI Operasi

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

### HAPUS Operasi

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## Menggunakan Kriteria

Sistem Kriteria menyediakan cara yang aman untuk membuat kueri:

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

### Operator Kriteria

| Operator | Deskripsi |
|----------|-------------|
| `=` | Sama (default) |
| `!=` | Tidak sama |
| `<` | Kurang dari |
| `>` | Lebih besar dari |
| `<=` | Kurang dari atau sama dengan |
| `>=` | Lebih besar dari atau sama dengan |
| `LIKE` | Pencocokan pola |
| `IN` | Dalam kumpulan nilai |

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

## Pengendali Objek

### Metode handler

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

### Metode handler Khusus

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

## Transaksi

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

## Pernyataan yang Disiapkan (Modern)

```php
// Using PDO through XOOPS database layer
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## Manajemen Skema

### Membuat Tabel

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

### Migrasi

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

## Praktik Terbaik

1. **Selalu Mengutip String** - Gunakan `$db->quoteString()` untuk input pengguna
2. **Gunakan Intval** - Keluarkan bilangan bulat dengan `intval()` atau ketik deklarasi
3. **Pilih handler** - Gunakan handler objek daripada SQL mentah jika memungkinkan
4. **Gunakan Kriteria** - Buat kueri dengan Kriteria untuk keamanan jenis
5. **Menangani Kesalahan** - Periksa nilai kembalian dan tangani kegagalan
6. **Gunakan Transaksi** - Bungkus operasi terkait dalam transaksi

## Dokumentasi Terkait

- ../04-API-Reference/Kernel/Criteria - Pembuatan kueri dengan Kriteria
- ../04-API-Reference/Core/XoopsObjectHandler - Pola handler
- ../02-Core-Concepts/Database/Database-Layer - Abstraksi basis data
- Database/Database-Schema - Panduan desain skema
