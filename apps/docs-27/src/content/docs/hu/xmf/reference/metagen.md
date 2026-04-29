---
title: "XMF Metagen osztály"
description: "Meta címkegenerálás és SEO segítők az XMF-keretrendszerben"
---
A `Metagen` osztály a XMF Frameworkben átfogó eszközkészletet biztosít a HTML metacímkék, Open Graph címkék és egyéb SEO-val kapcsolatos metaadatok generálásához és kezeléséhez.

## Osztály áttekintése

A `Metagen` osztály kezeli:
- Szabványos HTML metacímkék (leírás, kulcsszavak stb.)
- Nyissa meg a Graph metacímkéket a közösségi megosztáshoz
- Twitter kártya metacímkék
- Strukturált adatok és JSON-LD
- Kanonikus URL-ek
- Nyelvi és területi előírások

### Alap osztálystruktúra

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

## Alapvető használat

### Egyszerű metacímkék

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

## Graph metacímkék megnyitása

Az Open Graph címkék segítenek szabályozni, hogy a tartalom hogyan jelenjen meg a közösségi médiában.

### Alapvető Open Graph beállítás

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## Strukturált adatok és JSON-LD

A JSON-LD strukturált adatokat biztosít, amelyeket a keresőmotorok jobban megértenek.

### Cikk strukturált adatok

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

## Példák a modul integrációjára

### Blog/Article modul

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

## Sablonintegráció

### Sablon megvalósítása

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

## Bevált gyakorlatok

### SEO Optimalizálás

1. **Egyedi leírások** minden oldalhoz (150-160 karakter)
2. **Releváns kulcsszavak** (oldalonként 5-10 elsődleges kulcsszó)
3. **Kononikus URL-ek** az ismétlődő tartalom megakadályozására
4. **Open Graph tags** a közösségi média optimalizálásához
5. **Strukturált adatok** a továbbfejlesztett keresési eredmények érdekében
6. **Mobil nézetablak** metacímke a reszponzív tervezéshez

### Teljes SEO megvalósítás

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

## API Referencia

### Alapvető módszerek

| Módszer | Paraméterek | Visszatér | Leírás |
|--------|-----------|---------|--------------|
| `setTitle()` | húr | saját | Oldal címének beállítása |
| `setDescription()` | húr | saját | Meta leírás beállítása |
| `setKeywords()` | húr | saját | Meta kulcsszavak beállítása |
| `setAuthor()` | húr | saját | A szerző nevének beállítása |
| `setCanonicalUrl()` | húr | saját | Állítsa be a kanonikus URL |
| `setLanguage()` | húr | saját | Az oldal nyelvének beállítása |
| `setViewport()` | húr | saját | Nézetablak beállításainak megadása |
| `setOpenGraphProperty()` | húr, húr | saját | OG címke hozzáadása |
| `setTwitterCard()` | húr | saját | Twitter-kártyatípus beállítása |
| `setJsonLd()` | tömb | saját | Strukturált adatok beállítása |
| `renderAll()` | - | húr | Az összes metacímke megjelenítése |

## Kapcsolódó dokumentáció

- Adatbázis - XMF adatbázis hivatkozás
- JWT - JWT hitelesítés a XMF-ban
- ../../03-module-Development/Best-Practices/Frontend-Integration - A frontend integráció bevált gyakorlatai

## Források

- [Open Graph Protocol](https://ogp.me/)
- [Twitter-kártya dokumentációja](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org strukturált adatok](https://schema.org/)
- [Google Keresőközpont](https://developers.google.com/search)

## Verzióinformáció

- **Bevezetés:** XOOPS 2.5.8
- **Utolsó frissítés:** XOOPS 4.0
- **Kompatibilitás:** PHP 7.4+
