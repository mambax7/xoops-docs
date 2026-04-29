---
title: "XMF Κατηγορία Metagen"
description: "Δημιουργία μετα-ετικέτας και SEO βοηθοί στο XMF Πλαίσιο"
---

Η κλάση `Metagen` στο XMF Framework παρέχει μια ολοκληρωμένη εργαλειοθήκη για τη δημιουργία και τη διαχείριση μετα-ετικέτες HTML, ετικέτες Open Graph και άλλα μεταδεδομένα που σχετίζονται με το SEO.

## Επισκόπηση τάξης

Η κλάση `Metagen` χειρίζεται:
- Τυπικές μετα-ετικέτες HTML (περιγραφή, λέξεις-κλειδιά, κ.λπ.)
- Ανοίξτε τις μετα-ετικέτες Graph για κοινή χρήση μέσων κοινωνικής δικτύωσης
- Μετα-ετικέτες κάρτας Twitter
- Δομημένα δεδομένα και JSON-LD
- Κανονικές διευθύνσεις URL
- Προδιαγραφές γλώσσας και τοπικής ρύθμισης

## # Βασική Δομή Τάξης

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

## Βασική χρήση

## # Απλές μετα-ετικέτες

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

## Ανοίξτε το Graph Meta Tags

Οι ανοιχτές ετικέτες γραφήματος βοηθούν στον έλεγχο του τρόπου εμφάνισης του περιεχομένου όταν κοινοποιείται στα μέσα κοινωνικής δικτύωσης.

## # Βασική ρύθμιση ανοιχτού γραφήματος

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## Δομημένα δεδομένα και JSON-LD

Το JSON-LD παρέχει δομημένα δεδομένα που οι μηχανές αναζήτησης μπορούν να κατανοήσουν καλύτερα.

## # Δομημένα δεδομένα άρθρου

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

## Παραδείγματα ολοκλήρωσης ενότητας

## # Blog/Article Ενότητα

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

## Ενσωμάτωση προτύπων

## # Υλοποίηση προτύπου

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

## Βέλτιστες πρακτικές

## # SEO Βελτιστοποίηση

1. **Μοναδικές περιγραφές** για κάθε σελίδα (150-160 χαρακτήρες)
2. **Σχετικές λέξεις-κλειδιά** (5-10 κύριες λέξεις-κλειδιά ανά σελίδα)
3. **Κανονικές διευθύνσεις URL** για την αποτροπή διπλού περιεχομένου
4. **Ανοίξτε τις ετικέτες γραφήματος** για βελτιστοποίηση μέσων κοινωνικής δικτύωσης
5. **Δομημένα δεδομένα** για βελτιωμένα αποτελέσματα αναζήτησης
6. **Mobile viewport** meta tag για ανταποκρινόμενη σχεδίαση

## # Ολοκλήρωση SEO Υλοποίηση

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

## API Αναφορά

## # Βασικές Μέθοδοι

| Μέθοδος | Παράμετροι | Επιστροφές | Περιγραφή |
|--------|-----------|---------|-------------|
| `setTitle()` | χορδή | εαυτός | Ορισμός τίτλου σελίδας |
| `setDescription()` | χορδή | εαυτός | Ορισμός μετα-περιγραφής |
| `setKeywords()` | χορδή | εαυτός | Ορισμός λέξεων-κλειδιών meta |
| `setAuthor()` | χορδή | εαυτός | Ορισμός ονόματος συγγραφέα |
| `setCanonicalUrl()` | χορδή | εαυτός | Ρύθμιση κανονικού URL |
| `setLanguage()` | χορδή | εαυτός | Ορισμός γλώσσας σελίδας |
| `setViewport()` | χορδή | εαυτός | Ορισμός ρυθμίσεων θυρίδας προβολής |
| `setOpenGraphProperty()` | χορδή, χορδή | εαυτός | Προσθήκη ετικέτας OG |
| `setTwitterCard()` | χορδή | εαυτός | Ορισμός τύπου κάρτας Twitter |
| `setJsonLd()` | συστοιχία | εαυτός | Ορισμός δομημένων δεδομένων |
| `renderAll()` | - | χορδή | Απόδοση όλων των μετα-ετικέτες |

## Σχετική τεκμηρίωση

- Βάση δεδομένων - XMF αναφορά βάσης δεδομένων
- JWT - JWT έλεγχος ταυτότητας στο XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - Βέλτιστες πρακτικές ενοποίησης Frontend

## Πόροι

- [Open Graph Protocol](https://ogp.me/)
- [Τεκμηρίωση κάρτας Twitter](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Δομημένα δεδομένα Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

## Πληροφορίες έκδοσης

- **Εισαγωγή:** XOOPS 2.5.8
- **Τελευταία ενημέρωση:** XOOPS 4.0
- **Συμβατότητα:** PHP 7.4+
