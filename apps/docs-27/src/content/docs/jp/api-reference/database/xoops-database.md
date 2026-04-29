---
title: "XoopsDatabaseクラス"
description: "接続管理、クエリ実行、結果処理を提供するデータベース抽象化レイヤー"
---

`XoopsDatabase`クラスはXOOPSのデータベース抽象化レイヤーを提供し、接続管理、クエリ実行、結果処理、エラー処理を処理します。ドライバーアーキテクチャを通じて複数のデータベースドライバをサポートします。

## クラス概要

```php
namespace Xoops\Database;

abstract class XoopsDatabase
{
    protected $conn;
    protected $prefix;
    protected $logger;

    abstract public function connect(bool $selectdb = true): bool;
    abstract public function query(string $sql, int $limit = 0, int $start = 0);
    abstract public function fetchArray($result): ?array;
    abstract public function fetchObject($result): ?object;
    abstract public function getRowsNum($result): int;
    abstract public function getAffectedRows(): int;
    abstract public function getInsertId(): int;
    abstract public function escape(string $string): string;
}
```

## クラス階層

```
XoopsDatabase (抽象基底)
├── XoopsMySQLDatabase (MySQLエクステンション)
│   └── XoopsMySQLDatabaseProxy (セキュリティプロキシ)
└── XoopsMySQLiDatabase (MySQLiエクステンション)
    └── XoopsMySQLiDatabaseProxy (セキュリティプロキシ)

XoopsDatabaseFactory
└── 適切なドライバインスタンスを作成
```

## データベースインスタンスの取得

### ファクトリを使用

```php
// 推奨: ファクトリを使用
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### getInstanceを使用

```php
// 代替: 直接シングルトンアクセス
$db = XoopsDatabase::getInstance();
```

### グローバル変数

```php
// レガシー: グローバル変数を使用
global $xoopsDB;
```

## コアメソッド

### connect

データベース接続を確立します。

```php
abstract public function connect(bool $selectdb = true): bool
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$selectdb` | bool | データベースを選択するかどうか |

**戻り値:** `bool` - 接続成功時はTrue

**例:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "接続成功";
}
```

---

### query

SQLクエリを実行します。

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$sql` | string | SQLクエリ文字列 |
| `$limit` | int | 返す最大行数 (0 = 制限なし) |
| `$start` | int | 開始オフセット |

**戻り値:** `resource|bool` - 結果リソースまたは失敗時はFalse

**例:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// シンプルなクエリ
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid > 0";
$result = $db->query($sql);

// LIMITを付けたクエリ
$sql = "SELECT * FROM " . $db->prefix('users');
$result = $db->query($sql, 10, 0); // 最初の10行

// オフセット付きクエリ
$result = $db->query($sql, 10, 20); // 20行目から10行
```

---

### queryF

クエリを強制実行します (セキュリティチェックをバイパス)。

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**ユースケース:**
- INSERT、UPDATE、DELETE操作
- 読み取り専用制限をバイパスする必要がある場合

**例:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

### prefix

データベーステーブルプレフィックスを追加します。

```php
public function prefix(string $table = ''): string
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$table` | string | プレフィックスなしのテーブル名 |

**戻り値:** `string` - プレフィックス付きのテーブル名

**例:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (プレフィックスが "xoops_" の場合)
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (プレフィックスのみ)
```

---

### fetchArray

結果行を連想配列として取得します。

```php
abstract public function fetchArray($result): ?array
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$result` | resource | クエリ結果リソース |

**戻り値:** `array|null` - 連想配列または行がない場合はnull

**例:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "ユーザー: " . $row['uname'] . "\n";
    echo "メール: " . $row['email'] . "\n";
}
```

---

### fetchObject

結果行をオブジェクトとして取得します。

```php
abstract public function fetchObject($result): ?object
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$result` | resource | クエリ結果リソース |

**戻り値:** `object|null` - 各列がプロパティのオブジェクト

