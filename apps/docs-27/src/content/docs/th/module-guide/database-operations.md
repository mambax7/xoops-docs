---
title: "การดำเนินงานฐานข้อมูล"
---
## ภาพรวม

XOOPS จัดเตรียมเลเยอร์นามธรรมของฐานข้อมูลที่รองรับทั้งรูปแบบขั้นตอนแบบเดิมและวิธีการเชิงวัตถุสมัยใหม่ คู่มือนี้ครอบคลุมถึงการดำเนินการฐานข้อมูลทั่วไปสำหรับการพัฒนาโมดูล

## การเชื่อมต่อฐานข้อมูล

### การรับอินสแตนซ์ฐานข้อมูล
```php
// Legacy approach
global $xoopsDB;

// Modern approach via helper
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Via XMF helper
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```
## การดำเนินงานขั้นพื้นฐาน

### SELECT แบบสอบถาม
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
### INSERT การดำเนินการ
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
### UPDATE การดำเนินการ
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
### DELETE การดำเนินการ
```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```
## การใช้เกณฑ์

ระบบเกณฑ์จัดเตรียมวิธีที่ปลอดภัยสำหรับการสร้างแบบสอบถาม:
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
### ผู้ดำเนินการตามเกณฑ์

| ตัวดำเนินการ | คำอธิบาย |
|----------|-------------|
| `=` | เท่ากับ (ค่าเริ่มต้น) |
| `!=` | ไม่เท่ากับ |
| `<` | น้อยกว่า |
| `>` | มากกว่า |
| `<=` | น้อยกว่าหรือเท่ากับ |
| `>=` | มากกว่าหรือเท่ากับ |
| `LIKE` | การจับคู่รูปแบบ |
| `IN` | ในชุดของค่า |
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
## ตัวจัดการวัตถุ

### วิธีการจัดการ
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
### วิธีการจัดการแบบกำหนดเอง
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
## การทำธุรกรรม
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
## งบที่เตรียมไว้ (สมัยใหม่)
```php
// Using PDO through XOOPS database layer
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```
## การจัดการสคีมา

### การสร้างตาราง
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
### การย้ายถิ่น
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
## แนวทางปฏิบัติที่ดีที่สุด

1. **สตริงเครื่องหมายคำพูดเสมอ** - ใช้ `$db->quoteString()` สำหรับการป้อนข้อมูลของผู้ใช้
2. **ใช้ Intval** - โยนจำนวนเต็มด้วย `intval()` หรือพิมพ์การประกาศ
3. **ต้องการตัวจัดการ** - ใช้ตัวจัดการวัตถุมากกว่า raw SQL เมื่อเป็นไปได้
4. **ใช้เกณฑ์** - สร้างการสืบค้นด้วยเกณฑ์เพื่อความปลอดภัยของประเภท
5. **จัดการข้อผิดพลาด** - ตรวจสอบค่าที่ส่งคืนและจัดการความล้มเหลว
6. **ใช้ธุรกรรม** - ตัดการดำเนินการที่เกี่ยวข้องในธุรกรรม

## เอกสารที่เกี่ยวข้อง

- ../04-API-อ้างอิง/เคอร์เนล/เกณฑ์ - การสร้างแบบสอบถามด้วยเกณฑ์
- ../04-API-อ้างอิง/Core/XoopsObjectHandler - รูปแบบตัวจัดการ
- ../02-Core-Concepts/Database/Database-Layer - ฐานข้อมูลที่เป็นนามธรรม
- ฐานข้อมูล/ฐานข้อมูล-Schema - คู่มือการออกแบบ Schema