---
title: "Šablona Smarty Reference API"
description: "Kompletní reference API pro šablonu Smarty v XOOPS"
---

> Kompletní dokumentace API pro šablonu Smarty v XOOPS.

---

## Architektura šablonového motoru

```mermaid
graph TB
    subgraph "Template Processing"
        A[Controller] --> B[Assign Variables]
        B --> C[XOOPSTpl]
        C --> D[Smarty Engine]
        D --> E{Template Cached?}
        E -->|Yes| F[Load from Cache]
        E -->|No| G[Compile Template]
        G --> H[Execute PHP]
        F --> H
        H --> I[HTML Output]
    end

    subgraph "Template Sources"
        J[File System] --> D
        K[Database] --> D
        L[String] --> D
    end

    subgraph "Plugin Types"
        M[Functions] --> D
        N[Modifiers] --> D
        O[Block Functions] --> D
        P[Compiler Functions] --> D
    end
```

---

## Třída XOOPSTpl

### Inicializace

```php
// Global template object
global $xoopsTpl;

// Or get new instance
$tpl = new XOOPSTpl();

// Available in modules
$GLOBALS['xoopsTpl']->assign('myvar', $value);
```

### Základní metody

| Metoda | Parametry | Popis |
|--------|------------|-------------|
| `assign` | `string $name, mixed $value` | Přiřadit proměnnou k šabloně |
| `assignByRef` | `string $name, mixed &$value` | Přiřadit odkazem |
| `append` | `string $name, mixed $value, bool $merge = false` | Připojit k proměnné pole |
| `display` | `string $template` | Šablona vykreslení a výstupu |
| `fetch` | `string $template` | Šablona vykreslení a vrácení |
| `clearAssign` | `string $name` | Vymazat přiřazenou proměnnou |
| `clearAllAssign` | - | Vymazat všechny proměnné |
| `getTemplateVars` | `string $name = null` | Získejte přiřazené proměnné |
| `templateExists` | `string $template` | Zkontrolujte, zda šablona existuje |
| `isCached` | `string $template` | Zkontrolujte, zda je šablona uložena v mezipaměti |
| `clearCache` | `string $template = null` | Vymazat mezipaměť šablon |

### Variabilní přiřazení

```php
// Simple assignment
$xoopsTpl->assign('title', 'My Page Title');
$xoopsTpl->assign('count', 42);
$xoopsTpl->assign('is_admin', true);

// Array assignment
$xoopsTpl->assign('items', [
    ['id' => 1, 'name' => 'Item 1'],
    ['id' => 2, 'name' => 'Item 2'],
]);

// Object assignment
$xoopsTpl->assign('user', $xoopsUser);

// Multiple assignments
$xoopsTpl->assign([
    'title' => 'My Title',
    'content' => 'My Content',
    'author' => 'John Doe'
]);

// Append to array
$xoopsTpl->append('items', ['id' => 3, 'name' => 'Item 3']);
```

### Načítání šablony

```php
// From database (compiled)
$xoopsTpl->display('db:mymodule_index.tpl');

// From file system
$xoopsTpl->display('file:' . XOOPS_ROOT_PATH . '/modules/mymodule/templates/custom.tpl');

// Fetch without output
$html = $xoopsTpl->fetch('db:mymodule_item.tpl');

// From string
$template = '<h1>{$title}</h1><p>{$content}</p>';
$html = $xoopsTpl->fetch('string:' . $template);
```

---

## Smarty Reference syntaxe

### Proměnné

```smarty
{* Simple variable *}
<{$title}>

{* Array access *}
<{$item.name}>
<{$item['name']}>

{* Object property *}
<{$user->name}>
<{$user->getVar('uname')}>

{* Config variable *}
<{$xoops_sitename}>

{* Constant *}
<{$smarty.const._MD_MYMODULE_TITLE}>

{* Server variables *}
<{$smarty.server.REQUEST_URI}>
<{$smarty.get.id}>
<{$smarty.post.name}>
```

### Modifikátory

```smarty
{* String modifiers *}
<{$title|upper}>
<{$title|lower}>
<{$title|capitalize}>
<{$title|truncate:50:"..."}>
<{$content|strip_tags}>
<{$content|nl2br}>
<{$text|escape:'html'}>
<{$text|escape:'url'}>

{* Date formatting *}
<{$timestamp|date_format:"%Y-%m-%d"}>
<{$timestamp|date_format:"%B %e, %Y"}>

{* Number formatting *}
<{$price|number_format:2:".":","}>

{* Default value *}
<{$optional|default:"N/A"}>

{* Chained modifiers *}
<{$title|strip_tags|truncate:50|escape}>

{* Count array *}
<{$items|@count}>
```

### Řídicí struktury

