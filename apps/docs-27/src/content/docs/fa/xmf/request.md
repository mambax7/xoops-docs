---
title: "درخواست XMF"
description: 'مدیریت امن درخواست HTTP و اعتبارسنجی ورودی با کلاس XMF\Request'
---
کلاس `XMF\Request` دسترسی کنترل شده ای به متغیرهای درخواست HTTP با پاکسازی داخلی و تبدیل نوع فراهم می کند. به طور پیش‌فرض از تزریق‌های مضر بالقوه محافظت می‌کند و در عین حال ورودی‌ها را با انواع مشخص مطابقت می‌دهد.

## بررسی اجمالی

رسیدگی به درخواست یکی از حیاتی ترین جنبه های امنیتی توسعه وب است. کلاس درخواست XMF:

- ورودی را به طور خودکار ضد عفونی می کند تا از حملات XSS جلوگیری کند
- برای انواع داده‌های رایج، دسترسی‌های ایمن برای نوع ارائه می‌کند
- پشتیبانی از چندین منبع درخواست (GET، POST، COOKIE و غیره)
- مدیریت ارزش پیش فرض سازگار را ارائه می دهد

## استفاده اولیه

```php
use XMF\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```

## روش های درخواست

### getMethod()

روش درخواست HTTP را برای درخواست فعلی برمی‌گرداند.

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name، $default، $hash، $type، $mask)

روش اصلی که اکثر روش های دیگر `get*()` از آن استفاده می کنند. یک متغیر با نام را از داده های درخواست واکشی و برمی گرداند.

**پارامترها:**
- `$name` - نام متغیر برای واکشی
- `$default` - مقدار پیش‌فرض اگر متغیر وجود نداشته باشد
- `$hash` - هش منبع: GET، POST، FILES، COOKIE، ENV، SERVER، METHOD یا REQUEST (پیش‌فرض)
- `$type` - نوع داده برای تمیز کردن (به انواع FilterInput زیر مراجعه کنید)
- `$mask` - بیت ماسک برای گزینه های تمیز کردن

**مقادیر ماسک:**

| ماسک ثابت | اثر |
|---------------|--------|
| `MASK_NO_TRIM` | فضای سفید leading/trailing را کوتاه نکنید |
| `MASK_ALLOW_RAW` | از تمیز کردن صرفنظر کنید، اجازه دهید ورودی خام |
| `MASK_ALLOW_HTML` | یک مجموعه محدود "ایمن" از نشانه گذاری HTML |

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## روش های خاص

### getInt($name، $default، $hash)

یک مقدار صحیح را برمی گرداند. فقط ارقام مجاز هستند.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name، $default، $hash)

مقدار شناور را برمی‌گرداند. فقط رقم و نقطه مجاز است.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name، $default، $hash)

یک مقدار بولی را برمی‌گرداند.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name، $default، $hash)

رشته ای را فقط با حروف و زیرخط `[A-Za-z_]` برمی گرداند.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name، $default، $hash)

یک رشته دستور را فقط با `[A-Za-z0-9.-_]` برمی‌گرداند که مجبور به حروف کوچک می‌شود.

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name، $default، $hash، $mask)

یک رشته پاک شده با حذف کد HTML بد (مگر اینکه توسط ماسک لغو شده باشد) را برمی گرداند.

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name، $default، $hash)

آرایه ای را برمی گرداند که به صورت بازگشتی برای حذف XSS و کد بد پردازش شده است.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name، $default، $hash)

متن خام را بدون تمیز کردن برمی‌گرداند. با احتیاط استفاده کنید.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name، $default، $hash)

یک URL وب معتبر (فقط طرح‌های نسبی، http یا https) را برمی‌گرداند.

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name، $default، $hash)

یک سیستم فایل یا مسیر وب تایید شده را برمی گرداند.

```php
$filePath = Request::getPath('file', '');
```

### دریافت ایمیل ($name، $default، $hash)

یک آدرس ایمیل معتبر یا پیش فرض را برمی گرداند.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### دریافت IP($name، $default، $hash)

یک آدرس IPv4 یا IPv6 معتبر را برمی‌گرداند.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName، $default)

مقدار سرصفحه درخواست HTTP را برمی‌گرداند.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## روشهای سودمند

### دارایVar($name، $hash)

بررسی کنید که آیا متغیری در هش مشخص شده وجود دارد یا خیر.

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

### setVar($name، $value، $hash، $overwrite)

یک متغیر در هش مشخص شده تنظیم کنید. مقدار قبلی یا null را برمی گرداند.

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

### دریافت ($hash، $mask)یک کپی پاک شده از کل آرایه هش را برمی گرداند.

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

مجموعه ### ($array، $hash، $overwrite)

چندین متغیر را از یک آرایه تنظیم می کند.

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## یکپارچه سازی ورودی فیلتر

کلاس Request از `XMF\FilterInput` برای تمیز کردن استفاده می کند. انواع فیلترهای موجود:

| نوع | توضیحات |
|------|-------------|
| ALPHANUM / ALNUM | فقط حروف عددی |
| آرایه | به صورت بازگشتی هر عنصر |
| BASE64 | رشته رمزگذاری شده Base64 |
| BOOLEAN / BOOL | درست یا غلط |
| CMD | فرمان - A-Z، 0-9، خط خط، نقطه، نقطه (کوچک) |
| ایمیل | آدرس ایمیل معتبر |
| شناور / دوبل | شماره ممیز شناور |
| عدد صحیح / INT | مقدار صحیح |
| IP | آدرس IP معتبر |
| مسیر | فایل سیستم یا مسیر وب |
| STRING | رشته عمومی (پیش فرض) |
| USERNAME | فرمت نام کاربری |
| WEBURL | آدرس وب |
| کلمه | فقط حروف A-Z و زیرخط |

## مثال های عملی

### پردازش فرم

```php
use XMF\Request;

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

### AJAX Handler

```php
use XMF\Request;

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

### صفحه بندی

```php
use XMF\Request;

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

### فرم جستجو

```php
use XMF\Request;

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

## بهترین شیوه های امنیتی

1. **همیشه از روش های نوع خاص استفاده کنید** - از `getInt()` برای شناسه ها، `getEmail()` برای ایمیل ها و غیره استفاده کنید.

2. **پیش‌فرض‌های معقول ارائه کنید** - هرگز ورودی را فرض نکنید

3. ** اعتبار سنجی پس از پاکسازی ** - پاکسازی داده های بد را حذف می کند، اعتبارسنجی داده های صحیح را تضمین می کند

4. **استفاده از هش مناسب** - POST را برای داده های فرم و GET را برای پارامترهای پرس و جو مشخص کنید

5. **اجتناب از ورودی خام** - فقط در صورت لزوم از `getText()` یا `MASK_ALLOW_RAW` استفاده کنید

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## همچنین ببینید

- شروع به کار با XMF - مفاهیم اولیه XMF
- XMF-Module-Helper - کلاس کمکی ماژول
- ../XMF-Framework - نمای کلی چارچوب

---

#xmf #درخواست #امنیت #ورودی-اعتبار #عفونی‌سازی