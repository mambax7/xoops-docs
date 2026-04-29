---
title: "Trnki in dogodki"
---
## Pregled

XOOPS ponuja kljuke in dogodke kot razširitvene točke, ki modulom omogočajo interakcijo z osnovno funkcionalnostjo in med seboj brez neposrednih odvisnosti.

## Kavlji proti dogodki

| Vidik | Kljuke | Dogodki |
|--------|-------|--------|
| Namen | Spremeni behavior/data | Odziv na dogodke |
| Vrnitev | Lahko vrne spremenjene podatke | Običajno nično |
| Čas | Before/during dejanje | Po akciji |
| Vzorec | Veriga filtra | Observer/pub-sub |

## Sistem kavljev

### Registriranje kavljev
```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```
### Povratni klic
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
### Na voljo Core Hooks

| Ime kljuke | Podatki | Opis |
|-----------|------|-------------|
| `user.profile.display` | Niz uporabniških podatkov | Spremeni prikaz profila |
| `content.render` | Vsebina HTML | Filtriraj izpis vsebine |
| `form.submit` | Podatki obrazca | Validate/modify podatki obrazca |
| `search.results` | Niz rezultatov | Filtriraj rezultate iskanja |
| `menu.main` | Elementi menija | Spremeni glavni meni |

## Sistem dogodkov

### Odpremni dogodki
```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```
### Poslušanje dogodkov
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
## Referenca dogodkov prednalaganja

### Ključni dogodki
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
### Uporabniški dogodki
```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```
### Dogodki modula
```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```
## Dogodki modula po meri

### Definiranje dogodkov
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
### Sprožilni dogodki
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
### Poslušanje dogodkov modula
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
## Najboljše prakse

1. **Uporabite posebna imena** - oblika `module.entity.action`
2. **Pass Minimal Data** – Samo tisto, kar poslušalci potrebujejo
3. **Dokumentiraj dogodke** - Seznam dogodkov v dokumentih modula
4. **Izogibajte se stranskim učinkom** – Poslušalci naj bodo osredotočeni
5. **Obravnavajte napake** - Ne dovolite, da bi napake poslušalcev prekinile tok

## Povezana dokumentacija

- Event-System - Podrobna dokumentacija dogodkov
- ../03-Module-Development/Module-Development - Razvoj modula
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 dogodkov