---
title: "XMF Razred metagena"
description: "Generiranje meta oznak in SEO pomočnikov v ogrodju XMF"
---
Razred `Metagen` v ogrodju XMF ponuja obsežen nabor orodij za generiranje in upravljanje metaoznak HTML, oznak Open Graph in drugih metapodatkov, povezanih z SEO.

## Pregled razreda

Razred `Metagen` obravnava:
- Standardne meta oznake HTML (opis, ključne besede itd.)
- Meta oznake Open Graph za skupno rabo v družabnih omrežjih
- Meta oznake Twitter kartice
- Strukturirani podatki in JSON-LD
- Kanonični URL-ji
- Jezikovne in lokalne specifikacije

### Osnovna struktura razreda
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
## Osnovna uporaba

### Preproste meta oznake
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
## Meta oznake Open Graph

Oznake Open Graph pomagajo nadzorovati, kako je vsebina prikazana, ko jo delite v družabnih medijih.

### Osnovna nastavitev odprtega grafa
```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```
## Strukturirani podatki in JSON-LD

JSON-LD zagotavlja strukturirane podatke, ki jih iskalniki bolje razumejo.

### Strukturirani podatki članka
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
## Primeri integracije modulov

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
## Integracija predloge

### Implementacija predloge
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
## Najboljše prakse

### SEO Optimizacija

1. **Unikatni opisi** za vsako stran (150-160 znakov)
2. **Ustrezne ključne besede** (5–10 primarnih ključnih besed na stran)
3. **Kanonični URL-ji** za preprečevanje podvojene vsebine
4. **Open Graph tags** za optimizacijo družbenih medijev
5. **Strukturirani podatki** za izboljšane rezultate iskanja
6. Metaoznaka **Mobile viewport** za odzivno oblikovanje

### Dokončana SEO Implementacija
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
## API Referenca

### Osnovne metode

| Metoda | Parametri | Vračila | Opis |
|--------|-----------|---------|-------------|
| `setTitle()` | niz | sam | Nastavi naslov strani |
| `setDescription()` | niz | sam | Nastavi meta opis |
| `setKeywords()` | niz | sam | Nastavite meta ključne besede |
| `setAuthor()` | niz | sam | Nastavi ime avtorja |
| `setCanonicalUrl()` | niz | sam | Nastavi kanonično URL |
| `setLanguage()` | niz | sam | Nastavi jezik strani |
| `setViewport()` | niz | sam | Nastavi nastavitve vidnega polja |
| `setOpenGraphProperty()` | niz, niz | sam | Dodaj oznako OG |
| `setTwitterCard()` | niz | sam | Nastavite vrsto Twitter kartice |
| `setJsonLd()` | niz | sam | Nastavi strukturirane podatke |
| `renderAll()` | - | niz | Upodobi vse meta oznake |

## Povezana dokumentacija

- Baza podatkov - XMF referenca baze podatkov
- JWT - JWT avtentikacija v XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - Najboljše prakse integracije sprednjega dela

## Viri

- [Open Graph Protocol](https://ogp.me/)
- [Dokumentacija kartice Twitter] (https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Strukturirani podatki Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)## Informacije o različici

- **Predstavljeno:** XOOPS 2.5.8
- **Nazadnje posodobljeno:** XOOPS 4.0
- **Združljivost:** PHP 7.4+