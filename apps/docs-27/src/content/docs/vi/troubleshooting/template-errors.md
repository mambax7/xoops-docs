---
title: "Lỗi mẫu"
description: "Gỡ lỗi và sửa lỗi mẫu Smarty trong XOOPS"
---
# Lỗi mẫu (Gỡ lỗi Smarty)

> Các sự cố thường gặp về mẫu Smarty và kỹ thuật gỡ lỗi cho XOOPS themes và modules.

---

## Sơ đồ chẩn đoán

```mermaid
flowchart TD
    A[Template Error] --> B{Error Visible?}
    B -->|No| C[Enable Template Debug]
    B -->|Yes| D[Read Error Message]

    C --> E{Type of Error?}
    E -->|Syntax| F[Check Template Syntax]
    E -->|Variable| G[Check Variable Assignment]
    E -->|Plugin| H[Check Smarty Plugin]

    D --> I{Parse Error?}
    I -->|Yes| J[Check Braces Matching]
    I -->|No| K{Undefined Variable?}

    K -->|Yes| L[Check Variable in PHP]
    K -->|No| M{File Not Found?}

    M -->|Yes| N[Check Template Path]
    M -->|No| O[Clear Cache]

    F --> P[Fix Syntax]
    G --> Q[Verify PHP Code]
    H --> R[Install Plugin]
    J --> P
    L --> Q
    N --> S[Verify paths]
    O --> T{Error Resolved?}
    P --> T
    Q --> T
    R --> T
    S --> T

    T -->|No| U[Enable Debug Mode]
    T -->|Yes| V[Problem Solved]
    U --> D
```

---

## Các lỗi mẫu Smarty thường gặp

```mermaid
pie title Template Error Types
    "Syntax Errors" : 25
    "Undefined Variables" : 25
    "Missing Plugins" : 15
    "Cache Issues" : 20
    "Encoding Problems" : 10
    "Path Issues" : 5
```

---

## 1. Lỗi cú pháp

**Triệu chứng:**
- Thông báo "Lỗi cú pháp Smarty"
- Mẫu sẽ không được biên dịch
- Trang trống không có đầu ra

**Thông báo lỗi:**
```
Syntax error: unrecognized tag 'myfunction'
Unexpected "}" near end of template
```

### Các vấn đề cú pháp thường gặp

**Thiếu thẻ đóng:**
```smarty
{* WRONG *}
{if $user}
User: {$user.name}
{* Missing {/if} *}

{* CORRECT *}
{if $user}
User: {$user.name}
{/if}
```

**Cú pháp biến sai:**
```smarty
{* WRONG *}
{$user->name}          {* Use . not -> *}
{$array[key]}          {* Use quoted keys *}
{$func()}              {* Can't call functions directly *}

{* CORRECT *}
{$user.name}
{$array.key}
{$array['key']}
{$user|@function}      {* Use modifiers instead *}
```

**Trích dẫn không khớp:**
```smarty
{* WRONG *}
{if $name == 'John}     {* Mismatched quotes *}
{assign var="user' value="John"}

{* CORRECT *}
{if $name == 'John'}
{assign var="user" value="John"}
```

**Giải pháp:**

```smarty
{* Always balance braces *}
{if condition}
  ...
{elseif condition}
  ...
{else}
  ...
{/if}

{* Verify tag format *}
{foreach $items as $item}
  ...
{/foreach}

{* Check all variables are defined *}
{if isset($variable)}
  {$variable}
{/if}
```

---

## 2. Lỗi biến không xác định

**Triệu chứng:**
- Cảnh báo "Biến không xác định"
- Biến hiển thị trống
- Thông báo PHP trong nhật ký lỗi

**Thông báo lỗi:**
```
Notice: Undefined variable: myvar
Smarty notice: variable "$user" not available
```

**Tập lệnh gỡ lỗi:**

