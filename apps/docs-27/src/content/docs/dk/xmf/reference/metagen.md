---
title: "XMF Metagen Class"
description: "Meta tag generation og SEO hjælpere i XMF Framework"
---

Klassen `Metagen` i XMF Framework giver et omfattende værktøjssæt til at generere og administrere HTML-metatags, Open Graph-tags og andre SEO-relaterede metadata.

## Klasseoversigt

Klassen `Metagen` håndterer:
- Standard HTML metatags (beskrivelse, nøgleord osv.)
- Åbn Graph-metatags til social deling
- Twitter Card meta tags
- Strukturerede data og JSON-LD
- Kanoniske URL'er
- Sprog- og lokalitetsspecifikationer

### Grundlæggende klassestruktur

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

## Grundlæggende brug

### Simple Meta Tags

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

## Åbn Graph Meta Tags

Open Graph-tags hjælper med at kontrollere, hvordan indhold vises, når det deles på sociale medier.

### Basic Open Graph Setup

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## Strukturerede data og JSON-LD

JSON-LD leverer strukturerede data, som søgemaskiner bedre kan forstå.

### Artikelstrukturerede data

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

## Eksempler på modulintegration

### Blog/Artikelmodul

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

## Skabelonintegration

### Skabelonimplementering

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

## Bedste praksis

### SEO Optimering

1. **Unikke beskrivelser** for hver side (150-160 tegn)
2. **Relevante søgeord** (5-10 primære søgeord pr. side)
3. **Kanoniske URL'er** til at forhindre duplikeret indhold
4. **Open Graph-tags** til optimering af sociale medier
5. **Strukturerede data** for forbedrede søgeresultater
6. **Mobil viewport** metatag til responsivt design

### Fuldfør SEO-implementering

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

## API Reference

### Kernemetoder

| Metode | Parametre | Returnerer | Beskrivelse |
|--------|--------|--------|--------|
| `setTitle()` | streng | selv | Indstil sidetitel |
| `setDescription()` | streng | selv | Indstil metabeskrivelse |
| `setKeywords()` | streng | selv | Indstil meta søgeord |
| `setAuthor()` | streng | selv | Indstil forfatternavn |
| `setCanonicalUrl()` | streng | selv | Indstil kanonisk URL |
| `setLanguage()` | streng | selv | Indstil sidesprog |
| `setViewport()` | streng | selv | Indstil visningsportindstillinger |
| `setOpenGraphProperty()` | snor, snor | selv | Tilføj OG-tag |
| `setTwitterCard()` | streng | selv | Indstil Twitter-korttype |
| `setJsonLd()` | række | selv | Indstil strukturerede data |
| `renderAll()` | - | streng | Gengiv alle metatags |

## Relateret dokumentation

- Database - XMF databasereference
- JWT - JWT-godkendelse i XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - Best practices for frontend-integration

## Ressourcer

- [Open Graph Protocol](https://ogp.me/)
- [Twitter-kortdokumentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org Structured Data](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

## Versionsoplysninger

- **Introduceret:** XOOPS 2.5.8
- **Sidst opdateret:** XOOPS 4.0
- **Kompatibilitet:** PHP 7.4+
