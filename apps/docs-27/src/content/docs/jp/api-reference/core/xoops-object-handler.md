---
title: "XoopsObjectHandlerクラス"
description: "XoopsObjectインスタンスでのCRUD操作用のベースハンドラークラスとデータベース永続化"
---

`XoopsObjectHandler`クラスとその拡張である`XoopsPersistableObjectHandler`は、`XoopsObject`インスタンスでCRUD (Create, Read, Update, Delete)操作を実行するための標準化されたインターフェースを提供します。これはData Mapperパターンを実装し、ドメインロジックをデータベースアクセスから分離します。

## クラス概要

```php
namespace Xoops\Core;

abstract class XoopsObjectHandler
{
    protected XoopsDatabase $db;

    public function __construct(XoopsDatabase $db);
    abstract public function create(bool $isNew = true);
    abstract public function get(int $id);
    abstract public function insert(XoopsObject $obj, bool $force = false): bool;
    abstract public function delete(XoopsObject $obj, bool $force = false): bool;
}
```

## クラス階層

```
XoopsObjectHandler (抽象基本)
└── XoopsPersistableObjectHandler (拡張実装)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [カスタムモジュールハンドラー]
```

## XoopsObjectHandler

### コンストラクタ

```php
public function __construct(XoopsDatabase $db)
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$db` | XoopsDatabase | データベース接続インスタンス |

**例:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### create

新しいオブジェクトインスタンスを作成します。

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$isNew` | bool | オブジェクトが新規かどうか (デフォルト: true) |

**戻り値:** `XoopsObject|null` - 新しいオブジェクトインスタンス

**例:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### get

主キーでオブジェクトを取得します。

```php
abstract public function get(int $id): ?XoopsObject
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$id` | int | 主キー値 |

**戻り値:** `XoopsObject|null` - オブジェクトインスタンスまたは見つからない場合はnull

**例:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### insert

オブジェクトをデータベースに保存します (挿入または更新)。

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$obj` | XoopsObject | 保存するオブジェクト |
| `$force` | bool | オブジェクトが変更されていなくても操作を強制 |

**戻り値:** `bool` - 成功時はtrue

**例:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'testuser');
$user->setVar('email', 'test@example.com');

if ($handler->insert($user)) {
    echo "User saved with ID: " . $user->getVar('uid');
} else {
    echo "Save failed: " . implode(', ', $user->getErrors());
}
```

---

### delete

オブジェクトをデータベースから削除します。

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$obj` | XoopsObject | 削除するオブジェクト |
| `$force` | bool | 削除を強制 |

**戻り値:** `bool` - 成功時はtrue

**例:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler`は`XoopsObjectHandler`を拡張し、クエリと一括操作用の追加メソッドを提供します。

### コンストラクタ

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$db` | XoopsDatabase | データベース接続 |
| `$table` | string | テーブル名 (プレフィックスなし) |
| `$className` | string | オブジェクトの完全なクラス名 |
| `$keyName` | string | 主キーフィールド名 |
| `$identifierName` | string | 人間が読める識別子フィールド |

**例:**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // テーブル名
            'Article',               // クラス名
            'article_id',            // 主キー
            'title'                  // 識別子フィールド
        );
    }
}
```

---

### getObjects

条件に一致する複数のオブジェクトを取得します。

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | クエリ条件 (オプション) |
| `$idAsKey` | bool | 配列キーとして主キーを使用 |
| `$asObject` | bool | オブジェクトを返す (trueの場合)、配列を返す (falseの場合) |

**戻り値:** `array` - オブジェクトまたは連想配列の配列

**例:**
```php
$handler = xoops_getHandler('user');

// すべてのアクティブなユーザーを取得
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// IDをキーとしてユーザーを取得
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // IDでアクセス

// 配列ではなくオブジェクトとして取得
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```

---

### getCount

条件に一致するオブジェクトをカウントします。

```php
public function getCount(CriteriaElement $criteria = null): int
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | クエリ条件 (オプション) |

