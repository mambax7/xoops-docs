---
title: "التكوين الأساسي"
description: "إعداد XOOPS الأولي بما في ذلك إعدادات mainfile.php واسم الموقع والبريد الإلكتروني والمنطقة الزمنية"
dir: rtl
lang: ar
---

# التكوين الأساسي لـ XOOPS

يغطي هذا الدليل إعدادات التكوين الأساسية للحصول على موقع XOOPS الخاص بك يعمل بشكل صحيح بعد التثبيت.

## تكوين mainfile.php

ملف `mainfile.php` يحتوي على تكوين حرج لتثبيت XOOPS الخاص بك. يتم إنشاؤه أثناء التثبيت لكن قد تحتاج إلى تحريره يدويًا.

### الموقع

```
/var/www/html/xoops/mainfile.php
```

### هيكل الملف

```php
<?php
// تكوين قاعدة البيانات
define('XOOPS_DB_TYPE', 'mysqli');  // نوع قاعدة البيانات
define('XOOPS_DB_HOST', 'localhost');  // مضيف قاعدة البيانات
define('XOOPS_DB_USER', 'xoops_user');  // مستخدم قاعدة البيانات
define('XOOPS_DB_PASS', 'password');  // كلمة مرور قاعدة البيانات
define('XOOPS_DB_NAME', 'xoops_db');  // اسم قاعدة البيانات
define('XOOPS_DB_PREFIX', 'xoops_');  // بادئة الجدول

// تكوين الموقع
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // مسار نظام الملفات
define('XOOPS_URL', 'http://your-domain.com/xoops');  // رابط ويب
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // مسار موثوق

// مجموعة الأحرف
define('XOOPS_DB_CHARSET', 'utf8mb4');  // مجموعة أحرف قاعدة البيانات
define('_CHARSET', 'UTF-8');  // مجموعة أحرف الصفحة

// وضع التصحيح (ضعه على 0 في الإنتاج)
define('XOOPS_DEBUG', 0);  // ضعه على 1 للتصحيح
?>
```

### شرح الإعدادات الحرجة

| الإعداد | الغرض | مثال |
|--------|-------|------|
| `XOOPS_DB_TYPE` | نظام قاعدة البيانات | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | موقع خادم قاعدة البيانات | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | اسم مستخدم قاعدة البيانات | `xoops_user` |
| `XOOPS_DB_PASS` | كلمة مرور قاعدة البيانات | [كلمة مرور آمنة] |
| `XOOPS_DB_NAME` | اسم قاعدة البيانات | `xoops_db` |
| `XOOPS_DB_PREFIX` | بادئة اسم الجدول | `xoops_` (يسمح بـ XOOPS متعددة على قاعدة بيانات واحدة) |
| `XOOPS_ROOT_PATH` | مسار نظام الملفات الفعلي | `/var/www/html/xoops` |
| `XOOPS_URL` | رابط ويب قابل للوصول | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | مسار موثوق (خارج جذر الويب) | `/var/www/xoops_var` |

### تحرير mainfile.php

افتح mainfile.php في محرر نصوص:

```bash
# استخدام nano
nano /var/www/html/xoops/mainfile.php

# استخدام vi
vi /var/www/html/xoops/mainfile.php

# استخدام sed (البحث والاستبدال)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### تغييرات شائعة في mainfile.php

**تغيير رابط الموقع:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**تفعيل وضع التصحيح (للتطوير فقط):**
```php
define('XOOPS_DEBUG', 1);
```

**تغيير بادئة الجدول (إذا لزم الأمر):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**نقل مسار موثوق خارج جذر الويب (متقدم):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## تكوين لوحة التحكم

تكوين الإعدادات الأساسية من خلال لوحة تحكم XOOPS.

### الوصول إلى إعدادات النظام

1. سجل الدخول إلى لوحة التحكم: `http://your-domain.com/xoops/admin/`
2. انتقل إلى: **System > Preferences > General Settings**
3. عدّل الإعدادات (انظر أدناه)
4. انقر على "حفظ" في الأسفل

