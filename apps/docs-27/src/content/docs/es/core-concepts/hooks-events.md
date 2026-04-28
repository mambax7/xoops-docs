---
title: "Ganchos y eventos"
---

## Descripción general

XOOPS proporciona ganchos y eventos como puntos de extensión que permiten que los módulos interactúen con la funcionalidad principal y entre sí sin dependencias directas.

## Ganchos vs Eventos

| Aspecto | Ganchos | Eventos |
|--------|-------|--------|
| Propósito | Modificar comportamiento/datos | Reaccionar a ocurrencias |
| Retorno | Puede devolver datos modificados | Típicamente nulo |
| Timing | Antes/durante acción | Después de la acción |
| Patrón | Cadena de filtros | Observer/pub-sub |

## Sistema de ganchos

### Registrar ganchos

```php
// Registrar un gancho en xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### Gancho de devolución de llamada

```php
// include/hooks.php

function mymodule_hook_user_profile(array $data): array
{
    $userId = $data['user_id'];

    // Agregar campos de perfil personalizados
    $data['fields']['reputation'] = mymodule_get_user_reputation($userId);
    $data['fields']['badges'] = mymodule_get_user_badges($userId);

    return $data;
}
```

### Ganchos principales disponibles

| Nombre del gancho | Datos | Descripción |
|-----------|------|-------------|
| `user.profile.display` | Matriz de datos de usuario | Modificar visualización de perfil |
| `content.render` | HTML de contenido | Filtrar salida de contenido |
| `form.submit` | Datos del formulario | Validar/modificar datos del formulario |
| `search.results` | Matriz de resultados | Filtrar resultados de búsqueda |
| `menu.main` | Elementos del menú | Modificar menú principal |

## Sistema de eventos

### Despachando eventos

```php
// En su código de módulo
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### Escuchando eventos

```php
// class/Preload.php

class MyModulePreload extends \Xmf\Module\Helper\AbstractHelper
{
    public function eventMymoduleArticleCreated(array $args): void
    {
        $articleId = $args['article_id'];

        // Notificar a los suscriptores
        $this->notifyNewArticle($articleId);
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];

        // Actualizar último inicio de sesión para módulo
        $this->updateUserActivity($userId);
    }
}
```

## Referencia de eventos de precarga

### Eventos principales

```php
// Encabezado/Pie de página
public function eventCoreHeaderStart(array $args): void {}
public function eventCoreHeaderEnd(array $args): void {}
public function eventCoreFooterStart(array $args): void {}
public function eventCoreFooterEnd(array $args): void {}

// Inclusiones
public function eventCoreIncludeCommonStart(array $args): void {}
public function eventCoreIncludeCommonEnd(array $args): void {}

// Excepciones
public function eventCoreException(array $args): void {}
```

### Eventos de usuario

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### Eventos del módulo

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Eventos personalizados del módulo

### Definición de eventos

```php
// Definir constantes de evento
class ArticleEvents
{
    public const CREATED = 'mymodule.article.created';
    public const UPDATED = 'mymodule.article.updated';
    public const DELETED = 'mymodule.article.deleted';
    public const PUBLISHED = 'mymodule.article.published';
}
```

### Desencadenar eventos

```php
class ArticleService
{
    public function publish(Article $article): void
    {
        $article->publish();
        $this->repository->save($article);

        // Desencadenar evento
        $GLOBALS['xoopsPreload']->triggerEvent(
            ArticleEvents::PUBLISHED,
            ['article' => $article]
        );
    }
}
```

### Escuchando eventos del módulo

```php
// En el Preload.php de otro módulo

public function eventMymoduleArticlePublished(array $args): void
{
    $article = $args['article'];

    // Índice para búsqueda
    $this->searchIndexer->index($article);

    // Actualizar mapa del sitio
    $this->sitemapGenerator->addUrl($article->url());
}
```

## Mejores prácticas

1. **Usar nombres específicos** - Formato `módulo.entidad.acción`
2. **Pasar datos mínimos** - Solo lo que necesitan los escuchadores
3. **Documentar eventos** - Listar eventos en los documentos del módulo
4. **Evitar efectos secundarios** - Mantener los escuchadores enfocados
5. **Manejar errores** - No permitir que los errores de los escuchadores rompan el flujo

## Documentación relacionada

- Sistema de eventos - Documentación detallada de eventos
- ../03-Module-Development/Module-Development - Desarrollo de módulos
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - Eventos PSR-14
