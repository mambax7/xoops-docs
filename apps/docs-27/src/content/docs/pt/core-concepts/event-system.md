---
title: "Sistema de Eventos XOOPS"
---

<span class="version-badge version-25x">2.5.x: Preloads</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Não tem certeza de qual sistema de eventos usar?]
Veja [Escolhendo um Sistema de Eventos](Choosing-Event-System.md) para uma árvore de decisão com exemplos de código para ambas as abordagens.
:::

:::note[Dois Sistemas de Eventos no XOOPS]
| Sistema | Versão | Caso de Uso |
|--------|---------|----------|
| **Sistema de Preload** | ✅ XOOPS 2.5.x (atual) | Conectar a eventos principais via `class/Preload.php` |
| **Despachador de Eventos PSR-14** | 🚧 XOOPS 4.0 (futuro) | Despacho de eventos moderno com eventos tipados |

**Para módulos XOOPS 2.5.x**, use a seção [Sistema de Preload](#sistema-de-preload-legado) abaixo. A seção PSR-14 é para desenvolvimento do XOOPS 4.0.
:::

## Visão Geral

O sistema de eventos XOOPS permite o acoplamento fraco entre módulos através de um padrão observer. Componentes podem emitir eventos que outras partes do sistema podem ouvir e responder.

## Tipos de Eventos

### Eventos do Core

| Evento | Ponto de Disparo |
|-------|---------------|
| `core.header.start` | Antes do processamento do cabeçalho |
| `core.header.end` | Depois do processamento do cabeçalho |
| `core.footer.start` | Antes da renderização do rodapé |
| `core.footer.end` | Depois da renderização do rodapé |
| `core.exception` | Quando exceção ocorre |

### Eventos de Ciclo de Vida do Módulo

| Evento | Ponto de Disparo |
|-------|---------------|
| `module.install` | Depois da instalação do módulo |
| `module.update` | Depois da atualização do módulo |
| `module.uninstall` | Antes da remoção do módulo |
| `module.activate` | Quando o módulo é ativado |
| `module.deactivate` | Quando o módulo é desativado |

### Eventos de Usuário

| Evento | Ponto de Disparo |
|-------|---------------|
| `user.login` | Depois do login bem-sucedido |
| `user.logout` | Depois do logout |
| `user.register` | Depois do registro |
| `user.delete` | Antes da exclusão do usuário |

## Sistema de Preload (Legado)

### Criando um Preload

```php
<?php
// class/Preload.php

namespace XoopsModules\MyModule;

use Xmf\Module\Helper\AbstractHelper;

final class Preload extends AbstractHelper
{
    public function eventCoreHeaderStart(array $args): void
    {
        // Executa em cada página antes do cabeçalho
    }

    public function eventCoreFooterStart(array $args): void
    {
        // Executa antes do rodapé renderizar
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];
        // Lidar com evento de login
    }

    public function eventCoreException(array $args): void
    {
        $exception = $args['exception'];
        // Log ou lidar com exceção
    }
}
```

### Nomeação de Método de Evento

```
event{Categoria}{Ação}

Exemplos:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## Despachador de Eventos PSR-14 (XOOPS 4.0)

### Classe de Evento

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule\Event;

final class ArticleCreatedEvent
{
    public function __construct(
        public readonly int $articleId,
        public readonly int $authorId,
        public readonly string $title,
        public readonly \DateTimeImmutable $createdAt
    ) {}
}
```

### Disparando Eventos

```php
use Psr\EventDispatcher\EventDispatcherInterface;

final class ArticleService
{
    public function __construct(
        private readonly ArticleRepository $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}

    public function create(CreateArticleDTO $dto): Article
    {
        $article = Article::create($dto);
        $this->repository->save($article);

        // Disparar evento
        $this->dispatcher->dispatch(new ArticleCreatedEvent(
            articleId: $article->getId(),
            authorId: $article->getAuthorId(),
            title: $article->getTitle(),
            createdAt: new \DateTimeImmutable()
        ));

        return $article;
    }
}
```

### Ouvinte de Evento

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule\Listener;

use XoopsModules\MyModule\Event\ArticleCreatedEvent;

final class SendNotificationOnArticleCreated
{
    public function __construct(
        private readonly NotificationService $notifications
    ) {}

    public function __invoke(ArticleCreatedEvent $event): void
    {
        $this->notifications->notifySubscribers(
            'new_article',
            [
                'article_id' => $event->articleId,
                'title' => $event->title,
            ]
        );
    }
}
```

### Registrando Ouvintes

```php
// config/events.php

return [
    ArticleCreatedEvent::class => [
        SendNotificationOnArticleCreated::class,
        UpdateSearchIndex::class,
        ClearArticleCache::class,
    ],

    ArticleUpdatedEvent::class => [
        UpdateSearchIndex::class,
        ClearArticleCache::class,
    ],

    ArticleDeletedEvent::class => [
        RemoveFromSearchIndex::class,
        ClearArticleCache::class,
    ],
];
```

## Eventos Paralizáveis

```php
use Psr\EventDispatcher\StoppableEventInterface;

final class ArticlePublishingEvent implements StoppableEventInterface
{
    private bool $propagationStopped = false;
    private ?string $rejectionReason = null;

    public function __construct(
        public readonly Article $article
    ) {}

    public function isPropagationStopped(): bool
    {
        return $this->propagationStopped;
    }

    public function reject(string $reason): void
    {
        $this->propagationStopped = true;
        $this->rejectionReason = $reason;
    }

    public function getRejectionReason(): ?string
    {
        return $this->rejectionReason;
    }
}

// Ouvinte pode parar propagação
final class ContentModerationListener
{
    public function __invoke(ArticlePublishingEvent $event): void
    {
        if ($this->containsProhibitedContent($event->article)) {
            $event->reject('Conteúdo viola diretrizes da comunidade');
        }
    }
}
```

## Boas Práticas

1. **Eventos Imutáveis** - Eventos devem ser somente leitura
2. **Eventos Específicos** - Criar eventos específicos, não genéricos
3. **Assíncrono Quando Possível** - Usar filas para operações lentas
4. **Nenhum Efeito Colateral no Despacho** - Despacho deve ser rápido
5. **Documente Eventos** - Listar eventos disponíveis para usuários do módulo

## Documentação Relacionada

- [Module-Development](../03-Module-Development/Module-Development.md) - Desenvolvimento de módulo
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - Guia PSR-14
- [Hooks-Events](Hooks-Events.md) - Ganchos legados
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Exemplos de eventos
