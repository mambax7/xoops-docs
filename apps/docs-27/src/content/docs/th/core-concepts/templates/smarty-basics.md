---
title: "พื้นฐานอันชาญฉลาด"
description: "พื้นฐานของการสร้างเทมเพลต Smarty ใน XOOPS"
---
<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>

:::note[เวอร์ชันอัจฉริยะโดย XOOPS Release]
| XOOPS เวอร์ชัน | เวอร์ชั่นอัจฉริยะ | ความแตกต่างที่สำคัญ |
|-------------------|----------------|-----------------|
| 2.5.11 | สมาร์ทตี้ 3.x | `{php}` อนุญาตให้บล็อกได้ (แต่ไม่สนับสนุน) |
| 2.7.0+ | สมาร์ทตี้ 3.x/4.x | กำลังเตรียมความเข้ากันได้กับ Smarty 4 |
| 4.0 | สมาร์ทตี้ 4.x | `{php}` บล็อกถูกลบออก ไวยากรณ์ที่เข้มงวดยิ่งขึ้น |

ดูคำแนะนำในการย้ายข้อมูล Smarty-4-Migration
::::::

Smarty เป็นเครื่องมือเทมเพลตสำหรับ PHP ที่ช่วยให้นักพัฒนาสามารถแยกการนำเสนอ (HTML/CSS) ออกจากตรรกะของแอปพลิเคชัน XOOPS ใช้ Smarty สำหรับทุกความต้องการในการสร้างเทมเพลต ทำให้สามารถแยกเอาต์พุตระหว่างโค้ด PHP และเอาต์พุต HTML ได้อย่างชัดเจน

## เอกสารที่เกี่ยวข้อง

- การพัฒนาธีม - การสร้างธีม XOOPS
- เทมเพลต-ตัวแปร - ตัวแปรที่มีอยู่ในเทมเพลต
- Smarty-4-Migration - อัปเกรดจาก Smarty 3 เป็น 4

## Smarty คืออะไร?

สมาร์ทตี้จัดให้:

- **การแยกข้อกังวล**: เก็บ HTML ไว้ในเทมเพลต PHP ตรรกะในชั้นเรียน
- **การสืบทอดเทมเพลต**: สร้างเลย์เอาต์ที่ซับซ้อนจากบล็อกธรรมดา
- **แคช**: ปรับปรุงประสิทธิภาพด้วยเทมเพลตที่คอมไพล์แล้ว
- **ตัวแก้ไข**: แปลงเอาต์พุตด้วยฟังก์ชันในตัวหรือแบบกำหนดเอง
- **ความปลอดภัย**: ควบคุมสิ่งที่เทมเพลตฟังก์ชัน PHP สามารถเข้าถึงได้

## XOOPS การกำหนดค่าอันชาญฉลาด

XOOPS กำหนดค่า Smarty ด้วยตัวคั่นที่กำหนดเอง:
```
Default Smarty: { and }
XOOPS Smarty:   <{ and }>
```
ซึ่งจะช่วยป้องกันความขัดแย้งกับโค้ด JavaScript ในเทมเพลต

## ไวยากรณ์พื้นฐาน

### ตัวแปร

ตัวแปรถูกส่งผ่านจาก PHP ไปยังเทมเพลต:
```php
// In PHP
$GLOBALS['xoopsTpl']->assign('title', 'My Page Title');
$GLOBALS['xoopsTpl']->assign('count', 42);
```

```smarty
{* In template *}
<h1><{$title}></h1>
<p>Total items: <{$count}></p>
```
### การเข้าถึงอาร์เรย์
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
### คุณสมบัติของวัตถุ
```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* Template *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```
## ความคิดเห็น

ความคิดเห็นใน Smarty จะไม่แสดงผลเป็น HTML:
```smarty
{* This is a comment - it will not appear in the HTML output *}

{*
   Multi-line comments
   are also supported
*}
```
## โครงสร้างการควบคุม

### คำสั่ง If/Else
```smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```
### ตัวดำเนินการเปรียบเทียบ
```smarty
{* Equality *}
<{if $status == 'published'}>Published<{/if}>
<{if $status eq 'published'}>Published<{/if}>

{* Inequality *}
<{if $count != 0}>Has items<{/if}>
<{if $count neq 0}>Has items<{/if}>

{* Greater/Less than *}
<{if $count > 10}>Many items<{/if}>
<{if $count gt 10}>Many items<{/if}>
<{if $count < 5}>Few items<{/if}>
<{if $count lt 5}>Few items<{/if}>

{* Greater/Less than or equal *}
<{if $count >= 10}>Ten or more<{/if}>
<{if $count gte 10}>Ten or more<{/if}>
<{if $count <= 5}>Five or less<{/if}>
<{if $count lte 5}>Five or less<{/if}>

{* Logical operators *}
<{if $logged_in && $is_admin}>Admin Panel<{/if}>
<{if $logged_in and $is_admin}>Admin Panel<{/if}>
<{if $option1 || $option2}>One option selected<{/if}>
<{if $option1 or $option2}>One option selected<{/if}>
<{if !$is_banned}>Access granted<{/if}>
<{if not $is_banned}>Access granted<{/if}>
```
### กำลังตรวจสอบว่าง/Isset
```smarty
{* Check if variable exists and has value *}
<{if $title}>
    <h1><{$title}></h1>
<{/if}>

{* Check if array is not empty *}
<{if $items|@count > 0}>
    <ul>
        <{foreach $items as $item}>
            <li><{$item.name}></li>
        <{/foreach}>
    </ul>
<{/if}>

{* Using isset *}
<{if isset($description)}>
    <p><{$description}></p>
<{/if}>
```
### ลูปหน้า
```smarty
{* Basic foreach *}
<ul>
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{/foreach}>
</ul>

{* With key *}
<{foreach $options as $key => $value}>
    <option value="<{$key}>"><{$value}></option>
<{/foreach}>

{* With @index, @first, @last *}
<{foreach $items as $item}>
    <{if $item@first}><ul><{/if}>
    <li class="item-<{$item@index}>"><{$item.name}></li>
    <{if $item@last}></ul><{/if}>
<{/foreach}>

{* Alternate row colors *}
<{foreach $rows as $row}>
    <tr class="<{if $row@iteration is odd}>odd<{else}>even<{/if}>">
        <td><{$row.name}></td>
    </tr>
<{/foreach}>

{* Foreachelse for empty arrays *}
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{foreachelse}>
    <li>No items found.</li>
<{/foreach}>
```
### สำหรับลูป
```smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```
### ในขณะที่วนซ้ำ
```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```
## ตัวแก้ไขตัวแปร

