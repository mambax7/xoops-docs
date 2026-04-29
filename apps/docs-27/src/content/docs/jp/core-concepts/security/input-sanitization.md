---
title: "入力サニタイズ"
description: "XOOPSでMyTextSanitizerと検証テクニックを使用する"
---

ユーザー入力を決して信頼しないでください。すべての入力データを使用する前に常に検証およびサニタイズしてください。XOOPSはテキスト入力をサニタイズするための`MyTextSanitizer`クラスと、検証用のさまざまなヘルパー関数を提供します。

## 関連ドキュメント

- セキュリティベストプラクティス - 包括的なセキュリティガイド
- CSRF保護 - トークンシステムとXoopsSecurityクラス
- SQLインジェクション防止 - データベースセキュリティプラクティス

## 黄金ルール

**ユーザー入力を決して信頼しないでください。** 外部ソースからのすべてのデータは:

1. **検証**: 期待される形式と型に一致することを確認
2. **サニタイズ**: 潜在的に危険な文字を削除またはエスケープ
3. **エスケープ**: 出力時に特定のコンテキスト（HTML、JavaScript、SQL）用にエスケープ

## MyTextSanitizerクラス

XOOPSはテキストサニタイズ用に`MyTextSanitizer`クラス（一般に`$myts`として参照）を提供します。

### インスタンスの取得

```php
// シングルトンインスタンスを取得
$myts = MyTextSanitizer::getInstance();
```

### 基本的なテキストサニタイズ

```php
$myts = MyTextSanitizer::getInstance();

// プレーンテキストフィールド（HTMLは許可されない）
$title = $myts->htmlSpecialChars($_POST['title']);

// これは以下に変換:
// < to &lt;
// > to &gt;
// & to &amp;
// " to &quot;
// ' to &#039;
```

### テキストエリアコンテンツ処理

`displayTarea()`メソッドは包括的なテキストエリア処理を提供します:

```php
$myts = MyTextSanitizer::getInstance();

$content = $myts->displayTarea(
    $_POST['content'],
    $allowhtml = 0,      // 0 = HTMLは許可されない、1 = HTMLを許可
    $allowsmiley = 1,    // 1 = スマイリーを有効化
    $allowxcode = 1,     // 1 = XOOPSコード（BBCode）を有効化
    $allowimages = 1,    // 1 = 画像を許可
    $allowlinebreak = 1  // 1 = 改行を<br>に変換
);
```

### 一般的なサニタイズメソッド

```php
$myts = MyTextSanitizer::getInstance();

// HTML特殊文字エスケープ
$safe_text = $myts->htmlSpecialChars($text);

// マジッククォートが有効な場合はスラッシュを削除
$text = $myts->stripSlashesGPC($text);

// XOOPSコード（BBCode）をHTMLに変換
$html = $myts->xoopsCodeDecode($text);

// スマイリーを画像に変換
$html = $myts->smiley($text);

// クリック可能なリンクを作成
$html = $myts->makeClickable($text);

// プレビュー用の完全なテキスト処理
$preview = $myts->previewTarea($text, $allowhtml, $allowsmiley, $allowxcode);
```

## 入力検証

### 整数値の検証

```php
// 整数IDを検証
$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
    redirect_header('index.php', 3, '無効なID');
    exit();
}

// filter_varを使用した別の方法
$id = filter_var($_REQUEST['id'] ?? 0, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    redirect_header('index.php', 3, '無効なID');
    exit();
}
```

### メールアドレスの検証

```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, '無効なメールアドレス');
    exit();
}
```

### URLの検証

```php
$url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

if (!$url) {
    redirect_header('form.php', 3, '無効なURL');
    exit();
}

// 許可されるプロトコルを追加チェック
$parsed = parse_url($url);
$allowed_schemes = ['http', 'https'];
if (!in_array($parsed['scheme'], $allowed_schemes)) {
    redirect_header('form.php', 3, 'HTTPおよびHTTPSのURLのみを許可します');
    exit();
}
```

### 日付の検証

```php
$date = $_POST['date'] ?? '';

// 日付形式を検証 (YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    redirect_header('form.php', 3, '無効な日付形式');
    exit();
}

// 実際の日付妥当性を検証
$parts = explode('-', $date);
if (!checkdate($parts[1], $parts[2], $parts[0])) {
    redirect_header('form.php', 3, '無効な日付');
    exit();
}
```

### ファイル名の検証

```php
// 英数字、アンダースコア、ハイフンを除くすべての文字を削除
$filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['filename']);

// またはホワイトリスト方法を使用
$allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
$filename = '';
foreach (str_split($_POST['filename']) as $char) {
    if (strpos($allowed_chars, $char) !== false) {
        $filename .= $char;
    }
}
```

## 異なる入力タイプの処理

### 文字列入力

```php
$myts = MyTextSanitizer::getInstance();

// 短いテキスト（タイトル、名前）
$title = $myts->htmlSpecialChars(trim($_POST['title']));

// 長さを制限
if (strlen($title) > 255) {
    $title = substr($title, 0, 255);
}

// 空の必須フィールドを確認
if (empty($title)) {
    redirect_header('form.php', 3, 'タイトルが必要です');
    exit();
}
```

### 数値入力

