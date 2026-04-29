---
title: "XMF Kelas Metagen"
description: "Penjanaan tag meta dan SEO pembantu dalam Rangka Kerja XMF"
---
Kelas `Metagen` dalam Rangka Kerja XMF menyediakan kit alat yang komprehensif untuk menjana dan mengurus teg meta HTML, teg Graf Terbuka dan metadata lain yang berkaitan dengan SEO.

## Gambaran Keseluruhan Kelas

Kelas `Metagen` mengendalikan:
- Teg meta standard HTML (huraian, kata kunci, dsb.)
- Buka tag meta Graf untuk perkongsian sosial
- Tag meta Kad Twitter
- Data berstruktur dan JSON-LD
- URL kanonik
- Spesifikasi bahasa dan tempat

### Struktur Kelas Asas
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
## Penggunaan Asas

### Tag Meta Mudah
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
## Buka Tag Meta Graf

Teg Graf Terbuka membantu mengawal cara kandungan dipaparkan apabila dikongsi di media sosial.

### Persediaan Graf Terbuka Asas
```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```
## Data Berstruktur dan JSON-LD

JSON-LD menyediakan data berstruktur yang boleh difahami dengan lebih baik oleh enjin carian.

### Data Berstruktur Artikel
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
## Contoh Integrasi Modul

### Blog/Article Modul
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
## Integrasi Templat

### Pelaksanaan Templat
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
## Amalan Terbaik

### SEO Pengoptimuman

1. **Penerangan unik** untuk setiap halaman (150-160 aksara)
2. **Kata kunci yang berkaitan** (5-10 kata kunci utama setiap halaman)
3. **URL Kanonik** untuk menghalang kandungan pendua
4. **Buka teg Graf** untuk pengoptimuman media sosial
5. **Data berstruktur** untuk hasil carian yang dipertingkatkan
6. **Port pandangan mudah alih** teg meta untuk reka bentuk responsif

### Lengkap SEO Pelaksanaan
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
## API Rujukan

### Kaedah Teras

| Kaedah | Parameter | Kembali | Penerangan |
|--------|-----------|---------|-------------|
| `setTitle()` | rentetan | diri | Tetapkan tajuk halaman |
| `setDescription()` | rentetan | diri | Tetapkan perihalan meta |
| `setKeywords()` | rentetan | diri | Tetapkan kata kunci meta |
| `setAuthor()` | rentetan | diri | Tetapkan nama pengarang |
| `setCanonicalUrl()` | rentetan | diri | Tetapkan kanonik URL |
| `setLanguage()` | rentetan | diri | Tetapkan bahasa halaman |
| `setViewport()` | rentetan | diri | Tetapkan tetapan viewport |
| `setOpenGraphProperty()` | rentetan, rentetan | diri | Tambah tag OG |
| `setTwitterCard()` | rentetan | diri | Tetapkan jenis kad Twitter |
| `setJsonLd()` | tatasusunan | diri | Tetapkan data berstruktur |
| `renderAll()` | - | rentetan | Render semua teg meta |

## Dokumentasi Berkaitan

- Pangkalan data - XMF rujukan pangkalan data
- JWT - JWT pengesahan dalam XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - Amalan terbaik penyepaduan bahagian hadapan

## Sumber

- [Protokol Graf Terbuka](https://ogp.me/)
- [Dokumentasi Kad Twitter](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Data Berstruktur Schema.org](https://schema.org/)
- [Pusat Carian Google](https://developers.google.com/search)## Maklumat Versi

- **Diperkenalkan:** XOOPS 2.5.8
- **Terakhir dikemas kini:** XOOPS 4.0
- **Keserasian:** PHP 7.4+