โมดิฟายเออร์แปลงเอาต์พุตตัวแปร:

### ตัวแก้ไขสตริง
```smarty
{* HTML escape (always use for user input!) *}
<{$title|escape}>
<{$title|escape:'html'}>

{* URL encoding *}
<{$url|escape:'url'}>

{* Uppercase/Lowercase *}
<{$name|upper}>
<{$name|lower}>
<{$name|capitalize}>

{* Truncate text *}
<{$content|truncate:100:'...'}>

{* Strip HTML tags *}
<{$html|strip_tags}>

{* Replace *}
<{$text|replace:'old':'new'}>

{* Word wrap *}
<{$text|wordwrap:80:"\n"}>

{* Default value *}
<{$optional_var|default:'No value'}>
```
### ตัวดัดแปลงตัวเลข
```smarty
{* Number formatting *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* Date formatting *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```
### ตัวดัดแปลงอาร์เรย์
```smarty
{* Count items *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```
### ตัวดัดแปลงการผูกมัด
```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```
## รวมและแทรก

### รวมถึงเทมเพลตอื่นๆ
```smarty
{* Include a template file *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* Include with assigned variables *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```
### การแทรกเนื้อหาแบบไดนามิก
```smarty
{* Insert calls a PHP function for dynamic content *}
<{insert name="getBanner"}>
```
## กำหนดตัวแปรในเทมเพลต
```smarty
{* Simple assignment *}
<{assign var="page_title" value="Welcome"}>
<{$page_title = "Welcome"}>

{* Assignment from expression *}
<{assign var="full_name" value="`$first_name` `$last_name`"}>

{* Capture block content *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
    <ul>
        <li>Link 1</li>
        <li>Link 2</li>
    </ul>
<{/capture}>
<div class="sidebar"><{$smarty.capture.sidebar}></div>
```
## ตัวแปร Smarty ในตัว

### $smarty ตัวแปร
```smarty
{* Current timestamp *}
<{$smarty.now|date_format:"%Y-%m-%d"}>

{* Request variables *}
<{$smarty.get.page}>
<{$smarty.post.username}>
<{$smarty.request.id}>
<{$smarty.cookies.session_id}>
<{$smarty.server.HTTP_HOST}>

{* Constants *}
<{$smarty.const.XOOPS_URL}>

{* Configuration variables *}
<{$smarty.config.var_name}>

{* Template info *}
<{$smarty.template}>
<{$smarty.current_dir}>

{* Smarty version *}
<{$smarty.version}>

{* Section/Foreach properties *}
<{$smarty.foreach.items.index}>
<{$smarty.foreach.items.iteration}>
<{$smarty.foreach.items.first}>
<{$smarty.foreach.items.last}>
```
## บล็อกตัวอักษร

สำหรับ JavaScript ที่มีเครื่องหมายปีกกา:
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
หรือใช้ตัวแปร Smarty ภายใน JavaScript:
```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```
## ฟังก์ชั่นที่กำหนดเอง

XOOPS มีฟังก์ชัน Smarty แบบกำหนดเอง:
```smarty
{* XOOPS Image URL *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* XOOPS Module URL *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* App URL *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```
## แนวทางปฏิบัติที่ดีที่สุด

### ออกจากเอาต์พุตเสมอ
```smarty
{* For user-generated content, always escape *}
<p><{$user_comment|escape}></p>

{* For HTML content, use appropriate method *}
<div><{$content}></div> {* Only if content is pre-sanitized *}
```
### ใช้ชื่อตัวแปรที่มีความหมาย
```php
// Good
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// Avoid
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```
### รักษาตรรกะให้น้อยที่สุด

เทมเพลตควรเน้นไปที่การนำเสนอ ย้ายตรรกะที่ซับซ้อนไปที่ PHP:
```smarty
{* Avoid complex logic in templates *}
{* Bad *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* Good - calculate in PHP and pass a simple flag *}
<{if $can_edit}>
```
### ใช้การสืบทอดเทมเพลต

สำหรับเค้าโครงที่สอดคล้องกัน ให้ใช้การสืบทอดเทมเพลต (ดู การพัฒนาธีม)

## เทมเพลตการดีบัก

### คอนโซลดีบัก
```smarty
{* Show all assigned variables *}
<{debug}>
```
### เอาต์พุตชั่วคราว
```smarty
{* Debug specific variable *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```
## รูปแบบเทมเพลตทั่วไป XOOPS

### โครงสร้างเทมเพลตโมดูล
```smarty
{* Module header *}
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

    {* Content *}
    <div class="content">
        <{$content}>
    </div>
</div>
```
### การแบ่งหน้า
```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```
### การแสดงแบบฟอร์ม
```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```
---

#smarty #templates #xoops #frontend #template-engine