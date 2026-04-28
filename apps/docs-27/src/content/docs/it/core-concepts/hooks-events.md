---
title: "Hook e Eventi"
---

## Panoramica

XOOPS fornisce hook e eventi come punti di estensione che consentono ai moduli di interagire con la funzionalità principale e tra loro senza dipendenze dirette.

## Hook vs Eventi

| Aspetto | Hook | Eventi |
|--------|-------|--------|
| Proposito | Modificare comportamento/dati | Reagire a occorrenze |
| Ritorno | Può restituire dati modificati | Tipicamente void |
| Timing | Prima/durante l'azione | Dopo l'azione |
| Pattern | Catena di filtri | Observer/pub-sub |

## Sistema Hook

### Registrazione di Hook

```php
// Registra un hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### Callback del Hook

```php
// include/hooks.php

function mymodule_hook_user_profile(array $data): array
{
    $userId = $data['user_id'];

    // Aggiungi campi di profilo personalizzati
    $data['fields']['reputation'] = mymodule_get_user_reputation($userId);
    $data['fields']['badges'] = mymodule_get_user_badges($userId);

    return $data;
}
```

### Hook principali disponibili

| Nome Hook | Dati | Descrizione |
|-----------|------|-------------|
| `user.profile.display` | Array dati utente | Modifica visualizzazione profilo |
| `content.render` | HTML contenuto | Filtra output contenuto |
| `form.submit` | Dati modulo | Valida/modifica dati modulo |
| `search.results` | Array risultati | Filtra risultati ricerca |
| `menu.main` | Voci di menu | Modifica menu principale |

## Sistema di eventi

### Dispatching degli eventi

```php
// Nel codice del tuo modulo
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### Ascolto degli eventi

```php
// class/Preload.php

class MyModulePreload extends \Xmf\Module\Helper\AbstractHelper
{
    public function eventMymoduleArticleCreated(array $args): void
    {
        $articleId = $args['article_id'];

        // Notifica agli iscritti
        $this->notifyNewArticle($articleId);
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];

        // Aggiorna ultimo accesso per il modulo
        $this->updateUserActivity($userId);
    }
}
```

## Riferimento degli eventi Preload

### Eventi principali

```php
// Header/Footer
public function eventCoreHeaderStart(array $args): void {}
public function eventCoreHeaderEnd(array $args): void {}
public function eventCoreFooterStart(array $args): void {}
public function eventCoreFooterEnd(array $args): void {}

// Inclusioni
public function eventCoreIncludeCommonStart(array $args): void {}
public function eventCoreIncludeCommonEnd(array $args): void {}

// Eccezioni
public function eventCoreException(array $args): void {}
```

### Eventi utente

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### Eventi modulo

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Eventi del modulo personalizzati

### Definizione di eventi

```php
// Definisci costanti di evento
class ArticleEvents
{
    public const CREATED = 'mymodule.article.created';
    public const UPDATED = 'mymodule.article.updated';
    public const DELETED = 'mymodule.article.deleted';
    public const PUBLISHED = 'mymodule.article.published';
}
```

### Attivazione degli eventi

```php
class ArticleService
{
    public function publish(Article $article): void
    {
        $article->publish();
        $this->repository->save($article);

        // Attiva evento
        $GLOBALS['xoopsPreload']->triggerEvent(
            ArticleEvents::PUBLISHED,
            ['article' => $article]
        );
    }
}
```

### Ascolto degli eventi del modulo

```php
// Nel Preload.php di un altro modulo

public function eventMymoduleArticlePublished(array $args): void
{
    $article = $args['article'];

    // Indizza per la ricerca
    $this->searchIndexer->index($article);

    // Aggiorna sitemap
    $this->sitemapGenerator->addUrl($article->url());
}
```

## Best practice

1. **Usa nomi specifici** - Formato `module.entity.action`
2. **Passa dati minimi** - Solo ciò che i listener necessitano
3. **Documenta gli eventi** - Elenca gli eventi nella documentazione del modulo
4. **Evita effetti collaterali** - Mantieni i listener focalizzati
5. **Gestisci gli errori** - Non far sì che gli errori dei listener interrompano il flusso

## Documentazione correlata

- Event-System - Documentazione dettagliata degli eventi
- ../03-Module-Development/Module-Development - Sviluppo del modulo
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - Eventi PSR-14
