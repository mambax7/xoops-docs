---
title: "Třída Metagen XMF"
description: "Generování meta tagů a pomocníci SEO v rámci XMF"
---

Třída `Metagen` v rámci XMF Framework poskytuje komplexní sadu nástrojů pro generování a správu metaznaček HTML, značek Open Graph a dalších metadat souvisejících se SEO.

## Přehled třídy

Třída `Metagen` zpracovává:
- Standardní metaznačky HTML (popis, klíčová slova atd.)
- Otevřete metaznačky Graph pro sociální sdílení
- Meta tagy Twitter Card
- Strukturovaná data a JSON-LD
- Kanonické adresy URL
- Specifikace jazyka a národního prostředí

### Struktura základní třídy

```php
namespace XMF;

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

## Základní použití

### Jednoduché meta tagy

```php
use XMF\Metagen;

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

## Otevřít metaznačky Graph

Značky Open Graph pomáhají řídit, jak se obsah zobrazuje při sdílení na sociálních sítích.

### Základní nastavení otevřeného grafu

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## Strukturovaná data a JSON-LD

JSON-LD poskytuje strukturovaná data, kterým mohou vyhledávače lépe porozumět.

### Strukturovaná data článku

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

## Příklady integrace modulů

### Modul Blog/Article

```php
namespace MyModule\Controller;

use XMF\Metagen;
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

## Integrace šablon

### Implementace šablony

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

## Nejlepší postupy

### Optimalizace SEO

1. **Jedinečné popisy** pro každou stránku (150–160 znaků)
2. **Relevantní klíčová slova** (5–10 primárních klíčových slov na stránku)
3. **Kanonické adresy URL** pro prevenci duplicitního obsahu
4. **Otevřete značky Graph** pro optimalizaci sociálních médií
5. **Strukturovaná data** pro vylepšené výsledky vyhledávání
6. Metaznačka **Mobilní zobrazení** pro responzivní design

### Kompletní implementace SEO

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

## Reference API

### Základní metody

| Metoda | Parametry | Návraty | Popis |
|--------|-----------|---------|-------------|
| `setTitle()` | řetězec | sám | Nastavit název stránky |
| `setDescription()` | řetězec | sám | Nastavit meta popis |
| `setKeywords()` | řetězec | sám | Nastavit meta klíčová slova |
| `setAuthor()` | řetězec | sám | Nastavit jméno autora |
| `setCanonicalUrl()` | řetězec | sám | Sada canonical URL |
| `setLanguage()` | řetězec | sám | Nastavit jazyk stránky |
| `setViewport()` | řetězec | sám | Nastavit nastavení výřezu |
| `setOpenGraphProperty()` | struna, struna | sám | Přidat značku OG |
| `setTwitterCard()` | řetězec | sám | Nastavit typ Twitter karty |
| `setJsonLd()` | pole | sám | Nastavit strukturovaná data |
| `renderAll()` | - | řetězec | Vykreslit všechny meta tagy |

## Související dokumentace

- Databáze - Reference databáze XMF
- JWT - Ověření JWT v XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - Doporučené postupy integrace frontendu

## Zdroje

- [Open Graph Protocol](https://ogp.me/)
- [Dokumentace ke kartě Twitter](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Strukturovaná data Schema.org](https://schema.org/)
– [Centrum vyhledávání Google](https://developers.google.com/search)

## Informace o verzi

- **Představeno:** XOOPS 2.5.8
- **Poslední aktualizace:** XOOPS 4.0
- **Kompatibilita:** PHP 7.4+