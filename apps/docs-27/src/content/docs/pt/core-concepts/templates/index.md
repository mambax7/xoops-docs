---
title: "Sistemas de Template Smarty no XOOPS"
---

## Visão Geral

XOOPS usa o mecanismo de template Smarty para separar apresentação da lógica. Este guia cobre sintaxe Smarty, recursos específicos do XOOPS e boas práticas de template.

## Sintaxe Básica

### Variáveis

```smarty
{* Variáveis escalares *}
<{$variable}>
<{$article.title}>
<{$user->getUsername()}>

{* Acesso a array *}
<{$items[0]}>
<{$config['setting']}>

{* Valores padrão *}
<{$title|default:'Untitled'}>
```

### Modificadores

```smarty
{* Transformações de texto *}
<{$text|upper}>
<{$text|lower}>
<{$text|capitalize}>
<{$text|truncate:100:'...'}>

{* Manipulação HTML *}
<{$content|strip_tags}>
<{$html|escape:'html'}>
<{$url|escape:'url'}>

{* Formatação de data *}
<{$timestamp|date_format:'%Y-%m-%d'}>
<{$date|date_format:$xoops_config.dateformat}>

{* Encadeamento de modificadores *}
<{$text|strip_tags|truncate:50|escape}>
```

### Condicionais

```smarty
{* If/else *}
<{if $logged_in}>
    Welcome, <{$username}>!
<{elseif $is_guest}>
    Please log in.
<{else}>
    Unknown state.
<{/if}>

{* Comparações *}
<{if $count > 0}>
<{if $status == 'published'}>
<{if $items|@count >= 5}>

{* Operadores lógicos *}
<{if $is_admin && $can_edit}>
<{if $type == 'news' || $type == 'article'}>
<{if !$is_hidden}>
```

### Loops

```smarty
{* Foreach com items *}
<{foreach item=article from=$articles}>
    <h2><{$article.title}></h2>
<{/foreach}>

{* Com chave *}
<{foreach key=id item=value from=$items}>
    <{$id}>: <{$value}>
<{/foreach}>

{* Com informações de iteração *}
<{foreach item=item from=$items name=itemloop}>
    <{$smarty.foreach.itemloop.index}>
    <{$smarty.foreach.itemloop.iteration}>
    <{$smarty.foreach.itemloop.first}>
    <{$smarty.foreach.itemloop.last}>
<{/foreach}>

{* Foreachelse para arrays vazios *}
<{foreach item=item from=$items}>
    <{$item.name}>
<{foreachelse}>
    No items found.
<{/foreach}>
```

### Sections (Legado)

```smarty
<{section name=i loop=$items}>
    <{$items[i].title}>
<{/section}>
```

## Recursos Específicos do XOOPS

### Variáveis Globais

```smarty
{* Informações do site *}
<{$xoops_sitename}>
<{$xoops_url}>
<{$xoops_rootpath}>
<{$xoops_theme}>

{* Informações do usuário *}
<{$xoops_isuser}>
<{$xoops_isadmin}>
<{$xoops_userid}>
<{$xoops_uname}>

{* Informações do módulo *}
<{$xoops_dirname}>
<{$xoops_pagetitle}>

{* Meta *}
<{$xoops_meta_keywords}>
<{$xoops_meta_description}>
```

### Incluindo Arquivos

```smarty
{* Incluir do tema *}
<{include file="theme:header.html"}>

{* Incluir do módulo *}
<{include file="db:modulename_partial.tpl"}>

{* Incluir com variáveis *}
<{include file="db:mymodule_item.tpl" item=$article}>

{* Incluir do sistema de arquivos *}
<{include file="$xoops_rootpath/modules/mymodule/templates/partial.tpl"}>
```

### Exibição de Blocos

```smarty
{* No theme.html *}
<{foreach item=block from=$xoops_lblocks}>
    <div class="block">
        <{if $block.title}>
            <h3><{$block.title}></h3>
        <{/if}>
        <{$block.content}>
    </div>
<{/foreach}>
```

### Integração de Formulário

```smarty
{* Renderização de XoopsForm *}
<{$form.javascript}>
<form action="<{$form.action}>" method="<{$form.method}>">
    <{foreach item=element from=$form.elements}>
        <div class="form-group">
            <label><{$element.caption}></label>
            <{$element.body}>
            <{if $element.description}>
                <small><{$element.description}></small>
            <{/if}>
        </div>
    <{/foreach}>
</form>
```

## Funções Personalizadas

### Registradas pelo XOOPS

```smarty
{* XoopsFormLoader *}
<{xoFormLoader form=$form}>

{* Breadcrumb *}
<{xoBreadcrumb}>

{* Menu do módulo *}
<{xoModuleMenu}>
```

### Plugins Personalizados

```php
// include/smarty_plugins/function.myfunction.php
function smarty_function_myfunction($params, $smarty)
{
    $name = $params['name'] ?? 'World';
    return "Hello, {$name}!";
}
```

```smarty
<{myfunction name="XOOPS"}>
```

## Organização de Template

### Estrutura Recomendada

```
templates/
├── admin/
│   ├── index.tpl
│   ├── item_list.tpl
│   └── item_form.tpl
├── blocks/
│   ├── recent.tpl
│   └── popular.tpl
├── frontend/
│   ├── index.tpl
│   ├── item_view.tpl
│   └── item_list.tpl
└── partials/
    ├── _header.tpl
    ├── _footer.tpl
    └── _pagination.tpl
```

### Partial Templates

```smarty
{* partials/_pagination.tpl *}
<nav class="pagination">
    <{if $page > 1}>
        <a href="<{$base_url}>&page=<{$page-1}>">Previous</a>
    <{/if}>

    <span>Page <{$page}> of <{$total_pages}></span>

    <{if $page < $total_pages}>
        <a href="<{$base_url}>&page=<{$page+1}>">Next</a>
    <{/if}>
</nav>

{* Uso *}
<{include file="db:mymodule_pagination.tpl" page=$current_page total_pages=$pages base_url=$url}>
```

## Performance

### Cache

```php
// Em PHP
$xoopsTpl->caching = 1;
$xoopsTpl->cache_lifetime = 3600; // 1 hora

// Verificar se está em cache
if (!$xoopsTpl->is_cached('mymodule_index.tpl')) {
    // Buscar dados apenas se não estiver em cache
    $items = $handler->getObjects();
    $xoopsTpl->assign('items', $items);
}
```

### Limpar Cache

```php
// Limpar template específico
$xoopsTpl->clear_cache('mymodule_index.tpl');

// Limpar todos os templates do módulo
$xoopsTpl->clear_all_cache();
```

## Boas Práticas

1. **Escapar Saída** - Sempre escapar conteúdo gerado pelo usuário
2. **Usar Modificadores** - Aplicar transformações apropriadas
3. **Manter Lógica Minimal** - Lógica complexa pertence ao PHP
4. **Usar Partials** - Reutilizar fragmentos de template comuns
5. **HTML Semântico** - Usar elementos HTML5 apropriados
6. **Acessibilidade** - Incluir atributos ARIA quando necessário

## Documentação Relacionada

- Theme-Development - Criação de tema
- ../../04-API-Reference/Template/Template-System - API de template XOOPS
- ../../03-Module-Development/Block-Development - Templates de bloco
- ../Forms/Form-Elements - Renderização de formulário
