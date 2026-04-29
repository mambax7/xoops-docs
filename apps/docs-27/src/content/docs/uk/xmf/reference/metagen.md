---
title: "XMF Метагенний клас"
description: "Генерація метатегів і SEO помічники в XMF Framework"
---
Клас `Metagen` у XMF Framework надає повний набір інструментів для генерації та керування мета-тегами HTML, тегами Open Graph та іншими пов’язаними з SEO метаданими.

## Огляд класу

Клас `Metagen` керує:
- Стандартні метатеги HTML (опис, ключові слова тощо)
— Мета-теги Open Graph для спільного використання в соціальних мережах
- Мета-теги Twitter Card
- Структуровані дані та JSON-LD
- Канонічні URL-адреси
- Специфікації мови та локалі

### Базова структура класу
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
## Основне використання

### Прості метатеги
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
## Мета-теги Open Graph

Теги Open Graph допомагають контролювати, як вміст відображається під час поширення в соціальних мережах.

### Базове налаштування відкритого графіка
```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```
## Структуровані дані та JSON-LD

JSON-LD надає структуровані дані, які пошукові системи можуть краще зрозуміти.

### Структуровані дані статті
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
## Приклади інтеграції модуля

### Blog/Article Модуль
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
## Інтеграція шаблону

### Реалізація шаблону
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
## Найкращі практики

### SEO Оптимізація

1. **Унікальні описи** для кожної сторінки (150-160 символів)
2. **Релевантні ключові слова** (5-10 основних ключових слів на сторінку)
3. **Канонічні URL-адреси** для запобігання повторюваного вмісту
4. **Відкриті теги Graph** для оптимізації соціальних мереж
5. **Структуровані дані** для покращених результатів пошуку
6. Метатег **Mobile viewport** для адаптивного дизайну

### Завершено SEO Впровадження
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
## API Посилання

### Основні методи

| Метод | Параметри | Повернення | Опис |
|--------|-----------|---------|-------------|
| `setTitle()` | рядок | самостійно | Установити назву сторінки |
| `setDescription()` | рядок | самостійно | Установити метаопис |
| `setKeywords()` | рядок | самостійно | Встановити мета-ключові слова |
| `setAuthor()` | рядок | самостійно | Встановити ім'я автора |
| `setCanonicalUrl()` | рядок | самостійно | Набір канонічний URL |
| `setLanguage()` | рядок | самостійно | Встановити мову сторінки |
| `setViewport()` | рядок | самостійно | Встановити параметри вікна перегляду |
| `setOpenGraphProperty()` | рядок, рядок | самостійно | Додати тег OG |
| `setTwitterCard()` | рядок | самостійно | Установити тип картки Twitter |
| `setJsonLd()` | масив | самостійно | Набір структурованих даних |
| `renderAll()` | - | рядок | Відобразити всі метатеги |

## Пов'язана документація

- База даних - XMF посилання на базу даних
- JWT - JWT аутентифікація в XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - Найкращі методи інтеграції зовнішнього інтерфейсу

## Ресурси

- [Протокол Open Graph] (https://ogp.me/)
- [Документація Twitter Card] (https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Структуровані дані Schema.org] (https://schema.org/)
- [Центр пошуку Google](https://developers.google.com/search)## Інформація про версію

- **Введено:** XOOPS 2.5.8
- **Останнє оновлення:** XOOPS 4.0
- **Сумісність:** PHP 7.4+