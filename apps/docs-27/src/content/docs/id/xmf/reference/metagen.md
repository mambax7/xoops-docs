---
title: "Kelas Metagen XMF"
description: "Pembuatan tag meta dan pembantu SEO di Kerangka XMF"
---

Kelas `Metagen` dalam Kerangka XMF menyediakan perangkat komprehensif untuk menghasilkan dan mengelola tag meta HTML, tag Grafik Terbuka, dan metadata terkait SEO lainnya.

## Ikhtisar Kelas

Kelas `Metagen` menangani:
- Tag meta HTML standar (deskripsi, kata kunci, dll.)
- Buka tag meta Grafik untuk berbagi sosial
- Tag meta Kartu Twitter
- Data terstruktur dan JSON-LD
- URL kanonik
- Spesifikasi bahasa dan lokal

### Struktur Kelas Dasar

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

## Penggunaan Dasar

### Tag Meta Sederhana

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

## Buka Tag Meta Grafik

Tag Open Graph membantu mengontrol tampilan konten saat dibagikan di media sosial.

### Pengaturan Grafik Terbuka Dasar

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## Data Terstruktur dan JSON-LD

JSON-LD menyediakan data terstruktur yang dapat lebih dipahami oleh mesin pencari.

### Data Terstruktur Artikel

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

## Contoh Integrasi module

### module Blog/Article

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

## Integrasi template

### Implementasi template

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

## Praktik Terbaik

### Optimasi SEO

1. **Deskripsi unik** untuk setiap halaman (150-160 karakter)
2. **Kata kunci yang relevan** (5-10 kata kunci utama per halaman)
3. **URL Kanonis** untuk mencegah duplikat konten
4. **Buka tag Grafik** untuk pengoptimalan media sosial
5. **Data terstruktur** untuk hasil penelusuran yang disempurnakan
6. Tag meta **Area pandang seluler** untuk desain responsif

### Implementasi SEO Lengkap

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

## Referensi API

### Metode core

| Metode | Parameter | Pengembalian | Deskripsi |
|--------|-----------|---------|-------------|
| `setTitle()` | tali | diri | Tetapkan judul halaman |
| `setDescription()` | tali | diri | Tetapkan deskripsi meta |
| `setKeywords()` | tali | diri | Tetapkan kata kunci meta |
| `setAuthor()` | tali | diri | Tetapkan nama penulis |
| `setCanonicalUrl()` | tali | diri | Setel URL |
| `setLanguage()` | tali | diri | Tetapkan bahasa halaman |
| `setViewport()` | tali | diri | Tetapkan pengaturan area pandang |
| `setOpenGraphProperty()` | tali, tali | diri | Tambahkan tag OG |
| `setTwitterCard()` | tali | diri | Tetapkan jenis kartu Twitter |
| `setJsonLd()` | susunan | diri | Tetapkan data terstruktur |
| `renderAll()` | - | tali | Render semua tag meta |

## Dokumentasi Terkait

- Basis Data - Referensi basis data XMF
- JWT - Otentikasi JWT di XMF
- ../../03-Module-Development/Best-Practices/front-end-Integration - Praktik terbaik integrasi front-end

## Sumber Daya

- [Protokol Grafik Terbuka](https://ogp.me/)
- [Dokumentasi Kartu Twitter](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Data Terstruktur Schema.org](https://schema.org/)
- [Pusat Penelusuran Google](https://developers.google.com/search)

## Informasi Versi

- **Diperkenalkan:** XOOPS 2.5.8
- **Terakhir Diperbarui:** XOOPS 4.0
- **Kompatibilitas:** PHP 7.4+
