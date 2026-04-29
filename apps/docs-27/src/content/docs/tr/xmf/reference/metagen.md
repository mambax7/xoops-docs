---
title: "XMF Metagen Sınıfı"
description: "XMF Çerçevesinde meta etiket oluşturma ve SEO yardımcıları"
---
XMF Çerçevesindeki `Metagen` sınıfı, HTML meta etiketleri, Açık Grafik etiketleri ve SEO ile ilgili diğer meta verileri oluşturmak ve yönetmek için kapsamlı bir araç seti sağlar.

## Sınıfa Genel Bakış

`Metagen` sınıfı şunları yönetir:
- Standart HTML meta etiketleri (açıklama, anahtar kelimeler vb.)
- Sosyal paylaşım için Grafik meta etiketlerini açın
- Twitter Kartı meta etiketleri
- Yapılandırılmış veriler ve JSON-LD
- Kanonik URLs
- Dil ve yerel ayar özellikleri

### Temel Sınıf Yapısı
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
## Temel Kullanım

### Basit Meta Etiketleri
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
## Grafik Meta Etiketlerini Aç

Açık Grafik etiketleri, içeriğin sosyal medyada paylaşıldığında nasıl görüneceğini kontrol etmenize yardımcı olur.

### Temel Açık Grafik Kurulumu
```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```
## Yapılandırılmış Veri ve JSON-LD

JSON-LD, arama motorlarının daha iyi anlayabileceği yapılandırılmış veriler sağlar.

### Makale Yapılandırılmış Verileri
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
## module Entegrasyon Örnekleri

### Blog/Article Modülü
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
## template Entegrasyonu

### template Uygulaması
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
## En İyi Uygulamalar

### SEO Optimizasyon

1. **Her sayfa için benzersiz açıklamalar** (150-160 karakter)
2. **Alakalı anahtar kelimeler** (sayfa başına 5-10 birincil anahtar kelime)
3. **Yinelenen içeriği önlemek için Canonical URLs**
4. Sosyal medya optimizasyonu için **Grafik etiketlerini açın**
5. Gelişmiş arama sonuçları için **yapılandırılmış veriler**
6. Duyarlı tasarım için **Mobil görünüm** meta etiketi

### Tamamlandı SEO Uygulama
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
## API Referans

### Temel Yöntemler

| Yöntem | Parametreler | İade | Açıklama |
|----------|-----------|-----------|-------------|
| `setTitle()` | dize | öz | Sayfa başlığını ayarla |
| `setDescription()` | dize | öz | Meta açıklamayı ayarla |
| `setKeywords()` | dize | öz | Meta anahtar kelimeleri ayarlayın |
| `setAuthor()` | dize | öz | Yazar adını ayarla |
| `setCanonicalUrl()` | dize | öz | Kurallı ayarla URL |
| `setLanguage()` | dize | öz | Sayfa dilini ayarla |
| `setViewport()` | dize | öz | Görüntü alanı ayarlarını belirleyin |
| `setOpenGraphProperty()` | dize, dize | öz | OG etiketi ekle |
| `setTwitterCard()` | dize | öz | Twitter kartı türünü ayarlayın |
| `setJsonLd()` | dizi | öz | Yapılandırılmış verileri ayarlayın |
| `renderAll()` | - | dize | Tüm meta etiketleri oluştur |

## İlgili Belgeler

- database - XMF database referansı
- JWT - JWT, XMF'de kimlik doğrulama
- ../../03-Module-Development/Best-Practices/Frontend-Integration - Ön uç entegrasyonu için en iyi uygulamalar

## Kaynaklar

- [Grafik Protokolünü Aç](https://ogp.me/)
- [Twitter Kartı Belgeleri](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org Yapılandırılmış Verileri](https://schema.org/)
- [Google Arama Merkezi](https://developers.google.com/search)

## Sürüm Bilgisi

- **Tanıtılan:** XOOPS 2.5.8
- **Son Güncelleme:** XOOPS 4.0
- **Uyumluluk:** PHP 7.4+