```php
<?php
// In your template file or PHP code
// Create modules/yourmodule/debug_template.php

require_once '../../mainfile.php';

// Get template engine
$tpl = new XoopsTpl();

// Check what variables are assigned
echo "<h1>Template Variables</h1>";
echo "<pre>";
print_r($tpl->get_template_vars());
echo "</pre>";

// Or dump Smarty object
echo "<h1>Smarty Debug</h1>";
echo "<pre>";
$tpl->debug_vars();
echo "</pre>";
?>
```

**Sửa lỗi trong PHP:**

```php
<?php
// Ensure variables are assigned before rendering
$xoopsTpl = new XoopsTpl();

// WRONG - variable not assigned
$xoopsTpl->display('file:templates/page.html');

// CORRECT - assign variables first
$user = [
    'name' => 'John',
    'email' => 'john@example.com'
];
$xoopsTpl->assign('user', $user);
$xoopsTpl->display('file:templates/page.html');
?>
```

**Sửa trong Mẫu:**

```smarty
{* Check if variable exists before using *}
{if isset($user)}
    <p>User: {$user.name}</p>
{else}
    <p>No user data</p>
{/if}

{* Use default values *}
<p>Name: {$user.name|default:"No name"}</p>

{* Check array key exists *}
{if isset($array.key)}
    {$array.key}
{/if}
```

---

## 3. Công cụ sửa đổi bị thiếu hoặc không chính xác

**Triệu chứng:**
- Dữ liệu không được định dạng đúng
- Văn bản hiển thị dưới dạng HTML
- Trường hợp/mã hóa không chính xác

**Thông báo lỗi:**
```
Warning: undefined modifier 'stripslashes'
```

**Công cụ sửa đổi phổ biến:**

```smarty
{* String operations *}
{$text|upper}                    {* Uppercase *}
{$text|lower}                    {* Lowercase *}
{$text|capitalize}               {* First letter capital *}
{$text|truncate:20:"..."}        {* Truncate to 20 chars *}
{$text|strip_tags}               {* Remove HTML tags *}

{* HTML/Formatting *}
{$html|escape}                   {* HTML escape *}
{$html|escape:'html'}
{$url|escape:'url'}              {* URL escape *}
{$text|nl2br}                    {* Newlines to <br> *}

{* Arrays *}
{$array|@count}                  {* Array count *}
{$array|@implode:', '}           {* Join array *}

{* Default values *}
{$var|default:"No value"}

{* Date formatting *}
{$date|date_format:"%Y-%m-%d"}   {* Format date *}

{* Math operations *}
{$number|math:'+':10}            {* Math operations *}
```

**Đăng ký Công cụ sửa đổi tùy chỉnh:**

```php
<?php
// Register in your module
$xoopsTpl = new XoopsTpl();
$xoopsTpl->register_modifier('mymodifier', 'my_modifier_function');

function my_modifier_function($string) {
    return strtoupper($string);
}
?>
```

---

## 4. Vấn đề về bộ đệm

**Triệu chứng:**
- Thay đổi mẫu không xuất hiện
- Nội dung cũ vẫn hiển thị
- includes cũ hoặc tài nguyên

**Giải pháp:**

```bash
# Clear Smarty cache directories
rm -rf /path/to/xoops/xoops_data/caches/smarty_cache/*
rm -rf /path/to/xoops/xoops_data/caches/smarty_compile/*

# Clear specific module cache
rm -rf /path/to/xoops/xoops_data/caches/smarty_cache/modules/*
```

**Xóa bộ nhớ đệm trong mã:**

```php
<?php
// Clear all Smarty caches
$xoopsTpl = new XoopsTpl();
$xoopsTpl->clear_cache();
$xoopsTpl->clear_compiled_tpl();

// Clear specific template cache
$xoopsTpl->clear_cache('file:templates/page.html');

// Clear all cached files
require_once XOOPS_ROOT_PATH . '/class/xoopsfile.php';
$dh = opendir(XOOPS_CACHE_PATH . '/smarty_cache');
while (($file = readdir($dh)) !== false) {
    if (is_file(XOOPS_CACHE_PATH . '/smarty_cache/' . $file)) {
        unlink(XOOPS_CACHE_PATH . '/smarty_cache/' . $file);
    }
}
closedir($dh);
?>
```

