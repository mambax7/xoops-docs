---
title: "استكشاف الأخطاء والإصلاح"
description: "حلول لمشاكل XOOPS الشائعة وتقنيات التصحيح والأسئلة الشائعة"
dir: rtl
lang: ar
---

> حلول للمشاكل الشائعة وتقنيات التصحيح لـ XOOPS CMS.

---

## التشخيص السريع

قبل الخوض في مشاكل محددة، تحقق من هذه الأسباب الشائعة:

1. **أذونات الملفات** - المجلدات تحتاج 755، الملفات تحتاج 644
2. **إصدار PHP** - تأكد من PHP 7.4+ (8.x مُنصح به)
3. **سجلات الأخطاء** - تحقق من `xoops_data/logs/` وسجلات أخطاء PHP
4. **التخزين المؤقت** - امسح التخزين المؤقت في Admin → System → Maintenance

---

## محتويات القسم

### المشاكل الشائعة
- White Screen of Death (WSOD)
- أخطاء اتصال قاعدة البيانات
- أخطاء Permission Denied
- فشل تثبيت الوحدة
- أخطاء تجميع النموذج

### الأسئلة الشائعة
- Installation FAQ
- Module FAQ
- Theme FAQ
- Performance FAQ

### التصحيح
- Enabling Debug Mode
- Using Ray Debugger
- Database Query Debugging
- Smarty Template Debugging

---

## المشاكل الشائعة والحلول

### White Screen of Death (WSOD)

**الأعراض:** صفحة بيضاء فارغة، بدون رسالة خطأ

**الحلول:**

1. **فعّل عرض أخطاء PHP مؤقتاً:**
   ```php
   // أضف إلى mainfile.php مؤقتاً
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **تحقق من سجل أخطاء PHP:**
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **الأسباب الشائعة:**
   - تم تجاوز حد الذاكرة
   - خطأ بناء جملة PHP مميت
   - امتداد مطلوب مفقود

4. **أصلح مشاكل الذاكرة:**
   ```php
   // في mainfile.php أو php.ini
   ini_set('memory_limit', '256M');
   ```

---

### أخطاء اتصال قاعدة البيانات

**الأعراض:** "Unable to connect to database" أو ما شابه

**الحلول:**

1. **تحقق من بيانات الاعتماد في mainfile.php:**
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   ```

2. **اختبر الاتصال يدوياً:**
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   ```

3. **تحقق من خدمة MySQL:**
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   ```

4. **تحقق من أذونات المستخدم:**
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### أخطاء Permission Denied

**الأعراض:** لا يمكن تحميل الملفات، لا يمكن حفظ الإعدادات

**الحلول:**

1. **عيّن الأذونات الصحيحة:**
   ```bash
   # المجلدات
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # الملفات
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # المجلدات القابلة للكتابة
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   ```

2. **عيّن ملكية صحيحة:**
   ```bash
   chown -R www-data:www-data /path/to/xoops
   ```

3. **تحقق من SELinux (CentOS/RHEL):**
   ```bash
   # فحص الحالة
   sestatus

   # السماح لـ httpd بالكتابة
   setsebool -P httpd_unified 1
   ```

---

### فشل تثبيت الوحدة

**الأعراض:** لن تثبّت الوحدة، أخطاء SQL

**الحلول:**

1. **تحقق من متطلبات الوحدة:**
   - توافق إصدار PHP
   - امتدادات PHP المطلوبة
   - توافق إصدار XOOPS

2. **تثبيت SQL يدوي:**
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   ```

3. **امسح ذاكرة التخزين المؤقت للوحدة:**
   ```php
   // في xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   ```

4. **تحقق من بناء جملة xoops_version.php:**
   ```bash
   php -l modules/mymodule/xoops_version.php
   ```

---

### أخطاء تجميع النموذج

**الأعراض:** أخطاء Smarty، لم يتم العثور على النموذج

**الحلول:**

