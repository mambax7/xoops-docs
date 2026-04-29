---
title: "टेम्पलेट चर"
description: "XOOPS टेम्प्लेट में Smarty वेरिएबल उपलब्ध हैं"
---
XOOPS स्वचालित रूप से Smarty टेम्प्लेट में कई वेरिएबल प्रदान करता है। यह संदर्भ थीम और मॉड्यूल टेम्पलेट विकास के लिए उपलब्ध चर का दस्तावेजीकरण करता है।

## संबंधित दस्तावेज़ीकरण

- Smarty- मूल बातें - XOOPS में Smarty के मूल सिद्धांत
- थीम-विकास - XOOPS थीम बनाना
- Smarty-4-माइग्रेशन - Smarty 3 से 4 तक अपग्रेड करना

## ग्लोबल थीम वेरिएबल्स

ये वेरिएबल थीम टेम्प्लेट (`theme.tpl`) में उपलब्ध हैं:

### साइट जानकारी

| परिवर्तनीय | विवरण | उदाहरण |
|---|---|---|
| `$xoops_sitename` | प्राथमिकताओं से साइट का नाम | `"My XOOPS Site"` |
| `$xoops_pagetitle` | वर्तमान पृष्ठ शीर्षक | `"Welcome"` |
| `$xoops_slogan` | साइट का नारा | `"Just Use It!"` |
| `$xoops_url` | पूर्ण XOOPS URL | `"https://example.com"` |
| `$xoops_langcode` | भाषा कोड | `"en"` |
| `$xoops_charset` | चरित्र सेट | `"UTF-8"` |

### मेटा टैग

| परिवर्तनीय | विवरण |
|---|----|
| `$xoops_meta_keywords` | मेटा कीवर्ड |
| `$xoops_meta_description` | मेटा विवरण |
| `$xoops_meta_robots` | रोबोट मेटा टैग |
| `$xoops_meta_rating` | सामग्री रेटिंग |
| `$xoops_meta_author` | लेखक मेटा टैग |
| `$xoops_meta_copyright` | कॉपीराइट नोटिस |

### थीम सूचना

| परिवर्तनीय | विवरण |
|---|----|
| `$xoops_theme` | वर्तमान थीम का नाम |
| `$xoops_imageurl` | थीम छवियाँ निर्देशिका URL |
| `$xoops_themecss` | मुख्य थीम CSS फ़ाइल URL |
| `$xoops_icons32_url` | 32x32 आइकन URL |
| `$xoops_icons16_url` | 16x16 चिह्न URL |

### पृष्ठ सामग्री

| परिवर्तनीय | विवरण |
|---|----|
| `$xoops_contents` | मुख्य पृष्ठ सामग्री |
| `$xoops_module_header` | मॉड्यूल-विशिष्ट प्रमुख सामग्री |
| `$xoops_footer` | पाद सामग्री |
| `$xoops_js` | JavaScript शामिल करने के लिए |

### नेविगेशन और मेनू

| परिवर्तनीय | विवरण |
|---|----|
| `$xoops_mainmenu` | मुख्य नेविगेशन मेनू |
| `$xoops_usermenu` | उपयोगकर्ता मेनू |

### ब्लॉक वेरिएबल्स

| परिवर्तनीय | विवरण |
|---|----|
| `$xoops_lblocks` | बाएँ ब्लॉकों की सारणी |
| `$xoops_rblocks` | दाएँ ब्लॉकों की सारणी |
| `$xoops_cblocks` | केंद्र ब्लॉकों की श्रृंखला |
| `$xoops_showlblock` | बाएँ ब्लॉक दिखाएँ (बूलियन) |
| `$xoops_showrblock` | दाएँ ब्लॉक दिखाएँ (बूलियन) |
| `$xoops_showcblock` | केंद्र ब्लॉक दिखाएं (बूलियन) |

## उपयोगकर्ता चर

जब कोई उपयोगकर्ता लॉग इन होता है:

| परिवर्तनीय | विवरण |
|---|----|
| `$xoops_isuser` | उपयोगकर्ता लॉग इन है (बूलियन) |
| `$xoops_isadmin` | उपयोगकर्ता व्यवस्थापक (बूलियन) है |
| `$xoops_userid` | उपयोगकर्ता आईडी |
| `$xoops_uname` | उपयोगकर्ता नाम |
| `$xoops_isowner` | उपयोगकर्ता वर्तमान सामग्री (बूलियन) का स्वामी है |

### उपयोगकर्ता ऑब्जेक्ट गुणों तक पहुंचें

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## मॉड्यूल चर

मॉड्यूल टेम्पलेट्स में:

| परिवर्तनीय | विवरण |
|---|----|
| `$xoops_dirname` | मॉड्यूल निर्देशिका नाम |
| `$xoops_modulename` | मॉड्यूल प्रदर्शन नाम |
| `$mod_url` | मॉड्यूल URL (जब असाइन किया गया हो) |

### सामान्य मॉड्यूल टेम्पलेट पैटर्न

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

## वेरिएबल्स को ब्लॉक करें

`$xoops_lblocks`, `$xoops_rblocks`, और `$xoops_cblocks` में प्रत्येक ब्लॉक में है:

| संपत्ति | विवरण |
|---|----|
| `$block.id` | ब्लॉक आईडी |
| `$block.title` | ब्लॉक शीर्षक |
| `$block.content` | HTML सामग्री को ब्लॉक करें |
| `$block.template` | ब्लॉक टेम्पलेट नाम |
| `$block.module` | मॉड्यूल का नाम |
| `$block.weight` | ब्लॉक वजन/आदेश |

### ब्लॉक डिस्प्ले उदाहरण

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

## फॉर्म वेरिएबल्स

XoopsForm कक्षाओं का उपयोग करते समय:

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

## पेजिनेशन वेरिएबल्स

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

## कस्टम वेरिएबल निर्दिष्ट करना

### सरल मूल्य

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

### सारणियाँ

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

### वस्तुएं

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

### नेस्टेड एरेज़

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

## Smarty बिल्ट-इन वेरिएबल्स

### $smarty.अब

वर्तमान टाइमस्टैम्प:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.constPHP स्थिरांक तक पहुंचें:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get, $smarty.पोस्ट, $smarty.अनुरोध

एक्सेस अनुरोध चर (सावधानी के साथ उपयोग करें):

```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.सर्वर

सर्वर चर:

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

लूप जानकारी:

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

## XMF हेल्पर वेरिएबल्स

XMF का उपयोग करते समय, अतिरिक्त सहायक उपलब्ध होते हैं:

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

## छवि और संपत्ति URL

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

## उपयोगकर्ता पर आधारित सशर्त प्रदर्शन

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

## भाषा चर

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

या सीधे स्थिरांक का उपयोग करें:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## डिबगिंग वेरिएबल्स

सभी उपलब्ध वेरिएबल देखने के लिए:

```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```

---

#Smarty #टेम्प्लेट्स #वेरिएबल्स #xoops #संदर्भ