---

## 5. Lỗi không tìm thấy plugin

**Triệu chứng:**
- "Công cụ sửa đổi không xác định" hoặc "Plugin không xác định"
- Chức năng tùy chỉnh không hoạt động
- Lỗi biên dịch với plugin

**Thông báo lỗi:**
```
Fatal error: Call to undefined function smarty_modifier_custom
Unknown modifier 'myfunction'
```

**Tạo Plugin tùy chỉnh:**

```php
<?php
// Create: modules/yourmodule/plugins/modifier.custom.php

/**
 * Smarty {$var|custom} modifier plugin
 */
function smarty_modifier_custom($string, $param = '') {
    // Your custom code
    return strtoupper($string) . $param;
}
?>
```

**Đăng ký plugin:**

```php
<?php
// In your module's init code
$xoopsTpl = new XoopsTpl();

// Add plugin directory to Smarty
$xoopsTpl->addPluginDir(
    XOOPS_ROOT_PATH . '/modules/yourmodule/plugins'
);

// Or manually register
$xoopsTpl->register_modifier(
    'custom',
    'smarty_modifier_custom'
);
?>
```

**Các loại plugin:**

```php
<?php
// Modifier plugin: modifier.name.php
function smarty_modifier_name($string) {
    return $string;
}

// Block plugin: block.name.php
function smarty_block_name($params, $content, &$smarty, &$repeat) {
    if (!isset($smarty->security_settings['IF_FUNCS'])) {
        $smarty->security_settings['IF_FUNCS'] = [];
    }
    return $content;
}

// Function plugin: function.name.php
function smarty_function_name($params, &$smarty) {
    return 'output';
}

// Filter plugin: filter.name.php
function smarty_filter_name($code, &$smarty) {
    return $code;
}
?>
```

---

## 6. Vấn đề về Bao gồm/Mở rộng Mẫu

**Triệu chứng:**
- Đã bao gồm templates không tải
- Không tìm thấy mẫu gốc
- CSS/JS không tải

**Thông báo lỗi:**
```
Template file 'file:path/to/template.html' not found
Can't find template file 'header.html'
```

**Cú pháp bao gồm đúng:**

```smarty
{* Include template *}
{include file="file:templates/header.html"}

{* Include with variables *}
{include file="file:templates/header.html" title="My Page"}

{* Template inheritance *}
{extends file="file:templates/base.html"}

{* Named blocks *}
{block name="content"}
    Page content here
{/block}

{* Static resources *}
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
<script src="{$xoops_url}/modules/{$xoops_module_dir}/js/script.js"></script>
```

**Kiểm tra đường dẫn mẫu:**

```bash
# Verify template file exists
ls -la /path/to/xoops/themes/mytheme/templates/
ls -la /path/to/xoops/modules/mymodule/templates/

# Check permissions
stat /path/to/xoops/themes/mytheme/templates/header.html
```

---

## 7. Truy cập mảng/đối tượng biến

**Triệu chứng:**
- Không thể truy cập các giá trị mảng
- Thuộc tính đối tượng không hiển thị
- Biến phức tạp thất bại

**Thông báo lỗi:**
```
Undefined variable: user.profile.name
```

**Cú pháp đúng:**

```smarty
{* Array access *}
{$array.key}                     {* Use . for keys *}
{$array['key']}
{$array.0}                       {* Numeric indexes *}
{$array.$variable_key}           {* Dynamic keys *}

{* Nested arrays *}
{$user.profile.name}
{$data.items.0.title}

{* Object properties *}
{$object.property}
{$object.method|escape}          {* Method calls *}

{* Safe access with isset *}
{if isset($array.key)}
    {$array.key}
{/if}

{* Check length *}
{if count($array) > 0}
    Items found
{/if}
```

---

## 8. Vấn đề về mã hóa ký tự

**Triệu chứng:**
- Văn bản bị cắt xén trong templates
- Ký tự đặc biệt hiển thị không chính xác
- Ký tự UTF-8 bị hỏng