**戻り値:** `int` - 一致するオブジェクトの数

**例:**
```php
$handler = xoops_getHandler('user');

// すべてのユーザーをカウント
$totalUsers = $handler->getCount();

// アクティブなユーザーをカウント
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total: $totalUsers, Active: $activeUsers";
```

---

### getAll

すべてのオブジェクトを取得します (条件なしのgetObjectsの別名)。

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | クエリ条件 |
| `$fields` | array | 取得する特定フィールド |
| `$asObject` | bool | オブジェクトとして返す |
| `$idAsKey` | bool | 配列キーとしてIDを使用 |

**例:**
```php
$handler = xoops_getHandler('module');

// すべてのモジュールを取得
$modules = $handler->getAll();

// 特定のフィールドのみを取得
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getIds

一致するオブジェクトの主キーのみを取得します。

```php
public function getIds(CriteriaElement $criteria = null): array
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | クエリ条件 |

**戻り値:** `array` - 主キー値の配列

**例:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - 管理者ユーザーIDの配列
```

---

### getList

ドロップダウン用のキー値リストを取得します。

```php
public function getList(CriteriaElement $criteria = null): array
```

**戻り値:** `array` - 連想配列 [id => identifier]

**例:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// select ドロップダウンの場合
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### deleteAll

条件に一致するすべてのオブジェクトを削除します。

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | 削除するオブジェクトの条件 |
| `$force` | bool | 削除を強制 |
| `$asObject` | bool | 削除前にオブジェクトを読み込む (イベントをトリガー) |

**戻り値:** `bool` - 成功時はtrue

**例:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// 特定の記事のすべてのコメントを削除
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// オブジェクト読み込みで削除 (削除イベントをトリガー)
$handler->deleteAll($criteria, true, true);
```

---

### updateAll

一致するすべてのオブジェクトのフィールド値を更新します。

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$fieldname` | string | 更新するフィールド |
| `$fieldvalue` | mixed | 新しい値 |
| `$criteria` | CriteriaElement | 更新するオブジェクトの条件 |
| `$force` | bool | 更新を強制 |

**戻り値:** `bool` - 成功時はtrue

**例:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// 著者のすべての記事をドラフトとしてマーク
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// ビューカウントを更新
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```

---

### insert (拡張)

追加機能を持つ拡張insertメソッド。

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**動作:**
- オブジェクトが新規 (`isNew() === true`): INSERT
- オブジェクトが存在する (`isNew() === false`): UPDATE
- 自動的に`cleanVars()`を呼び出します
- 新しいオブジェクトに自動インクリメントIDを設定

**例:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// 新しい記事を作成
$article = $handler->create();
$article->setVar('title', 'New Article');
$article->setVar('content', 'Content here');
$handler->insert($article);
echo "Created with ID: " . $article->getVar('article_id');

// 既存の記事を更新
$article = $handler->get(5);
$article->setVar('title', 'Updated Title');
$handler->insert($article);
```

---

## ヘルパー関数

### xoops_getHandler

コアハンドラーを取得するグローバル関数。

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$name` | string | ハンドラー名 (user, module, group等) |
| `$optional` | bool | エラーをトリガーする代わりにnullを返す |

**例:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

モジュール固有のハンドラーを取得します。

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$name` | string | ハンドラー名 |
| `$dirname` | string | モジュールディレクトリ名 |
| `$optional` | bool | 失敗時にnullを返す |

**例:**
```php
// 現在のモジュールからハンドラーを取得
$articleHandler = xoops_getModuleHandler('article');

// 特定のモジュールからハンドラーを取得
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## カスタムハンドラーの作成

### 基本的なハンドラー実装

