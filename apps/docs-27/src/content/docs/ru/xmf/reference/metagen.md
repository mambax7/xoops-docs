---
title: "Класс XMF Metagen"
description: "Генерация мета-тегов и помощники SEO в XMF Framework"
---

Класс `Metagen` в XMF Framework предоставляет комплексный набор инструментов для генерации и управления HTML мета-тегами, тегами Open Graph и другими метаданными, связанными с SEO.

## Обзор класса

Класс `Metagen` обрабатывает:
- Стандартные HTML мета-теги (description, keywords и т.д.)
- Мета-теги Open Graph для социального обмена
- Мета-теги Twitter Card
- Структурированные данные и JSON-LD
- Канонические URLs
- Спецификации языка и локали

### Базовая структура класса

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

## Базовое использование

### Простые мета-теги

```php
use Xmf\Metagen;

$metagen = new Metagen();

// Установите базовые мета-теги
$metagen->setDescription('This is my awesome website');
$metagen->setKeywords('php, xoops, web development');

// Рендеринг в HTML
echo $metagen->renderAll();

// Вывод:
// <meta name="description" content="This is my awesome website" />
// <meta name="keywords" content="php, xoops, web development" />
```

## Мета-теги Open Graph

Теги Open Graph помогают контролировать, как контент отображается при обмене в социальных сетях.

### Базовая установка Open Graph

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## Структурированные данные и JSON-LD

JSON-LD предоставляет структурированные данные, которые поисковые системы могут лучше понять.

### Структурированные данные статьи

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

## Примеры интеграции модуля

### Модуль блога/статьи

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

        // Инициализируйте Metagen
        $metagen = new Metagen();

        // Установите метаданные статьи
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

        // Канонический URL
        $metagen->setCanonicalUrl($article->getUrl());

        // Сохранить в шаблоне
        $this->template['metagen'] = $metagen;

        return $this->render('article/view.php');
    }
}
```

## Интеграция шаблонов

### Реализация шаблона

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

## Лучшие практики

### Оптимизация SEO

1. **Уникальные описания** для каждой страницы (150-160 символов)
2. **Релевантные ключевые слова** (5-10 основных ключевых слов на страницу)
3. **Канонические URLs** для предотвращения дублирования контента
4. **Теги Open Graph** для оптимизации социальных сетей
5. **Структурированные данные** для улучшенных результатов поиска
6. **Мобильный viewport** мета-тег для адаптивного дизайна

### Полная реализация SEO

```php
$metagen = new Metagen();

// Базовые мета-теги
$metagen->setTitle('My Website - Web Development Services');
$metagen->setDescription('Professional web development services');
$metagen->setKeywords('web development, php, xoops');
$metagen->setAuthor('John Developer');
$metagen->setLanguage('en');

// Канонический URL
$metagen->setCanonicalUrl('https://example.com/services/web-development');

// Open Graph для социального обмена
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

## Справка API

### Основные методы

| Метод | Параметры | Возвращает | Описание |
|--------|-----------|---------|-------------|
| `setTitle()` | string | self | Установить заголовок страницы |
| `setDescription()` | string | self | Установить описание мета |
| `setKeywords()` | string | self | Установить ключевые слова мета |
| `setAuthor()` | string | self | Установить имя автора |
| `setCanonicalUrl()` | string | self | Установить канонический URL |
| `setLanguage()` | string | self | Установить язык страницы |
| `setViewport()` | string | self | Установить параметры viewport |
| `setOpenGraphProperty()` | string, string | self | Добавить тег OG |
| `setTwitterCard()` | string | self | Установить тип Twitter card |
| `setJsonLd()` | array | self | Установить структурированные данные |
| `renderAll()` | - | string | Рендеринг всех мета-тегов |

## Связанная документация

- Database - XMF database reference
- JWT - JWT authentication in XMF
- ../../03-Module-Development/Best-Practices/Frontend-Integration - Frontend integration best practices

## Ресурсы

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org Structured Data](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

## Информация о версии

- **Введено:** XOOPS 2.5.8
- **Последнее обновление:** XOOPS 4.0
- **Совместимость:** PHP 7.4+
