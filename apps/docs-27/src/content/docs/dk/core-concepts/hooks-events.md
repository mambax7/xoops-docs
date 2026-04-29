---
title: "Hooks and Events"
---

## Oversigt

XOOPS leverer hooks og begivenheder som udvidelsespunkter, der tillader moduler at interagere med kernefunktionalitet og hinanden uden direkte afhængigheder.

## Hooks vs Events

| Aspekt | Kroge | Begivenheder |
|--------|--------|--------|
| Formål | Rediger adfærd/data | Reager på hændelser |
| Retur | Kan returnere ændrede data | Typisk ugyldig |
| Timing | Før/under handling | Efter handling |
| Mønster | Filterkæde | Observatør/pub-sub |

## Krogsystem

### Registrering af kroge

```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### Ring tilbagekald

```php
// include/hooks.php

function mymodule_hook_user_profile(array $data): array
{
    $userId = $data['user_id'];

    // Add custom profile fields
    $data['fields']['reputation'] = mymodule_get_user_reputation($userId);
    $data['fields']['badges'] = mymodule_get_user_badges($userId);

    return $data;
}
```

### Tilgængelige kernekroge

| Krog Navn | Data | Beskrivelse |
|-----------|------|------------|
| `user.profile.display` | Brugerdataarray | Rediger profilvisning |
| `content.render` | Indhold HTML | Filtrer indholdsoutput |
| `form.submit` | Formulardata | Validere/ændre formulardata |
| `search.results` | Resultater array | Filtrer søgeresultater |
| `menu.main` | Menupunkter | Rediger hovedmenu |

## Event System

### Udsendelse af begivenheder

```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### Lytter efter begivenheder

```php
// class/Preload.php

class MyModulePreload extends \Xmf\Module\Helper\AbstractHelper
{
    public function eventMymoduleArticleCreated(array $args): void
    {
        $articleId = $args['article_id'];

        // Notify subscribers
        $this->notifyNewArticle($articleId);
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];

        // Update last login for module
        $this->updateUserActivity($userId);
    }
}
```

## Forudindlæs begivenhedsreference

### Kernebegivenheder

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

### Brugerhændelser

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### Modulbegivenheder

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Tilpassede modulhændelser

### Definition af begivenheder

```php
// Define event constants
class ArticleEvents
{
    public const CREATED = 'mymodule.article.created';
    public const UPDATED = 'mymodule.article.updated';
    public const DELETED = 'mymodule.article.deleted';
    public const PUBLISHED = 'mymodule.article.published';
}
```

### Udløser hændelser

```php
class ArticleService
{
    public function publish(Article $article): void
    {
        $article->publish();
        $this->repository->save($article);

        // Trigger event
        $GLOBALS['xoopsPreload']->triggerEvent(
            ArticleEvents::PUBLISHED,
            ['article' => $article]
        );
    }
}
```

### Lytte til modulbegivenheder

```php
// In another module's Preload.php

public function eventMymoduleArticlePublished(array $args): void
{
    $article = $args['article'];

    // Index for search
    $this->searchIndexer->index($article);

    // Update sitemap
    $this->sitemapGenerator->addUrl($article->url());
}
```

## Bedste praksis

1. **Brug specifikke navne** - `module.entity.action`-format
2. **Send minimale data** - Kun hvad lyttere har brug for
3. **Dokumenthændelser** - List hændelser i moduldokumenter
4. **Undgå bivirkninger** - Hold lytterne fokuserede
5. **Håndter fejl** - Lad ikke lytterfejl bryde flowet

## Relateret dokumentation

- Event-System - Detaljeret event dokumentation
- ../03-Module-Development/Module-Development - Moduludvikling
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 begivenheder