```smarty
{* If/else *}
<{if $is_admin}>
    <p>Admin content</p>
<{elseif $is_moderator}>
    <p>Moderator content</p>
<{else}>
    <p>User content</p>
<{/if}>

{* Foreach loop *}
<{foreach from=$items item=item key=key}>
    <li><{$key}>: <{$item.name}></li>
<{/foreach}>

{* Foreach with properties *}
<{foreach from=$items item=item name=itemLoop}>
    <{if $smarty.foreach.itemLoop.first}>
        <ul>
    <{/if}>

    <li class="<{if $smarty.foreach.itemLoop.iteration is odd}>odd<{else}>even<{/if}>">
        <{$smarty.foreach.itemLoop.iteration}>. <{$item.name}>
    </li>

    <{if $smarty.foreach.itemLoop.last}>
        </ul>
        <p>Total: <{$smarty.foreach.itemLoop.total}></p>
    <{/if}>
<{/foreach}>

{* For loop *}
<{for $i=1 to 10}>
    <{$i}>
<{/for}>

{* While loop *}
<{while $count < 10}>
    <{$count}>
    <{$count = $count + 1}>
<{/while}>
```

### Zahrnuje

```smarty
{* Include another template *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem showAuthor=true}>

{* Include from theme *}
<{include file="$theme_template_set/header.tpl"}>
```

### Komentáře

```smarty
{* This is a Smarty comment - not rendered in output *}

{*
    Multi-line comment
    explaining the template
*}
```

---

## Funkce specifické pro XOOPS

### Blokové vykreslování

```smarty
{* Render block by ID *}
<{xoBlock id=5}>

{* Render block by name *}
<{xoBlock name="mymodule_recent"}>

{* Render all blocks in position *}
<{foreach item=block from=$xoBlocks.canvas_left}>
    <div class="block">
        <h3><{$block.title}></h3>
        <{$block.content}>
    </div>
<{/foreach}>
```

### Manipulace s obrázky a aktivy

```smarty
{* Module image *}
<img src="<{$xoops_url}>/modules/<{$xoops_dirname}>/assets/images/logo.png">

{* Theme image *}
<img src="<{$xoops_imageurl}>icon.png">

{* Upload directory *}
<img src="<{$xoops_upload_url}>/<{$item.image}>">
```

### Generace URL

```smarty
{* Module URL *}
<a href="<{$xoops_url}>/modules/<{$xoops_dirname}>/item.php?id=<{$item.id}>">
    <{$item.title}>
</a>

{* With SEO-friendly URL (if enabled) *}
<a href="<{$item.url}>"><{$item.title}></a>
```

---

## Tok kompilace šablony

```mermaid
sequenceDiagram
    participant Request
    participant XOOPSTpl
    participant Smarty
    participant Cache
    participant FileSystem

    Request->>XOOPSTpl: display('db:template.tpl')
    XOOPSTpl->>Smarty: Process template

    Smarty->>Cache: Check compiled cache

    alt Cache Hit
        Cache-->>Smarty: Return compiled PHP
    else Cache Miss
        Smarty->>FileSystem: Load template source
        FileSystem-->>Smarty: Template content
        Smarty->>Smarty: Compile to PHP
        Smarty->>Cache: Store compiled PHP
    end

    Smarty->>Smarty: Execute compiled PHP
    Smarty-->>XOOPSTpl: HTML output
    XOOPSTpl-->>Request: Rendered HTML
```

---

## Vlastní pluginy Smarty

### Funkční plugin

```php
// plugins/function.myfunction.php
function smarty_function_myfunction($params, $smarty)
{
    $name = $params['name'] ?? 'World';
    return "Hello, {$name}!";
}

// Usage in template:
// <{myfunction name="John"}>
```

### Modifikační plugin

```php
// plugins/modifier.timeago.php
function smarty_modifier_timeago($timestamp)
{
    $diff = time() - $timestamp;

    if ($diff < 60) {
        return 'just now';
    } elseif ($diff < 3600) {
        $mins = floor($diff / 60);
        return "{$mins} minute(s) ago";
    } elseif ($diff < 86400) {
        $hours = floor($diff / 3600);
        return "{$hours} hour(s) ago";
    } else {
        $days = floor($diff / 86400);
        return "{$days} day(s) ago";
    }
}

// Usage in template:
// <{$item.created|timeago}>
```

### Blokovat plugin

```php
// plugins/block.cache.php
function smarty_block_cache($params, $content, $smarty, &$repeat)
{
    if ($repeat) {
        // Opening tag
        return '';
    } else {
        // Closing tag - process content
        $ttl = $params['ttl'] ?? 3600;
        $key = md5($content);

        // Check cache...
        return $content;
    }
}

// Usage in template:
// <{cache ttl=3600}>
//     Expensive content here
// <{/cache}>
```

---

## Tipy pro výkon

```mermaid
graph LR
    subgraph "Optimization Strategies"
        A[Enable Caching] --> E[Faster Response]
        B[Minimize Variables] --> E
        C[Avoid Complex Logic] --> E
        D[Pre-compute in PHP] --> E
    end
```

### Nejlepší postupy

1. **Povolte ukládání do mezipaměti šablon** v produkci
2. **Přiřaďte pouze potřebné proměnné** – nepředávejte celé objekty
3. **Používejte modifikátory střídmě** – pokud je to možné, předformátujte v PHP
4. **Vyvarujte se vnořených smyček** – restrukturalizace dat v PHP
5. **Ukládání drahých bloků do mezipaměti** – pro složité dotazy používejte ukládání do mezipaměti bloků

---

## Související dokumentace

- Základy Smarty
- Vývoj tématu
- Migrace Smarty 4

---

#xoops #api #chytré #šablony #odkaz