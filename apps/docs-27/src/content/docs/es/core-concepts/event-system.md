---
title: "Sistema de eventos de XOOPS"
---

<span class="version-badge version-25x">2.5.x: Precargas</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[¿No está seguro de qué sistema de eventos usar?]
Consulte [Elegir un sistema de eventos](Choosing-Event-System.md) para un árbol de decisión con ejemplos de código para ambos enfoques.
:::

:::note[Dos sistemas de eventos en XOOPS]
| Sistema | Versión | Caso de uso |
|--------|---------|----------|
| **Sistema de precargas** | ✅ XOOPS 2.5.x (actual) | Enganchar eventos principales a través de `class/Preload.php` |
| **Despachador de eventos PSR-14** | 🚧 XOOPS 4.0 (futuro) | Distribución de eventos moderna con eventos tipados |

**Para módulos XOOPS 2.5.x**, use la sección [Sistema de precargas](#preload-system-legacy) a continuación. La sección PSR-14 es para el desarrollo de XOOPS 4.0.
:::

## Descripción general

El sistema de eventos de XOOPS permite un acoplamiento débil entre módulos a través de un patrón observador. Los componentes pueden emitir eventos que otras partes del sistema pueden escuchar y responder.

## Tipos de eventos

### Eventos principales

| Evento | Punto de disparo |
|-------|---------------|
| `core.header.start` | Antes del procesamiento del encabezado |
| `core.header.end` | Después del procesamiento del encabezado |
| `core.footer.start` | Antes de renderizar el pie de página |
| `core.footer.end` | Después de renderizar el pie de página |
| `core.exception` | Cuando ocurre una excepción |

### Eventos del ciclo de vida del módulo

| Evento | Punto de disparo |
|-------|---------------|
| `module.install` | Después de instalar el módulo |
| `module.update` | Después de actualizar el módulo |
| `module.uninstall` | Antes de eliminar el módulo |
| `module.activate` | Cuando el módulo se activa |
| `module.deactivate` | Cuando el módulo se desactiva |

### Eventos de usuario

| Evento | Punto de disparo |
|-------|---------------|
| `user.login` | Después de iniciar sesión exitosamente |
| `user.logout` | Después de cerrar sesión |
| `user.register` | Después del registro |
| `user.delete` | Antes de eliminar el usuario |

## Sistema de precargas (heredado)

### Creación de una precarga

```php
<?php
// class/Preload.php

namespace XoopsModules\MyModule;

use Xmf\Module\Helper\AbstractHelper;

final class Preload extends AbstractHelper
{
    public function eventCoreHeaderStart(array $args): void
    {
        // Se ejecuta en cada página antes del encabezado
    }

    public function eventCoreFooterStart(array $args): void
    {
        // Se ejecuta antes de que se renderice el pie de página
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];
        // Manejar evento de inicio de sesión
    }

    public function eventCoreException(array $args): void
    {
        $exception = $args['exception'];
        // Registrar o manejar excepción
    }
}
```

### Nomenclatura del método de evento

```
event{Category}{Action}

Ejemplos:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## Despachador de eventos PSR-14 (XOOPS 4.0)

### Clase de evento

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

### Despachando eventos

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

        // Despachar evento
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

### Escuchador de eventos

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

### Registrar escuchadores

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

## Eventos detenibles

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

// El escuchador puede detener la propagación
final class ContentModerationListener
{
    public function __invoke(ArticlePublishingEvent $event): void
    {
        if ($this->containsProhibitedContent($event->article)) {
            $event->reject('El contenido viola las directrices de la comunidad');
        }
    }
}
```

## Mejores prácticas

1. **Eventos inmutables** - Los eventos deben ser de solo lectura
2. **Eventos específicos** - Crear eventos específicos, no genéricos
3. **Asincrón cuando sea posible** - Usar colas para operaciones lentas
4. **Sin efectos secundarios en el envío** - El envío debe ser rápido
5. **Documentar eventos** - Listar eventos disponibles para usuarios del módulo

## Documentación relacionada

- [Desarrollo de módulos](../03-Module-Development/Module-Development.md) - Desarrollo de módulos
- [Guía del sistema de eventos](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - Guía PSR-14
- [Ganchos-Eventos](Hooks-Events.md) - Ganchos heredados
- [Eventos-y-Ganchos](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Ejemplos de eventos
