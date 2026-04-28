---
title: "範本變量"
description: "XOOPS範本中可用的Smarty變量"
---

XOOPS自動向Smarty範本提供許多變量。本參考文檔記錄了主題和模組範本開發中的可用變量。

## 相關文檔

- Smarty基礎知識 - XOOPS中Smarty的基礎
- 主題開發 - 建立XOOPS主題
- Smarty 4遷移 - 從Smarty 3升級到4

## 全域主題變量

這些變量在主題範本(`theme.tpl`)中可用：

### 網站訊息

| 變量 | 描述 | 範例 |
|------|------|------|
| `$xoops_sitename` | 網站名稱 | `"My XOOPS Site"` |
| `$xoops_pagetitle` | 當前頁面標題 | `"Welcome"` |
| `$xoops_slogan` | 網站標語 | `"Just Use It!"` |
| `$xoops_url` | 完整XOOPS URL | `"https://example.com"` |
| `$xoops_langcode` | 語言代碼 | `"en"` |
| `$xoops_charset` | 字符集 | `"UTF-8"` |

### Meta標籤

| 變量 | 描述 |
|------|------|
| `$xoops_meta_keywords` | Meta關鍵字 |
| `$xoops_meta_description` | Meta描述 |
| `$xoops_meta_robots` | Robots meta標籤 |
| `$xoops_meta_rating` | 內容評級 |
| `$xoops_meta_author` | 作者meta標籤 |
| `$xoops_meta_copyright` | 著作權通知 |

### 主題訊息

| 變量 | 描述 |
|------|------|
| `$xoops_theme` | 當前主題名稱 |
| `$xoops_imageurl` | 主題圖像目錄URL |
| `$xoops_themecss` | 主題CSS檔案URL |
| `$xoops_icons32_url` | 32x32圖標URL |
| `$xoops_icons16_url` | 16x16圖標URL |

### 頁面內容

| 變量 | 描述 |
|------|------|
| `$xoops_contents` | 主頁面內容 |
| `$xoops_module_header` | 模組特定的頭內容 |
| `$xoops_footer` | 頁腳內容 |
| `$xoops_js` | 要包括的JavaScript |

### 導航和菜單

| 變量 | 描述 |
|------|------|
| `$xoops_mainmenu` | 主導航菜單 |
| `$xoops_usermenu` | 用戶菜單 |

### 區塊變量

| 變量 | 描述 |
|------|------|
| `$xoops_lblocks` | 左邊區塊陣列 |
| `$xoops_rblocks` | 右邊區塊陣列 |
| `$xoops_cblocks` | 中心區塊陣列 |
| `$xoops_showlblock` | 顯示左邊區塊(布林值) |
| `$xoops_showrblock` | 顯示右邊區塊(布林值) |
| `$xoops_showcblock` | 顯示中心區塊(布林值) |

## 用戶變量

當用戶已登錄時：

| 變量 | 描述 |
|------|------|
| `$xoops_isuser` | 用戶已登錄(布林值) |
| `$xoops_isadmin` | 用戶是管理員(布林值) |
| `$xoops_userid` | 用戶ID |
| `$xoops_uname` | 用戶名 |
| `$xoops_isowner` | 用戶擁有當前內容(布林值) |

### 訪問用戶物件屬性

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## 模組變量

在模組範本中：

| 變量 | 描述 |
|------|------|
| `$xoops_dirname` | 模組目錄名稱 |
| `$xoops_modulename` | 模組顯示名稱 |
| `$mod_url` | 模組URL(當指派時) |

### 常見的模組範本模式

```php
// 在PHP中
$helper = \XoopsModules\MyModule\Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_name', $helper->getModule()->getVar('name'));
```

```smarty
{* 在範本中 *}
<a href="<{$mod_url}>">Back to <{$mod_name}></a>
```

## 區塊變量

`$xoops_lblocks`、`$xoops_rblocks`和`$xoops_cblocks`中的每個區塊都有：

| 屬性 | 描述 |
|------|------|
| `$block.id` | 區塊ID |
| `$block.title` | 區塊標題 |
| `$block.content` | 區塊HTML內容 |
| `$block.template` | 區塊範本名稱 |
| `$block.module` | 模組名稱 |
| `$block.weight` | 區塊重量/順序 |

### 區塊顯示範例

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

## 表單變量

使用XoopsForm類時：

```php
// PHP
$form = new XoopsThemeForm('Edit Item', 'edit_form', 'save.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $title));
$GLOBALS['xoopsTpl']->assign('form', $form->render());
```

```smarty
{* 範本 *}
<div class="form-container">
    <{$form}>
</div>
```

