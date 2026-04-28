---
title: "أفضل ممارسات الأمان"
description: "دليل أمان شامل لتطوير وحدة XOOPS"
dir: rtl
lang: ar
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[واجهات برمجة تطبيقات الأمان مستقرة عبر الإصدارات]
تعمل ممارسات الأمان وواجهات برمجة التطبيقات الموثقة هنا في كل من XOOPS 2.5.x و XOOPS 4.0.x. تبقى فئات الأمان الأساسية (`XoopsSecurity`, `MyTextSanitizer`) مستقرة.
:::

يوفر هذا المستند أفضل ممارسات الأمان الشاملة لمطوري وحدات XOOPS. سيساعد اتباع هذه الإرشادات على ضمان أن الوحدات الخاصة بك آمنة ولا تقدم ثغرات في تثبيتات XOOPS.

## مبادئ الأمان

يجب على كل مطور XOOPS اتباع هذه المبادئ الأساسية للأمان:

1. **الدفاع على عمق**: تنفيذ طبقات متعددة من الضوابط الأمنية
2. **أقل امتياز**: توفير الحد الأدنى فقط من حقوق الوصول الضرورية
3. **التحقق من المدخلات**: لا تثق أبداً بمدخلات المستخدم
4. **آمن بالافتراضي**: يجب أن يكون الأمان هو التكوين الافتراضي
5. **اجعلها بسيطة**: الأنظمة المعقدة يصعب تأمينها

## الوثائق ذات الصلة

- حماية CSRF - نظام الرمز وفئة XoopsSecurity
- تطهير المدخلات - MyTextSanitizer والتحقق
- منع حقن SQL - ممارسات أمان قاعدة البيانات

## قائمة مرجعية الإشارة السريعة

قبل إطلاق الوحدة الخاصة بك، تحقق من:

- [ ] جميع النماذج تتضمن رموز XOOPS
- [ ] يتم التحقق من جميع مدخلات المستخدم وتطهيرها
- [ ] جميع الإخراج مفلوت بشكل صحيح
- [ ] جميع استعلامات قاعدة البيانات تستخدم بيانات معدة مسبقاً
- [ ] يتم التحقق من تحميل الملفات بشكل صحيح
- [ ] فحوصات المصادقة والتفويض في مكانها
- [ ] معالجة الأخطاء لا تكشف معلومات حساسة
- [ ] التكوين الحساس محمي
- [ ] مكتبات الطرف الثالث محدثة
- [ ] تم إجراء اختبار الأمان

## المصادقة والتفويض

### التحقق من المصادقة من المستخدم

```php
// تحقق مما إذا كان المستخدم مسجل دخول
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### التحقق من أذونات المستخدم

```php
// تحقق مما إذا كان المستخدم لديه إذن للوصول إلى هذه الوحدة
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// تحقق من إذن محدد
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### إعداد أذونات الوحدة

```php
// إنشاء إذن في دالة التثبيت / التحديث
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// إضافة إذن لجميع المجموعات
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```

## أمان الجلسة

### أفضل ممارسات معالجة الجلسة

1. لا تخزن معلومات حساسة في الجلسة
2. أعد إنشاء معرفات الجلسات بعد تسجيل الدخول / تغييرات الامتياز
3. تحقق من بيانات الجلسة قبل استخدامها

```php
// أعد إنشاء معرّف الجلسة بعد تسجيل الدخول
session_regenerate_id(true);

// التحقق من بيانات الجلسة
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // التحقق من وجود المستخدم في قاعدة البيانات
}
```

### منع إصلاح الجلسة

```php
// بعد تسجيل الدخول بنجاح
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// في الطلبات اللاحقة
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // محاولة اختطاف جلسة محتملة
    session_destroy();
    redirect_header('index.php', 3, 'Session error');
    exit();
}
```

## أمان تحميل الملف

### التحقق من تحميل الملفات

```php
// التحقق من تحميل الملف بشكل صحيح
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'File upload error');
    exit();
}

// تحقق من حجم الملف
if ($_FILES['userfile']['size'] > 1000000) { // حد 1 ميجابايت
    redirect_header('index.php', 3, 'File too large');
    exit();
}

// تحقق من نوع الملف
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, 'Invalid file type');
    exit();
}

// التحقق من امتداد الملف
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, 'Invalid file extension');
    exit();
}
```

