---
title: "حماية CSRF"
description: "فهم وتنفيذ حماية CSRF في XOOPS باستخدام فئة XoopsSecurity"
dir: rtl
lang: ar
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

تخدع هجمات التزوير عبر الموقع (CSRF) المستخدمين لتنفيذ إجراءات غير مرغوبة على موقع يكونون مصرحين فيه. يوفر XOOPS حماية CSRF مدمجة من خلال فئة `XoopsSecurity`.

## الوثائق ذات الصلة

- أفضل ممارسات الأمان - دليل الأمان الشامل
- تطهير المدخلات - MyTextSanitizer والتحقق
- منع حقن SQL - ممارسات أمان قاعدة البيانات

## فهم هجمات CSRF

يحدث هجوم CSRF عندما:

1. يكون المستخدم مصرحاً على موقع XOOPS الخاص بك
2. يزور المستخدم موقع ويب ضار
3. يقدم الموقع الضار طلباً لموقع XOOPS الخاص بك باستخدام جلسة المستخدم
4. يعالج موقعك الطلب كما لو كان من المستخدم الشرعي

## فئة XoopsSecurity

يوفر XOOPS فئة `XoopsSecurity` للحماية من هجمات CSRF. تدير هذه الفئة رموز الأمان التي يجب تضمينها في النماذج والتحقق منها عند معالجة الطلبات.

### توليد الرمز

تنشئ فئة الأمان رموز فريدة يتم تخزينها في جلسة المستخدم ويجب تضمينها في النماذج:

```php
$security = new XoopsSecurity();

// الحصول على حقل إدخال رمز HTML
$tokenHTML = $security->getTokenHTML();

// احصل على قيمة الرمز فقط
$tokenValue = $security->createToken();
```

### التحقق من الرمز

عند معالجة إرسالات النموذج، تحقق من أن الرمز صحيح:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## استخدام نظام رمز XOOPS

### مع فئات XoopsForm

عند استخدام فئات نموذج XOOPS، تكون حماية الرمز واضحة:

```php
// إنشاء نموذج
$form = new XoopsThemeForm('Add Item', 'form_name', 'submit.php');

// إضافة عناصر النموذج
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));

// أضف حقل الرمز المخفي - تضمين هذا دائماً
$form->addElement(new XoopsFormHiddenToken());

// أضف زر الإرسال
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
```

### مع النماذج المخصصة

للنماذج المخصصة HTML التي لا تستخدم XoopsForm:

```php
// في نموذج النموذج أو ملف PHP الخاص بك
$security = new XoopsSecurity();
?>
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    <!-- تضمين الرمز -->
    <?php echo $security->getTokenHTML(); ?>

    <button type="submit">Submit</button>
</form>
```

### في قوالب Smarty

عند إنشاء نماذج في قوالب Smarty:

```php
// في ملف PHP الخاص بك
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```

```smarty
{* في النموذج الخاص بك *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* تضمين الرمز *}
    <{$token}>

    <button type="submit">Submit</button>
</form>
```

## معالجة إرسالات النموذج

### التحقق الأساسي من الرمز

```php
// في ملف معالجة النموذج الخاص بك
$security = new XoopsSecurity();

// التحقق من الرمز
if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}

// الرمز صحيح، معالجة النموذج
$title = $_POST['title'];
// ... متابعة المعالجة
```

### مع معالجة الأخطاء المخصصة

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // احصل على معلومات الخطأ المفصلة
    $errors = $security->getErrors();

    // تسجيل الخطأ
    error_log('CSRF token validation failed: ' . implode(', ', $errors));

    // إعادة التوجيه برسالة خطأ
    redirect_header('form.php', 3, 'Security token expired. Please try again.');
    exit();
}
```

### لطلبات AJAX

عند العمل مع طلبات AJAX، قم بتضمين الرمز في طلبك:

```javascript
// JavaScript - احصل على الرمز من الحقل المخفي
var token = document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value;

// تضمين في طلب AJAX
fetch('ajax_handler.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=save&XOOPS_TOKEN_REQUEST=' + encodeURIComponent(token)
});
```

```php
// معالج AJAX PHP
$security = new XoopsSecurity();

if (!$security->check()) {
    echo json_encode(['error' => 'Invalid security token']);
    exit();
}

// معالجة طلب AJAX
```

## التحقق من HTTP Referer

لحماية إضافية، خاصة لطلبات AJAX، يمكنك أيضاً التحقق من عنوان HTTP referer:

```php
$security = new XoopsSecurity();

// التحقق من عنوان referer
if (!$security->checkReferer()) {
    echo json_encode(['error' => 'Invalid request']);
    exit();
}

// تحقق أيضاً من الرمز
if (!$security->check()) {
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

### فحص الأمان المدمج

```php
$security = new XoopsSecurity();

// إجراء كلا الاختبارات
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## تكوين الرمز

### عمر الرمز

للرموز حياة محدودة لمنع هجمات إعادة التشغيل. يمكنك تكوين هذا في إعدادات XOOPS أو معالجة الرموز المنتهية الصلاحية برشاقة:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // قد يكون الرمز قد انتهى صلاحيته
    // إعادة إنشاء نموذج برمز جديد
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### نماذج متعددة على نفس الصفحة

عندما تحتوي على نماذج متعددة على نفس الصفحة، يجب أن يكون لكل واحد رمز خاص به:

```php
// النموذج 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// النموذج 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## أفضل الممارسات

### استخدم دائماً الرموز لعمليات تغيير الحالة

قم بتضمين الرموز في أي نموذج يقوم بـ:

- إنشاء بيانات
- تحديث البيانات
- حذف البيانات
- تغيير إعدادات المستخدم
- إجراء أي إجراء إداري

### لا تعتمد فقط على فحص Referer

يمكن لعنوان HTTP referer أن:

- تم حذفه بواسطة أدوات الخصوصية
- غائب في بعض المتصفحات
- تم تزويره في بعض الحالات

استخدم التحقق من الرمز دائماً كدفاعك الأساسي.

### أعد إنشاء الرموز بشكل صحيح

ضع في الاعتبار إعادة إنشاء الرموز:

- بعد إرسال النموذج بنجاح
- بعد تسجيل الدخول / تسجيل الخروج
- على فترات منتظمة للجلسات الطويلة

### معالجة انتهاء صلاحية الرمز برشاقة

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // تخزين بيانات النموذج مؤقتاً
    $_SESSION['form_backup'] = $_POST;

    // إعادة التوجيه إلى النموذج برسالة
    redirect_header('form.php?restore=1', 3, 'Please resubmit the form.');
    exit();
}
```

## المشاكل الشائعة والحلول

### خطأ الرمز غير موجود

**المشكلة**: فحص الأمان يفشل مع "الرمز غير موجود"

**الحل**: تأكد من تضمين حقل الرمز في النموذج الخاص بك:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### خطأ الرمز المنتهي الصلاحية

**المشكلة**: يرى المستخدمون "الرمز انتهى صلاحيته" بعد إكمال النموذج لفترة طويلة

**الحل**: ضع في الاعتبار استخدام JavaScript لتحديث الرمز بشكل دوري:

```javascript
// تحديث الرمز كل 10 دقائق
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```

### مشاكل رمز AJAX

**المشكلة**: طلبات AJAX تفشل في التحقق من الرمز

**الحل**: تأكد من نقل الرمز مع كل طلب AJAX والتحقق منه من جانب الخادم:

```php
// معالج AJAX
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // لا تمسح الرمز لـ AJAX
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

---

#أمان #csrf #xoops #نماذج #رموز #XoopsSecurity
