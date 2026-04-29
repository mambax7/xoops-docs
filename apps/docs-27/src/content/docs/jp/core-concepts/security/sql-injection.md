---
title: "SQLインジェクション防止"
description: "データベースセキュリティプラクティスとXOOPSでのSQLインジェクション防止"
---

SQLインジェクションは最も危険で一般的なWebアプリケーション脆弱性の1つです。このガイドでは、XOOPSモジュールをSQLインジェクション攻撃から保護する方法をカバーしています。

## 関連ドキュメント

- セキュリティベストプラクティス - 包括的なセキュリティガイド
- CSRF保護 - トークンシステムとXoopsSecurityクラス
- 入力サニタイズ - MyTextSanitizerと検証

## SQLインジェクションの理解

SQLインジェクションは、ユーザー入力が適切なサニタイズやパラメータ化なしにSQLクエリに直接含められるときに発生します。

### 脆弱なコード例

```php
// 危険 - 使用しないでください
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

ユーザーがIDとして`1 OR 1=1`を渡す場合、クエリは以下になります:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

これはすべてのレコードを返します。

## パラメータ化クエリの使用

SQLインジェクションに対する最も効果的な防御はパラメータ化クエリ（準備されたステートメント）を使用することです。

### 基本的なパラメータ化クエリ

```php
// データベース接続を取得
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// 安全 - パラメータ化クエリを使用
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### 複数パラメータ

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### 名前付きパラメータ

一部のデータベース抽象化は名前付きパラメータをサポートしています:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## XoopsObjectとXoopsObjectHandlerの使用

XOOPSはCriteriaシステムを通じてSQLインジェクションを防止するのに役立つオブジェクト指向のデータベースアクセスを提供します。

### 基本的なCriteria使用

```php
// ハンドラーを取得
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Criteriaを作成
$criteria = new Criteria('category_id', (int)$categoryId);

// オブジェクトを取得 - 自動的にSQLインジェクションから安全
$items = $itemHandler->getObjects($criteria);
```

### 複数条件用のCriteriaCompo

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('category_id', (int)$categoryId));
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', (int)$userId));

// オプション: 並べ替えと制限を追加
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart(0);

$items = $itemHandler->getObjects($criteria);
```

### Criteriaオペレータ

```php
// 等号（デフォルト）
$criteria->add(new Criteria('status', 'active'));

// 不等号
$criteria->add(new Criteria('status', 'deleted', '!='));

// より大きい
$criteria->add(new Criteria('count', 100, '>'));

// 以下
$criteria->add(new Criteria('price', 50, '<='));

// LIKE（部分一致）
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));

// IN（複数値）
$criteria->add(new Criteria('id', '(' . implode(',', $ids) . ')', 'IN'));
```

### OR条件

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR条件
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## テーブルプリフィックス

常にXOOPSテーブルプリフィックスシステムを使用してください:

```php
// 正しい - プリフィックスを使用
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// また正しい
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## INSERTクエリ

### パラメータ化されたステートメントを使用

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

### XoopsObjectを使用

```php
// 新しいオブジェクトを作成
$item = $itemHandler->create();

// 値を設定 - ハンドラーが自動的にエスケープ
$item->setVar('title', $title);
$item->setVar('content', $content);
$item->setVar('uid', (int)$userId);
$item->setVar('created', time());

// 挿入
if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}
```

## UPDATEクエリ

### パラメータ化されたステートメント

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

### XoopsObjectを使用

```php
// 既存のオブジェクトを取得
$item = $itemHandler->get((int)$id);

if ($item) {
    $item->setVar('title', $title);
    $item->setVar('content', $content);
    $item->setVar('updated', time());

    $itemHandler->insert($item);
}
```

## DELETEクエリ

### パラメータ化されたステートメント

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### XoopsObjectを使用

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### Criteriaで一括削除

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## 必要な場合のエスケープ

パラメータ化されたステートメントが使用できない場合は、適切なエスケープを使用してください:

```php
// mysqli_real_escape_stringを使用
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

ただし、**常にパラメータ化されたステートメント**をエスケープより優先してください。

## 動的クエリを安全に構築

### 安全な動的列名

列名はパラメータ化できません。ホワイトリストに対して検証してください:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // デフォルトの安全な値
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### 安全な動的テーブル名

同様にテーブル名を検証してください:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### 動的WHERE句の構築

```php
$criteria = new CriteriaCompo();

