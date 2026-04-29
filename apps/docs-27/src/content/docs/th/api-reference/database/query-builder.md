---
title: "XOOPS ตัวสร้างแบบสอบถาม"
description: "เครื่องมือสร้างคิวรีที่ทันสมัย ​​API สำหรับการสร้าง SELECT, INSERT, UPDATE, DELETE คิวรีด้วยอินเทอร์เฟซแบบลูกโซ่"
---
XOOPS ตัวสร้างแบบสอบถามมีอินเทอร์เฟซที่ทันสมัยและคล่องแคล่วสำหรับการสร้างแบบสอบถาม SQL ช่วยป้องกันการฉีด SQL ปรับปรุงความสามารถในการอ่าน และจัดเตรียมฐานข้อมูลที่เป็นนามธรรมสำหรับระบบฐานข้อมูลหลายระบบ

## สถาปัตยกรรมตัวสร้างแบบสอบถาม
```
mermaid
graph TD
    A[QueryBuilder] -->|builds| B[SELECT Queries]
    A -->|builds| C[INSERT Queries]
    A -->|builds| D[UPDATE Queries]
    A -->|builds| E[DELETE Queries]

    F[Table] -->|chains| G[select]
    F -->|chains| H[where]
    F -->|chains| I[orderBy]
    F -->|chains| J[limit]

    G -->|chains| K[join]
    G -->|chains| H
    H -->|chains| I
    I -->|chains| J

    L[Execute Methods] -->|returns| M[Results]
    L -->|returns| N[Count]
    L -->|returns| O[First/Last]
```
## คลาส QueryBuilder

คลาสตัวสร้างแบบสอบถามหลักพร้อมอินเทอร์เฟซที่คล่องแคล่ว

### ภาพรวมชั้นเรียน
```php
namespace Xoops\Database;

class QueryBuilder
{
    protected string $table = '';
    protected string $type = 'SELECT';
    protected array $selects = [];
    protected array $joins = [];
    protected array $wheres = [];
    protected array $orders = [];
    protected int $limit = 0;
    protected int $offset = 0;
    protected array $bindings = [];
}
```
### วิธีการคงที่

####โต๊ะ

สร้างตัวสร้างแบบสอบถามใหม่สำหรับตาราง
```php
public static function table(string $table): QueryBuilder
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$table` | สตริง | ชื่อตาราง (มีหรือไม่มีคำนำหน้า) |

**ผลตอบแทน:** `QueryBuilder` - อินสแตนซ์ตัวสร้างแบบสอบถาม

**ตัวอย่าง:**
```php
$query = QueryBuilder::table('users');
$query = QueryBuilder::table('xoops_users'); // With prefix
```
## SELECT แบบสอบถาม

### เลือก

ระบุคอลัมน์ที่จะเลือก
```php
public function select(...$columns): self
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `...$columns` | อาร์เรย์ | ชื่อคอลัมน์หรือนิพจน์ |

**ผลตอบแทน:** `self` - สำหรับการเชื่อมโยงเมธอด

**ตัวอย่าง:**
```php
// Simple select
QueryBuilder::table('users')
    ->select('id', 'username', 'email')
    ->get();

// Select with aliases
QueryBuilder::table('users')
    ->select('id as user_id', 'username as name')
    ->get();

// Select all columns
QueryBuilder::table('users')
    ->select('*')
    ->get();

// Select with expressions
QueryBuilder::table('orders')
    ->select('id', 'COUNT(*) as total_items')
    ->groupBy('id')
    ->get();
