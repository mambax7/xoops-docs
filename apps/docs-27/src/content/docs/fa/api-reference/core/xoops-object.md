---
title: "کلاس XoopsObject"
description: "کلاس پایه برای تمام اشیاء داده در سیستم XOOPS که مدیریت، اعتبار سنجی و سریال سازی را ارائه می دهد"
---
کلاس `XoopsObject` کلاس پایه اساسی برای تمام اشیاء داده در سیستم XOOPS است. این یک رابط استاندارد برای مدیریت ویژگی‌های شی، اعتبارسنجی، ردیابی کثیف و سریال‌سازی ارائه می‌کند.

## نمای کلی کلاس

```php
namespace XOOPS\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```

## سلسله مراتب کلاس

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

## خواص

| اموال | نوع | دید | توضیحات |
|----------|------|------------|-------------|
| `$vars` | آرایه | محافظت شده | تعاریف و مقادیر متغیر را ذخیره می کند |
| `$cleanVars` | آرایه | محافظت شده | مقادیر پاکسازی شده را برای عملیات پایگاه داده ذخیره می کند |
| `$isNew` | bool | محافظت شده | نشان می دهد که آیا شی جدید است (هنوز در پایگاه داده نیست) |
| `$errors` | آرایه | محافظت شده | اعتبارسنجی و پیام های خطا را ذخیره می کند |

## سازنده

```php
public function __construct()
```

یک نمونه XoopsObject جدید ایجاد می کند. شی به طور پیش فرض به عنوان جدید علامت گذاری شده است.

**مثال:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```

## روش های اصلی

### initVar

تعریف متغیری را برای شیء راه اندازی می کند.

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

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$key` | رشته | نام متغیر |
| `$dataType` | int | نوع داده ثابت (به انواع داده مراجعه کنید) |
| `$value` | مخلوط | مقدار پیش فرض |
| `$required` | bool | آیا فیلد مورد نیاز است |
| `$maxlength` | int | حداکثر طول برای انواع رشته |
| `$options` | رشته | گزینه های اضافی |

**انواع داده:**

| ثابت | ارزش | توضیحات |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | ورودی جعبه متن |
| `XOBJ_DTYPE_TXTAREA` | 2 | محتوای Textarea |
| `XOBJ_DTYPE_INT` | 3 | مقدار صحیح |
| `XOBJ_DTYPE_URL` | 4 | رشته URL |
| `XOBJ_DTYPE_EMAIL` | 5 | آدرس ایمیل |
| `XOBJ_DTYPE_ARRAY` | 6 | آرایه سریالی |
| `XOBJ_DTYPE_OTHER` | 7 | نوع سفارشی |
| `XOBJ_DTYPE_SOURCE` | 8 | کد منبع |
| `XOBJ_DTYPE_STIME` | 9 | فرمت زمان کوتاه |
| `XOBJ_DTYPE_MTIME` | 10 | فرمت زمان متوسط ​​|
| `XOBJ_DTYPE_LTIME` | 11 | فرمت طولانی مدت |
| `XOBJ_DTYPE_FLOAT` | 12 | نقطه شناور |
| `XOBJ_DTYPE_DECIMAL` | 13 | عدد اعشاری |
| `XOBJ_DTYPE_ENUM` | 14 | شمارش |

**مثال:**
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

مقدار یک متغیر را تعیین می کند.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$key` | رشته | نام متغیر |
| `$value` | مخلوط | مقدار برای تنظیم |
| `$notGpc` | bool | اگر درست باشد، مقدار از GET/POST/COOKIE نیست |

**برگرداندن:** `bool` - درست در صورت موفقیت آمیز، نادرست در غیر این صورت

**مثال:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

### getVar

مقدار یک متغیر را با قالب بندی اختیاری بازیابی می کند.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$key` | رشته | نام متغیر |
| `$format` | رشته | فرمت خروجی |

**گزینه های قالب:**

| قالب | توضیحات |
|--------|------------|
| `'s'` | نمایش - موجودیت های HTML برای نمایش فرار کردند |
| `'e'` | ویرایش - برای مقادیر ورودی فرم |
| `'p'` | پیش نمایش - مشابه برای نمایش |
| `'f'` | داده های فرم - خام برای پردازش فرم |
| `'n'` | هیچ - مقدار خام، بدون قالب بندی |

**برمی‌گرداند:** `mixed` - مقدار قالب‌بندی شده

**مثال:**
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

چندین متغیر را همزمان از یک آرایه تنظیم می کند.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$values` | آرایه | آرایه انجمنی کلید => جفت ارزش |
| `$notGpc` | bool | اگر درست باشد، مقادیر از GET/POST/COOKIE |

**مثال:**
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

### مقدارها را دریافت کنید

همه مقادیر متغیر را بازیابی می کند.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**پارامترها:**| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$keys` | آرایه | کلیدهای خاص برای بازیابی (تهی برای همه) |
| `$format` | رشته | فرمت خروجی |
| `$maxDepth` | int | حداکثر عمق برای اشیاء تو در تو |

**برمی‌گرداند:** `array` - آرایه‌ای از مقادیر مرتبط

**مثال:**
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

یک مقدار را مستقیماً بدون اعتبار سنجی اختصاص می دهد (با احتیاط استفاده کنید).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$key` | رشته | نام متغیر |
| `$value` | مخلوط | مقدار برای تخصیص |

**مثال:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

تمام متغیرها را برای عملیات پایگاه داده تمیز می کند.

```php
public function cleanVars(): bool
```

**برمی‌گرداند:** `bool` - اگر همه متغیرها معتبر باشند درست است

**مثال:**
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

### جدید است

جدید بودن شی را بررسی یا تنظیم می کند.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**مثال:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## روش های رسیدگی به خطا

### setErrors

یک پیغام خطا اضافه می کند.

```php
public function setErrors(string|array $error): void
```

**مثال:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### خطاها را دریافت کنید

همه پیام های خطا را بازیابی می کند.

```php
public function getErrors(): array
```

**مثال:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

خطاهای فرمت شده به صورت HTML را برمی گرداند.

```php
public function getHtmlErrors(): string
```

**مثال:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## روشهای سودمند

### به آرایه

شی را به آرایه تبدیل می کند.

```php
public function toArray(): array
```

**مثال:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### دریافت Vars

تعاریف متغیر را برمی گرداند.

```php
public function getVars(): array
```

**مثال:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## مثال استفاده کامل

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

## بهترین شیوه ها

1. **Always Initialize Variables**: همه متغیرها را در سازنده با استفاده از `initVar()` تعریف کنید.

2. **از انواع داده های مناسب استفاده کنید**: ثابت `XOBJ_DTYPE_*` صحیح را برای اعتبارسنجی انتخاب کنید

3. **ورودی کاربر را با دقت مدیریت کنید**: از `setVar()` با `$notGpc = false` برای ورودی کاربر استفاده کنید

4. ** اعتبارسنجی قبل از ذخیره **: همیشه قبل از عملیات پایگاه داده با `cleanVars()` تماس بگیرید

5. **استفاده از پارامترهای قالب**: از فرمت مناسب در `getVar()` برای زمینه استفاده کنید

6. **Extend for Custom Logic**: اضافه کردن روش های خاص دامنه در زیر کلاس ها

## مستندات مرتبط

- XoopsObjectHandler - الگوی هندلر برای ماندگاری شی
- ../Database/Criteria - ساخت پرس و جو با معیارها
- ../Database/XoopsDatabase - عملیات پایگاه داده

---

*همچنین ببینید: [کد منبع XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*