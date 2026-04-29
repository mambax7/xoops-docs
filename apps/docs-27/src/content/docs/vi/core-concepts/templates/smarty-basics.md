---
title: "Thông tin cơ bản về Smarty"
description: "Các nguyên tắc cơ bản của tạo khuôn Smarty trong XOOPS"
---
<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>

:::note[Phiên bản Smarty của XOOPS Release]
| Phiên bản XOOPS | Phiên bản Smarty | Sự khác biệt chính |
|---------------|----------------|-----------------|
| 2.5.11 | Smarty 3.x | Cho phép chặn `{php}` (nhưng không được khuyến khích) |
| 2.7.0+ | Smarty 3.x/4.x | Chuẩn bị cho khả năng tương thích Smarty 4 |
| 4.0 | Smarty 4.x | Loại bỏ khối `{php}`, cú pháp chặt chẽ hơn |

Xem Smarty-4-Migration để biết hướng dẫn di chuyển.
:::

Smarty là công cụ tạo mẫu cho PHP cho phép các nhà phát triển tách bản trình bày (HTML/CSS) khỏi logic ứng dụng. XOOPS sử dụng Smarty cho tất cả các nhu cầu tạo khuôn của nó, cho phép tách biệt rõ ràng giữa mã PHP và đầu ra HTML.

## Tài liệu liên quan

- Phát triển chủ đề - Tạo XOOPS themes
- Mẫu-Biến - Các biến có sẵn trong templates
- Smarty-4-Migration - Nâng cấp từ Smarty 3 lên 4

## Smarty là gì?

Smarty cung cấp:

- **Tách biệt mối quan tâm**: Giữ logic HTML trong templates, PHP logic trong classes
- **Kế thừa mẫu**: Xây dựng bố cục phức tạp từ các khối đơn giản
- **Bộ nhớ đệm**: Cải thiện hiệu suất với templates đã biên dịch
- **Công cụ sửa đổi**: Chuyển đổi đầu ra bằng các chức năng tích hợp hoặc tùy chỉnh
- **Bảo mật**: Kiểm soát những chức năng PHP mà templates có thể truy cập

## Cấu hình XOOPS Smarty

XOOPS định cấu hình Smarty với các dấu phân cách tùy chỉnh:

```
Default Smarty: { and }
XOOPS Smarty:   <{ and }>
```

Điều này ngăn xung đột với mã JavaScript trong templates.

## Cú pháp cơ bản

### Biến

Các biến được truyền từ PHP đến templates:

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

### Truy cập mảng

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

### Thuộc tính đối tượng

```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* Template *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```

## Bình luận

Nhận xét trong Smarty không được hiển thị thành HTML:

```smarty
{* This is a comment - it will not appear in the HTML output *}

{*
   Multi-line comments
   are also supported
*}
```

## Cấu trúc điều khiển

### Câu lệnh If/Else

```smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```

### Toán tử so sánh

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

### Kiểm tra sản phẩm trống/Isset

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

### Vòng lặp Foreach

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

### Đối với vòng lặp

```smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```

### Vòng lặp while

```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```

## Công cụ sửa đổi biến

Công cụ sửa đổi biến đổi đầu ra biến đổi:

### Công cụ sửa đổi chuỗi

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

### Công cụ sửa đổi số

```smarty
{* Number formatting *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* Date formatting *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```

### Công cụ sửa đổi mảng

```smarty
{* Count items *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### Công cụ sửa đổi chuỗi

```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```

## Bao gồm và chèn

### Bao gồm các mẫu khác

```smarty
{* Include a template file *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* Include with assigned variables *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```

### Chèn nội dung động

```smarty
{* Insert calls a PHP function for dynamic content *}
<{insert name="getBanner"}>
```

## Gán biến trong mẫu

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

## Biến Smarty tích hợp

### Biến $smarty

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

## Khối chữ

Đối với JavaScript có dấu ngoặc nhọn:

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

Hoặc sử dụng các biến Smarty trong JavaScript:

```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```

## Chức năng tùy chỉnhXOOPS cung cấp các chức năng Smarty tùy chỉnh:

```smarty
{* XOOPS Image URL *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* XOOPS Module URL *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* App URL *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```

## Các phương pháp hay nhất

### Luôn thoát đầu ra

```smarty
{* For user-generated content, always escape *}
<p><{$user_comment|escape}></p>

{* For HTML content, use appropriate method *}
<div><{$content}></div> {* Only if content is pre-sanitized *}
```

### Sử dụng tên biến có ý nghĩa

```php
// Good
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// Avoid
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```

### Giữ logic ở mức tối thiểu

Mẫu nên tập trung vào cách trình bày. Di chuyển logic phức tạp sang PHP:

```smarty
{* Avoid complex logic in templates *}
{* Bad *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* Good - calculate in PHP and pass a simple flag *}
<{if $can_edit}>
```

### Sử dụng Kế thừa mẫu

Để có bố cục nhất quán, hãy sử dụng tính kế thừa mẫu (xem Phát triển chủ đề).

## Mẫu gỡ lỗi

### Bảng điều khiển gỡ lỗi

```smarty
{* Show all assigned variables *}
<{debug}>
```

### Đầu ra tạm thời

```smarty
{* Debug specific variable *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```

## Các mẫu mẫu XOOPS phổ biến

### Cấu trúc mẫu mô-đun

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

### Phân trang

```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

### Hiển thị biểu mẫu

```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```

---

#thông minh #templates #xoops #frontend #template-engine