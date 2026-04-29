---
title: "خطاهای مجوز رد شده"
description: "عیب یابی مشکلات مجوز فایل و دایرکتوری در XOOPS"
---
مسائل مربوط به مجوز فایل و دایرکتوری در نصب XOOPS، به ویژه پس از آپلود یا انتقال سرور، رایج است. این راهنما به تشخیص و حل مشکلات مجوز کمک می کند.

## درک مجوزهای فایل

### مبانی مجوز Linux/Unix

مجوزهای فایل به صورت سه digit codes:

```
rwxrwxrwx
||| ||| |||
||| ||| +-- Others (world)
||| +------ Group
+--------- Owner

r = read (4)
w = write (2)
x = execute (1)

755 = rwxr-xr-x (owner full, group read/execute, others read/execute)
644 = rw-r--r-- (owner read/write, group read, others read)
777 = rwxrwxrwx (everyone full access - NOT RECOMMENDED)
``` نشان داده می شوند

## خطاهای رایج مجوز

### "مجوز رد شد" در آپلود

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "نوشتن فایل ممکن نیست"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### "نمی توان دایرکتوری ایجاد کرد"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## فهرست راهنماهای XOOPS حیاتی

### دایرکتوری هایی که به مجوز نوشتن نیاز دارند

| دایرکتوری | حداقل | هدف |
|-----------|---------|---------|
| `/uploads` | 755 | بارگذاری کاربران |
| `/cache` | 755 | فایل های کش |
| `/templates_c` | 755 | قالب های کامپایل شده |
| `/var` | 755 | داده های متغیر |
| `mainfile.php` | 644 | پیکربندی (قابل خواندن) |

## عیب یابی Linux/Unix

### مرحله 1: مجوزهای فعلی را بررسی کنید

```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```

### مرحله 2: شناسایی کاربر وب سرور

```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```

### مرحله 3: تصحیح مالکیت

```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### مرحله 4: رفع مجوزها

#### گزینه A: مجوزهای محدود کننده (توصیه می شود)

```bash
# All directories: 755 (rwxr-xr-x)
find /var/www/html/xoops -type d -exec chmod 755 {} \;

# All files: 644 (rw-r--r--)
find /var/www/html/xoops -type f -exec chmod 644 {} \;

# Except writable directories
chmod 755 /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/var/
```

#### گزینه B: اسکریپت یکباره

```bash
#!/bin/bash
# fix-permissions.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

echo "Fixing XOOPS permissions..."

# Set ownership
sudo chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# Set directory permissions
find $XOOPS_PATH -type d -exec chmod 755 {} \;

# Set file permissions
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# Ensure writable directories
chmod 755 $XOOPS_PATH/uploads/
chmod 755 $XOOPS_PATH/cache/
chmod 755 $XOOPS_PATH/templates_c/
chmod 755 $XOOPS_PATH/var/

echo "Done! Permissions fixed."
```

## مسائل مربوط به مجوز توسط دایرکتوری

### فهرست آپلودها

**مشکل:** نمی توان فایل ها را آپلود کرد

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### فهرست حافظه پنهان

**مشکل:** فایل های کش نوشته نمی شوند

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### کش الگوها

**مشکل:** قالب ها کامپایل نمی شوند

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## عیب یابی ویندوز

### مرحله 1: ویژگی های فایل را بررسی کنید

1. روی فایل → Properties کلیک راست کنید
2. روی برگه "امنیت" کلیک کنید
3. روی دکمه "ویرایش" کلیک کنید
4. کاربر را انتخاب کنید و مجوزها را تأیید کنید

### مرحله 2: اجازه نوشتن را اعطا کنید

#### از طریق رابط کاربری گرافیکی:

```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```

#### از طریق خط فرمان (PowerShell):

```powershell
# Run PowerShell as Administrator

# Grant IIS app pool permissions
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

## اسکریپت PHP برای بررسی مجوزها

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

## بهترین شیوه ها

### 1. اصل کمترین امتیاز

```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```

### 2. پشتیبان گیری قبل از تغییرات

```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## مرجع سریع

```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## مستندات مرتبط

- White-Screen-of-Death - سایر خطاهای رایج
- پایگاه داده-اتصال-خطاها - مشکلات پایگاه داده
- ../../01-Getting-Started/Configuration/System-Settings - پیکربندی XOOPS

---

**آخرین به روز رسانی: ** 31-01-2026
** برای:** XOOPS 2.5.7+ اعمال می شود
**سیستم عامل:** لینوکس، ویندوز، macOS