### اسم الموقع والوصف

تكوين كيفية ظهور موقعك:

```
اسم الموقع: موقع XOOPS الخاص بي
الوصف الافتراضي: نظام إدارة محتوى ديناميكي
شعار الموقع: مبني مع XOOPS
```

### معلومات الاتصال

تعيين تفاصيل الاتصال بالموقع:

```
بريد الإدارة: admin@your-domain.com
اسم مسؤول الموقع: مسؤول الموقع
بريد نموذج الاتصال: support@your-domain.com
بريد الدعم: help@your-domain.com
```

### اللغة والمنطقة

تعيين اللغة الافتراضية والمنطقة:

```
اللغة الافتراضية: الإنجليزية (أو اللغة المفضلة لديك)
المنطقة الزمنية الافتراضية: America/New_York (أو منطقتك الزمنية)
تنسيق التاريخ: %Y-%m-%d
تنسيق الوقت: %H:%M:%S
```

## تكوين البريد الإلكتروني

تكوين إعدادات البريد الإلكتروني للإخطارات والاتصالات بالمستخدم.

### موقع إعدادات البريد الإلكتروني

**لوحة التحكم:** System > Preferences > Email Settings

### تكوين SMTP

للحصول على تسليم بريد إلكتروني موثوق، استخدم SMTP بدلاً من PHP mail():

```
استخدام SMTP: نعم
مضيف SMTP: smtp.gmail.com (أو مزود SMTP الخاص بك)
منفذ SMTP: 587 (TLS) أو 465 (SSL)
اسم مستخدم SMTP: your-email@gmail.com
كلمة مرور SMTP: [كلمة المرور الخاصة بالتطبيق]
أمان SMTP: TLS أو SSL
```

### مثال تكوين Gmail

قم بإعداد XOOPS لإرسال البريد الإلكتروني عبر Gmail:

```
مضيف SMTP: smtp.gmail.com
منفذ SMTP: 587
أمان SMTP: TLS
اسم مستخدم SMTP: your-email@gmail.com
كلمة مرور SMTP: [كلمة مرور تطبيق Google - ليس كلمة مرور Gmail العادية]
عنوان الإرسال: your-email@gmail.com
اسم الإرسال: اسم موقعك
```

**ملاحظة:** Gmail يتطلب كلمة مرور تطبيق وليس كلمة مرور Gmail العادية:
1. اذهب إلى https://myaccount.google.com/apppasswords
2. توليد كلمة مرور تطبيق لـ "البريد" و "جهاز كمبيوتر Windows"
3. استخدم كلمة المرور المُنشأة في XOOPS

### تكوين PHP mail() (أبسط لكن أقل موثوقية)

إذا كان SMTP غير متاح، استخدم PHP mail():

```
استخدام SMTP: لا
عنوان الإرسال: noreply@your-domain.com
اسم الإرسال: اسم موقعك
```

تأكد من أن الخادم الخاص بك يحتوي على sendmail أو postfix مكوّن:

```bash
# تحقق من توفر sendmail
which sendmail

# أو تحقق من postfix
systemctl status postfix
```

### إعدادات وظائف البريد الإلكتروني

تكوين ما يؤدي إلى إرسال رسائل بريد إلكترونية:

```
إرسال الإخطارات: نعم
إخطار المسؤول عند تسجيل المستخدم: نعم
إرسال بريد ترحيب للمستخدمين الجدد: نعم
إرسال رابط إعادة تعيين كلمة المرور: نعم
تفعيل البريد الإلكتروني للمستخدم: نعم
تفعيل الرسائل الخاصة: نعم
إخطار بالإجراءات الإدارية: نعم
```

## تكوين المنطقة الزمنية

تعيين المنطقة الزمنية الصحيحة للطوابع الزمنية والجدولة الصحيحة.

### تعيين المنطقة الزمنية في لوحة التحكم

**المسار:** System > Preferences > General Settings

```
المنطقة الزمنية الافتراضية: [اختر منطقتك الزمنية]
```

**المناطق الزمنية الشائعة:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### التحقق من المنطقة الزمنية

