---
title: "Crochets et événements"
---

## Aperçu

XOOPS fournit des crochets et des événements comme points d'extension qui permettent aux modules d'interagir avec les fonctionnalités principales et entre eux sans dépendances directes.

## Crochets vs Événements

| Aspect | Crochets | Événements |
|--------|----------|-----------|
| Objectif | Modifier le comportement/données | Réagir aux occurrences |
| Retour | Peut retourner des données modifiées | Généralement vide |
| Timing | Avant/pendant l'action | Après l'action |
| Motif | Chaîne de filtres | Observer/pub-sub |

## Système de crochets

### Enregistrement des crochets

```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### Rappel de crochet

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

### Crochets principaux disponibles

| Nom du crochet | Données | Description |
|----------------|---------|-------------|
| `user.profile.display` | Tableau de données utilisateur | Modifier l'affichage du profil |
| `content.render` | HTML du contenu | Filtrer la sortie de contenu |
| `form.submit` | Données du formulaire | Valider/modifier les données du formulaire |
| `search.results` | Tableau des résultats | Filtrer les résultats de recherche |
| `menu.main` | Éléments de menu | Modifier le menu principal |

## Système d'événements

### Envoi d'événements

```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### Écoute des événements

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

## Référence des événements de préchargement

### Événements principaux

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

### Événements utilisateur

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### Événements de module

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Événements de module personnalisé

### Définition des événements

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

### Déclenchement des événements

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

### Écoute des événements de module

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

## Meilleures pratiques

1. **Utiliser des noms spécifiques** - Format `module.entity.action`
2. **Passer des données minimales** - Seulement ce dont les écouteurs ont besoin
3. **Documenter les événements** - Lister les événements dans la documentation du module
4. **Éviter les effets secondaires** - Garder les écouteurs concentrés
5. **Gérer les erreurs** - Ne pas laisser les erreurs d'écouteur casser le flux

## Documentation associée

- Event-System - Documentation d'événement détaillée
- ../03-Module-Development/Module-Development - Développement de module
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - Événements PSR-14
