---
title: "अनुमति अस्वीकृत त्रुटियाँ"
description: "XOOPS में फ़ाइल और निर्देशिका अनुमति समस्याओं का निवारण"
---
फ़ाइल और निर्देशिका अनुमति समस्याएँ XOOPS इंस्टॉलेशन में आम हैं, खासकर अपलोड या सर्वर माइग्रेशन के बाद। यह मार्गदर्शिका अनुमति समस्याओं का निदान और समाधान करने में सहायता करती है.

## फ़ाइल अनुमतियों को समझना

### लिनक्स/यूनिक्स अनुमति मूल बातें

फ़ाइल अनुमतियाँ तीन-अंकीय कोड के रूप में दर्शायी जाती हैं:

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
```

## सामान्य अनुमति त्रुटियाँ

### अपलोड में "अनुमति अस्वीकृत"।

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "फ़ाइल लिखने में असमर्थ"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### "निर्देशिका नहीं बनाई जा सकती"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## महत्वपूर्ण XOOPS निर्देशिकाएँ

### निर्देशिकाओं को लिखने की अनुमति की आवश्यकता है

| निर्देशिका | न्यूनतम | उद्देश्य |
|----|---|----|
| `/uploads` | 755 | उपयोगकर्ता अपलोड |
| `/cache` | 755 | कैश फ़ाइलें |
| `/templates_c` | 755 | संकलित टेम्पलेट्स |
| `/var` | 755 | परिवर्तनीय डेटा |
| `mainfile.php` | 644 | कॉन्फ़िगरेशन (पठनीय) |

## लिनक्स/यूनिक्स समस्या निवारण

### चरण 1: वर्तमान अनुमतियाँ जाँचें

```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```

### चरण 2: वेब सर्वर उपयोगकर्ता की पहचान करें

```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```

### चरण 3: स्वामित्व ठीक करें

```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### चरण 4: अनुमतियाँ ठीक करें

#### विकल्प ए: प्रतिबंधात्मक अनुमतियाँ (अनुशंसित)

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

#### विकल्प बी: ऑल-एट-वन्स स्क्रिप्ट

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

## निर्देशिका द्वारा अनुमति जारी करना

### अपलोड निर्देशिका

**समस्या:** फ़ाइलें अपलोड नहीं की जा सकतीं

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### कैश निर्देशिका

**समस्या:** कैश फ़ाइलें नहीं लिखी जा रही हैं

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### टेम्प्लेट कैश

**समस्या:** टेम्प्लेट संकलित नहीं हो रहे हैं

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## विंडोज़ समस्या निवारण

### चरण 1: फ़ाइल गुणों की जाँच करें

1. फ़ाइल पर राइट-क्लिक करें → गुण
2. "सुरक्षा" टैब पर क्लिक करें
3. "संपादित करें" बटन पर क्लिक करें
4. उपयोगकर्ता का चयन करें और अनुमतियाँ सत्यापित करें

### चरण 2: लिखने की अनुमति प्रदान करें

#### जीयूआई के माध्यम से:

```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```

#### कमांड लाइन के माध्यम से (PowerShell):

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

## अनुमतियाँ जांचने के लिए PHP स्क्रिप्ट

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

## सर्वोत्तम प्रथाएँ

### 1. न्यूनतम विशेषाधिकार का सिद्धांत

```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```

### 2. परिवर्तन से पहले बैकअप

```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## त्वरित संदर्भ

```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## संबंधित दस्तावेज़ीकरण

- व्हाइट-स्क्रीन-ऑफ़-डेथ - अन्य सामान्य त्रुटियाँ
- डेटाबेस-कनेक्शन-त्रुटियाँ - डेटाबेस समस्याएँ
- ../../01-आरंभ करना/कॉन्फ़िगरेशन/सिस्टम-सेटिंग्स - XOOPS कॉन्फ़िगरेशन

---

**अंतिम अद्यतन:** 2026-01-31
**इस पर लागू होता है:** XOOPS 2.5.7+
**ओएस:** लिनक्स, विंडोज, मैकओएस