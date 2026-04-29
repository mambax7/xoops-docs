---
title: "Змінні шаблону"
description: "Доступні змінні Smarty у шаблонах XOOPS"
---
XOOPS автоматично надає багато змінних до шаблонів Smarty. Цей довідник документує доступні змінні для розробки шаблонів теми та модуля.

## Пов'язана документація

- Smarty-Basics - Основи Smarty у XOOPS
- Розробка тем - Створення тем XOOPS
- Smarty-4-Migration - Оновлення з Smarty 3 до 4

## Глобальні змінні теми

Ці змінні доступні в шаблонах тем (`theme.tpl`):

### Інформація про сайт

| Змінна | Опис | Приклад |
|----------|-------------|---------|
| `$xoops_sitename` | Назва сайту з налаштувань | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Назва поточної сторінки | `"Welcome"` |
| `$xoops_slogan` | Слоган сайту | `"Just Use It!"` |
| `$xoops_url` | Повний XOOPS URL | `"https://example.com"` |
| `$xoops_langcode` | Код мови | `"en"` |
| `$xoops_charset` | Набір символів | `"UTF-8"` |

### Мета-теги

| Змінна | Опис |
|----------|-------------|
| `$xoops_meta_keywords` | Мета-ключові слова |
| `$xoops_meta_description` | Метаопис |
| `$xoops_meta_robots` | Мета-тег роботів |
| `$xoops_meta_rating` | Рейтинг вмісту |
| `$xoops_meta_author` | Мета-тег автора |
| `$xoops_meta_copyright` | Повідомлення про авторські права |

### Інформація про тему

| Змінна | Опис |
|----------|-------------|
| `$xoops_theme` | Поточна назва теми |
| `$xoops_imageurl` | Каталог зображень теми URL |
| `$xoops_themecss` | Головна тема CSS файл URL |
| `$xoops_icons32_url` | 32x32 іконки URL |
| `$xoops_icons16_url` | 16x16 іконки URL |

### Вміст сторінки

| Змінна | Опис |
|----------|-------------|
| `$xoops_contents` | Зміст головної сторінки |
| `$xoops_module_header` | Головний зміст модуля |
| `$xoops_footer` | Вміст нижнього колонтитула |
| `$xoops_js` | JavaScript включити |

### Навігація та меню

| Змінна | Опис |
|----------|-------------|
| `$xoops_mainmenu` | Головне навігаційне меню |
| `$xoops_usermenu` | Меню користувача |

### Змінні блоку

| Змінна | Опис |
|----------|-------------|
| `$xoops_lblocks` | Масив лівих блоків |
| `$xoops_rblocks` | Масив правих блоків |
| `$xoops_cblocks` | Масив центральних блоків |
| `$xoops_showlblock` | Показати ліві блоки (логічний) |
| `$xoops_showrblock` | Показати праві блоки (логічний) |
| `$xoops_showcblock` | Показати центральні блоки (логічний) |

## Змінні користувача

Коли користувач увійшов у систему:

| Змінна | Опис |
|----------|-------------|
| `$xoops_isuser` | Користувач увійшов у систему (логічне значення) |
| `$xoops_isadmin` | Користувач адміністратор (логічне значення) |
| `$xoops_userid` | ID користувача |
| `$xoops_uname` | Ім'я користувача |
| `$xoops_isowner` | Користувач володіє поточним вмістом (логічне значення) |

### Доступ до властивостей об'єкта користувача
```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```
## Змінні модуля

У шаблонах модулів:

| Змінна | Опис |
|----------|-------------|
| `$xoops_dirname` | Назва каталогу модуля |
| `$xoops_modulename` | Відображуване ім'я модуля |
| `$mod_url` | Модуль URL (якщо призначено) |

### Загальний шаблон шаблону модуля
```php
// In PHP
$helper = \XoopsModules\MyModule\Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_name', $helper->getModule()->getVar('name'));
```

```smarty
{* In template *}
<a href="<{$mod_url}>">Back to <{$mod_name}></a>
```
## Змінні блоку

Кожен блок у `$xoops_lblocks`, `$xoops_rblocks` і `$xoops_cblocks` має:

| Власність | Опис |
|----------|-------------|
| `$block.id` | Ідентифікатор блоку |
| `$block.title` | Назва блоку |
| `$block.content` | Вміст блоку HTML |
| `$block.template` | Назва шаблону блоку |
| `$block.module` | Назва модуля |
| `$block.weight` | Блок weight/order |

### Приклад відображення блоку
```smarty
<{foreach item=block from=$xoops_lblocks}>
<div class="block block-<{$block.module}>">
    <{if $block.title}>
    <h3 class="block-title"><{$block.title}></h3>
    <{/if}>
    <div class="block-content">
        <{$block.content}>
    </div>
</div>
<{/foreach}>
```
## Змінні форми

При використанні класів XoopsForm:
```php
// PHP
$form = new XoopsThemeForm('Edit Item', 'edit_form', 'save.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $title));
$GLOBALS['xoopsTpl']->assign('form', $form->render());
```

```smarty
{* Template *}
<div class="form-container">
    <{$form}>
</div>
```
## Змінні сторінки
```php
// PHP
include_once XOOPS_ROOT_PATH . '/class/pagenav.php';
$pagenav = new XoopsPageNav($total, $limit, $start, 'start');
$GLOBALS['xoopsTpl']->assign('page_nav', $pagenav->renderNav());
```

