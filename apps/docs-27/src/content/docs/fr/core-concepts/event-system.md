---
title: "Système d'événements XOOPS"
---

<span class="version-badge version-25x">2.5.x: Preloads</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Pas sûr du système d'événements à utiliser ?]
Voir [Choosing an Event System](Choosing-Event-System.md) pour un arbre de décision avec des exemples de code pour les deux approches.
:::

:::note[Deux systèmes d'événements dans XOOPS]
| Système | Version | Cas d'utilisation |
|--------|---------|----------|
| **Système Preload** | ✅ XOOPS 2.5.x (actuel) | Se connecter aux événements de base via `class/Preload.php` |
| **Distributeur d'événements PSR-14** | 🚧 XOOPS 4.0 (futur) | Distribution d'événements modernes avec événements typés |

**Pour les modules XOOPS 2.5.x**, utilisez la section [Preload System](#preload-system-legacy) ci-dessous. La section PSR-14 est pour le développement XOOPS 4.0.
:::

## Aperçu

Le système d'événements XOOPS permet un couplage faible entre les modules via un modèle d'observateur. Les composants peuvent émettre des événements que d'autres parties du système peuvent écouter et auxquels elles peuvent répondre.

## Types d'événements

### Événements de base

| Événement | Point de déclenchement |
|-------|---------------|
| `core.header.start` | Avant le traitement du header |
| `core.header.end` | Après le traitement du header |
| `core.footer.start` | Avant le rendu du footer |
| `core.footer.end` | Après le rendu du footer |
| `core.exception` | Quand une exception se produit |

### Événements du cycle de vie du module

| Événement | Point de déclenchement |
|-------|---------------|
| `module.install` | Après l'installation du module |
| `module.update` | Après la mise à jour du module |
| `module.uninstall` | Avant la suppression du module |
| `module.activate` | Quand le module est activé |
| `module.deactivate` | Quand le module est désactivé |

### Événements utilisateur

| Événement | Point de déclenchement |
|-------|---------------|
| `user.login` | Après la connexion réussie |
| `user.logout` | Après la déconnexion |
| `user.register` | Après l'enregistrement |
| `user.delete` | Avant la suppression de l'utilisateur |

## Système Preload (Legacy)

### Créer un Preload

```php
<?php
// class/Preload.php

namespace XoopsModules\MyModule;

use Xmf\Module\Helper\AbstractHelper;

final class Preload extends AbstractHelper
{
    public function eventCoreHeaderStart(array $args): void
    {
        // Runs on every page before header
    }

    public function eventCoreFooterStart(array $args): void
    {
        // Runs before footer renders
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];
        // Handle login event
    }

    public function eventCoreException(array $args): void
    {
        $exception = $args['exception'];
        // Log or handle exception
    }
}
```

### Nommage de la méthode d'événement

```
event{Category}{Action}

Exemples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## Distributeur d'événements PSR-14 (XOOPS 4.0)

### Classe d'événement

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

### Distribution d'événements

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

        // Dispatch event
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

### Écouteur d'événement

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

### Enregistrement des écouteurs

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

## Événements arrêtables

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

// Listener can stop propagation
final class ContentModerationListener
{
    public function __invoke(ArticlePublishingEvent $event): void
    {
        if ($this->containsProhibitedContent($event->article)) {
            $event->reject('Content violates community guidelines');
        }
    }
}
```

## Meilleures pratiques

1. **Événements immuables** - Les événements doivent être en lecture seule
2. **Événements spécifiques** - Créez des événements spécifiques, pas des événements génériques
3. **Async si possible** - Utilisez des files d'attente pour les opérations lentes
4. **Pas d'effets secondaires dans la distribution** - La distribution doit être rapide
5. **Documentez les événements** - Listez les événements disponibles pour les utilisateurs du module

## Documentation connexe

- [Module-Development](../03-Module-Development/Module-Development.md) - Développement de modules
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - Guide PSR-14
- [Hooks-Events](Hooks-Events.md) - Hooks legacy
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Exemples d'événements
