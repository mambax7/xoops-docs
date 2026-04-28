---
title: "Fundamentos do Smarty"
description: "Fundamentos da criação de templates Smarty no XOOPS"
---

<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>

:::note[Versão Smarty por Release XOOPS]
| Versão XOOPS | Versão Smarty | Diferenças Principais |
|---------------|----------------|-----------------|
| 2.5.11 | Smarty 3.x | Blocos `{php}` permitidos (mas desencorajados) |
| 2.7.0+ | Smarty 3.x/4.x | Preparando compatibilidade com Smarty 4 |
| 4.0 | Smarty 4.x | Blocos `{php}` removidos, sintaxe mais rigorosa |

Veja Smarty-4-Migration para orientação de migração.
:::

Smarty é um mecanismo de template para PHP que permite aos desenvolvedores separar apresentação (HTML/CSS) da lógica da aplicação. XOOPS usa Smarty para todas as suas necessidades de template, permitindo separação clara entre código PHP e saída HTML.

## Documentação Relacionada

- Theme-Development - Criando temas XOOPS
- Template-Variables - Variáveis disponíveis em templates
- Smarty-4-Migration - Atualizando de Smarty 3 para 4

## O que é Smarty?

Smarty oferece:

- **Separação de Responsabilidades**: Manter HTML em templates, lógica PHP em classes
- **Herança de Template**: Construir layouts complexos a partir de blocos simples
- **Cache**: Melhorar performance com templates compilados
- **Modificadores**: Transformar saída com funções integradas ou personalizadas
- **Segurança**: Controlar quais funções PHP os templates podem acessar

## Configuração de Smarty do XOOPS

XOOPS configura Smarty com delimitadores personalizados:

```
Smarty Padrão: { e }
Smarty XOOPS:  <{ e }>
```

Isto previne conflitos com código JavaScript em templates.

## Sintaxe Básica

### Variáveis

Variáveis são passadas de PHP para templates:

```php
// Em PHP
$GLOBALS['xoopsTpl']->assign('title', 'My Page Title');
$GLOBALS['xoopsTpl']->assign('count', 42);
```

```smarty
{* Em template *}
<h1><{$title}></h1>
<p>Total items: <{$count}></p>
```

### Acesso a Array

```php
// PHP
$item = [
    'id' => 1,
    'title' => 'Article Title',
    'author' => 'John Doe'
];
$GLOBALS['xoopsTpl']->assign('item', $item);
```

```smarty
{* Template *}
<h2><{$item.title}></h2>
<p>By: <{$item.author}></p>
```

### Propriedades de Objeto

```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* Template *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```

## Comentários

Comentários em Smarty não são renderizados para HTML:

```smarty
{* Este é um comentário - não aparecerá na saída HTML *}

{*
   Comentários multilinhas
   também são suportados
*}
```

## Estruturas de Controle

### Instruções If/Else

```smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```

### Operadores de Comparação

```smarty
{* Igualdade *}
<{if $status == 'published'}>Published<{/if}>
<{if $status eq 'published'}>Published<{/if}>

{* Desigualdade *}
<{if $count != 0}>Has items<{/if}>
<{if $count neq 0}>Has items<{/if}>

{* Maior/Menor que *}
<{if $count > 10}>Many items<{/if}>
<{if $count gt 10}>Many items<{/if}>
<{if $count < 5}>Few items<{/if}>
<{if $count lt 5}>Few items<{/if}>

{* Maior/Menor que ou igual *}
<{if $count >= 10}>Ten or more<{/if}>
<{if $count gte 10}>Ten or more<{/if}>
<{if $count <= 5}>Five or less<{/if}>
<{if $count lte 5}>Five or less<{/if}>

{* Operadores lógicos *}
<{if $logged_in && $is_admin}>Admin Panel<{/if}>
<{if $logged_in and $is_admin}>Admin Panel<{/if}>
<{if $option1 || $option2}>One option selected<{/if}>
<{if $option1 or $option2}>One option selected<{/if}>
<{if !$is_banned}>Access granted<{/if}>
<{if not $is_banned}>Access granted<{/if}>
```

### Verificando Vazio/Isset

```smarty
{* Verificar se a variável existe e tem valor *}
<{if $title}>
    <h1><{$title}></h1>
<{/if}>

{* Verificar se array não está vazio *}
<{if $items|@count > 0}>
    <ul>
        <{foreach $items as $item}>
            <li><{$item.name}></li>
        <{/foreach}>
    </ul>
<{/if}>

{* Usando isset *}
<{if isset($description)}>
    <p><{$description}></p>
<{/if}>
```

### Loops Foreach

```smarty
{* Foreach básico *}
<ul>
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{/foreach}>
</ul>

{* Com chave *}
<{foreach $options as $key => $value}>
    <option value="<{$key}>"><{$value}></option>
<{/foreach}>

{* Com @index, @first, @last *}
<{foreach $items as $item}>
    <{if $item@first}><ul><{/if}>
    <li class="item-<{$item@index}>"><{$item.name}></li>
    <{if $item@last}></ul><{/if}>
<{/foreach}>

{* Cores de linha alternadas *}
<{foreach $rows as $row}>
    <tr class="<{if $row@iteration is odd}>odd<{else}>even<{/if}>">
        <td><{$row.name}></td>
    </tr>
<{/foreach}>

{* Foreachelse para arrays vazios *}
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{foreachelse}>
    <li>No items found.</li>
<{/foreach}>
```

