---
title: "Udice i događaji"
---
## Pregled

XOOPS pruža spojnice i događaje kao točke proširenja koje omogućuju modules interakciju s osnovnom funkcionalnošću i međusobno bez izravnih ovisnosti.

## Udice protiv događaja

| Aspekt | Kuke | Događaji |
|--------|-------|--------|
| Svrha | Izmjena ponašanja/podataka | Reagirati na pojave |
| Povratak | Može vratiti modificirane podatke | Obično ništavno |
| Vrijeme | Prije/tijekom akcije | Nakon akcije |
| Uzorak | Lanac filtera | Promatrač/pub-sub |

## Sustav kukica

### Registriranje kuka

```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### Hook Back Call

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

### Dostupne kuke za jezgre

| Naziv udice | Podaci | Opis |
|-----------|------|-------------|
| `user.profile.display` | Niz korisničkih podataka | Izmjena prikaza profila |
| `content.render` | Content HTML | Filtriraj izlaz sadržaja |
| `form.submit` | Podaci obrasca | Provjeri/izmijeni podatke obrasca |
| `search.results` | Niz rezultata | Filtriraj rezultate pretraživanja |
| `menu.main` | Stavke izbornika | Izmjena glavnog izbornika |

## Sustav događaja

### Slanje događaja

```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### Osluškujući događaje

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

## Referenca događaja prethodnog učitavanja

### Osnovni događaji

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

### Korisnički događaji

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### Događaji modula

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Prilagođeni događaji modula

### Definiranje događaja

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

### Pokretanje događaja

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

### Slušanje događaja modula

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

## Najbolji primjeri iz prakse

1. **Koristite određena imena** - format `module.entity.action`
2. **Pass Minimal Data** - Samo ono što slušatelji trebaju
3. **Dokumentiraj događaje** - Popis događaja u dokumentima modula
4. **Izbjegnite nuspojave** - Držite slušatelje usredotočene
5. **Rješavanje pogrešaka** - Ne dopustite da pogreške slušatelja prekinu tok

## Povezana dokumentacija

- Event-System - Detaljna dokumentacija događaja
- ../03-Razvoj-modula/Razvoj-modula - Razvoj modula
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 događaji
