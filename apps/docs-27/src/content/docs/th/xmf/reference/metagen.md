---
title: "XMF คลาสเมตาเจน"
description: "การสร้างเมตาแท็กและตัวช่วย SEO ในเฟรมเวิร์ก XMF"
---
คลาส `Metagen` ในเฟรมเวิร์ก XMF¤ มีชุดเครื่องมือที่ครอบคลุมสำหรับการสร้างและจัดการเมตาแท็ก HTML แท็ก Open Graph และข้อมูลเมตาอื่นๆ ที่เกี่ยวข้องกับ SEO

## ภาพรวมชั้นเรียน

คลาส `Metagen` จัดการ:
- เมตาแท็ก HTML มาตรฐาน (คำอธิบาย คำหลัก ฯลฯ)
- เปิดเมตาแท็กกราฟสำหรับการแบ่งปันทางสังคม
- เมตาแท็กการ์ด Twitter
- ข้อมูลที่มีโครงสร้างและ JSON-LD
- URL ตามรูปแบบบัญญัติ
- ข้อกำหนดภาษาและสถานที่

### โครงสร้างชั้นเรียนขั้นพื้นฐาน
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
## การใช้งานขั้นพื้นฐาน

### เมตาแท็กอย่างง่าย
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
## เปิดเมตาแท็กกราฟ

แท็ก Open Graph ช่วยควบคุมลักษณะที่ปรากฏของเนื้อหาเมื่อแชร์บนโซเชียลมีเดีย

### การตั้งค่ากราฟเปิดขั้นพื้นฐาน
```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```
## ข้อมูลที่มีโครงสร้างและ JSON-LD

JSON-LD ให้ข้อมูลที่มีโครงสร้างซึ่งเครื่องมือค้นหาสามารถเข้าใจได้ดีขึ้น

### ข้อมูลที่มีโครงสร้างบทความ
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
## ตัวอย่างการรวมโมดูล

### บล็อก/โมดูลบทความ
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
## การรวมเทมเพลต

### การใช้งานเทมเพลต
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
## แนวทางปฏิบัติที่ดีที่สุด

### SEO การเพิ่มประสิทธิภาพ

1. **คำอธิบายที่ไม่ซ้ำกัน** สำหรับแต่ละหน้า (150-160 ตัวอักษร)
2. **คำหลักที่เกี่ยวข้อง** (คำหลัก 5-10 คำต่อหน้า)
3. **Canonical URL** เพื่อป้องกันเนื้อหาที่ซ้ำกัน
4. **เปิดแท็กกราฟ** สำหรับการเพิ่มประสิทธิภาพโซเชียลมีเดีย
5. **ข้อมูลที่มีโครงสร้าง** สำหรับผลการค้นหาที่ได้รับการปรับปรุง
6. เมตาแท็ก **วิวพอร์ตมือถือ** สำหรับการออกแบบที่ตอบสนอง

### ดำเนินการ SEO ให้เสร็จสมบูรณ์
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
## API ข้อมูลอ้างอิง

### วิธีการหลัก

| วิธีการ | พารามิเตอร์ | ส่งคืน | คำอธิบาย |
|--------|-----------|---------|-------------|
| `setTitle()` | สตริง | ตัวเอง | ตั้งชื่อหน้า |
| `setDescription()` | สตริง | ตัวเอง | ตั้งค่าคำอธิบายเมตา |
| `setKeywords()` | สตริง | ตัวเอง | ตั้งค่าเมตาคีย์เวิร์ด |
| `setAuthor()` | สตริง | ตัวเอง | ตั้งชื่อผู้แต่ง |
| `setCanonicalUrl()` | สตริง | ตัวเอง | ตั้งค่าตามรูปแบบบัญญัติ URL |
| `setLanguage()` | สตริง | ตัวเอง | ตั้งค่าภาษาของหน้า |
| `setViewport()` | สตริง | ตัวเอง | ตั้งค่าการตั้งค่าวิวพอร์ต |
| `setOpenGraphProperty()` | สตริง, สตริง | ตัวเอง | เพิ่มแท็ก OG |
| `setTwitterCard()` | สตริง | ตัวเอง | ตั้งค่าประเภทการ์ด Twitter |
| `setJsonLd()` | อาร์เรย์ | ตัวเอง | ตั้งค่าข้อมูลที่มีโครงสร้าง |
| `renderAll()` | - | สตริง | แสดงเมตาแท็กทั้งหมด |

## เอกสารที่เกี่ยวข้อง

- ฐานข้อมูล - การอ้างอิงฐานข้อมูล XMF
- JWT - JWT การรับรองความถูกต้องใน XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - ../../03-Module-Development/Best-Practices/Frontend-Integration

## แหล่งข้อมูล

- [โปรโตคอล Open Graph](https://ogp.me/)
- [เอกสารประกอบการ์ด Twitter](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [ข้อมูลที่มีโครงสร้างของ Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

## ข้อมูลเวอร์ชัน

- **แนะนำ:** XOOPS 2.5.8
- **อัปเดตล่าสุด:** XOOPS 4.0
- **ความเข้ากันได้:** PHP 7.4+