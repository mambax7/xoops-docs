---
title：“Smarty模板API参考”
description：“完成XOOPS中Smarty模板的API参考”
---

> 完成 XOOPS 中 Smarty 模板的 API 文档。

---

## 模板引擎架构

```mermaid
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

## XOOPSTpl 类

### 初始化

```php
// Global template object
global $xoopsTpl;

// Or get new instance
$tpl = new XoopsTpl();

// Available in modules
$GLOBALS['xoopsTpl']->assign('myvar', $value);
```

### 核心方法

|方法|参数|描述 |
|--------|------------|-------------|
| `assign` | `string $name, mixed $value` |将变量分配给模板 |
| `assignByRef` | `string $name, mixed &$value` |通过引用分配 |
| `append` | `string $name, mixed $value, bool $merge = false` |追加到数组变量 |
| `display` | `string $template` |渲染和输出模板 |
| `fetch` | `string $template` |渲染并返回模板|
| `clearAssign`| `string $name` |清除分配的变量 |
| `clearAllAssign` | - |清除所有变量 |
| `getTemplateVars` | `string $name = null` |获取分配的变量 |
| `templateExists` | `string $template` |检查模板是否存在 |
| `isCached` | `string $template` |检查模板是否被缓存 |
| `clearCache` | `string $template = null` |清除模板缓存 |

### 变量赋值

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

### 模板加载

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

## Smarty 语法参考

### 变量

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

### 修饰符

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

### 控制结构

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

### 包括

```smarty
{* Include another template *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem showAuthor=true}>

{* Include from theme *}
<{include file="$theme_template_set/header.tpl"}>
```

### 评论

```smarty
{* This is a Smarty comment - not rendered in output *}

{*
    Multi-line comment
    explaining the template
*}
```

---

## XOOPS-Specific 函数

### 区块渲染

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

### 图像和资产处理

```smarty
{* Module image *}
<img src="<{$xoops_url}>/modules/<{$xoops_dirname}>/assets/images/logo.png">

{* Theme image *}
<img src="<{$xoops_imageurl}>icon.png">

{* Upload directory *}
<img src="<{$xoops_upload_url}>/<{$item.image}>">
```

### URL一代

```smarty
{* Module URL *}
<a href="<{$xoops_url}>/modules/<{$xoops_dirname}>/item.php?id=<{$item.id}>">
    <{$item.title}>
</a>

{* With SEO-friendly URL (if enabled) *}
<a href="<{$item.url}>"><{$item.title}></a>
```

---

## 模板编译流程

```mermaid
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

## 自定义Smarty插件

### 函数插件

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

### 修改器插件

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

### 区块插件

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

## 性能提示

```mermaid
graph LR
    subgraph "Optimization Strategies"
        A[Enable Caching] --> E[Faster Response]
        B[Minimize Variables] --> E
        C[Avoid Complex Logic] --> E
        D[Pre-compute in PHP] --> E
    end
```

### 最佳实践

1. **在生产中启用模板缓存**
2. **仅分配需要的变量** - 不要传递整个对象
3. **谨慎使用修饰符** - 尽可能在PHP中使用-format
4. **避免嵌套循环** - 重构PHP中的数据
5. **缓存昂贵的区块** - 对复杂查询使用区块缓存

---

## 相关文档

- Smarty基础知识
- 主题开发
- Smarty 4 迁移

---

#XOOPS #api #smarty #模板#reference