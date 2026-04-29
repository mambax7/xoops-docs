---
title: "XMF メタジェンクラス"
description: "XMFフレームワークのメタタグ生成とSEOヘルパー"
---

XMFフレームワークの`Metagen`クラスは、HTMLメタタグ、Open Graphタグ、その他のSEO関連メタデータを生成・管理するための包括的なツールキットを提供します。

## クラス概要

`Metagen`クラスは以下を処理します：
- 標準HTMLメタタグ（説明、キーワードなど）
- Open Graphメタタグ（ソーシャルメディア共有向け）
- Twitter Cardメタタグ
- 構造化データとJSON-LD
- 正規URL
- 言語とロケール指定

### 基本的なクラス構造

```php
namespace Xmf;

class Metagen
{
    protected $meta = [];
    protected $ogTags = [];
    protected $twitterTags = [];
    protected $jsonLd = [];
    protected $canonicalUrl;
    protected $language;

    public function __construct() {}

    public function setDescription(string $description): self {}

    public function setKeywords(string $keywords): self {}

    public function renderAll(): string {}
}
```

## 基本的な使用方法

### シンプルなメタタグ

```php
use Xmf\Metagen;

$metagen = new Metagen();

// 基本的なメタタグを設定
$metagen->setDescription('これは素晴らしいウェブサイトです');
$metagen->setKeywords('php, xoops, ウェブ開発');

// HTMLにレンダリング
echo $metagen->renderAll();

// 出力：
// <meta name="description" content="これは素晴らしいウェブサイトです" />
// <meta name="keywords" content="php, xoops, ウェブ開発" />
```

## Open Graphメタタグ

Open Graphタグはコンテンツをソーシャルメディアで共有する際の表示方法を制御します。

### 基本的なOpen Graphセットアップ

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', '素晴らしい記事');
$metagen->setOpenGraphProperty('og:description', 'Metagenを使用したSEO方法を学ぶ');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## 構造化データとJSON-LD

JSON-LDは検索エンジンがより正確に理解できる構造化データを提供します。

### 記事構造化データ

```php
$metagen = new Metagen();

$articleData = [
    '@context' => 'https://schema.org',
    '@type' => 'Article',
    'headline' => 'XOOPS 4.0の理解',
    'description' => 'XOOPSモダナイゼーションへの包括的なガイド',
    'image' => 'https://example.com/article.jpg',
    'datePublished' => '2026-01-31T10:00:00Z',
    'dateModified' => '2026-01-31T15:00:00Z',
    'author' => [
        '@type' => 'Person',
        'name' => 'ジョン開発者',
        'url' => 'https://example.com/author'
    ]
];

$metagen->setJsonLd($articleData);

echo $metagen->renderAll();
```

## モジュール統合例

### ブログ/記事モジュール

```php
namespace MyModule\Controller;

use Xmf\Metagen;
use MyModule\Repository\ArticleRepository;

class ArticleController
{
    public function viewAction($id)
    {
        $repository = new ArticleRepository();
        $article = $repository->getById($id);

        if (!$article) {
            return $this->notFound();
        }

        // Metagenを初期化
        $metagen = new Metagen();

        // 記事メタデータを設定
        $metagen->setTitle($article->getTitle());
        $metagen->setDescription(
            substr($article->getBody(), 0, 160)
        );
        $metagen->setKeywords(
            implode(', ', $article->getTags())
        );
        $metagen->setAuthor($article->getAuthorName());

        // Open Graph
        $metagen->setOpenGraphProperty('og:type', 'article');
        $metagen->setOpenGraphProperty('og:title', $article->getTitle());
        $metagen->setOpenGraphProperty('og:description', $article->getExcerpt());
        $metagen->setOpenGraphProperty('og:image', $article->getFeaturedImage());
        $metagen->setOpenGraphProperty('og:url', $article->getUrl());

        // 正規URL
        $metagen->setCanonicalUrl($article->getUrl());

        // テンプレートに保存
        $this->template['metagen'] = $metagen;

        return $this->render('article/view.php');
    }
}
```

## テンプレート統合

### テンプレート実装

```php
<!-- ヘッダーテンプレートで -->
<?php if (isset($metagen)): ?>
    <?php echo $metagen->renderAll(); ?>
<?php endif; ?>

<!-- 標準HTML構造 -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <?php echo $metagen->renderAll(); ?>
    <title><?php echo $metagen->getTitle(); ?></title>
</head>
<body>
    <!-- コンテンツ -->
</body>
</html>
```

## ベストプラクティス

### SEO最適化

1. **ユニークな説明** 各ページに異なる説明（150～160字）
2. **関連キーワード** ページごと5～10個のプライマリキーワード
3. **正規URL** 重複コンテンツの防止
4. **Open Graphタグ** ソーシャルメディア最適化
5. **構造化データ** 検索結果強化
6. **モバイルビューポート** レスポンシブデザイン用メタタグ

### 完全なSEO実装

```php
$metagen = new Metagen();

// 基本メタタグ
$metagen->setTitle('マイウェブサイト - ウェブ開発サービス');
$metagen->setDescription('プロフェッショナルなウェブ開発サービス');
$metagen->setKeywords('ウェブ開発, php, xoops');
$metagen->setAuthor('ジョン開発者');
$metagen->setLanguage('ja');

// 正規URL
$metagen->setCanonicalUrl('https://example.com/services/web-development');

// ソーシャル共有向けOpen Graph
$metagen->setOpenGraphProperty('og:title', 'ウェブ開発サービス');
$metagen->setOpenGraphProperty('og:description', 'プロフェッショナルサービス');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/og-image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/services/web-development');
$metagen->setOpenGraphProperty('og:type', 'website');

// Twitter Card
$metagen->setTwitterCard('summary_large_image');
$metagen->setTwitterProperty('twitter:site', '@mycompany');
$metagen->setTwitterProperty('twitter:title', 'ウェブ開発サービス');
$metagen->setTwitterProperty('twitter:image', 'https://example.com/twitter-image.jpg');

echo $metagen->renderAll();
```

## APIリファレンス

### コアメソッド

| メソッド | パラメータ | 戻り値 | 説明 |
|--------|-----------|---------|-------------|
| `setTitle()` | string | self | ページタイトル設定 |
| `setDescription()` | string | self | メタ説明設定 |
| `setKeywords()` | string | self | メタキーワード設定 |
| `setAuthor()` | string | self | 著者名設定 |
| `setCanonicalUrl()` | string | self | 正規URL設定 |
| `setLanguage()` | string | self | ページ言語設定 |
| `setViewport()` | string | self | ビューポート設定 |
| `setOpenGraphProperty()` | string, string | self | OGタグ追加 |
| `setTwitterCard()` | string | self | Twitterカードタイプ設定 |
| `setJsonLd()` | array | self | 構造化データ設定 |
| `renderAll()` | - | string | すべてのメタタグレンダリング |

## 関連ドキュメント

- Database - XMFデータベースリファレンス
- JWT - XMFのJWT認証
- ../../03-Module-Development/Best-Practices/Frontend-Integration - フロントエンド統合ベストプラクティス

## リソース

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org構造化データ](https://schema.org/)
- [Googleサーチセントラル](https://developers.google.com/search)

## バージョン情報

- **導入:** XOOPS 2.5.8
- **最後の更新:** XOOPS 4.0
- **互換性:** PHP 7.4+
