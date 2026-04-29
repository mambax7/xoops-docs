---
title: "JWT - JSON Web Tokens"
description: "セキュアなトークンベース認証およびAJAX保護用のXMF JWT実装"
---

`Xmf\Jwt` 名前空間はXOOPSモジュール用のJSON Web Token (JWT) サポートを提供します。JWTはセキュアでステートレスな認証を可能にし、特にAJAXリクエスト保護に有用です。

## JSON Web Tokenとは?

JSON Web Tokenは、クレーム (データ) のセットを公開する標準的な方法で、クレームが改ざんされていないことを暗号検証する機能を持つテキスト文字列です。詳細な仕様については、以下を参照:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### 主な特性

- **署名済み**: トークンは暗号的に署名されており、改ざんを検出
- **自己完結**: すべての必要な情報がトークン内に含まれている
- **ステートレス**: サーバー側のセッション保存が不要
- **有効期限設定可**: トークンは有効期限を含めることが可能

> **注:** JWTは署名されていますが、暗号化されていません。データはBase64エンコードされており、可視です。機密データを隠すのではなく、整合性検証用にJWTを使用してください。

## XOOPS でなぜ JWT を使用するのか?

### AJAX トークンの問題

XOOPSフォームはCSRF保護用にnonceトークンを使用します。しかし、nonceはAJAXではうまく機能しません。理由は:

1. **単一使用**: Nonceは通常1回の提出でのみ有効
2. **非同期の問題**: 複数のAJAXリクエストは順序が乱れる可能性
3. **更新の複雑さ**: トークンを非同期に更新する信頼できる方法がない
4. **コンテキストバインディング**: 標準トークンは、どのスクリプトがそれを発行したかを検証しない

### JWT の利点

JWTはこれらの問題を以下によって解決:

- 有効期限 (`exp` クレーム) を含めることで時間制限された有効性
- カスタムクレームをサポートして、トークンを特定のスクリプトにバインド
- 有効期間内の複数リクエストを有効化
- トークン発行元の暗号検証を提供

## コアクラス

### JsonWebToken

`Xmf\Jwt\JsonWebToken` クラスはトークンの作成とデコードを処理します。

```php
use Xmf\Jwt\JsonWebToken;
use Xmf\Jwt\KeyFactory;

// キーを作成
$key = KeyFactory::build('my_application_key');

// JsonWebTokenインスタンスを作成
$jwt = new JsonWebToken($key, 'HS256');

// トークンを作成
$payload = ['user_id' => 123, 'aud' => 'myaction'];
$token = $jwt->create($payload, 300); // 300秒で期限切れ

// トークンをデコードおよび検証
$assertClaims = ['aud' => 'myaction'];
$decoded = $jwt->decode($tokenString, $assertClaims);
```

#### メソッド

**`new JsonWebToken($key, $algorithm)`**

新しいJWTハンドラーを作成。
- `$key`: `Xmf\Key\KeyAbstract` オブジェクト
- `$algorithm`: 署名アルゴリズム (デフォルト: 'HS256')

**`create($payload, $expirationOffset)`**

署名済みトークン文字列を作成。
- `$payload`: クレームの配列
- `$expirationOffset`: 有効期限までの秒数 (オプション)

**`decode($jwtString, $assertClaims)`**

トークンをデコードおよび検証。
- `$jwtString`: デコードするトークン
- `$assertClaims`: 検証するクレーム (なしの場合は空配列)
- 返す: stdClassペイロードまたは無効の場合はfalse

**`setAlgorithm($algorithm)`**

署名/検証アルゴリズムを変更。

### TokenFactory

`Xmf\Jwt\TokenFactory` はトークン作成の便利な方法を提供します。

```php
use Xmf\Jwt\TokenFactory;

// 自動キー処理でトークンを作成
$claims = [
    'aud' => 'myaction.php',
    'user_id' => $userId,
    'item_id' => $itemId
];

$token = TokenFactory::build('my_key', $claims, 120);
// トークンは120秒で期限切れ
```

**`TokenFactory::build($key, $payload, $expirationOffset)`**

- `$key`: キー名文字列またはKeyAbstractオブジェクト
- `$payload`: クレームの配列
- `$expirationOffset`: 秒単位の有効期限

失敗時の例外: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

`Xmf\Jwt\TokenReader` クラスは、様々なソースからのトークン読み込みを簡素化します。

```php
use Xmf\Jwt\TokenReader;

$assertClaims = ['aud' => 'myaction.php'];

// 文字列から
$payload = TokenReader::fromString('my_key', $tokenString, $assertClaims);

// クッキーから
$payload = TokenReader::fromCookie('my_key', 'token_cookie', $assertClaims);

// リクエストパラメータから
$payload = TokenReader::fromRequest('my_key', 'token', $assertClaims);

// Authorizationヘッダーから (Bearerトークン)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
```

すべてのメソッドはペイロードを `stdClass` として、または無効の場合は `false` として返します。

### KeyFactory

`Xmf\Jwt\KeyFactory` は暗号キーを作成および管理します。

```php
use Xmf\Jwt\KeyFactory;

// キーを構築 (存在しない場合は作成)
$key = KeyFactory::build('my_application_key');

// カスタムストレージで
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

キーは永続的に保存されます。デフォルトストレージはファイルシステムを使用します。

## AJAX保護の例

JWT保護されたAJAXを示す完全な例です。

### ページスクリプト (トークンを生成)

```php
<?php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;
use Xmf\Module\Helper;
use Xmf\Request;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// 含めて検証するクレーム
$assertClaims = ['aud' => basename(__FILE__)];

