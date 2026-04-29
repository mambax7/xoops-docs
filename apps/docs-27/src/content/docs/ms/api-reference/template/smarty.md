---
title: "Rujukan API Templat Smarty"
description: "Rujukan API lengkap untuk templat Smarty dalam XOOPS"
---
> Dokumentasi API lengkap untuk templat Smarty dalam XOOPS.---

## Seni Bina Enjin Templat
```
mermaid
graph TB
    subgraph "Template Processing"
        A[Controller] --> B[Assign Variables]
        B --> C[XoopsTpl]
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

## Kelas XoopsTpl### Permulaan
```
php
// Global template object
global $xoopsTpl;

// Or get new instance
$tpl = new XoopsTpl();

// Available in modules
$GLOBALS['xoopsTpl']->assign('myvar', $value);
```
### Kaedah Teras| Kaedah | Parameter | Penerangan |
|--------|------------|-------------|
| `assign` | `string $name, mixed $value` | Berikan pembolehubah kepada templat |
| `assignByRef` | `string $name, mixed &$value` | Tugaskan melalui rujukan |
| `append` | `string $name, mixed $value, bool $merge = false` | Tambahkan pada pembolehubah tatasusunan |
| `display` | `string $template` | Templat render dan output |
| `fetch` | `string $template` | Render dan kembalikan templat |
| `clearAssign` | `string $name` | Kosongkan pembolehubah yang ditetapkan |
| `clearAllAssign` | - | Kosongkan semua pembolehubah |
| `getTemplateVars` | `string $name = null` | Dapatkan pembolehubah yang ditetapkan |
| `templateExists` | `string $template` | Semak sama ada templat wujud |
| `isCached` | `string $template` | Semak sama ada templat dicache |
| `clearCache` | `string $template = null` | Kosongkan cache templat |### Pembolehubah Tugasan
```
php
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
### Pemuatan Templat
```
php
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

## Rujukan Sintaks Smarty### Pembolehubah
```
Smarty
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
<{$Smarty.const._MD_MYMODULE_TITLE}>

{* Server variables *}
<{$Smarty.server.REQUEST_URI}>
<{$Smarty.get.id}>
<{$Smarty.post.name}>
```
### Pengubah suai
```
Smarty
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
### Struktur Kawalan
```
Smarty
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
    <{if $Smarty.foreach.itemLoop.first}>
        <ul>
    <{/if}>

    <li class="<{if $Smarty.foreach.itemLoop.iteration is odd}>odd<{else}>even<{/if}>">
        <{$Smarty.foreach.itemLoop.iteration}>. <{$item.name}>
    </li>

    <{if $Smarty.foreach.itemLoop.last}>
        </ul>
        <p>Total: <{$Smarty.foreach.itemLoop.total}></p>
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
### Termasuk
```
Smarty
{* Include another template *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem showAuthor=true}>

{* Include from theme *}
<{include file="$theme_template_set/header.tpl"}>
```
### Komen
```
Smarty
{* This is a Smarty comment - not rendered in output *}

{*
    Multi-line comment
    explaining the template
*}
```
---

## Fungsi Khusus XOOPS### Perenderan Blok
```
Smarty
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
### Pengendalian Imej dan Aset
```
Smarty
{* Module image *}
<img src="<{$xoops_url}>/modules/<{$xoops_dirname}>/assets/images/logo.png">

{* Theme image *}
<img src="<{$xoops_imageurl}>icon.png">

{* Upload directory *}
<img src="<{$xoops_upload_url}>/<{$item.image}>">
```
### Penjanaan URL
```
Smarty
{* Module URL *}
<a href="<{$xoops_url}>/modules/<{$xoops_dirname}>/item.php?id=<{$item.id}>">
    <{$item.title}>
</a>

{* With SEO-friendly URL (if enabled) *}
<a href="<{$item.url}>"><{$item.title}></a>
```
---

## Aliran Penyusunan Templat
```
mermaid
sequenceDiagram
    participant Request
    participant XoopsTpl
    participant Smarty
    participant Cache
    participant FileSystem

    Request->>XoopsTpl: display('db:template.tpl')
    XoopsTpl->>Smarty: Process template

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
    Smarty-->>XoopsTpl: HTML output
    XoopsTpl-->>Request: Rendered HTML
```
---

## Pemalam Smarty Tersuai### Fungsi Plugin
```
php
// plugins/function.myfunction.php
function smarty_function_myfunction($params, $Smarty)
{
    $name = $params['name'] ?? 'World';
    return "Hello, {$name}!";
}

// Usage in template:
// <{myfunction name="John"}>
```
### Pemalam Pengubah Suai
```
php
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
### Sekat Plugin
```
php
// plugins/block.cache.php
function smarty_block_cache($params, $content, $Smarty, &$repeat)
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

## Petua Prestasi
```
mermaid
graph LR
    subgraph "Optimization Strategies"
        A[Enable Caching] --> E[Faster Response]
        B[Minimize Variables] --> E
        C[Avoid Complex Logic] --> E
        D[Pre-compute in PHP] --> E
    end
```
### Amalan Terbaik1. **Dayakan cache templat** dalam pengeluaran
2. **Tetapkan pembolehubah yang diperlukan sahaja** - jangan hantar keseluruhan objek
3. **Gunakan pengubah suai dengan berhati-hati** - pra-format dalam PHP apabila boleh
4. **Elakkan gelung bersarang** - menyusun semula data dalam PHP
5. **Cache blok mahal** - gunakan blok cache untuk pertanyaan kompleks---

## Dokumentasi Berkaitan- Asas Smarty
- Pembangunan Tema
- Migrasi Smarty 4---

#XOOPS #api #Smarty #templates #reference