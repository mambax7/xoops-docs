---
title: "الأسئلة الشائعة حول الوحدات"
description: "الأسئلة والإجابات الشائعة عن وحدات XOOPS"
dir: rtl
lang: ar
---

# الأسئلة الشائعة حول الوحدات

> أسئلة وإجابات شائعة حول وحدات XOOPS والتثبيت والإدارة.

---

## التثبيت والتفعيل

### س: كيفية تثبيت وحدة في XOOPS؟

**ج:**
1. حمّل ملف الوحدة المضغوط
2. انتقل إلى XOOPS Admin > Modules > Manage Modules
3. انقر "Browse" واختر الملف المضغوط
4. انقر "Upload"
5. تظهر الوحدة في القائمة (عادة معطلة)
6. انقر أيقونة التفعيل

أو استخرج الملف مباشرة في `/xoops_root/modules/` والدخول إلى لوحة التحكم.

---

### س: تحميل الوحدة يفشل بخطأ "الإذن مرفوض"

**ج:** مشكلة أذونات الملفات:

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

---

## إدارة الوحدات

### س: الفرق بين التعطيل والحذف؟

**ج:**
- **التعطيل**: إيقاف الوحدة (جداول قاعدة البيانات تبقى)
- **الحذف**: إزالة الوحدة (حذف جداول قاعدة البيانات)

للحذف الكامل:
```bash
rm -rf modules/modulename
```

---

### س: كيفية التحقق من تثبيت الوحدة بشكل صحيح؟

**ج:** استخدم برنامج التصحيح:

```php
<?php
// Create admin/debug_modules.php
require_once XOOPS_ROOT_PATH . '/mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

echo "<h1>Module Debug</h1>";

// List all modules
$module_handler = xoops_getHandler('module');
$modules = $module_handler->getObjects();

foreach ($modules as $module) {
    echo "<h2>" . $module->getVar('name') . "</h2>";
    echo "Status: " . ($module->getVar('isactive') ? "Active" : "Inactive") . "<br>";
    echo "Directory: " . $module->getVar('dirname') . "<br>";
}
?>
```

---

## تكوين الوحدة

### س: أين يتم تكوين إعدادات الوحدة؟

**ج:**
1. انتقل إلى XOOPS Admin > Modules
2. انقر أيقونة الإعدادات بجانب الوحدة
3. قم بتكوين التفضيلات

الإعدادات مخزنة في جدول `xoops_config`.

**الوصول في الكود:**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```

---

## ميزات الوحدة

### س: كيفية إضافة صلاحيات للوحدة؟

**ج:**
1. انتقل إلى XOOPS Admin > Modules > Module Permissions
2. اختر الوحدة
3. اختر المستخدم/المجموعة ومستوى الإذن
4. احفظ

**في الكود:**
```php
<?php
// Check if user can access module
if (!xoops_isUser()) {
    exit('Login required');
}

// Check specific permission
$mperm_handler = xoops_getHandler('member_permission');
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('mymodule');

if (!$mperm_handler->userCanAccess($module->mid())) {
    exit('Access denied');
}
?>
```

---

## قاعدة بيانات الوحدة

### س: أين يتم تخزين جداول قاعدة بيانات الوحدة؟

**ج:** جميعها في قاعدة بيانات XOOPS الرئيسية بادئة بـ `xoops_`:

```bash
# List all module tables
mysql> SHOW TABLES LIKE 'xoops_mymodule_%';

# Or in PHP
<?php
$result = $GLOBALS['xoopsDB']->query(
    "SHOW TABLES LIKE '" . XOOPS_DB_PREFIX . "mymodule_%'"
);
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>
```

---

## استكشاف الأخطاء

### س: الوحدة تظهر في القائمة لكن لن تُفعّل

**ج:** تحقق من:
1. بناء جملة xoopsversion.php - استخدم PHP linter:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. ملف SQL:
```bash
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. ملفات اللغة:
```bash
ls -la modules/mymodule/language/english/
```

---

### س: الوحدة تفعّلت لكن لا تظهر في الموقع

**ج:**
1. عيّن `hasMain = 1` في xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. أنشئ `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

## الأداء

### س: الوحدة بطيئة، كيفية تحسينها؟

**ج:**
1. **تحقق من استعلامات قاعدة البيانات** - استخدم تسجيل الاستعلامات
2. **خزّن البيانات** - استخدم كاش XOOPS:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 hour
}
?>
```

3. **حسّن النماذج** - تجنب الحلقات في النماذج
4. **فعّل opcode cache** - APCu, XDebug, إلخ.

---

## الوثائق ذات الصلة

- Module Installation Failures
- Module Structure
- Performance FAQ
- Enable Debug Mode

---

#xoops #modules #faq #troubleshooting