```
###ที่ไหน

เพิ่มเงื่อนไข WHERE
```php
public function where(string $column, string $operator = '=', mixed $value = null): self
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$column` | สตริง | ชื่อคอลัมน์ |
| `$operator` | สตริง | ตัวดำเนินการเปรียบเทียบ |
| `$value` | ผสม | ค่าที่จะเปรียบเทียบ |

**ผลตอบแทน:** `self` - สำหรับการเชื่อมโยงเมธอด

**ผู้ประกอบการ:**

| ตัวดำเนินการ | คำอธิบาย | ตัวอย่าง |
|----------|-------------|---------|
| `=` | เท่ากับ | `->where('status', '=', 'active')` |
| `!=` หรือ `<>` | ไม่เท่ากับ | `->where('status', '!=', 'deleted')` |
| `>` | มากกว่า | `->where('price', '>', 100)` |
| `<` | น้อยกว่า | `->where('price', '<', 100)` |
| `>=` | มากกว่าหรือเท่ากับ | `->where('age', '>=', 18)` |
| `<=` | น้อยกว่าหรือเท่ากับ | `->where('age', '<=', 65)` |
| `LIKE` | จับคู่รูปแบบ | `->where('name', 'LIKE', '%john%')` |
| `IN` | ในรายการ | `->where('status', 'IN', ['active', 'pending'])` |
| `NOT IN` | ไม่อยู่ในรายการ | `->where('id', 'NOT IN', [1, 2, 3])` |
| `BETWEEN` | พิสัย | `->where('age', 'BETWEEN', [18, 65])` |
| `IS NULL` | เป็นโมฆะ | `->where('deleted_at', 'IS NULL')` |
| `IS NOT NULL` | ไม่เป็นโมฆะ | `->where('deleted_at', 'IS NOT NULL')` |

**ตัวอย่าง:**
```php
// Single condition
QueryBuilder::table('users')
    ->select('*')
    ->where('status', '=', 'active')
    ->get();

// Multiple conditions (AND)
QueryBuilder::table('users')
    ->select('*')
    ->where('status', '=', 'active')
    ->where('age', '>=', 18)
    ->get();

// IN operator
QueryBuilder::table('products')
    ->select('*')
    ->where('category_id', 'IN', [1, 2, 3])
    ->get();

// LIKE operator
QueryBuilder::table('users')
    ->select('*')
    ->where('email', 'LIKE', '%@example.com')
    ->get();

// NULL check
QueryBuilder::table('users')
    ->select('*')
    ->where('deleted_at', 'IS NULL')
    ->get();
```
### หรือที่ไหน

เพิ่มเงื่อนไข OR
```php
public function orWhere(string $column, string $operator = '=', mixed $value = null): self
```
**ตัวอย่าง:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->where('status', '=', 'active')
    ->orWhere('premium', '=', 1)
    ->get();
    // SELECT * FROM users WHERE status = 'active' OR premium = 1
```
### WhereIn / WhereNotIn

วิธีการที่สะดวกสำหรับ IN/¤NOT IN
```php
public function whereIn(string $column, array $values): self
public function whereNotIn(string $column, array $values): self
```
**ตัวอย่าง:**
```php
QueryBuilder::table('posts')
    ->select('*')
    ->whereIn('status', ['published', 'scheduled'])
    ->get();

QueryBuilder::table('comments')
    ->select('*')
    ->whereNotIn('spam_score', [8, 9, 10])
    ->get();
```
### โดยที่ Null / โดยที่ NotNull

วิธีการที่สะดวกสบายสำหรับการตรวจสอบ NULL
```php
public function whereNull(string $column): self
public function whereNotNull(string $column): self
```
**ตัวอย่าง:**
```php
QueryBuilder::table('users')
    ->select('*')
    ->whereNotNull('verified_at')
    ->get();
```
###อยู่ที่ไหนระหว่าง

ตรวจสอบว่าค่าอยู่ระหว่างสองค่าหรือไม่
```php
public function whereBetween(string $column, array $values): self
```
**ตัวอย่าง:**
```php
QueryBuilder::table('products')
    ->select('*')
    ->whereBetween('price', [10, 100])
    ->get();

QueryBuilder::table('orders')
    ->select('*')
    ->whereBetween('created_at', ['2024-01-01', '2024-12-31'])
    ->get();
```
### เข้าร่วม

เพิ่ม INNER JOIN
```php
public function join(
    string $table,
    string $first,
    string $operator = '=',
    string $second = null
): self
```
**ตัวอย่าง:**
```php
QueryBuilder::table('posts')
    ->select('posts.*', 'users.username', 'categories.name')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->join('categories', 'posts.category_id', '=', 'categories.id')
    ->where('posts.published', '=', 1)
    ->get();
```
### ซ้ายเข้าร่วม / ขวาเข้าร่วม

ประเภทการรวมทางเลือก
```php
public function leftJoin(
    string $table,
    string $first,
    string $operator = '=',
    string $second = null
): self

public function rightJoin(
    string $table,
    string $first,
    string $operator = '=',
    string $second = null
): self
```
**ตัวอย่าง:**
```php
QueryBuilder::table('users')
    ->select('users.*', 'COUNT(posts.id) as post_count')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->groupBy('users.id')
    ->get();
```
### กลุ่มโดย