// 入力に基づいて条件を追加
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

## LIKEクエリ

ワイルドカード注入を避けるためにLIKEクエリに注意してください:

```php
// 検索語の特殊文字をエスケープ
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// その後LIKEで使用
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## IN句

IN句を使用する場合は、すべての値が適切に型指定されていることを確認してください:

```php
// ユーザー入力からのIDの配列
$inputIds = $_POST['ids'] ?? [];

// サニタイズ: すべてが整数であることを確認
$safeIds = array_map('intval', $inputIds);
$safeIds = array_filter($safeIds, function($id) { return $id > 0; });

if (!empty($safeIds)) {
    $idList = implode(',', $safeIds);
    $sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
           " WHERE id IN ({$idList})";
    $result = $xoopsDB->query($sql);
}
```

またはCriteriaで:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## トランザクション安全性

複数の関連クエリを実行する場合:

```php
// トランザクションを開始
$xoopsDB->query("START TRANSACTION");

try {
    // クエリ1
    $sql1 = "INSERT INTO " . $xoopsDB->prefix('items') . " (title) VALUES (?)";
    $result1 = $xoopsDB->query($sql1, [$title]);

    if (!$result1) {
        throw new Exception('挿入に失敗しました');
    }

    $itemId = $xoopsDB->getInsertId();

    // クエリ2
    $sql2 = "INSERT INTO " . $xoopsDB->prefix('item_meta') .
            " (item_id, meta_key, meta_value) VALUES (?, ?, ?)";
    $result2 = $xoopsDB->query($sql2, [$itemId, 'author', $author]);

    if (!$result2) {
        throw new Exception('メタ挿入に失敗しました');
    }

    // コミット
    $xoopsDB->query("COMMIT");

} catch (Exception $e) {
    // エラー時はロールバック
    $xoopsDB->query("ROLLBACK");
    throw $e;
}
```

## エラーハンドリング

SQLエラーをユーザーに公開しないでください:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);

if (!$result) {
    // 実際のエラーをログに記録（デバッグ用）
    error_log('データベースエラー: ' . $xoopsDB->error());

    // ユーザーに一般的なメッセージを表示
    redirect_header('index.php', 3, 'エラーが発生しました。もう一度試してください。');
    exit();
}
```

## 回避すべき一般的な間違い

### 間違い1: 直接変数補間

```php
// 悪い
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// 良い
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### 間違い2: addslashes()の使用

```php
// 悪い - addslashesは不十分
$safe = addslashes($_GET['input']);

// 良い - パラメータ化クエリまたは適切なエスケープを使用
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### 間違い3: 数値IDを信頼

```php
// 悪い - 入力が数値と仮定
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// 良い - 明示的に整数にキャスト
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### 間違い4: セカンドオーダーインジェクション

```php
// データベースからのデータは自動的に安全ではありません
$userData = $itemHandler->get($id);
$username = $userData->getVar('username');

// 悪い - データベースからのデータを信頼
$sql = "SELECT * FROM log WHERE username = '" . $username . "'";

// 良い - 常にパラメータを使用
$sql = "SELECT * FROM log WHERE username = ?";
$result = $xoopsDB->query($sql, [$username]);
```

## セキュリティテスト

### クエリをテスト

SQLインジェクションをチェックするために、これらの入力でフォームをテストしてください:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

これらのいずれかが予期しない動作やエラーを引き起こした場合、脆弱性があります。

### 自動テスト

開発中に自動SQLインジェクションテストツールを使用してください:

- SQLMap
- Burp Suite
- OWASP ZAP

## ベストプラクティス要約

1. **常にパラメータ化クエリを使用** （準備されたステートメント）
2. **可能な場合はXoopsObject/XoopsObjectHandlerを使用**
3. **Criteriaクラスを使用してクエリを構築**
4. **列とテーブル名をホワイトリストに対して検証**
5. **数値値を明示的に型キャストする** `(int)`または`(float)`で
6. **データベースエラーをユーザーに公開しない**
7. **複数の関連クエリにはトランザクションを使用**
8. **開発中にSQLインジェクションをテスト**
9. **検索クエリのLIKEワイルドカードをエスケープ**
10. **IN句の値を個別にサニタイズ**

---

#セキュリティ #sqlインジェクション #データベース #xoops #準備されたステートメント #Criteria
