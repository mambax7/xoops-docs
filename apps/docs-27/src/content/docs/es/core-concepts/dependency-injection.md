---
title: "Inyección de dependencias en XOOPS"
---

:::note[Compatibilidad de versiones]
| Función | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| DI manual (inyección de constructor) | ✅ Disponible | ✅ Disponible |
| Contenedor PSR-11 | ❌ No integrado | ✅ Soporte nativo |
| `\Xmf\Module\Helper::getContainer()` | ❌ Solo 4.0 | ✅ Disponible |

En **XOOPS 2.5.x**, use inyección manual de constructor (pasando dependencias explícitamente). Los ejemplos del contenedor PSR-11 a continuación son para **XOOPS 4.0**.
:::

## Descripción general

La inyección de dependencias (DI) es un patrón de diseño que permite que los componentes reciban sus dependencias de fuentes externas en lugar de crearlas internamente. XOOPS 4.0 introduce soporte de contenedor DI compatible con PSR-11.

## ¿Por qué inyección de dependencias?

### Sin DI (Acoplamiento fuerte)

```php
class ArticleService
{
    private ArticleRepository $repository;
    private EventDispatcher $dispatcher;

    public function __construct()
    {
        // Dependencias duras - difíciles de probar y modificar
        $this->repository = new ArticleRepository(new XoopsDatabase());
        $this->dispatcher = new EventDispatcher();
    }
}
```

### Con DI (Acoplamiento débil)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## Contenedor PSR-11

### Uso básico

```php
use Psr\Container\ContainerInterface;

// Obtener el contenedor
$container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();

// Recuperar un servicio
$articleService = $container->get(ArticleService::class);

// Comprobar si existe el servicio
if ($container->has(ArticleService::class)) {
    // Usar el servicio
}
```

### Configuración del contenedor

```php
// config/services.php
use Psr\Container\ContainerInterface;

return [
    // Instanciación simple de clase
    ArticleRepository::class => ArticleRepository::class,

    // Vinculación de interfaz a implementación
    ArticleRepositoryInterface::class => ArticleRepository::class,

    // Función de fábrica
    ArticleService::class => function (ContainerInterface $c): ArticleService {
        return new ArticleService(
            $c->get(ArticleRepositoryInterface::class),
            $c->get(EventDispatcherInterface::class)
        );
    },

    // Instancia compartida (singleton)
    'database' => function (): XoopsDatabase {
        return XoopsDatabaseFactory::getDatabaseConnection();
    },
];
```

## Registro de servicios

### Auto-cableado

```php
// El contenedor resuelve automáticamente las dependencias
// cuando hay sugerencias de tipo disponibles

class ArticleController
{
    public function __construct(
        private readonly ArticleService $service,
        private readonly ViewRenderer $renderer
    ) {}
}

// El contenedor crea ArticleController con sus dependencias
$controller = $container->get(ArticleController::class);
```

### Registro manual

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
        'arguments' => ['@database'],  // Referencia otro servicio
    ],
];
```

## Inyección de constructor

### Enfoque preferido

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

## Inyección de método

### Para dependencias opcionales

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

## Vinculación de interfaz

### Definir interfaces

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### Vincular implementación

```php
// config/services.php
return [
    ArticleRepositoryInterface::class => XoopsArticleRepository::class,

    // O con fábrica
    ArticleRepositoryInterface::class => function (ContainerInterface $c) {
        return new XoopsArticleRepository(
            $c->get('database')
        );
    },
];
```

## Pruebas con DI

### Burla fácil

```php
class ArticleServiceTest extends TestCase
{
    public function testCreateArticle(): void
    {
        // Crear burlas
        $repository = $this->createMock(ArticleRepositoryInterface::class);
        $dispatcher = $this->createMock(EventDispatcherInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // Inyectar burlas
        $service = new ArticleService($repository, $dispatcher, $logger);

        // Establecer expectativas
        $repository->expects($this->once())->method('save');
        $dispatcher->expects($this->once())->method('dispatch');

        // Prueba
        $dto = new CreateArticleDTO('Title', 'Content');
        $article = $service->create($dto);

        $this->assertInstanceOf(Article::class, $article);
    }
}
```

## Integración heredada de XOOPS

### Puente entre antiguo y nuevo

```php
// Obtener servicio del contenedor en código heredado
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Envolver controladores heredados

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

## Mejores prácticas

1. **Inyectar interfaces** - Depender de abstracciones, no de implementaciones
2. **Inyección de constructor** - Preferir constructor sobre inyección de setter
3. **Responsabilidad única** - Cada clase debe tener pocas dependencias
4. **Evitar conocimiento del contenedor** - Los servicios no deberían conocer el contenedor
5. **Configurar, no codificar** - Usar archivos de configuración para el cableado

## Documentación relacionada

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - Implementación PSR-11
- ../03-Module-Development/Patterns/Service-Layer - Patrón de servicio
- ../03-Module-Development/Best-Practices/Testing - Pruebas con DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Descripción general de la arquitectura
