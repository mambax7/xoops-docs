---
title: "XMF Class Metagen"
description: "יצירת מטא תגים ועוזרים של SEO במסגרת XMF"
---

הכיתה `Metagen` במסגרת XMF מספקת ערכת כלים מקיפה להפקה וניהול של מטא תגיות HTML, תגיות Open Graph ומטא נתונים אחרים הקשורים ל-SEO.

## סקירת כיתה

מחלקת `Metagen` מטפלת ב:
- מטא תגים סטנדרטיים HTML (תיאור, מילות מפתח וכו')
- פתח את מטא תגיות Graph לשיתוף חברתי
- תגיות מטא של כרטיס טוויטר
- נתונים מובנים ו-JSON-LD
- Canonical URLs
- מפרטי שפה ומקום

### מבנה כיתה בסיסי

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

## שימוש בסיסי

### מטא תגים פשוטים

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

## פתח את גרף מטא תגיות

תגי גרף פתוחים עוזרים לשלוט כיצד יופיע תוכן בעת שיתוף במדיה חברתית.

### הגדרת גרף פתיחה בסיסית

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## נתונים מובנים ו-JSON-LD

JSON-LD מספק נתונים מובנים שמנועי חיפוש יכולים להבין טוב יותר.

### נתונים מובנים במאמר

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

## דוגמאות לשילוב מודול

### מודול Blog/Article

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

## שילוב תבנית

### יישום תבנית

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

## שיטות עבודה מומלצות

### SEO אופטימיזציה

1. **תיאורים ייחודיים** לכל עמוד (150-160 תווים)
2. **מילות מפתח רלוונטיות** (5-10 מילות מפתח עיקריות בכל דף)
3. **Canonical URLs** למניעת תוכן כפול
4. **תגי גרף פתוחים** לאופטימיזציה של מדיה חברתית
5. **נתונים מובנים** לתוצאות חיפוש משופרות
6. מטא תג של **נייד צפייה** לעיצוב רספונסיבי

### יישום SEO השלם

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

## API הפניה

### שיטות ליבה

| שיטה | פרמטרים | מחזיר | תיאור |
|--------|--------|--------|-------------------|
| `setTitle()` | מחרוזת | עצמי | הגדר את כותרת העמוד |
| `setDescription()` | מחרוזת | עצמי | הגדר מטא תיאור |
| `setKeywords()` | מחרוזת | עצמי | הגדר מטא מילות מפתח |
| `setAuthor()` | מחרוזת | עצמי | הגדר שם מחבר |
| `setCanonicalUrl()` | מחרוזת | עצמי | סט קנוני URL |
| `setLanguage()` | מחרוזת | עצמי | הגדר שפת עמוד |
| `setViewport()` | מחרוזת | עצמי | הגדר הגדרות תצוגה |
| `setOpenGraphProperty()` | מחרוזת, מחרוזת | עצמי | הוסף תג OG |
| `setTwitterCard()` | מחרוזת | עצמי | הגדר סוג כרטיס טוויטר |
| `setJsonLd()` | מערך | עצמי | הגדר נתונים מובנים |
| `renderAll()` | - | מחרוזת | עבד את כל המטא תגים |

## תיעוד קשור

- מסד נתונים - הפניה למסד נתונים XMF
- JWT - JWT אימות ב-XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - שיטות עבודה מומלצות לשילוב Frontend

## משאבים

- [Open Graph Protocol](https://ogp.me/)
- [תיעוד כרטיס טוויטר](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [נתונים מובנים של Schema.org](https://schema.org/)
- [מרכז החיפוש של Google](https://developers.google.com/search)

## מידע גרסה

- **הוצג:** XOOPS 2.5.8
- **עדכון אחרון:** XOOPS 4.0
- **תאימות:** PHP 7.4+
