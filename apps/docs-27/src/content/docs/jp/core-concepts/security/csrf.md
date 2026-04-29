---
title: "CSRF保護"
description: "XoopsSecurityクラスを使用したXOOPSでのCSRF保護の理解と実装"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

クロスサイトリクエストフォージェリ（CSRF）攻撃は、ユーザーが認証されたサイト上で意図しないアクションを実行させます。XOOPSは`XoopsSecurity`クラスを通じた組み込みCSRF保護を提供します。

## 関連ドキュメント

- セキュリティベストプラクティス - 包括的なセキュリティガイド
- 入力サニタイズ - MyTextSanitizerと検証
- SQLインジェクション防止 - データベースセキュリティプラクティス

## CSRF攻撃の理解

CSRF攻撃は以下の場合に発生します:

1. ユーザーがXOOPSサイトで認証されている
2. ユーザーが悪意のあるウェブサイトを訪問する
3. 悪意のあるサイトがユーザーのセッションを使用してXOOPSサイトにリクエストを送信する
4. サイトが正当なユーザーからのリクエストとして処理する

## XoopsSecurityクラス

XOOPSは`XoopsSecurity`クラスを提供してCSRF攻撃から保護します。このクラスはセッションに保存されてフォームに含まれなければならないセキュリティトークンを管理します。

### トークン生成

セキュリティクラスは、ユーザーのセッションに保存され、フォームに含める必要がある一意のトークンを生成します:

```php
$security = new XoopsSecurity();

// トークンHTMLインプットフィールドを取得
$tokenHTML = $security->getTokenHTML();

// トークン値だけを取得
$tokenValue = $security->createToken();
```

### トークン検証

フォーム送信を処理するときは、トークンが有効であることを確認してください:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## XOOPSトークンシステムの使用

### XoopsFormクラスで使用

XoopsFormクラスを使用する場合、トークン保護は簡単です:

```php
// フォームを作成
$form = new XoopsThemeForm('アイテムを追加', 'form_name', 'submit.php');

// フォーム要素を追加
$form->addElement(new XoopsFormText('タイトル', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('コンテンツ', 'content', ''));

// 隠しトークンフィールドを追加 - 常に含める
$form->addElement(new XoopsFormHiddenToken());

// 送信ボタンを追加
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
```

### カスタムフォームで使用

XoopsFormを使用しないカスタムHTMLフォームの場合:

```php
// フォームテンプレートまたはPHPファイルで
$security = new XoopsSecurity();
?>
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    <!-- トークンを含める -->
    <?php echo $security->getTokenHTML(); ?>

    <button type="submit">送信</button>
</form>
```

### Smartyテンプレートで使用

Smartyテンプレートでフォームを生成する場合:

```php
// PHPファイルで
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```

```smarty
{* テンプレートで *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* トークンを含める *}
    <{$token}>

    <button type="submit">送信</button>
</form>
```

## フォーム送信の処理

### 基本的なトークン検証

```php
// フォーム処理スクリプトで
$security = new XoopsSecurity();

// トークンを検証
if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}

// トークンは有効、フォームを処理
$title = $_POST['title'];
// ... 処理を続行
```

### カスタムエラーハンドリング

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // 詳細なエラー情報を取得
    $errors = $security->getErrors();

    // エラーをログに記録
    error_log('CSRF token validation failed: ' . implode(', ', $errors));

    // エラーメッセージでリダイレクト
    redirect_header('form.php', 3, 'セキュリティトークンが期限切れです。もう一度試してください。');
    exit();
}
```

### AJAXリクエスト用

AJAXリクエストを使用する場合は、リクエストにトークンを含めます:

```javascript
// JavaScript - 隠しフィールドからトークンを取得
var token = document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value;

// AJAXリクエストに含める
fetch('ajax_handler.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=save&XOOPS_TOKEN_REQUEST=' + encodeURIComponent(token)
});
```

```php
// PHP AJAXハンドラー
$security = new XoopsSecurity();

if (!$security->check()) {
    echo json_encode(['error' => '無効なセキュリティトークン']);
    exit();
}

// AJAXリクエストを処理
```

## HTTPリフェラーを確認

追加の保護として、特にAJAXリクエストでHTTPリフェラーも確認できます:

```php
$security = new XoopsSecurity();