จัดกลุ่มผลลัพธ์ตามคอลัมน์
```php
public function groupBy(...$columns): self
```
**ตัวอย่าง:**
```php
QueryBuilder::table('orders')
    ->select('user_id', 'COUNT(*) as order_count', 'SUM(total) as total_spent')
    ->groupBy('user_id')
    ->get();

QueryBuilder::table('sales')
    ->select('department', 'region', 'SUM(amount) as total')
    ->groupBy('department', 'region')
    ->get();
```
### มี

เพิ่มเงื่อนไข HAVING
```php
public function having(string $column, string $operator = '=', mixed $value = null): self
```
**ตัวอย่าง:**
```php
QueryBuilder::table('orders')
    ->select('user_id', 'COUNT(*) as order_count')
    ->groupBy('user_id')
    ->having('order_count', '>', 5)
    ->get();
```
### สั่งซื้อโดย

ผลการสั่งซื้อ.
```php
public function orderBy(string $column, string $direction = 'ASC'): self
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$column` | สตริง | คอลัมน์เรียงลำดับโดย |
| `$direction` | สตริง | `ASC` หรือ `DESC` |

**ตัวอย่าง:**
```php
// Single order
QueryBuilder::table('users')
    ->select('*')
    ->orderBy('created_at', 'DESC')
    ->get();

// Multiple orders
QueryBuilder::table('posts')
    ->select('*')
    ->orderBy('category_id', 'ASC')
    ->orderBy('created_at', 'DESC')
    ->get();

// Random order
QueryBuilder::table('quotes')
    ->select('*')
    ->orderBy('RAND()')
    ->get();
```
### ขีดจำกัด / ออฟเซ็ต

ขีดจำกัดและการชดเชยผลลัพธ์
```php
public function limit(int $limit): self
public function offset(int $offset): self
```
**ตัวอย่าง:**
```php
// Simple limit
QueryBuilder::table('posts')
    ->select('*')
    ->limit(10)
    ->get();

// Pagination
$page = 2;
$perPage = 20;
$offset = ($page - 1) * $perPage;

QueryBuilder::table('posts')
    ->select('*')
    ->limit($perPage)
    ->offset($offset)
    ->get();
```
## วิธีดำเนินการ

### รับ

ดำเนินการค้นหาและส่งกลับผลลัพธ์ทั้งหมด
```php
public function get(): array
```
**ผลตอบแทน:** `array` - อาร์เรย์ของแถวผลลัพธ์

**ตัวอย่าง:**
```php
$users = QueryBuilder::table('users')
    ->select('id', 'username', 'email')
    ->where('status', '=', 'active')
    ->orderBy('username')
    ->get();

foreach ($users as $user) {
    echo $user['username'] . ' (' . $user['email'] . ')' . "\n";
}
```
###ก่อน

ได้ผลลัพธ์แรก
```php
public function first(): ?array
```
**ผลตอบแทน:** `?array` - แถวแรกหรือ null

**ตัวอย่าง:**
```php
$user = QueryBuilder::table('users')
    ->select('*')
    ->where('id', '=', 123)
    ->first();

if ($user) {
    echo 'Found: ' . $user['username'];
}
```
###สุดท้าย

รับผลลัพธ์สุดท้าย
```php
public function last(): ?array
```
**ตัวอย่าง:**
```php
$latestPost = QueryBuilder::table('posts')
    ->select('*')
    ->orderBy('created_at', 'DESC')
    ->last();
```
### นับ

รับจำนวนผลลัพธ์
```php
public function count(): int
```
**ผลตอบแทน:** `int` - จำนวนแถว

**ตัวอย่าง:**
```php
$activeUsers = QueryBuilder::table('users')
    ->where('status', '=', 'active')
    ->count();

echo "Active users: $activeUsers";
```
### มีอยู่แล้ว

ตรวจสอบว่าแบบสอบถามส่งกลับผลลัพธ์ใดๆ หรือไม่
```php
public function exists(): bool
```
**ผลตอบแทน:** `bool` - เป็นจริงหากมีผลลัพธ์อยู่

**ตัวอย่าง:**
```php
if (QueryBuilder::table('users')->where('email', '=', 'test@example.com')->exists()) {
    echo 'User already exists';
}
```
###รวมครับ