## 分頁變量

```php
// PHP
include_once XOOPS_ROOT_PATH . '/class/pagenav.php';
$pagenav = new XoopsPageNav($total, $limit, $start, 'start');
$GLOBALS['xoopsTpl']->assign('page_nav', $pagenav->renderNav());
```

```smarty
{* 範本 *}
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

## 指派自訂變量

### 簡單值

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

### 陣列

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

### 物件

```php
$item = $itemHandler->get($itemId);
$GLOBALS['xoopsTpl']->assign('item', $item->toArray());

// 或針對XoopsObject
$GLOBALS['xoopsTpl']->assign('item_obj', $item);
```

```smarty
{* 陣列訪問 *}
<h2><{$item.title}></h2>
<p><{$item.content}></p>

{* 物件方法訪問 *}
<h2><{$item_obj->getVar('title')}></h2>
```

### 嵌套陣列

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

## Smarty內置變量

### $smarty.now

當前時間戳：

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.const

訪問PHP常數：

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get、$smarty.post、$smarty.request

訪問請求變量(小心使用)：

```smarty
{* 僅用於閱讀，始終轉義輸出！ *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.server

伺服器變量：

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

迴圈訊息：

```smarty
<{foreach $items as $item name=itemloop}>
    {* 索引(基於0) *}
    Index: <{$smarty.foreach.itemloop.index}>

    {* 迭代(基於1) *}
    Number: <{$smarty.foreach.itemloop.iteration}>

    {* 第一項 *}
    <{if $smarty.foreach.itemloop.first}>First Item!<{/if}>

    {* 最後一項 *}
    <{if $smarty.foreach.itemloop.last}>Last Item!<{/if}>

    {* 總計數 *}
    Total: <{$smarty.foreach.itemloop.total}>
<{/foreach}>
```

## XMF幫助器變量

使用XMF時，還有其他幫助器可用：

```php
// 在PHP中
use Xmf\Module\Helper;

$helper = Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_config', $helper->getConfig());
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_path', $helper->path());
```

```smarty
{* 在範本中 *}
<a href="<{$mod_url}>">Module Home</a>
<{if $mod_config.show_breadcrumb}>
    {* 麵包屑HTML *}
<{/if}>
```

## 圖像和資產URL

```smarty
{* 主題圖像 *}
<img src="<{$xoops_imageurl}>images/logo.png" alt="Logo">

{* 模組圖像 *}
<img src="<{$xoops_url}>/modules/<{$xoops_dirname}>/assets/images/icon.png">

{* 上傳目錄 *}
<img src="<{$xoops_url}>/uploads/mymodule/<{$item.image}>">

{* 使用圖標 *}
<img src="<{$xoops_icons32_url}>edit.png" alt="Edit">
<img src="<{$xoops_icons16_url}>delete.png" alt="Delete">
```

## 根據用戶的條件顯示

```smarty
{* 僅向已登錄用戶顯示 *}
<{if $xoops_isuser}>
    <a href="<{$xoops_url}>/modules/profile/">My Profile</a>
    <a href="<{$xoops_url}>/user.php?op=logout">Logout</a>
<{else}>
    <a href="<{$xoops_url}>/user.php">Login</a>
    <a href="<{$xoops_url}>/register.php">Register</a>
<{/if}>

{* 僅向管理員顯示 *}
<{if $xoops_isadmin}>
    <a href="<{$xoops_url}>/admin.php">Admin Panel</a>
<{/if}>

{* 僅向內容所有者顯示 *}
<{if $xoops_isowner || $xoops_isadmin}>
    <a href="edit.php?id=<{$item.id}>">Edit</a>
    <a href="delete.php?id=<{$item.id}>">Delete</a>
<{/if}>
```

## 語言變量

```php
// 在PHP中 - 載入語言檔案
xoops_loadLanguage('main', 'mymodule');

// 指派語言常數
$GLOBALS['xoopsTpl']->assign('lang_title', _MD_MYMODULE_TITLE);
$GLOBALS['xoopsTpl']->assign('lang_submit', _SUBMIT);
```

```smarty
{* 在範本中 *}
<h1><{$lang_title}></h1>
<button type="submit"><{$lang_submit}></button>
```

或直接使用常數：

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## 調試變量

要查看所有可用的變量：

```smarty
{* 顯示調試控制台 *}
<{debug}>

{* 列印特定變量 *}
<pre><{$myvar|@print_r}></pre>

{* 輸出變量 *}
<pre><{$myvar|@var_export}></pre>
```

---

#smarty #templates #variables #xoops #reference