**例:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "ユーザー名: " . $user->uname;
    echo "メール: " . $user->email;
}
```

---

### fetchRow

結果行を数値配列として取得します。

```php
abstract public function fetchRow($result): ?array
```

**例:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "ユーザー名: " . $row[0] . ", メール: " . $row[1];
}
```

---

### fetchBoth

結果行を連想配列と数値配列の両方として取得します。

```php
abstract public function fetchBoth($result): ?array
```

**例:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // 名前でアクセス
echo $row[0];        // インデックスでアクセス
```

---

### getRowsNum

結果セット内の行数を取得します。

```php
abstract public function getRowsNum($result): int
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$result` | resource | クエリ結果リソース |

**戻り値:** `int` - 行数

**例:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "アクティブなユーザーが見つかりました: $count";
```

---

### getAffectedRows

最後のクエリで影響を受けた行数を取得します。

```php
abstract public function getAffectedRows(): int
```

**戻り値:** `int` - 影響を受けた行数

**例:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "更新した行: $affected";
```

---

### getInsertId

最後のINSERTで自動生成されたIDを取得します。

```php
abstract public function getInsertId(): int
```

**戻り値:** `int` - 最後のINSERT ID

**例:**
```php
$sql = sprintf(
    "INSERT INTO %s (title, content) VALUES (%s, %s)",
    $db->prefix('articles'),
    $db->quoteString($title),
    $db->quoteString($content)
);
$db->queryF($sql);
$newId = $db->getInsertId();
echo "記事を作成しました ID: $newId";
```

---

### escape

SQLクエリで安全に使用するための文字列をエスケープします。

```php
abstract public function escape(string $string): string
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$string` | string | エスケープする文字列 |

**戻り値:** `string` - エスケープされた文字列 (クォートなし)

**例:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

SQLのための文字列をエスケープしてクォートします。

```php
public function quoteString(string $string): string
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$string` | string | クォートする文字列 |

**戻り値:** `string` - エスケープされてクォートされた文字列

**例:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### freeRecordSet

結果に関連するメモリを解放します。

```php
abstract public function freeRecordSet($result): void
```

**例:**
```php
$result = $db->query($sql);
// 結果を処理...
$db->freeRecordSet($result);  // メモリを解放
```

---

## エラー処理

### error

最後のエラーメッセージを取得します。

```php
abstract public function error(): string
```

**例:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "データベースエラー: " . $db->error();
}
```

---

### errno

最後のエラー番号を取得します。

```php
abstract public function errno(): int
```

**例:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "エラー #" . $db->errno() . ": " . $db->error();
}
```

---

## プリペアドステートメント (MySQLi)

MySQLiドライバはセキュリティを強化するためのプリペアドステートメントをサポートしています。

### prepare

プリペアドステートメントを作成します。

```php
public function prepare(string $sql): mysqli_stmt|false
```

**例:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = ?";
$stmt = $db->prepare($sql);

$stmt->bind_param('i', $userId);
$userId = 5;
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    echo $row['uname'];
}
$stmt->close();
```

### 複数パラメータを使用したプリペアドステートメント

```php
$sql = "INSERT INTO " . $db->prefix('articles') . " (title, content, author_id) VALUES (?, ?, ?)";
$stmt = $db->prepare($sql);

$stmt->bind_param('ssi', $title, $content, $authorId);

$title = "My Article";
$content = "Article content here";
$authorId = 1;

if ($stmt->execute()) {
    echo "記事を作成しました ID: " . $stmt->insert_id;
}

$stmt->close();
```

---

## トランザクションサポート

### beginTransaction

トランザクションを開始します。

```php
public function beginTransaction(): bool
```

### commit

現在のトランザクションをコミットします。

```php
public function commit(): bool
```

### rollback

現在のトランザクションをロールバックします。

```php
public function rollback(): bool
```

**例:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

