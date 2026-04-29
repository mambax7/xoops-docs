---
title：“XMF请求”
description：“使用XMF\Request类确保HTTP请求处理和输入验证”
---

`XMF\Request`类通过内置的-in清理和类型转换提供对HTTP请求变量的受控访问。默认情况下，它可以防止潜在有害的注入，同时使输入符合指定类型。

## 概述

请求处理是 Web 开发中最安全的-critical 方面之一。 XMF请求类：

- 自动清理输入以防止 XSS 攻击
- 为常见数据类型提供类型-safe访问器
- 支持多个请求源（GET、POST、COOKIE等）
- 提供一致的默认值处理

## 基本用法

```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```

## 请求方法

### getMethod()

返回当前请求的HTTP请求方法。

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

大多数其他 `get*()` 方法调用的核心方法。从请求数据中获取并返回命名变量。

**参数：**
- `$name` - 要获取的变量名称
- `$default` - 如果变量不存在则默认值
- `$hash` - 源哈希：GET、POST、FILES、COOKIE、ENV、SERVER、METHOD或REQUEST（默认）
- `$type` - 用于清理的数据类型（请参阅下面的 FilterInput 类型）
- `$mask` - 用于清洁选项的位掩码

**掩码值：**

|掩模常数|效果|
|----------------|--------|
| `MASK_NO_TRIM` |不要修剪 leading/trailing 空白 |
| `MASK_ALLOW_RAW` |跳过清理，允许原始输入 |
| `MASK_ALLOW_HTML` |允许有限的“安全”的 HTML 标记集 |

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## 类型-Specific方法

### getInt($name, $default, $hash)

返回一个整数值。只允许使用数字。

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

返回一个浮点值。只允许使用数字和句点。

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

返回一个布尔值。

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

返回仅包含字母和下划线`[A-Za-z_]`的字符串。

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

返回仅包含 `[A-Za-z0-9.-_]` 的命令字符串，强制为小写。

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name, $default, $hash, $mask)

返回一个干净的字符串，其中删除了错误的HTML代码（除非被掩码覆盖）。

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

返回一个数组，递归处理以删除XSS和错误代码。

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

返回未经清理的原始文本。谨慎使用。

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

返回经过验证的 Web URL（仅限相对、http 或 https 方案）。

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

返回经过验证的文件系统或 Web 路径。

```php
$filePath = Request::getPath('file', '');
```

### getEmail($name, $default, $hash)

返回经过验证的电子邮件地址或默认电子邮件地址。

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

返回经过验证的 IPv4 或 IPv6 地址。

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

返回 HTTP 请求标头值。

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## 实用方法

### hasVar($name, $hash)

检查指定的哈希中是否存在变量。

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

### setVar($name, $value, $hash, $overwrite)

在指定的哈希中设置一个变量。返回前一个值或 null。

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

### 获取($hash, $mask)

返回整个哈希数组的清理副本。

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### 设置（$array、$hash、$overwrite）

从数组中设置多个变量。

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## FilterInput 集成

Request 类使用 `XMF\FilterInput` 进行清理。可用的过滤器类型：|类型 |描述 |
|------|-------------|
| ALPHANUM / ALNUM |仅限字母数字 |
| ARRAY |递归清理每个元素 |
| BASE64 | Base64 编码的字符串 |
| BOOLEAN / BOOL |是真是假 |
| CMD |命令 - A-Z、0-9、下划线、破折号、句点（小写）|
| EMAIL |有效的电子邮件地址 |
| FLOAT / DOUBLE |浮点数|
| INTEGER / INT |整数值 |
|知识产权|有效IP地址|
| PATH |文件系统或 Web 路径 |
| STRING |通用字符串（默认）|
| USERNAME |用户名格式 |
| WEBURL |网页URL |
| WORD |仅字母 A-Z 和下划线 |

## 实际例子

### 表单处理

```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // Validate form submission
    $title = Request::getString('title', '');
    $content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
    $categoryId = Request::getInt('category_id', 0);
    $tags = Request::getArray('tags', []);
    $published = Request::getBool('published', false);

    if (empty($title)) {
        $errors[] = 'Title is required';
    }

    if ($categoryId <= 0) {
        $errors[] = 'Please select a category';
    }
}
```

### AJAX 处理程序

```php
use Xmf\Request;

// Verify AJAX request
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // Handle delete
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // Handle update
            break;
    }
}
```

### 分页

```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// Validate ranges
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```

### 搜索表格

```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// Build search criteria
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```

## 安全最佳实践

1. **始终使用 type-specific 方法** - 对 ID 使用 `getInt()`，对电子邮件等使用 `getEmail()`。

2. **提供合理的默认值** - 永远不要假设输入存在

3. **清理后验证** - 清理删除不良数据，验证确保数据正确

4. **使用适当的哈希** - 为表单数据指定 POST，为查询参数指定 GET

5. **避免原始输入** - 仅在绝对必要时使用 `getText()` 或 `MASK_ALLOW_RAW`

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## 另请参阅

- 获取-Started-with-XMF - 基本XMF概念
- XMF-Module-Helper - 模区块助手类
- ../XMF-Framework - 框架概述

---

#xmf#请求#security#input-validation#清理