---
title: "فئة XoopsObject"
description: "الفئة الأساسية لجميع كائنات البيانات في نظام XOOPS توفر إدارة الخصائص والتحقق من الصحة والتسلسل"
dir: rtl
lang: ar
---

فئة `XoopsObject` هي الفئة الأساسية الأساسية لجميع كائنات البيانات في نظام XOOPS. توفر واجهة موحدة لإدارة خصائص الكائن والتحقق من الصحة وتتبع الحالة والتسلسل.

## نظرة عامة على الفئة

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

## التسلسل الهرمي للفئة

```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [كائنات وحدات مخصصة]
```

## الخصائص

| الخاصية | النوع | الظهور | الوصف |
|----------|------|------------|-------------|
| `$vars` | array | محمي | يخزن تعريفات المتغيرات والقيم |
| `$cleanVars` | array | محمي | يخزن القيم المنظفة لعمليات قاعدة البيانات |
| `$isNew` | bool | محمي | يشير إلى ما إذا كان الكائن جديد (ليس بعد في قاعدة البيانات) |
| `$errors` | array | محمي | يخزن التحقق والرسائل الخطأ |

## المُنشئ (Constructor)

```php
public function __construct()
```

ينشئ نسخة جديدة من XoopsObject. يتم تحديد الكائن كجديد بشكل افتراضي.

**مثال:**
```php
$object = new XoopsObject();
// الكائن جديد ولا يحتوي على متغيرات محددة
```

## الطرق الأساسية

### initVar

تهيئة تعريف المتغير للكائن.

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

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$key` | string | اسم المتغير |
| `$dataType` | int | ثابت نوع البيانات (انظر أنواع البيانات) |
| `$value` | mixed | القيمة الافتراضية |
| `$required` | bool | ما إذا كان الحقل مطلوب |
| `$maxlength` | int | الحد الأقصى للطول لأنواع السلاسل |
| `$options` | string | خيارات إضافية |

**أنواع البيانات:**

| الثابت | القيمة | الوصف |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | إدخال صندوق النص |
| `XOBJ_DTYPE_TXTAREA` | 2 | محتوى textarea |
| `XOBJ_DTYPE_INT` | 3 | قيمة عددية صحيحة |
| `XOBJ_DTYPE_URL` | 4 | سلسلة URL |
| `XOBJ_DTYPE_EMAIL` | 5 | عنوان بريد إلكتروني |
| `XOBJ_DTYPE_ARRAY` | 6 | مصفوفة مسلسلة |
| `XOBJ_DTYPE_OTHER` | 7 | نوع مخصص |
| `XOBJ_DTYPE_SOURCE` | 8 | كود المصدر |
| `XOBJ_DTYPE_STIME` | 9 | صيغة وقت قصيرة |
| `XOBJ_DTYPE_MTIME` | 10 | صيغة وقت متوسطة |
| `XOBJ_DTYPE_LTIME` | 11 | صيغة وقت طويلة |
| `XOBJ_DTYPE_FLOAT` | 12 | فاصلة عائمة |
| `XOBJ_DTYPE_DECIMAL` | 13 | رقم عشري |
| `XOBJ_DTYPE_ENUM` | 14 | التعداد |

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

تعيين قيمة المتغير.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$key` | string | اسم المتغير |
| `$value` | mixed | القيمة المراد تعيينها |
| `$notGpc` | bool | إذا كان صحيح، القيمة ليست من GET/POST/COOKIE |

**الإرجاع:** `bool` - صحيح إذا نجح، خطأ بخلاف ذلك

**مثال:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // ليس من إدخال المستخدم
$object->setVar('status', 1);
```

---

### getVar

استرجاع قيمة المتغير مع تنسيق اختياري.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$key` | string | اسم المتغير |
| `$format` | string | صيغة الإخراج |

**خيارات الصيغة:**