try {
    $db->beginTransaction();

    // 複数の操作
    $sql1 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance - 100 WHERE id = 1";
    $db->queryF($sql1);

    $sql2 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance + 100 WHERE id = 2";
    $db->queryF($sql2);

    // エラーをチェック
    if ($db->errno()) {
        throw new Exception($db->error());
    }

    $db->commit();
    echo "トランザクションが完了しました";

} catch (Exception $e) {
    $db->rollback();
    echo "トランザクション失敗: " . $e->getMessage();
}
```

---

## 完全な使用例

### 基本的なCRUD操作

```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// CREATE (作成)
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('articles'),
    $db->quoteString('New Article'),
    $db->quoteString('Article content'),
    time()
);
$db->queryF($sql);
$articleId = $db->getInsertId();

// READ (読み取り)
$sql = "SELECT * FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$result = $db->query($sql);
$article = $db->fetchArray($result);

// UPDATE (更新)
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('articles'),
    $db->quoteString('Updated Title'),
    time(),
    $articleId
);
$db->queryF($sql);

// DELETE (削除)
$sql = "DELETE FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$db->queryF($sql);
```

### ページネーションクエリ

```php
function getArticles(int $page = 1, int $perPage = 10): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();
    $start = ($page - 1) * $perPage;

    // 合計数を取得
    $sql = "SELECT COUNT(*) as total FROM " . $db->prefix('articles') . " WHERE published = 1";
    $result = $db->query($sql);
    $row = $db->fetchArray($result);
    $total = $row['total'];

    // 結果ページを取得
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE published = 1 ORDER BY created DESC";
    $result = $db->query($sql, $perPage, $start);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return [
        'articles' => $articles,
        'total' => $total,
        'pages' => ceil($total / $perPage),
        'current' => $page
    ];
}
```

### LIKEを使用した検索クエリ

```php
function searchArticles(string $keyword): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $keyword = $db->escape($keyword);
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE title LIKE '%" . $keyword . "%'" .
           " OR content LIKE '%" . $keyword . "%'" .
           " ORDER BY created DESC";

    $result = $db->query($sql, 50);  // 最大50件に制限

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

### JOINクエリ

```php
function getArticlesWithAuthors(): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $sql = "SELECT a.*, u.uname as author_name, u.email as author_email
            FROM " . $db->prefix('articles') . " a
            LEFT JOIN " . $db->prefix('users') . " u ON a.author_id = u.uid
            WHERE a.published = 1
            ORDER BY a.created DESC";

    $result = $db->query($sql, 20);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

---

## SqlUtilityクラス

SQLファイル操作用のヘルパークラス。

### splitMySqlFile

SQLファイルを個別のクエリに分割します。

```php
public static function splitMySqlFile(string $content): array
```

**例:**
```php
$sqlContent = file_get_contents('install.sql');
$queries = SqlUtility::splitMySqlFile($sqlContent);

foreach ($queries as $query) {
    $db->queryF($query);
    if ($db->errno()) {
        echo "実行エラー: " . $query . "\n";
        echo "エラー: " . $db->error() . "\n";
    }
}
```

### prefixQuery

テーブルプレースホルダーをプレフィックス付きテーブル名に置き換えます。

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**例:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## ベストプラクティス

### セキュリティ

1. **常にユーザー入力をエスケープ**:
```php
$safe = $db->escape($_POST['input']);
```

2. **利用可能な場合はプリペアドステートメントを使用**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **値にquoteStringを使用**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### パフォーマンス

1. **大きなテーブルには常にLIMITを使用**:
```php
$result = $db->query($sql, 100);  // 結果を制限
```

2. **完了したら結果セットを解放**:
```php
$db->freeRecordSet($result);
```

3. **テーブル定義に適切なインデックスを使用**

4. **可能な場合は生SQLより ハンドラーを優先**

### エラー処理

1. **常にエラーをチェック**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **複数の関連操作にはトランザクションを使用**:
```php
$db->beginTransaction();
// ... 操作 ...
$db->commit();  // または $db->rollback();
```

## 関連ドキュメンテーション

- Criteria - クエリ条件システム
- QueryBuilder - 流暢なクエリ構築
- ../Core/XoopsObjectHandler - オブジェクト永続化

---

*参照: [XOOPSソースコード](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*