// これはAJAXリクエストか?
$isAjax = (0 === strcasecmp(Request::getHeader('X-Requested-With', ''), 'XMLHttpRequest'));

if ($isAjax) {
    // AJAXリクエストを処理
    $GLOBALS['xoopsLogger']->activated = false;

    // Authorizationヘッダーからトークンを検証
    $token = TokenReader::fromHeader('ajax_key', $assertClaims);

    if (false === $token) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authorized']);
        exit;
    }

    // トークンは有効 - リクエストを処理
    $action = Request::getCmd('action', '');
    $itemId = isset($token->item_id) ? $token->item_id : 0;

    // AJAXロジックをここに
    $response = ['success' => true, 'item_id' => $itemId];

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// 通常のページリクエスト - トークンを生成してページを表示
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper(basename(__DIR__));

// クレーム付きのトークンを作成
$claims = array_merge($assertClaims, [
    'item_id' => 42,
    'user_id' => $GLOBALS['xoopsUser']->getVar('uid')
]);

// トークンは2分間有効
$token = TokenFactory::build('ajax_key', $claims, 120);

// AJAX呼び出し用のJavaScript
$script = <<<JS
<script>
function performAction(action) {
    $.ajax({
        url: window.location.href,
        method: 'POST',
        data: { action: action },
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer {$token}');
        },
        success: function(data) {
            if (data.success) {
                console.log('Action completed:', data);
                // UIを更新
            }
        },
        error: function(xhr, status, error) {
            if (xhr.status === 401) {
                alert('Session expired. Please refresh the page.');
            } else {
                alert('An error occurred: ' + error);
            }
        }
    });
}
</script>
JS;

echo $script;
echo '<button onclick="performAction(\'save\')">Save Item</button>';
echo '<button onclick="performAction(\'delete\')">Delete Item</button>';

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## ベストプラクティス

### トークン有効期限

使用例に基づいて適切な有効期限を設定:

```php
// 機密操作用の短期有効 (2分)
$token = TokenFactory::build('key', $claims, 120);

// 一般的なページインタラクション用のより長い期間 (30分)
$token = TokenFactory::build('key', $claims, 1800);
```

### クレーム検証

`aud` (audience) クレームを常に検証して、トークンが意図されたスクリプトで使用されることを保証:

```php
// 作成時
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// 検証時
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### キー命名

異なる目的には説明的なキー名を使用:

```php
// 異なる機能用に別のキーを使用
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### エラーハンドリング

```php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;

try {
    $token = TokenFactory::build('my_key', $claims, 300);
} catch (\DomainException $e) {
    // 無効なアルゴリズム
    error_log('JWT Error: ' . $e->getMessage());
} catch (\InvalidArgumentException $e) {
    // 無効な引数
    error_log('JWT Error: ' . $e->getMessage());
} catch (\UnexpectedValueException $e) {
    // 予期しない値
    error_log('JWT Error: ' . $e->getMessage());
}

// トークン読み込みは失敗時にfalseを返す (例外ではない)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
if ($payload === false) {
    // トークン無効、期限切れ、または改ざん
}
```

## トークン転送方法

### Authorizationヘッダー (推奨)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### クッキー

```php
// トークン付きクッキーを設定
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// クッキーから読み込み
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### リクエストパラメータ

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## セキュリティの考慮

1. **HTTPSを使用**: トークン傍受を防ぐために常にHTTPSを使用
2. **短い有効期限**: 実用的な最短の有効期限を使用
3. **特定のクレーム**: トークンを特定のコンテキストにバインドするクレームを含める
4. **サーバー側検証**: 常にサーバー側でトークンを検証
5. **機密データは保存しない**: トークンは読み込み可能 (暗号化されていない) ことを覚えておく

## APIリファレンス

### Xmf\Jwt\JsonWebToken

| メソッド | 説明 |
|--------|------|
| `__construct($key, $algorithm)` | JWTハンドラーを作成 |
| `setAlgorithm($algorithm)` | 署名アルゴリズムを設定 |
| `create($payload, $expiration)` | 署名済みトークンを作成 |
| `decode($token, $assertClaims)` | トークンをデコードおよび検証 |

### Xmf\Jwt\TokenFactory

| メソッド | 説明 |
|--------|------|
| `build($key, $payload, $expiration)` | トークン文字列を作成 |

### Xmf\Jwt\TokenReader

| メソッド | 説明 |
|--------|------|
| `fromString($key, $token, $claims)` | 文字列からデコード |
| `fromCookie($key, $name, $claims)` | クッキーからデコード |
| `fromRequest($key, $name, $claims)` | リクエストからデコード |
| `fromHeader($key, $claims, $header)` | ヘッダーからデコード |

### Xmf\Jwt\KeyFactory

| メソッド | 説明 |
|--------|------|
| `build($name, $storage)` | キーを取得または作成 |

## 関連項目

- ../Basics/XMF-Request - リクエスト処理
- ../XMF-Framework - フレームワーク概要
- Database - データベースユーティリティ

---

#xmf #jwt #security #ajax #authentication #tokens
