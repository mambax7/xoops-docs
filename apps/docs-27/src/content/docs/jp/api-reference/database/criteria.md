---
title: "CriteriaおよびCriteriaCompoクラス"
description: "Criteriaクラスを使用した複雑なデータベースクエリ構築と高度なフィルタリング"
---

`Criteria`および`CriteriaCompo`クラスは、複雑なデータベースクエリを構築するための流暢なオブジェクト指向インターフェースを提供します。これらのクラスはSQL WHERE句を抽象化し、開発者が動的クエリを安全かつ読みやすく構築できるようにします。

## クラス概要

### Criteriaクラス

`Criteria`クラスはWHERE句内の単一の条件を表します：

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

## 基本的な使用方法

### 単純な条件

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// 単一の条件
$criteria = new Criteria('status', 'active');
// レンダリング: `status` = 'active'
```

### 異なる演算子

```php
// 等価性 (デフォルト)
$criteria = new Criteria('status', 'active', '=');

// 等しくない
$criteria = new Criteria('status', 'active', '<>');

// より大きい
$criteria = new Criteria('age', 18, '>');

// 以下
$criteria = new Criteria('age', 65, '<=');

// LIKE (パターンマッチング)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (複数の値)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```

## 複雑なクエリの構築

### ANDロジック (デフォルト)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// レンダリング: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### ORロジック

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## リポジトリパターンとの統合

### リポジトリの例

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

## セキュリティと安全性

### 自動エスケープ

`Criteria`クラスはSQLインジェクションを防ぐために値を自動的にエスケープします：

```php
// 安全 - 値は自動的にエスケープ
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// 安全にレンダリング: `username` = '\''; DROP TABLE users; --'
```

## APIリファレンス

### Criteriaメソッド

| メソッド | 説明 | 戻り値 |
|--------|-------------|--------|
| `__construct()` | 条件を初期化 | void |
| `render($prefix = '')` | SQL WHERE句セグメントにレンダリング | string |
| `getColumn()` | カラム名を取得 | string |
| `getValue()` | 比較値を取得 | mixed |
| `getOperator()` | 比較演算子を取得 | string |

### CriteriaCompoメソッド

| メソッド | 説明 | 戻り値 |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | 複合条件を初期化 | void |
| `add($criteria, $logic = null)` | 条件またはネストされた複合を追加 | void |
| `render($prefix = '')` | 完全なWHERE句にレンダリング | string |
| `count()` | 条件数を取得 | int |
| `clear()` | すべての条件を削除 | void |

## 関連ドキュメンテーション

- XoopsDatabase - データベースクラスリファレンス
- ../../03-Module-Development/Patterns/Repository-Pattern - XOOPSのリポジトリパターン
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - サービスレイヤーパターン

## バージョン情報

- **導入:** XOOPS 2.5.0
- **最終更新:** XOOPS 4.0
- **互換性:** PHP 7.4以上
