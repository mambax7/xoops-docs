---
title: "XMF मेटाजेन क्लास"
description: "XMF फ्रेमवर्क में मेटा टैग जनरेशन और एसईओ सहायक"
---
XMF फ्रेमवर्क में `Metagen` क्लास HTML मेटा टैग, ओपन ग्राफ टैग और अन्य एसईओ-संबंधित मेटाडेटा बनाने और प्रबंधित करने के लिए एक व्यापक टूलकिट प्रदान करता है।

## कक्षा अवलोकन

`Metagen` क्लास हैंडल:
- मानक HTML मेटा टैग (विवरण, कीवर्ड, आदि)
- सामाजिक साझाकरण के लिए ग्राफ़ मेटा टैग खोलें
- ट्विटर कार्ड मेटा टैग
- संरचित डेटा और JSON-एलडी
- कैनोनिकल URL
- भाषा और स्थानीय विशिष्टताएँ

### बुनियादी कक्षा संरचना

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

## बुनियादी उपयोग

### सरल मेटा टैग

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

## ग्राफ़ मेटा टैग खोलें

ओपन ग्राफ़ टैग यह नियंत्रित करने में मदद करते हैं कि सोशल मीडिया पर साझा किए जाने पर सामग्री कैसी दिखाई देगी।

### बेसिक ओपन ग्राफ़ सेटअप

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## संरचित डेटा और JSON-एलडी

JSON-एलडी संरचित डेटा प्रदान करता है जिसे खोज इंजन बेहतर ढंग से समझ सकते हैं।

### आलेख संरचित डेटा

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

## मॉड्यूल एकीकरण उदाहरण

### ब्लॉग/आर्टिकल मॉड्यूल

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

## टेम्पलेट एकीकरण

### टेम्पलेट कार्यान्वयन

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

## सर्वोत्तम प्रथाएँ

### एसईओ अनुकूलन

1. **प्रत्येक पृष्ठ के लिए अद्वितीय विवरण** (150-160 अक्षर)
2. **प्रासंगिक कीवर्ड** (प्रति पृष्ठ 5-10 प्राथमिक कीवर्ड)
3. डुप्लिकेट सामग्री को रोकने के लिए **कैनोनिकल URL**
4. सोशल मीडिया अनुकूलन के लिए **ओपन ग्राफ़ टैग**
5. उन्नत खोज परिणामों के लिए **संरचित डेटा**
6. रिस्पॉन्सिव डिज़ाइन के लिए **मोबाइल व्यूपोर्ट** मेटा टैग

### पूर्ण एसईओ कार्यान्वयन

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

## API संदर्भ

### कोर तरीके

| विधि | पैरामीटर्स | रिटर्न | विवरण |
|--------|----|---|---|
| `setTitle()` | स्ट्रिंग | स्वयं | पृष्ठ शीर्षक सेट करें |
| `setDescription()` | स्ट्रिंग | स्वयं | मेटा विवरण सेट करें |
| `setKeywords()` | स्ट्रिंग | स्वयं | मेटा कीवर्ड सेट करें |
| `setAuthor()` | स्ट्रिंग | स्वयं | लेखक का नाम सेट करें |
| `setCanonicalUrl()` | स्ट्रिंग | स्वयं | विहित URL सेट करें |
| `setLanguage()` | स्ट्रिंग | स्वयं | पृष्ठ भाषा सेट करें |
| `setViewport()` | स्ट्रिंग | स्वयं | व्यूपोर्ट सेटिंग सेट करें |
| `setOpenGraphProperty()` | स्ट्रिंग, स्ट्रिंग | स्वयं | ओजी टैग जोड़ें |
| `setTwitterCard()` | स्ट्रिंग | स्वयं | ट्विटर कार्ड प्रकार सेट करें |
| `setJsonLd()` | सारणी | स्वयं | संरचित डेटा सेट करें |
| `renderAll()` | - | स्ट्रिंग | सभी मेटा टैग प्रस्तुत करें |

## संबंधित दस्तावेज़ीकरण

- डेटाबेस - XMF डेटाबेस संदर्भ
- जेडब्ल्यूटी - XMF में जेडब्ल्यूटी प्रमाणीकरण
- ../../03-मॉड्यूल-डेवलपमेंट/बेस्ट-प्रैक्टिस/फ्रंटएंड-इंटीग्रेशन - फ्रंटएंड इंटीग्रेशन सर्वोत्तम प्रथाएं

## संसाधन

- [ओपन ग्राफ़ प्रोटोकॉल](https://ogp.me/)
- [ट्विटर कार्ड दस्तावेज़ीकरण](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org संरचित डेटा](https://schema.org/)
- [गूगल सर्च सेंट्रल](https://developers.google.com/search)

## संस्करण जानकारी

- **परिचय:** XOOPS 2.5.8
- **अंतिम अद्यतन:** XOOPS 4.0
- **संगतता:** PHP 7.4+