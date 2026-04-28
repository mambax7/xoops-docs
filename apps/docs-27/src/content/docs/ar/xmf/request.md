---
title: "طلب XMF"
description: 'معالجة الطلبات الآمنة والتحقق من صحة الإدخال مع فئة Xmf\Request'
dir: rtl
lang: ar
---

توفر فئة `Xmf\Request` وصولا يتحكم فيه إلى متغيرات طلب HTTP مع معالجة وتحويل نوع مدمج. إنه يحمي من الحقن الضارة المحتملة افتراضيا أثناء الامتثال للإدخال إلى أنواع محددة.

## نظرة عامة

معالجة الطلبات هي واحدة من أكثر جوانب أمان تطوير الويب حساسية. فئة طلب XMF:

- معالجة المدخلات تلقائيا لمنع هجمات XSS
- توفير أجهزة وصول آمنة للأنواع البيانات الشائعة
- دعم مصادر طلبات متعددة (GET وPOST و COOKIE وما إلى ذلك)
- توفر معالجة قيمة افتراضية متسقة

## الاستخدام الأساسي

```php
use Xmf\Request;

// احصل على إدخال سلسلة نصية
$name = Request::getString('name', '');

// احصل على إدخال عدد صحيح
$id = Request::getInt('id', 0);

// احصل من مصدر محدد
$postData = Request::getString('data', '', 'POST');
```

## طرق الطلب

### getMethod()

يعيد طريقة طلب HTTP للطلب الحالي.

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

الطريقة الأساسية التي تستدعيها معظم طرق `get*()`. جلب وإرجاع متغير مسمى من بيانات الطلب.

**المعاملات:**
- `$name` - اسم المتغير المراد جلبه
- `$default` - القيمة الافتراضية إذا لم يكن المتغير موجودا
- `$hash` - تجزئة المصدر: GET أو POST أو FILES أو COOKIE أو ENV أو SERVER أو METHOD أو REQUEST (افتراضي)
- `$type` - نوع البيانات للتنظيف (انظر أنواع FilterInput أدناه)
- `$mask` - قناع بت لخيارات التنظيف

**قيم القناع:**

| ثابت القناع | التأثير |
|---------------|--------|
| `MASK_NO_TRIM` | لا تقم بقص المسافات البيضاء البادئة/الزائدة |
| `MASK_ALLOW_RAW` | تخطي التنظيف والسماح بالإدخال الخام |
| `MASK_ALLOW_HTML` | السماح بمجموعة محدودة "آمنة" من ترميز HTML |

```php
// احصل على إدخال خام بدون تنظيف
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// السماح HTML آمن
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## طرق خاصة بالنوع

### getInt($name, $default, $hash)

يعيد قيمة عدد صحيح. يُسمح فقط بالأرقام.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

يعيد قيمة عائمة. يُسمح فقط بالأرقام والفترات.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

يعيد قيمة منطقية.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

يعيد سلسلة نصية تحتوي على أحرف وشرطات سفلية فقط `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

يعيد سلسلة أوامر تحتوي على `[A-Za-z0-9.-_]` فقط، مجبرة على الأحرف الصغيرة.

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name, $default, $hash, $mask)

يعيد سلسلة نصية نظيفة مع إزالة رمز HTML السيء (ما لم يتجاوز حسب القناع).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// السماح ببعض HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

يعيد مصفوفة، تتم معالجتها بشكل متكرر لإزالة XSS والرمز السيء.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

يعيد نص خام بدون تنظيف. استخدم بحذر.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

يعيد عنوان URL على الويب الذي تم التحقق من صحته (المسارات النسبية و http أو https فقط).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

يعيد مسار نظام ملفات أو مسار ويب تم التحقق من صحته.

```php
$filePath = Request::getPath('file', '');
```

### getEmail($name, $default, $hash)

يعيد عنوان بريد إلكتروني مصرح به أو الافتراضي.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

