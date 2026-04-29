---
title: "Háčky a události"
---

## Přehled

XOOPS poskytuje háčky a události jako rozšiřující body, které umožňují modulům interagovat se základními funkcemi a navzájem bez přímých závislostí.

## Háčky vs události

| Aspekt | Háčky | Akce |
|--------|-------|--------|
| Účel | Upravit behavior/data | Reagovat na události |
| Návrat | Může vrátit upravená data | Obvykle neplatné |
| Načasování | Akce Before/during | Po akci |
| Vzor | Filtrový řetěz | Observer/pub-sub |

## Systém háku

### Registrace háčků

```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### Zpětné volání

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

### Dostupné jádrové háky

| Jméno háčku | Údaje | Popis |
|-----------|------|-------------|
| `user.profile.display` | Pole uživatelských dat | Upravit zobrazení profilu |
| `content.render` | Obsah HTML | Filtrovat výstup obsahu |
| `form.submit` | Údaje formuláře | Údaje formuláře Validate/modify |
| `search.results` | Pole výsledků | Filtrovat výsledky hledání |
| `menu.main` | Položky menu | Upravit hlavní menu |

## Systém událostí

### Dispečerské akce

```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### Poslouchání událostí

```php
// class/Preload.php

class MyModulePreload extends \XMF\Module\Helper\AbstractHelper
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

## Reference událostí předběžného načtení

### Hlavní události

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

### Uživatelské události

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### Události modulu

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Události vlastního modulu

### Definování událostí

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

### Spouštěcí události

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

### Poslech událostí modulu

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

## Nejlepší postupy

1. **Použijte specifické názvy** – formát `module.entity.action`
2. **Předejte minimální data** – Pouze to, co posluchači potřebují
3. **Události dokumentu** – Seznam událostí v dokumentech modulu
4. **Vyhněte se vedlejším účinkům** – Udržujte posluchače soustředěné
5. **Ošetřování chyb** – Nedovolte, aby chyby posluchače přerušily tok

## Související dokumentace

- Event-System - Podrobná dokumentace událostí
- ../03-Module-Development/Module-Development - Vývoj modulu
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 událostí