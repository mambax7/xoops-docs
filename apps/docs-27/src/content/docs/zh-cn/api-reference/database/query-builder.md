---
title：“XOOPS查询生成器”
description：“现代流畅的查询构建器API，用于使用可链接接口构建SELECT、INSERT、UPDATE、DELETE查询”
---

XOOPS查询生成器提供了一个现代、流畅的界面来构建SQL查询。它有助于防止SQL注入，提高可读性，并为多个数据库系统提供数据库抽象。

## 查询生成器架构

```mermaid
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

## 查询生成器类

具有流畅界面的主要查询构建器类。

### 班级概览

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

### 静态方法

####表

为表创建新的查询生成器。

```php
public static function table(string $table): QueryBuilder
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$table`|字符串|表名（带或不带前缀） |

**返回：** `QueryBuilder` - 查询构建器实例

**示例：**
```php
$query = QueryBuilder::table('users');
$query = QueryBuilder::table('xoops_users'); // With prefix
```

## SELECT 查询

### 选择

指定要选择的列。

```php
public function select(...$columns): self
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `...$columns` |数组|列名或表达式 |

**返回：** `self` - 用于方法链接

**示例：**
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

### 哪里

添加 WHERE 条件。

```php
public function where(string $column, string $operator = '=', mixed $value = null): self
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$column`|字符串|栏目名称 |
| `$operator` |字符串|比较运算符 |
| `$value` |混合 |比较价值|

**返回：** `self` - 用于方法链接

**运营商：**

|操作员|描述 |示例|
|----------|-------------|---------|
| `=` |平等| `->where('status', '=', 'active')` |
| `!=` 或 `<>` |不等于| `->where('status', '!=', 'deleted')`|
| `>` |大于 | `->where('price', '>', 100)`|
| `<`|小于| `->where('price', '<', 100)` |
| `>=` |大于或等于 | `->where('age', '>=', 18)` |
| `<=` |小于或等于 | `->where('age', '<=', 65)`|
| `LIKE`|模式匹配| `->where('name', 'LIKE', '%john%')`|
| `IN` |在列表中 | `->where('status', 'IN', ['active', 'pending'])`|
| `NOT IN` |不在列表中 | `->where('id', 'NOT IN', [1, 2, 3])`|
| `BETWEEN`|范围 | `->where('age', 'BETWEEN', [18, 65])`|
| `IS NULL`|为空 | `->where('deleted_at', 'IS NULL')` |
| `IS NOT NULL` |不为空 | `->where('deleted_at', 'IS NOT NULL')`|

**示例：**
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

### 或者哪里

添加 OR 条件。

```php
public function orWhere(string $column, string $operator = '=', mixed $value = null): self
```

**示例：**
```php
QueryBuilder::table('users')
    ->select('*')
    ->where('status', '=', 'active')
    ->orWhere('premium', '=', 1)
    ->get();
    // SELECT * FROM users WHERE status = 'active' OR premium = 1
```

### whereIn / whereNotIn

IN/NOT IN 的便捷方法。

```php
public function whereIn(string $column, array $values): self
public function whereNotIn(string $column, array $values): self
```

**示例：**
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

### whereNull / whereNotNull

NULL检查的便捷方法。

```php
public function whereNull(string $column): self
public function whereNotNull(string $column): self
```

**示例：**
```php
QueryBuilder::table('users')
    ->select('*')
    ->whereNotNull('verified_at')
    ->get();
```

### 之间

检查值是否在两个值之间。

```php
public function whereBetween(string $column, array $values): self
```

**示例：**
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

###加入

添加 INNER JOIN。

```php
public function join(
    string $table,
    string $first,
    string $operator = '=',
    string $second = null
): self
```

**示例：**
```php
QueryBuilder::table('posts')
    ->select('posts.*', 'users.username', 'categories.name')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->join('categories', 'posts.category_id', '=', 'categories.id')
    ->where('posts.published', '=', 1)
    ->get();
```

### 左连接/右连接

替代连接类型。

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

**示例：**
```php
QueryBuilder::table('users')
    ->select('users.*', 'COUNT(posts.id) as post_count')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->groupBy('users.id')
    ->get();
```

### 分组依据

按列对结果进行分组。

```php
public function groupBy(...$columns): self
```

**示例：**
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

### 有

添加 HAVING 条件。

```php
public function having(string $column, string $operator = '=', mixed $value = null): self
```

**示例：**
```php
QueryBuilder::table('orders')
    ->select('user_id', 'COUNT(*) as order_count')
    ->groupBy('user_id')
    ->having('order_count', '>', 5)
    ->get();
```

### 订单依据

订单结果。

```php
public function orderBy(string $column, string $direction = 'ASC'): self
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$column` |字符串|排序依据 | 列
| `$direction`|字符串| `ASC` 或 `DESC` |

