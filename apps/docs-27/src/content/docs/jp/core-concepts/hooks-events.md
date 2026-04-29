---
title: "フックとイベント"
---

## 概要

XOOPSはコアの機能と相互作用し、直接的な依存関係なくモジュール間で相互作用するための拡張ポイントとしてフックとイベントを提供します。

## フック対イベント

| 側面 | フック | イベント |
|--------|-------|--------|
| 目的 | 動作/データの変更 | 出現に対応 |
| リターン | 変更されたデータを返すことができる | 通常はvoid |
| タイミング | アクション前/中 | アクション後 |
| パターン | フィルターチェーン | オブザーバー/pub-sub |

## フックシステム

### フックを登録

```php
// xoops_version.php でフックを登録
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### フックコールバック

```php
// include/hooks.php

function mymodule_hook_user_profile(array $data): array
{
    $userId = $data['user_id'];

    // カスタムプロフィールフィールドを追加
    $data['fields']['reputation'] = mymodule_get_user_reputation($userId);
    $data['fields']['badges'] = mymodule_get_user_badges($userId);

    return $data;
}
```

### 利用可能なコアフック

| フック名 | データ | 説明 |
|-----------|------|-------------|
| `user.profile.display` | ユーザーデータ配列 | プロフィール表示を変更 |
| `content.render` | コンテンツHTML | コンテンツ出力をフィルター |
| `form.submit` | フォームデータ | フォームデータを検証/変更 |
| `search.results` | 結果配列 | 検索結果をフィルター |
| `menu.main` | メニュー項目 | メインメニューを変更 |

## イベントシステム

### イベントをディスパッチ

```php
// モジュールコード内
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### イベントをリッスン

```php
// class/Preload.php

class MyModulePreload extends \Xmf\Module\Helper\AbstractHelper
{
    public function eventMymoduleArticleCreated(array $args): void
    {
        $articleId = $args['article_id'];

        // サブスクライバーに通知
        $this->notifyNewArticle($articleId);
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];

        // モジュール用にユーザーアクティビティを更新
        $this->updateUserActivity($userId);
    }
}
```

## プリロードイベント リファレンス

### コアイベント

```php
// ヘッダー/フッター
public function eventCoreHeaderStart(array $args): void {}
public function eventCoreHeaderEnd(array $args): void {}
public function eventCoreFooterStart(array $args): void {}
public function eventCoreFooterEnd(array $args): void {}

// インクルード
public function eventCoreIncludeCommonStart(array $args): void {}
public function eventCoreIncludeCommonEnd(array $args): void {}

// 例外
public function eventCoreException(array $args): void {}
```

### ユーザーイベント

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### モジュールイベント

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## カスタムモジュールイベント

### イベントを定義

```php
// イベント定数を定義
class ArticleEvents
{
    public const CREATED = 'mymodule.article.created';
    public const UPDATED = 'mymodule.article.updated';
    public const DELETED = 'mymodule.article.deleted';
    public const PUBLISHED = 'mymodule.article.published';
}
```

### イベントをトリガー

```php
class ArticleService
{
    public function publish(Article $article): void
    {
        $article->publish();
        $this->repository->save($article);

        // イベントをトリガー
        $GLOBALS['xoopsPreload']->triggerEvent(
            ArticleEvents::PUBLISHED,
            ['article' => $article]
        );
    }
}
```

### モジュールイベントをリッスン

```php
// 別のモジュールのPreload.php内

public function eventMymoduleArticlePublished(array $args): void
{
    $article = $args['article'];

    // 検索用にインデックス
    $this->searchIndexer->index($article);

    // サイトマップを更新
    $this->sitemapGenerator->addUrl($article->url());
}
```

## ベストプラクティス

1. **特定の名前を使用** - `module.entity.action`形式
2. **最小限のデータを渡す** - リスナーが必要とするもののみ
3. **イベントを文書化** - モジュールドキュメントにイベントをリスト
4. **副作用を避ける** - リスナーを焦点を当てた状態に保つ
5. **エラーを処理** - リスナーエラーがフローを中断しないようにする

## 関連ドキュメント

- Event-System - 詳細なイベントドキュメント
- ../03-Module-Development/Module-Development - モジュール開発
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14イベント