รับค่ารวม
```php
public function aggregate(string $function, string $column): mixed
```
**ตัวอย่าง:**
```php
$maxPrice = QueryBuilder::table('products')
    ->aggregate('MAX', 'price');

$avgAge = QueryBuilder::table('users')
    ->aggregate('AVG', 'age');

$totalSales = QueryBuilder::table('orders')
    ->aggregate('SUM', 'total');
```
## INSERT แบบสอบถาม

### ใส่

แทรกแถว
```php
public function insert(array $values): bool
```
**ตัวอย่าง:**
```php
QueryBuilder::table('users')->insert([
    'username' => 'john',
    'email' => 'john@example.com',
    'password' => password_hash('secret', PASSWORD_BCRYPT),
    'created_at' => date('Y-m-d H:i:s')
]);
```
### แทรกมากมาย

แทรกหลายแถว
```php
public function insertMany(array $rows): bool
```
**ตัวอย่าง:**
```php
QueryBuilder::table('log_entries')->insertMany([
    ['action' => 'login', 'user_id' => 1, 'timestamp' => time()],
    ['action' => 'logout', 'user_id' => 2, 'timestamp' => time()],
    ['action' => 'update', 'user_id' => 3, 'timestamp' => time()]
]);
```
## UPDATE แบบสอบถาม

### อัปเดต

อัพเดตแถว
```php
public function update(array $values): int
```
**ผลตอบแทน:** `int` - จำนวนแถวที่ได้รับผลกระทบ

**ตัวอย่าง:**
```php
// Update single user
QueryBuilder::table('users')
    ->where('id', '=', 123)
    ->update([
        'email' => 'newemail@example.com',
        'updated_at' => date('Y-m-d H:i:s')
    ]);

// Update multiple rows
QueryBuilder::table('posts')
    ->where('status', '=', 'draft')
    ->where('created_at', '<', date('Y-m-d', strtotime('-30 days')))
    ->update([
        'status' => 'archived'
    ]);
```
### เพิ่มขึ้น/ลดลง

เพิ่มหรือลดคอลัมน์
```php
public function increment(string $column, int $amount = 1): int
public function decrement(string $column, int $amount = 1): int
```
**ตัวอย่าง:**
```php
// Increment view count
QueryBuilder::table('posts')
    ->where('id', '=', 123)
    ->increment('views');

// Decrement stock
QueryBuilder::table('products')
    ->where('id', '=', 456)
    ->decrement('stock', 5);
```
## DELETE แบบสอบถาม

### ลบ

ลบแถว
```php
public function delete(): int
```
**ผลตอบแทน:** `int` - จำนวนแถวที่ถูกลบ

**ตัวอย่าง:**
```php
// Delete single record
QueryBuilder::table('comments')
    ->where('id', '=', 789)
    ->delete();

// Delete multiple records
QueryBuilder::table('log_entries')
    ->where('created_at', '<', date('Y-m-d', strtotime('-30 days')))
    ->delete();
```
### ตัดทอน

ลบแถวทั้งหมดออกจากตาราง
```php
public function truncate(): bool
```
**ตัวอย่าง:**
```php
// Clear all sessions
QueryBuilder::table('sessions')->truncate();
```
## คุณสมบัติขั้นสูง

### การแสดงออกแบบดิบ
```php
QueryBuilder::table('products')
    ->select('id', 'name', QueryBuilder::raw('price * quantity as total'))
    ->get();
```
### คำถามย่อย
```php
$recentPostIds = QueryBuilder::table('posts')
    ->select('id')
    ->where('created_at', '>', date('Y-m-d', strtotime('-7 days')))
    ->toSql();

$comments = QueryBuilder::table('comments')
    ->select('*')
    ->whereIn('post_id', $recentPostIds)
    ->get();
```
### รับ SQL
```php
public function toSql(): string
```
**ตัวอย่าง:**
```php
$sql = QueryBuilder::table('users')
    ->select('id', 'username')
    ->where('status', '=', 'active')
    ->toSql();

echo $sql;
// SELECT id, username FROM xoops_users WHERE status = ?
```
## ตัวอย่างที่สมบูรณ์

