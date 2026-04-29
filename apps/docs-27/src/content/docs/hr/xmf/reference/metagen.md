---
title: "XMF metagena klasa"
description: "Generacija meta oznaka i SEO pomoćnici u okviru XMF"
---
`Metagen` class u okviru XMF pruža sveobuhvatan skup alata za generiranje i upravljanje meta oznakama HTML, oznakama Open Graph i drugim metapodacima koji se odnose na SEO.

## Pregled razreda

`Metagen` class upravlja:
- Standardne meta oznake HTML (opis, ključne riječi itd.)
- Meta oznake Open Graph za dijeljenje na društvenim mrežama
- Meta oznake Twitter kartice
- Strukturirani podaci i JSON-LD
- Kanonski URL-ovi
- Specifikacije jezika i lokalizacije

### Struktura osnovne klase

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

## Osnovna upotreba

### Jednostavne meta oznake

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

## Meta oznake otvorenog grafikona

Oznake Open Graph pomažu kontrolirati kako se sadržaj pojavljuje kada se dijeli na društvenim medijima.

### Osnovna postavka otvorenog grafikona

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## Strukturirani podaci i JSON-LD

JSON-LD pruža strukturirane podatke koje tražilice mogu bolje razumjeti.

### Strukturirani podaci članka

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

## Primjeri integracije modula

### modul blog/članak

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

## Integracija predloška

### Implementacija predloška

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

## Najbolji primjeri iz prakse

### SEO optimizacija

1. **Jedinstveni opisi** za svaku stranicu (150-160 znakova)
2. **Relevantne ključne riječi** (5-10 primarnih ključnih riječi po stranici)
3. **Kanonski URL-ovi** za sprječavanje dupliciranog sadržaja
4. **Open Graph oznake** za optimizaciju društvenih medija
5. **Strukturirani podaci** za poboljšane rezultate pretraživanja
6. **Mobile viewport** meta oznaka za responzivni dizajn

### Potpuna SEO implementacija

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

| Metoda | Parametri | Povratak | Opis |
|--------|-----------|---------|-------------|
| `setTitle()` | niz | sebe | Postavi naslov stranice |
| `setDescription()` | niz | sebe | Postavi meta opis |
| `setKeywords()` | niz | sebe | Postavite meta ključne riječi |
| `setAuthor()` | niz | sebe | Postavi ime autora |
| `setCanonicalUrl()` | niz | sebe | Set kanonskih URL |
| `setLanguage()` | niz | sebe | Postavite stranicu language |
| `setViewport()` | niz | sebe | Postavite postavke okvira za prikaz |
| `setOpenGraphProperty()` | niz, niz | sebe | Dodaj OG oznaku |
| `setTwitterCard()` | niz | sebe | Postavite vrstu Twitter kartice |
| `setJsonLd()` | niz | sebe | Postavi strukturirane podatke |
| `renderAll()` | - | niz | Prikaz svih meta oznaka |

## Povezana dokumentacija

- baza podataka - Referenca baze podataka XMF
- JWT - JWT provjera autentičnosti u XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - Najbolje prakse integracije frontenda

## Resursi

- [Protokol otvorenog grafa](https://ogp.me/)
- [Dokumentacija Twitter kartice](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Strukturirani podaci Schema.org](https://schema.org/)
- [Google središnje pretraživanje](https://developers.google.com/search)

## Informacije o verziji

- **Predstavljeno:** XOOPS 2.5.8
- **Zadnje ažuriranje:** XOOPS 4.0
- **Kompatibilnost:** PHP 7.4+