1. **امسح ذاكرة التخزين المؤقت لـ Smarty:**
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   ```

2. **تحقق من بناء جملة النموذج:**
   ```smarty
   {* صحيح *}
   {$variable}

   {* غير صحيح - $ مفقود *}
   {variable}
   ```

3. **تحقق من وجود النموذج:**
   ```bash
   ls modules/mymodule/templates/
   ```

4. **أعد إنشاء النماذج:**
   - Admin → System → Maintenance → Templates → Regenerate

---

## تقنيات التصحيح

### تفعيل وضع تصحيح XOOPS

```php
// في mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// المستويات:
// 0 = مطفأ
// 1 = تصحيح PHP
// 2 = تصحيح PHP + SQL
// 3 = تصحيح PHP + SQL + قوالس Smarty
```

### استخدام Ray Debugger

Ray أداة تصحيح ممتازة لـ PHP:

```php
// تثبيت عبر Composer
composer require spatie/ray --dev

// الاستخدام في الكود الخاص بك
ray($variable);
ray($object)->expand();
ray()->measure();

// استعلامات قاعدة البيانات
ray($sql)->label('Query');
```

### وحدة تصحيح Smarty

```smarty
{* فعّل في النموذج *}
{debug}

{* أو في PHP *}
$xoopsTpl->debugging = true;
```

### تسجيل الاستعلام في قاعدة البيانات

```php
// فعّل تسجيل الاستعلام
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// احصل على جميع الاستعلامات
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## الأسئلة الشائعة

### التثبيت

**س: يعرض معالج التثبيت صفحة فارغة**
ج: تحقق من سجلات أخطاء PHP، تأكد من أن PHP لديه ذاكرة كافية، تحقق من أذونات الملفات.

**س: لا يمكن الكتابة إلى mainfile.php أثناء التثبيت**
ج: عيّن الأذونات: `chmod 666 mainfile.php` أثناء التثبيت، ثم `chmod 444` بعده.

**س: جداول قاعدة البيانات لا يتم إنشاؤها**
ج: تحقق من أن مستخدم MySQL لديه امتيازات CREATE TABLE، تحقق من وجود قاعدة البيانات.

### الوحدات

**س: صفحة إدارة الوحدة فارغة**
ج: امسح التخزين المؤقت، تحقق من admin/menu.php للوحدة من أجل أخطاء بناء الجملة.

**س: كتل الوحدة لا تظهر**
ج: تحقق من أذونات الكتلة في Admin → Blocks، تحقق من أن الكتلة مخصصة للصفحات.

**س: فشل تحديث الوحدة**
ج: احسب النسخة الاحتياطية من قاعدة البيانات، جرّب تحديثات SQL اليدوية، تحقق من متطلبات الإصدار.

### القوالس

**س: لا ينطبق القالب بشكل صحيح**
ج: امسح ذاكرة التخزين المؤقت لـ Smarty، تحقق من وجود theme.html، تحقق من أذونات القالب.

**س: CSS المخصص لا ينحمّل**
ج: تحقق من مسار الملف، امسح ذاكرة تخزين المتصفح المؤقتة، تحقق من بناء جملة CSS.

**س: الصور لا تُعرض**
ج: تحقق من مسارات الصور، تحقق من أذونات مجلد التحميلات.

### الأداء

**س: الموقع بطيء جداً**
ج: فعّل التخزين المؤقت، حسّن قاعدة البيانات، تحقق من الاستعلامات البطيئة، فعّل OpCache.

**س: استخدام عالي للذاكرة**
ج: زيادة memory_limit، حسّن الاستعلامات الكبيرة، نفّذ التقسيم إلى صفحات.

---

## أوامر الصيانة

### امسح كل التخزين المؤقت

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### تحسين قاعدة البيانات

```sql
-- حسّن جميع الجداول
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- كرّر للجداول الأخرى

-- أو حسّن الكل دفعة واحدة
mysqlcheck -o -u user -p database
```

### فحص سلامة الملف

```bash
# قارن مع التثبيت الطازج
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## الوثائق ذات الصلة

- Getting Started
- Security Best Practices
- XOOPS 4.0 Roadmap

---

## الموارد الخارجية

- [XOOPS Forums](https://xoops.org/modules/newbb/)
- [GitHub Issues](https://github.com/XOOPS/XoopsCore27/issues)
- [PHP Error Reference](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #troubleshooting #debugging #faq #errors #solutions
