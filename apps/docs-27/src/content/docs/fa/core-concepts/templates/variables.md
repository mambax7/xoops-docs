---
title: "متغیرهای قالب"
description: "متغیرهای Smarty موجود در قالب‌های XOOPS"
---
XOOPS به طور خودکار متغیرهای زیادی را در قالب Smarty فراهم می کند. این مرجع متغیرهای موجود برای توسعه تم و قالب ماژول را مستند می کند.

## مستندات مرتبط

- Smarty-Basics - مبانی Smarty در XOOPS
- توسعه تم - ایجاد تم های XOOPS
- Smarty-4-Migration - ارتقاء از Smarty 3 به 4

## متغیرهای تم جهانی

این متغیرها در قالب‌های تم موجود هستند (`theme.tpl`):

### اطلاعات سایت

| متغیر | توضیحات | مثال |
|----------|-------------|---------|
| `$xoops_sitename` | نام سایت از تنظیمات برگزیده | `"My XOOPS Site"` |
| `$xoops_pagetitle` | عنوان صفحه فعلی | `"Welcome"` |
| `$xoops_slogan` | شعار سایت | `"Just Use It!"` |
| `$xoops_url` | آدرس کامل XOOPS | `"https://example.com"` |
| `$xoops_langcode` | کد زبان | `"en"` |
| `$xoops_charset` | مجموعه کاراکتر | `"UTF-8"` |

### متا تگ ها

| متغیر | توضیحات |
|----------|-------------|
| `$xoops_meta_keywords` | کلمات کلیدی متا |
| `$xoops_meta_description` | توضیحات متا |
| `$xoops_meta_robots` | متا تگ روبات ها |
| `$xoops_meta_rating` | رتبه بندی مطالب |
| `$xoops_meta_author` | متا تگ نویسنده |
| `$xoops_meta_copyright` | اطلاعیه حق چاپ |

### اطلاعات تم

| متغیر | توضیحات |
|----------|-------------|
| `$xoops_theme` | نام موضوع فعلی |
| `$xoops_imageurl` | آدرس فهرست تصاویر تم |
| `$xoops_themecss` | آدرس فایل CSS موضوع اصلی |
| `$xoops_icons32_url` | نشانی اینترنتی نمادهای 32x32 |
| `$xoops_icons16_url` | نشانی اینترنتی نمادهای 16×16 |

### محتوای صفحه

| متغیر | توضیحات |
|----------|-------------|
| `$xoops_contents` | محتوای صفحه اصلی |
| `$xoops_module_header` | محتوای سر ویژه ماژول |
| `$xoops_footer` | مطالب پاورقی |
| `$xoops_js` | جاوا اسکریپت برای گنجاندن |

### ناوبری و منوها

| متغیر | توضیحات |
|----------|-------------|
| `$xoops_mainmenu` | منوی ناوبری اصلی |
| `$xoops_usermenu` | منوی کاربری |

### متغیرها را مسدود کنید

| متغیر | توضیحات |
|----------|-------------|
| `$xoops_lblocks` | آرایه بلوک های چپ |
| `$xoops_rblocks` | آرایه بلوک های سمت راست |
| `$xoops_cblocks` | آرایه بلوک های مرکزی |
| `$xoops_showlblock` | نمایش بلوک های سمت چپ (بولی) |
| `$xoops_showrblock` | نمایش بلوک های سمت راست (بولی) |
| `$xoops_showcblock` | نمایش بلوک های مرکزی (بولی) |

## متغیرهای کاربر

هنگامی که یک کاربر وارد شده است:

| متغیر | توضیحات |
|----------|-------------|
| `$xoops_isuser` | کاربر وارد شده است (بولی) |
| `$xoops_isadmin` | کاربر مدیر (بولی) |
| `$xoops_userid` | شناسه کاربری |
| `$xoops_uname` | نام کاربری |
| `$xoops_isowner` | کاربر مالک محتوای فعلی (بولی) |

### به ویژگی های شی کاربر دسترسی پیدا کنید

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## متغیرهای ماژول

در قالب های ماژول:

| متغیر | توضیحات |
|----------|-------------|
| `$xoops_dirname` | نام دایرکتوری ماژول |
| `$xoops_modulename` | نام نمایشی ماژول |
| `$mod_url` | URL ماژول (در صورت اختصاص) |

### الگوی الگوی معمول ماژول

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

## متغیرها را مسدود کنید

هر بلوک در `$xoops_lblocks`، `$xoops_rblocks`، و `$xoops_cblocks` دارای:

| اموال | توضیحات |
|----------|-------------|
| `$block.id` | شناسه بلاک |
| `$block.title` | عنوان بلوک |
| `$block.content` | مسدود کردن محتوای HTML |
| `$block.template` | بلوک نام قالب |
| `$block.module` | نام ماژول |
| `$block.weight` | بلوک weight/order |

### مثال نمایش بلوک

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

## متغیرهای فرم

هنگام استفاده از کلاس های XoopsForm:

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

## متغیرهای صفحه بندی

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

## اختصاص متغیرهای سفارشی

### ارزش های ساده

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

### آرایه ها

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

### اشیاء

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

### آرایه های تودرتو

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

## متغیرهای هوشمند داخلی### $smarty.now

مهر زمانی فعلی:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.const

دسترسی به ثابت های PHP:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get، $smarty.post، $smarty.request

متغیرهای درخواست دسترسی (با احتیاط استفاده کنید):

```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.server

متغیرهای سرور:

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

اطلاعات حلقه:

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

## متغیرهای کمکی XMF

هنگام استفاده از XMF، کمک های اضافی در دسترس هستند:

```php
// In PHP
use XMF\Module\Helper;

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

## نشانی‌های اینترنتی تصویر و دارایی

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

## نمایش مشروط بر اساس کاربر

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

## متغیرهای زبان

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

یا به طور مستقیم از ثابت ها استفاده کنید:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## اشکال زدایی متغیرها

برای دیدن همه متغیرهای موجود:

```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```

---

#الگوهای #هوشمند #متغیرها #مرجع #xoops