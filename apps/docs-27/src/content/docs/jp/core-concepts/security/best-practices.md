---
title: "セキュリティベストプラクティス"
description: "XOOPSモジュール開発のための包括的なセキュリティガイド"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[セキュリティAPIはバージョン間で安定しています]
ここで説明されているセキュリティプラクティスとAPIは、XOOPS 2.5.xおよびXOOPS 4.0.xの両方で機能します。コアセキュリティクラス（`XoopsSecurity`、`MyTextSanitizer`）は安定しています。
:::

このドキュメントは、XOOPSモジュール開発者向けの包括的なセキュリティベストプラクティスを提供します。これらのガイドラインに従うことで、モジュールが安全であり、XOOPS インストールに脆弱性をもたらさないことを確保できます。

## セキュリティの原則

すべてのXOOPS開発者は、以下の基本的なセキュリティ原則に従うべきです:

1. **多層防御**: 複数のセキュリティ管理層を実装する
2. **最小権限の原則**: 必要最小限のアクセス権を付与する
3. **入力検証**: ユーザー入力を決して信頼しない
4. **デフォルトでセキュア**: セキュリティがデフォルト設定であるべき
5. **シンプルさを保つ**: 複雑なシステムはセキュリティが困難

## 関連ドキュメント

- CSRF保護 - トークンシステムとXoopsSecurityクラス
- 入力サニタイズ - MyTextSanitizerと検証
- SQLインジェクション防止 - データベースセキュリティプラクティス

## クイックリファレンスチェックリスト

モジュールをリリースする前に以下を確認してください:

- [ ] すべてのフォームにXOOPSトークンが含まれている
- [ ] すべてのユーザー入力が検証およびサニタイズされている
- [ ] すべての出力が正しくエスケープされている
- [ ] すべてのデータベースクエリがパラメータ化されたステートメントを使用している
- [ ] ファイルアップロードが適切に検証されている
- [ ] 認証と認可チェックが実装されている
- [ ] エラーハンドリングが機密情報を公開していない
- [ ] 機密設定が保護されている
- [ ] サードパーティライブラリが最新である
- [ ] セキュリティテストが実施されている

## 認証と認可

### ユーザー認証の確認

```php
// ユーザーがログインしているかを確認
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### ユーザー権限の確認

```php
// ユーザーがこのモジュールにアクセスする権限があるかを確認
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// 特定の権限を確認
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### モジュール権限の設定

```php
// インストール/更新関数で権限を作成
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// すべてのグループに権限を追加
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```

## セッションセキュリティ

### セッション処理のベストプラクティス

1. 機密情報をセッションに保存しない
2. ログイン/権限変更後にセッションIDを再生成する
3. セッションデータを使用する前に検証する

```php
// ログイン後にセッションIDを再生成
session_regenerate_id(true);

// セッションデータを検証
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // ユーザーがデータベースに存在することを確認
}
```

### セッション固定の防止

```php
// ログイン成功後
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// 後続のリクエスト
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // 可能なセッションハイジャック試行
    session_destroy();
    redirect_header('index.php', 3, 'セッションエラー');
    exit();
}
```

## ファイルアップロードセキュリティ

### ファイルアップロードの検証

```php
// ファイルが正しくアップロードされたかを確認
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'ファイルアップロードエラー');
    exit();
}

// ファイルサイズを確認
if ($_FILES['userfile']['size'] > 1000000) { // 1MBの制限
    redirect_header('index.php', 3, 'ファイルが大きすぎます');
    exit();
}

// ファイルタイプを確認
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, '無効なファイルタイプ');
    exit();
}

// ファイル拡張子を検証
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, '無効なファイル拡張子');
    exit();
}
```

### XOOPSアップローダーの使用

```php
include_once XOOPS_ROOT_PATH . '/class/uploader.php';

$allowed_mimetypes = ['image/gif', 'image/jpeg', 'image/png'];
$maxsize = 1000000; // 1MB
$maxwidth = 1024;
$maxheight = 768;
$upload_dir = XOOPS_ROOT_PATH . '/uploads/mymodule';

$uploader = new XoopsMediaUploader(
    $upload_dir,
    $allowed_mimetypes,
    $maxsize,
    $maxwidth,
    $maxheight
);

if ($uploader->fetchMedia('userfile')) {
    $uploader->setPrefix('mymodule_');

    if ($uploader->upload()) {
        $filename = $uploader->getSavedFileName();
        // ファイル名をデータベースに保存
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```

### アップロードファイルの安全な保存

```php
// Webルートの外側にアップロードディレクトリを定義
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// ディレクトリが存在しない場合は作成
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// アップロードされたファイルを移動
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```

## エラーハンドリングとロギング

### セキュアなエラーハンドリング

```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('操作に失敗しました');
    }
} catch (Exception $e) {
    // エラーをログに記録
    xoops_error($e->getMessage());

    // ユーザーに一般的なエラーメッセージを表示
    redirect_header('index.php', 3, '後でもう一度試してください。');
    exit();
}
```

### セキュリティイベントのロギング

```php
// セキュリティイベントをログに記録
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('セキュリティ', 'ユーザーのログイン試行に失敗: ' . $username);
```

## 設定セキュリティ

### 機密設定の保存

```php
// Webルートの外側に設定パスを定義
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// 設定を読み込む
if (file_exists($config_path)) {
    include $config_path;
} else {
    // 設定が見つからない場合を処理
}
```

### 設定ファイルの保護

.htaccessを使用して設定ファイルを保護します:

```apache
# .htaccessで
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## サードパーティライブラリ

### ライブラリの選択

1. アクティブにメンテナンスされているライブラリを選択する
2. セキュリティ脆弱性を確認する
3. ライブラリのライセンスがXOOPSと互換性があることを確認する

### ライブラリの更新

```php
// ライブラリバージョンを確認
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('ライブラリをバージョン1.2.3以上に更新してください');
}
```

### ライブラリの分離

```php
// 制御された方法でライブラリを読み込む
function loadLibrary($file)
{
    $allowed = ['parser.php', 'formatter.php'];

    if (!in_array($file, $allowed)) {
        return false;
    }

    include_once XOOPS_ROOT_PATH . '/modules/mymodule/libraries/' . $file;
    return true;
}
```

## セキュリティテスト

### 手動テストチェックリスト

1. すべてのフォームを無効な入力でテストする
2. 認証と認可をバイパスしようとする
3. ファイルアップロード機能を悪意のあるファイルでテストする
4. すべての出力でXSS脆弱性をチェックする
5. すべてのデータベースクエリでSQLインジェクションをテストする

### 自動テスト

脆弱性をスキャンするための自動ツールを使用します:

1. 静的コード分析ツール
2. Webアプリケーションスキャナー
3. サードパーティライブラリの依存関係チェッカー

## 出力エスケープ

### HTMLコンテキスト

```php
// 通常のHTMLコンテンツの場合
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// MyTextSanitizerを使用
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### JavaScriptコンテキスト

```php
// JavaScriptで使用されるデータの場合
echo json_encode($variable);

// インラインJavaScriptの場合
echo 'var data = ' . json_encode($variable) . ';';
```

### URLコンテキスト

```php
// URLで使用されるデータの場合
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### テンプレート変数

```php
// Smartyテンプレートに変数を割り当てる
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// HTMLコンテンツとして表示すべき場合
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## リソース

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [PHP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS Documentation](https://xoops.org/)

---

#セキュリティ #ベストプラクティス #xoops #モジュール開発 #認証 #認可