// リフェラーヘッダーを確認
if (!$security->checkReferer()) {
    echo json_encode(['error' => '無効なリクエスト']);
    exit();
}

// トークンも検証
if (!$security->check()) {
    echo json_encode(['error' => '無効なトークン']);
    exit();
}
```

### 組み合わせたセキュリティチェック

```php
$security = new XoopsSecurity();

// 両方のチェックを実行
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'セキュリティ検証に失敗しました');
    exit();
}
```

## トークン設定

### トークンの有効期間

トークンは有効期間が限定されており、リプレイ攻撃を防ぎます。XOOPSの設定でこれを設定するか、期限切れトークンに対応できます:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // トークンが期限切れの可能性
    // 新しいトークンでフォームを再生成
    redirect_header('form.php', 3, 'セッションが期限切れです。フォームをもう一度送信してください。');
    exit();
}
```

### 同じページ上の複数フォーム

同じページに複数のフォームがある場合、それぞれが独自のトークンを持つべきです:

```php
// フォーム1
$form1 = new XoopsThemeForm('フォーム1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// フォーム2
$form2 = new XoopsThemeForm('フォーム2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## ベストプラクティス

### 状態変更操作には常にトークンを使用

以下のフォームにトークンを含めます:

- データを作成する
- データを更新する
- データを削除する
- ユーザー設定を変更する
- 管理アクションを実行する

### リフェラー確認だけに依存しない

HTTPリフェラーヘッダーは以下の可能性があります:

- プライバシーツールで削除される
- いくつかのブラウザで欠落している
- 場合によっては詐称される

主な防御としてトークン検証を常に使用してください。

### 適切にトークンを再生成

以下を検討してトークンを再生成してください:

- フォーム送信成功後
- ログイン/ログアウト後
- 長いセッションで定期的に

### トークン期限切れに対応

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // フォームデータを一時的に保存
    $_SESSION['form_backup'] = $_POST;

    // メッセージ付きでフォームに戻る
    redirect_header('form.php?restore=1', 3, 'フォームをもう一度送信してください。');
    exit();
}
```

## 一般的な問題と解決方法

### トークンが見つからないエラー

**問題**: セキュリティチェックが「トークンが見つかりません」で失敗する

**解決方法**: トークンフィールドがフォームに含まれていることを確認してください:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### トークン期限切れエラー

**問題**: ユーザーが長時間のフォーム記入後に「トークン期限切れ」が表示される

**解決方法**: JavaScriptを使用してトークンを定期的に更新することを検討してください:

```javascript
// 10分ごとにトークンを更新
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```

### AJAXトークンの問題

**問題**: AJAXリクエストがトークン検証に失敗する

**解決方法**: すべてのAJAXリクエストでトークンを渡し、サーバー側で検証していることを確認してください:

```php
// AJAXハンドラー
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // AJAXでトークンをクリアしない
    http_response_code(403);
    echo json_encode(['error' => '無効なトークン']);
    exit();
}
```

## 例: 完全なフォーム実装

```php
<?php
// form.php
require_once dirname(__DIR__) . '/mainfile.php';

$security = new XoopsSecurity();

// フォーム送信を処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$security->check()) {
        redirect_header('form.php', 3, 'セキュリティトークンが期限切れです。もう一度試してください。');
        exit();
    }

    // 有効な送信を処理
    $title = $myts->htmlSpecialChars($_POST['title']);
    // ... データベースに保存

    redirect_header('success.php', 3, 'アイテムが正常に保存されました!');
    exit();
}

// フォームを表示
$GLOBALS['xoopsOption']['template_main'] = 'mymodule_form.tpl';
include XOOPS_ROOT_PATH . '/header.php';

$form = new XoopsThemeForm('アイテムを追加', 'add_item', 'form.php');
$form->addElement(new XoopsFormText('タイトル', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('コンテンツ', 'content', ''));
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

$GLOBALS['xoopsTpl']->assign('form', $form->render());

include XOOPS_ROOT_PATH . '/footer.php';
```

---

#セキュリティ #csrf #xoops #フォーム #トークン #XoopsSecurity
