---
title: "XMF Metagen 類別"
description: "XMF 框架中的中繼標籤產生和 SEO 協助者"
---

XMF 框架中的 `Metagen` 類別提供了全面的工具組，用於產生和管理 HTML 中繼標籤、Open Graph 標籤和其他 SEO 相關的中繼資料。

## 類別概述

`Metagen` 類別處理：
- 標準 HTML 中繼標籤 (說明、關鍵字等)
- 用於社交分享的 Open Graph 中繼標籤
- Twitter Card 中繼標籤
- 結構化資料和 JSON-LD
- 正規 URL
- 語言和地區規格

### 基本類別結構

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

## 基本用法

### 簡單中繼標籤

```php
use Xmf\Metagen;

$metagen = new Metagen();

// Set basic meta tags
$metagen->setDescription('This is my awesome website');
$metagen->setKeywords('php, xoops, web development');

// Render to HTML
echo $metagen->renderAll();

// Output:
// <meta name="description" content="This is my awesome website" />
// <meta name="keywords" content="php, xoops, web development" />
```

## Open Graph 中繼標籤

Open Graph 標籤有助於控制內容在社交媒體上共享時的顯示方式。

### 基本 Open Graph 設定

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## 結構化資料和 JSON-LD

JSON-LD 提供結構化資料，搜尋引擎可以更好地理解。

### 文章結構化資料

```php
$metagen = new Metagen();

$articleData = [
    '@context' => 'https://schema.org',
    '@type' => 'Article',
    'headline' => 'Understanding XOOPS 4.0',
    'description' => 'A comprehensive guide to XOOPS modernization',
    'image' => 'https://example.com/article.jpg',
    'datePublished' => '2026-01-31T10:00:00Z',
    'dateModified' => '2026-01-31T15:00:00Z',
    'author' => [
        '@type' => 'Person',
        'name' => 'John Developer',
        'url' => 'https://example.com/author'
    ]
];

$metagen->setJsonLd($articleData);

echo $metagen->renderAll();
```

## 模組整合範例

### 部落格/文章模組

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

        // Initialize Metagen
        $metagen = new Metagen();

        // Set article metadata
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

        // Canonical URL
        $metagen->setCanonicalUrl($article->getUrl());

        // Store in template
        $this->template['metagen'] = $metagen;

        return $this->render('article/view.php');
    }
}
```

## 樣板整合

### 樣板實作

```php
<!-- In your template header -->
<?php if (isset($metagen)): ?>
    <?php echo $metagen->renderAll(); ?>
<?php endif; ?>

<!-- Standard HTML structure -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <?php echo $metagen->renderAll(); ?>
    <title><?php echo $metagen->getTitle(); ?></title>
</head>
<body>
    <!-- Content -->
</body>
</html>
```

## 最佳實踐

### SEO 優化

1. **唯一描述** 用於每個頁面 (150-160 個字元)
2. **相關關鍵字** (每頁 5-10 個主要關鍵字)
3. **正規 URL** 用於防止重複內容
4. **Open Graph 標籤** 用於社交媒體優化
5. **結構化資料** 用於增強搜尋結果
6. **行動檢視區** 中繼標籤用於回應式設計

### 完整 SEO 實作

```php
$metagen = new Metagen();

// Basic meta tags
$metagen->setTitle('My Website - Web Development Services');
$metagen->setDescription('Professional web development services');
$metagen->setKeywords('web development, php, xoops');
$metagen->setAuthor('John Developer');
$metagen->setLanguage('en');

// Canonical URL
$metagen->setCanonicalUrl('https://example.com/services/web-development');

// Open Graph for social sharing
$metagen->setOpenGraphProperty('og:title', 'Web Development Services');
$metagen->setOpenGraphProperty('og:description', 'Professional services');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/og-image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/services/web-development');
$metagen->setOpenGraphProperty('og:type', 'website');

// Twitter Card
$metagen->setTwitterCard('summary_large_image');
$metagen->setTwitterProperty('twitter:site', '@mycompany');
$metagen->setTwitterProperty('twitter:title', 'Web Development Services');
$metagen->setTwitterProperty('twitter:image', 'https://example.com/twitter-image.jpg');

echo $metagen->renderAll();
```

## API 參考資料

### 核心方法

| 方法 | 參數 | 傳回 | 說明 |
|--------|-----------|---------|-------------|
| `setTitle()` | string | self | 設定頁面標題 |
| `setDescription()` | string | self | 設定中繼描述 |
| `setKeywords()` | string | self | 設定中繼關鍵字 |
| `setAuthor()` | string | self | 設定作者名稱 |
| `setCanonicalUrl()` | string | self | 設定正規 URL |
| `setLanguage()` | string | self | 設定頁面語言 |
| `setViewport()` | string | self | 設定檢視區設定 |
| `setOpenGraphProperty()` | string, string | self | 新增 OG 標籤 |
| `setTwitterCard()` | string | self | 設定 Twitter 卡片類型 |
| `setJsonLd()` | array | self | 設定結構化資料 |
| `renderAll()` | - | string | 呈現所有中繼標籤 |

## 相關文件

- Database - XMF 資料庫參考
- JWT - XMF 中的 JWT 認證
- ../../03-Module-Development/Best-Practices/Frontend-Integration - 前端整合最佳實踐

## 資源

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card 文件](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org 結構化資料](https://schema.org/)
- [Google 搜尋中心](https://developers.google.com/search)

## 版本資訊

- **引入：** XOOPS 2.5.8
- **上次更新：** XOOPS 4.0
- **相容性：** PHP 7.4+
