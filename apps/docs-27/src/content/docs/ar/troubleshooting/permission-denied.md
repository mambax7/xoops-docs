---
title: "أخطاء رفض الأذونات"
description: "استكشاف مشاكل أذونات الملفات والمجلدات في XOOPS"
dir: rtl
lang: ar
---

مشاكل أذونات الملفات والمجلدات شائعة في تثبيتات XOOPS، خاصة بعد التحميل أو الهجرة الخادوم. يساعد هذا الدليل في تشخيص وحل مشاكل الأذونات.

## فهم أذونات الملفات

### أساسيات الأذونات على Linux/Unix

يتم تمثيل أذونات الملفات بأكواد من ثلاثة أرقام:

```
rwxrwxrwx
||| ||| |||
||| ||| +-- Others (العالم)
||| +------ Group (المجموعة)
+--------- Owner (المالك)

r = read (القراءة) (4)
w = write (الكتابة) (2)
x = execute (التنفيذ) (1)

755 = rwxr-xr-x (المالك كامل، المجموعة قراءة/تنفيذ، الآخرون قراءة/تنفيذ)
644 = rw-r--r-- (المالك قراءة/كتابة، المجموعة قراءة، الآخرون قراءة)
777 = rwxrwxrwx (الجميع الوصول الكامل - غير مُنصح به)
```

## أخطاء الأذونات الشائعة

### "Permission denied" في التحميل

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "Unable to write file"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### "Cannot create directory"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## مجلدات XOOPS الحرجة

### المجلدات التي تتطلب أذونات الكتابة

| المجلد | الحد الأدنى | الغرض |
|-------|-----------|-------|
| `/uploads` | 755 | تحميلات المستخدم |
| `/cache` | 755 | ملفات التخزين المؤقت |
| `/templates_c` | 755 | القوالس المترجمة |
| `/var` | 755 | البيانات المتغيرة |
| `mainfile.php` | 644 | التكوين (قابل للقراءة) |

## استكشاف الأخطاء على Linux/Unix

### الخطوة 1: فحص الأذونات الحالية

```bash
# فحص أذونات الملف
ls -l /var/www/html/xoops/

# فحص ملف محدد
ls -l /var/www/html/xoops/mainfile.php

# فحص أذونات الدليل
ls -ld /var/www/html/xoops/uploads/
```

### الخطوة 2: تحديد مستخدم خادم الويب

```bash
# فحص مستخدم Apache
ps aux | grep -E '[a]pache|[h]ttpd'
# عادة: www-data (Debian/Ubuntu) أو apache (RedHat/CentOS)

# فحص مستخدم Nginx
ps aux | grep -E '[n]ginx'
# عادة: www-data أو nginx
```

### الخطوة 3: صحّح الملكية

```bash
# عيّن الملكية الصحيحة (بافتراض مستخدم www-data)
sudo chown -R www-data:www-data /var/www/html/xoops/

# صحّح مجلدات الويب القابلة للكتابة فقط
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### الخطوة 4: صحّح الأذونات

#### الخيار أ: أذونات مقيدة (مُنصح به)

```bash
# جميع المجلدات: 755 (rwxr-xr-x)
find /var/www/html/xoops -type d -exec chmod 755 {} \;

# جميع الملفات: 644 (rw-r--r--)
find /var/www/html/xoops -type f -exec chmod 644 {} \;

# باستثناء المجلدات القابلة للكتابة
chmod 755 /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/var/
```

#### الخيار ب: نص بخطوة واحدة

```bash
#!/bin/bash
# fix-permissions.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

echo "Fixing XOOPS permissions..."

# عيّن الملكية
sudo chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# عيّن أذونات المجلد
find $XOOPS_PATH -type d -exec chmod 755 {} \;

# عيّن أذونات الملف
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# تأكد من المجلدات القابلة للكتابة
chmod 755 $XOOPS_PATH/uploads/
chmod 755 $XOOPS_PATH/cache/
chmod 755 $XOOPS_PATH/templates_c/
chmod 755 $XOOPS_PATH/var/

