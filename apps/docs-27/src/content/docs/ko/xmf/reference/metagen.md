---
title: "XMF Metagen 클래스"
description: "XMF 프레임워크의 메타 태그 생성 및 SEO 도우미"
---

XMF 프레임워크의 `Metagen` 클래스는 HTML 메타 태그, Open Graph 태그 및 기타 SEO 관련 메타데이터를 생성하고 관리하기 위한 포괄적인 도구 키트를 제공합니다.

## 클래스 개요

`Metagen` 클래스는 다음을 처리합니다.
- 표준 HTML 메타 태그(설명, 키워드 등)
- 소셜 공유를 위한 오픈 그래프 메타 태그
- 트위터 카드 메타 태그
- 구조화된 데이터 및 JSON-LD
- 표준 URL
- 언어 및 로케일 사양

### 기본 클래스 구조

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

## 기본 사용법

### 단순 메타 태그

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

## 오픈 그래프 메타 태그

오픈 그래프 태그는 소셜 미디어에 공유될 때 콘텐츠가 표시되는 방식을 제어하는 데 도움이 됩니다.

### 기본 오픈 그래프 설정

```php
$metagen = new Metagen();

$metagen->setOpenGraphProperty('og:title', 'My Awesome Article');
$metagen->setOpenGraphProperty('og:description', 'Learn how to use Metagen for SEO');
$metagen->setOpenGraphProperty('og:image', 'https://example.com/image.jpg');
$metagen->setOpenGraphProperty('og:url', 'https://example.com/article');
$metagen->setOpenGraphProperty('og:type', 'article');

echo $metagen->renderAll();
```

## 구조화된 데이터 및 JSON-LD

JSON-LD는 검색 엔진이 더 잘 이해할 수 있는 구조화된 데이터를 제공합니다.

### 기사 구조화된 데이터

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

## 모듈 통합 예

### 블로그/기사 모듈

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

## 템플릿 통합

### 템플릿 구현

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

## 모범 사례

### SEO 최적화

1. 각 페이지에 대한 **고유한 설명**(150-160자)
2. **관련 키워드** (페이지당 5~10개의 기본 키워드)
3. 중복 콘텐츠 방지를 위한 **표준 URL**
4. 소셜 미디어 최적화를 위한 **오픈 그래프 태그**
5. 향상된 검색 결과를 위한 **구조화된 데이터**
6. 반응형 디자인을 위한 **모바일 뷰포트** 메타 태그

### SEO 구현 완료

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

## API 참조

### 핵심 메소드

| 방법 | 매개변수 | 반품 | 설명 |
|--------|-----------|---------|-------------|
| `setTitle()` | 문자열 | 자기 | 페이지 제목 설정 |
| `setDescription()` | 문자열 | 자기 | 메타 설명 설정 |
| `setKeywords()` | 문자열 | 자기 | 메타 키워드 설정 |
| `setAuthor()` | 문자열 | 자기 | 작성자 이름 설정 |
| `setCanonicalUrl()` | 문자열 | 자기 | 표준 URL 설정 |
| `setLanguage()` | 문자열 | 자기 | 페이지 언어 설정 |
| `setViewport()` | 문자열 | 자기 | 뷰포트 설정 지정 |
| `setOpenGraphProperty()` | 문자열, 문자열 | 자기 | OG 태그 추가 |
| `setTwitterCard()` | 문자열 | 자기 | 트위터 카드 유형 설정 |
| `setJsonLd()` | 배열 | 자기 | 구조화된 데이터 설정 |
| `renderAll()` | - | 문자열 | 모든 메타 태그 렌더링 |

## 관련 문서

- 데이터베이스 - XMF 데이터베이스 참조
- JWT - XMF의 JWT 인증
-../../03-모듈-개발/모범 사례/프런트엔드-통합 - 프런트엔드 통합 모범 사례

## 리소스

- [오픈그래프 프로토콜](https://ogp.me/)
- [트위터 카드 문서](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org 구조화된 데이터](https://schema.org/)
- [Google 검색 센터](https://developers.google.com/search)

## 버전 정보

- **소개:** XOOPS 2.5.8
- **최종 업데이트:** XOOPS 4.0
- **호환성:** PHP 7.4+
