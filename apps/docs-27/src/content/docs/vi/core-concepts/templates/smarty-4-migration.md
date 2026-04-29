---
title: "Di chuyển Smarty 4"
description: "Hướng dẫn nâng cấp XOOPS templates từ Smarty 3 lên Smarty 4"
---
Hướng dẫn này bao gồm các thay đổi và các bước di chuyển cần thiết khi nâng cấp từ Smarty 3 lên Smarty 4 trong XOOPS. Hiểu những khác biệt này là điều cần thiết để duy trì khả năng tương thích với các bản cài đặt XOOPS hiện đại.

## Tài liệu liên quan

- Smarty-Cơ bản - Cơ bản về Smarty trong XOOPS
- Phát triển chủ đề - Tạo XOOPS themes
- Mẫu-Biến - Các biến có sẵn trong templates

## Tổng quan về các thay đổi

Smarty 4 đã giới thiệu một số thay đổi đột phá từ Smarty 3:

1. Hành vi gán biến đã thay đổi
2. Loại bỏ hoàn toàn thẻ `{php}`
3. Bộ nhớ đệm API thay đổi
4. Cập nhật xử lý sửa đổi
5. Thay đổi chính sách bảo mật
6. Đã xóa các tính năng không dùng nữa

## Thay đổi quyền truy cập biến

### Vấn đề

Trong Smarty 2/3, các giá trị được chỉ định có thể truy cập trực tiếp:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

Trong Smarty 4, các biến được gói trong các đối tượng `Smarty_Variable`:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### Giải pháp 1: Truy cập thuộc tính Value

```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### Giải pháp 2: Chế độ tương thích

Kích hoạt chế độ tương thích trong PHP:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

Điều này cho phép truy cập biến trực tiếp như Smarty 3.

### Giải pháp 3: Kiểm tra phiên bản có điều kiện

Viết templates hoạt động ở cả hai phiên bản:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### Giải pháp 4: Hàm Wrapper

Tạo hàm trợ giúp cho các bài tập:

```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - assign normally, access via ->value in templates
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - standard assignment
        $smarty->assign($name, $value);
    }
}
```

## Xóa thẻ {php}

### Vấn đề

Smarty 3+ không hỗ trợ thẻ `{php}` vì lý do bảo mật:

```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### Giải pháp: Sử dụng Biến Smarty

