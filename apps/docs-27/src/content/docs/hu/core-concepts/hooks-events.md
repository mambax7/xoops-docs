---
title: "Horgok és események"
---
## Áttekintés

A XOOPS hookokat és eseményeket biztosít kiterjesztési pontokként, amelyek lehetővé teszik, hogy a modulok kölcsönhatásba lépjenek az alapvető funkciókkal és egymással közvetlen függőségek nélkül.

## Hooks vs Events

| Szempont | Horgok | Események |
|--------|--------|--------|
| Cél | behavior/data | Reakció az eseményekre |
| Vissza | Visszaadhatja a módosított adatokat | Jellemzően üres |
| Időzítés | Before/during akció | Akció után |
| Minta | Szűrőlánc | Observer/pub-sub |

## Hook System

### Horgok regisztrálása

```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### Hook-visszahívás

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

### Elérhető Core Hooks

| Horog neve | Adatok | Leírás |
|-----------|------|--------------|
| `user.profile.display` | Felhasználói adattömb | Profil megjelenítésének módosítása |
| `content.render` | Tartalom HTML | Tartalmi kimenet szűrése |
| `form.submit` | Űrlapadatok | Validate/modify űrlapadatok |
| `search.results` | Eredmények tömb | Keresési eredmények szűrése |
| `menu.main` | Menüpontok | Főmenü módosítása |

## Eseményrendszer

### Események feladása

```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### Események figyelése

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

## Eseményreferencia előtöltése

### Alapvető események

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

### Felhasználói események

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### modul események

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Egyéni modul események

### Események meghatározása

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

### Események kiváltása

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

### A modul eseményeinek meghallgatása

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

## Bevált gyakorlatok

1. **Használjon konkrét neveket** - `module.entity.action` formátum
2. **Minimális adat megadása** – Csak azt adja meg, amire a hallgatóknak szüksége van
3. **Dokumentum események** - Az események listázása a moduldokumentumokban
4. **Kerülje el a mellékhatásokat** - Tartsa hallgatóit összpontosítva
5. **Hibák kezelése** - Ne hagyja, hogy a figyelő hibák megszakítsák az áramlást

## Kapcsolódó dokumentáció

- Eseményrendszer - Részletes eseménydokumentáció
- ../03-module-Development/module-Development - modulfejlesztés
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 események
