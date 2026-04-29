---
title：“Criteria 和 CriteriaCompo 类”
description：“使用 Criteria 类构建查询和高级过滤”
---

`Criteria` 和 `CriteriaCompo` 类提供了一个流畅的对象-oriented 接口，用于构建复杂的数据库查询。这些类抽象了 SQL WHERE 子句，允许开发人员安全且可读地构造动态查询。

## 类概述

### 标准类

`Criteria` 类表示 WHERE 子句中的单个条件：

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

## 基本用法

### 简单标准

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

### 不同的运营商

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

## 构建复杂查询

### AND逻辑（默认）

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### 或逻辑

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## 与存储库模式集成

### 存储库示例

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

## 安全保障

### 自动转义

`Criteria`类自动转义值以防止SQL注入：

```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```

## API 参考

### 标准方法

|方法|描述 |返回 |
|--------|-------------|--------|
| `__construct()`|初始化标准条件 |无效|
| `render($prefix = '')` |渲染至 SQL WHERE 条款段 |字符串|
| `getColumn()`|获取列名 |字符串|
| `getValue()`|获取比较值 |混合 |
| `getOperator()` |获取比较运算符 |字符串|

### CriteriaCompo 方法

|方法|描述 |返回 |
|--------|-------------|--------|
| `__construct($logic = 'AND')` |初始化复合标准 |无效|
| `add($criteria, $logic = null)` |添加条件或嵌套复合 |无效|
| `render($prefix = '')` |渲染完成WHERE条款|字符串|
| `count()` |获取条件数量 |整数 |
| `clear()` |删除所有条件 |无效|

## 相关文档

- XOOPSDatabase - 数据库类参考
- ../../03-Module-Development/Patterns/Repository-Pattern - XOOPS 中的存储库模式
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - 服务层模式

## 版本信息

- **引入：** XOOPS 2.5.0
- **最后更新：** XOOPS 4.0
- **兼容性：** PHP 7.4+