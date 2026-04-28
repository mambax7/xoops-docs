---
title: "فئة XMF Metagen"
description: "توليد العلامات الوصفية وأدوات تحسين محركات البحث في إطار عمل XMF"
dir: rtl
lang: ar
---

توفر فئة `Metagen` في إطار عمل XMF مجموعة أدوات شاملة لإنشاء وإدارة علامات HTML الوصفية وعلامات Open Graph وبيانات وصفية أخرى ذات صلة بتحسين محركات البحث.

## نظرة عامة على الفئة

تتعامل فئة `Metagen` مع:
- علامات HTML الوصفية القياسية (الوصف والكلمات الرئيسية وغيرها)
- علامات Open Graph الوصفية لمشاركة وسائل التواصل الاجتماعي
- علامات Twitter Card الوصفية
- البيانات المنظمة وJSON-LD
- عناوين URL الكنسية
- مواصفات اللغة والإقليمية

### هيكل الفئة الأساسي

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

## الاستخدام الأساسي

### علامات وصفية بسيطة

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

## علامات Open Graph الوصفية

تساعد علامات Open Graph على التحكم في كيفية ظهور المحتوى عند مشاركته على وسائل التواصل الاجتماعي.

### إعداد Open Graph الأساسي

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## البيانات المنظمة وJSON-LD

يوفر JSON-LD بيانات منظمة يمكن لمحركات البحث فهمها بشكل أفضل.

### بيانات المقالة المنظمة

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

## أمثلة تكامل الوحدة

### وحدة مدونة/مقالات

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

## تكامل القالب

### تنفيذ القالب

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

## أفضل الممارسات

### تحسين محركات البحث

1. **أوصاف فريدة** لكل صفحة (150-160 حرفاً)
2. **كلمات رئيسية ذات صلة** (5-10 كلمات رئيسية أساسية لكل صفحة)
3. **عناوين URL الكنسية** لمنع المحتوى المكرر
4. **علامات Open Graph** لتحسين وسائل التواصل الاجتماعي
5. **البيانات المنظمة** لتحسين نتائج البحث
6. **علامة عرض الهاتف المحمول** لتصميم الويب المتجاوب

### تنفيذ SEO الكامل

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

## مرجع API

### الطرق الأساسية

| الطريقة | المعاملات | العودة | الوصف |
|--------|-----------|---------|-------------|
| `setTitle()` | string | self | تعيين عنوان الصفحة |
| `setDescription()` | string | self | تعيين وصف البيانات الوصفية |
| `setKeywords()` | string | self | تعيين كلمات البيانات الوصفية الرئيسية |
| `setAuthor()` | string | self | تعيين اسم المؤلف |
| `setCanonicalUrl()` | string | self | تعيين