### Loops For

```smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```

### Loops While

```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```

## Modificadores de Variável

Modificadores transformam saída de variável:

### Modificadores de String

```smarty
{* Escape HTML (sempre usar para entrada do usuário!) *}
<{$title|escape}>
<{$title|escape:'html'}>

{* Codificação de URL *}
<{$url|escape:'url'}>

{* Maiúscula/Minúscula *}
<{$name|upper}>
<{$name|lower}>
<{$name|capitalize}>

{* Truncar texto *}
<{$content|truncate:100:'...'}>

{* Remover tags HTML *}
<{$html|strip_tags}>

{* Substituir *}
<{$text|replace:'old':'new'}>

{* Word wrap *}
<{$text|wordwrap:80:"\n"}>

{* Valor padrão *}
<{$optional_var|default:'No value'}>
```

### Modificadores Numéricos

```smarty
{* Formatação de número *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* Formatação de data *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```

### Modificadores de Array

```smarty
{* Contar items *}
<{$items|@count}> items

{* Unir array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### Encadeamento de Modificadores

```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```

## Include e Insert

### Incluindo Outros Templates

```smarty
{* Incluir um arquivo de template *}
<{include file="db:mymodule_header.tpl"}>

{* Incluir com variáveis *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* Incluir com variáveis atribuídas *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```

### Inserindo Conteúdo Dinâmico

```smarty
{* Insert chama uma função PHP para conteúdo dinâmico *}
<{insert name="getBanner"}>
```

## Atribuir Variáveis em Templates

```smarty
{* Atribuição simples *}
<{assign var="page_title" value="Welcome"}>
<{$page_title = "Welcome"}>

{* Atribuição de expressão *}
<{assign var="full_name" value="`$first_name` `$last_name`"}>

{* Capturar conteúdo de bloco *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
    <ul>
        <li>Link 1</li>
        <li>Link 2</li>
    </ul>
<{/capture}>
<div class="sidebar"><{$smarty.capture.sidebar}></div>
```

## Variáveis Smarty Integradas

### Variável $smarty

```smarty
{* Timestamp atual *}
<{$smarty.now|date_format:"%Y-%m-%d"}>

{* Variáveis de requisição *}
<{$smarty.get.page}>
<{$smarty.post.username}>
<{$smarty.request.id}>
<{$smarty.cookies.session_id}>
<{$smarty.server.HTTP_HOST}>

{* Constantes *}
<{$smarty.const.XOOPS_URL}>

{* Variáveis de configuração *}
<{$smarty.config.var_name}>

{* Informações de template *}
<{$smarty.template}>
<{$smarty.current_dir}>

{* Versão Smarty *}
<{$smarty.version}>

{* Propriedades de Section/Foreach *}
<{$smarty.foreach.items.index}>
<{$smarty.foreach.items.iteration}>
<{$smarty.foreach.items.first}>
<{$smarty.foreach.items.last}>
```

## Blocos Literal

Para JavaScript com chaves:

```smarty
<{literal}>
<script>
    var config = {
        url: 'https://example.com',
        count: 10
    };
    if (config.count > 5) {
        console.log('Many items');
    }
</script>
<{/literal}>
```

Ou use variáveis Smarty dentro de JavaScript:

```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```

## Funções Personalizadas

XOOPS fornece funções Smarty personalizadas:

```smarty
{* URL de Imagem XOOPS *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* URL de Módulo XOOPS *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* URL de Aplicação *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```

## Boas Práticas

### Sempre Escapar Saída

```smarty
{* Para conteúdo gerado pelo usuário, sempre escapar *}
<p><{$user_comment|escape}></p>

{* Para conteúdo HTML, usar método apropriado *}
<div><{$content}></div> {* Apenas se conteúdo foi pré-sanitizado *}
```

### Usar Nomes de Variável Significativos

```php
// Bom
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// Evitar
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```

### Manter Lógica Minimal

Templates devem focar em apresentação. Mover lógica complexa para PHP:

```smarty
{* Evitar lógica complexa em templates *}
{* Ruim *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* Bom - calcular em PHP e passar uma flag simples *}
<{if $can_edit}>
```

### Usar Herança de Template

Para layouts consistentes, usar herança de template (veja Theme-Development).

## Depurando Templates

### Console de Debug

```smarty
{* Mostrar todas as variáveis atribuídas *}
<{debug}>
```

### Saída Temporária

```smarty
{* Depurar variável específica *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```

## Padrões de Template Comuns do XOOPS

### Estrutura de Template do Módulo

```smarty
{* Cabeçalho do módulo *}
<div class="mymodule">
    <h2><{$module_name}></h2>

    {* Breadcrumb *}
    <{if $breadcrumb}>
    <nav class="breadcrumb">
        <{foreach $breadcrumb as $crumb}>
            <{if $crumb@last}>
                <span><{$crumb.title}></span>
            <{else}>
                <a href="<{$crumb.link}>"><{$crumb.title}></a> &raquo;
            <{/if}>
        <{/foreach}>
    </nav>
    <{/if}>

    {* Conteúdo *}
    <div class="content">
        <{$content}>
    </div>
</div>
```

### Paginação

```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

### Exibição de Formulário

```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```

---

#smarty #templates #xoops #frontend #template-engine
