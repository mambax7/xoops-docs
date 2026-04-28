---
title: "Criteria 和 CriteriaCompo 類別"
description: "使用 Criteria 類別進行查詢構建和進階篩選"
---

`Criteria` 和 `CriteriaCompo` 類別提供流暢的物件導向介面，用於構建複雜的資料庫查詢。這些類別抽象化 SQL WHERE 子句，允許開發人員安全且可讀性地構建動態查詢。

## 類別概述

### Criteria 類別

`Criteria` 類別表示 WHERE 子句中的單一條件：

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

### 簡單條件

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

### 不同運算子

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

## 構建複雜查詢

### AND 邏輯（預設）

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### OR 邏輯

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## 與儲存庫模式整合

### 儲存庫範例

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

## 安全性和保安

### 自動逃脫

`Criteria` 類別會自動逃脫值以防止 SQL 注入：

```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```

## API 參考

### Criteria 方法

| 方法 | 描述 | 傳回值 |
|--------|-------------|--------|
| `__construct()` | 初始化條件 | void |
| `render($prefix = '')` | 呈現為 SQL WHERE 子句段落 | string |
| `getColumn()` | 取得欄位名稱 | string |
| `getValue()` | 取得比較值 | mixed |
| `getOperator()` | 取得比較運算子 | string |

### CriteriaCompo 方法

| 方法 | 描述 | 傳回值 |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | 初始化複合條件 | void |
| `add($criteria, $logic = null)` | 新增條件或嵌套複合 | void |
| `render($prefix = '')` | 呈現為完整 WHERE 子句 | string |
| `count()` | 取得條件數 | int |
| `clear()` | 移除所有條件 | void |

## 相關文件

- XoopsDatabase - 資料庫類別參考
- ../../03-Module-Development/Patterns/Repository-Pattern - XOOPS 中的儲存庫模式
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - 服務層模式

## 版本資訊

- **推出：** XOOPS 2.5.0
- **最後更新：** XOOPS 4.0
- **相容性：** PHP 7.4+
