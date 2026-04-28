---
title: "تطهير المدخلات"
description: "استخدام MyTextSanitizer وتقنيات التحقق في XOOPS"
dir: rtl
lang: ar
---

لا تثق أبداً بمدخلات المستخدم. تحقق دائماً وطهر جميع بيانات المدخلات قبل استخدامها. يوفر XOOPS فئة `MyTextSanitizer` لتطهير إدخال النص وعدة وظائف مساعدة للتحقق.

## الوثائق ذات الصلة

- أفضل ممارسات الأمان - دليل الأمان الشامل
- حماية CSRF - نظام الرمز وفئة XoopsSecurity
- منع حقن SQL - ممارسات أمان قاعدة البيانات

## القاعدة الذهبية

**لا تثق أبداً بمدخلات المستخدم.** يجب معالجة جميع البيانات من مصادر خارجية من خلال:

1. **التحقق**: تحقق من أنها تطابق الصيغة والنوع المتوقع
2. **التطهير**: إزالة أو تجنب الأحرف الخطرة المحتملة
3. **الهروب**: عند الإخراج، الهروب للسياق المحدد (HTML, JavaScript, SQL)

## فئة MyTextSanitizer

يوفر XOOPS فئة `MyTextSanitizer` (عادة ما تُستخدم اختصار `$myts`) لتطهير النصوص.

### الحصول على المثيل

```php
// احصل على مثيل مفرد
$myts = MyTextSanitizer::getInstance();
```

### تطهير النص الأساسي

```php
$myts = MyTextSanitizer::getInstance();

// للحقول النصية العادية (لا يُسمح بـ HTML)
$title = $myts->htmlSpecialChars($_POST['title']);

// يحول:
// < إلى &lt;
// > إلى &gt;
// & إلى &amp;
// " إلى &quot;
// ' إلى &#039;
```

### معالجة محتوى Textarea

توفر طريقة `displayTarea()` معالجة شاملة لـ textarea:

```php
$myts = MyTextSanitizer::getInstance();

$content = $myts->displayTarea(
    $_POST['content'],
    $allowhtml = 0,      // 0 = لا يُسمح بـ HTML، 1 = HTML مسموح
    $allowsmiley = 1,    // 1 = تمكين الوجوه الضاحكة
    $allowxcode = 1,     // 1 = تمكين أكواد XOOPS (BBCode)
    $allowimages = 1,    // 1 = يُسمح بالصور
    $allowlinebreak = 1  // 1 = تحويل فواصل الأسطر إلى <br>
);
```

### طرق التطهير الشائعة

```php
$myts = MyTextSanitizer::getInstance();

// تجنب أحرف HTML الخاصة
$safe_text = $myts->htmlSpecialChars($text);

// إزالة الشرطات المائلة إذا كانت علامات الاقتباس السحرية مفعلة
$text = $myts->stripSlashesGPC($text);

// تحويل أكواد XOOPS (BBCode) إلى HTML
$html = $myts->xoopsCodeDecode($text);

// تحويل الوجوه الضاحكة إلى الصور
$html = $myts->smiley($text);

// جعل الروابط قابلة للنقر
$html = $myts->makeClickable($text);

// معالجة النص الكاملة للمعاينة
$preview = $myts->previewTarea($text, $allowhtml, $allowsmiley, $allowxcode);
```

## التحقق من صحة المدخلات

### التحقق من قيم الأعداد الصحيحة

```php
// التحقق من معرّف عدد صحيح
$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}

// بديل مع filter_var
$id = filter_var($_REQUEST['id'] ?? 0, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}
```

### التحقق من عناوين البريد الإلكتروني

```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```

### التحقق من المؤشرات

```php
$url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

if (!$url) {
    redirect_header('form.php', 3, 'Invalid URL');
    exit();
}

// فحص إضافي للبروتوكولات المسموح بها
$parsed = parse_url($url);
$allowed_schemes = ['http', 'https'];
if (!in_array($parsed['scheme'], $allowed_schemes)) {
    redirect_header('form.php', 3, 'Only HTTP and HTTPS URLs are allowed');
    exit();
}
```

## أفضل ممارسات الملخص

1. **استخدم MyTextSanitizer** لمعالجة محتوى النصوص
2. **استخدم filter_var()** للتحقق من صيغة محددة
3. **استخدم الصب من النوع** للقيم الرقمية
4. **قائمة بيضاء القيم المسموح بها** لإدخالات التحديد
5. **التحقق قبل التطهير**
6. **الهروب في الإخراج** وليس في الإدخال
7. **استخدم بيانات معدة مسبقاً** لاستعلامات قاعدة البيانات
8. **إنشاء فئات التحقق** للنماذج المعقدة
9. **أبداً لا تثق بالتحقق من جانب العميل** - تحقق دائماً من جانب الخادم

---

#أمان #تطهير #التحقق #xoops #MyTextSanitizer #معالجة-المدخلات