**示例：**
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

### 限制/偏移

限制和抵消结果。

```php
public function limit(int $limit): self
public function offset(int $offset): self
```

**示例：**
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

## 执行方法

### 得到

执行查询并返回所有结果。

```php
public function get(): array
```

**返回：** `array` - 结果行数组

**示例：**
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

### 首先

得到第一个结果。

```php
public function first(): ?array
```

**返回：** `?array` - 第一行或空

**示例：**
```php
$user = QueryBuilder::table('users')
    ->select('*')
    ->where('id', '=', 123)
    ->first();

if ($user) {
    echo 'Found: ' . $user['username'];
}
```

### 最后

得到最后的结果。

```php
public function last(): ?array
```

**示例：**
```php
$latestPost = QueryBuilder::table('posts')
    ->select('*')
    ->orderBy('created_at', 'DESC')
    ->last();
```

### 计数

获取结果的计数。

```php
public function count(): int
```

**返回：** `int` - 行数

**示例：**
```php
$activeUsers = QueryBuilder::table('users')
    ->where('status', '=', 'active')
    ->count();

echo "Active users: $activeUsers";
```

### 存在

检查查询是否返回任何结果。

```php
public function exists(): bool
```

**返回：** `bool` - 如果结果存在则为 True

**示例：**
```php
if (QueryBuilder::table('users')->where('email', '=', 'test@example.com')->exists()) {
    echo 'User already exists';
}
```

### 聚合

获取聚合值。

```php
public function aggregate(string $function, string $column): mixed
```

**示例：**
```php
$maxPrice = QueryBuilder::table('products')
    ->aggregate('MAX', 'price');

$avgAge = QueryBuilder::table('users')
    ->aggregate('AVG', 'age');

$totalSales = QueryBuilder::table('orders')
    ->aggregate('SUM', 'total');
```

## INSERT 查询

###插入

插入一行。

```php
public function insert(array $values): bool
```**示例：**
```php
QueryBuilder::table('users')->insert([
    'username' => 'john',
    'email' => 'john@example.com',
    'password' => password_hash('secret', PASSWORD_BCRYPT),
    'created_at' => date('Y-m-d H:i:s')
]);
```

### 插入很多

插入多行。

```php
public function insertMany(array $rows): bool
```

**示例：**
```php
QueryBuilder::table('log_entries')->insertMany([
    ['action' => 'login', 'user_id' => 1, 'timestamp' => time()],
    ['action' => 'logout', 'user_id' => 2, 'timestamp' => time()],
    ['action' => 'update', 'user_id' => 3, 'timestamp' => time()]
]);
```

## UPDATE 查询

###更新

更新行。

```php
public function update(array $values): int
```

**返回：** `int` - 受影响的行数

**示例：**
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

### 递增/递减

增加或减少列。

```php
public function increment(string $column, int $amount = 1): int
public function decrement(string $column, int $amount = 1): int
```

**示例：**
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

## DELETE 查询

###删除

删除行。

```php
public function delete(): int
```

**返回：** `int` - 已删除的行数

**示例：**
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

### 截断

删除表中的所有行。

```php
public function truncate(): bool
```

**示例：**
```php
// Clear all sessions
QueryBuilder::table('sessions')->truncate();
```

## 高级功能

### 原始表达式

```php
QueryBuilder::table('products')
    ->select('id', 'name', QueryBuilder::raw('price * quantity as total'))
    ->get();
```

### 子查询

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

### 获取SQL

```php
public function toSql(): string
```

**示例：**
```php
$sql = QueryBuilder::table('users')
    ->select('id', 'username')
    ->where('status', '=', 'active')
    ->toSql();

echo $sql;
// SELECT id, username FROM xoops_users WHERE status = ?
```

## 完整示例

### 带有连接的复杂选择

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

### 使用 QueryBuilder 进行分页

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

### 使用聚合进行数据分析

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

## 最佳实践

1. **使用参数化查询** - QueryBuilder 自动处理参数绑定
2. **链方法** - 利用流畅的接口来获得可读的代码
3. **测试SQL输出** - 使用`toSql()`验证生成的查询
4. **使用索引** - 确保经常查询的列被索引
5. **限制结果** - 对于大型数据集始终使用 `limit()`
6. **使用聚合** - 让数据库执行counting/summing而不是PHP
7. **转义输出** - 始终使用 `htmlspecialchars()` 转义显示的数据
8. **索引性能** - 监控慢速查询并进行相应优化

## 相关文档

- XOOPSDatabase - 数据库层和连接
- 标准 - 旧标准-based查询系统
- ../Core/XOOPSObject - 数据对象持久性
- ../Module/Module-System - 模区块数据库操作

---

*另见：[XOOPS Database API](https://github.com/XOOPS/XOOPSCore27/tree/master/htdocs/class)*