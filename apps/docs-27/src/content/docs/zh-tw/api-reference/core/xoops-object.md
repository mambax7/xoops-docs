---
title: "XoopsObject 類別"
description: "XOOPS 系統中所有資料物件的基礎類別，提供屬性管理、驗證和序列化"
---

`XoopsObject` 類別是 XOOPS 系統中所有資料物件的基本基礎類別。它為管理物件屬性、驗證、變更追蹤和序列化提供標準化介面。

## 類別概述

```php
namespace Xoops\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```

## 類別階層

```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [Custom Module Objects]
```

## 屬性

| 屬性 | 型別 | 可見性 | 描述 |
|----------|------|------------|-------------|
| `$vars` | array | protected | 儲存變數定義和值 |
| `$cleanVars` | array | protected | 儲存用於資料庫操作的消毒值 |
| `$isNew` | bool | protected | 指示物件是否為新建（尚未在資料庫中） |
| `$errors` | array | protected | 儲存驗證和錯誤訊息 |

## 建構函式

```php
public function __construct()
```

建立新 XoopsObject 實例。預設情況下，物件會被標記為新建。

**範例：**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```

## 核心方法

### initVar

初始化物件的變數定義。

```php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$key` | string | 變數名稱 |
| `$dataType` | int | 資料型別常數（請參閱資料型別） |
| `$value` | mixed | 預設值 |
| `$required` | bool | 欄位是否為必需的 |
| `$maxlength` | int | 字串型別的最大長度 |
| `$options` | string | 其他選項 |

**資料型別：**

| 常數 | 值 | 描述 |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | 文字輸入框 |
| `XOBJ_DTYPE_TXTAREA` | 2 | 文字區域內容 |
| `XOBJ_DTYPE_INT` | 3 | 整數值 |
| `XOBJ_DTYPE_URL` | 4 | URL 字串 |
| `XOBJ_DTYPE_EMAIL` | 5 | 電子郵件地址 |
| `XOBJ_DTYPE_ARRAY` | 6 | 序列化陣列 |
| `XOBJ_DTYPE_OTHER` | 7 | 自訂型別 |
| `XOBJ_DTYPE_SOURCE` | 8 | 原始程式碼 |
| `XOBJ_DTYPE_STIME` | 9 | 短時間格式 |
| `XOBJ_DTYPE_MTIME` | 10 | 中等時間格式 |
| `XOBJ_DTYPE_LTIME` | 11 | 長時間格式 |
| `XOBJ_DTYPE_FLOAT` | 12 | 浮點數 |
| `XOBJ_DTYPE_DECIMAL` | 13 | 十進制數 |
| `XOBJ_DTYPE_ENUM` | 14 | 列舉 |

**範例：**
```php
class MyObject extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('email', XOBJ_DTYPE_EMAIL, '', true, 100);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, true);
    }
}
```

---

### setVar

設定變數的值。

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$key` | string | 變數名稱 |
| `$value` | mixed | 要設定的值 |
| `$notGpc` | bool | 如果為 true，值不是來自 GET/POST/COOKIE |

**傳回值：** `bool` - 成功時為 true，否則為 false

**範例：**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

### getVar

使用可選格式檢索變數的值。

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$key` | string | 變數名稱 |
| `$format` | string | 輸出格式 |

**格式選項：**

| 格式 | 描述 |
|--------|-------------|
| `'s'` | Show - HTML 實體在顯示時逃脫 |
| `'e'` | Edit - 用於表單輸入值 |
| `'p'` | Preview - 類似於 show |
| `'f'` | Form data - 原始用於表單處理 |
| `'n'` | None - 原始值，無格式 |

**傳回值：** `mixed` - 格式化的值

**範例：**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (for input value)
echo $object->getVar('title', 'n'); // "Hello <World>" (raw)

// For array data types
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Returns array
```

---

### setVars

一次從陣列設定多個變數。

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$values` | array | 鍵 => 值配對的關聯陣列 |
| `$notGpc` | bool | 如果為 true，值不是來自 GET/POST/COOKIE |

**範例：**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// From database (not user input)
$object->setVars($row, true);
```

---

### getValues

檢索所有變數值。

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$keys` | array | 要檢索的特定鍵值（null 表示全部） |
| `$format` | string | 輸出格式 |
| `$maxDepth` | int | 嵌套物件的最大深度 |

**傳回值：** `array` - 值的關聯陣列

**範例：**
```php
$object = new MyObject();

// Get all values
$allValues = $object->getValues();

// Get specific values
$subset = $object->getValues(['title', 'status']);

// Get raw values for database
$rawValues = $object->getValues(null, 'n');
```

---

### assignVar

直接指派值而不進行驗證（請謹慎使用）。

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$key` | string | 變數名稱 |
| `$value` | mixed | 要指派的值 |

**範例：**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

為資料庫操作消毒所有變數。

```php
public function cleanVars(): bool
```

**傳回值：** `bool` - 所有變數有效時為 true

**範例：**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Variables are sanitized and ready for database
    $cleanData = $object->cleanVars;
} else {
    // Validation errors occurred
    $errors = $object->getErrors();
}
```

---

### isNew

檢查或設定物件是否為新建。

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**範例：**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## 錯誤處理方法

### setErrors

添加錯誤訊息。

```php
public function setErrors(string|array $error): void
```

**範例：**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### getErrors

檢索所有錯誤訊息。

```php
public function getErrors(): array
```

**範例：**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

傳回格式化為 HTML 的錯誤。

```php
public function getHtmlErrors(): string
```

**範例：**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## 公用程式方法

### toArray

將物件轉換為陣列。

```php
public function toArray(): array
```

**範例：**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

傳回變數定義。

```php
public function getVars(): array
```

**範例：**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## 完整使用範例

```php
<?php
/**
 * Custom Article Object
 */
class Article extends XoopsObject
{
    /**
     * Constructor - Initialize all variables
     */
    public function __construct()
    {
        parent::__construct();

        // Primary key
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Required fields
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Optional fields
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Timestamps
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Status flags
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Metadata as array
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Get formatted creation date
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Check if article is published
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Increment view counter
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Custom validation
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Title validation
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // Author validation
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// Usage
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // Save to database via handler
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```

## 最佳實踐

1. **始終初始化變數**：在建構函式中使用 `initVar()` 定義所有變數

2. **使用適當的資料型別**：為驗證選擇正確的 `XOBJ_DTYPE_*` 常數

3. **小心處理使用者輸入**：對使用者輸入使用帶 `$notGpc = false` 的 `setVar()`

4. **在保存前驗證**：在資料庫操作前始終呼叫 `cleanVars()`

5. **使用格式參數**：在 `getVar()` 中為內容使用適當的格式

6. **為自訂邏輯擴充**：在子類別中添加網域特定的方法

## 相關文件

- XoopsObjectHandler - 物件持久化的處理程式模式
- ../Database/Criteria - 使用 Criteria 進行查詢構建
- ../Database/XoopsDatabase - 資料庫操作

---

*另請參閱：[XOOPS 原始程式碼](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
