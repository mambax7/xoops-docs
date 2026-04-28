---
title: "Injeção de Dependência no XOOPS"
---

:::note[Compatibilidade de Versão]
| Recurso | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| DI Manual (injeção de construtor) | ✅ Disponível | ✅ Disponível |
| Container PSR-11 | ❌ Não built-in | ✅ Suporte nativo |
| `\Xmf\Module\Helper::getContainer()` | ❌ Apenas 4.0 | ✅ Disponível |

No **XOOPS 2.5.x**, use injeção de construtor manual (passando dependências explicitamente). Os exemplos de container PSR-11 abaixo são para **XOOPS 4.0**.
:::

## Visão Geral

Injeção de Dependência (DI) é um padrão de design que permite aos componentes receber suas dependências de fontes externas em vez de criá-las internamente. O XOOPS 4.0 introduz suporte nativo de container compatível com PSR-11.

## Por que Injeção de Dependência?

### Sem DI (Acoplamento Forte)

```php
class ArticleService
{
    private ArticleRepository $repository;
    private EventDispatcher $dispatcher;

    public function __construct()
    {
        // Dependências hard - difíceis de testar e modificar
        $this->repository = new ArticleRepository(new XoopsDatabase());
        $this->dispatcher = new EventDispatcher();
    }
}
```

### Com DI (Acoplamento Fraco)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## Container PSR-11

### Uso Básico

```php
use Psr\Container\ContainerInterface;

// Obter o container
$container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();

// Recuperar um serviço
$articleService = $container->get(ArticleService::class);

// Verificar se serviço existe
if ($container->has(ArticleService::class)) {
    // Usar o serviço
}
```

### Configuração do Container

```php
// config/services.php
use Psr\Container\ContainerInterface;

return [
    // Instanciação de classe simples
    ArticleRepository::class => ArticleRepository::class,

    // Vinculação de interface para implementação
    ArticleRepositoryInterface::class => ArticleRepository::class,

    // Função factory
    ArticleService::class => function (ContainerInterface $c): ArticleService {
        return new ArticleService(
            $c->get(ArticleRepositoryInterface::class),
            $c->get(EventDispatcherInterface::class)
        );
    },

    // Instância compartilhada (singleton)
    'database' => function (): XoopsDatabase {
        return XoopsDatabaseFactory::getDatabaseConnection();
    },
];
```

## Registro de Serviço

### Auto-wiring

```php
// O container resolve automaticamente as dependências
// quando type hints estão disponíveis

class ArticleController
{
    public function __construct(
        private readonly ArticleService $service,
        private readonly ViewRenderer $renderer
    ) {}
}

// Container cria ArticleController com suas dependências
$controller = $container->get(ArticleController::class);
```

### Registro Manual

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
        'arguments' => ['@database'],  // Referência a outro serviço
    ],
];
```

## Injeção de Construtor

### Abordagem Preferida

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
        $this->logger->info('Criando artigo', ['title' => $dto->title]);

        $article = Article::create($dto);
        $this->repository->save($article);
        $this->dispatcher->dispatch(new ArticleCreatedEvent($article));

        return $article;
    }
}
```

## Injeção de Método

### Para Dependências Opcionais

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

## Vinculação de Interface

### Definir Interfaces

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### Vincular Implementação

```php
// config/services.php
return [
    ArticleRepositoryInterface::class => XoopsArticleRepository::class,

    // Ou com factory
    ArticleRepositoryInterface::class => function (ContainerInterface $c) {
        return new XoopsArticleRepository(
            $c->get('database')
        );
    },
];
```

## Testando com DI

### Mockagem Fácil

```php
class ArticleServiceTest extends TestCase
{
    public function testCreateArticle(): void
    {
        // Criar mocks
        $repository = $this->createMock(ArticleRepositoryInterface::class);
        $dispatcher = $this->createMock(EventDispatcherInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // Injetar mocks
        $service = new ArticleService($repository, $dispatcher, $logger);

        // Definir expectativas
        $repository->expects($this->once())->method('save');
        $dispatcher->expects($this->once())->method('dispatch');

        // Testar
        $dto = new CreateArticleDTO('Título', 'Conteúdo');
        $article = $service->create($dto);

        $this->assertInstanceOf(Article::class, $article);
    }
}
```

## Integração Legada XOOPS

### Conectando Antigo e Novo

```php
// Obter serviço do container em código legado
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Envolvendo Manipuladores Legados

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

## Boas Práticas

1. **Injetar Interfaces** - Depender de abstrações, não implementações
2. **Injeção de Construtor** - Preferir construtor sobre injeção por setter
3. **Responsabilidade Única** - Cada classe deve ter poucas dependências
4. **Evitar Consciência de Container** - Serviços não devem saber sobre o container
5. **Configurar, Não Codificar** - Usar arquivos de configuração para wiring

## Documentação Relacionada

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - Implementação PSR-11
- ../03-Module-Development/Patterns/Service-Layer - Padrão de serviço
- ../03-Module-Development/Best-Practices/Testing - Testando com DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Visão geral de arquitetura
