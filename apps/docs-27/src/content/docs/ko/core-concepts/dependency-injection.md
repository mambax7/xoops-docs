---
title: "XOOPS의 종속성 주입"
---

:::참고[버전 호환성]
| 기능 | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| 수동 DI(생성자 주입) | ✅ 이용 가능 | ✅ 이용 가능 |
| PSR-11 컨테이너 | ❌ 내장되지 않음 | ✅ 기본 지원 |
| `\Xmf\Module\Helper::getContainer()` | ❌ 4.0 전용 | ✅ 이용 가능 |

**XOOPS 2.5.x**에서는 수동 생성자 주입(종속성을 명시적으로 전달)을 사용합니다. 아래 PSR-11 컨테이너 예제는 **XOOPS 4.0**용입니다.
:::

## 개요

DI(종속성 주입)는 구성 요소가 내부적으로 종속성을 생성하는 대신 외부 소스로부터 종속성을 수신할 수 있도록 하는 디자인 패턴입니다. XOOPS 4.0에는 PSR-11 호환 DI 컨테이너 지원이 도입되었습니다.

## 왜 의존성 주입을 하는가?

### DI 없음(타이트 커플링)

```php
class ArticleService
{
    private ArticleRepository $repository;
    private EventDispatcher $dispatcher;

    public function __construct()
    {
        // Hard dependencies - difficult to test and modify
        $this->repository = new ArticleRepository(new XoopsDatabase());
        $this->dispatcher = new EventDispatcher();
    }
}
```

### DI 포함(느슨한 커플링)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## PSR-11 컨테이너

### 기본 사용법

```php
use Psr\Container\ContainerInterface;

// Get the container
$container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();

// Retrieve a service
$articleService = $container->get(ArticleService::class);

// Check if service exists
if ($container->has(ArticleService::class)) {
    // Use the service
}
```

### 컨테이너 구성

```php
// config/services.php
use Psr\Container\ContainerInterface;

return [
    // Simple class instantiation
    ArticleRepository::class => ArticleRepository::class,

    // Interface to implementation binding
    ArticleRepositoryInterface::class => ArticleRepository::class,

    // Factory function
    ArticleService::class => function (ContainerInterface $c): ArticleService {
        return new ArticleService(
            $c->get(ArticleRepositoryInterface::class),
            $c->get(EventDispatcherInterface::class)
        );
    },

    // Shared instance (singleton)
    'database' => function (): XoopsDatabase {
        return XoopsDatabaseFactory::getDatabaseConnection();
    },
];
```

## 서비스 등록

### 자동 배선

```php
// The container automatically resolves dependencies
// when type hints are available

class ArticleController
{
    public function __construct(
        private readonly ArticleService $service,
        private readonly ViewRenderer $renderer
    ) {}
}

// Container creates ArticleController with its dependencies
$controller = $container->get(ArticleController::class);
```

### 수동 등록

```php
// config/services.php
return [
    ArticleService::class => [
        'class' => ArticleService::class,
        'arguments' => [
            ArticleRepositoryInterface::class,
            EventDispatcherInterface::class,
        ],
        'shared' => true,  // Singleton
    ],

    'article.handler' => [
        'factory' => [ArticleHandlerFactory::class, 'create'],
        'arguments' => ['@database'],  // Reference other service
    ],
];
```

## 생성자 주입

### 선호되는 접근 방식

```php
final class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher,
        private readonly LoggerInterface $logger
    ) {}

    public function create(CreateArticleDTO $dto): Article
    {
        $this->logger->info('Creating article', ['title' => $dto->title]);

        $article = Article::create($dto);
        $this->repository->save($article);
        $this->dispatcher->dispatch(new ArticleCreatedEvent($article));

        return $article;
    }
}
```

## 메소드 주입

### 선택적 종속성의 경우

```php
class ArticleController
{
    public function __construct(
        private readonly ArticleService $service
    ) {}

    public function show(int $id, ?CacheInterface $cache = null): Response
    {
        $cacheKey = "article_{$id}";

        if ($cache && $cached = $cache->get($cacheKey)) {
            return $this->render($cached);
        }

        $article = $this->service->findById($id);

        $cache?->set($cacheKey, $article, 3600);

        return $this->render($article);
    }
}
```

## 인터페이스 바인딩

### 인터페이스 정의

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### 바인드 구현

```php
// config/services.php
return [
    ArticleRepositoryInterface::class => XoopsArticleRepository::class,

    // Or with factory
    ArticleRepositoryInterface::class => function (ContainerInterface $c) {
        return new XoopsArticleRepository(
            $c->get('database')
        );
    },
];
```

## DI로 테스트하기

### 쉬운 조롱

```php
class ArticleServiceTest extends TestCase
{
    public function testCreateArticle(): void
    {
        // Create mocks
        $repository = $this->createMock(ArticleRepositoryInterface::class);
        $dispatcher = $this->createMock(EventDispatcherInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // Inject mocks
        $service = new ArticleService($repository, $dispatcher, $logger);

        // Set expectations
        $repository->expects($this->once())->method('save');
        $dispatcher->expects($this->once())->method('dispatch');

        // Test
        $dto = new CreateArticleDTO('Title', 'Content');
        $article = $service->create($dto);

        $this->assertInstanceOf(Article::class, $article);
    }
}
```

## XOOPS 레거시 통합

### 옛것과 새것의 연결

```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### 레거시 핸들러 래핑

```php
// config/services.php
return [
    'article.handler' => function () {
        return xoops_getModuleHandler('article', 'mymodule');
    },

    ArticleRepositoryInterface::class => function (ContainerInterface $c) {
        return new LegacyArticleRepository(
            $c->get('article.handler')
        );
    },
];
```

## 모범 사례

1. **인터페이스 주입** - 구현이 아닌 추상화에 의존
2. **생성자 주입** - setter 주입보다 생성자를 선호합니다.
3. **단일 책임** - 각 클래스에는 종속성이 거의 없어야 합니다.
4. **컨테이너 인식 방지** - 서비스는 컨테이너에 대해 알 수 없어야 합니다.
5. **코딩하지 말고 구성하세요** - 배선에 구성 파일을 사용하세요.

## 관련 문서

-../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - PSR-11 구현
-../03-모듈-개발/패턴/서비스-레이어 - 서비스 패턴
-../03-모듈 개발/모범 사례/테스트 - DI를 사용한 테스트
-../07-XOOPS-4.0/XOOPS-4.0-Architecture - 아키텍처 개요