```php
// 整数
$count = (int)$_POST['count'];
$count = max(0, min($count, 1000)); // 0-1000の範囲を確認

// 浮動小数点
$price = (float)$_POST['price'];
$price = round($price, 2); // 小数第2位に丸め

// 範囲を検証
if ($price < 0 || $price > 99999.99) {
    redirect_header('form.php', 3, '無効な価格');
    exit();
}
```

### ブール入力

```php
// チェックボックス値
$is_active = isset($_POST['is_active']) ? 1 : 0;

// または明示的な値チェック
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```

### 配列入力

```php
// 配列入力を検証（例：複数チェックボックス）
$selected_ids = [];
if (isset($_POST['ids']) && is_array($_POST['ids'])) {
    foreach ($_POST['ids'] as $id) {
        $clean_id = (int)$id;
        if ($clean_id > 0) {
            $selected_ids[] = $clean_id;
        }
    }
}
```

### 選択/オプション入力

```php
// 許可された値に対して検証
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, '無効なステータス');
    exit();
}
```

## リクエストオブジェクト (XMF)

XMFを使用する場合、Requestクラスはより清潔な入力処理を提供します:

```php
use Xmf\Request;

// 整数を取得
$id = Request::getInt('id', 0);

// 文字列を取得
$title = Request::getString('title', '');

// 配列を取得
$ids = Request::getArray('ids', []);

// メソッド指定で取得
$id = Request::getInt('id', 0, 'POST');
$search = Request::getString('q', '', 'GET');

// リクエストメソッドを確認
if (Request::getMethod() !== 'POST') {
    redirect_header('form.php', 3, '無効なリクエストメソッド');
    exit();
}
```

## 検証クラスの作成

複雑なフォームの場合は、専用の検証クラスを作成してください:

```php
<?php
namespace XoopsModules\MyModule;

class Validator
{
    private $errors = [];

    public function validateItem(array $data): bool
    {
        $this->errors = [];

        // タイトル検証
        if (empty($data['title'])) {
            $this->errors['title'] = 'タイトルが必要です';
        } elseif (strlen($data['title']) > 255) {
            $this->errors['title'] = 'タイトルは255文字以内である必要があります';
        }

        // メール検証
        if (!empty($data['email'])) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->errors['email'] = '無効なメール形式';
            }
        }

        // ステータス検証
        $allowed = ['draft', 'published'];
        if (!in_array($data['status'], $allowed)) {
            $this->errors['status'] = '無効なステータス';
        }

        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getError(string $field): ?string
    {
        return $this->errors[$field] ?? null;
    }
}
```

使用方法:

```php
$validator = new Validator();
$data = [
    'title' => $_POST['title'],
    'email' => $_POST['email'],
    'status' => $_POST['status'],
];

if (!$validator->validateItem($data)) {
    $errors = $validator->getErrors();
    // ユーザーにエラーを表示
}
```

## データベース保存用のサニタイズ

データをデータベースに保存する場合:

```php
$myts = MyTextSanitizer::getInstance();

// 保存用 (表示時に再度処理される)
$title = $myts->addSlashes($_POST['title']);

// より良い方法: パラメータ化されたステートメントを使用（SQL インジェクション防止を参照）
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```

## 表示用のサニタイズ

異なるコンテキストには異なるエスケープが必要です:

```php
$myts = MyTextSanitizer::getInstance();

// HTMLコンテキスト
echo $myts->htmlSpecialChars($title);

// HTML属性内
echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

// JavaScriptコンテキスト
echo json_encode($title);

// URLパラメータ
echo urlencode($title);

// 完全なURL
echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
```

## 一般的な落とし穴

### 二重エンコード

**問題**: データが複数回エンコードされる

```php
// 悪い - 二重エンコード
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// 良い - 一度だけエンコード、適切なタイミングで
$title = $_POST['title']; // 生のデータを保存
echo $myts->htmlSpecialChars($title); // 出力時にエンコード
```

### 不一貫なエンコード

**問題**: 一部の出力はエンコードされ、一部はされていない

**解決方法**: 常に一貫した方法を使用し、最初は出力時のエンコードが望ましい:

```php
// テンプレート割り当て
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```

### 検証なしでサニタイズ

**問題**: 検証なしでサニタイズするだけ

**解決方法**: 常に最初に検証し、次にサニタイズしてください:

```php
// 最初に検証
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'ユーザー名に無効な文字が含まれています');
    exit();
}

// 次にサニタイズして保存/表示
$username = $myts->htmlSpecialChars($_POST['username']);
```

## ベストプラクティス要約

1. **MyTextSanitizerを使用** テキストコンテンツ処理用
2. **filter_var()を使用** 特定の形式検証用
3. **型キャストを使用** 数値の場合
4. **ホワイトリスト許可値** 選択入力用
5. **検証してからサニタイズ**
6. **出力時にエスケープ**、入力時ではなく
7. **パラメータ化されたステートメントを使用** データベースクエリ用
8. **複雑なフォーム用の検証クラスを作成**
9. **クライアント側検証を決して信頼しない** - 常にサーバー側で検証
10. **入力** - サーバー側でこれを実施

---

#セキュリティ #サニタイズ #検証 #xoops #MyTextSanitizer #入力処理
