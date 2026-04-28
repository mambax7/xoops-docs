---
title: "Haki i zdarzenia"
---

## Przegląd

XOOPS zapewnia haki i zdarzenia jako punkty rozszerzenia, które pozwalają modułom wchodzić w interakcję z funkcjonalością rdzeniową i sobą nawzajem bez bezpośrednich zależności.

## Haki vs zdarzenia

| Aspekt | Haki | Zdarzenia |
|--------|-------|--------|
| Cel | Modyfikuj zachowanie/dane | Reaguj na zdarzenia |
| Zwrot | Może zwrócić zmodyfikowane dane | Zazwyczaj void |
| Timing | Przed/podczas akcji | Po akcji |
| Wzorzec | Łańcuch filtrów | Observer/pub-sub |

## System haków

### Rejestracja haków

```php
// Zarejestruj hak w xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### Callback haku

```php
// include/hooks.php

function mymodule_hook_user_profile(array $data): array
{
    $userId = $data['user_id'];

    // Dodaj niestandardowe pola profilu
    $data['fields']['reputation'] = mymodule_get_user_reputation($userId);
    $data['fields']['badges'] = mymodule_get_user_badges($userId);

    return $data;
}
```

### Dostępne haki rdzeniowe

| Nazwa haku | Dane | Opis |
|-----------|------|-------------|
| `user.profile.display` | Tablica danych użytkownika | Modyfikuj wyświetlanie profilu |
| `content.render` | HTML zawartości | Filtruj wyjście zawartości |
| `form.submit` | Dane formularza | Waliduj/modyfikuj dane formularza |
| `search.results` | Tablica wyników | Filtruj wyniki wyszukiwania |
| `menu.main` | Elementy menu | Modyfikuj menu główne |

## System zdarzeń

### Dyspozycja zdarzeń

```php
// W kodzie twojego modułu
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### Słuchanie zdarzeń

```php
// class/Preload.php

class MyModulePreload extends \Xmf\Module\Helper\AbstractHelper
{
    public function eventMymoduleArticleCreated(array $args): void
    {
        $articleId = $args['article_id'];

        // Powiadom subskrybentów
        $this->notifyNewArticle($articleId);
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];

        // Aktualizuj aktywność użytkownika dla modułu
        $this->updateUserActivity($userId);
    }
}
```

## Referencja zdarzeń Preload

### Zdarzenia rdzeniowe

```php
// Nagłówek/stopka
public function eventCoreHeaderStart(array $args): void {}
public function eventCoreHeaderEnd(array $args): void {}
public function eventCoreFooterStart(array $args): void {}
public function eventCoreFooterEnd(array $args): void {}

// Include
public function eventCoreIncludeCommonStart(array $args): void {}
public function eventCoreIncludeCommonEnd(array $args): void {}

// Wyjątki
public function eventCoreException(array $args): void {}
```

### Zdarzenia użytkownika

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### Zdarzenia modułu

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Niestandardowe zdarzenia modułu

### Definiowanie zdarzeń

```php
// Zdefiniuj stałe zdarzeń
class ArticleEvents
{
    public const CREATED = 'mymodule.article.created';
    public const UPDATED = 'mymodule.article.updated';
    public const DELETED = 'mymodule.article.deleted';
    public const PUBLISHED = 'mymodule.article.published';
}
```

### Wyzwalanie zdarzeń

```php
class ArticleService
{
    public function publish(Article $article): void
    {
        $article->publish();
        $this->repository->save($article);

        // Wyzwól zdarzenie
        $GLOBALS['xoopsPreload']->triggerEvent(
            ArticleEvents::PUBLISHED,
            ['article' => $article]
        );
    }
}
```

### Słuchanie zdarzeń modułu

```php
// W Preload.php innego modułu

public function eventMymoduleArticlePublished(array $args): void
{
    $article = $args['article'];

    // Indeksuj dla wyszukiwania
    $this->searchIndexer->index($article);

    // Aktualizuj mapę witryny
    $this->sitemapGenerator->addUrl($article->url());
}
```

## Najlepsze praktyki

1. **Używaj specyficznych nazw** - format `module.entity.action`
2. **Przekazuj minimalne dane** - Tylko to, czego potrzebują nasłuchiwacze
3. **Dokumentuj zdarzenia** - Wypisz zdarzenia w dokumentacji modułu
4. **Unikaj efektów ubocznych** - Utrzymuj nasłuchiwaczy skoncentrowanych
5. **Obsługuj błędy** - Nie pozwól, aby błędy nasłuchiwaczy przerywały przepływ

## Powiązana dokumentacja

- Event-System - Szczegółowa dokumentacja zdarzeń
- ../03-Module-Development/Module-Development - Tworzenie modułu
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - Zdarzenia PSR-14
