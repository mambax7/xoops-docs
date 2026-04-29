---
title：“XMF Metagen 类”
description：“XMF框架中的元标记生成和SEO助手”
---

XMF框架中的`Metagen`类提供了一个全面的工具包，用于生成和管理HTML元标签、开放图标签和其他SEO-related元数据。

## 类概述

`Metagen`类句柄：
- 标准HTML元标签（描述、关键字等）
- 用于社交共享的开放图元标签
- Twitter 卡元标签
- 结构化数据和JSON-LD
- 规范 URL
- 语言和区域设置规范

### 基本类结构

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

### 简单元标签

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

## 打开图元标签

开放图谱标签有助于控制内容在社交媒体上共享时的显示方式。

### 基本开放图设置

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## 结构化数据和 JSON-LD

JSON-LD提供搜索引擎可以更好理解的结构化数据。

### 文章结构化数据

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

## 模区块集成示例

### Blog/Article 模区块

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

## 模板集成

### 模板实现

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

## 最佳实践

### SEO 优化

1. **每页都有独特的描述**（150-160 个字符）
2. **相关关键词**（每页5-10个主要关键词）
3. **规范 URL** 用于防止重复内容
4. **开放图谱标签**用于社交媒体优化
5. **结构化数据**用于增强搜索结果
6. **移动视口**用于响应式设计的元标记

### 完成SEO实施

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

## API 参考

### 核心方法

|方法|参数|返回|描述 |
|--------|---------|---------|-------------|
| `setTitle()` |字符串|自我|设置页面标题 |
| `setDescription()` |字符串|自我|设置元描述 |
| `setKeywords()`|字符串|自我|设置元关键字 |
| `setAuthor()` |字符串|自我|设置作者姓名 |
| `setCanonicalUrl()`|字符串|自我|设置规范URL |
| `setLanguage()`|字符串|自我|设置页面语言 |
| `setViewport()` |字符串|自我|设置视口设置 |
| `setOpenGraphProperty()` |字符串，字符串 |自我|添加 OG 标签 |
| `setTwitterCard()` |字符串|自我|设置 Twitter 卡片类型 |
| `setJsonLd()` |数组|自我|设置结构化数据|
| `renderAll()` | - |字符串|渲染所有元标记 |

## 相关文档

- 数据库 - XMF 数据库参考
- JWT - JWT XMF 中的身份验证
- ../../03-Module-Development/Best-Practices/Frontend-Integration - 前端集成最佳实践

## 资源

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org Structured Data](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

## 版本信息

- **引入：** XOOPS 2.5.8
- **最后更新：** XOOPS 4.0
- **兼容性：** PHP 7.4+