### เลือกแบบซับซ้อนพร้อมการรวม
```php
<?php
/**
 * Get posts with author and category info
 */

$posts = QueryBuilder::table('posts')
    ->select(
        'posts.id',
        'posts.title',
        'posts.content',
        'posts.created_at',
        'users.username as author',
        'categories.name as category'
    )
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->join('categories', 'posts.category_id', '=', 'categories.id')
    ->where('posts.published', '=', 1)
    ->orderBy('posts.created_at', 'DESC')
    ->limit(10)
    ->get();

foreach ($posts as $post) {
    echo '<article>';
    echo '<h2>' . htmlspecialchars($post['title']) . '</h2>';
    echo '<p class="meta">By ' . htmlspecialchars($post['author']) . ' in ' . htmlspecialchars($post['category']) . '</p>';
    echo '<p>' . htmlspecialchars($post['content']) . '</p>';
    echo '</article>';
}
```
### การแบ่งหน้าด้วย QueryBuilder
```php
<?php
/**
 * Paginated results
 */

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$perPage = 20;
$offset = ($page - 1) * $perPage;

// Get total count
$total = QueryBuilder::table('articles')
    ->where('status', '=', 'published')
    ->count();

// Get page results
$articles = QueryBuilder::table('articles')
    ->select('*')
    ->where('status', '=', 'published')
    ->orderBy('created_at', 'DESC')
    ->limit($perPage)
    ->offset($offset)
    ->get();

// Calculate pagination
$pages = ceil($total / $perPage);

// Display results
foreach ($articles as $article) {
    echo '<div class="article">' . htmlspecialchars($article['title']) . '</div>';
}

// Display pagination links
if ($pages > 1) {
    echo '<nav class="pagination">';
    for ($i = 1; $i <= $pages; $i++) {
        if ($i == $page) {
            echo '<span class="current">' . $i . '</span>';
        } else {
            echo '<a href="?page=' . $i . '">' . $i . '</a>';
        }
    }
    echo '</nav>';
}
```
### การวิเคราะห์ข้อมูลด้วยมวลรวม
```php
<?php
/**
 * Sales analysis
 */

// Total sales by region
$regionSales = QueryBuilder::table('orders')
    ->select('region', QueryBuilder::raw('SUM(total) as total_sales'), QueryBuilder::raw('COUNT(*) as order_count'))
    ->groupBy('region')
    ->orderBy('total_sales', 'DESC')
    ->get();

foreach ($regionSales as $region) {
    echo $region['region'] . ': $' . number_format($region['total_sales'], 2) . ' (' . $region['order_count'] . ' orders)' . "\n";
}

// Average order value
$avgOrderValue = QueryBuilder::table('orders')
    ->aggregate('AVG', 'total');

echo 'Average order value: $' . number_format($avgOrderValue, 2);
```
## แนวทางปฏิบัติที่ดีที่สุด

1. **ใช้การสืบค้นแบบกำหนดพารามิเตอร์** - QueryBuilder จัดการการรวมพารามิเตอร์โดยอัตโนมัติ
2. **Chain Methods** - ใช้ประโยชน์จากอินเทอร์เฟซที่คล่องแคล่วสำหรับโค้ดที่อ่านได้
3. **ทดสอบ SQL เอาต์พุต** - ใช้ `toSql()`¤ เพื่อยืนยันคำค้นหาที่สร้างขึ้น
4. **ใช้ดัชนี** - ตรวจสอบให้แน่ใจว่าคอลัมน์ที่มีการสืบค้นบ่อยได้รับการจัดทำดัชนีแล้ว
5. **จำกัดผลลัพธ์** - ใช้ `limit()` สำหรับชุดข้อมูลขนาดใหญ่เสมอ
6. **ใช้ Aggregates** - ให้ฐานข้อมูลทำการนับ/สรุปแทน PHP
7. **Escape Output** - หลีกเลี่ยงข้อมูลที่แสดงด้วย `htmlspecialchars()` เสมอ
8. **ดัชนีประสิทธิภาพ** - ตรวจสอบการสืบค้นที่ช้าและปรับให้เหมาะสมตามนั้น

## เอกสารที่เกี่ยวข้อง

- XoopsDatabase - เลเยอร์ฐานข้อมูลและการเชื่อมต่อ
- เกณฑ์ - ระบบสืบค้นตามเกณฑ์เดิม
- ../Core/XoopsObject - การคงอยู่ของวัตถุข้อมูล
- ../Module/Module-System - การทำงานของฐานข้อมูลโมดูล

---

*ดูเพิ่มเติมที่: [¤XOOPS ฐานข้อมูล API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*