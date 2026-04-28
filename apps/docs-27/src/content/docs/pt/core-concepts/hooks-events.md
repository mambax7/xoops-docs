---
title: "Ganchos e Eventos"
---

## Visão Geral

XOOPS fornece ganchos e eventos como pontos de extensão que permitem que módulos interajam com a funcionalidade principal e um com o outro sem dependências diretas.

## Ganchos vs Eventos

| Aspecto | Ganchos | Eventos |
|--------|-------|---------|
| Propósito | Modificar comportamento/dados | Reagir a ocorrências |
| Retorno | Pode retornar dados modificados | Tipicamente vazio |
| Timing | Antes/durante ação | Depois da ação |
| Padrão | Cadeia de filtros | Observer/pub-sub |

## Sistema de Ganchos

### Registrando Ganchos

```php
// Registrar um gancho em xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### Callback de Gancho

```php
// include/hooks.php

function mymodule_hook_user_profile(array $data): array
{
    $userId = $data['user_id'];

    // Adicionar campos de perfil personalizados
    $data['fields']['reputation'] = mymodule_get_user_reputation($userId);
    $data['fields']['badges'] = mymodule_get_user_badges($userId);

    return $data;
}
```

### Ganchos Principais Disponíveis

| Nome do Gancho | Dados | Descrição |
|-----------|------|-------------|
| `user.profile.display` | Array de dados do usuário | Modificar exibição de perfil |
| `content.render` | HTML de conteúdo | Filtrar saída de conteúdo |
| `form.submit` | Dados de formulário | Validar/modificar dados de formulário |
| `search.results` | Array de resultados | Filtrar resultados de busca |
| `menu.main` | Itens de menu | Modificar menu principal |

## Sistema de Eventos

### Disparando Eventos

```php
// No código do seu módulo
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### Ouvindo Eventos

```php
// class/Preload.php

class MyModulePreload extends \Xmf\Module\Helper\AbstractHelper
{
    public function eventMymoduleArticleCreated(array $args): void
    {
        $articleId = $args['article_id'];

        // Notificar inscritos
        $this->notifyNewArticle($articleId);
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];

        // Atualizar último login para módulo
        $this->updateUserActivity($userId);
    }
}
```

## Referência de Eventos de Preload

### Eventos do Core

```php
// Cabeçalho/Rodapé
public function eventCoreHeaderStart(array $args): void {}
public function eventCoreHeaderEnd(array $args): void {}
public function eventCoreFooterStart(array $args): void {}
public function eventCoreFooterEnd(array $args): void {}

// Inclusões
public function eventCoreIncludeCommonStart(array $args): void {}
public function eventCoreIncludeCommonEnd(array $args): void {}

// Exceções
public function eventCoreException(array $args): void {}
```

### Eventos de Usuário

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### Eventos de Módulo

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Eventos de Módulo Personalizado

### Definindo Eventos

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

### Disparando Eventos

```php
class ArticleService
{
    public function publish(Article $article): void
    {
        $article->publish();
        $this->repository->save($article);

        // Disparar evento
        $GLOBALS['xoopsPreload']->triggerEvent(
            ArticleEvents::PUBLISHED,
            ['article' => $article]
        );
    }
}
```

### Ouvindo Eventos de Módulo

```php
// No arquivo Preload.php de outro módulo

public function eventMymoduleArticlePublished(array $args): void
{
    $article = $args['article'];

    // Indexar para busca
    $this->searchIndexer->index($article);

    // Atualizar sitemap
    $this->sitemapGenerator->addUrl($article->url());
}
```

## Boas Práticas

1. **Use Nomes Específicos** - Formato `modulo.entidade.ação`
2. **Passar Dados Mínimos** - Apenas o que ouvintes precisam
3. **Documentar Eventos** - Listar eventos na documentação do módulo
4. **Evitar Efeitos Colaterais** - Manter ouvintes focados
5. **Lidar com Erros** - Não deixar erros de ouvinte quebrar fluxo

## Documentação Relacionada

- Event-System - Documentação detalhada de evento
- ../03-Module-Development/Module-Development - Desenvolvimento de módulo
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - Eventos PSR-14
