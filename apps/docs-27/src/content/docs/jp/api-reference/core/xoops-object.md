---
title: "XoopsObjectクラス"
description: "プロパティ管理、検証、シリアル化を提供するXOOPSシステム内のすべてのデータオブジェクトの基本クラス"
---

`XoopsObject`クラスはXOOPSシステム内のすべてのデータオブジェクトの根本的な基本クラスです。オブジェクトプロパティ、検証、ダーティ追跡、シリアル化を管理するための標準化されたインターフェースを提供します。

## クラス概要

```php
namespace Xoops\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```

## クラス階層

```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [カスタムモジュールオブジェクト]
```

## プロパティ

| プロパティ | 型 | 可視性 | 説明 |
|----------|------|------------|-------------|
| `$vars` | array | protected | 変数定義と値を格納 |
| `$cleanVars` | array | protected | データベース操作用のサニタイズされた値を格納 |
| `$isNew` | bool | protected | オブジェクトが新規かどうかを示す (データベースに未保存) |
| `$errors` | array | protected | 検証とエラーメッセージを格納 |

## コンストラクタ

```php
public function __construct()
```

新しいXoopsObjectインスタンスを作成します。デフォルトではオブジェクトは新規としてマークされます。

**例:**
```php
$object = new XoopsObject();
// オブジェクトは新規で定義された変数がありません
```

## コアメソッド

### initVar

オブジェクトの変数定義を初期化します。

```php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$key` | string | 変数名 |
| `$dataType` | int | データ型定数 (データ型を参照) |
| `$value` | mixed | デフォルト値 |
| `$required` | bool | フィールドが必須かどうか |
| `$maxlength` | int | 文字列型の最大長 |
| `$options` | string | 追加オプション |

**データ型:**

| 定数 | 値 | 説明 |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | テキストボックス入力 |
| `XOBJ_DTYPE_TXTAREA` | 2 | テキスエリアコンテンツ |
| `XOBJ_DTYPE_INT` | 3 | 整数値 |
| `XOBJ_DTYPE_URL` | 4 | URL文字列 |
| `XOBJ_DTYPE_EMAIL` | 5 | メールアドレス |
| `XOBJ_DTYPE_ARRAY` | 6 | シリアル化配列 |
| `XOBJ_DTYPE_OTHER` | 7 | カスタムタイプ |
| `XOBJ_DTYPE_SOURCE` | 8 | ソースコード |
| `XOBJ_DTYPE_STIME` | 9 | 短いタイム形式 |
| `XOBJ_DTYPE_MTIME` | 10 | 中程度タイム形式 |
| `XOBJ_DTYPE_LTIME` | 11 | 長いタイム形式 |
| `XOBJ_DTYPE_FLOAT` | 12 | 浮動小数点数 |
| `XOBJ_DTYPE_DECIMAL` | 13 | 小数点数 |
| `XOBJ_DTYPE_ENUM` | 14 | 列挙 |

**例:**
```php
class MyObject extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('email', XOBJ_DTYPE_EMAIL, '', true, 100);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, true);
    }
}
```

---

### setVar

変数の値を設定します。

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$key` | string | 変数名 |
| `$value` | mixed | 設定する値 |
| `$notGpc` | bool | trueの場合、値はGET/POST/COOKIEから来たものではありません |

**戻り値:** `bool` - 成功時はtrue、失敗時はfalse

**例:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // ユーザー入力からではない
$object->setVar('status', 1);
```

---

### getVar

オプションでフォーマットされた変数の値を取得します。

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$key` | string | 変数名 |
| `$format` | string | 出力フォーマット |

**フォーマットオプション:**

| フォーマット | 説明 |
|--------|-------------|
| `'s'` | Show - 表示用にHTMLエンティティエスケープ |
| `'e'` | Edit - フォーム入力値用 |
| `'p'` | Preview - showに似ている |
| `'f'` | Form data - フォーム処理用の生データ |
| `'n'` | None - 生の値、フォーマットなし |

**戻り値:** `mixed` - フォーマットされた値

**例:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (入力値用)
echo $object->getVar('title', 'n'); // "Hello <World>" (生の値)

// 配列データ型の場合
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // 配列を返す
```

