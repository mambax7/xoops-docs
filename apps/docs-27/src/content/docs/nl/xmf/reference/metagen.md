---
title: "XMF Metagen-klasse"
description: "Genereren van metatags en SEO-helpers in het XMF Framework"
---
De klasse `Metagen` in het XMF Framework biedt een uitgebreide toolkit voor het genereren en beheren van HTML-metatags, Open Graph-tags en andere SEO-gerelateerde metagegevens.

## Klassenoverzicht

De klasse `Metagen` verwerkt:
- Standaard HTML-metatags (beschrijving, trefwoorden, enz.)
- Open Graph-metatags voor sociaal delen
- Twitter Card-metatags
- Gestructureerde gegevens en JSON-LD
- Canonieke URL's
- Taal- en landspecificaties

### Basisklassestructuur

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

## Basisgebruik

### Eenvoudige metatags

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

## Open Graph-metatags

Open Graph-tags helpen bepalen hoe inhoud wordt weergegeven wanneer deze op sociale media wordt gedeeld.

### Basis Open Graph-instellingen

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## Gestructureerde gegevens en JSON-LD

JSON-LD biedt gestructureerde gegevens die zoekmachines beter kunnen begrijpen.

### Artikel gestructureerde gegevens

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

## Voorbeelden van module-integratie

### Blog/artikelmodule

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

## Sjabloonintegratie

### Sjabloonimplementatie

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

## Beste praktijken

### SEO Optimalisatie

1. **Unieke beschrijvingen** voor elke pagina (150-160 tekens)
2. **Relevante zoekwoorden** (5-10 primaire zoekwoorden per pagina)
3. **Canonieke URL's** om dubbele inhoud te voorkomen
4. **Open Graph-tags** voor optimalisatie van sociale media
5. **Gestructureerde gegevens** voor verbeterde zoekresultaten
6. **Mobile viewport**-metatag voor responsief ontwerp

### Volledige SEO-implementatie

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

## API-referentie

### Kernmethoden

| Werkwijze | Parameters | Retouren | Beschrijving |
|--------|-----------|---------|------------|
| `setTitle()` | tekenreeks | zelf | Paginatitel instellen |
| `setDescription()` | tekenreeks | zelf | Metabeschrijving instellen |
| `setKeywords()` | tekenreeks | zelf | Meta-trefwoorden instellen |
| `setAuthor()` | tekenreeks | zelf | Auteursnaam instellen |
| `setCanonicalUrl()` | tekenreeks | zelf | Stel canonieke URL | in
| `setLanguage()` | tekenreeks | zelf | Paginataal instellen |
| `setViewport()` | tekenreeks | zelf | Viewport-instellingen instellen |
| `setOpenGraphProperty()` | tekenreeks, tekenreeks | zelf | OG-tag toevoegen |
| `setTwitterCard()` | tekenreeks | zelf | Twitter-kaarttype instellen |
| `setJsonLd()` | array | zelf | Gestructureerde gegevens instellen |
| `renderAll()` | - | tekenreeks | Geef alle metatags weer |

## Gerelateerde documentatie

- Database - XMF databasereferentie
- JWT - JWT-authenticatie in XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - Best practices voor frontend-integratie

## Bronnen

- [Open Graph-protocol](https://ogp.me/)
- [Twitterkaartdocumentatie](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Gestructureerde gegevens van Schema.org](https://schema.org/)
- [Google Zoeken Centraal](https://developers.google.com/search)

## Versie-informatie

- **Geïntroduceerd:** XOOPS 2.5.8
- **Laatst bijgewerkt:** XOOPS 4.0
- **Compatibiliteit:** PHP 7.4+