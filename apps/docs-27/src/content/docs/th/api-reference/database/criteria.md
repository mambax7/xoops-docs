---
title: "เกณฑ์และคลาส CriteriaCompo"
description: "การสร้างแบบสอบถามและการกรองขั้นสูงโดยใช้คลาสเกณฑ์"
---
คลาส `Criteria` และ `CriteriaCompo`¤ มอบอินเทอร์เฟซเชิงวัตถุที่คล่องแคล่วสำหรับการสร้างแบบสอบถามฐานข้อมูลที่ซับซ้อน คลาสนามธรรม SQL WHERE clause เหล่านี้ ช่วยให้นักพัฒนาสามารถสร้างแบบสอบถามแบบไดนามิกได้อย่างปลอดภัยและอ่านง่าย

## ภาพรวมชั้นเรียน

### ระดับเกณฑ์

คลาส `Criteria` คลาสแสดงถึงเงื่อนไขเดียวในส่วนคำสั่ง WHERE:
```php
namespace Xoops\Database;

class Criteria
{
    protected $column;
    protected $operator;
    protected $value;
    protected $function;

    public function __construct(
        string $column,
        mixed $value = null,
        string $operator = '=',
        string $function = ''
    ) {}

    public function render(string $prefix = ''): string {}
}
```
## การใช้งานขั้นพื้นฐาน

### เกณฑ์ง่ายๆ
```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```
### ผู้ประกอบการที่แตกต่างกัน
```php
// Equality (default)
$criteria = new Criteria('status', 'active', '=');

// Not equal
$criteria = new Criteria('status', 'active', '<>');

// Greater than
$criteria = new Criteria('age', 18, '>');

// Less than or equal
$criteria = new Criteria('age', 65, '<=');

// LIKE (for pattern matching)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (for multiple values)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```
## สร้างแบบสอบถามที่ซับซ้อน

### AND ตรรกะ (ค่าเริ่มต้น)
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```
### OR ตรรกะ
```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```
## บูรณาการกับรูปแบบพื้นที่เก็บข้อมูล

### ตัวอย่างพื้นที่เก็บข้อมูล
```php
namespace MyModule\Repository;

use Xoops\Database\XoopsDatabase;
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

class UserRepository
{
    private $db;
    private $table = 'users';

    public function __construct(XoopsDatabase $db)
    {
        $this->db = $db;
    }

    public function findByCriteria(CriteriaCompo $criteria): array
    {
        $sql = "SELECT * FROM {$this->table}";

        if ($criteria->count() > 0) {
            $sql .= " WHERE " . $criteria->render();
        }

        $result = $this->db->query($sql);
        $users = [];

        while ($row = $this->db->fetchArray($result)) {
            $users[] = new User($row);
        }

        return $users;
    }
}
```
## ความปลอดภัยและการรักษาความปลอดภัย

### การหลบหนีอัตโนมัติ

คลาส `Criteria` คลาสจะหลีกค่าโดยอัตโนมัติเพื่อป้องกันการแทรก SQL:
```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```
## API ข้อมูลอ้างอิง

### วิธีการเกณฑ์

| วิธีการ | คำอธิบาย | กลับ |
|--------|-------------|--------|
| `__construct()` | เริ่มต้นเงื่อนไขเกณฑ์ | เป็นโมฆะ |
| `render($prefix = '')` | แสดงผลเป็น SQL WHERE ส่วนคำสั่ง | สตริง |
| `getColumn()` | รับชื่อคอลัมน์ | สตริง |
| `getValue()` | รับค่าเปรียบเทียบ | ผสม |
| `getOperator()` | รับตัวดำเนินการเปรียบเทียบ | สตริง |

### วิธีการรวมเกณฑ์

| วิธีการ | คำอธิบาย | กลับ |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | เริ่มต้นเกณฑ์ผสม | เป็นโมฆะ |
| `add($criteria, $logic = null)` | เพิ่มเกณฑ์หรือคอมโพสิตที่ซ้อนกัน | เป็นโมฆะ |
| `render($prefix = '')` | แสดงผลเพื่อให้ WHERE clause | สมบูรณ์ สตริง |
| `count()` | รับจำนวนเกณฑ์ | อินท์ |
| `clear()` | ลบเกณฑ์ทั้งหมด | เป็นโมฆะ |

## เอกสารที่เกี่ยวข้อง

- XoopsDatabase - การอ้างอิงคลาสฐานข้อมูล
- ../../03-Module-Development/Patterns/Repository-Pattern - รูปแบบ Repository ใน XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - รูปแบบเลเยอร์บริการ

## ข้อมูลเวอร์ชัน

- **แนะนำ:** XOOPS 2.5.0
- **อัปเดตล่าสุด:** XOOPS 4.0
- **ความเข้ากันได้:** PHP 7.4+