---

### setVars

配列から複数の変数を一度に設定します。

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$values` | array | キー => 値ペアの連想配列 |
| `$notGpc` | bool | trueの場合、値はGET/POST/COOKIEから来たものではありません |

**例:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// データベースから (ユーザー入力ではない)
$object->setVars($row, true);
```

---

### getValues

すべての変数値を取得します。

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$keys` | array | 取得する特定のキー (nullはすべて) |
| `$format` | string | 出力フォーマット |
| `$maxDepth` | int | ネストされたオブジェクトの最大深さ |

**戻り値:** `array` - 値の連想配列

**例:**
```php
$object = new MyObject();

// すべての値を取得
$allValues = $object->getValues();

// 特定の値を取得
$subset = $object->getValues(['title', 'status']);

// データベース用の生の値を取得
$rawValues = $object->getValues(null, 'n');
```

---

### assignVar

検証なしで値を直接割り当てます (注意して使用してください)。

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**パラメータ:**

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `$key` | string | 変数名 |
| `$value` | mixed | 割り当てる値 |

**例:**
```php
// 信頼できるソース (例: データベース) からの直接割り当て
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

データベース操作用にすべての変数をサニタイズします。

```php
public function cleanVars(): bool
```

**戻り値:** `bool` - すべての変数が有効な場合はtrue

**例:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // 変数はサニタイズされてデータベース用に準備完了
    $cleanData = $object->cleanVars;
} else {
    // 検証エラーが発生しました
    $errors = $object->getErrors();
}
```

---

### isNew

オブジェクトが新規かどうかをチェックまたは設定します。

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**例:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## エラー処理メソッド

### setErrors

エラーメッセージを追加します。

```php
public function setErrors(string|array $error): void
```

**例:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### getErrors

すべてのエラーメッセージを取得します。

```php
public function getErrors(): array
```

**例:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

エラーをHTML形式で返します。

```php
public function getHtmlErrors(): string
```

**例:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## ユーティリティメソッド

### toArray

オブジェクトを配列に変換します。

```php
public function toArray(): array
```

**例:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

変数定義を返します。

```php
public function getVars(): array
```

**例:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## 完全な使用例

```php
<?php
/**
 * カスタム記事オブジェクト
 */
class Article extends XoopsObject
{
    /**
     * コンストラクタ - すべての変数を初期化
     */
    public function __construct()
    {
        parent::__construct();

        // 主キー
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // 必須フィールド
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // オプショナルフィールド
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // タイムスタンプ
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // ステータスフラグ
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // 配列としてのメタデータ
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * フォーマットされた作成日を取得
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * 記事が公開されているかチェック
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * ビューカウンタをインクリメント
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * カスタム検証
     */
    public function validate(): bool
    {
        $this->errors = [];

        // タイトル検証
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // 著者検証
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// 使用
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // ハンドラーを使用してデータベースに保存
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```

## ベストプラクティス

1. **常に変数を初期化**: コンストラクタで`initVar()`を使用してすべての変数を定義します

2. **適切なデータ型を使用**: 検証用に正しい`XOBJ_DTYPE_*`定数を選択します

3. **ユーザー入力を慎重に処理**: ユーザー入力用に`$notGpc = false`で`setVar()`を使用します

4. **保存前に検証**: データベース操作前に常に`cleanVars()`を呼び出します

5. **フォーマットパラメータを使用**: コンテキストに応じて`getVar()`で適切なフォーマットを使用します

6. **カスタムロジックのために拡張**: サブクラスにドメイン固有のメソッドを追加します

## 関連ドキュメンテーション

- XoopsObjectHandler - オブジェクト永続化用のハンドラーパターン
- ../Database/Criteria - Criteriaを使用したクエリ構築
- ../Database/XoopsDatabase - データベース操作

---

*参照: [XOOPSソースコード](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
