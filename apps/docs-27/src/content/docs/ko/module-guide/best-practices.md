---
title: "모듈 개발 모범 사례"
---

## 개요

이 문서에는 고품질 XOOPS 모듈 개발을 위한 모범 사례가 통합되어 있습니다. 이러한 지침을 따르면 유지 관리가 가능하고 안전하며 성능이 뛰어난 모듈이 보장됩니다.

## 아키텍처

### 클린 아키텍처 따르기

코드를 레이어로 구성합니다.

```
src/
├── Domain/          # Business logic, entities
├── Application/     # Use cases, services
├── Infrastructure/  # Database, external services
└── Presentation/    # Controllers, templates
```

### 단일 책임

각 클래스에는 변경해야 할 한 가지 이유가 있어야 합니다.

```php
// Good: Focused classes
class ArticleRepository { /* persistence only */ }
class ArticleValidator { /* validation only */ }
class ArticleNotifier { /* notifications only */ }

// Bad: God class
class Article {
    public function save() { }
    public function validate() { }
    public function notify() { }
    public function generatePDF() { }
}
```

### 의존성 주입

종속성을 주입하고 생성하지 마세요.

```php
// Good
public function __construct(
    private readonly ArticleRepositoryInterface $repository
) {}

// Bad
public function __construct() {
    $this->repository = new ArticleRepository();
}
```

## 코드 품질

### 유형 안전

엄격한 유형과 유형 선언을 사용하십시오.

```php
<?php

declare(strict_types=1);

final class ArticleService
{
    public function findById(int $id): ?Article
    {
        // ...
    }

    public function create(CreateArticleDTO $dto): Article
    {
        // ...
    }
}
```

### 오류 처리

예외를 적절하게 사용하십시오.

```php
// Throw specific exceptions
throw new ArticleNotFoundException($id);
throw new ValidationException($errors);
throw new UnauthorizedException('Cannot edit this article');

// Catch at appropriate level
try {
    $article = $service->create($dto);
} catch (ValidationException $e) {
    return $this->renderForm($e->getErrors());
} catch (UnauthorizedException $e) {
    return $this->redirectToLogin();
}
```

### 안전이 보장되지 않음

가능한 경우 null을 피하세요.

```php
// Use null object pattern
public function getAuthor(): UserInterface
{
    return $this->author ?? new AnonymousUser();
}

// Use Optional/Maybe pattern
public function findById(int $id): ?Article
{
    // Explicitly nullable return
}
```

## 데이터베이스

### 쿼리에 Criteria 사용

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```

### 사용자 입력 탈출

```php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```

### 거래 사용

```php
$db->query('START TRANSACTION');

try {
    $handler->insert($article);
    $handler->insert($metadata);
    $db->query('COMMIT');
} catch (\Exception $e) {
    $db->query('ROLLBACK');
    throw $e;
}
```

## 보안

### 항상 입력 유효성을 검사합니다.

```php
use Xmf\Request;

$id = Request::getInt('id', 0);
$title = Request::getString('title', '');
$data = Request::getArray('data', []);

// Additional validation
if (strlen($title) < 5) {
    throw new ValidationException('Title too short');
}
```

### CSRF 토큰 사용

```php
// In form
$form->addElement(new XoopsFormHiddenToken());

// On submit
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'Invalid token');
}
```

### 권한 확인

```php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```

## 성능

### 캐싱 사용

```php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```

### 쿼리 최적화

```php
// Use indexes
// Add to sql/mysql.sql:
// INDEX `idx_status_date` (`status`, `created_at`)

// Select only needed columns
$handler->getObjects($criteria, false, true); // asArray = true

// Use pagination
$criteria->setLimit($perPage);
$criteria->setStart($offset);
```

## 테스트

### 단위 테스트 작성

```php
public function testCreateArticle(): void
{
    $repository = $this->createMock(ArticleRepositoryInterface::class);
    $repository->expects($this->once())->method('save');

    $service = new ArticleService($repository);
    $dto = new CreateArticleDTO('Title', 'Content');

    $article = $service->create($dto);

    $this->assertInstanceOf(Article::class, $article);
}
```

## 관련 문서

- 클린 코드 - 클린 코드 원칙
- 코드 구성 - 프로젝트 구조
- 테스트 - 테스트 가이드
-../02-핵심 개념/보안/보안-모범 사례 - 보안 가이드
