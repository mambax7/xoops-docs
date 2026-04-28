---
title: "Classe XMF Metagen"
description: "Génération de balises meta et helpers SEO dans le framework XMF"
---

La classe `Metagen` du framework XMF fournit une boîte à outils complète pour générer et gérer les balises meta HTML, les balises Open Graph, et autres métadonnées liées au SEO.

## Aperçu de la classe

La classe `Metagen` gère:
- Les balises meta HTML standard (description, mots-clés, etc.)
- Les balises meta Open Graph pour le partage social
- Les balises Twitter Card meta
- Les données structurées et JSON-LD
- Les URLs canoniques
- Les spécifications de langue et de locale

### Structure de classe de base

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

## Utilisation de base

### Balises meta simples

```php
use Xmf\Metagen;

$metagen = new Metagen();

// Définir les balises meta de base
$metagen->setDescription('This is my awesome website');
$metagen->setKeywords('php, xoops, web development');

// Rendre en HTML
echo $metagen->renderAll();

// Sortie:
// <meta name="description" content="This is my awesome website" />
// <meta name="keywords" content="php, xoops, web development" />
```

## Balises meta Open Graph

Les balises Open Graph aident à contrôler comment le contenu apparaît lorsqu'il est partagé sur les réseaux sociaux.

### Configuration Open Graph de base

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## Données structurées et JSON-LD

JSON-LD fournit des données structurées que les moteurs de recherche peuvent mieux comprendre.

### Données structurées d'article

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

## Exemples d'intégration de module

### Module Blog/Article

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

        // Initialiser Metagen
        $metagen = new Metagen();

        // Définir les métadonnées d'article
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

        // URL canonique
        $metagen->setCanonicalUrl($article->getUrl());

        // Stocker dans le modèle
        $this->template['metagen'] = $metagen;

        return $this->render('article/view.php');
    }
}
```

## Intégration de modèle

### Implémentation du modèle

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

## Bonnes pratiques

### Optimisation SEO

1. **Descriptions uniques** pour chaque page (150-160 caractères)
2. **Mots-clés pertinents** (5-10 mots-clés primaires par page)
3. **URLs canoniques** pour prévenir le contenu dupliqué
4. **Balises Open Graph** pour l'optimisation des médias sociaux
5. **Données structurées** pour les résultats de recherche améliorés
6. **Balise meta viewport mobile** pour la conception réactive

### Implémentation SEO complète

```php
$metagen = new Metagen();

// Balises meta de base
$metagen->setTitle('My Website - Web Development Services');
$metagen->setDescription('Professional web development services');
$metagen->setKeywords('web development, php, xoops');
$metagen->setAuthor('John Developer');
$metagen->setLanguage('en');

// URL canonique
$metagen->setCanonicalUrl('https://example.com/services/web-development');

// Open Graph pour le partage social
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

## Référence API

### Méthodes principales

| Méthode | Paramètres | Retourne | Description |
|--------|-----------|---------|-------------|
| `setTitle()` | string | self | Définir le titre de la page |
| `setDescription()` | string | self | Définir la description meta |
| `setKeywords()` | string | self | Définir les mots-clés meta |
| `setAuthor()` | string | self | Définir le nom de l'auteur |
| `setCanonicalUrl()` | string | self | Définir l'URL canonique |
| `setLanguage()` | string | self | Définir la langue de la page |
| `setViewport()` | string | self | Définir les paramètres de viewport |
| `setOpenGraphProperty()` | string, string | self | Ajouter une balise OG |
| `setTwitterCard()` | string | self | Définir le type de Twitter card |
| `setJsonLd()` | array | self | Définir les données structurées |
| `renderAll()` | - | string | Rendre toutes les balises meta |

## Documentation connexe

- Database - Référence XMF database
- JWT - Authentification JWT dans XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - Bonnes pratiques d'intégration frontend

## Ressources

- [Protocole Open Graph](https://ogp.me/)
- [Documentation Twitter Card](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Données structurées Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

## Informations de version

- **Introduit:** XOOPS 2.5.8
- **Dernière mise à jour:** XOOPS 4.0
- **Compatibilité:** PHP 7.4+
