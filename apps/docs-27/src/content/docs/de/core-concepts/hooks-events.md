---
title: "Hooks und Events"
---

## Übersicht

XOOPS bietet Hooks und Events als Erweiterungspunkte, die Modulen ermöglichen, mit Core-Funktionalität und miteinander zu interagieren, ohne direkte Abhängigkeiten.

## Hooks vs Events

| Aspekt | Hooks | Events |
|--------|-------|--------|
| Zweck | Verhalten/Daten ändern | Auf Vorkommen reagieren |
| Rückgabe | Kann geänderte Daten zurückgeben | Typischerweise void |
| Timing | Vor/während Aktion | Nach Aktion |
| Pattern | Filter Chain | Observer/Pub-Sub |

## Hook System

### Hooks registrieren

```php
// Hook in xoops_version.php registrieren
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### Hook Callback

```php
// include/hooks.php

function mymodule_hook_user_profile(array $data): array
{
    $userId = $data['user_id'];

    // Custom Profile Felder hinzufügen
    $data['fields']['reputation'] = mymodule_get_user_reputation($userId);
    $data['fields']['badges'] = mymodule_get_user_badges($userId);

    return $data;
}
```

### Verfügbare Core Hooks

| Hook Name | Data | Beschreibung |
|-----------|------|-------------|
| `user.profile.display` | User Data Array | Profil-Anzeige ändern |
| `content.render` | Content HTML | Content-Ausgabe filtern |
| `form.submit` | Form Data | Form-Daten validieren/ändern |
| `search.results` | Results Array | Such-Ergebnisse filtern |
| `menu.main` | Menu Items | Hauptmenü ändern |

## Event System

### Events Dispatching

```php
// In Ihrem Modul-Code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### Events Listening

```php
// class/Preload.php

class MyModulePreload extends \Xmf\Module\Helper\AbstractHelper
{
    public function eventMymoduleArticleCreated(array $args): void
    {
        $articleId = $args['article_id'];

        // Abonnenten benachrichtigen
        $this->notifyNewArticle($articleId);
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];

        // Benutzer-Aktivität im Modul aktualisieren
        $this->updateUserActivity($userId);
    }
}
```

## Preload Events Referenz

### Core Events

```php
// Header/Footer
public function eventCoreHeaderStart(array $args): void {}
public function eventCoreHeaderEnd(array $args): void {}
public function eventCoreFooterStart(array $args): void {}
public function eventCoreFooterEnd(array $args): void {}

// Includes
public function eventCoreIncludeCommonStart(array $args): void {}
public function eventCoreIncludeCommonEnd(array $args): void {}

// Exceptions
public function eventCoreException(array $args): void {}
```

### User Events

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### Module Events

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Custom Module Events

### Events definieren

```php
// Event-Konstanten definieren
class ArticleEvents
{
    public const CREATED = 'mymodule.article.created';
    public const UPDATED = 'mymodule.article.updated';
    public const DELETED = 'mymodule.article.deleted';
    public const PUBLISHED = 'mymodule.article.published';
}
```

### Events Triggering

```php
class ArticleService
{
    public function publish(Article $article): void
    {
        $article->publish();
        $this->repository->save($article);

        // Event triggern
        $GLOBALS['xoopsPreload']->triggerEvent(
            ArticleEvents::PUBLISHED,
            ['article' => $article]
        );
    }
}
```

### Module Events Listening

```php
// In Preload.php eines anderen Moduls

public function eventMymoduleArticlePublished(array $args): void
{
    $article = $args['article'];

    // Für Suche indexieren
    $this->searchIndexer->index($article);

    // Sitemap aktualisieren
    $this->sitemapGenerator->addUrl($article->url());
}
```

## Best Practices

1. **Verwenden Sie spezifische Namen** - `module.entity.action` Format
2. **Übergeben Sie minimale Daten** - Nur was Listener brauchen
3. **Dokumentieren Sie Events** - Listen Sie Events in Modul-Docs auf
4. **Vermeiden Sie Nebenwirkungen** - Halten Sie Listener fokussiert
5. **Behandeln Sie Fehler** - Lassen Sie nicht Listener-Fehler den Flow brechen

## Verwandte Dokumentation

- Event-System - Detaillierte Event-Dokumentation
- ../03-Module-Development/Module-Development - Modul-Entwicklung
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 Events
