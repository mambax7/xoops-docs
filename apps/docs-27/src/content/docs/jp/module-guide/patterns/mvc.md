---
title: "XOOPSのMVCパターン"
description: "XOOPSモジュールのモデル・ビュー・コントローラーアーキテクチャ実装"
---

<span class="version-badge version-xmf">XMF Required</span> <span class="version-badge version-40x">4.0.x Native</span>

:::note[正しいパターンか不確かですか?]
[データアクセスパターンの選択](../Choosing-Data-Access-Pattern.md) を参照して、MVCを使用する時機についてのガイダンスを取得してください。
:::

:::caution[明確化: XOOPSアーキテクチャ]
**標準的なXOOPS 2.5.x** は **ページコントローラー** パターン（トランザクションスクリプトとも呼ばれる）を使用します。MVCではありません。レガシーモジュールは`index.php`で直接インクルード、グローバルオブジェクト（`$xoopsUser`、`$xoopsDB`）、ハンドラーベースのデータアクセスを使用します。

**XOOPS 2.5.xでMVCを使用するには**、ルーティングとコントローラーサポートを提供する **XMFフレームワーク** が必要です。

**XOOPS 4.0** は PSR-15ミドルウェアと適切なルーティングを備えたMVCをネイティブにサポートします。

関連トピック: [現在のXOOPSアーキテクチャ](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

モデル・ビュー・コントローラー（MVC）パターンはXOOPSモジュール内での関心の分離のための基本的なアーキテクチャパターンです。このパターンはアプリケーションを3つの相互接続コンポーネントに分割します。

## MVC説明

### モデル
**モデル** はアプリケーションのデータとビジネスロジックを表します。以下を行います:
- データ永続化を管理
- ビジネスルールを実装
- データを検証
- データベースと通信
- UIから独立

### ビュー
**ビュー** はユーザーにデータを提示する責任があります。以下を行います:
- HTMLテンプレートをレンダリング
- モデルデータを表示
- ユーザーインターフェースプレゼンテーションを処理
- コントローラーにユーザーアクションを送信
- 最小限のロジックを含むべき

### コントローラー
**コントローラー** はユーザーインタラクションを処理し、モデルとビューを調整します。以下を行います:
- ユーザーリクエストを受け取る
- 入力データを処理
- モデルメソッドを呼び出す
- 適切なビューを選択
- アプリケーションフローを管理

## XOOPS実装

XOOPSでは、MVCパターンはハンドラーとSmarteyテンプレートエンジンを使用して実装されます。

### 基本的なモデル構造
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // データベースクエリ実装
    }
    
    public function createUser($data)
    {
        // ユーザー作成実装
    }
}
?>
```

### コントローラー実装
```php
<?php
class UserController
{
    private $model;
    
    public function listAction()
    {
        $users = $this->model->getAllUsers();
        return ['users' => $users];
    }
}
?>
```

### ビューテンプレート
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## ベストプラクティス

- ビジネスロジックをモデルに保つ
- プレゼンテーションをビューに保つ
- ルーティング/調整をコントローラーに保つ
- レイヤー間で関心事を混ぜない
- コントローラーレベルですべての入力を検証

## 関連ドキュメント

関連トピック:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) - 高度なデータアクセス
- [Service-Layer](../Patterns/Service-Layer.md) - ビジネスロジック抽象化
- [Code-Organization](../Best-Practices/Code-Organization.md) - プロジェクト構造
- [Testing](../Best-Practices/Testing.md) - MVCテスト戦略

---

タグ: #mvc #patterns #architecture #module-development #design-patterns