تحقق من المنطقة الزمنية الحالية للخادم:

```bash
# عرض المنطقة الزمنية الحالية
timedatectl

# أو تحقق من التاريخ
date +%Z

# قائمة المناطق الزمنية المتاحة
timedatectl list-timezones
```

### تعيين المنطقة الزمنية للنظام (Linux)

```bash
# تعيين المنطقة الزمنية
timedatectl set-timezone America/New_York

# أو استخدم طريقة الرابط الرمزي
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# التحقق
date
```

## تكوين الرابط

### تفعيل الروابط النظيفة (الروابط الصديقة)

للحصول على روابط مثل `/page/about` بدلاً من `/index.php?page=about`

**المتطلبات:**
- Apache مع mod_rewrite مفعل
- ملف `.htaccess` في جذر XOOPS

**تفعيل في لوحة التحكم:**

1. اذهب إلى: **System > Preferences > URL Settings**
2. حدد: "تفعيل الروابط الصديقة"
3. اختر: "نوع الرابط" (Path Info أو Query)
4. احفظ

**التحقق من وجود .htaccess:**

```bash
cat /var/www/html/xoops/.htaccess
```

محتوى .htaccess النموذجي:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**استكشاف أخطاء الروابط النظيفة:**

```bash
# التحقق من تفعيل mod_rewrite
apache2ctl -M | grep rewrite

# تفعيله إذا لزم الأمر
a2enmod rewrite

# إعادة تشغيل Apache
systemctl restart apache2

# اختبار قاعدة إعادة الكتابة
curl -I http://your-domain.com/xoops/index.php
```

### تكوين رابط الموقع

**لوحة التحكم:** System > Preferences > General Settings

عيّن الرابط الصحيح لنطاقك:

```
رابط الموقع: http://your-domain.com/xoops/
```

أو إذا كان XOOPS في الجذر:

```
رابط الموقع: http://your-domain.com/
```

## تحسين محركات البحث (SEO)

تكوين إعدادات SEO للحصول على رؤية أفضل في محركات البحث.

### الوسوم الوصفية

عيّن الوسوم الوصفية العالمية:

**لوحة التحكم:** System > Preferences > SEO Settings

```
كلمات مفتاحية: xoops, cms, إدارة محتوى
وصف: نظام إدارة محتوى ديناميكي قوي
```

تظهر في صفحة `<head>`:

```html
<meta name="keywords" content="xoops, cms, إدارة محتوى">
<meta name="description" content="نظام إدارة محتوى ديناميكي قوي">
```

### خريطة الموقع

تفعيل خريطة موقع XML لمحركات البحث:

1. اذهب إلى: **System > Modules**
2. ابحث عن "Sitemap"
3. انقر للتثبيت والتفعيل
4. الوصول إلى الخريطة من: `/xoops/sitemap.xml`

### ملف robots.txt

تحكم في زحف محرك البحث:

أنشئ `/var/www/html/xoops/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## إعدادات المستخدم

تكوين سلوك حساب المستخدم الافتراضي وعملية التسجيل.

### تسجيل المستخدم

**لوحة التحكم:** System > Preferences > User Settings

```
السماح بتسجيل المستخدم: نعم/لا
نوع التسجيل:
  - تفعيل فوري (وصول فوري)
  - موافقة المسؤول (يجب على المسؤول الموافقة)
  - التحقق من البريد الإلكتروني (يجب على المستخدم التحقق من البريد)