يعيد عنوان IPv4 أو IPv6 الذي تم التحقق من صحته.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

يعيد قيمة رأس طلب HTTP.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## طرق المرافق

### hasVar($name, $hash)

تحقق من وجود متغير في تجزئة محددة.

```php
if (Request::hasVar('submit', 'POST')) {
    // تم إرسال النموذج
}

if (Request::hasVar('id', 'GET')) {
    // معامل ID موجود
}
```

### setVar($name, $value, $hash, $overwrite)

اضبط متغيرا في تجزئة محددة. يرجع القيمة السابقة أو فارغة.

```php
// اضبط قيمة
$oldValue = Request::setVar('processed', true, 'POST');

// يتم التعيين فقط إذا لم يكن موجودا بالفعل
Request::setVar('default_op', 'list', 'GET', false);
```

### get($hash, $mask)

يعيد نسخة نظيفة من مصفوفة تجزئة كاملة.

```php
// احصل على جميع بيانات POST الموثقة
$postData = Request::get('POST');

// احصل على جميع بيانات GET
$getData = Request::get('GET');

// احصل على بيانات REQUEST بدون قص
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### set($array, $hash, $overwrite)

يعين متغيرات متعددة من مصفوفة.

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## تكامل FilterInput

يستخدم فئة Request `Xmf\FilterInput` للتنظيف. أنواع المرشحات المتاحة:

| النوع | الوصف |
|------|-------------|
| ALPHANUM / ALNUM | أبجدية رقمية فقط |
| ARRAY | تنظيف كل عنصر بشكل متكرر |
| BASE64 | سلسلة ترميز Base64 |
| BOOLEAN / BOOL | صحيح أو خاطئ |
| CMD | الأمر - A-Z، 0-9، شرطة سفلية، شرطة، فترة (أحرف صغيرة) |
| EMAIL | عنوان بريد إلكتروني صحيح |
| FLOAT / DOUBLE | رقم عائم |
| INTEGER / INT | قيمة عدد صحيح |
| IP | عنوان IP صحيح |
| PATH | مسار نظام ملفات أو مسار ويب |
| STRING | سلسلة عامة (افتراضي) |
| USERNAME | تنسيق اسم المستخدم |
| WEBURL | عنوان URL على الويب |
| WORD | الأحرف A-Z والشرطة السفلية فقط |

## أمثلة عملية

### معالجة النموذج

```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // التحقق من صحة إرسال النموذج
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

### معالج AJAX

```php
use Xmf\Request;

// التحقق من طلب AJAX
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // معالجة الحذف
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // معالجة التحديث
            break;
    }
}
```

### الترقيم

```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// التحقق من النطاقات
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```

### نموذج البحث

```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// بناء معايير البحث
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```

## أفضل ممارسات الأمان

1. **استخدم دائما طرق خاصة بالنوع** - استخدم `getInt()` للمعرفات و`getEmail()` للبريد الإلكتروني وما إلى ذلك.

2. **توفير قيم افتراضية معقولة** - لا تفترض أن الإدخال موجود أبدا

3. **التحقق بعد المعالجة** - تزيل المعالجة البيانات السيئة والتحقق من صحة يضمن البيانات الصحيحة

4. **استخدم تجزئة مناسبة** - حدد POST لبيانات النموذج و GET لمعاملات الاستعلام

5. **تجنب الإدخال الخام** - استخدم `getText()` أو `MASK_ALLOW_RAW` فقط عند الضرورة المطلقة

```php
// جيد - خاص بالنوع مع افتراضي
$id = Request::getInt('id', 0);

// سيء - استخدام getString للبيانات الرقمية
$id = (int) Request::getString('id', '0');
```

## انظر أيضا

- Getting-Started-with-XMF - مفاهيم XMF الأساسية
- XMF-Module-Helper - فئة مساعد الوحدة
- ../XMF-Framework - نظرة عامة على الإطار

---

#xmf #request #security #input-validation #sanitization
