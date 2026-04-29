---
title: "משתני תבנית"
description: "משתנים זמינים Smarty בתבניות XOOPS"
---
XOOPS מספק אוטומטית משתנים רבים לתבניות Smarty. הפניה זו מתעדת את המשתנים הזמינים לפיתוח תבניות נושא ומודול.

## תיעוד קשור

- Smarty-Basics - יסודות Smarty ב- XOOPS
- פיתוח נושא - יצירת ערכות נושא של XOOPS
- Smarty-4-Migration - שדרוג מ-Smarty 3 ל-4

## משתני נושא גלובלי

משתנים אלה זמינים בתבניות נושא (`theme.tpl`):

### מידע על האתר

| משתנה | תיאור | דוגמה |
|--------|-------------|--------|
| `$xoops_sitename` | שם אתר מתוך העדפות | `"My XOOPS Site"` |
| `$xoops_pagetitle` | כותרת העמוד הנוכחי | `"Welcome"` |
| `$xoops_slogan` | סיסמת האתר | `"Just Use It!"` |
| `$xoops_url` | מלא XOOPS URL | `"https://example.com"` |
| `$xoops_langcode` | קוד שפה | `"en"` |
| `$xoops_charset` | סט תווים | `"UTF-8"` |

### מטא תגים

| משתנה | תיאור |
|--------|----------------|
| `$xoops_meta_keywords` | מטא מילות מפתח |
| `$xoops_meta_description` | מטא תיאור |
| `$xoops_meta_robots` | מטא תג רובוטים |
| `$xoops_meta_rating` | דירוג תוכן |
| `$xoops_meta_author` | מטא תג מחבר |
| `$xoops_meta_copyright` | הודעת זכויות יוצרים |

### מידע על נושאים

| משתנה | תיאור |
|--------|----------------|
| `$xoops_theme` | שם הנושא הנוכחי |
| `$xoops_imageurl` | ספריית תמונות נושא URL |
| `$xoops_themecss` | נושא ראשי CSS קובץ URL |
| `$xoops_icons32_url` | 32x32 אייקונים URL |
| `$xoops_icons16_url` | 16x16 אייקונים URL |

### תוכן דף

| משתנה | תיאור |
|--------|----------------|
| `$xoops_contents` | תוכן העמוד הראשי |
| `$xoops_module_header` | תוכן ראש ספציפי למודול |
| `$xoops_footer` | תוכן כותרת תחתונה |
| `$xoops_js` | JavaScript לכלול |

### ניווט ותפריטים

| משתנה | תיאור |
|--------|----------------|
| `$xoops_mainmenu` | תפריט ניווט ראשי |
| `$xoops_usermenu` | תפריט משתמש |

### משתנים חסומים

| משתנה | תיאור |
|--------|----------------|
| `$xoops_lblocks` | מערך בלוקים שמאליים |
| `$xoops_rblocks` | מערך בלוקים ימניים |
| `$xoops_cblocks` | מערך בלוקים מרכזיים |
| `$xoops_showlblock` | הצג בלוקים שמאלה (בוליאנית) |
| `$xoops_showrblock` | הצג בלוקים ימניים (בוליאנית) |
| `$xoops_showcblock` | הצג בלוקים מרכזיים (בוליאנית) |

## משתני משתמש

כאשר משתמש מחובר:

| משתנה | תיאור |
|--------|----------------|
| `$xoops_isuser` | המשתמש מחובר (בוליאנית) |
| `$xoops_isadmin` | המשתמש הוא אדמין (בולאני) |
| `$xoops_userid` | מזהה משתמש |
| `$xoops_uname` | שם משתמש |
| `$xoops_isowner` | המשתמש הוא הבעלים של תוכן נוכחי (בוליאני) |

### גישה למאפייני אובייקט משתמש
```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```
## משתני מודול

בתבניות מודול:

| משתנה | תיאור |
|--------|----------------|
| `$xoops_dirname` | שם ספריית מודול |
| `$xoops_modulename` | שם תצוגה של מודול |
| `$mod_url` | מודול URL (כאשר הוקצה) |

### תבנית תבנית מודול נפוצה
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
## משתנים חסומים

לכל בלוק ב-`$xoops_lblocks`, `$xoops_rblocks` ו-`$xoops_cblocks` יש:

| נכס | תיאור |
|--------|----------------|
| `$block.id` | מזהה חסום |
| `$block.title` | כותרת בלוק |
| `$block.content` | חסום HTML תוכן |
| `$block.template` | שם תבנית בלוק |
| `$block.module` | שם המודול |
| `$block.weight` | בלוק weight/order |

### דוגמה לתצוגה בלוק
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
## משתני טופס

בעת שימוש בשיעורי XoopsForm:
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
## משתני עימוד
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
## הקצאת משתנים מותאמים אישית

### ערכים פשוטים
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
### מערכים
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
### חפצים
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
### מערכים מקוננים
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
## Smarty משתנים מובנים

### $smarty.עכשיו

חותמת זמן נוכחית:
```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```
### $smarty.const

גישה לקבועים PHP:
```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```
### $smarty.get, $smarty.post, $smarty.request

משתני בקשת גישה (השתמש בזהירות):
```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```
### $smarty.שרת

משתני שרת:
```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```
### $smarty.foreach

מידע על לולאה:
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
## XMF משתני עוזר

בעת שימוש ב- XMF, עוזרים נוספים זמינים:
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
## תמונה ונכס URLs
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
## תצוגה מותנית בהתבסס על משתמש
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
## משתני שפה
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
או השתמש בקבועים ישירות:
```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```
## איתור באגים במשתנים

כדי לראות את כל המשתנים הזמינים:
```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```
---

#חכם #תבניות #משתנים #xoops #הפניה