**Giải pháp:**

**Mã hóa tệp mẫu:**

```smarty
{* Set charset in meta tag *}
<meta charset="UTF-8">

{* Or in HTML head *}
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

{* Proper PHP declaration *}
header('Content-Type: text/html; charset=utf-8');
```

**Mã PHP:**

```php
<?php
// Set output encoding
header('Content-Type: text/html; charset=utf-8');

// Ensure database uses UTF-8
$conn = new mysqli('localhost', 'user', 'pass', 'db');
$conn->set_charset('utf8mb4');

// Or in SQL
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

// Assign data properly
$text = mb_convert_encoding($text, 'UTF-8', 'UTF-8');
$xoopsTpl->assign('text', $text);
?>
```

---

## Cấu hình chế độ gỡ lỗi

**Bật gỡ lỗi mẫu:**

```php
<?php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// In Smarty configuration
$xoopsTpl->debugging = true;
$xoopsTpl->debug_tpl = SMARTY_DIR . 'debug.tpl';

// Or in module
$tpl = new XoopsTpl();
$tpl->debugging = true;
?>
```

**Đầu ra bảng điều khiển gỡ lỗi:**

```php
<?php
// Create modules/yourmodule/debug_smarty.php

require_once '../../mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/smarty/Smarty.class.php';

$smarty = new Smarty();
$smarty->debugging = true;

// Check compiled template
$compiled_dir = $smarty->getCompileDir();
echo "<h1>Compiled Templates</h1>";
$files = glob($compiled_dir . '/*.php');
foreach ($files as $file) {
    echo "<p>" . basename($file) . "</p>";
}

// View compiled code
echo "<h1>Compiled Code</h1>";
echo "<pre>";
$latest = max(array_map('filemtime', $files));
foreach ($files as $file) {
    if (filemtime($file) == $latest) {
        echo htmlspecialchars(file_get_contents($file));
        break;
    }
}
echo "</pre>";
?>
```

---

## Danh sách kiểm tra xác thực mẫu

```mermaid
graph TD
    A[Template Validation] --> B["1. Syntax Check"]
    A --> C["2. Variable Verification"]
    A --> D["3. Plugin Check"]
    A --> E["4. File Paths"]
    A --> F["5. Encoding"]
    A --> G["6. Cache"]

    B --> B1["✓ All braces matched"]
    B --> B2["✓ All tags closed"]
    B --> B3["✓ Proper syntax"]

    C --> C1["✓ Variables assigned"]
    C --> C2["✓ Correct property access"]
    C --> C3["✓ Default values set"]

    D --> D1["✓ Modifiers available"]
    D --> D2["✓ Plugins registered"]
    D --> D3["✓ Custom functions work"]

    E --> E1["✓ Relative paths correct"]
    E --> E2["✓ Files exist"]
    E --> E3["✓ Permissions correct"]

    F --> F1["✓ UTF-8 declared"]
    F --> F2["✓ HTML charset set"]
    F --> F3["✓ Database UTF-8"]

    G --> G1["✓ Cache cleared"]
    G --> G2["✓ Compiled fresh"]
```

---

## Biện pháp phòng ngừa & thực hành tốt nhất

1. **Bật gỡ lỗi** trong quá trình phát triển
2. **Xác thực templates** trước khi triển khai
3. **Xóa bộ nhớ cache** sau khi thay đổi
4. **Sử dụng git** để theo dõi các thay đổi của mẫu
5. **Kiểm tra trên nhiều trình duyệt** để phát hiện các vấn đề về mã hóa
6. **Phần bổ trợ tùy chỉnh tài liệu** và công cụ sửa đổi
7. **Sử dụng kế thừa mẫu** để đảm bảo tính nhất quán

---

## Tài liệu liên quan

- Hướng dẫn gỡ lỗi Smarty
- Tạo khuôn Smarty
- Kích hoạt chế độ gỡ lỗi
- Câu hỏi thường gặp về chủ đề

---#xoops #khắc phục sự cố #templates #thông minh #gỡ lỗi