echo "Done! Permissions fixed."
```

## مشاكل الأذونات حسب المجلد

### مجلد التحميلات

**المشكلة:** لا يمكن تحميل الملفات

```bash
# الحل
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### مجلد التخزين المؤقت

**المشكلة:** ملفات التخزين المؤقت لا تُكتب

```bash
# الحل
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### ذاكرة تخزين القوالس المؤقتة

**المشكلة:** القوالس لا تُترجم

```bash
# الحل
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## استكشاف الأخطاء على Windows

### الخطوة 1: فحص خصائص الملف

1. انقر بزر الماوس الأيمن على الملف → Properties
2. انقر على علامة التبويب "Security"
3. انقر على زر "Edit"
4. حدد المستخدم وتحقق من الأذونات

### الخطوة 2: منح أذونات الكتابة

#### عبر الواجهة الرسومية:

```
1. انقر بزر الماوس الأيمن على المجلد → Properties
2. حدد علامة التبويب "Security"
3. انقر على "Edit"
4. حدد "IIS_IUSRS" أو "NETWORK SERVICE"
5. تحقق من "Modify" و "Write"
6. انقر على "Apply" و "OK"
```

#### عبر سطر الأوامر (PowerShell):

```powershell
# قم بتشغيل PowerShell كمسؤول

# منح أذونات مجموعة تطبيقات IIS
$path = "C:\inetpub\wwwroot\xoops\uploads"
$acl = Get-Acl $path
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "IIS_IUSRS",
    "Modify",
    "ContainerInherit,ObjectInherit",
    "None",
    "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl -Path $path -AclObject $acl
```

## نص PHP للتحقق من الأذونات

```php
<?php
// check-xoops-permissions.php

$paths = [
    XOOPS_ROOT_PATH . '/uploads' => 'uploads',
    XOOPS_ROOT_PATH . '/cache' => 'cache',
    XOOPS_ROOT_PATH . '/templates_c' => 'templates_c',
    XOOPS_ROOT_PATH . '/var' => 'var',
    XOOPS_ROOT_PATH . '/mainfile.php' => 'mainfile.php'
];

echo "<h2>XOOPS Permission Check</h2>";
echo "<table border='1'>";
echo "<tr><th>Path</th><th>Readable</th><th>Writable</th></tr>";

foreach ($paths as $path => $name) {
    $readable = is_readable($path) ? 'YES' : 'NO';
    $writable = is_writable($path) ? 'YES' : 'NO';

    echo "<tr>";
    echo "<td>$name</td>";
    echo "<td style='background: " . ($readable === 'YES' ? 'green' : 'red') . "'>$readable</td>";
    echo "<td style='background: " . ($writable === 'YES' ? 'green' : 'red') . "'>$writable</td>";
    echo "</tr>";
}

echo "</table>";
?>
```

## أفضل الممارسات

### 1. مبدأ أقل صلاحية

```bash
# امنح الأذونات الضرورية فقط
# لا تستخدم 777 أو 666

# سيء
chmod 777 /var/www/html/xoops/uploads/  # خطر!

# جيد
chmod 755 /var/www/html/xoops/uploads/  # آمن
```

### 2. احسب نسخة احتياطية قبل التغييرات

```bash
# احسب الحالة الحالية نسخة احتياطية
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## مرجع سريع

```bash
# إصلاح سريع (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## الوثائق ذات الصلة

- White-Screen-of-Death - أخطاء شائعة أخرى
- Database-Connection-Errors - مشاكل قاعدة البيانات
- ../../01-Getting-Started/Configuration/System-Settings - تكوين XOOPS

---

**آخر تحديث:** 2026-01-31
**ينطبق على:** XOOPS 2.5.7+
**نظام التشغيل:** Linux, Windows, macOS
