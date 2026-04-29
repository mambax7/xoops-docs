---
title：“XOOPSObject 类”
description：“XOOPS系统中所有数据对象的基类，提供属性管理、验证和序列化”
---

`XOOPSObject`类是XOOPS系统中所有数据对象的基本基类。它提供了用于管理对象属性、验证、脏跟踪和序列化的标准化接口。

## 类概述

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

## 类层次结构

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

## 属性

|物业 |类型 |能见度|描述 |
|----------|------|------------|------------|
| `$vars` |数组|受保护 |存储变量定义和值 |
| `$cleanVars` |数组|受保护 |存储数据库操作的清理值 |
| `$isNew` |布尔 |受保护 |指示对象是否是新的（尚未在数据库中）|
| `$errors` |数组|受保护 |存储验证和错误消息 |

## 构造函数

```php
public function __construct()
```

创建一个新的 XOOPSObject 实例。默认情况下，该对象被标记为新对象。

**示例：**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```

## 核心方法

### 初始化变量

初始化对象的变量定义。

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

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$key` |字符串|变量名 |
| `$dataType` |整数 |数据类型常量（参见数据类型）|
| `$value`|混合 |默认值 |
| `$required` |布尔 |是否必填 |
| `$maxlength` |整数 |字符串类型的最大长度 |
| `$options` |字符串|附加选项 |

**数据类型：**

|恒定|价值|描述 |
|----------|---------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 |文本框输入|
| `XOBJ_DTYPE_TXTAREA` | 2 |文本区域内容 |
| `XOBJ_DTYPE_INT` | 3 |整数值 |
| `XOBJ_DTYPE_URL` | 4 | URL字符串|
| `XOBJ_DTYPE_EMAIL` | 5 |电子邮件地址 |
| `XOBJ_DTYPE_ARRAY` | 6 |序列化数组|
| `XOBJ_DTYPE_OTHER` | 7 |定制型|
| `XOBJ_DTYPE_SOURCE` | 8 |源代码 |
| `XOBJ_DTYPE_STIME` | 9 |短时间格式 |
| `XOBJ_DTYPE_MTIME` | 10 | 10中等时间格式 |
| `XOBJ_DTYPE_LTIME` | 11 | 11长时间格式|
| `XOBJ_DTYPE_FLOAT` | 12 | 12浮点数 |
| `XOBJ_DTYPE_DECIMAL` | 13 |十进制数 |
| `XOBJ_DTYPE_ENUM`| 14 | 14枚举|

**示例：**
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

### 设置变量

设置变量的值。

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$key` |字符串|变量名 |
| `$value` |混合 |要设置的值 |
| `$notGpc` |布尔 |如果为 true，则值不是来自 GET/POST/COOKIE |

**返回：** `bool` - 如果成功则为 true，否则为 false

**示例：**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

### 获取变量

使用可选格式检索变量的值。

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$key` |字符串|变量名 |
| `$format` |字符串|输出格式 |

**格式选项：**

|格式|描述 |
|--------|-------------|
| `'s'` |显示 - HTML 实体转义显示 |
| `'e'`|编辑 - 对于表单输入值 |
| `'p'` |预览 - 类似于展示 |
| `'f'` |表单数据 - 用于表单处理的原始数据 |
| `'n'` | None - 原始值，无格式 |

**返回：** `mixed` - 格式化值

**示例：**
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

### 设置变量

从数组中一次设置多个变量。

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$values` |数组|键关联数组 => 值对 |
| `$notGpc` |布尔 |如果为 true，则值不是来自 GET/POST/COOKIE |

**示例：**
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

### 获取值

检索所有变量值。

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$keys` |数组|要检索的特定键（全部为空） |
| `$format`|字符串|输出格式 |
| `$maxDepth` |整数 |嵌套对象的最大深度 |

**返回：** `array` - 值的关联数组

**示例：**
```php
$object = new MyObject();

// Get all values
$allValues = $object->getValues();

// Get specific values
$subset = $object->getValues(['title', 'status']);

// Get raw values for database
$rawValues = $object->getValues(null, 'n');
```---

### 分配变量

直接赋值，无需验证（谨慎使用）。

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$key`|字符串|变量名 |
| `$value` |混合 |要分配的值 |

**示例：**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

清理数据库操作的所有变量。

```php
public function cleanVars(): bool
```

**返回：** `bool` - 如果所有变量都有效则为 True

**示例：**
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

### 是新的

检查或设置对象是否是新的。

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**示例：**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## 错误处理方法

### 设置错误

添加错误消息。

```php
public function setErrors(string|array $error): void
```

**示例：**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### 获取错误

检索所有错误消息。

```php
public function getErrors(): array
```

**示例：**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

返回格式为 HTML 的错误。

```php
public function getHtmlErrors(): string
```

**示例：**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## 实用方法

### 到数组

将对象转换为数组。

```php
public function toArray(): array
```

**示例：**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### 获取变量

返回变量定义。

```php
public function getVars(): array
```

**示例：**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## 完整的使用示例

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

## 最佳实践

1. **始终初始化变量**：使用`initVar()`定义构造函数中的所有变量

2. **使用适当的数据类型**：选择正确的`XOBJ_DTYPE_*`常量进行验证

3. **谨慎处理用户输入**：使用 `setVar()` 和 `$notGpc = false` 进行用户输入

4. **保存前验证**：在数据库操作之前始终调用`cleanVars()`

5. **使用格式参数**：针对上下文使用 `getVar()` 中的适当格式

6. **扩展自定义逻辑**：在子类中添加域-specific方法

## 相关文档

- XOOPSObjectHandler - 对象持久化的处理程序模式
- ../Database/Criteria - 使用条件查询构建
- ../Database/XOOPSDatabase - 数据库操作

---

*另见：[XOOPS Source Code](https://github.com/XOOPS/XOOPSCore27/blob/master/htdocs/class/XOOPSobject.php)*