---
title: "Classe XMF Metagen"
description: "Generazione di tag meta e helper SEO nel Framework XMF"
---

La classe `Metagen` nel Framework XMF fornisce un toolkit completo per la generazione e la gestione di tag HTML meta, tag Open Graph e altri metadati legati all'SEO.

## Panoramica della Classe

La classe `Metagen` gestisce:
- Tag HTML meta standard (descrizione, parole chiave, ecc.)
- Tag meta Open Graph per la condivisione sociale
- Tag Twitter Card
- Dati strutturati e JSON-LD
- URL canonici
- Specifiche di lingua e locale

### Struttura di Base della Classe

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

## Utilizzo di Base

### Tag Meta Semplici

```php
use Xmf\Metagen;

$metagen = new Metagen();

// Imposta i tag meta di base
$metagen->setDescription('This is my awesome website');
$metagen->setKeywords('php, xoops, web development');

// Renderizza in HTML
echo $metagen->renderAll();

// Output:
// <meta name="description" content="This is my awesome website" />
// <meta name="keywords" content="php, xoops, web development" />
```

## Tag Meta Open Graph

I tag Open Graph aiutano a controllare come il contenuto appare quando condiviso sui social media.

### Configurazione Open Graph di Base

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## Dati Strutturati e JSON-LD

JSON-LD fornisce dati strutturati che i motori di ricerca possono comprendere meglio.

### Dati Strutturati Articolo

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

## Esempi di Integrazione del Modulo

### Modulo Blog/Articolo

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

        // Inizializza Metagen
        $metagen = new Metagen();

        // Imposta i metadati dell'articolo
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

        // URL Canonico
        $metagen->setCanonicalUrl($article->getUrl());

        // Memorizza nel template
        $this->template['metagen'] = $metagen;

        return $this->render('article/view.php');
    }
}
```

## Integrazione del Template

### Implementazione del Template

```php
<!-- Nel header del tuo template -->
<?php if (isset($metagen)): ?>
    <?php echo $metagen->renderAll(); ?>
<?php endif; ?>

<!-- Struttura HTML standard -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <?php echo $metagen->renderAll(); ?>
    <title><?php echo $metagen->getTitle(); ?></title>
</head>
<body>
    <!-- Contenuto -->
</body>
</html>
```

## Migliori Pratiche

### Ottimizzazione SEO

1. **Descrizioni uniche** per ogni pagina (150-160 caratteri)
2. **Parole chiave rilevanti** (5-10 parole chiave primarie per pagina)
3. **URL canonici** per prevenire il contenuto duplicato
4. **Tag Open Graph** per l'ottimizzazione dei social media
5. **Dati strutturati** per i risultati di ricerca migliorati
6. **Meta tag viewport mobile** per il design reattivo

### Implementazione SEO Completa

```php
$metagen = new Metagen();

// Tag meta di base
$metagen->setTitle('My Website - Web Development Services');
$metagen->setDescription('Professional web development services');
$metagen->setKeywords('web development, php, xoops');
$metagen->setAuthor('John Developer');
$metagen->setLanguage('en');

// URL Canonico
$metagen->setCanonicalUrl('https://example.com/services/web-development');

// Open Graph per la condivisione sui social
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

## Riferimento API

### Metodi Core

| Metodo | Parametri | Ritorna | Descrizione |
|--------|-----------|---------|-------------|
| `setTitle()` | string | self | Imposta il titolo della pagina |
| `setDescription()` | string | self | Imposta la meta descrizione |
| `setKeywords()` | string | self | Imposta le meta parole chiave |
| `setAuthor()` | string | self | Imposta il nome dell'autore |
| `setCanonicalUrl()` | string | self | Imposta l'URL canonico |
| `setLanguage()` | string | self | Imposta la lingua della pagina |
| `setViewport()` | string | self | Imposta le impostazioni del viewport |
| `setOpenGraphProperty()` | string, string | self | Aggiungi tag OG |
| `setTwitterCard()` | string | self | Imposta il tipo di Twitter card |
| `setJsonLd()` | array | self | Imposta i dati strutturati |
| `renderAll()` | - | string | Renderizza tutti i tag meta |

## Documentazione Correlata

- Database - Riferimento database XMF
- JWT - Autenticazione JWT in XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - Migliori pratiche di integrazione frontend

## Risorse

- [Open Graph Protocol](https://ogp.me/)
- [Documentazione Twitter Card](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Dati Strutturati Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

## Informazioni sulla Versione

- **Introdotto:** XOOPS 2.5.8
- **Ultimo Aggiornamento:** XOOPS 4.0
- **Compatibilità:** PHP 7.4+
