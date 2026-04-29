---
title: "کلاس متاژن XMF"
description: "تولید متا تگ و یاران سئو در چارچوب XMF"
---
کلاس `Metagen` در چارچوب XMF یک جعبه ابزار جامع برای تولید و مدیریت متا تگ های HTML، تگ های Open Graph و سایر ابرداده های مرتبط با SEO ارائه می دهد.

## نمای کلی کلاس

دسته `Metagen` شامل موارد زیر است:
- متا تگ های استاندارد HTML (توضیحات، کلمات کلیدی و غیره)
- متا تگ های Graph را برای اشتراک گذاری اجتماعی باز کنید
- متا تگ های کارت توییتر
- داده های ساخت یافته و JSON-LD
- URL های متعارف
- مشخصات زبان و محل

### ساختار کلاس پایه

```php
namespace XMF;

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

## استفاده اولیه

### متا تگ های ساده

```php
use XMF\Metagen;

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

## متا تگ های گراف را باز کنید

تگ‌های گراف باز به کنترل نحوه نمایش محتوا هنگام اشتراک‌گذاری در رسانه‌های اجتماعی کمک می‌کنند.

### تنظیم اولیه نمودار باز

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## داده های ساخت یافته و JSON-LD

JSON-LD داده های ساختاری را ارائه می دهد که موتورهای جستجو بهتر می توانند آن ها را درک کنند.

### داده های ساخت یافته مقاله

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

## نمونه های ادغام ماژول

### ماژول Blog/Article

```php
namespace MyModule\Controller;

use XMF\Metagen;
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

## یکپارچه سازی قالب

### پیاده سازی قالب

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

## بهترین شیوه ها

### بهینه سازی سئو

1. **توضیحات منحصر به فرد** برای هر صفحه (150-160 کاراکتر)
2. **کلمات کلیدی مرتبط** (5-10 کلمه کلیدی اصلی در هر صفحه)
3. ** URL های متعارف ** برای جلوگیری از محتوای تکراری
4. **برچسب های Graph** را برای بهینه سازی رسانه های اجتماعی باز کنید
5. **داده های ساختاریافته** برای نتایج جستجوی پیشرفته
6. **نمایش موبایل** متا تگ برای طراحی واکنشگرا

### پیاده سازی کامل سئو

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

### روشهای اصلی

| روش | پارامترها | بازگشت | توضیحات |
|--------|----------|---------|-------------|
| `setTitle()` | رشته | خود | تنظیم عنوان صفحه |
| `setDescription()` | رشته | خود | مجموعه توضیحات متا |
| `setKeywords()` | رشته | خود | تنظیم متا کلمات کلیدی |
| `setAuthor()` | رشته | خود | تنظیم نام نویسنده |
| `setCanonicalUrl()` | رشته | خود | تنظیم URL متعارف |
| `setLanguage()` | رشته | خود | تنظیم زبان صفحه |
| `setViewport()` | رشته | خود | تنظیم تنظیمات viewport |
| `setOpenGraphProperty()` | رشته، رشته | خود | اضافه کردن تگ OG |
| `setTwitterCard()` | رشته | خود | تنظیم نوع کارت توییتر |
| `setJsonLd()` | آرایه | خود | تنظیم داده های ساخت یافته |
| `renderAll()` | - | رشته | رندر تمام متا تگ ها |

## مستندات مرتبط

- پایگاه داده - مرجع پایگاه داده XMF
- JWT - احراز هویت JWT در XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - بهترین شیوه های یکپارچه سازی Frontend

## منابع

- [پروتکل باز نمودار](https://ogp.me/)
- [اسناد کارت توییتر](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [داده های ساختار یافته Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

## اطلاعات نسخه

- **معرفی شد:** XOOPS 2.5.8
- **آخرین به روز رسانی:** XOOPS 4.0
- **سازگاری:** PHP 7.4+