```smarty
{* Template *}
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```
## Призначення користувацьких змінних

### Прості цінності
```php
$GLOBALS['xoopsTpl']->assign('my_title', 'Custom Title');
$GLOBALS['xoopsTpl']->assign('item_count', 42);
$GLOBALS['xoopsTpl']->assign('is_featured', true);
```

```smarty
<h1><{$my_title}></h1>
<p><{$item_count}> items found</p>
<{if $is_featured}>Featured!<{/if}>
```
### Масиви
```php
$items = [
    ['id' => 1, 'name' => 'Item One', 'price' => 10.99],
    ['id' => 2, 'name' => 'Item Two', 'price' => 20.50],
];
$GLOBALS['xoopsTpl']->assign('items', $items);
```

```smarty
<ul>
<{foreach $items as $item}>
    <li>
        <{$item.name}> - $<{$item.price|string_format:"%.2f"}>
    </li>
<{/foreach}>
</ul>
```
### Об'єкти
```php
$item = $itemHandler->get($itemId);
$GLOBALS['xoopsTpl']->assign('item', $item->toArray());

// Or for XoopsObject
$GLOBALS['xoopsTpl']->assign('item_obj', $item);
```

```smarty
{* Array access *}
<h2><{$item.title}></h2>
<p><{$item.content}></p>

{* Object method access *}
<h2><{$item_obj->getVar('title')}></h2>
```
### Вкладені масиви
```php
$category = [
    'id' => 1,
    'name' => 'Technology',
    'items' => [
        ['id' => 1, 'title' => 'Article 1'],
        ['id' => 2, 'title' => 'Article 2'],
    ]
];
$GLOBALS['xoopsTpl']->assign('category', $category);
```

```smarty
<h2><{$category.name}></h2>
<ul>
<{foreach $category.items as $item}>
    <li><{$item.title}></li>
<{/foreach}>
</ul>
```
## Smarty Вбудовані змінні

### $smarty.now

Поточна позначка часу:
```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```
### $smarty.const

Доступ до констант PHP:
```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```
### $smarty.get, $smarty.post, $smarty.request

Змінні запиту доступу (використовуйте з обережністю):
```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```
### $smarty.сервер

Серверні змінні:
```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```
### $smarty.foreach

Інформація про цикл:
```smarty
<{foreach $items as $item name=itemloop}>
    <{* Index (0-based) *}>
    Index: <{$smarty.foreach.itemloop.index}>

    <{* Iteration (1-based) *}>
    Number: <{$smarty.foreach.itemloop.iteration}>

    <{* First item *}>
    <{if $smarty.foreach.itemloop.first}>First Item!<{/if}>

    <{* Last item *}>
    <{if $smarty.foreach.itemloop.last}>Last Item!<{/if}>

    <{* Total count *}>
    Total: <{$smarty.foreach.itemloop.total}>
<{/foreach}>
```
## XMF Допоміжні змінні

При використанні XMF доступні додаткові помічники:
```php
// In PHP
use Xmf\Module\Helper;

$helper = Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_config', $helper->getConfig());
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_path', $helper->path());
```

```smarty
{* In template *}
<a href="<{$mod_url}>">Module Home</a>
<{if $mod_config.show_breadcrumb}>
    {* Breadcrumb HTML *}
<{/if}>
```
## URL-адреси зображень і ресурсів
```smarty
{* Theme images *}
<img src="<{$xoops_imageurl}>images/logo.png" alt="Logo">

{* Module images *}
<img src="<{$xoops_url}>/modules/<{$xoops_dirname}>/assets/images/icon.png">

{* Upload directory *}
<img src="<{$xoops_url}>/uploads/mymodule/<{$item.image}>">

{* Using icons *}
<img src="<{$xoops_icons32_url}>edit.png" alt="Edit">
<img src="<{$xoops_icons16_url}>delete.png" alt="Delete">
```
## Умовне відображення на основі користувача
```smarty
{* Show only to logged-in users *}
<{if $xoops_isuser}>
    <a href="<{$xoops_url}>/modules/profile/">My Profile</a>
    <a href="<{$xoops_url}>/user.php?op=logout">Logout</a>
<{else}>
    <a href="<{$xoops_url}>/user.php">Login</a>
    <a href="<{$xoops_url}>/register.php">Register</a>
<{/if}>

{* Show only to admins *}
<{if $xoops_isadmin}>
    <a href="<{$xoops_url}>/admin.php">Admin Panel</a>
<{/if}>

{* Show only to content owner *}
<{if $xoops_isowner || $xoops_isadmin}>
    <a href="edit.php?id=<{$item.id}>">Edit</a>
    <a href="delete.php?id=<{$item.id}>">Delete</a>
<{/if}>
```
## Мовні змінні
```php
// In PHP - load language file
xoops_loadLanguage('main', 'mymodule');

// Assign language constants
$GLOBALS['xoopsTpl']->assign('lang_title', _MD_MYMODULE_TITLE);
$GLOBALS['xoopsTpl']->assign('lang_submit', _SUBMIT);
```

```smarty
{* In template *}
<h1><{$lang_title}></h1>
<button type="submit"><{$lang_submit}></button>
```
Або використовуйте константи безпосередньо:
```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```
## Налагодження змінних

Щоб переглянути всі доступні змінні:
```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```
---

#розумні #шаблони #змінні #xoops #посилання