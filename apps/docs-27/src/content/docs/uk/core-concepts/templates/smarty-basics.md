---
title: "Smarty Основи"
description: "Основи створення шаблонів Smarty у XOOPS"
---
<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>

:::нота[Smarty Версія від XOOPS Release]
| XOOPS Версія | Smarty Версія | Ключові відмінності |
|--------------|----------------|-----------------|
| 2.5.11 | Smarty 3.x | Блокування `{php}` дозволено (але не рекомендується) |
| 2.7.0+ | Smarty 3.x/4.x | Підготовка до сумісності Smarty 4 |
| 4,0 | Smarty 4.x | Видалено блоки `{php}`, суворіший синтаксис |

Перегляньте вказівки з міграції в Smarty-4-Migration.
:::

Smarty — це механізм шаблонів для PHP, який дозволяє розробникам відокремлювати презентацію (HTML/CSS) від логіки програми. XOOPS використовує Smarty для всіх своїх потреб у шаблонах, забезпечуючи чітке розділення між кодом PHP і виводом HTML.

## Пов'язана документація

- Розробка тем - Створення тем XOOPS
- Template-Variables - доступні змінні в шаблонах
- Smarty-4-Migration - Оновлення з Smarty 3 до 4

## Що таке Smarty?

Smarty забезпечує:

- **Поділ інтересів**: Зберігайте HTML у шаблонах, логіку PHP у класах
- **Успадкування шаблонів**: створюйте складні макети з простих блоків
- **Кешування**: підвищте продуктивність за допомогою скомпільованих шаблонів
- **Модифікатори**: трансформуйте вихідні дані за допомогою вбудованих або спеціальних функцій
- **Безпека**: контролюйте, до яких функцій PHP мають доступ шаблони

## XOOPS Smarty Конфігурація

XOOPS налаштовує Smarty за допомогою спеціальних роздільників:
```
Default Smarty: { and }
XOOPS Smarty:   <{ and }>
```
Це запобігає конфліктам із кодом JavaScript у шаблонах.

## Базовий синтаксис

### Змінні

Змінні передаються від PHP до шаблонів:
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
### Доступ до масиву
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
### Властивості об'єкта
```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* Template *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```
## Коментарі

Коментарі в Smarty не відображаються в HTML:
```smarty
{* This is a comment - it will not appear in the HTML output *}

{*
   Multi-line comments
   are also supported
*}
```
## Керуючі структури

### If/Else Заяви
```smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```
### Оператори порівняння
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
### Перевірка на Empty/Isset
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
### Цикли Foreach
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
### Цикли For
```smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```
### Цикли While
```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```
## Модифікатори змінних

Модифікатори перетворюють вихід змінної:

### Модифікатори рядків
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
### Числові модифікатори
```smarty
{* Number formatting *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* Date formatting *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```
### Модифікатори масиву
```smarty
{* Count items *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```
### Модифікатори ланцюжка
```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```
## Включити та вставити

### Включно з іншими шаблонами
```smarty
{* Include a template file *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* Include with assigned variables *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```
### Вставлення динамічного вмісту
```smarty
{* Insert calls a PHP function for dynamic content *}
<{insert name="getBanner"}>
```
## Призначення змінних у шаблонах
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
## Вбудовані змінні Smarty

### $smarty Змінна
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
## Літеральні блоки

Для JavaScript з фігурними дужками:
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
Або використовуйте змінні Smarty у JavaScript:
```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```
## Спеціальні функції

XOOPS надає власні функції Smarty:
```smarty
{* XOOPS Image URL *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* XOOPS Module URL *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* App URL *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```
## Найкращі практики

### Завжди екранувати вихід
```smarty
{* For user-generated content, always escape *}
<p><{$user_comment|escape}></p>

{* For HTML content, use appropriate method *}
<div><{$content}></div> {* Only if content is pre-sanitized *}
```
### Використовуйте змістовні імена змінних
```php
// Good
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// Avoid
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```
### Зберігайте логіку мінімальною

Шаблони повинні бути зосереджені на презентації. Перемістіть складну логіку до PHP:
```smarty
{* Avoid complex logic in templates *}
{* Bad *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* Good - calculate in PHP and pass a simple flag *}
<{if $can_edit}>
```
### Використовуйте успадкування шаблонів

Для узгоджених макетів використовуйте успадкування шаблонів (див. Розробка теми).

## Шаблони налагодження

### Консоль налагодження
```smarty
{* Show all assigned variables *}
<{debug}>
```
### Тимчасовий вихід
```smarty
{* Debug specific variable *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```
## Поширені шаблони XOOPS

### Структура шаблону модуля
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
### Пагінація
```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```
### Відображення форми
```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```
---

#smarty #templates #xoops #frontend #template-engine