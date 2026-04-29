---
title: "データベース操作"
---

## 概要

XOOPS はレガシーの手続き型パターンと最新のオブジェクト指向アプローチの両方をサポートするデータベース抽象化レイヤーを提供します。このガイドではモジュール開発の一般的なデータベース操作をカバーしています。

## データベース接続

### データベースインスタンスの取得

```php
// レガシーアプローチ
global $xoopsDB;

// ヘルパー経由の最新アプローチ
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// XMF ヘルパー経由
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## 基本操作

### SELECT クエリ

```php
// シンプルなクエリ
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE status = 1";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo $row['title'];
}

// パラメーター付き (安全なアプローチ)
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);

// 単一行
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = " . intval($id);
$result = $db->query($sql);
$row = $db->fetchArray($result);
```

### INSERT 操作

```php
// 基本的な挿入
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);

// 最後に挿入された ID を取得
$newId = $db->getInsertId();
```

### UPDATE 操作

```php
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    time(),
    intval($id)
);
$db->queryF($sql);

// 影響を受けた行を確認
$affectedRows = $db->getAffectedRows();
```

### DELETE 操作

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## Criteria の使用

Criteria システムはタイプセーフなクエリ構築方法を提供します。

```php
use Criteria;
use CriteriaCompo;

// シンプルな基準
$criteria = new Criteria('status', 1);
$items = $itemHandler->getObjects($criteria);

// 複合基準
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

### Criteria オペレーター

| オペレーター | 説明 |
|----------|-------------|
| `=` | 等しい (デフォルト) |
| `!=` | 等しくない |
| `<` | より小さい |
| `>` | より大きい |
| `<=` | 以下 |
| `>=` | 以上 |
| `LIKE` | パターンマッチング |
| `IN` | 値のセット内 |

```php
// LIKE 基準
$criteria = new Criteria('title', '%search%', 'LIKE');

// IN 基準
$criteria = new Criteria('id', '(1,2,3)', 'IN');

// 日付範囲
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('created', $startDate, '>='));
$criteria->add(new Criteria('created', $endDate, '<='));
```

## オブジェクトハンドラー

### ハンドラーメソッド

```php
$handler = xoops_getModuleHandler('item', 'mymodule');

// 新しいオブジェクトを作成
$item = $handler->create();

// ID で取得
$item = $handler->get($id);

// 複数を取得
$items = $handler->getObjects($criteria);

// 配列として取得
$items = $handler->getAll($criteria);

// カウント
$count = $handler->getCount($criteria);

// 保存
$success = $handler->insert($item);

// 削除
$success = $handler->delete($item);
```

### カスタムハンドラーメソッド

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

## トランザクション

```php
// トランザクションを開始
$db->query('START TRANSACTION');

try {
    // 複数の操作を実行
    $db->queryF($sql1);
    $db->queryF($sql2);
    $db->queryF($sql3);

    // すべてが成功した場合にコミット
    $db->query('COMMIT');
} catch (\Exception $e) {
    // エラー時にロールバック
    $db->query('ROLLBACK');
    throw $e;
}
```

## プリペアドステートメント (最新)

```php
// XOOPS データベースレイヤー経由の PDO を使用
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## スキーマ管理

### テーブルの作成

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

### マイグレーション

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

## ベストプラクティス

1. **文字列を常にクォート** - ユーザー入力は `$db->quoteString()` を使用
2. **Intval を使用** - 整数型を `intval()` または型宣言でキャスト
3. **ハンドラーを優先** - 可能な場合は生 SQL ではなくオブジェクトハンドラーを使用
4. **Criteria を使用** - タイプセーフのため Criteria でクエリを構築
5. **エラーを処理** - 戻り値をチェックして失敗を処理
6. **トランザクションを使用** - 関連する操作をトランザクションでラップ

## 関連ドキュメント

- ../04-API-Reference/Kernel/Criteria - Criteria でのクエリ構築
- ../04-API-Reference/Core/XoopsObjectHandler - ハンドラーパターン
- ../02-Core-Concepts/Database/Database-Layer - データベース抽象化
- Database/Database-Schema - スキーマ設計ガイド
