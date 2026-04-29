---
title: "Haken en evenementen"
---
## Overzicht

XOOPS biedt hooks en gebeurtenissen als uitbreidingspunten waarmee modules kunnen communiceren met kernfunctionaliteit en met elkaar zonder directe afhankelijkheden.

## Haken versus evenementen

| Aspect | Haken | Evenementen |
|--------|-------|--------|
| Doel | Gedrag/gegevens aanpassen | Reageren op gebeurtenissen |
| Terug | Kan gewijzigde gegevens retourneren | Typisch ongeldig |
| Tijdstip | Voor/tijdens actie | Na actie |
| Patroon | Filterketen | Waarnemer/pub-sub |

## Haaksysteem

### Haken registreren

```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### Terugbellen op de haak

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

### Beschikbare kernhaken

| Haaknaam | Gegevens | Beschrijving |
|-----------|------|------------|
| `user.profile.display` | Array gebruikersgegevens | Profielweergave aanpassen |
| `content.render` | Inhoud HTML | Inhouduitvoer filteren |
| `form.submit` | Formuliergegevens | Formuliergegevens valideren/wijzigen |
| `search.results` | Resultatenmatrix | Zoekresultaten filteren |
| `menu.main` | Menu-items | Hoofdmenu aanpassen |

## Gebeurtenissysteem

### Verzendevenementen

```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### Luisteren naar gebeurtenissen

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

## Referentie voor vooraf geladen gebeurtenissen

### Kerngebeurtenissen

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

### Gebruikersgebeurtenissen

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### Module-evenementen

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Aangepaste module-evenementen

### Gebeurtenissen definiëren

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

### Triggerende gebeurtenissen

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

### Luisteren naar modulegebeurtenissen

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

## Beste praktijken

1. **Gebruik specifieke namen** - `module.entity.action`-indeling
2. **Geef minimale gegevens door** - Alleen wat luisteraars nodig hebben
3. **Documentgebeurtenissen** - Lijst gebeurtenissen in moduledocumenten
4. **Vermijd bijwerkingen** - Houd de luisteraars gefocust
5. **Fouten afhandelen** - Zorg ervoor dat luisteraarfouten de stroom niet verstoren

## Gerelateerde documentatie

- Event-System - Gedetailleerde gebeurtenisdocumentatie
- ../03-Module-ontwikkeling/Module-ontwikkeling - Module-ontwikkeling
- ../07-XOOPS-4.0/Implementatiehandleidingen/Event-System-Guide - PSR-14 gebeurtenissen