### استخدام محمل XOOPS

```php
include_once XOOPS_ROOT_PATH . '/class/uploader.php';

$allowed_mimetypes = ['image/gif', 'image/jpeg', 'image/png'];
$maxsize = 1000000; // 1MB
$maxwidth = 1024;
$maxheight = 768;
$upload_dir = XOOPS_ROOT_PATH . '/uploads/mymodule';

$uploader = new XoopsMediaUploader(
    $upload_dir,
    $allowed_mimetypes,
    $maxsize,
    $maxwidth,
    $maxheight
);

if ($uploader->fetchMedia('userfile')) {
    $uploader->setPrefix('mymodule_');

    if ($uploader->upload()) {
        $filename = $uploader->getSavedFileName();
        // احفظ اسم الملف في قاعدة البيانات
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```

### تخزين الملفات المرفوعة بأمان

```php
// حدد دليل التحميل خارج جذر الويب
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// أنشئ دليل إذا لم يكن موجوداً
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// نقل الملف المرفوع
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```

## معالجة الأخطاء والسجلات

### معالجة أخطاء آمنة

```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('Operation failed');
    }
} catch (Exception $e) {
    // تسجيل الخطأ
    xoops_error($e->getMessage());

    // عرض رسالة خطأ عامة للمستخدم
    redirect_header('index.php', 3, 'An error occurred. Please try again later.');
    exit();
}
```

### تسجيل أحداث الأمان

```php
// تسجيل أحداث الأمان
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## أمان التكوين

### تخزين التكوين الحساس

```php
// حدد مسار التكوين خارج جذر الويب
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// تحميل التكوين
if (file_exists($config_path)) {
    include $config_path;
} else {
    // التعامل مع التكوين المفقود
}
```

### حماية ملفات التكوين

استخدم `.htaccess` لحماية ملفات التكوين:

```apache
# في .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## مكتبات الطرف الثالث

### اختيار المكتبات

1. اختر المكتبات المحافظة عليها بنشاط
2. تحقق من وجود ثغرات أمنية
3. تحقق من أن ترخيص المكتبة متوافقة مع XOOPS

### تحديث المكتبات

```php
// فحص إصدار المكتبة
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### عزل المكتبات

```php
// تحميل المكتبة بطريقة خاضعة للرقابة
function loadLibrary($file)
{
    $allowed = ['parser.php', 'formatter.php'];

    if (!in_array($file, $allowed)) {
        return false;
    }

    include_once XOOPS_ROOT_PATH . '/modules/mymodule/libraries/' . $file;
    return true;
}
```

## اختبار الأمان

### قائمة التحقق من الاختبار اليدوي

1. اختبر جميع النماذج بمدخلات غير صالحة
2. حاول تجاوز المصادقة والتفويض
3. اختبر وظائف تحميل الملفات بملفات ضارة
4. تحقق من وجود ثغرات XSS في جميع الإخراج
5. اختبر حقن SQL في جميع استعلامات قاعدة البيانات

### الاختبار الآلي

استخدم الأدوات الآلية للبحث عن الثغرات:

1. أدوات تحليل الكود الثابت
2. ماسحات تطبيقات الويب
3. فاحصو الاعتماديات لمكتبات الطرف الثالث

## إخراج الهروب

### سياق HTML

```php
// للمحتوى العادي HTML
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// استخدام MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### سياق JavaScript

```php
// لـ البيانات المستخدمة في JavaScript
echo json_encode($variable);

// لـ JavaScript مضمن
echo 'var data = ' . json_encode($variable) . ';';
```

### سياق URL

```php
// لـ البيانات المستخدمة في URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### متغيرات النموذج

```php
// تخصيص المتغيرات لنموذج Smarty
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// للمحتوى HTML الذي يجب عرضه كما هو
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## موارد

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [PHP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS Documentation](https://xoops.org/)

---

#أمان #أفضل-ممارسات #xoops #تطوير-الوحدة #المصادقة #التفويض
