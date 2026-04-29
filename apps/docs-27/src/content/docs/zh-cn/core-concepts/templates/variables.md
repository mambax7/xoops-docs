---
title: “模板变量”
description: “XOOPS模板中的可用Smarty变量”
---

XOOPS自动向Smarty模板提供许多变量。本参考记录了主题和模区块模板开发的可用变量。

## 相关文档

- Smarty-Basics - XOOPS中Smarty的基础知识
- 主题-Development - 创建XOOPS主题
- Smarty-4-Migration - 从Smarty 3 升级到 4

## 全局主题变量

这些变量在主题模板中可用（`theme.tpl`）：

### 站点信息

|变量|描述 |示例|
|----------|-------------|---------|
| `$XOOPS_sitename` |首选项中的站点名称 | `"My XOOPS Site"` |
| `$XOOPS_pagetitle` |当前页面标题 | `"Welcome"` |
| `$XOOPS_slogan` |网站口号| `"Just Use It!"` |
| `$XOOPS_url` |完整XOOPSURL | `"https://example.com"` |
| `$XOOPS_langcode`|语言代码 | `"en"` |
| `$XOOPS_charset` |字符集 | `"UTF-8"` |

### 元标签

|变量|描述 |
|----------|-------------|
| `$XOOPS_meta_keywords` |元关键词|
| `$XOOPS_meta_description` |元描述 |
| `$XOOPS_meta_robots` |机器人元标签 |
| `$XOOPS_meta_rating` |内容评级 |
| `$XOOPS_meta_author` |作者元标签 |
| `$XOOPS_meta_copyright` |版权声明|

### 主题信息

|变量|描述 |
|----------|-------------|
| `$XOOPS_theme` |当前主题名称 |
| `$XOOPS_imageurl` |主题图片目录URL |
| `$XOOPS_themecss` |主主题CSS文件URL |
| `$XOOPS_icons32_url` | 32x32 图标URL |
| `$XOOPS_icons16_url` | 16x16 图标URL |

### 页面内容

|变量|描述 |
|----------|-------------|
| `$XOOPS_contents` |主页内容|
| `$XOOPS_module_header` |模区块-specific头部内容 |
| `$XOOPS_footer`|页脚内容|
| `$XOOPS_js` | JavaScript 包括 |

### 导航和菜单

|变量|描述 |
|----------|-------------|
| `$XOOPS_mainmenu` |主导航菜单 |
| `$XOOPS_usermenu` |用户菜单 |

### 区块变量

|变量|描述 |
|----------|-------------|
| `$XOOPS_lblocks`|左区块数组 |
| `$XOOPS_rblocks` |右区块数组 |
| `$XOOPS_cblocks` |中心区块阵列|
| `$XOOPS_showlblock` |显示左侧区块（布尔值）|
| `$XOOPS_showrblock`|显示右侧区块（布尔值）|
| `$XOOPS_showcblock` |显示中心区块（布尔值）|

## 用户变量

当用户登录时：

|变量|描述 |
|----------|-------------|
| `$XOOPS_isuser` |用户已登录（布尔值）|
| `$XOOPS_isadmin` |用户是管理员（布尔值）|
| `$XOOPS_userid` |用户名 |
| `$XOOPS_uname` |用户名 |
| `$XOOPS_isowner` |用户拥有当前内容（布尔值） |

### 访问用户对象属性

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## 模区块变量

在模区块模板中：

|变量|描述 |
|----------|-------------|
| `$XOOPS_dirname` |模区块目录名称|
| `$XOOPS_modulename`|模区块显示名称 |
| `$mod_url` |模区块URL（分配时）|

### 通用模区块模板模式

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

## 区块变量

`$XOOPS_lblocks`、`$XOOPS_rblocks` 和 `$XOOPS_cblocks` 中的每个区块具有：

|物业 |描述 |
|----------|-------------|
| `$block.id` |区块 ID |
| `$block.title` |区区块标题 |
| `$block.content` |阻止HTML内容|
| `$block.template`|区块模板名称|
| `$block.module`|模区块名称|
| `$block.weight`|区块weight/order |

### 区块显示示例

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

## 表单变量

使用 XOOPSForm 类时：

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

## 分页变量

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

## 分配自定义变量

### 简单值

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

### 数组

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

### 对象

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

### 嵌套数组

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

## Smarty 内置-in 变量

### $smarty.现在

当前时间戳：

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.常量

访问PHP常量：

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.获取，$smarty.发布，$smarty.请求

访问请求变量（谨慎使用）：

```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.服务器

服务器变量：

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

循环信息：

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

## XMF 辅助变量

使用XMF时，可以使用其他帮助程序：

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

## 图像和资源 URL

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

## 基于用户的条件显示

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

## 语言变量

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

或者直接使用常量：

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## 调试变量

要查看所有可用变量：

```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```

---

#smarty #模板 #变量 #XOOPS #参考
