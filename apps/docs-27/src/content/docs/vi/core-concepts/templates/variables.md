---
title: "Biến mẫu"
description: "Các biến Smarty có sẵn trong XOOPS templates"
---
XOOPS tự động cung cấp nhiều biến cho Smarty templates. Tài liệu tham khảo này ghi lại các biến có sẵn để phát triển mẫu chủ đề và mô-đun.

## Tài liệu liên quan

- Smarty-Cơ bản - Cơ bản về Smarty trong XOOPS
- Phát triển chủ đề - Tạo XOOPS themes
- Smarty-4-Migration - Nâng cấp từ Smarty 3 lên 4

## Biến chủ đề toàn cầu

Các biến này có sẵn trong chủ đề templates (`theme.tpl`):

### Thông tin trang web

| Biến | Mô tả | Ví dụ |
|----------|-------------|----------|
| `$xoops_sitename` | Tên trang web từ sở thích | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Tiêu đề trang hiện tại | `"Welcome"` |
| `$xoops_slogan` | Khẩu hiệu của trang web | `"Just Use It!"` |
| `$xoops_url` | XOOPS URL đầy đủ | `"https://example.com"` |
| `$xoops_langcode` | Mã ngôn ngữ | `"en"` |
| `$xoops_charset` | Bộ ký tự | `"UTF-8"` |

### Thẻ Meta

| Biến | Mô tả |
|----------|-------------|
| `$xoops_meta_keywords` | Từ khóa meta |
| `$xoops_meta_description` | Mô tả meta |
| `$xoops_meta_robots` | Thẻ meta robot |
| `$xoops_meta_rating` | Đánh giá nội dung |
| `$xoops_meta_author` | Thẻ meta tác giả |
| `$xoops_meta_copyright` | Thông báo bản quyền |

### Thông tin chủ đề

| Biến | Mô tả |
|----------|-------------|
| `$xoops_theme` | Tên chủ đề hiện tại |
| `$xoops_imageurl` | Thư mục hình ảnh chủ đề URL |
| `$xoops_themecss` | Chủ đề chính Tệp CSS URL |
| `$xoops_icons32_url` | Biểu tượng 32x32 URL |
| `$xoops_icons16_url` | Biểu tượng 16x16 URL |

### Nội dung trang

| Biến | Mô tả |
|----------|-------------|
| `$xoops_contents` | Nội dung trang chính |
| `$xoops_module_header` | Nội dung đầu theo mô-đun cụ thể |
| `$xoops_footer` | Nội dung chân trang |
| `$xoops_js` | JavaScript đến include |

### Điều hướng và Menu

| Biến | Mô tả |
|----------|-------------|
| `$xoops_mainmenu` | Menu điều hướng chính |
| `$xoops_usermenu` | Trình đơn người dùng |

### Biến khối

| Biến | Mô tả |
|----------|-------------|
| `$xoops_lblocks` | Mảng khối bên trái |
| `$xoops_rblocks` | Mảng khối bên phải |
| `$xoops_cblocks` | Mảng khối trung tâm |
| `$xoops_showlblock` | Hiển thị các khối bên trái (boolean) |
| `$xoops_showrblock` | Hiển thị các khối bên phải (boolean) |
| `$xoops_showcblock` | Hiển thị khối trung tâm (boolean) |

## Biến người dùng

Khi người dùng đăng nhập:

| Biến | Mô tả |
|----------|-------------|
| `$xoops_isuser` | Người dùng đã đăng nhập (boolean) |
| `$xoops_isadmin` | Người dùng là admin (boolean) |
| `$xoops_userid` | ID người dùng |
| `$xoops_uname` | Tên người dùng |
| `$xoops_isowner` | Người dùng sở hữu nội dung hiện tại (boolean) |

### Truy cập thuộc tính đối tượng người dùng

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## Biến mô-đun

Trong mô-đun templates:

| Biến | Mô tả |
|----------|-------------|
| `$xoops_dirname` | Tên thư mục mô-đun |
| `$xoops_modulename` | Tên hiển thị mô-đun |
| `$mod_url` | Mô-đun URL (khi được chỉ định) |

### Mẫu mẫu mô-đun chung

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

## Chặn biếnMỗi khối trong `$xoops_lblocks`, `$xoops_rblocks` và `$xoops_cblocks` có:

| Bất động sản | Mô tả |
|----------|-------------|
| `$block.id` | Chặn ID |
| `$block.title` | Chặn tiêu đề |
| `$block.content` | Chặn nội dung HTML |
| `$block.template` | Chặn tên mẫu |
| `$block.module` | Tên mô-đun |
| `$block.weight` | Khối lượng/đơn hàng |

### Ví dụ về hiển thị khối

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

## Biến dạng

Khi sử dụng XoopsForm classes:

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

## Biến phân trang

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

## Gán biến tùy chỉnh

### Giá trị đơn giản

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

### Mảng

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

### Đối tượng

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

### Mảng lồng nhau

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

## Biến tích hợp Smarty

### $smarty.now

Dấu thời gian hiện tại:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.const

Truy cập hằng số PHP:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get, $smarty.post, $smarty.request

Truy cập các biến yêu cầu (sử dụng thận trọng):

```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.máy chủ

Biến máy chủ:

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

Thông tin vòng lặp:

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

## Biến trợ giúp XMF

Khi sử dụng XMF, có sẵn các trợ giúp bổ sung:

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

## URL hình ảnh và nội dung

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

## Hiển thị có điều kiện dựa trên người dùng

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

## Biến ngôn ngữ

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

Hoặc sử dụng hằng số trực tiếp:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## Gỡ lỗi các biến

Để xem tất cả các biến có sẵn:

```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```

---

#thông minh #templates #biến #xoops #reference