---
title: "Lớp Metagen XMF"
description: "Trình trợ giúp tạo thẻ meta và SEO trong Khung XMF"
---
`Metagen` class trong XMF Framework cung cấp bộ công cụ toàn diện để tạo và quản lý thẻ meta HTML, thẻ Open Graph và các siêu dữ liệu khác liên quan đến SEO.

## Tổng quan về lớp học

`Metagen` class xử lý:
- Thẻ meta HTML tiêu chuẩn (mô tả, từ khóa, v.v.)
- Mở thẻ meta đồ thị để chia sẻ trên mạng xã hội
- Thẻ meta Thẻ Twitter
- Dữ liệu có cấu trúc và JSON-LD
- URL chuẩn
- Thông số ngôn ngữ và địa phương

### Cấu trúc lớp cơ bản

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

## Cách sử dụng cơ bản

### Thẻ Meta đơn giản

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

## Thẻ Meta đồ thị mở

Thẻ Open Graph giúp kiểm soát cách nội dung xuất hiện khi chia sẻ trên mạng xã hội.

### Thiết lập đồ thị mở cơ bản

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## Dữ liệu có cấu trúc và JSON-LD

JSON-LD cung cấp dữ liệu có cấu trúc mà các công cụ tìm kiếm có thể hiểu rõ hơn.

### Dữ liệu có cấu trúc bài viết

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

## Ví dụ về tích hợp mô-đun

### Mô-đun Blog/Bài viết

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

## Tích hợp mẫu

### Triển khai mẫu

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

## Các phương pháp hay nhất

### Tối ưu hóa SEO

1. **Mô tả duy nhất** cho mỗi trang (150-160 ký tự)
2. **Từ khóa liên quan** (5-10 từ khóa chính trên mỗi trang)
3. **URL chuẩn** để ngăn chặn nội dung trùng lặp
4. **Mở thẻ đồ thị** để tối ưu hóa phương tiện truyền thông xã hội
5. **Dữ liệu có cấu trúc** cho kết quả tìm kiếm nâng cao
6. Thẻ meta **Chế độ xem trên thiết bị di động** dành cho thiết kế đáp ứng

### Triển khai SEO hoàn chỉnh

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

## Tham khảo API

### Phương pháp cốt lõi

| Phương pháp | Thông số | Trả về | Mô tả |
|--------|-------------|---------|-------------|
| `setTitle()` | chuỗi | tự | Đặt tiêu đề trang |
| `setDescription()` | chuỗi | tự | Đặt mô tả meta |
| `setKeywords()` | chuỗi | tự | Đặt từ khóa meta |
| `setAuthor()` | chuỗi | tự | Đặt tên tác giả |
| `setCanonicalUrl()` | chuỗi | tự | Đặt URL chuẩn |
| `setLanguage()` | chuỗi | tự | Đặt trang language |
| `setViewport()` | chuỗi | tự | Đặt cài đặt khung nhìn |
| `setOpenGraphProperty()` | chuỗi, chuỗi | tự | Thêm thẻ OG |
| `setTwitterCard()` | chuỗi | tự | Đặt loại thẻ Twitter |
| `setJsonLd()` | mảng | tự | Đặt dữ liệu có cấu trúc |
| `renderAll()` | - | chuỗi | Kết xuất tất cả các thẻ meta |

## Tài liệu liên quan

- Cơ sở dữ liệu - Tham khảo cơ sở dữ liệu XMF
- JWT - Xác thực JWT trong XMF
- ../../03-Module-Development/Best-Thực hành/Frontend-Integration - Các phương pháp hay nhất về tích hợp giao diện người dùng

## Tài nguyên

- [Giao thức đồ thị mở](https://ogp.me/)
- [Tài liệu về thẻ Twitter](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Dữ liệu có cấu trúc Schema.org](https://schema.org/)
- [Trung tâm Google Tìm kiếm](https://developers.google.com/search)

## Thông tin phiên bản

- **Giới thiệu:** XOOPS 2.5.8
- **Cập nhật lần cuối:** XOOPS 4.0
- **Khả năng tương thích:** PHP 7.4+