```php
<?php
namespace XoopsModules\MyModule;

use XoopsPersistableObjectHandler;
use XoopsDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * 記事オブジェクト用ハンドラー
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
    /**
     * コンストラクタ
     */
    public function __construct(XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'mymodule_articles',
            Article::class,
            'article_id',
            'title'
        );
    }

    /**
     * 公開された記事を取得
     */
    public function getPublished(int $limit = 10, int $start = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->add(new Criteria('publish_date', time(), '<='));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * 著者別に記事を取得
     */
    public function getByAuthor(int $authorId, bool $publishedOnly = true): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('author_id', $authorId));

        if ($publishedOnly) {
            $criteria->add(new Criteria('published', 1));
        }

        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * カテゴリー別に記事を取得
     */
    public function getByCategory(int $categoryId, int $limit = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('category_id', $categoryId));
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        if ($limit > 0) {
            $criteria->setLimit($limit);
        }

        return $this->getObjects($criteria);
    }

    /**
     * 記事を検索
     */
    public function search(string $query, array $fields = ['title', 'content']): array
    {
        $criteria = new CriteriaCompo();
        $searchCriteria = new CriteriaCompo();

        foreach ($fields as $field) {
            $searchCriteria->add(
                new Criteria($field, '%' . $query . '%', 'LIKE'),
                'OR'
            );
        }

        $criteria->add($searchCriteria);
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * ビューカウント別に人気のある記事を取得
     */
    public function getPopular(int $limit = 5): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('views');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    /**
     * ビューカウントをインクリメント
     */
    public function incrementViews(int $articleId): bool
    {
        $sql = sprintf(
            "UPDATE %s SET views = views + 1 WHERE article_id = %d",
            $this->db->prefix($this->table),
            $articleId
        );

        return $this->db->queryF($sql) !== false;
    }

    /**
     * カスタム動作用にinsertをオーバーライド
     */
    public function insert(\XoopsObject $obj, bool $force = false): bool
    {
        // 更新タイムスタンプを設定
        $obj->setVar('updated', time());

        // 新規の場合、作成タイムスタンプを設定
        if ($obj->isNew()) {
            $obj->setVar('created', time());
        }

        return parent::insert($obj, $force);
    }

    /**
     * カスケード操作用にdeleteをオーバーライド
     */
    public function delete(\XoopsObject $obj, bool $force = false): bool
    {
        // 関連するコメントを削除
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```

### カスタムハンドラーの使用

```php
// ハンドラーを取得
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// 新しい記事を作成
$article = $articleHandler->create();
$article->setVars([
    'title' => 'My New Article',
    'content' => 'Article content here...',
    'author_id' => $xoopsUser->getVar('uid'),
    'category_id' => 1,
    'published' => 1,
    'publish_date' => time()
]);

if ($articleHandler->insert($article)) {
    redirect_header('article.php?id=' . $article->getVar('article_id'), 2, 'Article created');
}

// 公開された記事を取得
$articles = $articleHandler->getPublished(10);

// 記事を検索
$results = $articleHandler->search('xoops');

// 人気のある記事を取得
$popular = $articleHandler->getPopular(5);

// ビューカウントを更新
$articleHandler->incrementViews($articleId);
```

## ベストプラクティス

1. **クエリに条件を使用**: タイプセーフなクエリの場合は常にConditionオブジェクトを使用します

2. **カスタムメソッドのために拡張**: ハンドラーにドメイン固有のクエリメソッドを追加します

3. **insert/deleteをオーバーライド**: オーバーライドでカスケード操作とタイムスタンプを追加します

4. **必要に応じてトランザクションを使用**: 複雑な操作をトランザクションでラップします

5. **getListを活用**: ドロップダウン用にgetList()を使用してクエリを削減します

6. **キーをインデックス**: 条件で使用されるデータベースフィールドがインデックスされていることを確認します

7. **結果を制限**: 潜在的に大きい結果セットの場合は常にsetLimit()を使用します

## 関連ドキュメンテーション

- XoopsObject - 基本オブジェクトクラス
- ../Database/Criteria - クエリ条件構築
- ../Database/XoopsDatabase - データベース操作

---

*参照: [XOOPSソースコード](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
