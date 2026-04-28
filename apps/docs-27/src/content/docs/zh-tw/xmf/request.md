---
title: "XMF 請求"
description: '使用 Xmf\Request 類別進行安全的 HTTP 請求處理和輸入驗證'
---

`Xmf\Request` 類別透過內建的清理和型別轉換功能提供對 HTTP 請求變數的受控存取。它預設會防止潛在有害的注射，同時將輸入符合指定的型別。

## 概述

請求處理是網頁開發中最具安全關鍵性的方面之一。XMF Request 類別：

- 自動清理輸入以防止 XSS 攻擊
- 為常見資料型別提供型別安全存取器
- 支援多個請求來源 (GET、POST、COOKIE 等)
- 提供一致的預設值處理

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

## 請求方法

### getMethod()

傳回目前請求的 HTTP 請求方法。

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

大多數其他 `get*()` 方法呼叫的核心方法。從請求資料擷取並傳回已命名的變數。

**參數：**
- `$name` - 要擷取的變數名稱
- `$default` - 如果變數不存在的預設值
- `$hash` - 來源雜湊：GET、POST、FILES、COOKIE、ENV、SERVER、METHOD 或 REQUEST (預設)
- `$type` - 用於清理的資料型別 (請參閱下方的 FilterInput 型別)
- `$mask` - 用於清理選項的位元遮罩

**遮罩值：**

| 遮罩常數 | 效果 |
|---------------|--------|
| `MASK_NO_TRIM` | 不修剪前置/尾部空白 |
| `MASK_ALLOW_RAW` | 跳過清理、允許原始輸入 |
| `MASK_ALLOW_HTML` | 允許限制的「安全」HTML 標記集 |

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## 型別特定方法

### getInt($name, $default, $hash)

傳回整數值。只允許數字。

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

傳回浮點數值。只允許數字和句號。

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

傳回布林值。

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

傳回只有字母和底線 `[A-Za-z_]` 的字串。

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

傳回只有 `[A-Za-z0-9.-_]` 的命令字串，強制為小寫。

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name, $default, $hash, $mask)

傳回清理過的字串，並移除不良 HTML 程式碼 (除非被遮罩覆蓋)。

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

傳回陣列，以遞迴方式處理以移除 XSS 和不良程式碼。

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

傳回未清理的原始文字。謹慎使用。

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

傳回已驗證的網頁 URL (僅相對、http 或 https 配置)。

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

傳回已驗證的檔案系統或網頁路徑。

```php
$filePath = Request::getPath('file', '');
```

### getEmail($name, $default, $hash)

傳回已驗證的電子郵件位址或預設值。

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

傳回已驗證的 IPv4 或 IPv6 位址。

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

傳回 HTTP 請求標頭值。

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## 公用程式方法

### hasVar($name, $hash)

檢查變數是否存在於指定的雜湊中。

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

### setVar($name, $value, $hash, $overwrite)

在指定的雜湊中設定變數。傳回先前的值或 null。

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

### get($hash, $mask)

傳回整個雜湊陣列的清理副本。

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### set($array, $hash, $overwrite)

從陣列設定多個變數。

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## FilterInput 整合

Request 類別使用 `Xmf\FilterInput` 進行清理。可用的篩選型別：

| 型別 | 說明 |
|------|-------------|
| ALPHANUM / ALNUM | 僅英數字符 |
| ARRAY | 遞迴清理每個元素 |
| BASE64 | Base64 編碼字串 |
| BOOLEAN / BOOL | 真或假 |
| CMD | 命令 - A-Z、0-9、底線、破折號、句號 (小寫) |
| EMAIL | 有效的電子郵件位址 |
| FLOAT / DOUBLE | 浮點數 |
| INTEGER / INT | 整數值 |
| IP | 有效的 IP 位址 |
| PATH | 檔案系統或網頁路徑 |
| STRING | 一般字串 (預設) |
| USERNAME | 使用者名稱格式 |
| WEBURL | 網頁 URL |
| WORD | 僅字母 A-Z 和底線 |

## 實務範例

### 表單處理

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

### AJAX 處理常式

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

### 分頁

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

### 搜尋表單

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

## 安全最佳實踐

1. **始終使用型別特定方法** - 針對 ID 使用 `getInt()`、針對電子郵件使用 `getEmail()` 等。

2. **提供合理的預設值** - 永遠不要假設輸入存在

3. **在清理後驗證** - 清理移除不良資料、驗證確保正確資料

4. **使用適當的雜湊** - 為表單資料指定 POST、為查詢參數指定 GET

5. **避免原始輸入** - 僅在絕對必要時使用 `getText()` 或 `MASK_ALLOW_RAW`

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## 相關資訊

- Getting-Started-with-XMF - XMF 基本概念
- XMF-Module-Helper - 模組協助者類別
- ../XMF-Framework - 框架概述

---

#xmf #request #security #input-validation #sanitization