```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### Giải pháp: Di chuyển Logic sang PHP

Logic phức tạp phải ở PHP, không phải templates:

```php
// In PHP - do the processing
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// Assign processed data to template
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* In template - just display *}
<h2><{$category.name}></h2>
```

### Giải pháp: Plugin tùy chỉnh

Để có chức năng có thể sử dụng lại, hãy tạo các plugin Smarty:

```php
// /class/smarty/plugins/function.getcategory.php
function smarty_function_getcategory($params, $smarty)
{
    $catId = $params['id'] ?? 0;
    $categoryHandler = xoops_getModuleHandler('category', 'mymodule');
    $category = $categoryHandler->get($catId);

    if ($category) {
        $smarty->assign($params['assign'], $category->toArray());
    }
}
```

```smarty
{* In template *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```

## Thay đổi bộ nhớ đệm

### Smarty 3 Bộ nhớ đệm

```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Smarty 4 Bộ nhớ đệm

```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### Hằng số bộ nhớ đệm

```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```

### Nocache trong Mẫu

```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## Thay đổi công cụ sửa đổi

### Công cụ sửa đổi chuỗi

Một số công cụ sửa đổi đã được đổi tên hoặc không dùng nữa:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```

### Công cụ sửa đổi mảng

Công cụ sửa đổi mảng yêu cầu tiền tố `@`:

```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### Công cụ sửa đổi tùy chỉnh

Công cụ sửa đổi tùy chỉnh phải được đăng ký:

```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```

## Thay đổi chính sách bảo mật

### Smarty 4 Bảo mật

Smarty 4 có bảo mật mặc định chặt chẽ hơn:

```php
// Configure security policy
$smarty->enableSecurity('Smarty_Security');

// Or create custom policy
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```

### Chức năng được phép

Theo mặc định, Smarty 4 hạn chế những chức năng PHP nào có thể được sử dụng:

```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

Cấu hình các chức năng được phép nếu cần:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## Cập nhật kế thừa mẫu

### Cú pháp khối

Cú pháp khối vẫn tương tự nhưng có một số thay đổi:

```smarty
{* Parent template *}
<html>
<head>
    {block name=head}
    <title>Default Title</title>
    {/block}
</head>
<body>
    {block name=content}{/block}
</body>
</html>
```

```smarty
{* Child template *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* Include parent block content *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>My Content</h1>
{/block}
```

### Nối và thêm vào trước

```smarty
{block name=head append}
    {* This is added after parent content *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* This is added before parent content *}
    <script src="early.js"></script>
{/block}
```

## Tính năng không được dùng nữa

### Đã xóa trong Smarty 4| Tính năng | Thay thế |
|----------|-------------|
| Thẻ `{php}` | Di chuyển logic sang PHP hoặc sử dụng plugin |
| `{include_php}` | Sử dụng plugin đã đăng ký |
| `$smarty.capture` | Vẫn hoạt động nhưng không được dùng nữa |
| `{strip}` có khoảng trắng | Sử dụng các công cụ thu nhỏ |

### Sử dụng các lựa chọn thay thế

```smarty
{* Instead of {php} *}
{* Move to PHP and assign result *}

{* Instead of include_php *}
<{include file="db:mytemplate.tpl"}>

{* Instead of capture (still works but consider) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```

## Danh sách kiểm tra di chuyển

### Trước khi di chuyển

1. [ ] Sao lưu tất cả templates
2. [ ] Liệt kê tất cả cách sử dụng thẻ `{php}`
3. [] Các plugin tùy chỉnh tài liệu
4. [ ] Kiểm tra chức năng hiện tại

### Trong quá trình di chuyển

1. [ ] Xóa tất cả các thẻ `{php}`
2. [ ] Cập nhật cú pháp truy cập biến
3. [ ] Kiểm tra việc sử dụng công cụ sửa đổi
4. [ ] Cập nhật cấu hình bộ nhớ đệm
5. [ ] Xem lại cài đặt bảo mật

### Sau khi di chuyển

1. [ ] Kiểm tra tất cả templates
2. [ ] Kiểm tra tất cả các biểu mẫu có hoạt động không
3. [ ] Xác minh hoạt động của bộ nhớ đệm
4. [ ] Kiểm tra với các vai trò người dùng khác nhau

## Kiểm tra tính tương thích

### Phát hiện phiên bản

```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```

### Kiểm tra phiên bản mẫu

```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```

## Viết các mẫu tương thích chéo

### Các phương pháp hay nhất

1. **Tránh hoàn toàn thẻ `{php}`** - Chúng không hoạt động trong Smarty 3+

2. **Giữ cho templates đơn giản** - Logic phức tạp thuộc về PHP

3. **Sử dụng công cụ sửa đổi tiêu chuẩn** - Tránh những công cụ sửa đổi không được dùng nữa

4. **Kiểm tra ở cả hai phiên bản** - Nếu bạn cần hỗ trợ cả hai

5. **Sử dụng plugin cho các hoạt động phức tạp** - Dễ bảo trì hơn

### Ví dụ: Mẫu tương thích chéo

```smarty
{* Works in both Smarty 3 and 4 *}
<!DOCTYPE html>
<html>
<head>
    <title><{$page_title|default:'Default Title'|escape}></title>
</head>
<body>
    <{if isset($items) && $items|@count > 0}>
        <ul>
        <{foreach $items as $item}>
            <li><{$item.name|escape}></li>
        <{/foreach}>
        </ul>
    <{else}>
        <p>No items found.</p>
    <{/if}>
</body>
</html>
```

## Các vấn đề di chuyển thường gặp

### Vấn đề: Biến trả về trống

**Sự cố**: `<{$mod_url}>` không trả về gì trong Smarty 4

**Giải pháp**: Sử dụng `<{$mod_url->value}>` hoặc bật chế độ tương thích

### Sự cố: Lỗi thẻ PHP

**Sự cố**: Mẫu đưa ra lỗi trên thẻ `{php}`

**Giải pháp**: Xóa tất cả các thẻ PHP và di chuyển logic sang các tệp PHP

### Vấn đề: Không tìm thấy công cụ sửa đổi

**Sự cố**: Công cụ sửa đổi tùy chỉnh đưa ra lỗi "công cụ sửa đổi không xác định"

**Giải pháp**: Đăng ký công cụ sửa đổi với `registerPlugin()`

### Vấn đề: Hạn chế bảo mật

**Sự cố**: Chức năng không được phép trong mẫu

**Giải pháp**: Thêm chức năng vào danh sách cho phép của chính sách bảo mật

---

#smarty #migration #nâng cấp #xoops #smarty4 #compatibility