| الصيغة | الوصف |
|--------|-------------|
| `'s'` | عرض - كيانات HTML منقولة للعرض |
| `'e'` | تعديل - لقيم إدخال النموذج |
| `'p'` | معاينة - مشابهة للعرض |
| `'f'` | بيانات النموذج - خام لمعالجة النموذج |
| `'n'` | بلا - قيمة خام بدون تنسيق |

**الإرجاع:** `mixed` - القيمة المنسقة

**مثال:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (لقيمة الإدخال)
echo $object->getVar('title', 'n'); // "Hello <World>" (خام)

// لأنواع بيانات المصفوفة
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // إرجاع المصفوفة
```

---

### setVars

تعيين متغيرات متعددة في آن واحد من مصفوفة.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$values` | array | مصفوفة ترابطية من أزواج المفتاح => القيمة |
| `$notGpc` | bool | إذا كان صحيح، القيم ليست من GET/POST/COOKIE |

**مثال:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// من قاعدة البيانات (ليس إدخال المستخدم)
$object->setVars($row, true);
```

---

### getValues

استرجاع جميع قيم المتغيرات.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$keys` | array | مفاتيح محددة للاسترجاع (null للكل) |
| `$format` | string | صيغة الإخراج |
| `$maxDepth` | int | الحد الأقصى للعمق للكائنات المتداخلة |

**الإرجاع:** `array` - مصفوفة ترابطية من القيم

**مثال:**
```php
$object = new MyObject();

// الحصول على جميع القيم
$allValues = $object->getValues();

// الحصول على قيم محددة
$subset = $object->getValues(['title', 'status']);

// الحصول على قيم خام لقاعدة البيانات
$rawValues = $object->getValues(null, 'n');
```

---

### assignVar

تعيين قيمة مباشرة بدون التحقق (استخدم بحذر).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$key` | string | اسم المتغير |
| `$value` | mixed | القيمة المراد تعيينها |

**مثال:**
```php
// تعيين مباشر من مصدر موثوق (مثل قاعدة البيانات)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

تنظيف جميع المتغيرات لعمليات قاعدة البيانات.

```php
public function cleanVars(): bool
```

**الإرجاع:** `bool` - صحيح إذا كانت جميع المتغيرات صحيحة

**مثال:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // المتغيرات نظيفة وجاهزة لقاعدة البيانات
    $cleanData = $object->cleanVars;
} else {
    // حدثت أخطاء في التحقق
    $errors = $object->getErrors();
}
```

---

### isNew

التحقق من تعيين ما إذا كان الكائن جديد.

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

## طرق معالجة الأخطاء

### setErrors

إضافة رسالة خطأ.

```php
public function setErrors(string|array $error): void
```

**مثال:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### getErrors

استرجاع جميع رسائل الخطأ.

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

إرجاع الأخطاء المنسقة كـ HTML.

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

## الطرق المساعدة

### toArray

تحويل الكائن إلى مصفوفة.

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

### getVars

إرجاع تعريفات المتغيرات.

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

## مثال الاستخدام الكامل

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

## أفضل الممارسات

1. **دائم تهيئة المتغيرات**: تحديد جميع المتغيرات في المُنشئ باستخدام `initVar()`

2. **استخدم أنواع البيانات المناسبة**: اختر ثابت `XOBJ_DTYPE_*` الصحيح للتحقق

3. **تعامل مع إدخال المستخدم بحذر**: استخدم `setVar()` مع `$notGpc = false` لإدخال المستخدم

4. **تحقق قبل الحفظ**: دائماً استدعِ `cleanVars()` قبل عمليات قاعدة البيانات

5. **استخدم معاملات الصيغة**: استخدم الصيغة المناسبة في `getVar()` للسياق

6. **توسيع المنطق المخصص**: إضافة الطرق المتعلقة بالمجال في الفئات الفرعية

## التوثيق ذي الصلة

- XoopsObjectHandler - نمط المعالج لاستمرارية الكائن
- ../Database/Criteria - بناء الاستعلام مع Criteria
- ../Database/XoopsDatabase - عمليات قاعدة البيانات

---

*انظر أيضاً: [كود مصدر XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
