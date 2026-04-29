---
title: "เทมเพลต Smarty API ข้อมูลอ้างอิง"
description: "กรอกการอ้างอิง API สำหรับการสร้างเทมเพลต Smarty ใน XOOPS"
---
> กรอกเอกสาร API สำหรับการสร้างเทมเพลต Smarty ใน XOOPS ให้ครบถ้วน

---

## สถาปัตยกรรมเครื่องมือเทมเพลต
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

## คลาส XoopsTpl

### การเริ่มต้น
```php
// Global template object
global $xoopsTpl;

// Or get new instance
$tpl = new XoopsTpl();

// Available in modules
$GLOBALS['xoopsTpl']->assign('myvar', $value);
```
### วิธีการหลัก

| วิธีการ | พารามิเตอร์ | คำอธิบาย |
|--------|------------|-------------|
| `assign` | `string $name, mixed $value` | กำหนดตัวแปรให้กับเทมเพลต |
| `assignByRef` | `string $name, mixed &$value` | กำหนดโดยการอ้างอิง |
| `append` | `string $name, mixed $value, bool $merge = false` | ผนวกเข้ากับตัวแปรอาร์เรย์ |
| `display` | `string $template` | เทมเพลตการเรนเดอร์และเอาต์พุต |
| `fetch` | `string $template` | เรนเดอร์และส่งคืนเทมเพลต |
| `clearAssign` | `string $name` | ล้างตัวแปรที่กำหนด |
| `clearAllAssign` | - | ล้างตัวแปรทั้งหมด |
| `getTemplateVars` | `string $name = null` | รับตัวแปรที่กำหนด |
| `templateExists` | `string $template` | ตรวจสอบว่ามีเทมเพลตอยู่ |
| `isCached` | `string $template` | ตรวจสอบว่าเทมเพลตถูกแคช |
| `clearCache` | `string $template = null` | ล้างแคชเทมเพลต |

### การกำหนดตัวแปร
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
### กำลังโหลดเทมเพลต
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

## การอ้างอิงไวยากรณ์ Smarty

### ตัวแปร
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
### ตัวแก้ไข
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
### โครงสร้างการควบคุม
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
### รวมถึง
```smarty
{* Include another template *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem showAuthor=true}>

{* Include from theme *}
<{include file="$theme_template_set/header.tpl"}>
```
### ความคิดเห็น
```smarty
{* This is a Smarty comment - not rendered in output *}

{*
    Multi-line comment
    explaining the template
*}
```
---

## XOOPS-ฟังก์ชันเฉพาะ

### บล็อกการแสดงผล
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
### การจัดการรูปภาพและสินทรัพย์
```smarty
{* Module image *}
<img src="<{$xoops_url}>/modules/<{$xoops_dirname}>/assets/images/logo.png">

{* Theme image *}
<img src="<{$xoops_imageurl}>icon.png">

{* Upload directory *}
<img src="<{$xoops_upload_url}>/<{$item.image}>">
```
### URL รุ่น
```smarty
{* Module URL *}
<a href="<{$xoops_url}>/modules/<{$xoops_dirname}>/item.php?id=<{$item.id}>">
    <{$item.title}>
</a>

{* With SEO-friendly URL (if enabled) *}
<a href="<{$item.url}>"><{$item.title}></a>
```
---

## ขั้นตอนการรวบรวมเทมเพลต
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

## ปลั๊กอิน Smarty แบบกำหนดเอง

### ปลั๊กอินฟังก์ชัน
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
### ปลั๊กอินตัวแก้ไข
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
### บล็อกปลั๊กอิน
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

## เคล็ดลับประสิทธิภาพ
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
### แนวทางปฏิบัติที่ดีที่สุด

1. **เปิดใช้งานการแคชเทมเพลต** ในการผลิต
2. **กำหนดเฉพาะตัวแปรที่จำเป็นเท่านั้น** - อย่าผ่านวัตถุทั้งหมด
3. **ใช้ตัวแก้ไขเท่าที่จำเป็น** - จัดรูปแบบล่วงหน้าเป็น PHP เมื่อเป็นไปได้
4. **หลีกเลี่ยงลูปที่ซ้อนกัน** - ปรับโครงสร้างข้อมูลใน PHP
5. **บล็อกแคชราคาแพง** - ใช้บล็อกแคชสำหรับการสืบค้นที่ซับซ้อน

---

## เอกสารที่เกี่ยวข้อง

- พื้นฐานอันชาญฉลาด
- การพัฒนาธีม
- การโยกย้ายอย่างชาญฉลาด 4

---

#xoops #api #smarty #templates #reference