التحقق من البريد الإلكتروني: مطلوب/اختياري
طريقة تفعيل الحساب: تلقائي/يدوي
```

### ملف تعريف المستخدم

```
تفعيل ملفات تعريف المستخدمين: نعم
عرض قائمة الأعضاء: نعم
عرض إحصائيات المستخدمين: نعم
عرض آخر وقت متصل: نعم
السماح بصورة رمزية للمستخدم: نعم
أقصى حجم صورة رمزية: 100KB
أبعاد الصورة الرمزية: 100x100 بكسل
```

### عرض بريد المستخدم

```
عرض بريد المستخدم: لا (للخصوصية)
يمكن للمستخدمين إخفاء البريد: نعم
يمكن للمستخدمين تغيير الصورة الرمزية: نعم
يمكن للمستخدمين تحميل الملفات: نعم
```

## تكوين التخزين المؤقت

تحسين الأداء من خلال التخزين المؤقت المناسب.

### إعدادات التخزين المؤقت

**لوحة التحكم:** System > Preferences > Cache Settings

```
تفعيل التخزين المؤقت: نعم
نوع التخزين المؤقت: ملف Cache (أو APCu/Memcache إن توفر)
مدة التخزين المؤقت: 3600 ثانية (ساعة واحدة)
```

### مسح التخزين المؤقت

امسح ملفات التخزين المؤقت القديمة:

```bash
# مسح يدوي للتخزين المؤقت
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# من لوحة التحكم:
# System > Dashboard > Tools > Clear Cache
```

## قائمة التحقق من الإعدادات الأولية

بعد التثبيت، قم بتكوين:

- [ ] اسم الموقع والوصف مضبوط بشكل صحيح
- [ ] تم تكوين بريد المسؤول
- [ ] تم تكوين إعدادات البريد الإلكتروني SMTP واختبارها
- [ ] تم تعيين المنطقة الزمنية على منطقتك
- [ ] تم تكوين الرابط بشكل صحيح
- [ ] تم تفعيل الروابط النظيفة (الروابط الصديقة) إذا رغبت
- [ ] تم تكوين إعدادات تسجيل المستخدم
- [ ] تم تكوين الوسوم الوصفية للـ SEO
- [ ] تم اختيار اللغة الافتراضية
- [ ] تم تفعيل إعدادات التخزين المؤقت
- [ ] كلمة مرور المستخدم الإداري قوية (16+ حرف)
- [ ] اختبار تسجيل المستخدم
- [ ] اختبار وظيفة البريد الإلكتروني
- [ ] اختبار تحميل الملفات
- [ ] قم بزيارة الصفحة الرئيسية والتحقق من المظهر

## اختبار التكوين

### اختبار البريد الإلكتروني

أرسل بريدًا إلكترونيًا تجريبيًا:

**لوحة التحكم:** System > Email Test

أو يدويًا:

```php
<?php
// أنشئ ملف اختبار: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('اختبار البريد الإلكتروني لـ XOOPS');
$mailer->setBody('هذا بريد إلكتروني تجريبي من XOOPS');

if ($mailer->send()) {
    echo "تم إرسال البريد الإلكتروني بنجاح!";
} else {
    echo "فشل إرسال البريد الإلكتروني: " . $mailer->getError();
}
?>
```

### اختبار اتصال قاعدة البيانات

```php
<?php
// أنشئ ملف اختبار: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "تم الاتصال بقاعدة البيانات بنجاح!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "الاستعلام ناجح!";
    }
} else {
    echo "فشل اتصال قاعدة البيانات!";
}
?>
```

**مهم:** احذف ملفات الاختبار بعد الاختبار!

```bash
rm /var/www/html/xoops/test-*.php
```

## ملخص ملفات التكوين

| الملف | الغرض | طريقة التحرير |
|------|-------|--------------|
| mainfile.php | إعدادات قاعدة البيانات والإعدادات الأساسية | محرر نصوص |
| لوحة التحكم | معظم الإعدادات | واجهة ويب |
| .htaccess | إعادة كتابة الرابط | محرر نصوص |
| robots.txt | زحف محرك البحث | محرر نصوص |

## الخطوات التالية

بعد التكوين الأساسي:

1. قم بتكوين إعدادات النظام بالتفصيل
2. تقوية الأمان
3. استكشف ميزات لوحة التحكم
4. أنشئ المحتوى الأول الخاص بك
5. قم بإعداد حسابات المستخدم

---

**علامات:** #configuration #setup #email #timezone #seo

**المقالات ذات الصلة:**
- ../Installation/Installation
- System-Settings
- Security-Configuration
- Performance-Optimization
