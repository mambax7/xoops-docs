---
title: "SQL การป้องกันการฉีด"
description: "แนวทางปฏิบัติด้านความปลอดภัยของฐานข้อมูลและป้องกันการแทรก SQL ใน XOOPS"
---
SQL การฉีดเป็นหนึ่งในช่องโหว่ที่อันตรายและพบบ่อยที่สุดสำหรับเว็บแอปพลิเคชัน คู่มือนี้ครอบคลุมวิธีการปกป้องโมดูล XOOPS ของคุณจากการโจมตีแบบฉีด SQL

## เอกสารที่เกี่ยวข้อง

- แนวปฏิบัติด้านความปลอดภัยที่ดีที่สุด - คู่มือความปลอดภัยที่ครอบคลุม
- CSRF-การป้องกัน - ระบบโทเค็นและคลาส XoopsSecurity
- การฆ่าเชื้ออินพุต - MyTextSanitizer และการตรวจสอบ

## ทำความเข้าใจ SQL การฉีด

SQL การแทรกจะเกิดขึ้นเมื่อมีการป้อนข้อมูลของผู้ใช้โดยตรงในการสืบค้น SQL โดยไม่มีการฆ่าเชื้อหรือการกำหนดพารามิเตอร์อย่างเหมาะสม

### ตัวอย่างโค้ดที่มีช่องโหว่
```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```
ถ้าผู้ใช้ส่ง `1 OR 1=1` เป็น ID การสืบค้นจะกลายเป็น:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```
ซึ่งจะส่งคืนระเบียนทั้งหมดแทนที่จะเป็นเพียงระเบียนเดียว

## การใช้แบบสอบถามแบบกำหนดพารามิเตอร์

การป้องกันที่มีประสิทธิภาพสูงสุดต่อการฉีด SQL คือการใช้การสืบค้นแบบกำหนดพารามิเตอร์ (คำสั่งที่เตรียมไว้)

### แบบสอบถามแบบกำหนดพารามิเตอร์พื้นฐาน
```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```
### หลายพารามิเตอร์
```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```
### พารามิเตอร์ที่มีชื่อ

นามธรรมฐานข้อมูลบางตัวรองรับพารามิเตอร์ที่มีชื่อ:
```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```
## การใช้ XoopsObject และ XoopsObjectHandler

XOOPS ให้การเข้าถึงฐานข้อมูลเชิงวัตถุซึ่งช่วยป้องกันการแทรก SQL ผ่านระบบเกณฑ์

### การใช้เกณฑ์พื้นฐาน
```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```
### CriteriaCompo สำหรับหลายเงื่อนไข
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
### ผู้ดำเนินการตามเกณฑ์
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
### OR เงื่อนไข
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```
## คำนำหน้าตาราง

ใช้ระบบคำนำหน้าตาราง XOOPS เสมอ:
```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```
## INSERT แบบสอบถาม

### การใช้คำสั่งที่เตรียมไว้
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
### การใช้ XoopsObject
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
## UPDATE แบบสอบถาม

### การใช้คำสั่งที่เตรียมไว้
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
### การใช้ XoopsObject
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
## DELETE แบบสอบถาม

### การใช้คำสั่งที่เตรียมไว้
```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```
### การใช้ XoopsObject
```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```
### ลบจำนวนมากโดยมีเกณฑ์
```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```
## การหลบหนีเมื่อจำเป็น

หากคุณไม่สามารถใช้คำสั่งที่เตรียมไว้ได้ ให้ใช้การหลีกอย่างเหมาะสม:
```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```
อย่างไรก็ตาม **มักเลือกใช้ข้อความที่เตรียมไว้** มากกว่าการหลบหนี

## การสร้างแบบสอบถามแบบไดนามิกอย่างปลอดภัย

### ชื่อคอลัมน์ไดนามิกที่ปลอดภัย

ชื่อคอลัมน์ไม่สามารถกำหนดพารามิเตอร์ได้ ตรวจสอบกับรายการที่อนุญาต:
```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```
### ชื่อตารางไดนามิกที่ปลอดภัย

ในทำนองเดียวกัน ตรวจสอบชื่อตาราง:
```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```
### การสร้าง WHERE ประโยคแบบไดนามิก
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
## LIKE แบบสอบถาม

โปรดใช้ความระมัดระวังกับข้อความค้นหา LIKE เพื่อหลีกเลี่ยงการแทรกไวด์การ์ด:
```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```
## IN ข้อ

เมื่อใช้ส่วนคำสั่ง IN ตรวจสอบให้แน่ใจว่าได้พิมพ์ค่าทั้งหมดอย่างถูกต้อง:
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
หรือมีเกณฑ์:
```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```
## ความปลอดภัยในการทำธุรกรรม

เมื่อดำเนินการค้นหาที่เกี่ยวข้องหลายรายการ:
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
## การจัดการข้อผิดพลาด

อย่าเปิดเผยข้อผิดพลาด SQL ให้กับผู้ใช้:
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
## ข้อผิดพลาดทั่วไปที่ควรหลีกเลี่ยง

### ข้อผิดพลาด 1: การแก้ไขตัวแปรโดยตรง
```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```
### ข้อผิดพลาด 2: การใช้ addslashes()
```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```
### ข้อผิดพลาด 3: การเชื่อถือรหัสตัวเลข
```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```
### ข้อผิดพลาด 4: การฉีดครั้งที่สอง
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
## การทดสอบความปลอดภัย

### ทดสอบคำถามของคุณ

ทดสอบแบบฟอร์มของคุณด้วยอินพุตเหล่านี้เพื่อตรวจสอบการแทรก SQL:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

หากสิ่งเหล่านี้ทำให้เกิดการทำงานหรือข้อผิดพลาดที่ไม่คาดคิด แสดงว่าคุณมีช่องโหว่

### การทดสอบอัตโนมัติ

ใช้เครื่องมือทดสอบการฉีด SQL อัตโนมัติระหว่างการพัฒนา:

- SQL Map
- เรอสวีท
- OWASP ZAP

## สรุปแนวทางปฏิบัติที่ดีที่สุด

1. **ใช้การสืบค้นแบบกำหนดพารามิเตอร์เสมอ** (คำสั่งที่เตรียมไว้)
2. **ใช้ XoopsObject/XoopsObjectHandler** เมื่อเป็นไปได้
3. **ใช้คลาสเกณฑ์** เพื่อสร้างแบบสอบถาม
4. **ค่าที่อนุญาตในไวท์ลิสต์** สำหรับคอลัมน์และชื่อตาราง
5. **แปลงค่าตัวเลข** อย่างชัดเจนด้วย `(int)` หรือ `(float)`
6. **อย่าเปิดเผยข้อผิดพลาดของฐานข้อมูล** แก่ผู้ใช้
7. **ใช้ธุรกรรม** สำหรับคำถามที่เกี่ยวข้องหลายรายการ
8. **ทดสอบการฉีด SQL** ในระหว่างการพัฒนา
9. **Escape LIKE wildcards** ในคำค้นหา
10. **ฆ่าเชื้อค่าอนุประโยค IN** ทีละรายการ

---

#ความปลอดภัย #การฉีด SQL #ฐานข้อมูล #xoops #คำสั่งที่เตรียมไว้ #เกณฑ์